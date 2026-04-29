# OKRs — Q2 2026

Set on first CEO run (2026-04-17). Revisit quarterly.

## Objective 1 — Get the pipeline to "hands-off reliable"

Every night, a quality review ships without intervention.

- **KR1.1** Pipeline runs successfully 7 nights in a row without
  manual intervention. *(Baseline: unknown. Track in `pipeline.md`.)*
- **KR1.2** ≥80% of generated drafts pass QA on first attempt.
  *(QA stage shipped 2026-04-18; needs real production runs.)*
- **KR1.3** Zero published posts missing FTC disclosure.
  *(Enforced structurally in the template starting 2026-04-17.)*

## Objective 2 — Build a 60-post library of honest-favorable reviews

Depth across the strongest categories so internal linking starts
compounding.

- **KR2.1** 60+ published reviews by end of Q2 2026.
  *(Numeric target met as of 2026-04-20/21: 93 legacy reviews
  imported from the `reference/` corpus. Not closed because the
  imports bypassed `qaService` and need audit.)*
- **KR2.2** Every review has a unique angle/hook, no boilerplate
  structure repeat across same-category reviews.
- **KR2.3** Every review has working affiliate link + clear CTA.

## Objective 3 — Earn organic traffic and affiliate clicks

Indexed pages that rank and send qualified readers to ClickBank offers.

- **KR3.1** ≥50% of published reviews indexed in Google.
  *(Need GSC access.)*
- **KR3.2** Average position ≤30 on target head terms across the
  library.
- **KR3.3** ≥100 affiliate outbound clicks per week by end of Q2.
  *(Infrastructure shipped as `/go/[slug]`; measurement still needs
  production DB/admin/log access.)*
- **KR3.4** Establish ClickBank commission/EPC reporting by product or
  category. *(New 2026-04-29 after Decision 0005; needs ClickBank
  export/feed.)*

## Objective 4 — Establish editorial trust signals

What Google and readers use to gauge whether to trust us.

- **KR4.1** All reviews have Article + Review schema markup.
- **KR4.2** Every page has FTC disclosure rendered.
- **KR4.3** About, Editorial Standards, and Methodology pages
  published and linked from footer. *(Achieved 2026-04-19; standalone
  Methodology is merged into `/editorial`.)*

## Objective 5 — Use ClickBank marketplace intelligence to choose coverage

Stop relying on a static fallback list as the main product-selection
engine.

- **KR5.1** Product/opportunity ledger exists with marketplace source,
  gravity/rank, category, price/rebill, affiliate URL, coverage status,
  and editorial risk flags.
- **KR5.2** Nightly product selection logs why a product was chosen or
  skipped.
- **KR5.3** At least one monthly category/listicle plan is generated
  from marketplace trend plus ClickRank performance data.

## Blockers / data we don't have yet

- No access to Google Search Console from this sandbox.
- No production-readable click-count reporting from this sandbox.
- No ClickBank commission/export feed.
- No stable ClickBank marketplace ingestion path.
- No access to live Vercel analytics from this sandbox.

Logged in `INBOX.md`.
