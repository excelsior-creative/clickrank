import React from 'react'
import Header from './Header'
import { Container } from './Container'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Code2, Layout, Zap, Shield, Smartphone, Globe } from 'lucide-react'

const services = [
  {
    title: 'Custom Development',
    description: 'Bespoke web applications built with Next.js and Payload CMS tailored to your needs.',
    icon: Code2,
  },
  {
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces designed with modern user experience principles.',
    icon: Layout,
  },
  {
    title: 'Performance Optimization',
    description: 'Lightning-fast load times and optimized Core Web Vitals for better SEO and conversion.',
    icon: Zap,
  },
  {
    title: 'Enterprise Security',
    description: 'Robust access control and secure data handling patterns built into every project.',
    icon: Shield,
  },
  {
    title: 'Responsive Design',
    description: 'Seamless experiences across all devices, from mobile phones to large desktops.',
    icon: Smartphone,
  },
  {
    title: 'Global Delivery',
    description: 'Edge-native deployments using Cloudflare for low latency and high availability worldwide.',
    icon: Globe,
  },
]

export const ServicesSection = () => {
  return (
    <section className="py-20 md:py-24 bg-muted/30">
      <Container>
        <Header
          badge="Our Services"
          title="What We Offer"
          subtitle="Comprehensive solutions for modern web development, leveraging the best of the Next.js and Payload ecosystem."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors duration-300">
                  <service.icon className="w-6 h-6 text-brand group-hover:text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-brand transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}

