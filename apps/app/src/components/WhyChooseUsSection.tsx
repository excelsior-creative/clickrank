import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { CheckCircle2 } from 'lucide-react'

const reasons = [
  {
    title: 'Unbiased Reviews',
    description: 'We maintain complete editorial independence and never let compensation influence our ratings.',
  },
  {
    title: 'Expert Analysis',
    description: 'Our team consists of industry experts with years of experience in digital products and online marketing.',
  },
  {
    title: 'Comprehensive Coverage',
    description: 'From software to courses, we cover all major categories of digital products with in-depth reviews.',
  },
  {
    title: 'Regular Updates',
    description: 'We continuously monitor products and update our reviews to ensure accuracy and relevance.',
  },
  {
    title: 'Reader First',
    description: 'Our readers are our priority. We focus on providing value and helping you make informed decisions.',
  },
  {
    title: 'Transparent Ratings',
    description: 'Our rating system is clear and consistent, making it easy to compare products across categories.',
  },
]

export const WhyChooseUsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="Why Choose Us"
          title="With Experience Comes Trust"
          subtitle="We&apos;ve built our reputation on providing honest, thorough, and reliable product reviews."
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
