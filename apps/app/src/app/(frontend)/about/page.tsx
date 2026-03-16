import { Container } from '@/components/Container'

export const revalidate = 3600

export default function AboutPage() {
  return (
    <div className="flex flex-col bg-dark">
      <section className="py-20 md:py-32">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              About <span className="text-brand">ClickRank</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Your trusted source for honest digital product reviews. We help you make informed 
              decisions with unbiased, thorough analysis of ClickBank products and digital courses.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-dark-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                At ClickRank, we understand that navigating the world of digital products can be overwhelming. 
                That&apos;s why our team of experts spends countless hours researching, testing, and analyzing 
                products across various categories to provide you with honest, unbiased reviews.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">What We Do</h2>
              <ul className="space-y-2 text-gray-400">
                <li>• In-depth product research and testing</li>
                <li>• Unbiased reviews and ratings</li>
                <li>• Comprehensive buying guides</li>
                <li>• Regular updates on product changes</li>
                <li>• Community-driven recommendations</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
