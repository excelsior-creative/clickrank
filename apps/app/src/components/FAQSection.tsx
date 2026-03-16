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
    answer: "We select products based on market popularity, user demand, and emerging trends in the digital product space. We also consider reader requests and new product launches to ensure we're covering what's most relevant to our audience."
  },
  {
    question: "Are your reviews sponsored or paid for?",
    answer: "No. While we may use affiliate links, our reviews are completely independent and unbiased. We purchase or access products ourselves and our ratings are never influenced by compensation. Our reputation depends on honest assessments."
  },
  {
    question: "How often do you update your reviews?",
    answer: "We review and update our content quarterly, or sooner if there are significant product updates, pricing changes, or new features. We also monitor user feedback to ensure our reviews remain accurate and helpful."
  },
  {
    question: "Can I request a product review?",
    answer: "Absolutely! We welcome reader suggestions. You can reach out through our contact form to suggest products you'd like us to review. While we can't guarantee every request, we do consider them when planning future content."
  },
  {
    question: "What categories of products do you cover?",
    answer: "We cover a wide range of digital products including online courses, software tools, e-books, marketing resources, productivity apps, and more. Our focus is on products that provide value to entrepreneurs, marketers, and online businesses."
  },
  {
    question: "How can I trust your ratings?",
    answer: "Transparency is key to our methodology. Each review explains our testing process, criteria used for evaluation, and any limitations. We also encourage readers to share their own experiences in the comments to create a comprehensive resource."
  },
]

export const FAQSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="FAQ"
          title="Frequently Ask Questions"
          subtitle="Find answers to common questions about our review process and methodology."
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
