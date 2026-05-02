# Asks for Brandon

Outstanding items the autonomous CEO needs from Brandon. Each ask
is tagged 🔴 urgent / 🟡 needs decision / 🟢 FYI.


**Added: 2026-04-27. Updated: 2026-04-29.**

`ceo/next.md` currently has zero ready specs. `ceo/specs/` contains the uploaded editorial design spec, but it is already marked `status: complete`; there is still no executable ready queue. Under the BOS guardrail, the nightly CEO must stop rather than invent roadmap work.

Update from 2026-04-29: PR #18 (`fix(lint): use Next flat ESLint config`) has merged to `main`, so the prior ESLint flat-config candidate is complete and should not be re-queued.

## 🟡 Needs decision — Approve ClickBank marketplace intelligence loop

**Added: 2026-04-29**

Brandon clarified that ClickRank should capture informational search
traffic and upsell qualified readers through affiliate links that pay us
when buyers convert. The next strategy gap is marketplace intelligence:
we need to know what is happening and trending inside ClickBank so the
pipeline maximizes exposure to products with demand, commission upside,
and acceptable editorial risk.

1. **Launch validation + production cutover support** — after Brandon creates the Vercel project and configures env/DNS, execute the repo's `LAUNCH_CHECKLIST.md`: verify deploy, smoke-test live pages, confirm cron registration/manual trigger, and document any launch blockers.
2. **Editorial-copy lint gate completion** — formalize DR-0004 / draft PR #13 as a ready spec: review scope, finish any required cleanup, run verification, and move the fabrication-copy CI guardrail toward merge.
3. **Rating + verdict fields on Posts** — convert the backlog item into a scoped migration/rendering spec so PostCard and featured-card scores come from real editorial data instead of placeholders.
4. **Legacy review QA audit script** — create a script/report spec for the 93 imported posts that bypassed `qaService`, with execution gated on DB access or a Vercel-side run path.

Recommended first two: launch validation, then editorial-copy lint gate completion for PR #13 now that the lint configuration is fixed on `main`.

Proposed spec: `ceo/specs/2026-04-29-clickbank-marketplace-intelligence-loop.md`.

Decision needed before implementation:

1. Approve this as R2 ready work after production launch blockers are
   handled.
2. Choose the initial ingestion path: authenticated marketplace scrape,
   Brandon-provided ClickBank export/CSV, or curated manual top-product
   feed.
3. Provide a readable commission/export feed if we want EPC and
   revenue-based optimization instead of click-only optimization.

---
## ✅ Resolved — Ready specs queued for autonomous CEO work

**Added: 2026-04-27. Resolved: 2026-05-02.**

Brandon's 2026-05-02 “review and move the project forward” request authorized converting the safest recommended backlog items into ready work. `ceo/next.md` now has two ready specs:

1. `ceo/specs/2026-05-02-production-launch-validation.md` — validate the live public-domain launch and capture remaining launch blockers.
2. `ceo/specs/2026-05-02-editorial-copy-lint-gate-completion.md` — recover/finish DR-0004 and stale draft PR #13.

The ClickBank marketplace intelligence loop remains proposed/R2 until Brandon approves the ingestion approach and data-access path.

---

## 🟡 Needs follow-up — Production launch validation/content activation

**Discovered: 2026-04-26. Updated: 2026-05-02.**

Status changed: `https://clickrank.net` now serves the Vercel Next.js/Payload app, not the old WordPress/SiteGround site. Initial checks on 2026-05-02 returned `server: Vercel`, `x-powered-by: Next.js, Payload`, the title `ClickRank | Honest ClickBank Product Reviews`, and `200` responses for the main public routes.

Remaining launch work is no longer DNS cutover; it is final validation and content/admin/cron/access confirmation:

1. Execute `ceo/specs/2026-05-02-production-launch-validation.md` against `LAUNCH_CHECKLIST.md`.
2. Confirm whether production has intended published reviews/content. Current launch validation found the homepage showing `0` reviews and `0` categories, `/blog` empty aside from the heading, `sitemap.xml` containing only 7 static URLs, and `feed.xml` containing 0 items. This is the primary public-launch blocker if content is supposed to be live.
3. Confirm/replace possible placeholder publisher/legal copy: homepage/footer visual inspection showed `© 2026 My Site Media Co.`.
4. Verify admin access, contact-form delivery, Vercel Cron registration, and production env vars from the Vercel/Payload dashboards.
5. Confirm GSC/Bing sitemap submission and analytics access once launch validation is complete.

---

## 🟡 Needs decision

### Audit the 93 legacy-imported reviews?

- 93 posts were imported to production as published on 2026-04-20/21
  via `scripts/import-reference.ts` and bypassed the QA gate. Their
  editorial voice, fabrication tells, and forbidden-claim status are
  all unvetted. I can write an audit script that runs `qaService`
  against every published post and emits a report of failures —
  but I need DB access (or a Vercel-side trigger and log dump) to
  run it. Want me to prepare the script now and hand off execution?
  Alternatively, have the next engineer run it with prod creds.

### PR #13 — editorial-copy lint gate (ready to review)

- Draft PR opened 2026-04-26. Adds a GHA CI workflow that scans all
  source files for known-bad fabrication substrings before merge.
  This is the DR-0004 fix that prevents future design PRs from
  re-shipping fabricated copy. Low-risk, no infra changes.
- When you have a moment, review and mark ready for review so it can merge.

### Data access

- Google Search Console access (read-only API credential or nightly
  CSV dump to a path I can read). Without this, KR3.1–KR3.2 can't
  be measured.
- ClickBank affiliate commission export — weekly CSV would be ideal.
  Without this, no EPC data, no conversion truth.
- Vercel analytics / deployment logs — even a read-only viewer
  token exposed as an env var I can query would work.
- Read-only Postgres (Neon) connection string so I can run audit
  queries each night (`SELECT count(*), max(publishedDate) FROM posts…`).

### Cron status (now moot until Vercel deploy happens)

- Once deployed: confirm `/api/cron/generate-article` is firing in
  Vercel Cron Jobs tab. I'll need a confirmation (or paste of cron
  run log) to close the blind spot.

---

## 🟢 FYI

- First CEO run was 2026-04-17. `/ceo` folder scaffolding created.
- FTC disclosure was not being rendered on blog post pages before
  2026-04-17. That's now fixed structurally. Any posts that were
  published before tonight were non-compliant — worth a legal
  scan of anything already indexed. (WordPress site may have indexed
  non-compliant pages; see above.)
- The ClickBank marketplace scraper in `clickbankService.ts` has
  guessed selectors and is very likely silently failing back to
  the product list. Not urgent, but worth knowing.
- **Site-level fabrications existed before 2026-04-19**: the home
  page rendered three invented testimonials, invented stats (500+
  products, 50K+ readers, 4.9/5 trust score), and copy claiming
  "hands-on testing" and a "community of readers". All fixed
  structurally on the Next.js app now serving `clickrank.net`; the
  remaining risk is any unaudited published content, not the site chrome.
- `/editorial` public page is live and linked from the footer on the
  public `clickrank.net` deployment.
- `/go/[slug]` outbound tracking is in place in code.
- **93 legacy reviews in Payload** (imported 2026-04-20/21) — quality
  unaudited; body-link tracking is in but FTC compliance of the
  original content is unknown.
- **PR #14 merged 2026-04-26**: affiliate hop links fixed + product
  list expanded to 25. The pipeline is ready to run.
