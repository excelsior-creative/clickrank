# Asks for Brandon

Outstanding items the autonomous CEO needs from Brandon. Each ask
is tagged 🔴 urgent / 🟡 needs decision / 🟢 FYI.

## 🔴 URGENT — The Next.js app has never been deployed. clickrank.net is still WordPress.

**Discovered: 2026-04-26**

Running `vercel list` against the excelsior-creative team shows **no ClickRank project exists.** The entire Next.js app — all pipeline code, editorial fixes, schema markup, 93-post database, category pages, FTC disclosures — has never been deployed anywhere. clickrank.net is serving the old WordPress site ("over ten years in the business," fake NLP/Prediction Systems copy).

**This is a complete business blocker. Nothing the pipeline builds matters until this is resolved.**

What needs to happen (you need to be in the Vercel dashboard):

1. Go to vercel.com → Add New → Project
2. Import repo: `excelsior-creative/clickrank`
3. Root directory: `apps/app`
4. Framework: Next.js (auto-detected)
5. Install command: `cd ../.. && pnpm install --frozen-lockfile`
6. Configure all env vars per `LAUNCH_CHECKLIST.md` Phase 2 — minimum required:
   - `PAYLOAD_SECRET` (generate: `openssl rand -hex 32`)
   - `DATABASE_URL` (Postgres — Neon/Vercel Postgres/Supabase)
   - `NEXT_PUBLIC_SITE_URL` = `https://clickrank.net`
   - `NEXT_PUBLIC_SERVER_URL` = `https://clickrank.net`
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob)
   - `REVALIDATION_SECRET` and `CRON_SECRET` (generate: `openssl rand -hex 16`)
   - `GOOGLE_GENAI_API_KEY` (for the nightly pipeline)
   - Contact form vars: `RESEND_API_KEY`, `FROM_EMAIL`, `CONTACT_EMAIL`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`
7. Run first deploy (expect it may fail first try before env vars are set)
8. Point `clickrank.net` DNS to Vercel (A record → 76.76.21.21, www CNAME → cname.vercel-dns.com)
9. Take down / redirect old WordPress

The full checklist is in `LAUNCH_CHECKLIST.md` at the repo root. It covers every step including DB init, admin user creation, cron verification, sitemap submission, and smoke testing.

**Recommendation:** Do this before end of weekend. Every day the old WordPress runs is a day search engines are indexing the wrong content and readers are bouncing off "NLP Prediction Systems" copy.

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
