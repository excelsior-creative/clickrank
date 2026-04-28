import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { getPayload } from "payload";
import config from "@payload-config";

type FooterNavItem = {
  id?: string;
  link?: {
    label?: string;
    type?: "reference" | "custom";
    url?: string;
    reference?:
      | { relationTo?: "pages" | "posts"; value?: number | { slug?: string } }
      | number;
    newTab?: boolean;
  };
};

type ResolvedFooterLink = { href: string; label: string; newTab?: boolean };

const resolveHref = (item: FooterNavItem) => {
  const link = item.link;
  if (!link) return null;
  if (link.type === "custom" && link.url) return link.url;
  if (
    link.type === "reference" &&
    link.reference &&
    typeof link.reference === "object"
  ) {
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
    payload.findGlobal({ slug: "site-settings" }),
    payload.findGlobal({ slug: "footer" }),
  ]);

  const siteTitle = siteSettings.siteTitle || "ClickRank";

  const cmsLinks: ResolvedFooterLink[] = [];
  ((footer.navItems || []) as FooterNavItem[]).forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label)
      cmsLinks.push({ href, label, newTab: item.link?.newTab });
  });

  // Static editorial columns. If a CMS-configured footer has links, surface
  // them in place of the default "About" column; otherwise fall back to
  // defaults. Every default link points to a route that actually exists —
  // no decorative "Top-rated" / "Skip list" / "Newsletter" stubs.
  const reviews: ResolvedFooterLink[] = [
    { href: "/blog", label: "All reviews" },
    { href: "/about", label: "How ClickRank works" },
    { href: "/editorial", label: "Editorial standard" },
  ];
  const transparency: ResolvedFooterLink[] = [
    { href: "/editorial", label: "Editorial standard" },
    { href: "/about#process", label: "How we work" },
    { href: "/privacy", label: "Affiliate disclosure" },
    { href: "/contact", label: "Corrections and tips" },
  ];
  const desk: ResolvedFooterLink[] =
    cmsLinks.length > 0
      ? cmsLinks
      : [
          { href: "/about", label: "About" },
          { href: "/editorial", label: "Editorial" },
          { href: "/contact", label: "Contact" },
          { href: "/privacy", label: "Privacy" },
        ];

  return (
    <footer
      className="pt-20 pb-10"
      style={{
        background: "oklch(13% 0.03 255)",
        borderTop: "1px solid var(--color-rule)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div
          className="grid gap-8 pb-14 border-b grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]"
          style={{
            borderColor: "var(--color-rule)",
          }}
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo />
            <p
              className="mt-4 max-w-[34ch] leading-relaxed text-[16px] font-light"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink-2)",
              }}
            >
              Independent, analysis-driven reviews of the digital products sold
              on ClickBank. Reader-supported, FTC-disclosed on every page.
            </p>
          </div>

          <FooterColumn title="Reviews" links={reviews} />
          <FooterColumn title="Transparency" links={transparency} />
          <FooterColumn title="The desk" links={desk} />
        </div>

        <div
          className="mt-10 rounded-xl px-6 py-5"
          style={{
            border: "1px dashed var(--color-rule)",
            background: "oklch(15% 0.03 255)",
          }}
        >
          <strong
            className="block mb-2.5 font-sans font-medium"
            style={{
              color: "var(--color-mint)",
              fontSize: "11.5px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            FTC Affiliate disclosure
          </strong>
          <p
            className="text-[14.5px] leading-relaxed font-light"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink-2)",
            }}
          >
            ClickRank is a reader-supported publication. Some links on this site
            are affiliate links. If you click through and purchase, we may earn
            a commission at no additional cost to you. Our editorial is
            independent of those relationships: we lead with real strengths,
            name real caveats, and skip products we&apos;d be embarrassed to
            promote, regardless of commission. Corrections are welcomed at our
            contact page.
          </p>
        </div>

        <div
          className="mt-8 pt-8 flex flex-wrap gap-3 items-center justify-between font-mono text-[11.5px] tracking-[0.08em]"
          style={{ color: "var(--color-ink-3)" }}
        >
          <span>
            © {new Date().getFullYear()} {siteTitle} Media Co.
          </span>
          <span className="flex items-center gap-3">
            <Link href="/terms" className="hover:text-[var(--color-mint)]">
              Terms
            </Link>
            ·
            <Link href="/privacy" className="hover:text-[var(--color-mint)]">
              Privacy
            </Link>
            ·
            <Link href="/privacy" className="hover:text-[var(--color-mint)]">
              Cookies
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: ResolvedFooterLink[];
}) => (
  <div>
    <h5
      className="font-mono mb-[18px]"
      style={{
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--color-ink-3)",
      }}
    >
      {title}
    </h5>
    <ul className="list-none p-0 m-0 space-y-3">
      {links.map((link) => (
        <li key={link.href + link.label}>
          <Link
            href={link.href}
            target={link.newTab ? "_blank" : undefined}
            rel={link.newTab ? "noreferrer noopener" : undefined}
            className="text-[14px] transition-colors hover:text-[var(--color-mint)]"
            style={{ color: "var(--color-ink-2)" }}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
