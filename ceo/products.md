# Product Inventory

The pipeline's source list lives in `apps/app/src/services/clickbankService.ts`.
Until we build structured tracking, this is the manual ledger.

## Queued (fallback list — perennial top offers)

| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 1 | Custom Keto Diet | customketodiet | Health & Fitness | 180 |
| 2 | Smoothie Diet | smoothiediet | Health & Fitness | 160 |
| 3 | Forex Trendy | forextrendy | E-business & E-marketing | 120 |
| 4 | Brain Training For Dogs | adrianemoore | Pets & Animals | 95 |
| 5 | Ted's Woodworking | tedsplans | Home & Garden | 85 |
| 6 | Super Affiliate System | jcfilippo | E-business & E-marketing | 110 |
| 7 | Dentitox Pro | dentitox | Health & Fitness | 140 |
| 8 | Manifestation Magic | mmanifest | Self-Help | 100 |

## Covered (published)

As of **2026-04-20/21**, 93 legacy reviews were imported from the
`reference/` WordPress corpus into Payload as published posts via
`apps/app/scripts/import-reference.ts`. Each post carries its own
`affiliateUrl` (first `hop.clickbank.net` link in the body) and a
`productName` derived from the hoplink's `vendor=` parameter.

Sample vendors observed in the corpus (non-exhaustive — full list
lives in the Payload `posts` collection):

HYPINTER, HOOKAHBAR, RVDRIVESMA, HPREC, HTLWF, VEGANPS, BONUSBAG,
TWRKS, FITCOOKING, IEHARAMIS, MACOAFF, plus many without a
clean vendor-code (numeric IDs, stripped hoplinks, or stub posts
that fell back to `og:description`).

**Editorial status of the imported 93: unaudited.** They bypassed
`qaService.ts` at write time. Queued audit script is blocked on DB
access.

**Monetization status of the imported 93: body hoplinks are now
tracked as of 2026-04-22** via the render-time
`rewriteAffiliateLinks` transform in
`apps/app/src/lib/affiliateLinks.ts`. Previously only the sticky
CTA at post-bottom emitted a tracked click.

## Skipped (with reason)

*(None yet.)*

## Notes

- Gravity scores are directional guesses from the fallback list;
  actual ClickBank values drift daily. Don't treat as canonical.
- `Manifestation Magic` and similar manifestation/law-of-attraction
  offers: review carefully — easy to slip into unsupportable
  "you'll attract wealth" claims. Keep language analytical and
  descriptive of what the product contains, not what it promises.
- `Dentitox Pro`: supplement — watch for medical/health claims.
  Stick to describing the vendor's claims without endorsing them.
- `Super Affiliate System` at $997 initial is a high-ticket offer.
  Great EPC potential, but readers are more skeptical — reviews
  need extra rigor.
