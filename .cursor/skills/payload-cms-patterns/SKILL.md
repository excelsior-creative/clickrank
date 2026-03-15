# Payload CMS Patterns

## Description
Best practices for building with Payload CMS 3.x in a Next.js App Router project. Covers collections, blocks, fields, access control, rich text (Lexical), live preview, hooks, and the local API.

## Collections

### Structure
- One file per collection in `src/collections/`
- Use kebab-case slugs: `slug: 'blog-posts'`
- Export the collection config as a named export
- Group related collections with `admin.group`

### Access Control
- Always define `access` on collections — never leave it open
- Use helper functions for common patterns: `isAdmin`, `isAdminOrSelf`, `publishedOnly`
- For public-facing data, use `read: () => true` or filter by `_status: 'published'`
- For admin-only collections, use `access: { read: isAdmin, create: isAdmin, update: isAdmin, delete: isAdmin }`

### Versioning & Drafts
- Enable `versions.drafts` on content collections (Pages, Posts)
- Set `autosave: { interval: 100 }` for real-time preview
- Use `_status` field to filter published vs draft content
- Access draft content with `draft: true` in queries (preview mode only)

## Fields

### Common Patterns
```typescript
// Text with validation
{ name: 'title', type: 'text', required: true, maxLength: 100 }

// Rich text with Lexical
{ name: 'content', type: 'richText', editor: lexicalEditor({ features }) }

// Relationship
{ name: 'author', type: 'relationship', relationTo: 'users', hasMany: false }

// Array with nested fields
{ name: 'items', type: 'array', fields: [...] }

// Blocks (layout builder)
{ name: 'layout', type: 'blocks', blocks: [HeroBlock, ContentBlock, CTABlock] }

// Upload (media)
{ name: 'image', type: 'upload', relationTo: 'media' }

// Group (organized fields)
{ name: 'seo', type: 'group', fields: [metaTitle, metaDescription, metaImage] }
```

### Link Field Pattern
- Use a reusable `link` field with `type` (reference vs custom), `url`, `reference`, `newTab`, `appearance`
- Support `linkGroup` as an array of links for CTA sections
- Include `appearance` option: `default`, `outline` for button styles

### Deep Merge for Field Overrides
```typescript
import { deepMerge } from '@payloadcms/ui/shared'
export const myField = (overrides?: Partial<Field>) => deepMerge(baseField, overrides)
```

## Blocks (Layout Builder)

### Structure
- One file per block in `src/blocks/`
- Export both the Payload block config AND the React render component
- Block config: `{ slug, fields, interfaceName }`
- Render component: `export const MyBlockComponent: React.FC<MyBlockType>`

### Standard Block Library
Every project should include at minimum:
- **Hero** — richText + links + media (with variants: default, highImpact, mediumImpact)
- **Content** — richText with column layouts (oneThird, half, twoThirds, full)
- **CTA** (Call to Action) — richText + linkGroup
- **Media** — single media with caption (richText)
- **Archive** — collection browser with population modes (collection, selection)
- **Banner** — richText with style variants (info, warning, error, success)
- **Code** — code field with language selector
- **FormBlock** — embeds form-builder forms in pages

### RenderBlocks Pattern
```typescript
const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlock,
  content: ContentBlock,
  cta: CTABlock,
  mediaBlock: MediaBlock,
  archive: ArchiveBlock,
  banner: BannerBlock,
  code: CodeBlock,
  formBlock: FormBlockComponent,
}

export const RenderBlocks: React.FC<{ blocks: Page['layout'] }> = ({ blocks }) => (
  <>
    {blocks?.map((block, i) => {
      const Block = blockComponents[block.blockType]
      return Block ? <Block key={i} {...block} /> : null
    })}
  </>
)
```

## Rich Text (Lexical Editor)

### Full Feature Set
Always configure the Lexical editor with a complete feature set:

```typescript
import {
  defaultEditorFeatures,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  BlockquoteFeature,
  LinkFeature,
  UploadFeature,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ChecklistFeature,
  HorizontalRuleFeature,
  AlignFeature,
  IndentFeature,
  InlineCodeFeature,
  SuperscriptFeature,
  SubscriptFeature,
  BlocksFeature,
  TableFeature,
} from '@payloadcms/richtext-lexical'
```

### Rich Text Blocks
Use `BlocksFeature` to embed blocks inside rich text:
```typescript
BlocksFeature({ blocks: [BannerBlock, CodeBlock] })
```

### Rendering Rich Text
Use `@payloadcms/richtext-lexical/react` for rendering:
```typescript
import { RichText } from '@payloadcms/richtext-lexical/react'
<RichText data={content} />
```

## Media Collection

### Best Practices
- Enable `folders: true` for organization
- Enable `focalPoint: true` for smart cropping
- Define responsive `imageSizes`: thumbnail, square, small, medium, large, xlarge, og
- Caption should be `richText` (not plain text)
- Set `adminThumbnail: 'thumbnail'`

```typescript
imageSizes: [
  { name: 'thumbnail', width: 300 },
  { name: 'square', width: 500, height: 500 },
  { name: 'small', width: 600 },
  { name: 'medium', width: 900 },
  { name: 'large', width: 1400 },
  { name: 'xlarge', width: 1920 },
  { name: 'og', width: 1200, height: 630, crop: 'center' },
]
```

## Data Fetching (Local API)

### Server-Side (preferred)
```typescript
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({ config: configPromise })
const { docs } = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'home' } },
  depth: 2,
})
```

### Draft/Preview Mode
```typescript
const { isEnabled: isDraft } = await draftMode()
const page = await payload.find({
  collection: 'pages',
  where: { slug: { equals: slug } },
  draft: isDraft,
})
```

### Caching
- Use `unstable_cache` for expensive queries
- Tag caches with collection names for targeted revalidation
- Implement `afterChange` hooks to call `revalidateTag`

## Live Preview

### Configuration
```typescript
admin: {
  livePreview: {
    url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/${data.slug !== 'home' ? data.slug : ''}`,
    collections: ['pages', 'posts'],
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
  },
}
```

### Frontend Integration
For App Router (RSC), use `router.refresh()` approach in preview routes.
For client components, use the `useLivePreview` hook from `@payloadcms/live-preview-react`.

## Hooks

### Common Patterns
- `beforeChange`: Validate, transform, or enrich data before save
- `afterChange`: Trigger revalidation, sync to external services
- `beforeRead`: Add computed fields
- `afterDelete`: Clean up related resources

### Revalidation Hook
```typescript
const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, collection }) => {
  revalidateTag(collection.slug)
  if (doc.slug) revalidatePath(`/${doc.slug}`)
  return doc
}
```

## Plugins
Standard plugins to include:
- `@payloadcms/plugin-seo` — SEO metadata fields
- `@payloadcms/plugin-redirects` — URL redirect management
- `@payloadcms/plugin-nested-docs` — parent/child page hierarchies
- `@payloadcms/plugin-form-builder` — dynamic form creation
- `@payloadcms/plugin-search` — search index collection
- `@payloadcms/storage-vercel-blob` — media storage on Vercel Blob

## GraphQL
- Enable GraphQL playground for development
- Use `interfaceName` on blocks and groups for clean generated types
- Run `payload generate:types` after schema changes
