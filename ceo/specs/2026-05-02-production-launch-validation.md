---
title: Production launch validation and public-domain hardening
status: ready
risk_tier: R1
owner: Quinn
reviewer: Timmy
created: 2026-05-02
source:
  - LAUNCH_CHECKLIST.md
  - ceo/INBOX.md
---

# Production launch validation and public-domain hardening

## Outcome

ClickRank's public production launch is validated from the real custom domain, with remaining launch blockers documented as actionable follow-up items instead of a stale “not deployed” blocker.

## Current state

As of 2026-05-02, `https://clickrank.net` is no longer serving the old WordPress/SiteGround site. DNS resolves through Vercel and the public domain returns the Next.js/Payload app with the title `ClickRank | Honest ClickBank Product Reviews`.

Initial verification already performed:

- `dig +short clickrank.net A` returns Vercel DNS IPs (`216.150.1.193`, `216.150.16.193`).
- `dig +short www.clickrank.net A` resolves through Vercel DNS.
- `curl -I -L https://clickrank.net` returns `HTTP/2 200`, `server: Vercel`, and `x-powered-by: Next.js, Payload`.
- Browser smoke for `/` loads the new ClickRank homepage.
- HTTP checks return `200` for `/`, `/editorial`, `/blog`, `/about`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt`, and `/feed.xml`.
- `/go/custom-keto-diet` returns a `302` to the expected ClickBank hoplink.

## Scope

- Re-run the public-domain smoke checks from `LAUNCH_CHECKLIST.md` Phase 5, Phase 7, Phase 8, and relevant Phase 9 items.
- Verify both apex and `www` hosts resolve to Vercel and return HTTPS successfully.
- Confirm the homepage, editorial page, blog index, about/contact/privacy/terms, sitemap, robots, RSS feed, and one `/go/[slug]` redirect behave as expected.
- Check whether published content is present; if the site still has `0` reviews published, document the content activation blocker.
- Check browser console on the homepage and one important secondary page for runtime errors.
- Confirm launch-critical headers are present (`Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- Document what cannot be verified without credentials or manual dashboard access, especially admin login, contact-form email delivery, Vercel Cron status, production env vars, analytics, and Search Console submission.

## Non-goals

- No DNS changes unless Brandon separately approves and provides access.
- No production env var changes.
- No admin/content mutations.
- No manual cron trigger unless `CRON_SECRET` and intent to generate content are explicitly approved.
- No public launch announcement.

## Acceptance criteria

- [ ] Apex `https://clickrank.net` and `https://www.clickrank.net` both return the Vercel Next.js app over HTTPS.
- [ ] Public pages `/`, `/editorial`, `/blog`, `/about`, `/contact`, `/privacy`, `/terms`, `/sitemap.xml`, `/robots.txt`, and `/feed.xml` return non-error status codes.
- [ ] At least one outbound `/go/[slug]` route redirects to the intended ClickBank hoplink without leaking secrets.
- [ ] Browser smoke finds no blocking homepage console errors.
- [ ] Security headers are present on the public domain.
- [ ] Remaining unverified launch checklist items are moved into `ceo/INBOX.md` with exact owner/access needed.
- [ ] `ceo/journal/YYYY-MM-DD.md` records the verification evidence and final launch status.

## Verification plan

- `dig +short clickrank.net A`
- `dig +short www.clickrank.net A`
- `curl -I -L https://clickrank.net`
- `curl -L -s -o /dev/null -w '%{http_code}'` for the public URL set in scope.
- Browser smoke of `/` and one secondary page.
- Header check with `curl -I`.
- `git diff --check` for any documentation updates.

## Restart notes

Start from `LAUNCH_CHECKLIST.md` and the 2026-05-02 journal. Do not rely on the older “not deployed” blocker without re-checking DNS and headers; the current blocker appears to have moved from DNS cutover to final launch/content/admin/cron verification.
