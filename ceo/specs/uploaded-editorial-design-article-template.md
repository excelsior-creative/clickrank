---
title: Uploaded editorial design article template
risk_tier: R1
status: complete
source: Slack upload `ClickRank.net (1).zip`
---

# Uploaded editorial design article template

## Goal

Implement the uploaded ClickRank editorial design direction in the Next.js app, especially the supplied `ClickRank Review.html` detail-page treatment.

## Scope

- Keep the homepage truthful while extending it toward the uploaded design system; do not reintroduce fabricated stats/testimonials/testing claims from the static mockup.
- Add uploaded-design homepage support sections:
  - three-card review/category/editorial shortcut band
  - FAQ section with truthful affiliate/editorial answers
  - responsive footer/nav polish
- Update the post detail template to better match the uploaded review-page design:
  - full-width atmospheric review header
  - category/date/disclosure metadata row
  - prominent editorial title/dek treatment
  - right-side “at a glance” summary card
  - wider article canvas with sticky supporting sidebar
  - repeated affiliate CTA only when a real affiliate URL exists
- Do not introduce unsupported ratings, fake hands-on testing, invented prices, fabricated author claims, or fake review counts.

## Acceptance checks

- `pnpm --filter app type-check` passes.
- `pnpm --filter app build` passes against a local Postgres verification database.
- Browser QA passes for `/` and a representative `/blog/[slug]` review page with realistic post metadata/affiliate CTA state.
- `pnpm --filter app lint` remains blocked only by the existing repo ESLint 9 circular-config issue, before file-level linting runs.
