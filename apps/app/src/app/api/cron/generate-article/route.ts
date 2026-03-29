import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { seoKeywords, KeywordEntry } from '@/config/seo-keywords'

// ─── Lexical Node Builders ────────────────────────────────────────────────────

type LexicalNode = {
  [k: string]: unknown
  type: string
  version: number
}

function buildTextNode(text: string, format: number = 0): LexicalNode {
  return {
    type: 'text',
    text,
    format,
    mode: 'normal',
    style: '',
    detail: 0,
    version: 1,
  }
}

function buildParagraph(text: string): LexicalNode {
  return {
    type: 'paragraph',
    children: [buildTextNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    textFormat: 0,
    textStyle: '',
  }
}

function buildHeading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'): LexicalNode {
  return {
    type: 'heading',
    tag,
    children: [buildTextNode(text)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
}

function buildLexicalRoot(nodes: LexicalNode[]) {
  return {
    root: {
      type: 'root',
      children: nodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// ─── OpenAI Article Generator ─────────────────────────────────────────────────

interface GeneratedArticle {
  title: string
  slug: string
  excerpt: string
  sections: Array<{ heading?: string; content: string }>
}

async function generateArticleWithOpenAI(
  keyword: string,
  companyContext: string,
  customPrompt?: string,
): Promise<GeneratedArticle> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const systemPrompt = `You are an expert affiliate marketer writing SEO-optimized product review articles for a ClickBank review site. 
Write in a conversational, trustworthy tone. 
${companyContext ? `Context: ${companyContext}` : ''}
${customPrompt ? `Additional instructions: ${customPrompt}` : ''}`

  const userPrompt = `Write a ~1500 word SEO product review article about a ClickBank product related to: "${keyword}"

Return ONLY a valid JSON object (no markdown fences) with this exact structure:
{
  "title": "SEO-optimized article title (60-70 chars)",
  "slug": "kebab-case-slug-from-title",
  "excerpt": "Compelling excerpt under 150 characters",
  "sections": [
    { "content": "Opening paragraph that hooks the reader and introduces the topic/product" },
    { "heading": "What Is [Product Name]?", "content": "Overview of the product and what it does" },
    { "heading": "Key Features & Benefits", "content": "Detailed breakdown of main features" },
    { "heading": "Pros and Cons", "content": "Honest pros and cons list as flowing text" },
    { "heading": "Who Is This For?", "content": "Target audience description" },
    { "heading": "How Does It Work?", "content": "Step-by-step explanation of how the product works" },
    { "heading": "Real Results: What Users Are Saying", "content": "Testimonial-style social proof section" },
    { "heading": "Pricing and Value", "content": "Pricing info and value comparison" },
    { "heading": "Our Verdict", "content": "Final recommendation and rating summary" },
    { "content": "Strong CTA paragraph encouraging readers to click through and learn more, with urgency" }
  ]
}`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`)
  }

  const data = await response.json()
  const rawContent = data.choices?.[0]?.message?.content

  if (!rawContent) {
    throw new Error('No content returned from OpenAI')
  }

  // Strip markdown fences if present
  const cleaned = rawContent.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()

  try {
    const parsed = JSON.parse(cleaned) as GeneratedArticle
    return parsed
  } catch {
    throw new Error(`Failed to parse OpenAI response as JSON: ${cleaned.slice(0, 200)}`)
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function articleToLexical(article: GeneratedArticle) {
  const nodes: LexicalNode[] = []

  for (const section of article.sections) {
    if (section.heading) {
      nodes.push(buildHeading(section.heading, 'h2'))
    }
    // Split content into paragraphs on double newline
    const paragraphs = section.content.split(/\n\n+/).filter(Boolean)
    for (const para of paragraphs) {
      nodes.push(buildParagraph(para.trim()))
    }
  }

  return buildLexicalRoot(nodes)
}

function pickUnusedKeyword(
  allKeywords: string[],
  recentSlugs: string[],
): string {
  // Filter out keywords that appear in recent post slugs
  const unused = allKeywords.filter(
    (kw) => !recentSlugs.some((slug) => slug.includes(kw.toLowerCase().replace(/\s+/g, '-'))),
  )
  const pool = unused.length > 0 ? unused : allKeywords
  return pool[Math.floor(Math.random() * pool.length)]!
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // 1. Auth
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Check OpenAI key early — graceful error, don't crash
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY is not configured. Add it as a Vercel environment variable.' },
      { status: 500 },
    )
  }

  try {
    // 3. Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // 4. Read CMS content generation settings
    let cmsKeywords: string[] = []
    let companyContext = ''
    let postGenPrompt: string | undefined

    try {
      const settings = await payload.findGlobal({ slug: 'content-generation-settings' })
      if (settings?.keywords && Array.isArray(settings.keywords)) {
        cmsKeywords = settings.keywords
          .map((k: { keyword?: string }) => k.keyword)
          .filter((k): k is string => Boolean(k))
      }
      if (settings?.companyContext) {
        const ctx = settings.companyContext as {
          companyName?: string
          expertise?: string
        }
        companyContext = [ctx.companyName, ctx.expertise].filter(Boolean).join(' — ')
      }
      if (settings?.postGeneration) {
        const pg = settings.postGeneration as { prompt?: string }
        postGenPrompt = pg.prompt
      }
    } catch (err) {
      console.warn('Could not load content-generation-settings, using defaults:', err)
    }

    // 5. Merge CMS keywords with static seo-keywords.ts
    const staticKeywords = seoKeywords.map((k: KeywordEntry) => k.keyword)
    const allKeywords = [...new Set([...cmsKeywords, ...staticKeywords])]

    // 6. Fetch recent post slugs to avoid repeating topics
    const recentPosts = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedDate',
      select: { slug: true },
    })
    const recentSlugs = recentPosts.docs.map((p: { slug?: string }) => p.slug ?? '')

    // 7. Pick keyword
    const keyword = pickUnusedKeyword(allKeywords, recentSlugs)
    console.log(`[generate-article] Selected keyword: "${keyword}"`)

    // 8. Generate article via OpenAI
    const article = await generateArticleWithOpenAI(keyword, companyContext, postGenPrompt)
    console.log(`[generate-article] Generated article: "${article.title}"`)

    // 9. Convert to Lexical JSON
    const content = articleToLexical(article)

    // 10. Create post in Payload (draft)
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: article.title,
        slug: article.slug,
        content,
        excerpt: article.excerpt,
        author: 1,
        _status: 'draft',
        publishedDate: new Date().toISOString(),
      },
    })

    console.log(`[generate-article] Created post ID ${post.id}: "${post.title}"`)

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        keyword,
      },
    })
  } catch (err) {
    console.error('[generate-article] Error:', err)
    return NextResponse.json(
      {
        error: 'Article generation failed',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}
