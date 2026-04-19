import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { CheckCircle2 } from 'lucide-react'

const reasons = [
  {
    title: 'Independence, by policy',
    description: 'Affiliate commissions fund the site, but they do not determine what we cover or how we rate it. Our disclosure runs on every page.',
  },
  {
    title: 'Analysis, not fabrication',
    description: 'We never invent features, statistics, or testimonials. When we describe a vendor claim, we say it is a vendor claim.',
  },
  {
    title: 'ClickBank focus',
    description: 'We only cover products available on ClickBank. Deep coverage of one marketplace beats thin coverage of a dozen.',
  },
  {
    title: 'Honest caveats',
    description: 'Every review names at least one real limitation. A review with zero downsides is an advertisement.',
  },
  {
    title: 'FTC disclosure everywhere',
    description: 'Every page with an affiliate link carries a clear disclosure at the top, in the body, and in the footer.',
  },
  {
    title: 'We correct mistakes',
    description: 'If you spot an inaccuracy, email us. We update or retract rather than defend a stale claim.',
  },
]

export const WhyChooseUsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="Why ClickRank"
          title="What we stand for"
          subtitle="The rules we hold ourselves to on every review. If we break one, email us and we&apos;ll correct it."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {reasons.map((reason, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-6 rounded-xl bg-dark-light/50 border border-white/5 hover:border-brand/20 transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-brand" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
