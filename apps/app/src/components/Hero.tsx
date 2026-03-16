import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

/**
 * Hero component for ClickRank - Digital Products Review Site
 */
export const Hero = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-36 bg-dark">
      {/* CSS animations for fade-in-up effect */}
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

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark to-dark-light opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark via-transparent to-dark-light/50" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="hero-animate">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
            Discover the Best in<br />
            <span className="text-brand">Digital Products</span>
          </h1>
        </div>

        <p className="hero-animate-delay-1 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Honest ClickBank product reviews and recommendations to help you make informed decisions about digital products, courses, and services.
        </p>

        <div className="hero-animate-delay-2 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-brand hover:bg-brand-light text-dark font-bold px-8 h-14 text-lg transition-colors border-none rounded-full">
            <Link href="#products">
              Discover More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand/3 rounded-full blur-[100px] -z-0" />
    </section>
  );
};
