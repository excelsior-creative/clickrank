import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { CallToAction } from '@/blocks/CallToAction/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/lib/generatePreviewPath'

export const Posts: CollectionConfig = {
  slug: 'posts',
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedDate'],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'posts',
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'posts',
      }),
  },
  versions: {
    drafts: {
      autosave: {
        interval: 375,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  access: {
    read: authenticatedOrPublished,
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        // Trigger revalidation when post is published or updated while published
        if (doc._status === 'published') {
          const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
          const secret = process.env.REVALIDATION_SECRET

          if (!siteUrl || !secret) {
            console.warn('Revalidation skipped: missing NEXT_PUBLIC_SITE_URL or REVALIDATION_SECRET')
            return doc
          }

          try {
            const res = await fetch(`${siteUrl}/api/revalidate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                secret,
                tag: 'posts',
                paths: [`/blog/${doc.slug}`, '/blog', '/'],
              }),
            })

            if (!res.ok) {
              console.error('Revalidation failed:', await res.text())
            } else {
              console.log(`Revalidated: /blog/${doc.slug} and /blog`)
            }
          } catch (err) {
            console.error('Revalidation request failed:', err)
          }
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        const secret = process.env.REVALIDATION_SECRET

        if (!siteUrl || !secret) {
          console.warn('Revalidation skipped: missing NEXT_PUBLIC_SITE_URL or REVALIDATION_SECRET')
          return doc
        }

        try {
          const res = await fetch(`${siteUrl}/api/revalidate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret,
              tag: 'posts',
              paths: ['/blog'],
            }),
          })

          if (!res.ok) {
            console.error('Revalidation failed:', await res.text())
          }
        } catch (err) {
          console.error('Revalidation request failed:', err)
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [CallToAction, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
            {
              name: 'excerpt',
              type: 'textarea',
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'infographic',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Optional infographic image for this post',
              },
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
  ],
}
