import React from "react";
import Link from "next/link";

type FeaturedPick = {
  category?: string;
  title: string;
  take: string;
  score: number;
  verdict?: "Recommended" | "With caveats" | "Skip" | string;
  byline?: string;
  date?: string;
  href?: string;
  wordCount?: number;
};

type HeroProps = {
  issue?: string;
  featured?: FeaturedPick;
};

const DEFAULT_FEATURED: FeaturedPick = {
  category: "Editor's Pick",
  title: "Read the latest review from the desk",
  take:
    "We're reviewing the products selling on ClickBank right now — the ones that work, the ones that don't, and the ones buried under three upsells.",
  score: 8.4,
  verdict: "Recommended",
  byline: "The ClickRank desk",
  date: "This week",
  href: "/blog",
  wordCount: undefined,
};

const barSegments = (score: number) => {
  const filled = Math.round(Math.max(0, Math.min(10, score)));
  return Array.from({ length: 10 }, (_, i) => (
    <span key={i} className={i < filled ? "on" : undefined} />
  ));
};

const verdictClass = (verdict?: string) => {
  if (verdict === "Skip") return "verdict-pill skip";
  if (verdict === "With caveats") return "verdict-pill warn";
  return "verdict-pill";
};

/**
 * Homepage hero. Two-column editorial layout: display headline + lede + CTAs
 * on the left, a featured review card on the right. Drifting magenta/violet
 * aurora sits behind the grid.
 */
export const Hero = ({ issue, featured = DEFAULT_FEATURED }: HeroProps) => {
  const issueLabel =
    issue ||
    `Week of ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}`;

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        borderColor: "var(--color-rule)",
        paddingTop: "clamp(64px, 9vw, 132px)",
        paddingBottom: "clamp(56px, 8vw, 108px)",
      }}
    >
      {/* Atmospheric aurora — magenta/violet top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          right: "-10%",
          width: "70vw",
          height: "90vh",
          filter: "blur(40px)",
          animation: "drift 18s ease-in-out infinite alternate",
          background:
            "radial-gradient(closest-side, oklch(62% 0.26 330 / .22), transparent 70%), radial-gradient(closest-side, oklch(60% 0.23 285 / .18), transparent 70%)",
        }}
      />
      {/* Mint bloom bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: "-30%",
          left: "-10%",
          width: "50vw",
          height: "60vh",
          filter: "blur(40px)",
          background:
            "radial-gradient(closest-side, oklch(82% 0.19 165 / .12), transparent 70%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 relative z-[1]">
        <div className="grid gap-10 lg:gap-20 items-center grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Left — headline column */}
          <div>
            <div
              className="inline-flex items-center gap-2.5 font-mono mb-7 text-[12px]"
              style={{
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-ink-3)",
              }}
            >
              <span
                aria-hidden
                className="inline-block w-7 h-px"
                style={{ background: "var(--color-mint)" }}
              />
              {issueLabel}
              <span
                className="px-2 py-[3px] rounded-full text-[10.5px]"
                style={{
                  background: "color-mix(in oklch, var(--color-mint) 18%, transparent)",
                  color: "var(--color-mint)",
                  border:
                    "1px solid color-mix(in oklch, var(--color-mint) 35%, transparent)",
                }}
              >
                New
              </span>
            </div>

            <h1
              className="m-0 mb-7"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 380,
                fontSize: "clamp(46px, 7vw, 104px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                textWrap: "balance",
              }}
            >
              Honest reviews of digital products,{" "}
              <em className="font-serif-italic text-gradient-mint">before</em> you
              spend a cent.
            </h1>

            <p
              className="m-0 mb-9 max-w-[48ch]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(17px, 1.55vw, 20px)",
                lineHeight: 1.55,
                color: "var(--color-ink-2)",
              }}
            >
              ClickRank reads, tests, and ranks the courses, guides, and software
              sold across the ClickBank marketplace — so you don't have to guess
              whether the sales page is telling the truth.
            </p>

            <div className="flex gap-3.5 items-center flex-wrap">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2.5 px-[22px] py-3.5 rounded-full text-[14px] font-medium transition-all hover:-translate-y-px hover:mint-glow"
                style={{
                  background: "var(--color-mint)",
                  color: "var(--color-mint-ink)",
                }}
              >
                Browse this week's reviews
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/about#process"
                className="inline-flex items-center gap-2.5 px-[22px] py-3.5 rounded-full text-[14px] font-medium transition-all"
                style={{
                  border: "1px solid var(--color-rule)",
                  color: "var(--color-ink)",
                }}
              >
                How we test
              </Link>
            </div>

            <div
              className="mt-6 flex gap-7 items-center flex-wrap font-mono text-[11.5px]"
              style={{
                letterSpacing: "0.08em",
                color: "var(--color-ink-3)",
              }}
            >
              <span
                className="inline-flex items-center gap-2"
                style={{ color: "var(--color-ink-2)" }}
              >
                <span
                  aria-hidden
                  className="inline-block w-[6px] h-[6px] rounded-full mint-glow-sm"
                  style={{
                    background: "var(--color-mint)",
                    animation: "pulse-dot 2.4s ease-in-out infinite",
                  }}
                />
                Updated weekly · New reviews every Thursday
              </span>
            </div>
          </div>

          {/* Right — featured pick card */}
          <FeaturedPickCard featured={featured} />
        </div>
      </div>
    </section>
  );
};

const FeaturedPickCard = ({ featured }: { featured: FeaturedPick }) => {
  const href = featured.href || "/blog";
  return (
    <Link
      href={href}
      className="relative block p-7 rounded-[18px] transition-transform hover:-translate-y-0.5"
      style={{
        background:
          "linear-gradient(180deg, var(--color-card) 0%, var(--color-bg-2) 100%)",
        border: "1px solid var(--color-rule)",
        boxShadow:
          "0 30px 80px -30px oklch(10% 0.04 255), inset 0 1px 0 oklch(100% 0 0 / .04)",
      }}
    >
      <div className="flex justify-between items-center mb-[18px]">
        <span
          className="inline-flex items-center gap-2 font-mono"
          style={{
            fontSize: "10.5px",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
          }}
        >
          <span
            aria-hidden
            className="inline-block w-[6px] h-[6px] rounded-full mint-glow-sm"
            style={{ background: "var(--color-mint)" }}
          />
          {featured.category || "Editor's Pick"}
        </span>
        {featured.wordCount && (
          <span
            className="font-mono text-[11px]"
            style={{
              color: "var(--color-ink-3)",
              letterSpacing: "0.08em",
            }}
          >
            {featured.wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      {/* Placeholder cover */}
      <div
        className="aspect-video rounded-[10px] mb-[22px] flex items-center justify-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(62% 0.26 330 / .25) 0%, oklch(60% 0.23 285 / .25) 100%), repeating-linear-gradient(135deg, oklch(25% 0.04 255) 0 8px, oklch(22% 0.04 255) 8px 16px)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <span
          className="px-2.5 py-1 font-mono text-[11px] rounded"
          style={{
            color: "var(--color-ink-2)",
            background: "oklch(15% 0.03 255 / 0.6)",
            border: "1px solid var(--color-rule)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Featured · Cover
        </span>
      </div>

      <h3
        className="m-0 mb-3"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 420,
          fontSize: 26,
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
        }}
      >
        {featured.title}
      </h3>
      <p
        className="m-0 mb-[22px]"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          color: "var(--color-ink-2)",
          fontSize: 15,
          lineHeight: 1.55,
        }}
      >
        {featured.take}
      </p>

      {/* Rating mark */}
      <div
        className="flex items-center gap-4 py-4"
        style={{
          borderTop: "1px solid var(--color-rule)",
          borderBottom: "1px solid var(--color-rule)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 380,
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}
        >
          {featured.score.toFixed(1)}
          <sup
            className="ml-0.5"
            style={{ fontSize: 16, color: "var(--color-ink-3)", fontWeight: 400 }}
          >
            /10
          </sup>
        </span>
        <div className="rating-bars flex-1" aria-hidden>
          {barSegments(featured.score)}
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.14em",
            color: "var(--color-ink-3)",
            textTransform: "uppercase",
          }}
        >
          Our&nbsp;score
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 gap-3 flex-wrap">
        <span className={verdictClass(featured.verdict)}>{featured.verdict}</span>
        <span
          className="font-mono text-[11px]"
          style={{ color: "var(--color-ink-3)", letterSpacing: "0.08em" }}
        >
          {featured.byline && `By ${featured.byline}`}
          {featured.byline && featured.date && " · "}
          {featured.date}
        </span>
      </div>

      <VerdictPillStyles />
    </Link>
  );
};

/**
 * Verdict pill styles live on the hero because they're tightly paired with
 * the featured-pick card. Kept inline to avoid polluting globals.
 */
const VerdictPillStyles = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        .verdict-pill{
          display:inline-flex; align-items:center; gap:6px;
          font-family: var(--font-mono);
          font-size:10.5px; letter-spacing:0.14em;
          text-transform:uppercase;
          padding:6px 12px; border-radius:9999px;
          background: color-mix(in oklch, var(--color-mint) 15%, transparent);
          color: var(--color-mint);
          border: 1px solid color-mix(in oklch, var(--color-mint) 35%, transparent);
        }
        .verdict-pill.warn{
          background: color-mix(in oklch, oklch(75% 0.16 70) 15%, transparent);
          color: var(--color-warn);
          border-color: color-mix(in oklch, oklch(75% 0.16 70) 35%, transparent);
        }
        .verdict-pill.skip{
          background: color-mix(in oklch, var(--color-neg) 15%, transparent);
          color: var(--color-neg);
          border-color: color-mix(in oklch, var(--color-neg) 35%, transparent);
        }
      `,
    }}
  />
);
