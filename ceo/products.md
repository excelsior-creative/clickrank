# Product Inventory

The pipeline's source list lives in `apps/app/src/services/clickbankService.ts`.
Until we build structured tracking, this is the manual ledger.

## Queued (fallback list — 25 perennial top offers)

*Updated 2026-04-26 — PR #14 expanded from 8 → 25 products and fixed all hop links.*

### Health & Fitness (8)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 1 | Custom Keto Diet | customketodiet | Health & Fitness | 180 |
| 2 | Smoothie Diet | smoothiediet | Health & Fitness | 160 |
| 3 | Dentitox Pro | dentitox | Health & Fitness | 140 |
| 4 | Ikaria Lean Belly Juice | ikarialean | Health & Fitness | 200 |
| 5 | Java Burn | javaburn | Health & Fitness | 175 |
| 6 | Prodentim | prodentim | Health & Fitness | 155 |
| 7 | Glucotrust | glucotrust | Health & Fitness | 145 |
| 8 | Yoga Burn | yogaburn | Health & Fitness | 90 |

### E-business & E-marketing (4)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 9 | Forex Trendy | forextrendy | E-business & E-marketing | 120 |
| 10 | Super Affiliate System | jcfilippo | E-business & E-marketing | 110 |
| 11 | Commission Hero | commhero | E-business & E-marketing | 95 |
| 12 | Perpetual Income 365 | pi365 | E-business & E-marketing | 85 |

### Self-Help (3)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 13 | Manifestation Magic | mmanifest | Self-Help | 100 |
| 14 | Billionaire Brain Wave | billionairebrainwave | Self-Help | 130 |
| 15 | His Secret Obsession | hissecret | Self-Help / Relationships | 115 |

### Pets (2)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 16 | Brain Training For Dogs | adrianemoore | Pets & Animals | 95 |
| 17 | Cat Spraying No More | catnospray | Pets & Animals | 70 |

### Home & Garden / Survival (2)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 18 | Ted's Woodworking | tedsplans | Home & Garden | 85 |
| 19 | Power Efficiency Guide | powereffic | Home & Garden | 75 |

### Spirituality / New Age (1)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 20 | Numerologist | numerolog | Spirituality | 80 |

### Languages (1)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 21 | Rocket Languages | rocketlang | Languages | 65 |

### Cooking / Health (1)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 22 | Metabolic Cooking | metabcook | Health & Fitness | 60 |

### Sports (1)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 23 | Vert Shock | vertshock | Sports | 85 |

### Software (1)
| # | Product | Vendor | Category | Gravity |
|---|---------|--------|----------|--------:|
| 24 | VideoProc Converter | videoproc | Software & Services | 55 |

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

## Marketplace intelligence target

The fallback list is not the strategy. It is the safety net. The
strategic target is a product/opportunity ledger fed by ClickBank
marketplace and affiliate reporting signals so the pipeline can answer:

- What is trending right now?
- Which products have the best combination of demand, payout, and
  manageable editorial risk?
- Which products have we already covered, refreshed, skipped, or
  rejected?
- Which pages generate outbound clicks but no commission?
- Which categories deserve comparison/listicle hubs?

Minimum desired fields are product, vendor, category, gravity/rank,
initial price, rebill/recurring signal, commission/EPC when available,
affiliate URL, source timestamp, coverage status, linked post slug, and
editorial risk flags.

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
