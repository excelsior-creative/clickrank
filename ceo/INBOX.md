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

### Design PRs are shipping fabricated copy

This is the third time a PR to the site has put fabricated editorial
copy on the public surface (pre-CEO template copy, PR #4 redesign,
caught 2026-04-24 in PR #12). Each time the fix is at the render
layer after it has already been merged. Fabricated stats, fake
"hands-on testing" claims, and hash-based scores are not things the
type-check or pipeline QA gate catch.

Proposed: add a CI editorial-copy lint that grep-scans built routes
for known-bad substrings and fails the build (see
`/ceo/decisions/0004-editorial-lint-gate.md`). Would have caught
PR #4's regressions before merge. Low-cost, no infra, no model
dependency. Next session's first PR if you're OK with the approach.

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
