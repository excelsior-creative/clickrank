# Next

Brandon's 2026-05-02 “review and move the project forward” request authorizes converting the safest recommended backlog items into ready specs. Agents should work the Ready list in order and keep implementation inside each spec's risk tier and acceptance criteria.

## Ready

1. `ceo/specs/2026-05-02-production-launch-validation.md`
   — R1 validation of the public `clickrank.net` Vercel launch, smoke checks, and remaining launch blocker capture.
2. `ceo/specs/2026-05-02-editorial-copy-lint-gate-completion.md`
   — R1 completion/recovery of DR-0004 / PR #13 so future design changes cannot reintroduce fabricated copy.

## Proposed / needs Brandon approval

1. `ceo/specs/2026-04-29-clickbank-marketplace-intelligence-loop.md`
   — R2 implementation because it touches authenticated ClickBank data,
   monetized affiliate-selection behavior, and persisted product
   intelligence. Needs Brandon to approve the ingestion path before it becomes ready.

## Watch / not ready

- PR #20 is stale/conflicting nightly status documentation; do not spend implementation time on it unless it contains unique context not already merged into `main`.
- Public-domain launch status changed on 2026-05-02: `clickrank.net` now serves the Vercel Next.js/Payload app. Remaining launch work is validation/content/admin/cron/access, not DNS cutover.
