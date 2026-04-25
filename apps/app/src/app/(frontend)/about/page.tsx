import React from "react";
import { Hero } from "@/components/Hero";
import { ProcessSection } from "@/components/ProcessSection";
import { CommitmentSection } from "@/components/CommitmentSection";
import { CTABanner } from "@/components/CTABanner";

export const revalidate = 3600;

const ABOUT_FEATURED = {
  category: "About ClickRank",
  title: "How ClickRank earns your trust.",
  take:
    "Independent, analysis-driven reviews. A transparent editorial process. Affiliate relationships that never decide what we cover. Below: what we actually do, what we never do, and where to tell us we got it wrong.",
  byline: "ClickRank editorial",
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
