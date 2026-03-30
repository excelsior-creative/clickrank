# ClickRank — App

ClickBank affiliate review site built with Next.js + Payload CMS.

## Environment Variables

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `PAYLOAD_SECRET` | Payload CMS secret |
| `CRON_SECRET` | Bearer token for cron route authentication |

### AI Content Pipeline

| Variable | Description |
|---|---|
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key — used for all text generation (article writing, tag suggestions) |
| `REPLICATE_API_KEY` | Replicate API key — used for featured image generation |

### ClickBank Scraping (optional)

| Variable | Description |
|---|---|
| `CLICKBANK_EMAIL` | ClickBank account email for marketplace login |
| `CLICKBANK_PASSWORD` | ClickBank account password |

> If `CLICKBANK_EMAIL` / `CLICKBANK_PASSWORD` are not set, the cron falls back to a curated list of proven top-selling ClickBank products.

### Other

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Resend email API key for contact forms |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key |
| `SENTRY_DSN` | Sentry DSN (optional) |

## AI Content Pipeline

The cron endpoint `GET /api/cron/generate-article` runs nightly and:

1. **Fetches trending ClickBank products** from the marketplace (or falls back to static data)
2. **Picks an uncovered product** — avoids topics already in recent posts
3. **Generates an affiliate review article** using Google Gemini (`gemini-2.5-flash-preview`)
4. **Humanizes the content** — strips AI tells, adds contractions and natural flow
5. **Generates a featured image** via Replicate (`google/nano-banana-pro`)
6. **Uploads to Payload CMS** and creates a draft post

### Trigger manually

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://your-domain.com/api/cron/generate-article
```

## Development

```bash
pnpm dev
```

## Type Check

```bash
pnpm type-check
```
