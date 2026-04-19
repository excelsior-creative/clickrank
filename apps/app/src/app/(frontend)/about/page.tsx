import React from "react";
import { Hero } from "@/components/Hero";
import { ProcessSection } from "@/components/ProcessSection";
import { CommitmentSection } from "@/components/CommitmentSection";
import { CTABanner } from "@/components/CTABanner";

export const revalidate = 3600;

const ABOUT_FEATURED = {
  category: "About · The desk",
  title: "How ClickRank earns your trust.",
  take:
    "Independent editors, hands-on testing, and affiliate relationships that never decide what we cover. Below: the people, the process, and the promise.",
  score: 9.2,
  verdict: "Recommended" as const,
  byline: "ClickRank desk",
  date: "Always current",
  href: "/blog",
};

export default function AboutPage() {
  return (
    <>
      <Hero issue="About · The ClickRank editorial desk" featured={ABOUT_FEATURED} />
      <ProcessSection />
      <CommitmentSection />
      <CTABanner />
    </>
  );
}
