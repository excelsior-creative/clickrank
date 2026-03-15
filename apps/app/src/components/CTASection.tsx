'use client'

import React from 'react'
import { m } from 'framer-motion'
import { Container } from './Container'
import { Button } from './ui/button'
import { useContactDialog } from './ContactDialogProvider'
import { ArrowRight, Sparkles } from 'lucide-react'

export const CTASection = () => {
  const { openContactDialog } = useContactDialog()

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-brand" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-light/50" />
      
      {/* Animated blobs */}
      <m.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" 
      />
      <m.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, -45, 0],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-black/10 rounded-full blur-3xl" 
      />

      <Container>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-brand-foreground" />
            <span className="text-sm font-semibold uppercase tracking-widest">Ready to start?</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
            Bring Your Next Big Idea <br /> to Life with Us
          </h2>

          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Whether you&apos;re building a SaaS product, a marketing site, or a complex enterprise application, 
            our modern tech stack and expert development team are here to help.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={openContactDialog}
              size="lg" 
              className="bg-white text-brand hover:bg-brand-light hover:text-white px-10 h-16 text-xl font-bold rounded-full shadow-xl hover:scale-105 transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button 
              asChild
              variant="outline" 
              size="lg" 
              className="border-white/30 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 px-10 h-16 text-xl rounded-full"
            >
              <a href="https://github.com/payloadcms/payload" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

