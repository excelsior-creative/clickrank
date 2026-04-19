import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { PostCard } from "@/components/PostCard";
import { SectionHead } from "@/components/SectionHead";
import { Post } from "@/payload-types";

// ISR: revalidate every hour as a safety net. On-demand revalidation from
// Posts.afterChange keeps this fresh whenever a post is published or updated.
export const revalidate = 3600;

export default async function BlogPage() {
  const payload = await getPayload({ config });
  let posts: Post[] = [];

  try {
    const result = await payload.find({
      collection: "posts",
      sort: "-publishedDate",
      where: { _status: { equals: "published" } },
      depth: 1,
    });
    posts = result.docs as Post[];
  } catch (error) {
    console.error("Failed to fetch blog posts during page render.", error);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-24">
      <SectionHead
        eyebrow="The Review Desk · All reviews"
        title={
          <>
            Every review we've{" "}
            <em className="font-serif-italic text-[var(--color-mint)]">filed</em>.
          </>
        }
        description="Honest, independent reviews of digital products from the ClickBank marketplace. Leading with real strengths, naming real caveats, and keeping affiliate relationships transparent."
      />

      {posts.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p
            className="text-xl"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink-3)",
            }}
          >
            No reviews filed yet. Check back soon.
          </p>
        </div>
      )}
    </div>
  );
}
