import React from "react";
import { getPayload } from "payload";
import type { Where } from "payload";
import config from "@payload-config";
import { PostCard } from "./PostCard";
import type { Post } from "@/payload-types";

type RelatedPostsProps = {
  currentPost: Post;
};

const MAX_RELATED = 3;

function collectIds(
  refs: Post["categories"] | Post["tags"] | null | undefined,
): number[] {
  if (!refs || !Array.isArray(refs)) return [];
  const ids: number[] = [];
  for (const ref of refs) {
    if (typeof ref === "number") ids.push(ref);
    else if (ref && typeof ref === "object" && typeof ref.id === "number") {
      ids.push(ref.id);
    }
  }
  return ids;
}

/**
 * Renders up to three "Related reviews" cards below the article body. Picks
 * posts that share categories or tags with the current post, topping up with
 * the latest published posts if the overlap set is short.
 *
 * Server component. Returns null when the site has no other published posts.
 */
export const RelatedPosts = async ({ currentPost }: RelatedPostsProps) => {
  const payload = await getPayload({ config });

  const categoryIds = collectIds(currentPost.categories);
  const tagIds = collectIds(currentPost.tags);

  const overlapClauses: Where[] = []
  if (categoryIds.length) {
    overlapClauses.push({ categories: { in: categoryIds } });
  }
  if (tagIds.length) {
    overlapClauses.push({ tags: { in: tagIds } });
  }

  let related: Post[] = [];

  if (overlapClauses.length) {
    const { docs } = await payload.find({
      collection: "posts",
      where: {
        and: [
          { id: { not_equals: currentPost.id } },
          { _status: { equals: "published" } },
          { or: overlapClauses },
        ],
      },
      sort: "-publishedDate",
      limit: MAX_RELATED,
      depth: 1,
    });
    related = docs as Post[];
  }

  if (related.length < MAX_RELATED) {
    const excludeIds = [currentPost.id, ...related.map((p) => p.id)];
    const { docs } = await payload.find({
      collection: "posts",
      where: {
        and: [
          { id: { not_in: excludeIds } },
          { _status: { equals: "published" } },
        ],
      },
      sort: "-publishedDate",
      limit: MAX_RELATED - related.length,
      depth: 1,
    });
    related = [...related, ...(docs as Post[])];
  }

  if (related.length === 0) return null;

  return (
    <section
      className="mt-16 pt-10"
      aria-label="Related reviews"
      style={{ borderTop: "1px solid var(--color-rule)" }}
    >
      <div
        className="mb-7 font-mono"
        style={{
          fontSize: 11.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--color-mint)",
        }}
      >
        The Review Desk · Related
      </div>
      <h2
        className="m-0 mb-8"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 380,
          fontSize: "clamp(24px, 3vw, 34px)",
          letterSpacing: "-0.018em",
          lineHeight: 1.1,
          color: "var(--color-ink)",
        }}
      >
        Keep reading from the desk.
      </h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {related.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};
