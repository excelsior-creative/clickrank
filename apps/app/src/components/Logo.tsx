import Image from "next/image";
import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={className}>
      <Image
        src="/logo.svg"
        alt="Logo"
        width={100}
        height={30}
        className="h-8 w-auto"
      />
    </Link>
  );
};
