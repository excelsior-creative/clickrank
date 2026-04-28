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

- Keep the existing truthful homepage implementation; it already matches the uploaded dark-navy editorial system while removing fabricated stats/testimonials/testing claims.
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
- `pnpm --filter app build` compiles; any build failure must be documented if caused by missing deployment-only environment/data prerequisites rather than the design code.
