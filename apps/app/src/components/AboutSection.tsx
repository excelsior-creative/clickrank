import React from 'react'
import Header from './Header'
import { Container } from './Container'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const principles = [
  {
    title: 'No fabrication',
    body: 'We never invent features, testimonials, or statistics. If we do not know something, we say so.',
  },
  {
    title: 'Real strengths first',
    body: 'Every review leads with what actually works about the product, based on vendor claims and public feedback.',
  },
  {
    title: 'Honest caveats',
    body: 'Every review names at least one real limitation. A review with zero downsides is an ad, not a review.',
  },
  {
    title: 'We skip obvious scams',
    body: 'If a product looks deceptive, we do not cover it. Skipping a commission is cheaper than losing reader trust.',
  },
]

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="About ClickRank"
          title="Honest reviews of ClickBank products"
          subtitle="ClickBank is full of digital products with very few honest reviews. We cover them lead with real strengths, name real caveats, and disclose every affiliate relationship."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-start">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              How we review
            </h3>
            <p className="text-gray-400 leading-relaxed">
              ClickRank is a small, independent review site focused on digital
              products sold through the ClickBank marketplace. Our reviews are
              analysis-driven: we gather vendor claims, pricing, refund policies,
              and publicly available user feedback, then synthesize that into a
              review that is favorable when the product deserves it and critical
              when it does not.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We do not fabricate personal testing, invent testimonials, or
              promise outcomes. When we link to a product, that link is an
              affiliate link and we earn a commission if you buy. Our
              commission does not influence what we cover or how we rate a
              product, and every page with affiliate links carries a clear
              disclosure.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold rounded-full px-6">
                <Link href="/editorial">
                  Read our editorial standard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/15 text-white hover:text-brand hover:border-brand/50 px-6">
                <Link href="/blog">
                  Browse reviews
                </Link>
              </Button>
            </div>
          </div>

          <div className="bg-dark-light rounded-2xl p-8 border border-white/5">
            <h4 className="text-sm font-semibold text-brand tracking-wide uppercase mb-6">
              Our editorial principles
            </h4>
            <ul className="space-y-5">
              {principles.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">{p.title}</div>
                    <div className="text-sm text-gray-400 leading-relaxed">{p.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}
