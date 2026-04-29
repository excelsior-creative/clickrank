# Decision 0005 — Informational affiliate marketplace engine

- **Date:** 2026-04-29
- **Status:** Accepted
- **Source:** Brandon G-stack auto direction in Slack thread C0AKWMVJE6Q / 1777490379.124829
- **Risk:** R1 for strategy/docs. Implementation is R2 where it reads ClickBank account data, stores marketplace/product intelligence, or changes monetized affiliate-routing behavior.

## Decision

ClickRank is first an informational review and buying-guidance site for ClickBank products, not a generic SEO blog or neutral encyclopedia. The reader arrives through informational search intent, gets a useful and honest answer, and is then routed to the relevant ClickBank offer through our affiliate link when the product is a reasonable fit. The business succeeds when marketplace intelligence identifies products with enough demand, commission potential, and editorial safety, then the site turns that demand into trusted review pages, tracked outbound clicks, and affiliate commissions.

## Locked G-stack choices

1. **Business thesis:** informational ClickBank review site first, affiliate commission engine second, marketplace-intelligence product later if the internal pipeline becomes defensible.
2. **Primary v1 user:** search visitor researching a ClickBank product or problem and deciding whether to buy.
3. **Secondary users/evaluators:** Brandon/Timmy as portfolio operators, Google as the discovery gate, and ClickBank vendors as indirect commercial beneficiaries when a promoted product converts.
4. **First end-to-end workflow:** detect promising ClickBank marketplace opportunity → select a product or category angle → generate or update an honest-favorable informational page → present clear affiliate CTA/disclosure → route click through `/go/[slug]` → measure outbound clicks and commission results.
5. **Product surfaces:** public review pages, category/listicle hubs, editorial standards/disclosure pages, `/go/[slug]` redirect surface, Payload/admin review queue, and internal marketplace-intelligence ledger.
6. **Content/data model:** product, vendor, category, gravity/trend signal, commission/EPC signal when available, editorial risk flags, review page, affiliate URL/hoplink, CTA text, outbound click event, commission result, and opportunity score.
7. **Quality/trust guardrails:** FTC disclosure is mandatory; no fabricated experience, testimonials, rankings, earnings, health, or medical claims; no promotion of obvious scams; every affiliate push must still be framed as reader-helpful buying guidance.
8. **Monetization/growth:** affiliate links are active and central; direct ads are deferred/prohibited for now because they dilute CTA intent; paid traffic is deferred until EPC and conversion data exist; marketplace data should drive exposure toward products with the best mix of demand, commission, conversion probability, and editorial safety.
9. **Success metrics:** indexed review pages, organic clicks, affiliate outbound clicks, ClickBank order form impressions/sales/commission, EPC by product/category/page, and percentage of generated opportunities rejected for trust/compliance reasons.
10. **Near-term objective/spec sequence:** keep launch validation first, then add a ClickBank marketplace intelligence loop spec that replaces brittle fallback selection with a durable product/opportunity ledger.

## Implications

- Informational content is a means to affiliate conversion, but trust is the conversion moat. The site should answer the user first, then make the affiliate next step obvious.
- Product selection must stop relying on static perennial products alone. The pipeline needs a repeatable way to see what is rising in ClickBank and choose pages based on trend, payout, search opportunity, and risk.
- Marketplace signals are inputs, not editorial permission. High gravity or high commission can be outweighed by scam, health, income, compliance, or fabrication risk.
- Click tracking without ClickBank commission data is incomplete. The operating dashboard needs both on-site clicks and ClickBank outcome data to optimize exposure.

## Follow-up specs

1. **ClickBank marketplace intelligence loop** — proposed R2. Build the internal product/opportunity ledger, trend scoring, and safe ingestion path from ClickBank marketplace/account data.
2. **Launch validation + production cutover support** — still the first operational blocker because the Next.js app must be live before marketplace-optimized content can compound.
3. **Legacy review QA audit** — remains important because imported informational pages must not damage trust before they route affiliate traffic.

## Supersedes / clarifies

- Clarifies `ceo/strategy.md`, `ceo/monetization.md`, `ceo/pipeline.md`, and `ceo/products.md`: ClickRank is an informational affiliate site whose content strategy should be guided by ClickBank marketplace trend and commission signals.
- Does not supersede DR-0001 through DR-0004. FTC disclosure, editorial QA, tracked redirects, and copy-fabrication lint remain foundational guardrails.
