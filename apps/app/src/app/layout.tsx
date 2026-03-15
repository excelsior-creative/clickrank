import { defaultMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
