import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { Search, FileCheck, BarChart3, Shield, Scale, RefreshCw } from 'lucide-react'

const steps = [
  {
    title: 'Source from ClickBank',
    description: 'We watch the ClickBank marketplace for products with real demand, workable commissions, and room for a genuinely useful review.',
    icon: Search,
  },
  {
    title: 'Research the offer',
    description: 'We collect the vendor claims, pricing, upsells, rebills, refund window, and any publicly available user feedback or complaints.',
    icon: FileCheck,
  },
  {
    title: 'Write the review',
    description: 'We write analysis-driven reviews that lead with real strengths, name real caveats, and never invent testing, testimonials, or statistics.',
    icon: BarChart3,
  },
  {
    title: 'Editorial QA gate',
    description: 'Every draft is checked for missing FTC disclosure, fabricated first-person claims, forbidden medical or income promises, and other quality failures before it can be published.',
    icon: Shield,
  },
  {
    title: 'Disclose and link',
    description: 'Every review carries a clear affiliate disclosure at the top, in the body, and in the site footer. Outbound links are tagged sponsored and nofollow.',
    icon: Scale,
  },
  {
    title: 'Revisit when things change',
    description: 'When a product changes materially or our take on it shifts, we update the review. We would rather correct a page than defend a stale take.',
    icon: RefreshCw,
  },
]

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark-light">
      <Container>
        <Header
          badge="How we work"
          title="Our review process"
          subtitle="The same steps run on every product we cover, from sourcing through disclosure."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-dark border border-white/5 hover:border-brand/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors duration-300">
                <step.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
