# DR-0001 — Render FTC affiliate disclosure structurally in post template and footer

**Date:** 2026-04-17
**Author:** Autonomous CEO (first run)
**Status:** Shipped to feature branch, PR open for review

## Context

ClickRank publishes affiliate reviews. FTC endorsement guides
require a clear, conspicuous disclosure on every page with
affiliate links.

Audit of current code showed:
- No `AffiliateDisclosure` component existed.
- Blog post page (`src/app/(frontend)/blog/[slug]/page.tsx`)
  rendered title, excerpt, featured image, and body — no
  disclosure anywhere.
- Footer had no disclosure.
- The content generation prompt did not require the model to
  include a disclosure section.

Any post published before tonight was non-compliant.

## Decision

Put disclosure in three places, structurally, so it cannot be
omitted by accident:

1. **Banner at the top of every blog post page.** First thing
   a reader sees, before the title. `variant="banner"`.
2. **Inline block at the bottom of every post.** After the body,
   before the footer. `variant="inline"`.
3. **Site-wide footer disclosure.** Visible on every page of the
   site, not just reviews. `variant="footer"`.

Additionally, updated the content generation prompt to require
the model to open every generated review with a disclosure
section. This is belt-and-suspenders: even if the template
rendering changes in the future, the disclosure is also present
in the stored markdown body.

## Alternatives considered

- **Single footer disclosure only.** Rejected — footer alone has
  historically been ruled insufficient by the FTC for
  conspicuousness. Top-of-page placement is safer.
- **Global client component banner.** Rejected — server component
  is simpler, no hydration cost, and the content is identical
  for every visitor.
- **Store disclosure as CMS-editable global.** Nice-to-have but
  adds a path to accidentally clearing the field. Hardcoded text
  in the component is safer for the compliance gate. Revisit if
  we want multilingual later.

## Consequences

- Every blog post page now renders the disclosure, regardless of
  post content.
- Every page of the site shows footer disclosure.
- Future template changes that remove disclosure would fail
  editorial review (flagged in `editorial.md` as a production
  incident).
- Schema migration for `affiliateUrl` on Posts is still
  outstanding — tracked in `roadmap.md`.
