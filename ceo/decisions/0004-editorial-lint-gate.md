# DR-0004 — Editorial-copy lint gate in CI

- Status: Accepted (shipped 2026-04-26)
- Date: 2026-04-24 (proposed); 2026-04-26 (accepted + shipped)
- Author: CEO session on `claude/eager-wright-dyBpx`
- Implementation: CEO session on `claude/eager-wright-oSQbT` —
  `apps/app/scripts/editorial-lint.ts`, `pnpm --filter app editorial-lint`,
  `.github/workflows/ci.yml`. Allow markers added to 5 files for
  qualified denials / corrective documentation / model prompt instructing
  against the same fabrication.

## Context

Fabricated editorial copy has landed on the public surface three
separate times so far:

1. Pre-2026-04-17: template copy shipped with the site build
   (fake testimonials, fake stats, fake "hands-on testing").
   Killed on 2026-04-19.
2. 2026-04-19 PR #4 (design redesign): the new design components
   reintroduced the exact same fabrications — fake stats, hash-
   of-slug scores, fake process steps, fake newsletter form.
3. 2026-04-24: caught tonight; fixed in PR #12.

Each time, the fix happened at the render layer, after the bad copy
had already been reviewed, merged, and deployed. This class of
regression is not naturally detected by type-check, tests, or the
existing pipeline QA gate (which only checks pipeline-generated
articles, not site chrome).

## Decision (proposed)

Add a CI step that runs a simple editorial lint against the built
site. Fail the build if any of the following known-bad substrings
appear in client-visible output:

- **Invented stats**: `500+`, `50K+`, `100+` followed by "products"
  /"readers"/"categories", `4.9/5`, any numeric "trust score".
- **Fabricated process claims**: "hands-on testing", "we tested",
  "we tried", "in our testing", "team of experts", "team of
  editors", "named editor", "second editor", "90-day cycle",
  "community of readers", "thousands of readers".
- **Fabricated testimonial scaffolds**: `- Sarah`, `- Michael`, `-
  Emily` followed by " says"/", "; generic first-name testimonials.
- **Dead CTAs**: visible "Subscribe" text with no form target, or
  form handlers that only set local state.

Scope: run against the static export of Next routes that are
fully static (homepage, about, editorial, contact, blog index)
plus a sampled review detail page. Fail loud in CI with the
matched substring + file so the author can see the hit.

## Why this shape

- **Grep, not AST.** Editorial claims don't have stable AST shapes
  — they're text. Grep is the right tool.
- **Runs against rendered output, not source.** Catches
  fabrications that appear in any of: hardcoded component copy,
  markdown content, JSON-LD, alt text. Source-only grep misses
  copy injected through the CMS or through server components
  that compose strings.
- **Additive to the QA gate.** The pipeline QA gate lives inside
  `/api/cron/generate-article` and only covers pipeline output.
  Site chrome and manually-authored pages never hit that gate. A
  CI-level lint closes that gap.

## Risks

- **False positives**: legitimate mentions of "500+" or "hands-on"
  in a review (e.g., "the course claims to have 500+ exercises")
  would trip the gate. Mitigation: allow an inline
  `<!-- editorial-lint: allow -->` escape hatch on specific
  prose blocks; every escape must be reviewed on PR.
- **Editorial drift**: the banned-substring list is a trailing
  indicator. Will need to be updated as new fabrication patterns
  appear. Owned by the CEO file `/ceo/editorial.md`.
- **Not a substitute for human judgment.** A site can still ship
  fabricated copy the lint doesn't know about. The lint is a
  tripwire for the classes of fabrication we've already seen,
  not a general honesty oracle.

## Alternatives considered

- **Semantic check via a small model.** Would catch fabrications
  the substring list misses, but introduces a dependency, a
  flakiness surface, and cost. Defer until the substring lint
  is in place.
- **Manual pre-flight checklist on every design PR.** Already
  implicitly required; hasn't worked twice. Humans skip the
  checklist; CI does not.
- **Block all design PRs from touching copy.** Overreach and
  impractical.

## Implementation notes (2026-04-26)

Shipped as a **source-side** lint, not a built-output crawler. The
proposal originally suggested crawling rendered routes; we landed on
source-grep instead because:

- The recurring failures (PR #4 redesign, pre-CEO template, etc.) all
  manifested as hardcoded substrings in TSX components. Source-grep
  catches every one of those without needing a Postgres-backed dev
  server in CI.
- A built-output crawler would need a DB to run Next's data fetching.
  CI doesn't have one. The lint must be runnable against any branch
  with no env setup.
- CMS-injected content (the 93 imported posts) is a separate problem
  better handled by the existing `qaService` infrastructure once DB
  access is sorted. Combining both surfaces into one tool muddied the
  scope.

The shipped lint scans `apps/app/src/**` and `apps/app/scripts/**`
(`.ts`/`.tsx`/`.md`/`.mdx`), 14 patterns covering the three failure
classes:

1. **Invented stats** — `500+ products reviewed`, `50K+ readers`,
   `100+ categories`, `4.9/5`, `reader trust score`.
2. **Fabricated process claims** — `hands-on`, `we tested / tried /
   used`, `in our testing`, `team of editors / experts / reviewers`,
   `named editor`, `90-day cycle`, `community / thousands of readers`,
   `in today's world`.
3. **Hash-of-slug score smoking gun** — `hash(...slug...)` and the
   specific `Math.abs(hash...) % 1000+` shape that PR #4 used.

Escape hatch (DR's "every escape must be reviewed on PR" requirement):

- `// editorial-lint: allow <code> [<code>...] -- <reason>` (same
  line or up to 2 above the match).
- `// editorial-lint: allow-file <code> [<code>...] -- <reason>`
  (file-level, anywhere).
- The `-- <reason>` is required by convention, not by parser; PR
  review enforces it. Reasons in source today are all of the form
  "denial / qualified statement / negative example in a model prompt".

Five files carry allow-file markers today: `TrustRow.tsx`,
`CommitmentSection.tsx`, `ProcessSection.tsx`,
`(frontend)/editorial/page.tsx`, and an inline allow on
`contentGenerationService.ts:285`. Each is a deliberate, qualified
use — denial copy, JSDoc documenting killed fabrications, or a
negative example inside a Gemini prompt.

CI: `.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`,
`pnpm --filter app editorial-lint`, then `pnpm --filter app
type-check` on every push and PR to main. ESLint is intentionally
omitted because the existing `eslint-config-next` import has a
pre-existing circular reference (logged in `backlog.md` [ops]).

## Verification (smoke test)

The lint was sanity-checked by adding a temporary file containing
`We tested it for 30 days` and `4.9/5 trust score` to `src/`; the
lint flagged three matches (one per pattern, including a comment-line
hit) and exited non-zero. File removed; clean tree passes 109 files
× 14 patterns.

## Future patterns to add

When new fabrication shapes appear, add them here:

- *(none yet — log new shapes in `/ceo/journal/` and add to PATTERNS
  in the script)*
