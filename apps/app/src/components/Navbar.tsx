"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, Search } from "lucide-react";
import { useSearch } from "./SearchProvider";

type NavItem = {
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
  children?: NavItem[];
};

const defaultNavbarItems: NavItem[] = [
  { link: { label: "Reviews", type: "custom", url: "/blog" } },
  { link: { label: "Rankings", type: "custom", url: "/blog" } },
  { link: { label: "Categories", type: "custom", url: "/blog" } },
  { link: { label: "How we test", type: "custom", url: "/about#process" } },
  { link: { label: "About", type: "custom", url: "/about" } },
];

type ResolvedNavItem = { href: string; label: string; newTab?: boolean };

const resolveHref = (item: NavItem) => {
  const link = item.link;
  if (!link) return null;
  if (link.type === "custom" && link.url) return link.url;
  if (link.type === "reference" && link.reference && typeof link.reference === "object") {
    const relationTo = link.reference.relationTo;
    const value = link.reference.value;
    if (typeof value === "object" && value?.slug) {
      return relationTo === "posts" ? `/blog/${value.slug}` : `/${value.slug}`;
    }
  }
  return null;
};

export const Navbar = ({ navItems = [] as NavItem[] }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { openSearch } = useSearch();

  const resolvedItems: ResolvedNavItem[] = [];
  navItems.forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label) {
      resolvedItems.push({ href, label, newTab: item.link?.newTab });
    }
  });

  const navigationItems: ResolvedNavItem[] =
    resolvedItems.length > 0
      ? resolvedItems
      : defaultNavbarItems.map((item) => ({
          href: item.link?.url || "/",
          label: item.link?.label || "",
        }));

  return (
    <header
      className="sticky top-0 z-40 border-b glass-nav"
      style={{ borderColor: "var(--color-rule)" }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10 flex items-center gap-7 h-[72px]">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-[26px] ml-3.5 text-[14px] text-[var(--color-ink-2)]">
          {navigationItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                target={item.newTab ? "_blank" : undefined}
                rel={item.newTab ? "noreferrer noopener" : undefined}
                className={cn(
                  "relative py-2 transition-colors hover:text-[var(--color-ink)]",
                  active && "text-[var(--color-ink)]"
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 right-0 bottom-0 h-px origin-left transition-transform",
                    active ? "scale-x-100" : "scale-x-0"
                  )}
                  style={{ background: "var(--color-mint)" }}
                />
              </Link>
            );
          })}
        </nav>

        {/* Search pill (desktop) */}
        <button
          type="button"
          onClick={openSearch}
          className="hidden md:flex ml-auto items-center gap-2.5 px-3.5 py-2.5 rounded-full transition-colors min-w-[260px] text-left"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-rule)",
          }}
          aria-label="Search reviews"
        >
          <Search className="w-[14px] h-[14px] opacity-60 shrink-0" />
          <span className="text-[13.5px] flex-1 text-[var(--color-ink-3)]">
            Search 500+ product reviews…
          </span>
          <kbd
            className="hidden lg:inline-block font-mono text-[11px] px-[6px] py-[2px] rounded"
            style={{
              color: "var(--color-ink-3)",
              border: "1px solid var(--color-rule)",
              background: "var(--color-bg-2)",
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center px-[18px] py-2.5 rounded-full font-medium text-[13.5px] transition-all hover:-translate-y-px hover:mint-glow"
          style={{
            background: "var(--color-mint)",
            color: "var(--color-mint-ink)",
          }}
        >
          Subscribe
        </Link>

        {/* Mobile */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="p-2 rounded-full text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((s) => !s)}
            className="p-2 text-[var(--color-ink)]"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t"
            style={{
              borderColor: "var(--color-rule)",
              background: "var(--color-bg-2)",
            }}
          >
            <nav className="flex flex-col px-5 py-6 gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noreferrer noopener" : undefined}
                  className={cn(
                    "py-2 font-serif text-lg",
                    pathname === item.href
                      ? "text-[var(--color-mint)]"
                      : "text-[var(--color-ink)]"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-center py-3 rounded-full font-medium"
                style={{
                  background: "var(--color-mint)",
                  color: "var(--color-mint-ink)",
                }}
              >
                Subscribe
              </Link>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
};
