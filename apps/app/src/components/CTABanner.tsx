"use client";

import React, { useState } from "react";

/**
 * Editorial newsletter / CTA banner — magenta-violet gradient with a mint
 * bloom, displayed just before the footer on long pages.
 */
export const CTABanner = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
              Get the week's{" "}
              <em className="font-serif-italic text-[var(--color-mint)]">verdicts</em>{" "}
              before you hit "buy."
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
              One email each Thursday. New reviews, skip lists, and the one product
              we're arguing about this week. No sponsored picks, ever.
            </p>
          </div>

          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setSubmitted(true);
              }}
              className="flex gap-2.5 items-center rounded-full p-1.5"
              style={{
                background: "oklch(15% 0.03 255 / 0.6)",
                border: "1px solid var(--color-rule)",
              }}
            >
              <input
                type="email"
                required
                placeholder="you@inbox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitted}
                className="flex-1 border-0 outline-none bg-transparent px-3.5 py-2.5 text-[14px]"
                style={{ color: "var(--color-ink)" }}
              />
              <button
                type="submit"
                disabled={submitted}
                className="px-5 py-2.5 rounded-full font-medium text-[14px] cursor-pointer transition-all hover:mint-glow hover:-translate-y-px disabled:opacity-80 disabled:cursor-default"
                style={{
                  border: 0,
                  background: "var(--color-mint)",
                  color: "var(--color-mint-ink)",
                }}
              >
                {submitted ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
            <p
              className="mt-3 font-mono text-[11px]"
              style={{
                color: "var(--color-ink-3)",
                letterSpacing: "0.08em",
              }}
            >
              Free · unsubscribe in one click
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
