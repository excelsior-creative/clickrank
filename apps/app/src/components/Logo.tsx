import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={`flex items-center gap-1 ${className ?? ""}`}>
      <span
        className="text-xl font-extrabold tracking-tighter"
        style={{ fontFamily: "var(--font-manrope, Manrope, sans-serif)", color: "var(--color-on-surface)" }}
      >
        Click
      </span>
      <span
        className="text-xl font-extrabold tracking-tighter"
        style={{ fontFamily: "var(--font-manrope, Manrope, sans-serif)", color: "var(--color-primary-container)" }}
      >
        Rank
      </span>
    </Link>
  );
};
