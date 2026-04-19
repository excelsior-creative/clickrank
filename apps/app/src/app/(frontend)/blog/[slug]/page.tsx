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
import { generateArticleSchema } from "@/lib/structured-data";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

// ISR: revalidate every hour as a safety net. On-demand revalidation from
// Posts.afterChange handles immediate freshness on publish/edit.
export const revalidate = 3600;

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
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
    console.error(`Failed to fetch blog post "${slug}" during page render.`, error);
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
      { "@type": "ListItem", position: 2, name: "Reviews", item: `${SITE_URL}/blog` },
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

  return (
    <article className="pt-12 pb-24">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      <div className="max-w-[760px] mx-auto px-5 md:px-10">
        <div
          className="mb-7 font-mono"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
          }}
        >
          The Review Desk {publishedLabel && `· ${publishedLabel}`}
        </div>

        <AffiliateDisclosure variant="banner" className="mb-10" />

        <header className="mb-10">
          <h1
            className="m-0 mb-5"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 380,
              fontSize: "clamp(36px, 5vw, 64px)",
              letterSpacing: "-0.022em",
              lineHeight: 1.03,
              color: "var(--color-ink)",
              textWrap: "balance",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: 20,
                color: "var(--color-ink-2)",
                lineHeight: 1.5,
              }}
            >
              {post.excerpt}
            </p>
          )}
        </header>

        {featuredImage?.url && (
          <div
            className="relative aspect-video mb-12 overflow-hidden rounded-[14px]"
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

        <div
          className="prose prose-invert prose-lg max-w-none"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 19,
            lineHeight: 1.7,
          }}
        >
          <RichText data={post.content} className="max-w-none" />
        </div>

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
            Published by {SITE_NAME}. If you spot an inaccuracy, email us and we&apos;ll correct it.
          </p>
        </div>
      </div>
    </article>
  );
}
