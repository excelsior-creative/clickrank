import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post, Media } from "@/payload-types";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export const PostCard = ({ post, priority = false }: PostCardProps) => {
  const featuredImage = post.featuredImage as Media;
  
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-xl bg-dark-light border border-white/5 hover:border-brand/30 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden">
        {featuredImage?.url ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.alt || post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            quality={75}
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-dark flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}
        <span className="text-sm font-semibold text-brand group-hover:underline">
          Read More →
        </span>
      </div>
    </Link>
  );
};
