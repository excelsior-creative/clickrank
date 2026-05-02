# Metrics

Update nightly where data is available.

## Site metrics

| Metric | Latest | As of | Source | Notes |
|--------|--------|-------|--------|-------|
| Published posts | **93** | 2026-04-21 | import-reference.ts log | Legacy import 2026-04-20→21. Quality unaudited. |
| Total posts (incl. drafts) | ≥93 | 2026-04-21 | Payload DB | Sandbox still no read access; 93 is the published floor. |
| Pages indexed in Google | unknown | — | GSC | Need access |
| Average position | unknown | — | GSC | Need access |
| Organic clicks (7d) | unknown | — | GSC | Need access |
| Outbound affiliate clicks (7d) | unknown | 2026-04-22 | `/go/[slug]` + `outbound-clicks` coll. | Full surface now instrumented. Reading counts still requires admin or log access. |
| Affiliate revenue (30d) | unknown | — | ClickBank | Need feed |
| ClickBank EPC by product/category | unknown | — | ClickBank + `/go` | Needs commission/export feed joined to on-site click data. |
| Marketplace trend/gravity movement | unknown | — | ClickBank Marketplace | Needs marketplace intelligence loop. |

## Pipeline metrics

| Metric | Latest | As of | Notes |
|--------|--------|-------|-------|
| Successful runs (last 7d) | unknown | 2026-04-17 | No run log pre-CEO session |
| QA pass rate | n/a | 2026-04-18 | QA stage shipped; baseline requires real production runs |
| Avg generation time / post | unknown | — | Need logs |
| Products selected from live marketplace vs fallback | unknown | 2026-04-29 | Current code falls back when credentials/scrape fail; needs ledger. |
| Candidate products skipped for editorial risk | unknown | 2026-04-29 | Needs opportunity ledger and skip-reason logging. |

## What we wish we had

- Read access to production Postgres or Payload admin reports for
  nightly post and click counts.
- Google Search Console API access or a weekly CSV dump to
  `/ceo/data/gsc-YYYY-WW.csv`.
- ClickBank commission export, same cadence, ideally with product,
  vendor, tracking ID, sales, refunds, and commission.
- ClickBank marketplace export or stable ingestion path for gravity,
  rank, category, price, rebill, and affiliate-hoplink data.
- Vercel analytics (page views, core web vitals) export.

Logged in `INBOX.md`.
