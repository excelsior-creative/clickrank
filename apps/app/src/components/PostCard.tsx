import React from "react";
import Link from "next/link";
import { Post, Media } from "@/payload-types";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

type Verdict = "Recommended" | "With caveats" | "Skip";

/**
 * Read a real, human-assigned rating off the post if (and only if) the
 * `rating` field exists on the record. Never fabricate. Returns null when
 * no rating is set — and the score/verdict row won't render.
 *
 * The `rating` field is not yet part of the Posts schema; this guard is
 * deliberately forward-compatible for when the schema migration lands.
 */
const readRating = (post: Post): number | null => {
  const maybe = (post as unknown as { rating?: number | null }).rating;
  if (typeof maybe === "number" && !Number.isNaN(maybe)) {
    return Math.max(0, Math.min(10, maybe));
  }
  return null;
};

const verdictFromScore = (score: number | null): Verdict | null => {
  if (score === null) return null;
  if (score >= 7.5) return "Recommended";
  if (score >= 5) return "With caveats";
  return "Skip";
};

const verdictClass = (verdict: Verdict | null) => {
  if (verdict === "Skip") return "verdict-pill skip";
  if (verdict === "With caveats") return "verdict-pill warn";
  return "verdict-pill";
};

const barSegments = (score: number) => {
  const filled = Math.round(Math.max(0, Math.min(10, score)));
  return Array.from({ length: 10 }, (_, i) => (
    <span key={i} className={i < filled ? "on" : undefined} />
  ));
};

const formatDate = (post: Post) => {
  const raw = (post as unknown as { publishedDate?: string }).publishedDate || post.createdAt;
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const categoryLabel = (post: Post): string => {
  const categories = post.categories;
  if (Array.isArray(categories) && categories.length > 0) {
    const first = categories[0];
    if (first && typeof first === "object" && "name" in first) {
      return String((first as { name?: string }).name || "").toUpperCase();
    }
  }
  return "REVIEW";
};

/**
 * Editorial review card. Replaces the previous image-led blog card with a
 * text-first layout that shows category, title, dek, rating bars + score,
 * a verdict pill, and a byline/date meta row.
 */
export const PostCard = ({ post }: PostCardProps) => {
  const score = readRating(post);
  const verdict = verdictFromScore(score);
  const dek = post.excerpt || "";
  const category = categoryLabel(post);
  // `featuredImage` is intentionally read but not rendered — kept for future
  // hero variants. Reference it so the import stays honest.
  void (post.featuredImage as Media | undefined);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="review-card group flex flex-col gap-4 p-7 rounded-[14px] transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-rule)",
      }}
    >
      <div className="flex justify-between items-start gap-3">
        <span
          className="font-mono"
          style={{
            fontSize: 10.5,
            letterSpacing: "0.14em",
            color: "var(--color-ink-3)",
            textTransform: "uppercase",
          }}
        >
          {category}
        </span>
        <span
          aria-hidden
          className="w-[22px] h-[22px] flex items-center justify-center transition-all group-hover:text-[var(--color-mint)] group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: "var(--color-ink-3)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M3 11L11 3M5 3h6v6" />
          </svg>
        </span>
      </div>

      <h3
        className="m-0"
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 420,
          fontSize: 22,
          lineHeight: 1.18,
          letterSpacing: "-0.015em",
          color: "var(--color-ink)",
        }}
      >
        {post.title}
      </h3>

      {dek && (
        <p
          className="m-0 line-clamp-3"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: 14.5,
            lineHeight: 1.55,
            color: "var(--color-ink-2)",
          }}
        >
          {dek}
        </p>
      )}

      {score !== null && (
        <div className="flex items-center gap-2.5">
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: 24,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              fontFeatureSettings: '"tnum" 1',
              color: "var(--color-ink)",
            }}
          >
            {score.toFixed(1)}
          </span>
          <div className="rating-bars" style={{ width: 92, height: 8 }} aria-hidden>
            {barSegments(score)}
          </div>
        </div>
      )}

      {verdict && <span className={verdictClass(verdict)}>{verdict}</span>}

      <div
        className="flex justify-between items-center font-mono mt-auto pt-4"
        style={{
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--color-ink-3)",
          textTransform: "uppercase",
          borderTop: "1px solid var(--color-rule-soft)",
        }}
      >
        <span style={{ color: "var(--color-ink-2)" }}>ClickRank editorial</span>
        <span>{formatDate(post)}</span>
      </div>
    </Link>
  );
};
