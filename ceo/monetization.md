# Monetization

## Current model

Affiliate commissions on outbound clicks to ClickBank vendor pages via
hoplinks. ClickRank is an informational site, but the commercial motion
is explicit: answer the reader's product/problem question, then upsell
the right readers into a disclosed affiliate link that pays us a
kickback when the visitor buys.

No direct ad monetization for now. Ads would compete with the affiliate
CTA and dilute the buying path.

## Revenue loop

1. Reader lands from search on a review, comparison, or category page.
2. Page gives useful informational guidance and names real caveats.
3. Page presents a relevant CTA with FTC disclosure.
4. CTA routes through `/go/[slug]` so outbound clicks are tracked.
5. ClickBank records sales/commission on the affiliate side.
6. Product/category exposure is increased, reduced, refreshed, or
   killed based on clicks, conversion, commission, and editorial risk.

## Marketplace-driven exposure

The key optimization question is: **which ClickBank products should we
put in front of search traffic next?**

Signals to capture from ClickBank marketplace and affiliate reporting:

- marketplace rank / gravity / trend direction
- category and niche
- initial price
- recurring/rebill potential
- commission rate, average commission, EPC, or sale value when visible
- vendor/order-form quality signals
- refund or chargeback concern if available
- affiliate hoplink validity
- whether the product is already covered on ClickRank
- editorial risk: health, income, medical, financial, manifestation,
  exaggerated claims, fake scarcity, or obvious scam posture

Recommended policy: prioritize products with strong marketplace demand,
clear search intent, real commission potential, and manageable editorial
risk. Demote or skip high-payout offers when the only honest article we
can write is basically a warning.

## Data access

**We do not yet have reliable ClickBank outcome data inside this repo.**
ClickBank affiliate reporting lives in Brandon's ClickBank dashboard.
A weekly export or readable feed is the missing piece for EPC and
commission optimization.

Useful feed shape:

- date
- product/vendor
- tracking ID or hoplink identifier if available
- order form impressions
- sales count
- gross sales
- commission
- refunds/chargebacks
- affiliate clicks if ClickBank exposes them

## What we can measure right now

- `/go/[slug]` outbound click tracking exists in code and the
  `outbound-clicks` Payload collection records redirects.
- Inline imported-body hoplinks are rewritten through `/go/[slug]` at
  render time.
- Counts are not yet operationally visible from this sandbox without
  production DB/admin/log access.
- Commission truth is not available until Brandon provides ClickBank
  export access or a dashboard-derived feed.

## EPC hypotheses to test once data exists

1. Higher-gravity products convert better because they're already
   proven with affiliates. Prefer them, but do not let gravity override
   editorial risk.
2. Head-term searches (`[product] review`, `[product] scam`, `[product]
   pricing`) convert better than broad informational searches.
3. Honest caveats improve trust and affiliate conversion compared with
   pure-praise reviews.
4. Category hubs and "best ClickBank products in [niche]" pages can
   route broader informational intent into multiple affiliate offers.
5. Updating existing ranked pages toward current marketplace winners
   may beat generating brand-new pages for every trend.

## Experiments queued

- Sticky CTA at bottom vs. in-body CTA at 60% depth.
- "Verdict" callout box mid-post.
- Multiple CTAs per post vs. single CTA.
- Link text variants: "Check current pricing" vs. "Visit official
  site" vs. "Get instant access".
- Category/listicle hub pages that compare several marketplace winners
  and route each recommendation through tracked affiliate links.
- Product refresh cadence based on ClickBank trend movement and
  commission performance.

Most experiments remain blocked on readable click, traffic, and
commission data.
