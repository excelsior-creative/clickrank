# DR-0002 — Editorial QA gate as load-bearing pipeline step

**Date:** 2026-04-18
**Status:** Accepted
**Owner:** Autonomous CEO

## Context

The nightly landing-page pipeline picks a ClickBank product, asks
Gemini to generate a review, humanizes the output, and persists a
draft to Payload. Prior to tonight there was no verification that
the generated content was safe or acceptable to publish. A bad
Gemini response — missing disclosure, fabricated first-person
testimony, an "FDA-approved" claim on a supplement, a forbidden
income guarantee, or a 200-word stub — would flow straight into the
library as a draft. Even as drafts, these are a liability: if
anyone with publish rights auto-approves a queue of them, we've
poisoned our own corpus.

## Decision

Introduce a deterministic, stateless QA stage
(`apps/app/src/services/qaService.ts`) that runs immediately after
article generation and before any persistence. Errors block the
pipeline (`422` response, no draft created, no image generated, no
media upload attempted). Warnings are logged and surfaced in the
response but do not block.

Error-level checks:
- required fields present; slug is valid kebab-case
- `## Affiliate disclosure` heading + commission/earn language
  present (FTC)
- word count ≥ 700
- no first-person testing / weight-loss / user-count fabrication
- no forbidden claims: guaranteed income, FDA approval,
  miracle cure, guaranteed weight loss

Warning-level checks:
- affiliate or vendor link missing
- "what could be better" caveats section missing
- word count > 3500
- fewer than 4 headings
- title > 80 chars, meta description > 170 chars
- "clinically/scientifically proven" without attribution
- em-dashes present (humanizer should have stripped them)

## Consequences

**Positive**
- No post with missing disclosure can enter the library. Hard stop.
- No post with obvious fabrications can enter the library.
- Observable: every cron response now includes `qa.stats` and
  `qa.warnings`, so we can trend quality over time once we have
  logging access.
- Stateless and pure functions — easy to unit test when we add a
  test runner.

**Negative**
- May over-reject on edge cases (a legitimately under-700-word
  review, or an idiomatic em-dash that slipped through). We'll see
  data from the next few cron runs and tune thresholds.
- Adds latency (~tens of ms). Negligible.
- The gate itself is now a load-bearing safety component — per
  the CEO mandate, future changes go through PR.

## Alternatives considered

- **Let Gemini self-QA via a second call.** Rejected for this first
  pass: another AI call adds cost and non-determinism, and the goal
  of a gate is determinism.
- **Manual review only.** Not scalable to the volume goal in OKRs.
- **Defer until `affiliateUrl` field exists.** Rejected — the
  disclosure check alone is worth shipping tonight, and a missing
  `affiliateUrl` field only affects future CTA-rendering work, not
  the QA gate itself (which reads the markdown body).

## Rollback

Revert the import + the QA block in
`apps/app/src/app/api/cron/generate-article/route.ts`. The
`qaService.ts` file can stay in the repo as dead code until we
figure out why we'd ever want to turn the gate off.
