import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import Header from "@/components/Header";
import { Post } from "@/payload-types";

// ISR: revalidate every hour as a safety net. On-demand revalidation
// from Posts.afterChange keeps this fresh whenever a post is published
// or updated.
export const revalidate = 3600;

export default async function BlogPage() {
  const payload = await getPayload({ config });
  let posts: Post[] = [];

  try {
    const result = await payload.find({
      collection: "posts",
      sort: "-publishedDate",
      where: {
        _status: {
          equals: "published",
        },
      },
    });
    posts = result.docs as Post[];
  } catch (error) {
    console.error("Failed to fetch blog posts during page render.", error);
  }

  return (
    <div className="py-20">
      <Container>
        <Header
          badge="Reviews"
          title="All reviews"
          subtitle="Honest, independent reviews of digital products from the ClickBank marketplace. Leading with real strengths, naming real caveats, and keeping affiliate relationships transparent."
        />
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No posts found yet. Check back soon!</p>
          </div>
        )}
      </Container>
    </div>
  );
}

