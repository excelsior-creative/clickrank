"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Search } from "lucide-react";
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
  { link: { label: "Home", type: "custom", url: "/" } },
  { link: { label: "Reviews", type: "custom", url: "/blog" } },
  { link: { label: "Categories", type: "custom", url: "/blog" } },
  { link: { label: "Compare", type: "custom", url: "/blog" } },
  { link: { label: "About", type: "custom", url: "/about" } },
];

type ResolvedNavItem = { href: string; label: string; newTab?: boolean; children?: ResolvedNavItem[] };

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
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { openSearch } = useSearch();

  const resolvedItems: ResolvedNavItem[] = [];
  navItems.forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label) {
      const children = item.children
        ?.map((child) => {
          const childHref = resolveHref(child);
          const childLabel = child.link?.label;
          if (childHref && childLabel) return { href: childHref, label: childLabel };
          return null;
        })
        .filter(Boolean) as ResolvedNavItem[];
      resolvedItems.push({ href, label, newTab: item.link?.newTab, children: children?.length ? children : undefined });
    }
  });

  const navigationItems: ResolvedNavItem[] =
    resolvedItems.length > 0
      ? resolvedItems
      : defaultNavbarItems.map((item) => ({
          href: item.link?.url || "/",
          label: item.link?.label || "",
          children: item.children?.map((child) => ({
            href: child.link?.url || "/",
            label: child.link?.label || "",
          })),
        }));

  return (
    <>
      {/* Glassmorphism fixed nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 shadow-sm"
        style={{
          background: "rgba(251, 248, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navigationItems.map((item) => (
              <div
                key={item.href + item.label}
                className="relative"
                onMouseEnter={() => item.children && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <Link
                  href={item.href}
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noreferrer noopener" : undefined}
                  className={cn(
                    "flex items-center gap-1 font-headline font-bold tracking-tight text-sm transition-colors duration-200",
                    pathname === item.href
                      ? "text-primary-container border-b-2 pb-0.5"
                      : "text-on-surface-variant hover:text-primary-container"
                  )}
                  style={
                    pathname === item.href
                      ? { borderColor: "var(--color-primary-container)" }
                      : undefined
                  }
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {item.children && dropdownOpen === item.label && (
                  <AnimatePresence>
                    <m.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-2 py-2 w-52 rounded-2xl shadow-xl z-50"
                      style={{
                        background: "rgba(251, 248, 255, 0.95)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </m.div>
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={openSearch}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer rounded-full hover:bg-surface-container-low"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/blog"
              className="btn-primary-gradient px-6 py-2.5 rounded-xl font-headline font-bold tracking-tight text-sm text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={openSearch}
              className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-on-surface"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[73px] left-0 right-0 z-40 overflow-hidden md:hidden shadow-lg"
            style={{ background: "rgba(251, 248, 255, 0.97)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col p-6 gap-4">
              {navigationItems.map((item) => (
                <div key={item.href + item.label}>
                  <Link
                    href={item.href}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noreferrer noopener" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-headline font-bold block py-2",
                      pathname === item.href ? "text-primary" : "text-on-surface"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-1 space-y-1 border-l-2" style={{ borderColor: "var(--color-surface-container-high)" }}>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-on-surface-variant hover:text-primary py-1 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-2">
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary-gradient block text-center px-6 py-3 rounded-xl font-headline font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Spacer so content sits below fixed nav */}
      <div className="h-[73px]" />
    </>
  );
};
