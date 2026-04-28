import React from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "What is ClickRank?",
    a: "ClickRank is an independent, affiliate-disclosed review site focused on digital products sold through ClickBank and similar marketplaces.",
  },
  {
    q: "Does ClickRank buy and test every product?",
    a: "No. Reviews are analysis-driven unless a page explicitly says otherwise. We read sales pages, capture vendor-stated claims, check structure and disclosure, and avoid pretending to have hands-on experience we do not have.",
  },
  {
    q: "How does ClickRank make money?",
    a: "Some outbound links are affiliate links. If you buy through one, ClickRank may earn a commission at no extra cost to you. That relationship is disclosed on every relevant page.",
  },
  {
    q: "Can I trust a review if it contains affiliate links?",
    a: "Affiliate links create an incentive, so we make the incentive visible and use editorial rules that require real caveats, corrections, and no fabricated outcomes or testimonials.",
  },
  {
    q: "How are corrections handled?",
    a: "If a product changes or a reader spots an inaccuracy, the page should be corrected rather than quietly rewritten. Corrections and tips can be sent through the contact page.",
  },
  {
    q: "Where should I start?",
    a: "Start with recent reviews, then use categories to compare products in the same niche. Read the editorial standard if you want the full methodology first.",
  },
];

export const FAQSection = () => {
  return (
    <section
      id="faqs"
      className="max-w-[1280px] mx-auto px-5 md:px-10"
      style={{ padding: "clamp(72px, 9vw, 120px) 0" }}
    >
      <div className="mx-auto max-w-[760px] text-center">
        <p
          className="m-0 mb-3 font-mono"
          style={{
            color: "var(--color-mint)",
            fontSize: 11.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          FAQ
        </p>
        <h2
          className="m-0 mb-4"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 380,
            fontSize: "clamp(34px, 4.6vw, 58px)",
            lineHeight: 1.04,
            letterSpacing: "-0.022em",
            color: "var(--color-ink)",
          }}
        >
          Frequently asked questions.
        </h2>
        <p
          className="m-0"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-ink-2)",
            fontSize: 18,
            lineHeight: 1.6,
          }}
        >
          Straight answers about the review process, affiliate model, and what
          ClickRank can — and cannot — claim.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {FAQS.map((faq, index) => (
          <details
            key={faq.q}
            open={index === 0 || index === 1}
            className="group overflow-hidden rounded-[16px]"
            style={{
              background: "var(--color-card)",
              border: "1px solid var(--color-rule)",
            }}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium marker:hidden"
              style={{
                color: "var(--color-ink)",
              }}
            >
              <span>{faq.q}</span>
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-45"
                style={{
                  background:
                    "color-mix(in oklch, var(--color-mint) 14%, transparent)",
                  color: "var(--color-mint)",
                }}
              >
                +
              </span>
            </summary>
            <div
              className="px-6 pb-6 pt-0"
              style={{
                color: "var(--color-ink-2)",
                fontFamily: "var(--font-serif)",
                fontSize: 16.5,
                lineHeight: 1.65,
              }}
            >
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-all hover:-translate-y-px hover:mint-glow"
          style={{
            background: "var(--color-mint)",
            color: "var(--color-mint-ink)",
          }}
        >
          Ask a correction question
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
};
