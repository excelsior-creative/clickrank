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

- ✅ **QA stage exists as of 2026-04-18.** See `qaService.ts`. Checks
  disclosure, affiliate link, word count, headings, title/meta length,
  fabrication tells, forbidden claims, em-dash residue. Errors block
  persistence (422); warnings are logged. Not yet run against real
  Gemini output — first real run will be the next cron fire.
- ⚠️ **No `affiliateUrl` field on Posts.** The product's affiliate
  URL is generated but lives only in the markdown body. No
  structured CTA. (Schema migration → PR.)
- ✅ **Outbound click tracking shipped 2026-04-19** as `/go/[slug]`
  route. Resolves product slug → affiliate URL, 302 redirects, logs
  a structured event to stdout. Content-generation prompt now emits
  tracked `/go/[productSlug]` links by default. Persistence of
  click events to a Payload collection is still queued. KR3.3 is
  unblocked at the infrastructure layer; actual numbers require
  Vercel log access (pending Brandon).
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

1. `affiliateUrl` + `ctaText` fields on Posts collection, pipeline
   save + rendered sticky CTA on post page. (Schema migration → PR.)
2. Teach QA gate's `hasAffiliateOrVendorLink` to recognize `/go/`
   paths as valid affiliate references. (QA gate change → PR.)
3. Persist `/go/[slug]` click events to a Payload collection so we
   can query per-product click counts without log access. Requires
   new collection + migration → PR.
4. Product inventory persistence (so we don't rely on last-50-slugs
   heuristic for dedup; tonight's token-intersection dedup is a
   short-term improvement but still not authoritative).
5. Tune the QA gate based on real output (false positives to back
   off on, new fabrication patterns to add).
6. Auto-publish behind a feature flag once QA gate has cleanly
   passed ≥5 consecutive real drafts.

## Run log

Append nightly. Format:
`YYYY-MM-DD` — product attempted · generated? · published? · notes.

- `2026-04-17` — no pipeline run tonight. First CEO session;
  focus was compliance + structured data fixes so the pipeline's
  output is safe to render. No new draft generated. Cron will
  run at 10:00 UTC tomorrow regardless.
- `2026-04-18` — no CEO-triggered pipeline run. Built the editorial
  QA gate (first load-bearing safety check) and wired it into the
  cron endpoint. Fixed the fuzzy dedup. Gate is unverified against
  real Gemini output — next scheduled cron will be its first live
  test. If it over-rejects, tune conservatively next night.
- `2026-04-19` — no CEO-triggered pipeline run. Pipeline gets two
  non-invasive upgrades tonight: (1) content-gen prompt now emits
  tracked `/go/[productSlug]` links for every CTA instead of raw
  affiliate URLs; (2) `/go/[slug]` redirect route exists and logs
  each click. Expected side effect on next scheduled cron: the QA
  gate will start emitting `monetization.missingAffiliateLink`
  warnings for articles whose only outbound link is a `/go/` path
  (the gate's link matcher doesn't yet understand relative tracking
  paths). Warnings are non-blocking; queued as a QA-gate PR to
  teach the matcher.
- `2026-04-20 → 2026-04-23` — pipeline-adjacent PRs merged: #7 (QA
  `/go/` link matcher + `outbound-clicks` Payload collection —
  matcher recognizes `](/go/<slug>)` patterns, and each redirect
  writes one row to the new collection fire-and-forget), #8
  (pg SSL deprecation fix, mint gradient repair, imported 93
  legacy reviews from the reference corpus), #9 (related-posts
  block on `/blog/[slug]` using category/tag overlap topped up
  with latest). No direct pipeline run logs captured; prod cron
  status still opaque from the sandbox.
- `2026-04-24` — no CEO-triggered pipeline run. Tonight focused on
  killing the site-chrome fabrications reintroduced by the
  design-redesign PR (#4) — fake homepage stats, hash-of-slug
  scores on every post card, fabricated process copy. Fixed in
  PR #12 (draft). Pipeline itself untouched. Flagged the
  cross-cutting pattern as a process gap: design PRs that replace
  components can ship fabricated copy without the pipeline QA
  gate ever touching them. Proposed DR-0004 (editorial-copy CI
  lint) as the fix.
