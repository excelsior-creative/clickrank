import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

/**
 * Hero component optimized for LCP performance.
 *
 * Uses CSS animations instead of framer-motion for initial reveal to:
 * 1. Allow content to be visible in SSR HTML (improves LCP)
 * 2. Run animations on compositor thread (GPU-accelerated)
 * 3. Reduce JavaScript bundle size
 *
 * The CSS animations are defined inline to keep the component self-contained.
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-dot-pattern">
      {/* CSS animations for fade-in-up effect - defined inline for portability */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes heroFadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .hero-animate {
              animation: heroFadeInUp 0.5s ease-out forwards;
            }
            .hero-animate-delay-1 {
              animation: heroFadeInUp 0.5s ease-out 0.1s forwards;
              opacity: 0;
            }
            .hero-animate-delay-2 {
              animation: heroFadeInUp 0.5s ease-out 0.2s forwards;
              opacity: 0;
            }
            /* Respect reduced motion preferences */
            @media (prefers-reduced-motion: reduce) {
              .hero-animate,
              .hero-animate-delay-1,
              .hero-animate-delay-2 {
                animation: none;
                opacity: 1;
                transform: none;
              }
            }
          `,
        }}
      />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="hero-animate">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Build Faster with <br />
            <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">Next.js + Payload CMS</span>
          </h1>
        </div>

        <p className="hero-animate-delay-1 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          A modern boilerplate template featuring Payload CMS 3.0, Next.js 15,
          and beautiful UI components. Perfect for your next SaaS or marketing site.
        </p>

        <div className="hero-animate-delay-2 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-light text-white px-8 h-14 text-lg transition-colors border-none">
            <Link href="/admin">
              Start Building
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 h-14 text-lg">
            <Link href="/blog">View Demo Blog</Link>
          </Button>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] -z-0 opacity-50" />
    </section>
  );
};
