import React from "react";
import { Hero } from "@/components/Hero";
import { BlogSection } from "@/components/BlogSection";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import nextDynamic from 'next/dynamic'

const CTASection = nextDynamic(() =>
  import('@/components/CTASection').then((mod) => mod.CTASection),
)

export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <AboutSection />
      <ServicesSection />
      <BlogSection title="Recent Posts" badge="Our Blog" />
      <CTASection />
    </div>
  );
}
