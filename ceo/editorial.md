# ClickRank Editorial Standard

Derived from the Honest-Favorable standard set at CEO inception.
This is a **living document.** Update when we learn something
new about what works.

## Voice

- Conversational, direct, confident.
- "We" when stating the site's position; "you" when addressing
  the reader.
- No em-dash abuse, no em-dashes at all actually (AI tell). Use
  commas and short sentences.
- Contractions OK (it's, don't, they're). Preferred over formal.
- No exclamation marks in body copy (except quoted testimonials).
- Headings: sentence case, not Title Case.

## Fabrication rules (non-negotiable)

- **Never** invent features, benefits, statistics, study results,
  testimonials, or user quotes.
- **Never** claim first-person experience we didn't have.
  "I tried X for 30 days" is prohibited unless there was actual
  testing and review notes exist. Prefer "In our analysis" /
  "Looking at user feedback" when describing research-driven takes.
- **Never** make medical, financial, or income claims ("cures",
  "guaranteed", "lose X lbs", "earn $Y"). Present as vendor
  claims ("X says the program…") if they have to appear.
- **Never** review a product we'd be embarrassed to be seen
  promoting. Log the skip in `products.md`.

## Structure (standard review)

Target ~1500 words. Standard sections:

1. Opening paragraph — the product in one sentence + the claim it's
   making. No "In today's world…" intros.
2. **Who it's for** — concrete persona(s).
3. **What you actually get** — features, tangible deliverables.
4. **What's good about it** — 3–5 real strengths.
5. **What could be better** — 1–2 honest caveats. Constructive tone.
6. **Pricing and what it includes** — price, upsells, rebills,
   refund window.
7. **Bottom line** — who should buy, who should skip.
8. **Affiliate CTA** — with disclosure reminder.

Depart from this template whenever a specific product has a more
interesting shape (e.g., comparison posts, category roundups). Don't
torture a product into the template.

## FTC affiliate disclosure (mandatory)

Every page with affiliate links MUST render `AffiliateDisclosure`.
Currently this is:

1. A banner at the top of every blog post page.
2. A one-line notice in the site footer.
3. A disclosure paragraph within the markdown body (baked in by
   the content generation prompt).

A post template shipping without this is a production incident.

## Schema markup requirements

Every review must emit:
- `BlogPosting` / `Article` schema (via `generateArticleSchema`).
- `BreadcrumbList` for `Home > Blog > Post Title`.

Future (when `affiliateUrl` and rating fields land):
- `Product` schema with name, image, description.
- `Review` schema with reviewRating and author.

## Internal linking

- Every review should link to at least 2 related reviews if they
  exist. (To be automated — see roadmap.)
- Every category mention in body text should be a link to the
  category hub page (when category hub pages exist).

## CTA patterns

- Primary CTA: "Check current pricing on [Product]" → affiliate URL.
- Secondary CTA: "Read our related reviews in [Category]".
- Never use urgency manipulation ("Only 3 spots left!", "Price
  doubles at midnight"). Readers detect it, and so does Google.

## Length & SEO

- ~1500 words is the default target. Don't pad to hit it. A 900-word
  post that's honest beats a 1500-word post of filler.
- Title tag ≤60 chars. Meta description ≤160 chars.
- One H1 (the title). H2s for major sections. H3s for subsections
  within those.
