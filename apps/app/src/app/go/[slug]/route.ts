import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Outbound affiliate click tracker.
 *
 * Looks up the Post by slug, increments its click counter, and 302s to the
 * stored affiliateUrl. If no affiliateUrl is set we bounce the user back to
 * the post so they don't land on a dead page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: decodedSlug } },
    limit: 1,
    depth: 0,
  })

  const post = docs[0] as
    | { id: number; affiliateUrl?: string | null; clickCount?: number | null }
    | undefined

  if (!post) {
    return NextResponse.redirect(new URL('/blog', _request.url), 302)
  }

  const target = post.affiliateUrl?.trim()

  if (!target) {
    return NextResponse.redirect(new URL(`/blog/${decodedSlug}`, _request.url), 302)
  }

  payload
    .update({
      collection: 'posts',
      id: post.id,
      data: { clickCount: (post.clickCount ?? 0) + 1 },
    })
    .catch((err: unknown) => {
      console.error('[go] click counter update failed', err)
    })

  return NextResponse.redirect(target, 302)
}
