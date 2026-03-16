import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Online Entrepreneur",
    content: "ClickRank has been instrumental in helping me find the right tools for my business. Their reviews are thorough and saved me from making costly mistakes.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Digital Marketer",
    content: "I appreciate the honesty in their reviews. They don't just promote products for commissions - they actually test and provide genuine insights.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Course Creator",
    content: "The detailed breakdowns of features and pricing helped me choose the perfect platform for my online courses. Highly recommend their reviews!",
    rating: 5,
  },
]

export const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark-light">
      <Container>
        <Header
          badge="Testimonial"
          title="What they say"
          subtitle="Hear from our community of readers who trust ClickRank for their digital product decisions."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="relative p-6 rounded-xl bg-dark border border-white/5 hover:border-brand/20 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-brand/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                  <div className="text-gray-500 text-xs">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
