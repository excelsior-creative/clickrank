# Asks for Brandon

Outstanding items the autonomous CEO needs from Brandon. Each ask
is tagged 🔴 urgent / 🟡 needs decision / 🟢 FYI.

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

### Cron status

- Is the `/api/cron/generate-article` cron currently firing
  successfully in production? I can't see Vercel logs from the
  sandbox. If you could confirm (or paste last-run status into
  `/ceo/journal/`), it closes a blind spot.

## 🟡 Needs decision — process

### Design PRs are shipping fabricated copy — guard rail shipped 2026-04-26

DR-0004's editorial-copy lint shipped tonight as a source-side grep
against `apps/app/src/**` and `apps/app/scripts/**`, wired into a
new GitHub Actions workflow at `.github/workflows/ci.yml` that runs
on every PR to main. Catches the 14 known fabrication patterns
across the three failure classes (invented stats, fake hands-on
testing claims, hash-of-slug score computations). Five files carry
explicit allow-file markers for genuine, qualified uses (denials,
JSDoc documenting killed fabrications, model-prompt negative
examples) — each with a `-- <reason>` that PR review can verify.

What I still need from you:

- **Sanity-check the policy.** Is the banned-substring list the
  right shape, or are there fabrication patterns I should add /
  drop? Source of truth is now `/ceo/editorial.md` ("Automated
  guard rails" section). Adding patterns is one PR.
- **Sanity-check the allow markers.** I added five (TrustRow,
  CommitmentSection, ProcessSection, editorial page,
  contentGenerationService). Each is a deliberate denial or
  negative example. If any of them feel like a fabrication
  smuggling itself in, flag and I'll rework the source copy.
- **GitHub Actions billing.** This is the first workflow on the
  repo. Should be cheap (one ubuntu-latest job, ~1 min). Worth
  knowing what your budget posture is before I add more checks
  (build, tests, etc.) to the same workflow.

## 🟢 FYI

- First CEO run was 2026-04-17. `/ceo` folder scaffolding created.
- FTC disclosure was not being rendered on blog post pages before
  2026-04-17. That's now fixed structurally. Any posts that were
  published before tonight were non-compliant — worth a legal
  scan of anything already indexed. (I don't have visibility
  into what's published.)
- The ClickBank marketplace scraper in `clickbankService.ts` has
  guessed selectors and is very likely silently failing back to
  the 8-product curated list. Not urgent, but worth knowing.
- **Site-level fabrications existed before 2026-04-19**: the home
  page rendered three invented testimonials (Sarah Johnson,
  Michael Chen, Emily Rodriguez), invented stats (500+ products,
  50K+ readers, 4.9/5 trust score), and copy claiming "hands-on
  testing" and a "community of readers". All fixed structurally
  tonight (rewrites + TestimonialsSection deleted). If any of
  those claims were repeated anywhere off-site (social posts,
  newsletter, press), they should be corrected.
- `/editorial` public page is now live and linked from the footer.
  If you want to edit the standard itself, `ceo/editorial.md` is
  the source of truth; the public page is a reader-facing
  distillation.
- `/go/[slug]` outbound tracking is now in place. Events are
  logged to stdout (Vercel logs) as
  `[go] click slug=X product="Y" vendor=Z ref=W ua="…"`. Grep
  that prefix to count clicks for now. Persistence to an
  `outbound-clicks` Payload collection shipped in PR #7 — admin
  can read per-click rows, and rolled-up counts live on
  `Posts.clickCount`.
- **93 legacy reviews are live on prod** as of 2026-04-20/21,
  imported from the `reference/` corpus by
  `scripts/import-reference.ts`. Quality of those 93 hasn't been
  editorially audited — see the "Needs decision" item above.
- **Body-link outbound tracking** is now live as of 2026-04-22
  via a render-time Lexical rewriter at
  `apps/app/src/lib/affiliateLinks.ts`. Every inline
  `hop.clickbank.net` link whose vendor matches the post's
  `affiliateUrl` is redirected through `/go/[slug]`. You should
  see `Posts.clickCount` and the `outbound-clicks` collection
  start ticking up meaningfully once the next deploy rolls out.
  If click counts stay flat after the deploy, something is
  wrong — ping me.
