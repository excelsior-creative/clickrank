import React from "react";
import { Source_Serif_4, Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { VercelToolbar } from "@vercel/toolbar/next";
import { generateGlobalSchema } from "@/lib/structured-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DisclosureStrip } from "@/components/DisclosureStrip";
import { Providers } from "@/components/Providers";
import { SearchProvider } from "@/components/SearchProvider";
import { AdminBar } from "@/components/AdminBar";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({ slug: "header" });
  const globalSchema = generateGlobalSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSerif.variable} ${instrumentSerif.variable} ${geist.variable} ${geistMono.variable}`}
      >
        <div
          className="flex min-h-screen flex-col"
          data-theme="frontend"
        >
          <Providers>
            <SearchProvider>
              <AdminBar adminBarProps={{ preview: isEnabled }} />
              <DisclosureStrip />
              <Navbar navItems={(header.navItems as any[]) || []} />
              <main className="flex-grow">{children}</main>
              <Footer />
            </SearchProvider>
          </Providers>
        </div>
        {process.env.NODE_ENV !== "production" && <VercelToolbar />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </body>
    </html>
  );
}
