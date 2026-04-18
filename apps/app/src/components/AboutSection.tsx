import React from 'react'
import Header from './Header'
import { Container } from './Container'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="About"
          title="Honest analysis, not hype"
          subtitle="We read the claims, vendor docs, and public user feedback so you don't have to. Every review tells you what a ClickBank product actually is, who it's for, and where it falls short."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">How we review</h3>
            <p className="text-gray-400 leading-relaxed">
              ClickRank is a ClickBank affiliate review site. We track the
              marketplace, surface trending products, and publish structured
              reviews that lead with real strengths, include at least one
              honest limitation, and never fabricate testimonials, studies, or
              first-person claims.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We earn a commission when a reader buys through a link on this
              site. Compensation never decides what we cover or how we rate a
              product — see our affiliate disclosure at the bottom of every
              page.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold rounded-full px-6">
                <Link href="/about">
                  Read the full editorial standard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-dark-light rounded-2xl p-8 border border-white/5">
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-brand font-bold">01.</span>
                  <span>Pull trending products from the ClickBank marketplace by gravity score.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand font-bold">02.</span>
                  <span>Write a structured review: what it is, who it's for, strengths, honest caveats, pricing, verdict.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand font-bold">03.</span>
                  <span>Refuse fabricated testimonials, studies, medical/financial/income claims.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-brand font-bold">04.</span>
                  <span>Disclose the affiliate relationship on every page — no exceptions.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
