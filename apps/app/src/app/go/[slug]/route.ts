import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getProductBySlug } from '@/services/clickbankService'

/**
 * Outbound affiliate click tracker.
 *
 *   /go/[slug]  →  302 redirect to the affiliate URL
 *
 * Resolution order:
 *   1. Post in Payload with a matching slug and a populated `affiliateUrl`.
 *      Increments `clickCount` asynchronously so we don't delay the redirect.
 *   2. Fallback hard-coded product list (keyword-only slugs, used pre-launch
 *      and when an article hasn't been generated for a product yet).
 *   3. 404 JSON.
 *
 * The route is deliberately stateless and minimal: the slower this is, the
 * slower every affiliate click feels. Database lookups are capped at depth 0.
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeReferer(req: NextRequest): string | undefined {
  const ref = req.headers.get('referer') || undefined
  if (!ref) return undefined
  try {
    const parsed = new URL(ref)
    // Only log same-origin referer paths to keep logs clean and avoid
    // leaking cross-site URLs. Absence of referer is fine.
    const host = req.headers.get('host')
    if (host && parsed.host === host) return parsed.pathname + parsed.search
    return parsed.origin
  } catch {
    return undefined
  }
}

function respond(
  request: NextRequest,
  slug: string,
  productName: string,
  vendor: string | undefined,
  target: string,
): NextResponse {
  const ref = safeReferer(request)
  const ua = request.headers.get('user-agent') || ''
  // Structured, single-line log for grep-ability in Vercel logs.
  console.log(
    `[go] click slug=${slug} product="${productName}" vendor=${vendor ?? '-'} ref=${ref ?? '-'} ua="${ua.slice(0, 120)}"`,
  )
  const res = NextResponse.redirect(target, 302)
  // Belt-and-suspenders: tell search engines this is a sponsored redirect.
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await context.params
  const decodedSlug = decodeURIComponent(slug)

  // 1. Try Payload first — posts carry the authoritative, per-draft affiliate
  //    URL and click counter.
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: decodedSlug } },
      limit: 1,
      depth: 0,
    })
    const post = docs[0] as
      | {
          id: number
          title?: string
          affiliateUrl?: string | null
          productName?: string | null
          clickCount?: number | null
        }
      | undefined

    if (post && post.affiliateUrl?.trim()) {
      const target = post.affiliateUrl.trim()
      // Fire-and-forget click counter update.
      payload
        .update({
          collection: 'posts',
          id: post.id,
          data: { clickCount: (post.clickCount ?? 0) + 1 },
        })
        .catch((err: unknown) => {
          console.error('[go] click counter update failed', err)
        })
      return respond(
        request,
        decodedSlug,
        post.productName || post.title || decodedSlug,
        undefined,
        target,
      )
    }
  } catch (err) {
    console.warn('[go] payload lookup failed, falling back to product list', err)
  }

  // 2. Fall back to the hard-coded ClickBank product list.
  const fallback = getProductBySlug(decodedSlug)
  if (fallback) {
    return respond(
      request,
      decodedSlug,
      fallback.name,
      fallback.vendor,
      fallback.affiliateUrl,
    )
  }

  // 3. Nothing matched.
  return NextResponse.json(
    { error: 'Unknown product', slug: decodedSlug },
    { status: 404 },
  )
}
