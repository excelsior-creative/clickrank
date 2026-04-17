import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { getPayload } from "payload";
import config from "@payload-config";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

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
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 md:p-8 border border-white/5 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Stay Updated with Latest Reviews
              </h3>
              <p className="text-gray-400 text-sm">
                Subscribe to our newsletter for the latest digital product reviews and recommendations.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-dark border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-brand/50"
              />
              <button className="px-6 py-3 bg-brand hover:bg-brand-light text-dark font-bold rounded-full transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

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

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            Copyright © {new Date().getFullYear()} ClickRank.NET. All rights reserved.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 rounded bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-dark transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-dark transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-dark transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded bg-brand/10 flex items-center justify-center text-brand hover:bg-brand hover:text-dark transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
