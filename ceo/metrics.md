# Metrics

Update nightly where data is available.

## Site metrics

| Metric | Latest | As of | Source | Notes |
|--------|--------|-------|--------|-------|
| Published posts | unknown | 2026-04-17 | Payload DB | Sandbox has no DB access; audit next run |
| Total posts (incl. drafts) | unknown | 2026-04-17 | Payload DB | Same |
| Pages indexed in Google | unknown | — | GSC | Need access |
| Average position | unknown | — | GSC | Need access |
| Organic clicks (7d) | unknown | — | GSC | Need access |
| Outbound affiliate clicks (7d) | unknown | — | no tracker yet | |
| Affiliate revenue (30d) | unknown | — | ClickBank | Need feed |

## Pipeline metrics

| Metric | Latest | As of | Notes |
|--------|--------|-------|-------|
| Successful runs (last 7d) | unknown | 2026-04-17 | No run log pre-CEO session |
| QA pass rate | n/a | 2026-04-18 | QA stage shipped tonight; baseline will populate from next real run |
| Avg generation time / post | unknown | — | Need logs |

## What we wish we had

- Read access to production Postgres (Neon) for nightly audit
  queries. Even a small read-only role would let the CEO
  run `SELECT count(*) FROM posts WHERE _status = 'published'`
  each night and track real numbers.
- Google Search Console API access or a weekly CSV dump to
  `/ceo/data/gsc-YYYY-WW.csv`.
- ClickBank commission export, same cadence.
- Vercel analytics (page views, core web vitals) export.

Logged in `INBOX.md`.
