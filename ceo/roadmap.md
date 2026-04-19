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

1. **Dedicated `affiliateUrl` + `ctaText` fields on Posts** (schema
   migration → PR). The `/go/[slug]` route now handles tracking,
   but we still want a structured CTA on the post page rather than
   relying on Gemini to render one inside the markdown.
2. ~~**Outbound affiliate click tracking.**~~ *Shipped 2026-04-19:
   `/go/[slug]` route + updated content-generation prompt.
   Persistence of click events to a Payload collection is the
   natural next step so the CEO can read counts without log access.*
3. ~~**QA stage in the pipeline.**~~ *Shipped 2026-04-18. See DR-0002.*
4. **Category pages that actually render products.** `/category/[slug]`
   with faceted filtering and internal linking.
5. ~~**Editorial standards public page.**~~ *Shipped 2026-04-19 as
   `/editorial`. Linked from footer, AffiliateDisclosure banner,
   home, and about.*
6. **Teach QA gate that `/go/` paths count as affiliate references.**
   Small PR; silences a warning introduced by the 2026-04-19
   content-generation prompt update.

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
