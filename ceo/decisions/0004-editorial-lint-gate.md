# DR-0004 — Editorial-copy lint gate in CI

- Status: Proposed
- Date: 2026-04-24
- Author: CEO session on `claude/eager-wright-dyBpx`

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

## Next step

Open a PR that adds a `pnpm editorial-lint` script to the app
package, a tiny Node/TS script that crawls `/`, `/about`,
`/editorial`, `/contact`, `/blog`, and the most-recent
`/blog/<slug>`, strips HTML, and scans for the banned
substrings. Wire it to the CI workflow after `pnpm build`.
Proposed for the next session; not included in PR #12.
