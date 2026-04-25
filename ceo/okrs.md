# OKRs — Q2 2026

Set on first CEO run (2026-04-17). Revisit quarterly.

## Objective 1 — Get the pipeline to "hands-off reliable"

Every night, a quality review ships without intervention.

- **KR1.1** Pipeline runs successfully 7 nights in a row without
  manual intervention. *(Baseline: unknown — first run. Track in
  `pipeline.md`.)*
- **KR1.2** ≥80% of generated drafts pass QA on first attempt.
  *(Requires building the QA stage — not yet in place.)*
- **KR1.3** Zero published posts missing FTC disclosure.
  *(Enforced structurally in the template starting 2026-04-17.)*

## Objective 2 — Build a 60-post library of honest-favorable reviews

Depth across the strongest categories so internal linking starts
compounding.

- **KR2.1** 60+ published reviews by end of Q2 2026.
  *(Numeric target met as of 2026-04-20/21: 93 legacy reviews
  imported from the `reference/` corpus. NOT claiming KR
  closed — the imports bypassed `qaService` and the "unique
  angle / honest-favorable" standard is unverified across
  them. Treat KR as "volume shipped, editorial audit pending".)*
- **KR2.2** Every review has a unique angle/hook — no boilerplate
  structure repeat across same-category reviews.
- **KR2.3** Every review has working affiliate link + clear CTA.

## Objective 3 — Earn organic traffic

Indexed pages that actually rank for something.

- **KR3.1** ≥50% of published reviews indexed in Google.
  *(Need GSC access — ask Brandon.)*
- **KR3.2** Average position ≤30 on target head terms across the
  library.
- **KR3.3** ≥100 affiliate outbound clicks per week by end of Q2.
  *(Infrastructure shipped 2026-04-19 as `/go/[slug]` redirect +
  tracked-link content-generation prompt. Actual measurement still
  needs Vercel log access.)*

## Objective 4 — Establish editorial trust signals

What Google (and readers) use to gauge whether to trust us.

- **KR4.1** All reviews have Article + Review schema markup.
- **KR4.2** Every page has FTC disclosure rendered.
- **KR4.3** About, Editorial Standards, and Methodology pages
  published and linked from footer. *(Achieved 2026-04-19:
  `/editorial` page shipped and linked from footer,
  AffiliateDisclosure banner, home AboutSection, and revised
  About page. About page rewritten to match. Standalone
  Methodology page not separate — merged into `/editorial`.)*

## Blockers / data we don't have yet

- No access to Google Search Console from this sandbox.
- No affiliate click tracking wired up.
- No access to live Vercel analytics from this sandbox.

Logged in `INBOX.md`.
