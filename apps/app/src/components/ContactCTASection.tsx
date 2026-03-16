import React from 'react'
import { Container } from './Container'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const ContactCTASection = () => {
  return (
    <section className="py-16 md:py-20 bg-dark-light border-y border-white/5">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              Exploring the digital products landscape and have a specific question? Let&apos;s connect.
            </h3>
          </div>
          <div className="flex-shrink-0">
            <Button 
              asChild
              className="bg-brand hover:bg-brand-light text-dark font-bold rounded-full px-8 h-12"
            >
              <Link href="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
