# ClickRank Strategy

## Mission

Be the most trusted independent review site for ClickBank digital
products, so that when readers are deciding whether a ClickBank
offer is worth their money, they look for what ClickRank said.

## Canonical business thesis

ClickRank is an **informational affiliate site**. Readers arrive
through search because they want to understand a product, compare an
option, or solve a problem. We answer that intent with useful,
honest-favorable guidance, then route qualified readers to the
relevant ClickBank offer through our disclosed affiliate links.

The site is not neutral in the sense of being monetization-free. We
make money when readers click through and buy. The trust requirement is
what keeps that monetization durable: the page must still help the
reader make a better decision, name real caveats, and avoid products we
would be embarrassed to promote.

## Positioning

Most ClickBank "review" sites are thinly disguised sales pages:
padded fluff, fabricated testimonials, zero honest downsides, every
product rated 9/10. That entire category has trained readers and
Google to distrust it.

Our wedge: **honest-favorable reviews with genuine analysis**. We
promote products, but we won't fabricate, we won't review obvious
scams, and we'll always name real caveats. That creates durable trust,
which is the only thing that compounds in affiliate content.

## How we win

1. **Editorial trust.** Every review passes the Honest-Favorable
   standard in `editorial.md`. FTC disclosure is non-negotiable.
2. **Marketplace intelligence.** ClickBank marketplace signals tell us
   which products are trending, converting, or commercially worth
   covering. The pipeline should use gravity/rank, commission/EPC data
   when available, category momentum, and editorial risk flags to pick
   the next opportunities.
3. **Automated scale.** The nightly pipeline lets one-person
   editorial judgment scale to hundreds of pages a year.
4. **SEO surface area.** Deep category coverage, clean schema, fast
   pages, strong internal linking, and comparison/listicle hubs.
5. **Conversion feedback.** `/go/[slug]` click tracking and ClickBank
   commission exports should close the loop from search page to
   outbound click to sale/commission.
6. **Signal over volume.** One high-quality page that ranks and
   converts beats ten mediocre pages that don't. We feed the machine,
   then kill or update what doesn't work.

## First end-to-end workflow

1. Detect a promising ClickBank product or category from marketplace
   trend, gravity/rank, commission/EPC, and category demand.
2. Screen it for editorial safety: scam risk, health/income claims,
   unsupported testimonials, and whether we can write a useful review
   without pretending to have used it.
3. Generate or update an informational review, comparison, or category
   page with clear FTC disclosure.
4. Present a relevant CTA that routes through `/go/[slug]` to our
   affiliate hoplink.
5. Measure outbound clicks, then join those clicks with ClickBank
   commission data when available.
6. Use results to pick the next products, refresh winners, and skip
   losers.

## Categories we should lean into

ClickBank's enduring top verticals, filtered by both commercial upside
and editorial safety:

- **Health & Fitness** (keto, smoothies, supplements, fitness
  programs): largest category, high EPC volatility, strong demand for
  genuine analysis because the category is flooded with scammy offers.
  Requires strict health-claim handling.
- **Self-Help / Spirituality** (manifestation, confidence, sleep):
  evergreen demand, but high fabrication and unsupported-claims risk.
  Lean factual and skeptical.
- **E-business & E-marketing** (courses, affiliate training, SaaS
  trials): high commissions, highly competitive. Needs specific proof,
  pricing clarity, and no earnings claims.
- **Pets** (dog training especially): consistent demand, lower
  competition than health, generally safer editorially.
- **Home & Garden / Survival** (woodworking, survival guides,
  off-grid): good long-tail SEO opportunity and strong informational
  angles.

## Marketplace intelligence principles

- **Gravity is a starting signal, not a publishing decision.** High
  gravity can mean demand, but it can also mean heavy competition or
  aggressive claims.
- **Commission data matters.** A page that sends clicks but never earns
  is a content cost, not an asset. We need ClickBank sales/commission
  exports to optimize exposure.
- **Trend plus search intent beats trend alone.** Marketplace momentum
  should be paired with product-review and problem-aware search demand.
- **Trust can veto monetization.** Scam risk, medical/financial claims,
  fake scarcity, and impossible outcomes should block or demote a
  product even when the payout looks attractive.
- **Coverage history is an asset.** Track what we covered, skipped,
  refreshed, and why, so the pipeline does not keep rediscovering the
  same offers blindly.

## Bets we're making

- That Google's trust-signal weighting continues to favor sites with
  clear editorial standards and schema markup over content farms. If
  this reverses, we still have the affiliate link asset, but strategy
  needs revisiting.
- That ClickBank remains a viable affiliate network long-term. If they
  change terms or payouts significantly, we pivot to other affiliate
  networks using the same pipeline.
- That automated generation can meet editorial quality if the pipeline
  has strong QA gates. Every skipped QA is trust burned.
- That marketplace-informed product selection beats a static fallback
  list once we can ingest reliable ClickBank trend and commission data.

## What we've ruled out for now

- Paid traffic / ad buys: we don't have the margin or EPC data to
  optimize against yet.
- Direct display ads: they would cannibalize affiliate CTA intent.
- Video / YouTube review channel: massive production cost, unclear it
  beats SEO per dollar at our stage.
- Reviewing non-ClickBank products: dilutes positioning. Revisit once
  ClickBank coverage is deep.
- Writing with fabricated first-person experience ("I tried X for 30
  days..."): flatly prohibited by editorial standard. Kills trust the
  moment a reader catches it.
