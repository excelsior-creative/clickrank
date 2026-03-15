import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import Header from "@/components/Header";
import { Post } from "@/payload-types";

export const dynamic = 'force-dynamic';

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
          badge="Blog"
          title="All Articles"
          subtitle="Insights, updates, and tutorials from our team about modern web development and design."
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

