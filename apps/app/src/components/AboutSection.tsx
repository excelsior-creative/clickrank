import React from 'react'
import Header from './Header'
import { Container } from './Container'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-28 bg-dark">
      <Container>
        <Header
          badge="About Us"
          title="Passion and Dedication Leads to Accuracy"
          subtitle="We thoroughly research and test digital products to provide you with honest, unbiased reviews that help you make the best purchasing decisions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Our Commitment to Quality Reviews</h3>
            <p className="text-gray-400 leading-relaxed">
              At ClickRank, we understand that navigating the world of digital products can be overwhelming. 
              That&apos;s why our team of experts spends countless hours researching, testing, and analyzing 
              products across various categories including software, online courses, e-books, and digital tools.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Our mission is simple: to provide you with comprehensive, unbiased reviews that highlight both 
              the strengths and weaknesses of each product. We believe in transparency and honesty, ensuring 
              you have all the information needed to make confident purchasing decisions.
            </p>
            <div className="pt-4">
              <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold rounded-full px-6">
                <Link href="/about">
                  Discover More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-dark-light rounded-2xl p-8 border border-white/5">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-brand mb-2">500+</div>
                  <div className="text-sm text-gray-400">Products Reviewed</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-brand mb-2">50K+</div>
                  <div className="text-sm text-gray-400">Happy Readers</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-brand mb-2">100+</div>
                  <div className="text-sm text-gray-400">Categories Covered</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-bold text-brand mb-2">4.9/5</div>
                  <div className="text-sm text-gray-400">Trust Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
