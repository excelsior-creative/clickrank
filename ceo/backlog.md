# Backlog

Tagged by area: [pipeline] [content] [seo] [site] [conversion] [ops].

## Bugs / issues

- ~~[site] Footer social links `href="#"`~~ — resolved 2026-04-18
  (removed the social icons row; no accounts = no links).
- ~~[site] Footer newsletter decorative form~~ — resolved 2026-04-18
  (removed until we actually ship a newsletter).
- ~~[site] `/blog` force-dynamic~~ — resolved 2026-04-18 (switched
  both `/blog` and `/blog/[slug]` to ISR with `revalidate = 3600`).
- ~~[site] Blog header copy "Insights, updates…"~~ — resolved
  2026-04-18 (ClickRank-voice subtitle).
- ~~[pipeline] `filterUnusedProducts` fuzzy `slug.includes`~~ —
  resolved 2026-04-18 (canonical-token intersection). Structured
  product-history tracking is still a better long-term answer and
  remains in `roadmap.md`.
- [pipeline] Scraper selectors in `clickbankService.ts` are
  guesses — almost certainly failing silently and falling back.
  Either validate or remove the scraper entirely.
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
