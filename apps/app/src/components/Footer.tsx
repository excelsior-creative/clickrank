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
    payload.findGlobal({ slug: "site-settings" }),
    payload.findGlobal({ slug: "footer" }),
  ]);

  const siteTitle = siteSettings.siteTitle || "ClickRank";

  const cmsLinks: ResolvedFooterLink[] = [];
  ((footer.navItems || []) as FooterNavItem[]).forEach((item) => {
    const href = resolveHref(item);
    const label = item.link?.label;
    if (href && label) cmsLinks.push({ href, label, newTab: item.link?.newTab });
  });

  // Static editorial columns. If a CMS-configured footer has links, surface
  // them in a fifth "Navigation" column; otherwise fall back to defaults.
  const reviews: ResolvedFooterLink[] = [
    { href: "/blog", label: "Recent reviews" },
    { href: "/blog", label: "Top-rated" },
    { href: "/blog", label: "Skip list" },
    { href: "/blog", label: "By category" },
  ];
  const transparency: ResolvedFooterLink[] = [
    { href: "/about#process", label: "How we test" },
    { href: "/privacy", label: "Affiliate disclosure" },
    { href: "/about", label: "Editorial standards" },
    { href: "/contact", label: "Corrections" },
  ];
  const desk: ResolvedFooterLink[] =
    cmsLinks.length > 0
      ? cmsLinks
      : [
          { href: "/about", label: "About us" },
          { href: "/about", label: "Editors" },
          { href: "/contact", label: "Newsletter" },
          { href: "/contact", label: "Contact" },
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
          className="grid gap-8 pb-14 border-b"
          style={{
            borderColor: "var(--color-rule)",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          }}
        >
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p
              className="mt-4 max-w-[34ch] leading-relaxed text-[16px] font-light"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--color-ink-2)",
              }}
            >
              Independent reviews of the digital products sold on ClickBank.
              Reader-supported. Edited by people with names.
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
            ClickRank is a reader-supported publication. Some links on this site are
            affiliate links — if you click through and purchase, we may earn a
            commission at no additional cost to you. Our editorial is independent of
            those relationships: we review products we believe in, and we flag
            products we don't, regardless of commission. Scores and verdicts are
            decided before the affiliate check is negotiated.
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
