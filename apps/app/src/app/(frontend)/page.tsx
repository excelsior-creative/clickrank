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
 * Featured-pick data for the hero card. Sourced from the most recent
 * published post. Editorial scores are intentionally OMITTED — we won't
 * render a score/verdict unless a real human rating exists on the Post
 * record (the `rating` field is not yet part of the Posts schema; queued
 * as a separate migration PR).
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
  let category = "Latest review";
  if (Array.isArray(categories) && categories.length > 0) {
    const first = categories[0];
    if (first && typeof first === "object" && "name" in first) {
      category = `Latest · ${(first as { name?: string }).name ?? "Review"}`;
    }
  }

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
      "A plain-English review: what you actually get, who it's for, what could be better, and whether the affiliate offer is worth the click.",
    byline: "ClickRank editorial",
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
