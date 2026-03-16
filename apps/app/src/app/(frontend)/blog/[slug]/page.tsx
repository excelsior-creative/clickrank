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

export const dynamic = 'force-dynamic';

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
    <article className="py-20 bg-dark">
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <Container>
        <div className="max-w-3xl mx-auto">
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
        </div>
      </Container>
    </article>
  );
}
