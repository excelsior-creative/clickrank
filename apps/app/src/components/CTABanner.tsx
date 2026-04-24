import React from "react";
import Link from "next/link";

/**
 * Editorial CTA banner — magenta-violet gradient with a mint bloom,
 * displayed just before the footer on long pages.
 *
 * Earlier versions included a "newsletter subscribe" form that flipped to
 * a "Subscribed ✓" state without actually subscribing anywhere. That was
 * deceptive UI and has been removed — the banner now links to the review
 * index and editorial standard instead. When we ship a real newsletter
 * with a real provider, the form can come back.
 */
export const CTABanner = () => {
  return (
    <section
      id="newsletter"
      className="max-w-[1280px] mx-auto px-5 md:px-10"
      style={{ marginBottom: "clamp(56px, 8vw, 96px)" }}
    >
      <div
        className="relative overflow-hidden rounded-[20px]"
        style={{
          padding: "clamp(40px, 6vw, 72px)",
          background:
            "linear-gradient(120deg, oklch(22% 0.06 285) 0%, oklch(24% 0.08 320) 100%)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 50%, oklch(82% 0.19 165 / .18), transparent 50%), radial-gradient(circle at 10% 100%, oklch(68% 0.26 330 / .22), transparent 50%)",
          }}
        />

        <div className="relative z-[1] grid gap-10 items-center grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h3
              className="m-0 mb-3.5"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 380,
                fontSize: "clamp(28px, 3.4vw, 44px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                textWrap: "balance",
                color: "var(--color-ink)",
              }}
            >
              Read the{" "}
              <em className="font-serif-italic text-[var(--color-mint)]">honest</em>{" "}
              take before you hit "buy."
            </h3>
            <p
              className="m-0 max-w-[48ch]"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: 16,
                color: "var(--color-ink-2)",
              }}
            >
              ClickRank reviews lead with real strengths, name real caveats,
              and disclose every affiliate relationship. Browse recent work,
              or read exactly how we decide what to publish.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full text-[14px] font-medium transition-all hover:mint-glow hover:-translate-y-px"
              style={{
                background: "var(--color-mint)",
                color: "var(--color-mint-ink)",
              }}
            >
              Browse recent reviews
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/editorial"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-full text-[14px] font-medium transition-all"
              style={{
                border: "1px solid color-mix(in oklch, var(--color-ink) 18%, transparent)",
                color: "var(--color-ink)",
                background: "oklch(15% 0.03 255 / 0.4)",
              }}
            >
              Read the editorial standard
            </Link>
            <p
              className="mt-1 font-mono text-[11px] text-center"
              style={{
                color: "var(--color-ink-3)",
                letterSpacing: "0.08em",
              }}
            >
              No sponsored picks · FTC-disclosed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
