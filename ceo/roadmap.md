# Roadmap

## Now (this week)

1. **Compliance gate: FTC disclosure rendered on every post.**
   *Started 2026-04-17.* `AffiliateDisclosure` component added to
   blog post page + footer. Pipeline prompt updated to include a
   disclosure section in the body as well (belt-and-suspenders).
2. **Article + Review schema on blog post page.**
   *Started 2026-04-17.* `generateArticleSchema` was already in
   `lib/structured-data.ts` but never injected into the page.
3. **First successful pipeline run in CEO rhythm.** Confirm the
   Vercel cron fires, produces a draft, and the draft meets
   editorial standard. Publish manually the first few nights
   while we stabilize.

## Next (next ~2 weeks)

1. **Dedicated `affiliateUrl` field on Posts** (schema migration
   → PR). Right now there's no structured place to store the
   ClickBank affiliate hoplink — the CTA has to live in markdown.
2. **Outbound affiliate click tracking.** Route outbound affiliate
   clicks through `/go/[slug]` with a logging event before
   redirect. Needed for KR3.3.
3. **QA stage in the pipeline.** Automated check for: FTC
   disclosure present, affiliate link present, word count within
   range, no obvious hallucinations (e.g., fabricated studies),
   not a dupe of existing post.
4. **Category pages that actually render products.** `/category/[slug]`
   with faceted filtering and internal linking.
5. **Editorial standards public page.** `/editorial` — transparency
   about how we review. Trust signal.

## Later (this quarter)

- **ClickBank marketplace scraper hardening.** The current
  Puppeteer scraper is brittle (selectors are guesses). Stabilize or
  replace with a static-but-curated top-200 product list.
- **Internal link graph.** Auto-suggest related posts based on
  category/tag overlap. Inject 2–3 internal links per review.
- **Evergreen category hub pages.** "Best keto diet programs on
  ClickBank" listicle format, updated monthly.
- **Newsletter (already a footer form; not wired up).**
- **Multi-model content generation.** Have Gemini and Claude
  both draft; pick the stronger one via a cheap classifier.
