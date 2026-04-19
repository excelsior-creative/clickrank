import Link from "next/link";

/**
 * ClickRank brand mark — a mint square dot, the name in Source Serif, and the
 * italicised `.net` suffix rendered in Instrument Serif mint.
 */
export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={`flex items-center gap-[10px] ${className ?? ""}`}
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 500,
        fontSize: "22px",
        letterSpacing: "-0.01em",
        color: "var(--color-ink)",
      }}
      aria-label="ClickRank home"
    >
      <span
        aria-hidden
        className="inline-block mint-glow-sm"
        style={{
          width: 10,
          height: 10,
          borderRadius: 2,
          background: "var(--color-mint)",
        }}
      />
      <span>ClickRank</span>
      <span
        className="font-serif-italic"
        style={{
          color: "var(--color-mint)",
          fontWeight: 400,
          fontStyle: "italic",
        }}
      >
        ·net
      </span>
    </Link>
  );
};
