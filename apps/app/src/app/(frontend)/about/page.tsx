import Link from 'next/link'
import { Container } from '@/components/Container'
import { Button } from '@/components/ui/button'
import { AffiliateDisclosure } from '@/components/AffiliateDisclosure'

export const revalidate = 3600

export const metadata = {
  title: 'About',
  description:
    'ClickRank is an independent review site for ClickBank digital products. We lead with real strengths, name real caveats, and disclose every affiliate relationship.',
  alternates: { canonical: '/about' },
}

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
              ClickRank is an independent review site for digital products sold
              through the ClickBank marketplace. We lead with real strengths,
              name real caveats, and disclose every affiliate relationship.
            </p>
            <AffiliateDisclosure variant="banner" />
          </div>
        </Container>
      </section>

      <section className="py-20 bg-dark-light">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">Our mission</h2>
              <p className="text-gray-400 leading-relaxed">
                Most ClickBank review sites are thinly disguised sales pages:
                fake testimonials, no downsides, every product rated nine out of
                ten. That entire category has trained readers, and Google, to
                distrust it. ClickRank&apos;s mission is to be the reference
                readers reach for when they want an honest take on whether a
                ClickBank offer is worth their money.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-white">What we actually do</h2>
              <ul className="space-y-2 text-gray-400 leading-relaxed">
                <li>• Pick ClickBank products worth covering</li>
                <li>• Research vendor claims, pricing, upsells, rebills, refund policies, and public feedback</li>
                <li>• Write analysis-driven reviews that are favorable when deserved and critical when not</li>
                <li>• Run every draft through an editorial QA gate before it can publish</li>
                <li>• Disclose every affiliate relationship clearly on every page</li>
                <li>• Update or correct reviews when readers tell us something is wrong</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section id="editorial" className="py-20">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Editorial standard
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              The full rules we hold every review to, including what we refuse
              to write and how we handle affiliate relationships, live on our
              editorial standard page.
            </p>
            <Button asChild className="bg-brand hover:bg-brand-light text-dark font-bold rounded-full px-6">
              <Link href="/editorial">Read the editorial standard</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
