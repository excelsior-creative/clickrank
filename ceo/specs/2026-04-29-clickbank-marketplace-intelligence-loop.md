---
title: ClickBank marketplace intelligence loop
status: proposed
risk_tier: R2
owner: Timmy
reviewer: Quinn
created: 2026-04-29
source:
  - ceo/decisions/0005-informational-affiliate-marketplace-engine.md
---

# ClickBank marketplace intelligence loop

## Outcome

ClickRank has a durable internal loop for finding, scoring, and selecting ClickBank products that are trending or commercially attractive, so the article pipeline maximizes exposure to products likely to convert while preserving editorial trust.

## G-stack basis

Decision 0005 locks ClickRank as an informational affiliate site: visitors arrive for helpful product/category information, and the business monetizes by routing qualified readers to ClickBank offers through disclosed affiliate links. Marketplace intelligence is the mechanism that decides which products deserve coverage next.

## Scope

1. Define a product/opportunity ledger for ClickBank products with at least:
   - product name
   - vendor nickname
   - category
   - gravity or marketplace rank
   - initial price
   - rebill/recurring signal when available
   - commission/EPC signal when available
   - vendor/order-form URL
   - affiliate hoplink
   - first seen / last seen timestamps
   - editorial risk flags
   - coverage status and linked post slug
2. Replace the current brittle `pickTrendingProduct()` behavior with a documented selection policy:
   - prefer products with strong marketplace demand and commission potential
   - avoid recent duplicates
   - penalize high-risk categories/claims unless a skeptical review angle is available
   - preserve manual overrides for Brandon/Timmy
3. Decide the ingestion method:
   - authenticated ClickBank marketplace scrape if stable and allowed
   - periodic CSV/manual export if dashboard automation is brittle or requires 2FA
   - curated top-product list as fallback, explicitly timestamped
4. Produce an opportunity score that can be logged before each nightly draft.
5. Persist enough selection history to answer: what did we see, what did we choose, what did we skip, and why?
6. Connect on-site outbound click counts to ClickBank commission/export data when Brandon provides a readable feed.

## Non-goals

- No paid-traffic automation.
- No auto-publishing of generated reviews.
- No public ranking claims based only on marketplace data.
- No bypass of FTC disclosure or the Honest-Favorable editorial standard.
- No storing raw ClickBank credentials outside approved secret storage or deployment env vars.

## Risk tier and approval evidence

- Effective implementation tier: **R2** because this touches authenticated external marketplace data, monetized affiliate-link selection, production pipeline behavior, and persisted product intelligence.
- Docs/spec drafting is R1.
- Implementation must not start until Brandon approves this spec or explicitly approves the marketplace-data ingestion approach.
- If implementation requires 2FA handling, credential migration, payment/revenue exports, or production deploy, re-check the effective gate before acting.

## Acceptance criteria

- [ ] Product/opportunity data model is documented and implemented in the repo or admin data layer.
- [ ] Marketplace ingestion method is selected and documented with fallback behavior.
- [ ] Every candidate product records source, timestamp, and key marketplace signals.
- [ ] Selection logic logs why a product was chosen or skipped.
- [ ] Pipeline can still generate from fallback products if marketplace access fails.
- [ ] Editorial risk flags can block or demote products before generation.
- [ ] `/go/[slug]` click data can be joined to product/post records.
- [ ] Commission/export ingestion path is documented, even if Brandon must provide the first CSV/feed.

## Verification plan

- Run `git diff --check` for docs changes.
- For implementation, run typecheck/build and a dry-run product-selection script against fixture marketplace data.
- Verify no logs print credentials or raw tokens.
- Verify generated test candidates include disclosure-safe affiliate URLs and skip reasons.

## Restart notes

Start with `ceo/decisions/0005-informational-affiliate-marketplace-engine.md`, `ceo/monetization.md`, `ceo/products.md`, and `apps/app/src/services/clickbankService.ts`. The current code already has a ClickBank scrape attempt and fallback list, but selectors and dashboard access are brittle. Design the ledger and ingestion approach before editing production pipeline behavior.
