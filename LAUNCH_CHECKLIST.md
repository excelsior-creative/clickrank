# ClickRank — Production Launch Checklist

> Follow this from top to bottom. Every box should be checked before you
> announce the site publicly. Each step tells you exactly what to do, where to
> click, and how to verify it worked.

**Stack:** Next.js 16 (App Router + Turbopack) · Payload CMS 3 · Postgres · Vercel Blob (media) · Resend (email) · Optional: Gemini + Replicate for the article pipeline.

---

## Phase 0 — Prerequisites (15 minutes)

- [ ] You have admin access to the Vercel team/account that will host the site
- [ ] You have the domain registrar login (for DNS)
- [ ] You have a **Vercel Postgres** database provisioned **OR** a Neon/Supabase/Railway Postgres URL ready
- [ ] You have a Resend account + a verified sending domain (for contact form + transactional email)
- [ ] You have created a **Vercel Blob** store (for media uploads)
- [ ] You have a Google reCAPTCHA v3 key pair for `clickrank.net` (protects the contact form)
- [ ] Optional: Sentry project DSN for error tracking
- [ ] Optional: Google Gemini API key + Replicate API key (if you want the automated article generator)

---

## Phase 1 — Create the Vercel project (10 minutes)

1. Go to **vercel.com → Add New → Project**
2. Import this GitHub repo: `excelsior-creative/clickrank`
3. **Root directory**: select `apps/app`
4. **Framework preset**: Next.js (auto-detected)
5. **Build command**: leave default (`pnpm build`)
6. **Install command**: set to `cd ../.. && pnpm install --frozen-lockfile`
7. **Output directory**: leave default
8. Click **Deploy** but **expect this first deploy to fail** — it has no env vars yet. That's fine.

---

## Phase 2 — Environment variables (20 minutes)

Open **Project Settings → Environment Variables** and add the following. Scope each one to **Production, Preview, and Development** unless noted.

### Required — the site won't boot without these

| Variable | Value | Where to get it |
|---|---|---|
| `PAYLOAD_SECRET` | 64+ random chars | Run `openssl rand -hex 32` |
| `DATABASE_URL` | Full Postgres connection string | Vercel Postgres / Neon / Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://clickrank.net` | Your final public URL |
| `NEXT_PUBLIC_SERVER_URL` | `https://clickrank.net` | Same as above |
| `BLOB_READ_WRITE_TOKEN` | Token from Vercel Blob | Vercel → Storage → your Blob store |

### Required for publishing + cron

| Variable | Value | Notes |
|---|---|---|
| `REVALIDATION_SECRET` | 32+ random chars | `openssl rand -hex 16` — Payload uses this to trigger ISR |
| `CRON_SECRET` | 32+ random chars | `openssl rand -hex 16` — protects `/api/cron/generate-article` |

### Required for the contact form

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | `re_...` from resend.com |
| `RESEND_DEFAULT_FROM_ADDRESS` | `hello@clickrank.net` (or whatever is verified in Resend) |
| `RESEND_DEFAULT_FROM_NAME` | `ClickRank` |
| `FROM_EMAIL` | Same as `RESEND_DEFAULT_FROM_ADDRESS` |
| `CONTACT_EMAIL` | `you@clickrank.net` — where the form emails go |
| `CONTACT_CC` | Optional comma-separated list |
| `CONTACT_BCC` | Optional comma-separated list |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Private reCAPTCHA v3 server key |

### Optional — enable as needed

| Variable | What it enables |
|---|---|
| `SENTRY_DSN` | Error tracking in Sentry |
| `GOOGLE_GENAI_API_KEY` | Automated article generation cron (Gemini) |
| `REPLICATE_API_KEY` | Automated hero images for generated articles |
| `CLICKBANK_EMAIL` + `CLICKBANK_PASSWORD` | Logged-in ClickBank scraping (falls back to hardcoded seed list if absent) |
| `PREVIEW_SECRET` | Draft mode preview for unpublished posts |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD` | Admin user for the initial seed. Only needed if you plan to run the seed script on production. |
| `SEED_MODE` | Set to `minimal` to create skeleton globals only |
| `PAYLOAD_SEED` | Set to `true` on first deploy only if you want seed data auto-inserted |
| `NEXT_PUBLIC_SITE_NAME` | Override site name (defaults to "ClickRank") |

### Verification

- [ ] Count the variables you added — there should be **at least 13 required** (5 core + 2 secrets + 6 contact) plus any optional ones
- [ ] No env var contains the literal text `placeholder`, `changeme`, or `example`
- [ ] Secrets are rotated from any values that appeared in chat, screenshots, or prior deployments

---

## Phase 3 — Run the first production build (5 minutes)

1. Vercel → your project → **Deployments** → click **Redeploy** on the latest
2. Select **"Use existing Build Cache": OFF** for the first full build after env changes
3. Watch the build log. It should succeed without fatal errors.
4. Expected warnings (**safe to ignore**):
   - `middleware file convention is deprecated` — non-blocking, scheduled post-launch refactor
   - `puppeteer` module warnings — the scraper is optional; absence is fine
5. If the build **fails**:
   - `Error: PAYLOAD_SECRET must be set in production` → env var missing
   - `cannot connect to Postgres` → check `DATABASE_URL` format and that the DB is actually reachable from Vercel
   - `cannot resolve 'puppeteer'` → verify `next.config.ts` still has `serverExternalPackages: ["puppeteer"]` (already committed)

- [ ] Build completed green

---

## Phase 4 — Initial database + admin user (10 minutes)

On the first successful deploy, Payload will run migrations automatically.

1. Visit `https://<your-vercel-url>/admin`
2. Create the first admin user when prompted — use a real email and a strong password (16+ chars, stored in a password manager)
3. In the admin UI, populate the following globals (they render in the footer and nav):
   - **Site settings** → site title, favicon, privacy policy, terms of service
   - **Header** → nav items
   - **Footer** → nav items
4. Create at least one category (e.g. "Health & Fitness", "Side Hustle")
5. Publish at least **three** posts so the homepage review grid and featured-pick card have content to show

- [ ] Admin user created
- [ ] Site settings populated
- [ ] Header and footer globals have at least 3 nav items each
- [ ] 3+ posts published with featured images

---

## Phase 5 — Domain + DNS (15 minutes)

1. Vercel → Project → **Settings → Domains**
2. Add `clickrank.net` and `www.clickrank.net`
3. Vercel will show the exact DNS records you need. Typical setup:
   - `clickrank.net` → A record pointing to `76.76.21.21` (Vercel)
   - `www.clickrank.net` → CNAME pointing to `cname.vercel-dns.com`
4. Set **apex `clickrank.net` as the primary**, and redirect `www` → apex
5. SSL certificate issuance happens automatically — wait 2–10 minutes after DNS propagates
6. Verify `https://clickrank.net` loads with a valid lock icon

- [ ] Both hostnames show "Valid Configuration" in Vercel
- [ ] HTTPS works on both hostnames
- [ ] `NEXT_PUBLIC_SITE_URL` env var matches the primary domain — **redeploy if you changed it**

---

## Phase 6 — Cron + scheduled jobs (5 minutes)

The repo's `vercel.json` already declares one daily cron:

```json
{ "path": "/api/cron/generate-article", "schedule": "0 10 * * *" }
```

This runs every day at **10:00 UTC (05:00 ET)** and, if `GOOGLE_GENAI_API_KEY` is set, generates and publishes one new article.

1. Vercel → Project → **Cron Jobs** tab — confirm the job is registered
2. **Manually trigger** it once to verify: `curl -X POST https://clickrank.net/api/cron/generate-article -H "Authorization: Bearer <CRON_SECRET>"`
3. You should see a 200 response and a new post in `/admin/collections/posts`
4. If you do **not** want automated content generation, either:
   - Delete the cron block from `vercel.json` and redeploy, **or**
   - Leave `GOOGLE_GENAI_API_KEY` unset — the job exits cleanly with a log message

- [ ] Cron job is listed in the Vercel UI
- [ ] Manual trigger returns 200 (if you want the job enabled)

---

## Phase 7 — Smoke test the live site (15 minutes)

Open `https://clickrank.net` and verify each of these in a real browser:

### Visual — matches the new design
- [ ] Disclosure strip visible at top with mint pulse dot
- [ ] Navbar: serif "ClickRank·net" brand, search pill, mint Subscribe button
- [ ] Hero: large serif headline with italic mint accent word, featured-pick card on the right with score + verdict pill
- [ ] Trust row: "500+ · 50K+ · 100+ · 4.9/5"
- [ ] Review desk section: 3–9 review cards in a grid with rating bars
- [ ] Process section: 6 numbered cards ("Step 01"–"Step 06")
- [ ] Commitment section: italic "accurate" word in mint, drop-cap first paragraph
- [ ] CTA banner: magenta/violet gradient with newsletter form
- [ ] Footer: 4 columns, dashed FTC disclosure box

### Functional
- [ ] Click a review card → post page renders with banner disclosure + rich text + inline disclosure
- [ ] `/blog` shows all published reviews
- [ ] `/about` renders the About page (hero + process + commitment + CTA)
- [ ] `/contact` — fill out the form and verify the email arrives at `CONTACT_EMAIL`
- [ ] Search icon in the nav opens the search dialog, typing returns results
- [ ] `/privacy` and `/terms` render (even if empty, they should not 500)
- [ ] Nav "Subscribe" button opens `/contact` or the newsletter banner
- [ ] Hit an intentionally invalid URL like `/not-a-real-page` → custom 404 appears (not the default Next.js page)
- [ ] Open `/admin`, log in, view the Posts collection

### Performance (Lighthouse, run once)
- [ ] Lighthouse Performance ≥ 85 on desktop, ≥ 70 on mobile
- [ ] LCP < 2.5s, CLS < 0.1
- [ ] No console errors on the homepage

---

## Phase 8 — SEO + discoverability (10 minutes)

- [ ] `https://clickrank.net/sitemap.xml` returns XML with all published posts
- [ ] `https://clickrank.net/robots.txt` returns a sane robots file disallowing `/admin` and `/api`
- [ ] `https://clickrank.net/feed.xml` returns RSS 2.0
- [ ] View-source on a blog post — confirm `<script type="application/ld+json">` with `Article` schema is present
- [ ] Submit the sitemap to **Google Search Console** (search.google.com/search-console)
- [ ] Submit to **Bing Webmaster Tools** (bing.com/webmasters)
- [ ] Replace the default favicon by dropping a `favicon.ico` into `apps/app/public/`
- [ ] Add an Open Graph image at `apps/app/public/og-image.jpg` (1200×630 px) — metadata already references `/og-image.jpg`
- [ ] Share a URL in Slack/iMessage/Twitter and confirm the OG preview looks right

---

## Phase 9 — Security + reliability (15 minutes)

### Security headers
- [ ] `curl -I https://clickrank.net/` shows `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Admin path `/admin` redirects unauthenticated users to login
- [ ] reCAPTCHA token is being issued on the contact form (open DevTools → Network → submit form → see `google.com/recaptcha` call)

### Rate limiting
- [ ] Submitting the contact form more than 60× in a minute returns a 429 (middleware-enforced)
- **Note:** Rate-limit state is in-memory per serverless instance. For very high traffic, migrate to Upstash Redis. Non-blocking for launch.

### Backups
- [ ] Enable daily automatic backups on your Postgres provider (Vercel Postgres does this by default)
- [ ] Note the backup retention window in your password manager

### Error monitoring
- [ ] If `SENTRY_DSN` is set, trigger a deliberate error (e.g. visit `/admin/not-real`) and confirm it shows up in Sentry
- [ ] Otherwise, add an uptime monitor (better-stack.com, uptimerobot.com) pinging `/` every 5 minutes

---

## Phase 10 — Post-launch monitoring (ongoing)

### First 24 hours
- [ ] Watch Vercel → **Observability** → Logs for any 5xx responses
- [ ] Watch Vercel → **Analytics** for unusual traffic or bounce rates
- [ ] Manually submit the contact form once per browser (Chrome, Safari, Firefox, mobile Safari)
- [ ] Watch Postgres connection count — should stay well below the plan limit

### First week
- [ ] Confirm the daily cron article landed in the admin
- [ ] Review the first few auto-generated articles for quality — edit/unpublish anything that's off
- [ ] Check Google Search Console for crawl errors
- [ ] Run a Lighthouse audit again with real traffic data

### Maintenance cadence
- [ ] **Weekly**: review Sentry / server logs, publish or edit reviews
- [ ] **Monthly**: run `pnpm outdated` in `apps/app`, upgrade patch versions
- [ ] **Quarterly**: review FTC disclosure copy, update editorial standards page, refresh top-ranked reviews

---

## Known deferred items

These are intentionally **not** launch blockers, but they're on the post-launch list:

- **Middleware deprecation warning** — Next.js 16 prefers the new "proxy" convention. The current `src/middleware.ts` still works through at least Next 17. Migrate when convenient.
- **In-memory rate limiting** — fine for the traffic level of a new site, but migrate to Upstash Redis (or similar) before you hit ~10k req/min sustained.
- **Puppeteer-based ClickBank scraper** — build warning only. Runtime dynamically imports puppeteer and gracefully falls back. Install `puppeteer` as a full dependency if you want the live scrape path to run.
- **Newsletter subscribe form** — the hero / CTA banner currently show a "Subscribed ✓" confirmation but do not hit a mailing-list provider. Wire up Mailchimp, Resend Audiences, or similar before promoting the newsletter publicly.
- **Theme toggle** — `ThemeToggle.tsx` and `next-themes` are wired in, but the new design is dark-first. You can expose the toggle if/when you ship a companion light theme.

---

## Emergency rollback

If something catastrophic happens after launch:

1. Vercel → Deployments → find the last known-good deployment → click **"Promote to Production"**
2. Takes ~15 seconds. Production traffic swings back immediately.
3. File a follow-up commit to fix the issue on a new branch, re-deploy, promote again.

Do **not** use `git push --force` to the main branch to roll back — it desyncs the Payload migrations. Use Vercel's deployment pinning instead.

---

## Sign-off

- [ ] All Phase 1–9 boxes checked
- [ ] You can show a loaded page at `https://clickrank.net` with real published content
- [ ] The contact form successfully delivered an email to you from a real test submission
- [ ] You have a password-manager entry for: admin login, PAYLOAD_SECRET, database URL, CRON_SECRET, REVALIDATION_SECRET

**Launched:** ______________ (date) by ______________ (you)
