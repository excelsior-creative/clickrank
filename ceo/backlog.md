# Backlog

Tagged by area: [pipeline] [content] [seo] [site] [conversion] [ops].

## Bugs / issues

- ~~[site] Homepage/chrome fabrications reintroduced by design redesign
  PR #4~~ — resolved 2026-04-24 in PR #12. Killed fake TrustRow stats
  (500+/50K+/100+/4.9/5), hash-of-slug PostCard + Hero scores, fake
  "hands-on testing" / "team of editors / 14 hours" copy in
  ProcessSection and CommitmentSection, fake newsletter form in
  CTABanner, dead footer links. TrustRow now renders live DB counts.
- [process] Fabricated copy has shipped to the public surface 3x now
  (pre-2026-04-17 template, PR #4 redesign, caught 2026-04-24). Adding
  an editorial-copy CI lint is the only durable fix. Proposed as
  DR-0004; first PR for next session.
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
- ~~[site] Home hero/about/services components — likely template
  copy that doesn't match a review site~~ — resolved 2026-04-19.
  Deleted fabricated TestimonialsSection outright. Rewrote
  AboutSection, ServicesSection, WhyChooseUsSection, FAQSection,
  and `/about` page to match the Honest-Favorable standard. No
  more invented stats, fake testimonials, or claims of hands-on
  testing.
- [pipeline] Scraper selectors in `clickbankService.ts` are
  guesses — almost certainly failing silently and falling back.
  Either validate or remove the scraper entirely.
- ~~[site] Hero copy still needs audit~~ — audited and fixed 2026-04-24
  in PR #12. Removed "reads, tests, and ranks" / "How we test" CTA /
  hardcoded `score: 8.4` default on featured card.
- [schema] Add `rating` (number 0–10, optional) and `verdict` (enum)
  fields to Posts collection + migration. Unblocks real editorial
  scores on PostCard / Hero featured card. PR, not direct commit.
- ~~[pipeline] QA gate's `hasAffiliateOrVendorLink` doesn't match
  relative `/go/[slug]` tracking paths~~ — resolved 2026-04-19.
  Matcher now recognizes `](/go/<slug>)` markdown link targets in
  addition to `product.affiliateUrl` and `product.vendorUrl`.
- ~~[ops] `/go/[slug]` click events only hit stdout~~ — resolved
  2026-04-19. Added `outbound-clicks` Payload collection +
  migration; `/go/[slug]` writes one row per successful redirect
  (fire-and-forget, admin-only read). Rolled-up counts still live
  on `Posts.clickCount`.

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
- ~~[seo] `/go/[slug]` outbound tracking route.~~ — shipped 2026-04-19.
- ~~[seo] Add `BreadcrumbList` schema to post page.~~ — already shipped
  2026-04-17 (combined into the Article JSON-LD graph).
- [seo] 404 page audit, custom design.
- [seo] `/category/[slug]` hub pages (carry from roadmap "Next").
- ~~[seo] Related-posts block on blog post pages for internal linking~~
  — resolved 2026-04-20. `/blog/[slug]` now renders up to 3 cards
  chosen by category/tag overlap with the current post, topped up
  with the latest published posts when overlap is short.

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
