/**
 * Editorial QA Service
 *
 * The pipeline's first safety gate. Runs after Gemini returns a generated
 * article and before it's persisted to Payload. Produces a deterministic
 * pass/fail decision plus a structured list of issues so we can see WHY
 * a draft was rejected.
 *
 * Design principles:
 *   - Conservative: when in doubt, flag. It's cheaper to skip a borderline
 *     draft than to let a fabrication or missing disclosure slip through.
 *   - Stateless: no AI, no network calls. Pure functions over the article.
 *   - Observable: every check emits a structured issue with a stable code.
 *
 * Any change to these checks is a change to a load-bearing safety gate
 * and goes through PR per the CEO mandate.
 */

import type { ClickBankProduct } from './clickbankService'
import type { GeneratedArticle } from './contentGenerationService'

export type QASeverity = 'error' | 'warning'

export type QAIssue = {
  severity: QASeverity
  code: string
  message: string
}

export type QAStats = {
  wordCount: number
  headingCount: number
  linkCount: number
  titleLength: number
  metaDescriptionLength: number
}

export type QAResult = {
  passed: boolean
  issues: QAIssue[]
  warnings: QAIssue[]
  stats: QAStats
}

// Hard bounds
const MIN_WORDS = 700
const MAX_WORDS = 3500
const MAX_TITLE_LENGTH = 80
const MAX_META_DESCRIPTION_LENGTH = 170
const MIN_HEADING_COUNT = 4

// Known fabrication tells — first-person testing language the editorial
// standard explicitly forbids.
const FABRICATION_PATTERNS: Array<{ code: string; pattern: RegExp; message: string }> = [
  {
    code: 'fabrication.firstPersonTestingDays',
    pattern: /\bI (tried|tested|used) (it|this|the program) for \d+\s*(days?|weeks?|months?)/i,
    message: 'First-person testing claim ("I tried it for N days"). Editorial standard forbids fabricated experience.',
  },
  {
    code: 'fabrication.firstPersonWeightLoss',
    pattern: /\bI (lost|dropped|shed) \d+\s*(lbs?|pounds?|kilos?|kg)/i,
    message: 'First-person weight-loss claim. Not verifiable; editorial standard forbids fabricated results.',
  },
  {
    code: 'fabrication.afterNWeeksOfTesting',
    pattern: /\bafter \d+\s*(days?|weeks?|months?) of (testing|using|trying)/i,
    message: 'Claim of testing duration implies firsthand experience we do not have.',
  },
  {
    code: 'fabrication.fakeReviewerCount',
    pattern: /\bover \d{3,}\s*(customers?|users?|buyers?) (reported|said|experienced)/i,
    message: 'Specific reviewer count without a source. Likely fabricated.',
  },
  {
    code: 'fabrication.specificTrialStat',
    pattern: /\b\d{1,2}\.\d%\s*of\s*(users|customers|people|participants)/i,
    message: 'Oddly specific percentage statistic without a source. High fabrication risk.',
  },
]

// Forbidden claim patterns — things our editorial standard and FTC rules
// flatly prohibit, especially around supplements and income products.
const FORBIDDEN_CLAIM_PATTERNS: Array<{ code: string; pattern: RegExp; message: string; severity: QASeverity }> = [
  {
    code: 'claim.guaranteedIncome',
    pattern: /\bguaranteed\s+(income|wealth|earnings|profits|returns|results)/i,
    message: 'Guaranteed income/results claim is prohibited.',
    severity: 'error',
  },
  {
    code: 'claim.fdaApproved',
    pattern: /\b(fda[- ]approved|approved by the fda)/i,
    message: 'Do not claim FDA approval; ClickBank supplements are not FDA-approved.',
    severity: 'error',
  },
  {
    code: 'claim.clinicallyProven',
    pattern: /\bclinically proven\b/i,
    message: '"Clinically proven" requires a cited study; default to attributing the claim to the vendor.',
    severity: 'warning',
  },
  {
    code: 'claim.scientificallyProven',
    pattern: /\bscientifically proven\b/i,
    message: '"Scientifically proven" requires a cited study; attribute to vendor instead.',
    severity: 'warning',
  },
  {
    code: 'claim.miracleCure',
    pattern: /\b(miracle cure|cures? (cancer|diabetes|alzheimer|arthritis))/i,
    message: 'Medical cure claim is prohibited.',
    severity: 'error',
  },
  {
    code: 'claim.loseWeightGuarantee',
    pattern: /\bguaranteed to lose\b|\bguaranteed weight loss\b/i,
    message: 'Guaranteed weight-loss claim is prohibited.',
    severity: 'error',
  },
]

/**
 * Count words in markdown content, excluding fenced code blocks and
 * inline code. Close enough for editorial sizing.
 */
function countWords(markdown: string): number {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
  const words = withoutCode.trim().split(/\s+/).filter(Boolean)
  return words.length
}

function countHeadings(markdown: string): number {
  return (markdown.match(/^#{1,6}\s+\S/gm) || []).length
}

function countLinks(markdown: string): number {
  return (markdown.match(/\[[^\]]+\]\([^)]+\)/g) || []).length
}

function hasDisclosureSection(markdown: string): boolean {
  const lower = markdown.toLowerCase()
  const hasHeading = /^#{2,3}\s+affiliate\s+disclosure\b/im.test(markdown)
  const mentionsCommission = /\b(commission|compensation|earn(s|ed)?|affiliate\s+link)/i.test(lower)
  return hasHeading && mentionsCommission
}

function hasAffiliateOrVendorLink(markdown: string, product: ClickBankProduct): boolean {
  if (product.affiliateUrl && markdown.includes(product.affiliateUrl)) return true
  if (product.vendorUrl && markdown.includes(product.vendorUrl)) return true
  // Relative click-tracking path — the generation prompt instructs the model
  // to emit /go/[productSlug] for every CTA, and the cron post-processor
  // rewrites any leaked raw hoplinks to /go/[postSlug]. Either form counts.
  if (/\]\(\/go\/[a-z0-9][a-z0-9-]*\)/i.test(markdown)) return true
  // fallback: any external-looking link at all
  return /\]\(https?:\/\/[^)]+\)/.test(markdown)
}

function hasCaveatSection(markdown: string): boolean {
  // "What could be better", "drawbacks", "limitations", "cons" — any of these
  return /^#{2,3}\s+(what could be better|drawbacks?|limitations?|cons|downsides?|what's not great|where it falls short)/im.test(markdown)
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)
}

/**
 * Run editorial QA against a generated article.
 *
 * Errors block publishing. Warnings are logged but allow publishing.
 */
export function runQA(article: GeneratedArticle, product: ClickBankProduct): QAResult {
  const issues: QAIssue[] = []
  const warnings: QAIssue[] = []

  const content = article.content || ''
  const wordCount = countWords(content)
  const headingCount = countHeadings(content)
  const linkCount = countLinks(content)
  const titleLength = (article.title || '').length
  const metaDescriptionLength = (article.metaDescription || '').length

  const stats: QAStats = {
    wordCount,
    headingCount,
    linkCount,
    titleLength,
    metaDescriptionLength,
  }

  // ─── Required fields ────────────────────────────────────────────────────────
  if (!article.title?.trim()) {
    issues.push({ severity: 'error', code: 'missing.title', message: 'Title is empty.' })
  }
  if (!article.slug?.trim()) {
    issues.push({ severity: 'error', code: 'missing.slug', message: 'Slug is empty.' })
  } else if (!isValidSlug(article.slug)) {
    issues.push({
      severity: 'error',
      code: 'invalid.slug',
      message: `Slug "${article.slug}" is not valid kebab-case.`,
    })
  }
  if (!article.excerpt?.trim()) {
    issues.push({ severity: 'error', code: 'missing.excerpt', message: 'Excerpt is empty.' })
  }
  if (!content.trim()) {
    issues.push({ severity: 'error', code: 'missing.content', message: 'Content is empty.' })
  }

  // ─── Disclosure (compliance-critical) ───────────────────────────────────────
  if (content && !hasDisclosureSection(content)) {
    issues.push({
      severity: 'error',
      code: 'compliance.missingDisclosure',
      message: 'No affiliate disclosure section detected in body. FTC disclosure is required.',
    })
  }

  // ─── Affiliate link ─────────────────────────────────────────────────────────
  if (content && !hasAffiliateOrVendorLink(content, product)) {
    warnings.push({
      severity: 'warning',
      code: 'monetization.missingAffiliateLink',
      message: 'No affiliate or vendor link detected in body.',
    })
  }

  // ─── Honest-favorable: caveats section must exist ──────────────────────────
  if (content && !hasCaveatSection(content)) {
    warnings.push({
      severity: 'warning',
      code: 'editorial.missingCaveats',
      message: 'No "what could be better" / caveats section detected. Honest-favorable standard expects one.',
    })
  }

  // ─── Length ────────────────────────────────────────────────────────────────
  if (content && wordCount < MIN_WORDS) {
    issues.push({
      severity: 'error',
      code: 'length.tooShort',
      message: `Content is ${wordCount} words; minimum is ${MIN_WORDS}.`,
    })
  }
  if (wordCount > MAX_WORDS) {
    warnings.push({
      severity: 'warning',
      code: 'length.tooLong',
      message: `Content is ${wordCount} words; over soft cap of ${MAX_WORDS}.`,
    })
  }
  if (headingCount < MIN_HEADING_COUNT) {
    warnings.push({
      severity: 'warning',
      code: 'structure.fewHeadings',
      message: `Only ${headingCount} headings found; expected ${MIN_HEADING_COUNT}+.`,
    })
  }

  if (titleLength > MAX_TITLE_LENGTH) {
    warnings.push({
      severity: 'warning',
      code: 'seo.titleTooLong',
      message: `Title is ${titleLength} chars (>${MAX_TITLE_LENGTH}); will be truncated in SERPs.`,
    })
  }
  if (metaDescriptionLength > MAX_META_DESCRIPTION_LENGTH) {
    warnings.push({
      severity: 'warning',
      code: 'seo.metaDescriptionTooLong',
      message: `Meta description is ${metaDescriptionLength} chars (>${MAX_META_DESCRIPTION_LENGTH}).`,
    })
  }

  // ─── Fabrication tells ──────────────────────────────────────────────────────
  for (const { code, pattern, message } of FABRICATION_PATTERNS) {
    if (pattern.test(content)) {
      issues.push({ severity: 'error', code, message })
    }
  }

  // ─── Forbidden claims ───────────────────────────────────────────────────────
  for (const { code, pattern, message, severity } of FORBIDDEN_CLAIM_PATTERNS) {
    if (pattern.test(content)) {
      const bucket = severity === 'error' ? issues : warnings
      bucket.push({ severity, code, message })
    }
  }

  // ─── Editorial voice: em-dashes should have been stripped by humanizer ──────
  const emDashCount = (content.match(/—/g) || []).length
  if (emDashCount > 0) {
    warnings.push({
      severity: 'warning',
      code: 'voice.emDash',
      message: `${emDashCount} em-dash(es) still in content after humanization.`,
    })
  }

  return {
    passed: issues.length === 0,
    issues,
    warnings,
    stats,
  }
}

/**
 * Format a QA result as a single-line log summary — useful in cron logs
 * where grep-ability matters more than prose.
 */
export function summarizeQA(result: QAResult): string {
  const verdict = result.passed ? 'PASS' : 'FAIL'
  const parts = [
    verdict,
    `words=${result.stats.wordCount}`,
    `headings=${result.stats.headingCount}`,
    `links=${result.stats.linkCount}`,
    `errors=${result.issues.length}`,
    `warnings=${result.warnings.length}`,
  ]
  return parts.join(' ')
}
