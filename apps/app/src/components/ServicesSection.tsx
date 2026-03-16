import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { Search, FileCheck, BarChart3, Shield, Zap, Users } from 'lucide-react'

const tools = [
  {
    title: 'In-Depth Research',
    description: 'We conduct thorough market research to identify trending products and emerging digital solutions worth reviewing.',
    icon: Search,
  },
  {
    title: 'Hands-On Testing',
    description: 'Every product we review undergoes rigorous hands-on testing to evaluate features, usability, and value.',
    icon: FileCheck,
  },
  {
    title: 'Data Analysis',
    description: 'We analyze user feedback, ratings, and performance metrics to provide data-driven recommendations.',
    icon: BarChart3,
  },
  {
    title: 'Quality Assurance',
    description: 'Our quality standards ensure only legitimate, high-value products make it to our recommendations.',
    icon: Shield,
  },
  {
    title: 'Fast Updates',
    description: 'We regularly update our reviews to reflect product changes, new features, and current market conditions.',
    icon: Zap,
  },
  {
    title: 'Community Feedback',
    description: 'We incorporate feedback from our community of readers to continuously improve our review process.',
    icon: Users,
  },
]

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark-light">
      <Container>
        <Header
          badge="What we offer"
          title="Our Tools & Process"
          subtitle="We employ a comprehensive methodology to ensure every review is thorough, unbiased, and valuable to our readers."
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
