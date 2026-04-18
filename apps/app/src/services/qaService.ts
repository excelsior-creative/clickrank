import type { GeneratedArticle } from './contentGenerationService'

export type QAReport = {
  passed: boolean
  wordCount: number
  warnings: string[]
  errors: string[]
}

const DISCLOSURE_HEADING_PATTERN = /^##\s+affiliate disclosure/im

const FABRICATION_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bI tried\b/i, label: 'first-person "I tried"' },
  { pattern: /\bI tested\b/i, label: 'first-person "I tested"' },
  { pattern: /\bwhen I used\b/i, label: 'first-person "when I used"' },
  { pattern: /\bafter\s+\d+\s+(days|weeks|months)\s+of\s+(use|using|testing)\b/i, label: 'fabricated duration claim' },
  { pattern: /\bclinical trial\b/i, label: '"clinical trial"' },
  { pattern: /\bpublished study\b/i, label: '"published study"' },
  { pattern: /\bpeer[- ]reviewed\b/i, label: '"peer-reviewed"' },
  { pattern: /\b(cure|cures|cured)\b/i, label: 'medical claim ("cure")' },
  { pattern: /\bguaranteed\s+(results|income|returns|weight loss)\b/i, label: 'guaranteed outcome claim' },
]

const MIN_WORDS = 800
const SOFT_MAX_WORDS = 3000

export function qaReview(article: GeneratedArticle): QAReport {
  const warnings: string[] = []
  const errors: string[] = []

  if (!DISCLOSURE_HEADING_PATTERN.test(article.content)) {
    errors.push('Missing "## Affiliate disclosure" section in body')
  }

  if (!/\[[^\]]+\]\([^)]+\)/.test(article.content) && !article.content.includes('/go/')) {
    warnings.push('No markdown links detected in body — CTA may be missing')
  }

  const wordCount = article.content.trim().split(/\s+/).filter(Boolean).length
  if (wordCount < MIN_WORDS) errors.push(`Word count below floor: ${wordCount} < ${MIN_WORDS}`)
  if (wordCount > SOFT_MAX_WORDS) warnings.push(`Word count above soft ceiling: ${wordCount} > ${SOFT_MAX_WORDS}`)

  for (const { pattern, label } of FABRICATION_PATTERNS) {
    const match = article.content.match(pattern)
    if (match) warnings.push(`Possible fabrication (${label}): "${match[0]}"`)
  }

  return {
    passed: errors.length === 0,
    wordCount,
    warnings,
    errors,
  }
}
