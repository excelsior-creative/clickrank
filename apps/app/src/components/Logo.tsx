import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        <span className="text-2xl font-bold text-white">Click</span>
        <span className="text-2xl font-bold text-brand">Rank</span>
      </div>
    </Link>
  );
};
