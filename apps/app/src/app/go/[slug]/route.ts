import { NextRequest, NextResponse } from 'next/server'
import type { Payload } from 'payload'
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
 * Every successful click is also appended to the `outbound-clicks` collection
 * (fire-and-forget) so the CEO can read counts in the admin without Vercel
 * log access.
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

type ClickEvent = {
  slug: string
  productName: string
  vendor?: string
  target: string
  postId?: number
  referer?: string
  userAgent?: string
}

function recordClick(payload: Payload, event: ClickEvent): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(payload.create as any)({
    collection: 'outbound-clicks',
    data: {
      slug: event.slug,
      productName: event.productName,
      vendor: event.vendor,
      target: event.target,
      post: event.postId,
      referer: event.referer,
      userAgent: event.userAgent,
    },
  }).catch((err: unknown) => {
    console.error('[go] outbound-clicks insert failed', err)
  })
}

function respond(
  request: NextRequest,
  event: ClickEvent,
): NextResponse {
  // Structured, single-line log for grep-ability in Vercel logs.
  console.log(
    `[go] click slug=${event.slug} product="${event.productName}" vendor=${event.vendor ?? '-'} ref=${event.referer ?? '-'} ua="${(event.userAgent ?? '').slice(0, 120)}"`,
  )
  const res = NextResponse.redirect(event.target, 302)
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
  const referer = safeReferer(request)
  const userAgent = (request.headers.get('user-agent') || '').slice(0, 200)

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
      const productName = post.productName || post.title || decodedSlug
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
      // Fire-and-forget event row.
      recordClick(payload, {
        slug: decodedSlug,
        productName,
        target,
        postId: post.id,
        referer,
        userAgent,
      })
      return respond(request, {
        slug: decodedSlug,
        productName,
        target,
        postId: post.id,
        referer,
        userAgent,
      })
    }

    // 2. Fall back to the hard-coded ClickBank product list.
    const fallback = getProductBySlug(decodedSlug)
    if (fallback) {
      const event: ClickEvent = {
        slug: decodedSlug,
        productName: fallback.name,
        vendor: fallback.vendor,
        target: fallback.affiliateUrl,
        referer,
        userAgent,
      }
      recordClick(payload, event)
      return respond(request, event)
    }
  } catch (err) {
    console.warn('[go] payload lookup failed, falling back to product list', err)
    // If Payload is unreachable, still try the static fallback list.
    const fallback = getProductBySlug(decodedSlug)
    if (fallback) {
      return respond(request, {
        slug: decodedSlug,
        productName: fallback.name,
        vendor: fallback.vendor,
        target: fallback.affiliateUrl,
        referer,
        userAgent,
      })
    }
  }

  // 3. Nothing matched.
  return NextResponse.json(
    { error: 'Unknown product', slug: decodedSlug },
    { status: 404 },
  )
}
