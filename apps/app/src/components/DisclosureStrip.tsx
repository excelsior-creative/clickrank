import React from "react";

/**
 * Thin editorial strip above the main navigation. Communicates reader-support
 * model + affiliate disclosure in one line — matches FTC spirit without
 * hiding the notice in a footer.
 */
export const DisclosureStrip = () => {
  return (
    <div
      className="w-full border-b"
      style={{
        background: "oklch(13% 0.03 255)",
        borderColor: "var(--color-rule)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center justify-between h-[34px] gap-4 text-[12px] font-mono tracking-[0.04em] text-[var(--color-ink-3)]">
        <span className="inline-flex items-center gap-2 text-[var(--color-ink-2)]">
          <span
            aria-hidden
            className="inline-block w-[6px] h-[6px] rounded-full mint-glow-sm"
            style={{ background: "var(--color-mint)" }}
          />
          Independent reviews · Reader-supported
        </span>
        <span className="hidden sm:inline">
          We may earn commission on purchases made through our links — it never changes what we write.
        </span>
      </div>
    </div>
  );
};
