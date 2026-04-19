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
    "Independent editors, a transparent process, and affiliate relationships that never decide what we cover. Below: the people, the process, and the promise.",
  score: 9.2,
  verdict: "Recommended" as const,
  byline: "ClickRank desk",
  date: "Always current",
  href: "/editorial",
};

export const metadata = {
  title: "About",
  description:
    "ClickRank is an independent review site for ClickBank digital products. We lead with real strengths, name real caveats, and disclose every affiliate relationship.",
  alternates: { canonical: "/about" },
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
