# Backlog

Tagged by area: [pipeline] [content] [seo] [site] [conversion] [ops].

## Bugs / issues

- [site] `Footer.tsx` social links are `href="#"` — dead anchors.
  Either wire real URLs or remove until we have accounts.
- [site] `Footer.tsx` newsletter form is a decorative `<input>` with
  no onSubmit — actively deceptive. Either wire up or remove.
- [site] `/blog` page `dynamic = 'force-dynamic'` — this kills ISR
  and means every request hits Payload. Should be ISR with revalidate.
- [pipeline] Scraper selectors in `clickbankService.ts` are
  guesses — almost certainly failing silently and falling back.
  Either validate or remove the scraper entirely.
- [pipeline] `filterUnusedProducts()` uses `slug.includes(productSlug.slice(0, 15))`
  — fuzzy matching that will false-positive. Use structured
  tracking (a covered-products table) instead.
- [site] `Blog` page header copy says "Insights, updates, and
  tutorials from our team about modern web development and design"
  — leftover from template, doesn't match ClickRank.
- [site] Newsletter input has no email validation, no CTA wiring.
- [site] Home hero/about/services components — likely template
  copy that doesn't match a review site. Audit on a later night.

## Pipeline ideas

- [pipeline] Swap Gemini → Claude for post generation; A/B on
  quality and cost.
- [pipeline] Add a "pros/cons" structured field instead of free
  markdown so we can render them in a Review schema.
- [pipeline] Add competitor-awareness: before generating, search for
  what the top-ranking review for this product says, and
  differentiate.
- [pipeline] Featured image: generate 4 per post, let an editorial
  model pick the strongest.

## SEO ideas

- [seo] Category pages with internal linking.
- [seo] Evergreen "Best of ClickBank in [category] 2026" roundup posts.
- [seo] `/go/[slug]` outbound tracking route.
- [seo] Add `BreadcrumbList` schema to post page.
- [seo] 404 page audit, custom design.

## Conversion ideas

- [conversion] Sticky CTA bar at bottom of review pages.
- [conversion] Inline "Verdict" callout box with affiliate CTA
  halfway through post.
- [conversion] Exit-intent popup on review pages. (Test after we
  have traffic.)

## Ops

- [ops] Need Google Search Console access.
- [ops] Need Vercel analytics access.
- [ops] Need affiliate-click reporting from ClickBank.
- [ops] Should we set up a Sentry project for this app? DSN is in
  env config but I don't know if a project exists.
