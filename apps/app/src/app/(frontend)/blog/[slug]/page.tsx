import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { draftMode } from "next/headers";
import { Container } from "@/components/Container";
import Image from "next/image";
import { Media, Post } from "@/payload-types";
import { RichText } from "@/components/RichText";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { generateArticleSchema } from "@/lib/structured-data";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";

// ISR: revalidate every hour as a safety net. On-demand revalidation
// from Posts.afterChange handles immediate freshness when a post is
// published or edited.
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
      where: {
        slug: {
          equals: decodedSlug,
        },
      },
    });
    post = posts[0] as Post;
  } catch (error) {
    console.error(`Failed to fetch blog post "${slug}" during page render.`, error);
  }

  if (!post) {
    return <PayloadRedirects url={url} />;
  }

  const featuredImage = post.featuredImage as Media;
  const articleSchema = generateArticleSchema(post);
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
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

  return (
    <article className="py-20 bg-dark">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
      <Container>
        <div className="max-w-3xl mx-auto">
          <AffiliateDisclosure variant="banner" className="mb-8" />

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-gray-400">{post.excerpt}</p>
            )}
          </div>

          {featuredImage?.url && (
            <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden border border-white/5">
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg max-w-none">
            <RichText data={post.content} className="max-w-none" />
          </div>

          <div className="mt-16 pt-8 border-t border-white/5">
            <AffiliateDisclosure variant="inline" />
            <p className="mt-6 text-sm text-gray-500">
              Published by {SITE_NAME}. If you spot an inaccuracy,
              email us and we&apos;ll correct it.
            </p>
          </div>
        </div>
      </Container>
    </article>
  );
}
