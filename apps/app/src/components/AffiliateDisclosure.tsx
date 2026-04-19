import React from "react";
import Link from "next/link";

type Variant = "banner" | "inline" | "footer";

type AffiliateDisclosureProps = {
  variant?: Variant;
  className?: string;
};

const DISCLOSURE_TEXT =
  "ClickRank earns commissions when readers buy through our affiliate links. Our reviews are independent: compensation never determines what we cover or how we rate a product.";

export function AffiliateDisclosure({ variant = "inline", className }: AffiliateDisclosureProps) {
  if (variant === "banner") {
    return (
      <aside
        role="note"
        aria-label="Affiliate disclosure"
        className={
          "rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-300 " +
          (className ?? "")
        }
      >
        <strong className="text-white">Affiliate disclosure:</strong>{" "}
        {DISCLOSURE_TEXT}{" "}
        <Link
          href="/editorial"
          className="underline underline-offset-2 hover:text-brand"
        >
          Read our editorial standard.
        </Link>
      </aside>
    );
  }

  if (variant === "footer") {
    return (
      <p
        className={
          "text-xs leading-relaxed text-gray-500 " + (className ?? "")
        }
      >
        <strong className="text-gray-400">Affiliate disclosure:</strong>{" "}
        {DISCLOSURE_TEXT}
      </p>
    );
  }

  return (
    <p
      className={
        "text-sm italic text-gray-400 border-l-2 border-brand/50 pl-4 " +
        (className ?? "")
      }
    >
      <strong className="not-italic text-gray-300">Affiliate disclosure:</strong>{" "}
      {DISCLOSURE_TEXT}
    </p>
  );
}
