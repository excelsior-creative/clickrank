import React from "react";
import Link from "next/link";
import { getPayload } from "payload";
import config from "@payload-config";
import { PostCard } from "./PostCard";
import { SectionHead } from "./SectionHead";
import { Post, Category } from "@/payload-types";

/**
 * Homepage "Review Desk" band. Pulls the latest nine published posts, groups
 * available categories into filter chips, and renders the review cards on a
 * three-column editorial grid.
 *
 * Filter chips are rendered as plain anchors — the actual filtering lives on
 * the blog list page (`/blog?category=…`). We keep this server-side for
 * search-engine indexing; client-side filter could be layered on later.
 */
export const ReviewsSection = async () => {
  const payload = await getPayload({ config });

  const [{ docs: posts }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: "posts",
      sort: "-publishedDate",
      limit: 9,
      where: { _status: { equals: "published" } },
      depth: 1,
    }),
    payload.find({
      collection: "categories",
      limit: 16,
      sort: "name",
    }),
  ]);

  if (posts.length === 0) return null;

  return (
    <section id="reviews" className="max-w-[1280px] mx-auto px-5 md:px-10">
      <SectionHead
        eyebrow="Recent reviews"
        title={
          <>
            The products we{" "}
            <em className="font-serif-italic text-[var(--color-mint)]">
              looked at
            </em>{" "}
            lately.
          </>
        }
        description="Every review below is analysis-driven, FTC-disclosed, and dated so you can see when it was last updated. Filter by category to narrow down."
        linkHref="/blog"
        linkLabel="View all reviews"
      />

      {categories.length > 0 && (
        <nav
          className="flex gap-2 flex-wrap pb-10"
          aria-label="Filter reviews by category"
        >
          <Link href="/blog" className="cat-chip active">
            All <span className="count">{posts.length}</span>
          </Link>
          {(categories as Category[]).slice(0, 9).map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className="cat-chip"
            >
              {cat.name}
            </Link>
          ))}
        </nav>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {(posts as Post[]).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .cat-chip{
            font-family: var(--font-sans);
            font-size: 13px;
            padding: 9px 16px;
            border: 1px solid var(--color-rule);
            border-radius: 9999px;
            display: inline-flex; align-items: center; gap: 8px;
            cursor: pointer;
            background: var(--color-card);
            color: var(--color-ink-2);
            transition: border-color .15s, background .15s, color .15s;
          }
          .cat-chip:hover{
            border-color: var(--color-ink-3);
            color: var(--color-ink);
          }
          .cat-chip.active{
            background: var(--color-mint);
            color: var(--color-mint-ink);
            border-color: var(--color-mint);
            box-shadow: 0 0 18px oklch(82% 0.19 165 / .35);
          }
          .cat-chip .count{
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--color-ink-3);
          }
          .cat-chip.active .count{ color: oklch(30% 0.05 165); }
          `,
        }}
      />
    </section>
  );
};
