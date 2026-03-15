import { Container } from '@/components/Container'

export const revalidate = 3600

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 md:py-32">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Our <span className="text-brand">Template</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              This is a modern boilerplate designed to help developers build content-rich websites
              faster than ever before. Combining the power of Next.js 16 and Payload CMS 3.0.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-muted/30">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that managing content shouldn&apos;t be a chore. By using Payload&apos;s
                code-first approach and Next.js&apos;s powerful rendering capabilities, we&apos;ve
                created a foundation that is both flexible for developers and easy for content
                editors.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">The Tech Stack</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Payload CMS 3.0</li>
                <li>• Next.js 16 (App Router)</li>
                <li>• PostgreSQL via Vercel Postgres</li>
                <li>• Tailwind CSS v4 for styling</li>
                <li>• Framer Motion for animations</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
