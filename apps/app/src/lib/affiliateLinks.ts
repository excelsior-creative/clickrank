/**
 * Rewrite raw ClickBank hoplinks inside a post's Lexical body to the local
 * `/go/[slug]` tracker so outbound clicks are counted.
 *
 * Why this exists:
 *   Posts imported from the legacy `reference/` corpus carry their hoplinks
 *   inline (`<a href="https://hop.clickbank.net/?affiliate=clickrankn&vendor=X">`).
 *   The rendered page's sticky CTA already uses `/go/[slug]`, but every inline
 *   body link bypassed tracking. This helper normalises those links at render
 *   time without mutating the stored document.
 *
 * Rewrite policy:
 *   - Only touch `<a>` nodes whose URL hostname is `hop.clickbank.net`.
 *   - Only rewrite if the link's `vendor=` query param matches the vendor in
 *     `post.affiliateUrl`. That preserves correctness for comparison posts
 *     that legitimately link to multiple different vendors — we only pull the
 *     post's canonical product through the tracker.
 *   - If `post.affiliateUrl` is missing or unparseable, leave every hoplink
 *     alone. Better to undercount than to redirect a reader to the wrong
 *     product.
 *
 * Pure function — returns a new tree. Safe to call on every render.
 */

type LinkFields = {
  url?: string
  newTab?: boolean
  linkType?: string
  [key: string]: unknown
}

type LexicalNode = {
  type?: string
  fields?: LinkFields
  children?: LexicalNode[]
  [key: string]: unknown
}

type LexicalRoot = {
  root?: {
    children?: LexicalNode[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

const HOPLINK_HOST = 'hop.clickbank.net'

export function extractClickbankVendor(url: string | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.toLowerCase() !== HOPLINK_HOST) return null
    const vendor = parsed.searchParams.get('vendor')
    return vendor ? vendor.toLowerCase() : null
  } catch {
    return null
  }
}

export function isClickbankHoplink(url: string | undefined): boolean {
  if (!url) return false
  try {
    return new URL(url).hostname.toLowerCase() === HOPLINK_HOST
  } catch {
    return false
  }
}

/**
 * Walk the Lexical tree and rewrite qualifying hoplinks to `/go/[postSlug]`.
 * Returns a new tree; the input is not mutated. Types are intentionally
 * loose on the boundary — `content` coming from Payload is opaque JSON and
 * the generic preserves whatever shape the caller already has.
 */
export function rewriteAffiliateLinks<T>(
  data: T,
  opts: { postSlug: string; affiliateUrl?: string | null },
): T {
  const root = (data as unknown as LexicalRoot | null | undefined)?.root
  if (!data || !root || !Array.isArray(root.children)) return data

  const postVendor = extractClickbankVendor(opts.affiliateUrl ?? undefined)
  if (!postVendor) return data

  const tracked = `/go/${opts.postSlug}`

  const rewriteNode = (node: LexicalNode): LexicalNode => {
    let next: LexicalNode = node
    if (node.type === 'link' && node.fields && typeof node.fields.url === 'string') {
      const vendor = extractClickbankVendor(node.fields.url)
      if (vendor && vendor === postVendor) {
        next = {
          ...node,
          fields: { ...node.fields, url: tracked, linkType: 'custom' },
        }
      }
    }
    if (Array.isArray(next.children) && next.children.length) {
      const newChildren = next.children.map(rewriteNode)
      const changed = newChildren.some((c, i) => c !== next.children![i])
      if (changed) next = { ...next, children: newChildren }
    }
    return next
  }

  const newChildren = (root.children as LexicalNode[]).map(rewriteNode)
  const anyChanged = newChildren.some((c, i) => c !== root.children![i])
  if (!anyChanged) return data

  return {
    ...(data as object),
    root: { ...root, children: newChildren },
  } as T
}
