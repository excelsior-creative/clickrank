import React from "react";
import { Inter } from "next/font/google";
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

const inter = Inter({ subsets: ["latin"] });

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode();
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({
    slug: "header",
  });
  const globalSchema = generateGlobalSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-dark text-white`}>
        <div className="flex min-h-screen flex-col bg-dark" data-theme="frontend">
          <Providers>
            <SearchProvider>
              <AdminBar
                adminBarProps={{
                  preview: isEnabled,
                }}
              />
              <div className="max-w-7xl mx-auto w-full px-4 md:px-10">
                <Navbar navItems={(header.navItems as any[]) || []} />
              </div>
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
