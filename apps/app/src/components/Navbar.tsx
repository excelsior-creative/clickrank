"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "./ui/button";
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
  { link: { label: "About", type: "custom", url: "/about" } },
  { 
    link: { label: "Blog", type: "custom", url: "/blog" },
    children: [
      { link: { label: "Software Reviews", type: "custom", url: "/blog/category/software" } },
      { link: { label: "Course Reviews", type: "custom", url: "/blog/category/courses" } },
      { link: { label: "E-Books", type: "custom", url: "/blog/category/ebooks" } },
    ]
  },
  { link: { label: "Contact", type: "custom", url: "/contact" } },
];
type ResolvedNavItem = { href: string; label: string; newTab?: boolean; children?: ResolvedNavItem[] };

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
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { openSearch } = useSearch();
  
  const resolvedItems: ResolvedNavItem[] = [];

  navItems.forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label) {
      const children = item.children?.map(child => {
        const childHref = resolveHref(child);
        const childLabel = child.link?.label;
        if (childHref && childLabel) {
          return { href: childHref, label: childLabel };
        }
        return null;
      }).filter(Boolean) as ResolvedNavItem[];
      
      resolvedItems.push({ 
        href, 
        label, 
        newTab: item.link?.newTab,
        children: children?.length ? children : undefined
      });
    }
  });

  const navigationItems: ResolvedNavItem[] =
    resolvedItems.length > 0 ? resolvedItems : defaultNavbarItems.map(item => ({
      href: item.link?.url || "/",
      label: item.link?.label || "",
      children: item.children?.map(child => ({
        href: child.link?.url || "/",
        label: child.link?.label || ""
      }))
    }));

  return (
    <nav className="relative w-full flex justify-between items-center py-5">
      <div className="flex-1 flex justify-start">
        <Logo />
      </div>

      <div className="hidden md:flex flex-1 justify-center gap-8">
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
                "text-sm font-medium transition-colors hover:text-brand flex items-center gap-1 whitespace-nowrap",
                pathname === item.href ? "text-brand font-semibold" : "text-gray-300"
              )}
            >
              {item.label}
              {item.children && <ChevronDown className="w-4 h-4" />}
            </Link>
            
            {item.children && dropdownOpen === item.label && (
              <AnimatePresence>
                <m.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 py-2 w-48 bg-dark-light border border-white/10 rounded-lg shadow-xl z-50"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-brand hover:bg-white/5 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </m.div>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:flex flex-1 justify-end items-center gap-4">
        <button
          onClick={openSearch}
          className="p-2 text-gray-400 hover:text-brand transition-colors cursor-pointer rounded-full hover:bg-white/5"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold transition-colors rounded-full px-6">
          <Link href="/blog">
            Get Started
          </Link>
        </Button>
      </div>

      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={openSearch}
          className="p-2 text-gray-400 hover:text-brand transition-colors cursor-pointer rounded-full"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>

        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-300">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-dark-light border-b border-white/10 z-50 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navigationItems.map((item) => (
                <div key={item.href + item.label}>
                  <Link
                    href={item.href}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noreferrer noopener" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-lg font-medium block py-2",
                      pathname === item.href ? "text-brand" : "text-gray-300"
                    )}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="pl-4 mt-2 space-y-2 border-l border-white/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-sm text-gray-400 hover:text-brand py-1"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <hr className="border-white/10" />
              <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold w-full transition-colors rounded-full">
                <Link href="/blog" onClick={() => setIsOpen(false)}>
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
