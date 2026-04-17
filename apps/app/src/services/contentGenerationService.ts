/**
 * Content Generation Service
 *
 * Handles the full article generation pipeline for ClickRank:
 *   1. Research (ClickBank trending products)
 *   2. Generate article with Gemini
 *   3. Humanize content
 *   4. Generate images with Replicate
 *   5. Upload to Payload CMS
 *
 * Pattern ported from excelsior-creative-website/src/services/contentGenerationService.ts
 */

import { GoogleGenAI } from '@google/genai'
import type { Payload } from 'payload'
import Replicate from 'replicate'
import { type ClickBankProduct } from './clickbankService'
import { humanizeContent } from './humanizationService'
import { GeneratedArticleSchema } from './schemas'

// ─── API Clients ──────────────────────────────────────────────────────────────

const apiKey = process.env.GOOGLE_GENAI_API_KEY || ''
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type GeneratedArticle = {
  title: string
  slug: string
  excerpt: string
  content: string // Markdown
  metaTitle: string
  metaDescription: string
  keywords: string
  product: ClickBankProduct
}

export type ContentGenerationSettings = {
  companyContext?: string
  topicResearch?: { prompt?: string }
  postGeneration?: { prompt?: string }
  featuredImageStyles?: Array<{ name: string; model?: string; prompt: string }>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  context: string,
  maxRetries = 2,
  delayMs = 2000,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error
      if (attempt < maxRetries) {
        const msg = error instanceof Error ? error.message : String(error)
        console.warn(
          `[${context}] Attempt ${attempt + 1} failed: ${msg}. Retrying in ${delayMs}ms...`,
        )
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }
  throw lastError
}

async function withReplicateRetry<T>(
  fn: () => Promise<T>,
  context: string,
  maxRetries = 5,
  baseDelayMs = 10000,
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error
      const errObj = error as Record<string, unknown>
      const is429 =
        (errObj?.message as string)?.includes('429') ||
        errObj?.status === 429 ||
        (errObj?.response as Record<string, unknown>)?.status === 429

      if (!is429 || attempt >= maxRetries) throw error

      let delayMs = baseDelayMs * Math.pow(2, attempt)
      const retryMatch = (errObj?.message as string)?.match(/retry_after"?:\s*(\d+)/)
      if (retryMatch) delayMs = (parseInt(retryMatch[1]!, 10) + 1) * 1000

      console.log(
        `[${context}] Rate limited (429). Retry ${attempt + 1}/${maxRetries} in ${Math.round(delayMs / 1000)}s...`,
      )
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
  throw lastError
}

function safeParseJSON<T>(text: string): T {
  const cleanText = text.replace(/```json\n?|\n?```/g, '').trim()
  try {
    return JSON.parse(cleanText) as T
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    throw new Error(`Failed to parse AI response as JSON: ${msg}`)
  }
}

// ─── Lexical Builders ─────────────────────────────────────────────────────────

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_CODE = 16

type LexicalTextNode = {
  type: 'text'
  version: number
  text: string
  format: number
  mode: 'normal'
}

type LexicalLinkNode = {
  type: 'link'
  version: number
  url: string
  target: '_blank' | '_self'
  rel: string
  children: LexicalTextNode[]
}

type LexicalInlineNode = LexicalTextNode | LexicalLinkNode

function parseInlineMarkdown(text: string): LexicalInlineNode[] {
  const nodes: LexicalInlineNode[] = []
  const inlinePattern =
    /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index)
      if (plainText) nodes.push({ type: 'text', version: 1, text: plainText, format: 0, mode: 'normal' })
    }

    if (match[2]) {
      nodes.push({ type: 'text', version: 1, text: match[2], format: FORMAT_BOLD | FORMAT_ITALIC, mode: 'normal' })
    } else if (match[3]) {
      nodes.push({ type: 'text', version: 1, text: match[3], format: FORMAT_BOLD, mode: 'normal' })
    } else if (match[4]) {
      nodes.push({ type: 'text', version: 1, text: match[4], format: FORMAT_ITALIC, mode: 'normal' })
    } else if (match[5]) {
      nodes.push({ type: 'text', version: 1, text: match[5], format: FORMAT_CODE, mode: 'normal' })
    } else if (match[6] && match[7]) {
      nodes.push({
        type: 'link', version: 1, url: match[7], target: '_blank', rel: 'noopener noreferrer',
        children: [{ type: 'text', version: 1, text: match[6], format: 0, mode: 'normal' }],
      })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex)
    if (remaining) nodes.push({ type: 'text', version: 1, text: remaining, format: 0, mode: 'normal' })
  }

  if (nodes.length === 0 && text) {
    nodes.push({ type: 'text', version: 1, text, format: 0, mode: 'normal' })
  }

  return nodes
}

function getNumberedListMatch(line: string): { number: number; content: string } | null {
  const match = line.match(/^(\d+)\.\s+(.*)$/)
  return match ? { number: parseInt(match[1]!, 10), content: match[2]! } : null
}

/**
 * Convert markdown to Payload CMS Lexical JSON format.
 */
export function markdownToLexical(markdown: string) {
  const lines = markdown.split('\n')
  const children: Array<{ type: string; version: number; [k: string]: unknown }> = []

  let isInsideCodeBlock = false
  let codeBlockLines: string[] = []
  let currentList: {
    type: string; version: number; listType: 'bullet' | 'number'
    direction: 'ltr'; format: ''; indent: number; start: number; tag: string
    children: unknown[]
  } | null = null

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (isInsideCodeBlock) {
        children.push({
          type: 'code', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0,
          children: [{ type: 'text', version: 1, text: codeBlockLines.join('\n'), format: 0, mode: 'normal' }],
        })
        codeBlockLines = []
        isInsideCodeBlock = false
      } else {
        isInsideCodeBlock = true
      }
      continue
    }

    if (isInsideCodeBlock) { codeBlockLines.push(line); continue }

    const isBulletItem = line.startsWith('- ') || line.startsWith('* ')
    const numberedMatch = getNumberedListMatch(line)
    const isNumberedItem = numberedMatch !== null
    const isListItem = isBulletItem || isNumberedItem

    if (currentList) {
      const currentIsBullet = currentList.listType === 'bullet'
      if (!isListItem || (isBulletItem && !currentIsBullet) || (isNumberedItem && currentIsBullet)) {
        children.push(currentList)
        currentList = null
      }
    }

    if (line.startsWith('### ')) {
      children.push({ type: 'heading', version: 1, tag: 'h3', direction: 'ltr' as const, format: '' as const, indent: 0, children: parseInlineMarkdown(line.replace('### ', '')) })
    } else if (line.startsWith('## ')) {
      children.push({ type: 'heading', version: 1, tag: 'h2', direction: 'ltr' as const, format: '' as const, indent: 0, children: parseInlineMarkdown(line.replace('## ', '')) })
    } else if (line.startsWith('# ')) {
      children.push({ type: 'heading', version: 1, tag: 'h1', direction: 'ltr' as const, format: '' as const, indent: 0, children: parseInlineMarkdown(line.replace('# ', '')) })
    } else if (isBulletItem) {
      if (!currentList) {
        currentList = { type: 'list', version: 1, listType: 'bullet', direction: 'ltr', format: '', indent: 0, start: 1, tag: 'ul', children: [] }
      }
      const content = line.startsWith('- ') ? line.slice(2) : line.slice(2)
      currentList.children.push({ type: 'listitem', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, value: currentList.children.length + 1, children: parseInlineMarkdown(content) })
    } else if (isNumberedItem && numberedMatch) {
      if (!currentList) {
        currentList = { type: 'list', version: 1, listType: 'number', direction: 'ltr', format: '', indent: 0, start: numberedMatch.number, tag: 'ol', children: [] }
      }
      currentList.children.push({ type: 'listitem', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, value: numberedMatch.number, children: parseInlineMarkdown(numberedMatch.content) })
    } else if (line.trim()) {
      children.push({ type: 'paragraph', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0, children: parseInlineMarkdown(line) })
    }
  }

  if (currentList) children.push(currentList)
  if (isInsideCodeBlock && codeBlockLines.length > 0) {
    children.push({ type: 'code', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, children: [{ type: 'text', version: 1, text: codeBlockLines.join('\n'), format: 0, mode: 'normal' }] })
  }

  return { root: { type: 'root', version: 1, children, direction: 'ltr' as const, format: '' as const, indent: 0 } }
}

// ─── Article Generation ───────────────────────────────────────────────────────

/**
 * Generate an affiliate review article for a ClickBank product using Gemini.
 */
export async function generateArticleForProduct(
  product: ClickBankProduct,
  settings?: ContentGenerationSettings,
): Promise<GeneratedArticle> {
  if (!ai) throw new Error('GOOGLE_GENAI_API_KEY is not configured')

  const companyContext = settings?.companyContext || ''
  const customPrompt = settings?.postGeneration?.prompt

  const systemContext = [
    'You are an editorial reviewer for ClickRank, a ClickBank product review site.',
    'Write honest-favorable reviews: lead with genuine strengths, acknowledge one or two real limitations, and never fabricate features, statistics, testimonials, studies, or first-person experience.',
    'Voice: conversational, direct, confident. Use contractions. Avoid em-dashes. Avoid exclamation marks in body copy. Avoid "In today\'s fast-paced world" style openers.',
    'Do NOT claim first-person testing ("I tried it for 30 days") — use analysis-driven phrasing ("In our analysis", "Looking at user feedback") instead.',
    'Do NOT make medical, financial, or income claims. Present vendor claims as vendor claims, not as fact.',
    companyContext ? `Context: ${companyContext}` : '',
    customPrompt ? `Additional instructions: ${customPrompt}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const productContext = `
Product Name: ${product.name}
Vendor: ${product.vendor}
Category: ${product.category}
Gravity Score: ${product.gravity} (higher = more affiliates making sales)
Initial Price: $${product.initialPrice}${product.avgRebill ? ` + $${product.avgRebill}/mo rebill` : ''}
Description: ${product.description}
${product.vendorUrl ? `Product URL: ${product.vendorUrl}` : ''}
`.trim()

  const prompt = `${systemContext}

Write a ~1500 word SEO review article about this ClickBank product:

${productContext}

Return ONLY valid JSON (no markdown fences) with this exact structure:
{
  "title": "SEO-optimized article title, 60-70 chars, sentence case",
  "slug": "kebab-case-slug-from-title",
  "excerpt": "Compelling excerpt under 160 characters",
  "content": "Full article in Markdown format with ## for H2 and ### for H3",
  "metaTitle": "SEO title tag (max 60 chars)",
  "metaDescription": "Meta description (max 160 chars)",
  "keywords": "comma, separated, relevant, keywords"
}

The article MUST open with this exact section (verbatim heading, paragraph can rephrase but must include the disclosure):

## Affiliate disclosure
ClickRank earns a commission when readers buy through links on this page. Our reviews stay independent — compensation never determines what we cover or how we rate a product.

Then include these sections (in this order, but feel free to rename them if a specific product has a more natural shape):
## What ${product.name} actually is
## Who it's for
## What you get
## What's good about it
## What could be better
## Pricing and what it includes
## Bottom line

Rules:
- For "What's good about it": 3-5 real, specific strengths. No empty superlatives.
- For "What could be better": 1-2 honest, fair caveats. Constructive tone. NEVER skip this section.
- Do not fabricate user quotes, testimonials, ratings, or studies. If you don't have a verifiable source, don't assert the claim.
- End with a clear call-to-action linking to the product page. Use the affiliate link if provided: ${product.affiliateUrl || '(no affiliate URL provided — write the CTA without a hard link)'}
- Title and headings in sentence case, not Title Case.`

  const rawArticle = await withRetry(async () => {
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        maxOutputTokens: 8000,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: GeneratedArticleSchema,
      },
    })
    const text = response.text || ''
    return safeParseJSON<Omit<GeneratedArticle, 'product'>>(text)
  }, 'generateArticleForProduct')

  // Humanize content
  const humanizedContent = humanizeContent(rawArticle.content, 'moderate')
  const humanizedExcerpt = humanizeContent(rawArticle.excerpt, 'moderate')

  return {
    ...rawArticle,
    content: humanizedContent,
    excerpt: humanizedExcerpt,
    product,
  }
}

// ─── Tag Suggestions ──────────────────────────────────────────────────────────

/**
 * Suggest relevant tags for an article based on its content using Gemini.
 */
export async function suggestArticleTags(
  article: { title: string; excerpt: string },
  availableTags: Array<{ id: number; name: string }>,
): Promise<number[]> {
  if (!ai || availableTags.length === 0) return []

  const tagsList = availableTags.map((t) => `${t.name} (id: ${t.id})`).join(', ')
  const prompt = `Based on this article, select 2-5 most relevant tag IDs from the list.
ARTICLE TITLE: ${article.title}
ARTICLE EXCERPT: ${article.excerpt}
AVAILABLE TAGS: ${tagsList}
Return ONLY a comma-separated list of tag IDs. Example: 1, 5, 12`

  try {
    const result = await ai.models.generateContent({
      model: 'models/gemini-2.0-flash',
      contents: prompt,
      config: { maxOutputTokens: 100, temperature: 0.3 },
    })
    const text = result.text || ''
    return text
      .trim()
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id))
  } catch (err) {
    console.error('[suggestArticleTags] Error:', err)
    return []
  }
}

// ─── Image Generation ─────────────────────────────────────────────────────────

/**
 * Generate a featured image for the article using Replicate.
 */
export async function generateFeaturedImage(
  article: Pick<GeneratedArticle, 'title' | 'excerpt'>,
  settings?: ContentGenerationSettings,
): Promise<string> {
  const styles = settings?.featuredImageStyles ?? [
    {
      name: 'illustration',
      model: 'google/nano-banana-pro',
      prompt: `Create a professional blog featured image for an article titled: "{{title}}".
Article summary: {{excerpt}}
Style: Modern editorial illustration with a health/wealth/lifestyle aesthetic.
Use bold colors with deep blue and orange accents. Abstract or conceptual representation. No text overlays.`,
    },
  ]

  const style = styles[Math.floor(Math.random() * styles.length)]!
  const model = style.model || 'google/nano-banana-pro'

  const imagePrompt = style.prompt
    .replace('{{title}}', article.title)
    .replace('{{excerpt}}', article.excerpt)

  console.log(`[generateFeaturedImage] Generating for: ${article.title}`)

  const prediction = await withReplicateRetry(
    () =>
      replicate.predictions.create({
        model: model as `${string}/${string}`,
        input: {
          prompt: imagePrompt,
          resolution: '2K',
          image_input: [],
          aspect_ratio: '16:9',
          output_format: 'png',
          safety_filter_level: 'block_only_high',
        },
      }),
    'generateFeaturedImage',
  )

  let finalPrediction = await replicate.predictions.get(prediction.id)
  while (finalPrediction.status === 'starting' || finalPrediction.status === 'processing') {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    finalPrediction = await replicate.predictions.get(prediction.id)
  }

  if (finalPrediction.status !== 'succeeded') {
    throw new Error(`Image generation failed: ${finalPrediction.error ?? 'Unknown error'}`)
  }

  const output = finalPrediction.output
  const imageUrl =
    typeof output === 'object' && output !== null && 'url' in output
      ? (output as { url: () => string }).url()
      : Array.isArray(output)
        ? (output as string[])[0]!
        : String(output)

  console.log(`[generateFeaturedImage] Done: ${imageUrl}`)
  return imageUrl
}

/**
 * Download an image from a URL and return as Buffer.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`)
  return Buffer.from(await response.arrayBuffer())
}

/**
 * Generate a random publish time for today between 8 AM and 8 PM.
 */
export function getRandomPublishTime(): Date {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const randomHour = Math.floor(Math.random() * 12) + 8
  const randomMinute = Math.floor(Math.random() * 60)
  today.setHours(randomHour, randomMinute, 0, 0)
  if (today < now) today.setDate(today.getDate() + 1)
  return today
}

// ─── Settings Loader ──────────────────────────────────────────────────────────

/**
 * Fetch content generation settings from Payload CMS.
 */
export async function getGenerationSettings(
  payload: Payload,
): Promise<ContentGenerationSettings> {
  try {
    const settings = await payload.findGlobal({ slug: 'content-generation-settings' as never })
    const s = settings as Record<string, unknown>
    let companyContext = ''
    if (s?.companyContext) {
      const ctx = s.companyContext as { companyName?: string; expertise?: string }
      companyContext = [ctx.companyName, ctx.expertise].filter(Boolean).join(' — ')
    }
    return {
      companyContext,
      postGeneration: s?.postGeneration as ContentGenerationSettings['postGeneration'],
      featuredImageStyles:
        s?.featuredImageStyles as ContentGenerationSettings['featuredImageStyles'],
    }
  } catch (err) {
    console.warn('[getGenerationSettings] Failed to load CMS settings:', err)
    return {}
  }
}
