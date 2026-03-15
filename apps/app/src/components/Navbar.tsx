"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, ArrowRight, Search } from "lucide-react";
import { Button } from "./ui/button";
import { useSearch } from "./SearchProvider";
import { ThemeToggle } from "./ThemeToggle";

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
};

const defaultNavbarItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
type ResolvedNavItem = { href: string; label: string; newTab?: boolean };

const resolveHref = (item: NavItem) => {
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
    resolvedItems.length > 0 ? resolvedItems : defaultNavbarItems;

  return (
    <nav className="relative w-full flex justify-between items-center py-6">
      <div className="flex-1 flex justify-start">
        <Logo />
      </div>

      <div className="hidden md:flex flex-1 justify-center gap-6">
        {navigationItems.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noreferrer noopener" : undefined}
            className={cn(
              "text-sm font-medium transition-colors hover:text-brand whitespace-nowrap",
              pathname === item.href ? "text-brand font-semibold" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="hidden md:flex flex-1 justify-end items-center gap-4">
        <button
          onClick={openSearch}
          className="p-2 text-muted-foreground hover:text-brand transition-colors cursor-pointer rounded-full hover:bg-muted"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <ThemeToggle />

        <Button asChild variant="ghost">
          <Link href="/admin">Admin</Link>
        </Button>
        <Button asChild className="bg-brand hover:bg-brand-light text-white transition-colors">
          <Link href="/admin">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={openSearch}
          className="p-2 text-muted-foreground hover:text-brand transition-colors cursor-pointer rounded-full"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>

        <ThemeToggle />

        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-background border-b z-50 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noreferrer noopener" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium",
                    pathname === item.href ? "text-brand" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <hr />
              <Button asChild className="bg-brand hover:bg-brand-light text-white w-full transition-colors">
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

