import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

/**
 * OutboundClicks
 *
 * Every successful hit on /go/[slug] writes one row here. The route already
 * logs a structured line to stdout for Vercel; this collection lets the CEO
 * read click counts in the admin without shell access.
 *
 * Writes happen fire-and-forget from the redirect handler so click logging
 * never slows the 302. Access is admin-only: these rows are an analytics
 * artifact, not reader-facing.
 */
export const OutboundClicks: CollectionConfig = {
  slug: 'outbound-clicks',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'productName', 'vendor', 'referer', 'createdAt'],
    description:
      'Raw click events recorded by /go/[slug]. Append-only; rolled-up counts live on Posts.clickCount.',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  timestamps: true,
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description:
          'The /go/[slug] value that was hit. Matches either a Post.slug or a fallback product slug.',
      },
    },
    {
      name: 'productName',
      type: 'text',
      admin: {
        description: 'Resolved product name (post.productName or fallback product name).',
      },
    },
    {
      name: 'vendor',
      type: 'text',
      admin: {
        description: 'Fallback-list vendor handle, when resolved from the product list.',
      },
    },
    {
      name: 'target',
      type: 'text',
      admin: {
        description: 'The affiliate URL the visitor was redirected to.',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: false,
      admin: {
        description: 'Post the click was attributed to, when a matching post exists.',
      },
    },
    {
      name: 'referer',
      type: 'text',
      admin: {
        description: 'Same-origin referer path, or origin only for cross-site. Absent if no referer.',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'First 200 chars of the request User-Agent.',
      },
    },
  ],
}
