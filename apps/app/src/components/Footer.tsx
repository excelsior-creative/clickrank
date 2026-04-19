import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { getPayload } from "payload";
import config from "@payload-config";

type FooterNavItem = {
  id?: string;
  link?: {
    label?: string;
    type?: "reference" | "custom";
    url?: string;
    reference?:
      | {
          relationTo?: "pages" | "posts";
          value?: number | { slug?: string };
        }
      | number;
    newTab?: boolean;
  };
};

const defaultFooterLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

type ResolvedFooterLink = { href: string; label: string; newTab?: boolean };

const resolveHref = (item: FooterNavItem) => {
  const link = item.link;

  if (!link) return null;

  if (link.type === "custom" && link.url) {
    return link.url;
  }

  if (link.type === "reference" && link.reference && typeof link.reference === "object") {
    const relationTo = link.reference.relationTo;
    const value = link.reference.value;

    if (typeof value === "object" && value?.slug) {
      return relationTo === "posts" ? `/blog/${value.slug}` : `/${value.slug}`;
    }
  }

  return null;
};

export const Footer = async () => {
  const payload = await getPayload({ config });
  const [siteSettings, footer] = await Promise.all([
    payload.findGlobal({
      slug: "site-settings",
    }),
    payload.findGlobal({
      slug: "footer",
    }),
  ]);

  const siteTitle = siteSettings.siteTitle || "ClickRank";
  const links: ResolvedFooterLink[] = [];
  ((footer.navItems || []) as FooterNavItem[]).forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label) {
      links.push({ href, label, newTab: item.link?.newTab });
    }
  });
  const navigationLinks: ResolvedFooterLink[] =
    links.length > 0 ? links : defaultFooterLinks;

  return (
    <footer className="bg-dark-light border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo className="mb-4 inline-block" />
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Your trusted source for honest digital product reviews. We help you make informed decisions with unbiased, thorough analysis.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noreferrer noopener" : undefined}
                    className="text-sm text-gray-400 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/editorial" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Editorial Standard
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-brand transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <AffiliateDisclosure variant="footer" className="mb-6 max-w-3xl" />
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-sm text-gray-500 text-center md:text-left">
            Copyright © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
