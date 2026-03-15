import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import Header from "./Header";
import { PostCard } from "./PostCard";
import { Button } from "./ui/button";
import Link from "next/link";

export const BlogSection = async ({ 
  title = "From the blog",
  badge = "Latest News"
}: { 
  title?: string;
  badge?: string;
} = {}) => {
  const payload = await getPayload({ config });
  
  const { docs: posts } = await payload.find({
    collection: "posts",
    sort: "-publishedDate",
    limit: 3,
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  if (posts.length === 0) return null;

  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <Header
          badge={badge}
          title={title}
          subtitle="Check out our latest articles, updates, and insights about modern web development."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index === 0} />
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
