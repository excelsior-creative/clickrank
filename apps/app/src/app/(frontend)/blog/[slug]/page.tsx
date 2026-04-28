import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { draftMode } from "next/headers";
import Image from "next/image";
import { Media, Post } from "@/payload-types";
import { RichText } from "@/components/RichText";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { RelatedPosts } from "@/components/RelatedPosts";
import { generateArticleSchema } from "@/lib/structured-data";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { rewriteAffiliateLinks } from "@/lib/affiliateLinks";
import { ArrowUpRight, CalendarDays, ShieldCheck, Tag } from "lucide-react";

// ISR: revalidate every hour as a safety net. On-demand revalidation from
// Posts.afterChange handles immediate freshness on publish/edit.
export const revalidate = 3600;

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const url = `/blog/${decodedSlug}`;
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });
  let post: Post | undefined;

  try {
    const { docs: posts } = await payload.find({
      collection: "posts",
      draft,
      overrideAccess: draft,
      where: { slug: { equals: decodedSlug } },
    });
    post = posts[0] as Post;
  } catch (error) {
    console.error(
      `Failed to fetch blog post "${slug}" during page render.`,
      error,
    );
  }

  if (!post) {
    return <PayloadRedirects url={url} />;
  }

  const featuredImage = post.featuredImage as Media | undefined;
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Reviews",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema].map((s) => {
      const { "@context": _ctx, ...rest } = s as Record<string, unknown>;
      return rest;
    }),
  };

  const publishedRaw = post.publishedDate || post.createdAt;
  let publishedLabel = "";
  try {
    publishedLabel = new Date(publishedRaw).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {}

  const postRecord = post as Post & {
    affiliateUrl?: string | null;
    productName?: string | null;
  };
  const affiliateUrl = postRecord.affiliateUrl?.trim() || "";
  const productName = postRecord.productName?.trim() || "";
  const categoryNames = Array.isArray(post.categories)
    ? post.categories
        .map((category) =>
          category && typeof category === "object" && "name" in category
            ? (category as { name?: string }).name
            : null,
        )
        .filter(Boolean)
    : [];
  const primaryCategory = categoryNames[0] || "Digital product";
  const readingLabel = post.excerpt
    ? `${Math.max(2, Math.ceil(post.excerpt.split(/\s+/).length / 55))} min overview`
    : "Long-form review";
  const reviewSubject = productName || post.title;

  // Route inline body hoplinks through /go/[slug] so every outbound click is
  // counted, not just the sticky CTA. See lib/affiliateLinks.ts for policy.
  const trackedContent = rewriteAffiliateLinks(post.content, {
    postSlug: post.slug ?? decodedSlug,
    affiliateUrl,
  });

  return (
    <article className="pb-24">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      <header
        className="relative overflow-hidden border-b"
        style={{
          borderColor: "var(--color-rule)",
          padding: "clamp(48px, 7vw, 96px) 0 clamp(40px, 6vw, 76px)",
          background:
            "radial-gradient(circle at 80% 20%, oklch(62% 0.23 285 / .16), transparent 34%), radial-gradient(circle at 12% 80%, oklch(82% 0.19 165 / .1), transparent 34%), oklch(15% 0.035 255)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-rule-soft) 1px, transparent 1px), linear-gradient(90deg, var(--color-rule-soft) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to bottom, black, transparent 72%)",
          }}
        />
        <div className="relative z-[1] max-w-[1280px] mx-auto px-5 md:px-10">
          <div className="grid gap-8 lg:gap-14 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] items-end">
            <div>
              <div
                className="mb-6 flex flex-wrap items-center gap-2.5 font-mono"
                style={{
                  fontSize: 11.5,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-3)",
                }}
              >
                <span className="text-[var(--color-mint)]">
                  {primaryCategory}
                </span>
                {publishedLabel && <span>· {publishedLabel}</span>}
                <span
                  className="rounded-full px-2.5 py-1"
                  style={{
                    border:
                      "1px solid color-mix(in oklch, var(--color-mint) 35%, transparent)",
                    color: "var(--color-mint)",
                    background:
                      "color-mix(in oklch, var(--color-mint) 12%, transparent)",
                  }}
                >
                  FTC disclosed
                </span>
              </div>

              <h1
                className="m-0 mb-6"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 380,
                  fontSize: "clamp(42px, 6.4vw, 86px)",
                  letterSpacing: "-0.026em",
                  lineHeight: 0.98,
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                {post.title}
              </h1>
              {post.excerpt && (
                <p
                  className="m-0 max-w-[64ch]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 300,
                    fontSize: "clamp(18px, 1.7vw, 23px)",
                    color: "var(--color-ink-2)",
                    lineHeight: 1.55,
                  }}
                >
                  {post.excerpt}
                </p>
              )}
            </div>

            <aside
              className="rounded-[18px] p-6"
              style={{
                background:
                  "linear-gradient(180deg, var(--color-card) 0%, var(--color-bg-2) 100%)",
                border: "1px solid var(--color-rule)",
                boxShadow:
                  "0 30px 80px -34px oklch(10% 0.04 255), inset 0 1px 0 oklch(100% 0 0 / .04)",
              }}
              aria-label="Review summary"
            >
              <p
                className="m-0 mb-2 font-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-3)",
                }}
              >
                At a glance
              </p>
              <h2
                className="m-0 mb-4"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 420,
                  fontSize: 26,
                  lineHeight: 1.1,
                  color: "var(--color-ink)",
                }}
              >
                {reviewSubject}
              </h2>
              <div className="space-y-3">
                <SummaryRow
                  icon={<Tag className="h-4 w-4" />}
                  label="Category"
                  value={primaryCategory}
                />
                <SummaryRow
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Updated"
                  value={publishedLabel || "Recently"}
                />
                <SummaryRow
                  icon={<ShieldCheck className="h-4 w-4" />}
                  label="Method"
                  value="Analysis-driven QA"
                />
              </div>
              {affiliateUrl && (
                <a
                  href={`/go/${post.slug}`}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition-all hover:-translate-y-px hover:mint-glow"
                  style={{
                    background: "var(--color-mint)",
                    color: "var(--color-mint-ink)",
                  }}
                >
                  Check current pricing
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </aside>
          </div>
        </div>
      </header>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 pt-10">
        <AffiliateDisclosure variant="banner" className="mb-10" />

        {featuredImage?.url && (
          <div
            className="relative aspect-[16/8] mb-12 overflow-hidden rounded-[18px]"
            style={{ border: "1px solid var(--color-rule)" }}
          >
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,760px)_minmax(260px,1fr)] lg:items-start">
          <div>
            <div
              className="prose prose-invert prose-lg max-w-none"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 19,
                lineHeight: 1.7,
              }}
            >
              <RichText data={trackedContent} className="max-w-none" />
            </div>

            {affiliateUrl && (
              <div
                className="mt-12 rounded-[16px] px-6 py-6"
                style={{
                  border: "1px solid var(--color-rule)",
                  background: "oklch(15% 0.03 255)",
                }}
              >
                <a
                  href={`/go/${post.slug}`}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-[15px] font-medium transition-colors"
                  style={{
                    background: "var(--color-mint)",
                    color: "oklch(13% 0.03 255)",
                  }}
                >
                  Check current pricing
                  {productName ? ` for ${productName}` : ""}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <p
                  className="mt-3 font-mono"
                  style={{
                    fontSize: 11.5,
                    letterSpacing: "0.04em",
                    color: "var(--color-ink-3)",
                  }}
                >
                  Affiliate link — we earn a commission on qualifying purchases
                  at no extra cost to you.
                </p>
              </div>
            )}

            <RelatedPosts currentPost={post} />

            <div
              className="mt-16 pt-8"
              style={{ borderTop: "1px solid var(--color-rule)" }}
            >
              <AffiliateDisclosure variant="inline" />
              <p
                className="mt-6 font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  color: "var(--color-ink-3)",
                }}
              >
                Published by {SITE_NAME}. If you spot an inaccuracy, email us
                and we&apos;ll correct it.
              </p>
            </div>
          </div>

          <aside
            className="lg:sticky lg:top-28 space-y-4"
            aria-label="Article details"
          >
            <div
              className="rounded-[16px] p-5"
              style={{
                background: "var(--color-card)",
                border: "1px solid var(--color-rule)",
              }}
            >
              <h3
                className="m-0 mb-4 font-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-3)",
                }}
              >
                Review file
              </h3>
              <div className="space-y-3">
                <SummaryRow label="Subject" value={reviewSubject} />
                <SummaryRow label="Read time" value={readingLabel} />
                <SummaryRow label="Disclosure" value="Affiliate links marked" />
              </div>
            </div>

            {categoryNames.length > 0 && (
              <div
                className="rounded-[16px] p-5"
                style={{
                  background: "oklch(15% 0.03 255)",
                  border: "1px solid var(--color-rule)",
                }}
              >
                <h3
                  className="m-0 mb-3 font-mono"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--color-ink-3)",
                  }}
                >
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full px-3 py-1.5 text-[12px]"
                      style={{
                        border: "1px solid var(--color-rule)",
                        color: "var(--color-ink-2)",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </article>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && <span className="mt-0.5 text-[var(--color-mint)]">{icon}</span>}
      <div className="min-w-0">
        <p
          className="m-0 font-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-ink-3)",
          }}
        >
          {label}
        </p>
        <p
          className="m-0 mt-0.5"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 16,
            lineHeight: 1.3,
            color: "var(--color-ink)",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
