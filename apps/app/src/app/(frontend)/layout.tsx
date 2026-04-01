import React from "react";
import { Manrope, Inter } from "next/font/google";
import "@/app/globals.css";
import { VercelToolbar } from "@vercel/toolbar/next";
import { generateGlobalSchema } from "@/lib/structured-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { SearchProvider } from "@/components/SearchProvider";
import { AdminBar } from "@/components/AdminBar";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({
    slug: "header",
  });
  const globalSchema = generateGlobalSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Material Symbols for icons used in the design system */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body
        className={`${manrope.variable} ${inter.variable}`}
        style={{ fontFamily: "var(--font-inter, Inter, sans-serif)" }}
      >
        <div
          className="flex min-h-screen flex-col"
          data-theme="frontend"
          style={{ backgroundColor: "var(--color-surface)", color: "var(--color-on-surface)" }}
        >
          <Providers>
            <SearchProvider>
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />
              <Navbar navItems={(header.navItems as any[]) || []} />
              <main className="flex-grow">
                {children}
              </main>
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
