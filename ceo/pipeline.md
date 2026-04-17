# Nightly Landing-Page Pipeline

## Architecture (current)

```
Vercel Cron (nightly, 10:00 UTC)
  │
  ▼
GET /api/cron/generate-article   (requires Bearer CRON_SECRET)
  │
  ├─ pickTrendingProduct()        → clickbankService.ts
  │    ├─ scrape marketplace (Puppeteer, optional, brittle)
  │    └─ fallback: FALLBACK_PRODUCTS (8 perennial offers)
  │       filtered against last 50 slugs to avoid dupes
  │
  ├─ generateArticleForProduct()  → contentGenerationService.ts
  │    └─ Gemini 2.5 Flash preview, structured JSON response
  │       (title, slug, excerpt, content markdown, meta…)
  │    └─ humanizeContent() — strip AI tells
  │
  ├─ generateFeaturedImage()      → Replicate nano-banana-pro
  │    └─ uploaded to Payload media collection
  │
  ├─ suggestArticleTags()         → Gemini 2.0 Flash
  │
  └─ payload.create('posts', { _status: 'draft', … })
```

## Current capabilities

- ✅ Runs on a Vercel cron nightly.
- ✅ Picks from curated fallback list when scraper/creds missing.
- ✅ Generates SEO-structured ~1500-word reviews.
- ✅ Humanizes output.
- ✅ Generates featured images.
- ✅ Auto-tagging.
- ✅ Collision-safe slugs.
- ✅ Saves as draft (manual publish required).

## Known limitations & gaps

- ⚠️ **No QA stage.** Nothing checks for hallucinated features,
  missing disclosure, dupe content, word count, or affiliate-link
  presence. We're one bad Gemini response away from a
  low-quality post entering the library.
- ⚠️ **No `affiliateUrl` field on Posts.** The product's affiliate
  URL is generated but lives only in the markdown body. No
  structured CTA. (Schema migration → PR.)
- ⚠️ **No outbound click tracking.** Can't measure KR3.3.
- ⚠️ **Scraper is brittle.** Selectors are guesses. Fallback list
  has 8 products — limited variety.
- ⚠️ **No BrowserDB of products.** No history of what's been
  covered, what was skipped and why.
- ⚠️ **Auto-publish is off.** Every night requires a human to
  publish the draft. Good for safety now, blocker for scale later.
- ⚠️ **FTC disclosure was not being rendered.** Fixed
  structurally in the post template 2026-04-17 — no post can
  render without it.

## Next upgrades (priority order)

1. QA stage (see roadmap).
2. `affiliateUrl` field + rendered CTA on post page.
3. Outbound click tracking via `/go/[slug]`.
4. Product inventory persistence (so we don't rely on last-50-slugs
   heuristic for dedup).
5. Auto-publish behind a feature flag once QA stage is reliable.

## Run log

Append nightly. Format:
`YYYY-MM-DD` — product attempted · generated? · published? · notes.

- `2026-04-17` — no pipeline run tonight. First CEO session;
  focus was compliance + structured data fixes so the pipeline's
  output is safe to render. No new draft generated. Cron will
  run at 10:00 UTC tomorrow regardless.
