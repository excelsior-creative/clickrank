'use client'

import React from 'react'
import Header from './Header'
import { Container } from './Container'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do you choose which products to review?",
    answer: "We pick from the ClickBank marketplace, prioritizing products with real demand, workable commissions, and room for a genuinely useful review. Reader suggestions sent through our contact form go into the same queue."
  },
  {
    question: "Do you earn a commission when I buy through your links?",
    answer: "Yes. ClickRank is an affiliate of ClickBank vendors, and we earn a commission when readers purchase through our links. Our commission does not determine what we cover or how we rate a product, and every page with affiliate links carries a clear disclosure. See our editorial standard for the full rules."
  },
  {
    question: "Do you personally test every product before reviewing it?",
    answer: "No, and we do not claim to. Our reviews are analysis-driven: we work from vendor materials, pricing, refund policies, and publicly available user feedback. Where we have hands-on experience with a product, we say so. Where we do not, we do not pretend otherwise."
  },
  {
    question: "How often do you update your reviews?",
    answer: "We update reviews when a product changes materially, when pricing shifts, or when a reader points out something wrong. If you spot an inaccuracy in any review, email us and we'll correct it."
  },
  {
    question: "Can I request a product review?",
    answer: "Yes. Reach out through the contact page. We cannot guarantee every request, but reader suggestions go into the same source queue the pipeline picks from."
  },
  {
    question: "What categories do you cover?",
    answer: "ClickBank's main digital-product verticals: health and fitness, self-help, e-business and e-marketing, pets, and home and garden. We stay inside ClickBank on purpose so coverage stays deep instead of spread thin."
  },
]

export const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="FAQ"
          title="Frequently asked questions"
          subtitle="Answers to the things readers ask us most often about how ClickRank reviews work."
        />

        <div className="max-w-3xl mx-auto mt-16">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-white/5 rounded-lg bg-dark-light px-6 data-[state=open]:border-brand/30"
              >
                <AccordionTrigger className="text-white hover:text-brand text-left py-5 text-base font-medium [&[data-state=open]]:text-brand">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
