#!/usr/bin/env tsx
/**
 * editorial-lint — source-side fabrication tripwire.
 *
 * Scans source files for known-bad copy patterns that have shipped to
 * production at least once. Complement to the pipeline qaService (which
 * checks pipeline-generated content); this catches hardcoded fabrications
 * in components, pages, and scripts. Hits exit non-zero so CI blocks merge.
 *
 * Usage (from repo root):
 *   pnpm --filter app editorial-lint
 *
 * Suppressing matches (escape hatch):
 *   - Same line, or up to 2 lines above the match:
 *       // editorial-lint: allow <code> [<code> ...]   -- reason
 *   - Anywhere in the file (covers multi-line JSX strings):
 *       // editorial-lint: allow-file <code> [<code> ...]   -- reason
 *
 * Every escape must include a reason after `--` so PR review can verify
 * it's a deliberate, qualified statement (e.g. an explicit denial) rather
 * than a fabrication slipping through.
 *
 * Owned editorially by /ceo/editorial.md and DR-0004. Add new patterns
 * here as they're caught.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Resolve the app root (parent of /scripts) regardless of cwd.
const APP_ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))

const SCAN_ROOTS = ['src', 'scripts']
const SCAN_EXTS = new Set(['.ts', '.tsx', '.md', '.mdx'])
const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'migrations', // generated SQL
])
// Files allowed to mention banned substrings without an inline marker —
// these are the lint's own infrastructure (the QA service that documents
// the same patterns in regex form, plus this script itself).
const SKIP_FILES = new Set<string>([
  'src/services/qaService.ts',
  'scripts/editorial-lint.ts',
])

type Pattern = {
  code: string
  pattern: RegExp
  message: string
}

const PATTERNS: Pattern[] = [
  // ── Invented stats ────────────────────────────────────────────────────────
  {
    code: 'fab.500plusReviews',
    pattern: /\b500\+\s*(products?\s+(reviewed|reviews?)|reviews?)\b/i,
    message: 'Invented "500+ products reviewed" / "500+ reviews" stat.',
  },
  {
    code: 'fab.50KReaders',
    pattern: /\b(50K\+|50,?000\+)\s*(monthly\s+)?readers?\b/i,
    message: 'Invented "50K+ readers" stat.',
  },
  {
    code: 'fab.100Categories',
    pattern: /\b100\+\s*categor(ies|y)\b/i,
    message: 'Invented "100+ categories" stat.',
  },
  {
    code: 'fab.49Trust',
    pattern: /\b4\.9\s*\/\s*5\b/,
    message: 'Invented "4.9/5" trust score.',
  },
  {
    code: 'fab.trustScore',
    pattern: /\breader\s+trust\s+score\b/i,
    message: 'Fabricated "reader trust score" claim.',
  },
  // ── Hands-on / first-person testing fabrications ──────────────────────────
  {
    code: 'fab.handsOn',
    pattern: /\bhands[-\s]?on\b/i,
    message: '"Hands-on" implies first-hand product testing we do not do.',
  },
  {
    code: 'fab.weTested',
    pattern: /\b(we|i)\s+(tested|tried|used)\s+(it|this|the\s+(product|program|course|app|offer))\b/i,
    message: 'First-person testing claim. Editorial standard forbids fabricated experience.',
  },
  {
    code: 'fab.inOurTesting',
    pattern: /\bin\s+our\s+test(ing|s)?\b/i,
    message: 'Fabricated "in our testing" first-person claim.',
  },
  {
    code: 'fab.teamOf',
    pattern: /\bteam\s+of\s+(experts|editors|reviewers)\b/i,
    message: 'Fabricated "team of editors / experts / reviewers" claim.',
  },
  {
    code: 'fab.namedEditor',
    pattern: /\b(named|second)\s+editors?\b/i,
    message: 'Fabricated "named editor" / "second editor" claim.',
  },
  {
    code: 'fab.90DayCycle',
    pattern: /\b90[-\s]?day\s+cycle\b/i,
    message: 'Fabricated "90-day cycle" review claim.',
  },
  {
    code: 'fab.communityOfReaders',
    pattern: /\b(community|thousands?)\s+of\s+readers\b/i,
    message: 'Fabricated reader-count / community claim.',
  },
  {
    code: 'fab.todaysWorld',
    pattern: /\bin\s+today'?s\s+world\b/i,
    message: 'Cliché AI / template intro.',
  },
  // ── Hash-of-slug score smoking gun (the PR #4 regression) ─────────────────
  {
    code: 'fab.hashScore',
    pattern: /(hash[A-Za-z0-9_]*\s*\([^)]*\bslug\b[^)]*\)|Math\.abs\([^)]*hash[^)]*\)\s*%\s*\d{2,})/,
    message: 'Hash-of-slug score computation. Render only real ratings, or none.',
  },
]

type Hit = {
  file: string
  line: number
  col: number
  code: string
  message: string
  excerpt: string
}

const ALLOW_LINE_RE = /editorial-lint:\s*allow\s+([A-Za-z0-9_.\s,]+?)(?:\s*--|$)/i
const ALLOW_FILE_RE = /editorial-lint:\s*allow-file\s+([A-Za-z0-9_.\s,]+?)(?:\s*--|$)/i

function parseAllowedCodes(line: string, re: RegExp): Set<string> | null {
  const m = line.match(re)
  if (!m) return null
  const codes = m[1]
    .split(/[\s,]+/)
    .map((c) => c.trim())
    .filter(Boolean)
  return new Set(codes)
}

function fileAllowedCodes(content: string): Set<string> {
  const allowed = new Set<string>()
  for (const line of content.split('\n')) {
    const codes = parseAllowedCodes(line, ALLOW_FILE_RE)
    if (codes) for (const c of codes) allowed.add(c)
  }
  return allowed
}

function lineAllowedCodes(lines: string[], lineIdx: number): Set<string> {
  const allowed = new Set<string>()
  // Same line plus up to 2 lines above.
  for (let i = Math.max(0, lineIdx - 2); i <= lineIdx; i++) {
    const codes = parseAllowedCodes(lines[i] || '', ALLOW_LINE_RE)
    if (codes) for (const c of codes) allowed.add(c)
  }
  return allowed
}

function shouldScanPath(absPath: string): boolean {
  const ext = extname(absPath)
  if (!SCAN_EXTS.has(ext)) return false
  const rel = relative(APP_ROOT, absPath)
  if (SKIP_FILES.has(rel)) return false
  return true
}

function* walk(dir: string): Generator<string> {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (SKIP_DIR_NAMES.has(entry.name)) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
    } else if (entry.isFile()) {
      yield full
    }
  }
}

function scanFile(absPath: string): Hit[] {
  const content = readFileSync(absPath, 'utf8')
  const fileAllowed = fileAllowedCodes(content)
  const lines = content.split('\n')
  const hits: Hit[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    for (const { code, pattern, message } of PATTERNS) {
      if (fileAllowed.has(code)) continue
      const m = line.match(pattern)
      if (!m) continue
      const lineAllowed = lineAllowedCodes(lines, i)
      if (lineAllowed.has(code)) continue
      hits.push({
        file: relative(APP_ROOT, absPath),
        line: i + 1,
        col: (m.index ?? 0) + 1,
        code,
        message,
        excerpt: line.trim().slice(0, 160),
      })
    }
  }
  return hits
}

function main(): number {
  const allHits: Hit[] = []
  let scanned = 0
  for (const root of SCAN_ROOTS) {
    const absRoot = join(APP_ROOT, root)
    try {
      statSync(absRoot)
    } catch {
      continue
    }
    for (const file of walk(absRoot)) {
      if (!shouldScanPath(file)) continue
      scanned++
      allHits.push(...scanFile(file))
    }
  }

  if (allHits.length === 0) {
    console.log(`editorial-lint: PASS (${scanned} files scanned, ${PATTERNS.length} patterns)`)
    return 0
  }

  console.error(`editorial-lint: FAIL — ${allHits.length} hit(s) in ${scanned} files\n`)
  for (const hit of allHits) {
    console.error(`${hit.file}:${hit.line}:${hit.col}  [${hit.code}]  ${hit.message}`)
    console.error(`    ${hit.excerpt}`)
  }
  console.error(
    '\nTo suppress a deliberate, qualified use (e.g. an explicit denial), add\n' +
      '  // editorial-lint: allow <code> -- <reason>          (same line or up to 2 above)\n' +
      '  // editorial-lint: allow-file <code> -- <reason>     (anywhere in file)\n' +
      'to the source. Pattern definitions live in apps/app/scripts/editorial-lint.ts;\n' +
      'editorial policy lives in /ceo/editorial.md and /ceo/decisions/0004-editorial-lint-gate.md.',
  )
  return 1
}

const exitCode = main()
process.exit(exitCode)
