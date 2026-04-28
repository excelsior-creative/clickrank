import React from "react";
import Link from "next/link";
import { BookOpenText, FolderSearch, ShieldCheck } from "lucide-react";

const CARDS = [
  {
    title: "Latest reviews",
    body: "Read the newest ClickBank product breakdowns with clear disclosures, dates, and caveats before you click through.",
    href: "/blog",
    label: "Browse reviews",
    Icon: BookOpenText,
  },
  {
    title: "Category guides",
    body: "Compare offers by niche and intent so you can separate useful products from thin sales-page hype.",
    href: "/blog",
    label: "Explore categories",
    Icon: FolderSearch,
    featured: true,
  },
  {
    title: "Editorial standard",
    body: "See exactly how ClickRank handles affiliate links, AI-assisted drafting, QA checks, and corrections.",
    href: "/editorial",
    label: "How we work",
    Icon: ShieldCheck,
  },
];

export const FeatureCardsSection = () => {
  return (
    <section
      className="relative z-[2] max-w-[1280px] mx-auto px-5 md:px-10"
      style={{ marginTop: "clamp(-28px, -3vw, -18px)" }}
      aria-label="ClickRank shortcuts"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {CARDS.map(({ title, body, href, label, Icon, featured }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-[18px] p-7 md:p-8 min-h-[250px] transition-all hover:-translate-y-1"
            style={{
              background: featured
                ? "linear-gradient(135deg, oklch(58% 0.22 250) 0%, oklch(56% 0.23 285) 48%, oklch(64% 0.25 330) 100%)"
                : "linear-gradient(180deg, var(--color-card) 0%, var(--color-bg-2) 100%)",
              border: featured
                ? "1px solid oklch(75% 0.14 300 / .45)"
                : "1px solid var(--color-rule)",
              boxShadow: featured
                ? "0 28px 80px -40px oklch(68% 0.26 330 / .7)"
                : "0 24px 70px -44px oklch(10% 0.04 255)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 80% 0%, oklch(82% 0.19 165 / .18), transparent 44%)",
              }}
            />
            <div className="relative z-[1] flex h-full flex-col items-center text-center">
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background: featured
                    ? "oklch(100% 0 0 / .12)"
                    : "color-mix(in oklch, var(--color-mint) 12%, transparent)",
                  border: featured
                    ? "1px solid oklch(100% 0 0 / .22)"
                    : "1px solid color-mix(in oklch, var(--color-mint) 35%, transparent)",
                  color: featured ? "var(--color-ink)" : "var(--color-mint)",
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h2
                className="m-0 mb-3"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 27,
                  fontWeight: 420,
                  lineHeight: 1.1,
                  color: "var(--color-ink)",
                }}
              >
                {title}
              </h2>
              <p
                className="m-0 mb-7"
                style={{
                  color: featured
                    ? "oklch(94% 0.015 280)"
                    : "var(--color-ink-2)",
                  fontSize: 14.5,
                  lineHeight: 1.65,
                }}
              >
                {body}
              </p>
              <Link
                href={href}
                className="mt-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium transition-all group-hover:translate-x-0.5"
                style={{
                  background: featured ? "var(--color-mint)" : "transparent",
                  color: featured
                    ? "var(--color-mint-ink)"
                    : "var(--color-mint)",
                  border: featured ? "0" : "1px solid var(--color-rule)",
                }}
              >
                {label}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
