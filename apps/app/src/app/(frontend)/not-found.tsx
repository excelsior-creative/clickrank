import React from "react";
import Link from "next/link";

/**
 * Custom 404 page for the public site. Kept intentionally simple so it loads
 * fast on an unrecognised URL and doesn't hit the database.
 */
export default function NotFound() {
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
            "radial-gradient(closest-side, oklch(62% 0.26 330 / .18), transparent 70%), radial-gradient(closest-side, oklch(60% 0.23 285 / .14), transparent 70%)",
        }}
      />
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
          Not filed · Status 404
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
          That review isn't{" "}
          <em className="font-serif-italic text-[var(--color-mint)]">on</em> the desk.
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
          We couldn't find what you were looking for. It might have moved, been
          retitled after a correction, or never existed in the first place.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-px hover:mint-glow"
            style={{
              background: "var(--color-mint)",
              color: "var(--color-mint-ink)",
            }}
          >
            Browse reviews
          </Link>
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
      </div>
    </section>
  );
}
