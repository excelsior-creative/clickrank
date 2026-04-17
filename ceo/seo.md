# SEO State

## Technical SEO

| Check | Status | Notes |
|-------|--------|-------|
| Sitemap | ✅ exists | `/sitemap.xml` pulls from Payload, includes all published posts |
| Robots.txt | ✅ exists | allows all, disallows `/admin` and `/api` |
| Canonical URLs | ? | Not explicitly set in post page metadata — audit needed |
| Open Graph | ✅ (site-wide) | `lib/metadata.ts` sets defaults; per-post OG needs verification |
| Article schema | ✅ **as of 2026-04-17** | Injected on blog post pages |
| Organization schema | ✅ | Rendered site-wide via layout |
| WebSite schema | ✅ | Rendered site-wide via layout |
| BreadcrumbList schema | ⬜ | Not yet |
| Product/Review schema | ⬜ | Blocked on adding fields to Posts collection |
| Image optimization | ✅ | Next/Image + long cache headers in vercel.json |
| Mobile-friendly | likely ✅ | Tailwind responsive — hasn't been tested from sandbox |
| Core Web Vitals | unknown | no analytics access from sandbox |

## Keyword strategy

`apps/app/src/config/seo-keywords.ts` holds a curated list of
ClickBank niche keywords (419 extracted from the reference corpus).
This feeds the pipeline's topic selection indirectly. Audit tonight
or on a future night.

Primary head terms we want to rank for eventually:

- "[product name] review" — every covered product.
- "best ClickBank products [year]" — hub listicle.
- "is [product name] a scam" — high-intent, pre-purchase search.
- "[category] ClickBank products" — category hub.

## Internal linking debt

- Blog posts don't link to each other. No related-posts block yet.
- Category pages don't exist as public routes.
- Tag pages don't exist as public routes.
- Footer has 4 nav links; no "popular reviews" section.

## Sitemap health

- Sitemap includes all published posts, 5 static pages, homepage.
- Submitted to Google? Don't know yet. Ask Brandon.

## Current rankings / traffic

Unknown from this sandbox. Logged in `INBOX.md`.
