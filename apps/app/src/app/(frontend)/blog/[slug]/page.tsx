import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { draftMode } from "next/headers";
import { Container } from "@/components/Container";
import Image from "next/image";
import { Media, Post } from "@/payload-types";
import { RichText } from "@/components/RichText";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  return docs
    .map((post) => post.slug)
    .filter(Boolean)
    .map((slug) => ({ slug }));
}

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

  return (
    <article className="py-20">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            )}
          </div>

          {featuredImage?.url && (
            <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <RichText data={post.content} className="max-w-none" />
        </div>
      </Container>
    </article>
  );
}

