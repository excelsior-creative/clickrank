import type { CollectionConfig } from "payload";
import { slugField } from "payload";
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from "@payloadcms/plugin-seo/fields";
import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";

import { Archive } from "@/blocks/Archive/config";
import { CallToAction } from "@/blocks/CallToAction/config";
import { Content } from "@/blocks/Content/config";
import { MediaBlock } from "@/blocks/MediaBlock/config";
import { hero } from "@/heros/config";
import { generatePreviewPath } from "@/lib/generatePreviewPath";

export const Pages: CollectionConfig = {
  slug: "pages",
  defaultPopulate: {
    title: true,
    slug: true,
  },
  access: {
    read: authenticatedOrPublished,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    livePreview: {
      url: ({ data }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: "pages",
        }),
    },
    preview: (data) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: "pages",
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
  hooks: {
    afterChange: [
      async ({ doc }) => {
        if (doc._status !== "published") {
          return doc;
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const secret = process.env.REVALIDATION_SECRET;

        if (!siteUrl || !secret) {
          console.warn("Revalidation skipped: missing NEXT_PUBLIC_SITE_URL or REVALIDATION_SECRET");
          return doc;
        }

        try {
          const res = await fetch(`${siteUrl}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret,
              tag: "pages",
              paths: [`/${doc.slug}`],
            }),
          });

          if (!res.ok) {
            console.error("Revalidation failed:", await res.text());
          }
        } catch (error) {
          console.error("Revalidation request failed:", error);
        }

        return doc;
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
        const secret = process.env.REVALIDATION_SECRET;

        if (!siteUrl || !secret) {
          console.warn("Revalidation skipped: missing NEXT_PUBLIC_SITE_URL or REVALIDATION_SECRET");
          return doc;
        }

        try {
          const res = await fetch(`${siteUrl}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret,
              tag: "pages",
              paths: ["/"],
            }),
          });

          if (!res.ok) {
            console.error("Revalidation failed:", await res.text());
          }
        } catch (error) {
          console.error("Revalidation request failed:", error);
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField(),
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [hero],
        },
        {
          label: "Content",
          fields: [
            {
              name: "layout",
              type: "blocks",
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
              admin: {
                initCollapsed: true,
              },
            },
          ],
        },
        {
          name: "meta",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: "meta.title",
              descriptionPath: "meta.description",
            }),
          ],
        },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData?._status === "published" && !value) {
              return new Date();
            }

            return value;
          },
        ],
      },
    },
  ],
};
