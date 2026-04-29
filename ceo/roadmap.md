# Roadmap

## Now (this week)

1. **Production cutover / launch validation.** The Next.js app must be
   deployed before any marketplace-informed content strategy can
   compound. Follow `LAUNCH_CHECKLIST.md` after Brandon creates the
   Vercel project and configures env/DNS.
2. **Editorial-copy lint gate completion.** Finish and review the
   DR-0004 guardrail so design/site changes cannot reintroduce fake
   stats, fake testimonials, or unsupported claims.
3. **Keep affiliate disclosure and tracked links structurally safe.**
   FTC disclosure, `/go/[slug]`, and body-hoplink rewriting remain
   foundational.

## Next (next ~2 weeks)

1. **ClickBank marketplace intelligence loop.** Convert Decision 0005
   into an approved implementation spec: product/opportunity ledger,
   marketplace ingestion approach, trend scoring, skip reasons, and
   selection policy for nightly generation.
2. **Dedicated `affiliateUrl` + `ctaText` fields on Posts.** The
   `/go/[slug]` route handles tracking, but structured CTAs should be
   first-class rather than relying on generated markdown.
3. **Production-readable metrics.** Make outbound clicks, post counts,
   and ClickBank commission exports visible to the CEO rhythm.
4. **Category pages that actually render products.** `/category/[slug]`
   with internal linking and affiliate-friendly comparison/listicle
   paths.
5. **Legacy review QA audit script.** The 93 imported posts need an
   audit before we treat them as trustworthy affiliate assets.

## Later (this quarter)

- **Marketplace scraper hardening or replacement.** The current
  Puppeteer scraper is brittle. Stabilize it only if login and selector
  behavior are reliable; otherwise prefer dashboard exports or curated
  product feeds.
- **Evergreen category hub pages.** "Best ClickBank products in
  [category] 2026" listicle format, refreshed monthly from marketplace
  and commission data.
- **Internal link graph.** Auto-suggest related posts based on
  category/tag/product overlap. Inject 2 to 3 internal links per review.
- **Multi-model content generation.** Have Gemini and Claude both
  draft; pick the stronger one via a cheap classifier.
- **Paid traffic tests.** Only after ClickBank EPC/commission data can
  prove margin.
