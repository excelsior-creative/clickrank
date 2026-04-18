import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { Search, BarChart3, Shield, Zap, BookOpen, AlertTriangle } from 'lucide-react'

const tools = [
  {
    title: 'Marketplace tracking',
    description: 'We pull trending ClickBank products nightly and rank by gravity score, so reviews reflect what is actually selling.',
    icon: Search,
  },
  {
    title: 'Structured reviews',
    description: 'Every review follows the same shape: what it is, who it is for, strengths, honest caveats, pricing, verdict. No fluff.',
    icon: BookOpen,
  },
  {
    title: 'Analysis, not hype',
    description: 'We read vendor docs and public user feedback. We do not invent testimonials, studies, or first-person experience we did not have.',
    icon: BarChart3,
  },
  {
    title: 'Honest caveats',
    description: 'Every review includes at least one real limitation. A product with no downsides on paper is a red flag, not a sales pitch.',
    icon: AlertTriangle,
  },
  {
    title: 'Transparent disclosure',
    description: 'Affiliate relationship disclosed on every review and in the footer. Compensation never changes what we cover or how we rate.',
    icon: Shield,
  },
  {
    title: 'Fresh content',
    description: 'New reviews are published on a nightly cadence. Stale reviews get revisited when the marketplace or vendor shifts.',
    icon: Zap,
  },
]

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark-light">
      <Container>
        <Header
          badge="How we review"
          title="What goes into every review"
          subtitle="A repeatable methodology built on public data and a clear editorial standard — not guesswork and not fabricated experience."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-xl bg-dark border border-white/5 hover:border-brand/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors duration-300">
                <tool.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors">
                {tool.title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                {tool.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
