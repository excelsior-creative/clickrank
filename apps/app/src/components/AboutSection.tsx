import React from 'react'
import Header from './Header'
import { Container } from './Container'

export const AboutSection = () => {
  return (
    <section className="py-20 md:py-24">
      <Container>
        <Header
          badge="About Us"
          title="Building the Future of Content Management"
          subtitle="We combine the power of Next.js 15 and Payload CMS 3.0 to deliver high-performance, developer-friendly templates."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              We believe that managing content should be a seamless experience for both developers
              and editors. Our goal is to provide a rock-solid foundation that leverages the latest
              technologies while maintaining simplicity and scalability.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using a code-first approach with Payload CMS and the powerful rendering
              capabilities of Next.js, we empower teams to build and deploy complex,
              content-driven applications in record time.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">The Tech Stack</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Payload CMS 3.0', description: 'Next-gen headless CMS' },
                { title: 'Next.js 15', description: 'App Router & React 19' },
                { title: 'Cloudflare D1', description: 'Edge-native SQLite database' },
                { title: 'Tailwind CSS', description: 'Utility-first styling' },
                { title: 'Framer Motion', description: 'Smooth animations' },
                { title: 'TypeScript', description: 'End-to-end type safety' },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-xl border border-border bg-card/50">
                  <h4 className="font-bold text-brand">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

