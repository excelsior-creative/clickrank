import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/services/clickbankService'

/**
 * Outbound affiliate click tracker.
 *
 *   /go/[slug]  →  302 redirect to the product's affiliate URL
 *
 * Every outbound affiliate click on ClickRank should flow through this
 * route so we can count clicks per product. For now we log to stdout
 * (visible in Vercel logs); once we have a collection for analytics
 * events we'll persist to Payload.
 *
 * The route is deliberately stateless and minimal: the slower this is,
 * the slower every affiliate click feels.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeReferer(req: NextRequest): string | undefined {
  const ref = req.headers.get('referer') || undefined
  if (!ref) return undefined
  try {
    const parsed = new URL(ref)
    // Only log same-origin referers to keep logs clean and avoid leaking
    // cross-site URLs. Absence of referer is fine.
    const host = req.headers.get('host')
    if (host && parsed.host === host) return parsed.pathname + parsed.search
    return parsed.origin
  } catch {
    return undefined
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params

  const product = getProductBySlug(slug)
  if (!product) {
    return NextResponse.json(
      { error: 'Unknown product', slug },
      { status: 404 },
    )
  }

  const ref = safeReferer(request)
  const ua = request.headers.get('user-agent') || ''
  // Structured, single-line log for grep-ability in Vercel logs.
  console.log(
    `[go] click slug=${slug} product="${product.name}" vendor=${product.vendor} ref=${ref ?? '-'} ua="${ua.slice(0, 120)}"`,
  )

  const res = NextResponse.redirect(product.affiliateUrl, 302)
  // Belt-and-suspenders: tell search engines this is a sponsored redirect.
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  return res
}
