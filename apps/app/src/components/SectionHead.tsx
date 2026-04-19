import React from "react";
import Link from "next/link";

type SectionHeadProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
};

/**
 * Shared editorial section header: monospace eyebrow with mint underscore,
 * serif display heading (optionally with a `<em>` italic word), grey serif
 * lede, and a right-aligned "view all" link.
 */
export const SectionHead = ({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  className,
}: SectionHeadProps) => {
  return (
    <div
      className={`flex flex-col md:flex-row gap-6 items-start md:items-baseline justify-between pb-9 mb-11 border-b ${className ?? ""}`}
      style={{
        borderColor: "var(--color-rule)",
        paddingTop: "clamp(64px, 9vw, 96px)",
      }}
    >
      <div className="flex-1">
        <div
          className="inline-flex items-center gap-2.5 font-mono mb-4"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.16em",
            color: "var(--color-mint)",
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden
            className="inline-block w-[18px] h-px"
            style={{ background: "var(--color-mint)" }}
          />
          {eyebrow}
        </div>
        <h2
          className="m-0 mb-3.5 max-w-[22ch]"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 380,
            fontSize: "clamp(32px, 4.2vw, 54px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.03,
            textWrap: "balance",
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="m-0 max-w-[56ch]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 17,
              color: "var(--color-ink-2)",
              lineHeight: 1.55,
            }}
          >
            {description}
          </p>
        )}
      </div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="inline-flex items-center gap-2 font-sans text-[13.5px] pb-[3px] whitespace-nowrap transition-colors hover:text-[var(--color-mint)]"
          style={{
            color: "var(--color-ink)",
            borderBottom: "1px solid var(--color-ink-3)",
          }}
        >
          {linkLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
};
