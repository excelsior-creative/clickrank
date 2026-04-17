# Monetization

## Current model

Affiliate commissions on outbound clicks to ClickBank vendor pages
via hoplinks. No direct ad monetization (good — ads would cannibalize
CTR on affiliate CTAs).

## Data access

**We don't have click or revenue data from inside this sandbox.**
ClickBank affiliate reporting lives in Brandon's ClickBank
dashboard. Logged in `INBOX.md`: would be valuable to get a
weekly export dumped somewhere readable (Supabase table, CSV in
`/ceo/data/`, etc.).

## What we can measure right now

Almost nothing, because:

- Outbound affiliate clicks are not yet tracked on-site (no
  `/go/[slug]` redirect with logging).
- There's no central table mapping posts → products → affiliate
  URLs.
- No Vercel analytics access from this sandbox.

Priority to fix: see `roadmap.md` "Next — outbound affiliate click
tracking".

## EPC hypotheses (to test once data exists)

1. Higher-gravity products convert better because they're already
   proven with affiliates. Prefer them in the fallback list.
2. Head-term searches ("[product] review") convert better than
   informational ("is keto diet healthy").
3. Reviews that name specific caveats build trust and convert
   better than pure-praise reviews. (This is the theory behind
   Honest-Favorable — currently unvalidated with data.)

## Experiments queued

- Sticky CTA at bottom vs. in-body CTA at 60% depth.
- "Verdict" callout box mid-post.
- Multiple CTAs per post vs. single CTA.
- Link text variants: "Check current pricing" vs. "Visit official
  site" vs. "Get instant access".

All blocked on click tracking.
