import React from "react";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import Header from "@/components/Header";
import { Post } from "@/payload-types";

export const revalidate = 300;

const getPublishedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "posts",
      sort: "-publishedDate",
      depth: 1,
      where: {
        _status: { equals: "published" },
      },
    });
    return result.docs as Post[];
  },
  ["published-posts-index"],
  { revalidate: 300, tags: ["posts"] },
);

export default async function BlogPage() {
  let posts: Post[] = [];
  try {
    posts = await getPublishedPosts();
  } catch (error) {
    console.error("Failed to fetch blog posts during page render.", error);
  }

  return (
    <div className="py-20">
      <Container>
        <Header
          badge="Reviews"
          title="ClickBank product reviews"
          subtitle="Honest, analysis-driven reviews of trending ClickBank products. Updated as the marketplace shifts so your picks stay current."
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

