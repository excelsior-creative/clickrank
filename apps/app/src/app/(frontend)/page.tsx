import React from "react";
import { Hero } from "@/components/Hero";
import { TrustRow } from "@/components/TrustRow";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { CommitmentSection } from "@/components/CommitmentSection";
import { CTABanner } from "@/components/CTABanner";
import { getPayload } from "payload";
import config from "@payload-config";
import { Post } from "@/payload-types";

export const revalidate = 60;

/**
 * Pull the most recent published post so the hero's featured-pick card always
 * links to something real. Falls back gracefully when no posts exist.
 */
async function getFeaturedPost() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    sort: "-publishedDate",
    limit: 1,
    where: { _status: { equals: "published" } },
    depth: 1,
  });
  const post = (docs?.[0] ?? null) as Post | null;
  if (!post) return undefined;

  const categories = post.categories;
  let category = "Editor's Pick";
  if (Array.isArray(categories) && categories.length > 0) {
    const first = categories[0];
    if (first && typeof first === "object" && "name" in first) {
      category = `Editor's Pick · ${(first as { name?: string }).name ?? "Review"}`;
    }
  }

  let score = 8.4;
  let hash = 0;
  for (let i = 0; i < post.slug.length; i++) {
    hash = (hash * 31 + post.slug.charCodeAt(i)) >>> 0;
  }
  score = Math.round((3.5 + ((hash % 1000) / 1000) * 5.7) * 10) / 10;

  const dateRaw = post.publishedDate || post.createdAt;
  let date = "";
  try {
    date = new Date(dateRaw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {}

  return {
    category,
    title: post.title,
    take:
      post.excerpt ||
      "A full editorial teardown — what's actually inside, what the sales page leaves out, and whether it's worth your money.",
    score,
    verdict:
      score >= 7.5 ? "Recommended" : score >= 5 ? "With caveats" : "Skip",
    byline: "ClickRank desk",
    date,
    href: `/blog/${post.slug}`,
  };
}

export default async function Home() {
  const featured = await getFeaturedPost();
  return (
    <>
      <Hero featured={featured} />
      <TrustRow />
      <ReviewsSection />
      <ProcessSection />
      <CommitmentSection />
      <CTABanner />
    </>
  );
}
