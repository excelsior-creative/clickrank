import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { pickTrendingProduct } from '@/services/clickbankService'
import {
  generateArticleForProduct,
  generateFeaturedImage,
  downloadImage,
  markdownToLexical,
  getGenerationSettings,
  suggestArticleTags,
  getRandomPublishTime,
} from '@/services/contentGenerationService'

/**
 * Cron job endpoint for automated article generation
 *
 * Called by Vercel Cron on a nightly schedule. Steps:
 *   1. Fetch trending products from ClickBank marketplace
 *   2. Pick a product not recently covered
 *   3. Generate an affiliate review article with Gemini
 *   4. Generate a featured image via Replicate
 *   5. Upload image to Payload CMS
 *   6. Create post as draft
 */
export async function GET(request: NextRequest) {
  // 1. Auth
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validate required keys upfront
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    return NextResponse.json(
      { error: 'GOOGLE_GENAI_API_KEY is not configured. Add it as a Vercel environment variable.' },
      { status: 500 },
    )
  }

  try {
    // 3. Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // 4. Load CMS generation settings
    const settings = await getGenerationSettings(payload)
    console.log('[generate-article] Settings loaded')

    // 5. Fetch recent post slugs to avoid topic repetition
    const recentPosts = await payload.find({
      collection: 'posts',
      limit: 50,
      sort: '-publishedDate',
      select: { slug: true },
    })
    const recentSlugs = recentPosts.docs.map((p: { slug?: string }) => p.slug ?? '')
    console.log(`[generate-article] Found ${recentSlugs.length} recent posts`)

    // 6. Pick a trending ClickBank product not recently covered
    const product = await pickTrendingProduct(recentSlugs)
    console.log(`[generate-article] Selected product: "${product.name}" (gravity: ${product.gravity})`)

    // 7. Generate article via Gemini (includes humanization)
    const article = await generateArticleForProduct(product, settings)
    console.log(`[generate-article] Generated article: "${article.title}"`)

    // 8. Generate featured image via Replicate (optional — skip if no key)
    let featuredImageId: number | undefined
    if (process.env.REPLICATE_API_KEY) {
      try {
        const imageUrl = await generateFeaturedImage(
          { title: article.title, excerpt: article.excerpt },
          settings,
        )
        const imageBuffer = await downloadImage(imageUrl)

        const keywordSlug = article.product.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        const featuredImageDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${article.title} - ClickRank Review`,
          },
          file: {
            data: imageBuffer,
            name: `${keywordSlug}-${article.slug}-featured-${Date.now()}.png`,
            mimetype: 'image/png',
            size: imageBuffer.length,
          },
        })
        featuredImageId = featuredImageDoc.id as number
        console.log(`[generate-article] Uploaded featured image: ${featuredImageId}`)
      } catch (imgErr) {
        console.warn('[generate-article] Image generation failed (non-fatal):', imgErr)
      }
    } else {
      console.warn('[generate-article] REPLICATE_API_KEY not set — skipping image generation')
    }

    // 9. Suggest tags
    const { docs: allTags } = await payload.find({ collection: 'tags', limit: 100 })
    const suggestedTagIds = await suggestArticleTags(article, allTags as Array<{ id: number; name: string }>)
    console.log(`[generate-article] Suggested tags: ${suggestedTagIds.join(', ')}`)

    // 10. Ensure unique slug
    let finalSlug = article.slug
    const { docs: existingPosts } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: article.slug } },
      limit: 1,
    })
    if (existingPosts.length > 0) {
      finalSlug = `${article.slug}-${Date.now()}`
      console.log(`[generate-article] Slug conflict — using: ${finalSlug}`)
    }

    // 11. Convert markdown to Lexical
    const content = markdownToLexical(article.content)

    // 12. Create post in Payload (draft)
    const publishTime = getRandomPublishTime()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const post = await (payload.create as any)({
      collection: 'posts',
      data: {
        title: article.title,
        slug: finalSlug,
        content,
        excerpt: article.excerpt,
        _status: 'draft',
        publishedDate: publishTime.toISOString(),
        ...(featuredImageId ? { meta: { image: featuredImageId } } : {}),
        ...(suggestedTagIds.length > 0 ? { tags: suggestedTagIds } : {}),
      },
    })

    console.log(`[generate-article] Created post ID ${post.id}: "${post.title}"`)

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
      },
      product: {
        name: product.name,
        category: product.category,
        gravity: product.gravity,
      },
      scheduledPublish: publishTime.toISOString(),
    })
  } catch (err) {
    console.error('[generate-article] Error:', err)
    return NextResponse.json(
      {
        error: 'Article generation failed',
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    )
  }
}

// Support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request)
}
