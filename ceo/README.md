# /ceo — ClickRank Autonomous CEO Brain

This folder is the persistent memory for the autonomous CEO running
ClickRank overnight. If you're a new CEO reading this cold, start
here, then read the three most recent `journal/` entries, then
`pipeline.md`, `okrs.md`, and `roadmap.md`.

## What ClickRank is

ClickRank (https://clickrank.net) is a review + affiliate platform
for ClickBank digital products. We rank and review products, publish
SEO-optimized pages, and earn commissions when readers click through
our affiliate links to vendor pages.

## Repo layout (quick map)

- `apps/app/` — Next.js 16 + Payload CMS 3 site. Everything user-facing
  lives here.
  - `src/app/(frontend)/` — public pages (home, blog, post, about…)
  - `src/app/api/cron/generate-article/` — THE nightly pipeline entrypoint
  - `src/services/` — pipeline services: `clickbankService.ts` (sourcing),
    `contentGenerationService.ts` (Gemini + Replicate), `humanizationService.ts`
  - `src/collections/` — Payload collections (Posts, Pages, Categories, Tags,
    Media, Users)
  - `src/lib/structured-data.ts` — JSON-LD schema helpers
  - `src/components/` — UI components; `AffiliateDisclosure.tsx` is load-bearing
  - `src/migrations/` — Payload DB migrations (Postgres)
- `reference/` — a 557-folder dump from a prior sister site; a corpus
  for keyword ideas, NOT content to copy.
- `branding-kit/` — logo, colors, visual assets.

## Operating rhythm

See the prompt each night; in short: orient → inspect → advance the
pipeline → scan the outside → pick 1–2 additional focuses → execute →
Slack → close the loop by updating this folder.

## Pipeline state at a glance

See `pipeline.md` for the full run log and architecture. Short version:
we have a nightly Vercel cron at `/api/cron/generate-article` that
picks a ClickBank product, generates a ~1500-word review via Gemini,
humanizes it, generates a featured image via Replicate, and drafts
a post in Payload. It does NOT auto-publish. It has known gaps
(tracked in `pipeline.md`).

## File index

- `README.md` — this file
- `strategy.md` — mission, positioning, bets
- `okrs.md` — current quarter objectives
- `roadmap.md` — now / next / later
- `backlog.md` — ideas, bugs, opportunities
- `pipeline.md` — the pipeline: architecture + run log
- `editorial.md` — editorial standard & voice guide
- `products.md` — ClickBank product inventory & queue
- `seo.md` — SEO state, keywords, debt
- `monetization.md` — affiliate performance
- `metrics.md` — site & traffic metrics
- `competitive.md` — competitors
- `journal/YYYY-MM-DD.md` — nightly journal
- `decisions/NNNN-slug.md` — decision records
- `experiments.md` — hypotheses & results
- `INBOX.md` — outstanding asks for Brandon
