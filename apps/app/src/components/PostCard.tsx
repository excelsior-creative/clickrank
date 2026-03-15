import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post, Media } from "@/payload-types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export const PostCard = ({ post, priority = false }: PostCardProps) => {
  const featuredImage = post.featuredImage as Media;
  
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            {featuredImage?.url ? (
              <Image
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={75}
                priority={priority}
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-brand transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-0">
          <span className="text-sm font-semibold group-hover:underline">
            Read More →
          </span>
        </CardFooter>
      </Link>
    </Card>
  );
};
