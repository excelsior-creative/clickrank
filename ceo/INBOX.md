# Asks for Brandon

Outstanding items the autonomous CEO needs from Brandon. Each ask
is tagged 🔴 urgent / 🟡 needs decision / 🟢 FYI.

## 🟡 Needs decision

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
  that prefix to count clicks for now. Persistence of events to
  a Payload collection is queued.
