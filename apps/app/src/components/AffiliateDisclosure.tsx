import React from "react";
import Link from "next/link";

type Variant = "banner" | "inline" | "footer";

type AffiliateDisclosureProps = {
  variant?: Variant;
  className?: string;
};

const DISCLOSURE_TEXT =
  "ClickRank earns commissions when readers buy through our affiliate links. Our reviews are independent — compensation never determines what we cover or how we rate a product.";

export function AffiliateDisclosure({ variant = "inline", className }: AffiliateDisclosureProps) {
  if (variant === "banner") {
    return (
      <aside
        role="note"
        aria-label="Affiliate disclosure"
        className={`rounded-[12px] px-5 py-4 ${className ?? ""}`}
        style={{
          background: "oklch(18% 0.03 255 / 0.6)",
          border: "1px dashed var(--color-rule)",
          color: "var(--color-ink-2)",
          fontFamily: "var(--font-serif)",
          fontSize: 14.5,
          fontWeight: 300,
          lineHeight: 1.55,
        }}
      >
        <strong
          className="block mb-1.5"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
            fontWeight: 500,
          }}
        >
          Affiliate disclosure
        </strong>
        {DISCLOSURE_TEXT}{" "}
        <Link
          href="/about#process"
          className="underline underline-offset-2 hover:text-[var(--color-mint)] transition-colors"
          style={{ color: "var(--color-ink)" }}
        >
          How we review.
        </Link>
      </aside>
    );
  }

  if (variant === "footer") {
    return (
      <p
        className={className ?? ""}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          letterSpacing: "0.04em",
          color: "var(--color-ink-3)",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: "var(--color-ink-2)" }}>Affiliate disclosure:</strong>{" "}
        {DISCLOSURE_TEXT}
      </p>
    );
  }

  return (
    <p
      className={`pl-4 ${className ?? ""}`}
      style={{
        borderLeft: "2px solid color-mix(in oklch, var(--color-mint) 50%, transparent)",
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        color: "var(--color-ink-2)",
        fontSize: 14.5,
        lineHeight: 1.6,
      }}
    >
      <strong
        className="not-italic"
        style={{ color: "var(--color-ink)", fontWeight: 500 }}
      >
        Affiliate disclosure:
      </strong>{" "}
      {DISCLOSURE_TEXT}
    </p>
  );
}
