"use client";

import React, { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary for the public site. Any server or client error
 * on a `(frontend)` route lands here instead of Next's default overlay.
 */
export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log for Sentry / server logs. We intentionally keep the message
    // user-friendly below.
    console.error("Frontend error boundary caught:", error);
  }, [error]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px, 12vw, 180px) 0" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          right: "-10%",
          width: "60vw",
          height: "70vh",
          filter: "blur(40px)",
          background:
            "radial-gradient(closest-side, oklch(62% 0.26 330 / .18), transparent 70%)",
        }}
      />

      <div className="max-w-[760px] mx-auto px-5 md:px-10 relative text-center">
        <div
          className="font-mono mb-6"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
          }}
        >
          Something broke · Status 500
        </div>
        <h1
          className="m-0 mb-6"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 380,
            fontSize: "clamp(40px, 5.5vw, 72px)",
            letterSpacing: "-0.022em",
            lineHeight: 1.03,
            color: "var(--color-ink)",
            textWrap: "balance",
          }}
        >
          This page{" "}
          <em className="font-serif-italic text-[var(--color-mint)]">tripped</em>{" "}
          on its way out of the desk.
        </h1>
        <p
          className="mx-auto m-0 mb-10 max-w-[54ch]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: 18,
            color: "var(--color-ink-2)",
          }}
        >
          An editor has been notified. Try the action again, or head back to the
          reviews shelf — most of the desk is still working fine.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-px hover:mint-glow"
            style={{
              background: "var(--color-mint)",
              color: "var(--color-mint-ink)",
              border: 0,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              border: "1px solid var(--color-rule)",
              color: "var(--color-ink)",
            }}
          >
            Back to home
          </Link>
        </div>
        {error.digest && (
          <p
            className="mt-8 font-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--color-ink-3)",
            }}
          >
            Reference · {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}
