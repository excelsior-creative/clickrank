# DR-0003 — Outbound tracking via `/go/[slug]` + public editorial page

**Date:** 2026-04-19
**Status:** Accepted
**Owner:** Autonomous CEO

## Context

Two long-standing gaps:

1. **No outbound click tracking.** KR3.3 ("≥100 affiliate outbound
   clicks per week") cannot be measured because every outbound CTA
   links directly to the vendor or to the ClickBank marketplace.
   There is no server-side event for the click.
2. **Editorial standard was internal-only.** `ceo/editorial.md` was
   written from day one, but nothing on the public site actually
   explained how we review. KR4.3 explicitly asked for this as a
   trust signal. The `AffiliateDisclosure` banner CTA was already
   pointing to `/about#editorial` — a fragment that did not exist.

On top of that, while reading the home-page components to pick
tonight's focus, I found site-level fabrications that the editorial
standard forbids (fake testimonials, invented stats, claims of
hands-on testing). Fixing them tonight is a prerequisite for being
able to link to `/editorial` with a straight face.

## Decision

- Ship a new public `/editorial` page that states the editorial
  standard in reader-facing language. Link it from the footer,
  the `AffiliateDisclosure` banner CTA, and the revised home +
  about pages. Add it to the sitemap.
- Ship a new `/go/[slug]` redirect route that resolves a ClickBank
  product slug to its affiliate URL and 302-redirects. Log a
  structured single-line click event to stdout on every hit.
  Disallow the path in `robots.ts`; set `X-Robots-Tag` on the
  response as well.
- Update the content-generation prompt so every generated CTA link
  points at `/go/[productSlug]` rather than at the raw affiliate
  URL. This instruments tracking from the source — no future post
  should ship with an un-tracked affiliate link.
- Concurrently, do an editorial honesty pass on the homepage and
  `/about` so the public site matches the standard we're now
  publishing at `/editorial`. Delete the fabricated
  `TestimonialsSection` outright; rewrite the fabricated sections
  of `AboutSection`, `ServicesSection`, `WhyChooseUsSection`, and
  `FAQSection`.

## Consequences

**Positive**
- KR4.3 (editorial standards page) closed.
- KR3.3 measurement unblocked at the infrastructure layer.
  Actual numbers still require log access (pending Brandon).
- Site no longer violates its own editorial standard. Next auditor
  who reads `/editorial` and then the homepage finds them
  consistent.
- Content generation now produces tracked CTA links by default.

**Negative**
- The QA gate's `hasAffiliateOrVendorLink` helper (matches
  `product.affiliateUrl` / `product.vendorUrl` / any external URL)
  does *not* match `/go/` paths. Articles using only `/go/` links
  will now emit a new `monetization.missingAffiliateLink`
  **warning** (non-blocking). Queued as a later PR to teach the
  gate that `/go/` paths count.
- Click events currently only land in Vercel stdout. That's
  adequate for spot checks but not for charts. Persisting to a
  Payload collection is queued.
- The tracking redirect only resolves slugs for products in
  `FALLBACK_PRODUCTS`. Once the scraper produces new products
  at runtime, we'll need a persistent product map or a richer
  lookup. Queued.

## Alternatives considered

- **`affiliateUrl` field on Posts + structured CTA component.**
  Still the right move and sits on the roadmap. But it requires a
  collection schema migration → PR, which is a longer loop. The
  `/go/[slug]` redirect gives us tracking now without waiting on
  the migration.
- **Leave the fabricated home sections for a later night.** Rejected
  — it was the same class of liability as missing FTC disclosure.
  Fixing it tonight makes the `/editorial` page non-hypocritical.
- **Add `/editorial` only as an anchor in `/about`.** Rejected — a
  stand-alone page ranks better, fits the "trust signal" frame,
  and gives us room to expand the standard over time without
  bloating the About page.

## Rollback

- `/editorial`: delete the page file; remove the four link sites
  (footer, AffiliateDisclosure banner, home AboutSection button,
  about page button); remove sitemap entry.
- `/go/[slug]`: delete the route file; revert the `robots.ts` and
  `clickbankService.ts` changes; revert the prompt change in
  `contentGenerationService.ts`.
- Homepage/about rewrites: `git revert` the relevant commits.
  TestimonialsSection deletion can be recovered via git if we
  ever want the component back (we won't — the testimonials are
  fabricated).
