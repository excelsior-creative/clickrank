# Asks for Brandon

Outstanding items the autonomous CEO needs from Brandon. Each ask
is tagged 🔴 urgent / 🟡 needs decision / 🟢 FYI.


## 🟡 Needs decision — Approve ClickBank marketplace intelligence loop

**Added: 2026-04-29**

Brandon clarified that ClickRank should capture informational search
traffic and upsell qualified readers through affiliate links that pay us
when buyers convert. The next strategy gap is marketplace intelligence:
we need to know what is happening and trending inside ClickBank so the
pipeline maximizes exposure to products with demand, commission upside,
and acceptable editorial risk.

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
## 🟡 Needs decision — Queue ready specs for autonomous CEO work

**Added: 2026-04-27. Updated: 2026-04-30.**

`ceo/next.md` currently has zero ready specs. `ceo/specs/` contains the uploaded editorial design spec, but it is already marked `status: complete`; the new ClickBank marketplace intelligence loop spec is still `status: proposed` / R2 and needs Brandon approval of the ingestion approach before implementation. Under the BOS guardrail, the nightly CEO must stop rather than invent roadmap work.

Status cleanup: PR #18 (`fix(lint): use Next flat ESLint config`) merged into `main` before this run, so it is no longer a valid ready-spec candidate. Open PR #20 is a stale/conflicting nightly status PR, and PR #13 remains draft for the editorial-copy lint gate.

Please approve at least two of these backlog-to-spec conversions and add them to `ceo/next.md > Ready`:

1. **Launch validation + production cutover support** — after Brandon creates the Vercel project and configures env/DNS, execute the repo's `LAUNCH_CHECKLIST.md`: verify deploy, smoke-test live pages, confirm cron registration/manual trigger, and document any launch blockers.
2. **Editorial-copy lint gate completion** — formalize DR-0004 / draft PR #13 as a ready spec: review scope, finish any required cleanup, run verification, and move the fabrication-copy CI guardrail toward merge.
3. **ClickBank marketplace intelligence loop** — approve the R2 spec and choose the initial ingestion path: authenticated marketplace scrape, Brandon-provided ClickBank export/CSV, or curated manual top-product feed.
4. **Rating + verdict fields on Posts** — convert the backlog item into a scoped migration/rendering spec so PostCard and featured-card scores come from real editorial data instead of placeholders.
5. **Legacy review QA audit script** — create a script/report spec for the 93 imported posts that bypassed `qaService`, with execution gated on DB access or a Vercel-side run path.

Recommended first two: launch validation, then editorial-copy lint gate completion. Marketplace intelligence should follow once Brandon approves the data-access path.

---

## 🔴 URGENT — Production deployment exists, but public DNS still serves old WordPress

**Discovered: 2026-04-26. Updated: 2026-05-02.**

Status changed since the original blocker: a ClickRank Vercel production deployment now exists under `excelsior-creative/clickrank` (`https://clickrank-3hyemqy4p-excelsior-creative.vercel.app`, Ready, observed in paged `vercel ls` on 2026-05-02). The blocker is now the custom-domain cutover, not project creation.

`https://clickrank.net` and `www.clickrank.net` still resolve to the old SiteGround/WordPress IP (`35.215.116.196`) and the live headers expose WordPress (`x-pingback`, `wp-json`, nginx/SiteGround cache markers). Search engines and readers are still seeing the old WordPress site even though the Next.js app is deployed on Vercel.

**Remaining required action:** update Cloudflare/DNS for the public domain, then re-run launch validation.

1. In Cloudflare/DNS, point apex `clickrank.net` to Vercel: `A @ -> 76.76.21.21`.
2. Point `www` to Vercel: preferably `CNAME www -> cname.vercel-dns.com` (or Vercel's shown record).
3. Keep records DNS-only/gray-cloud until Vercel validates SSL, unless Vercel/Cloudflare proxy settings are intentionally configured.
4. Confirm Vercel shows `clickrank.net` and `www.clickrank.net` as valid domains and set apex as primary.
5. Re-verify with `dig`, `curl -I -L https://clickrank.net`, browser smoke on `/`, `/editorial`, `/blog/...`, and `/go/[slug]` behavior.
6. Then queue/execute the launch-validation spec in `ceo/next.md` so cron registration, admin/content state, sitemap, and contact form checks happen from the correct public domain.

The full checklist remains in `LAUNCH_CHECKLIST.md`.

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
  structurally on the Next.js app (which still isn't live).
- `/editorial` public page is now live in the code. Once deployed,
  it will be linked from the footer.
- `/go/[slug]` outbound tracking is in place in code.
- **93 legacy reviews in Payload** (imported 2026-04-20/21) — quality
  unaudited; body-link tracking is in but FTC compliance of the
  original content is unknown.
- **PR #14 merged 2026-04-26**: affiliate hop links fixed + product
  list expanded to 25. The pipeline is ready to run.
