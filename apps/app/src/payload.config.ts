import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import {
  FixedToolbarFeature,
  HeadingFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { searchPlugin } from "@payloadcms/plugin-search";
import { sentryPlugin } from "@payloadcms/plugin-sentry";
import { seoPlugin } from "@payloadcms/plugin-seo";
import type {
  GenerateTitle,
  GenerateURL,
  GenerateDescription,
} from "@payloadcms/plugin-seo/types";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig, type PayloadRequest } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Categories } from "@/collections/Categories";
import { Media } from "@/collections/Media";
import { OutboundClicks } from "@/collections/OutboundClicks";
import { Pages } from "@/collections/Pages";
import { Posts } from "@/collections/Posts";
import { Tags } from "@/collections/Tags";
import { Users } from "@/collections/Users";
import { defaultLexical } from "@/fields/defaultLexical";
import { revalidateRedirects } from "@/hooks/revalidateRedirects";
import { ContentGenerationSettings } from "@/globals/ContentGenerationSettings";
import { Footer } from "@/globals/Footer";
import { Header } from "@/globals/Header";
import { SiteSettings } from "@/globals/SiteSettings";
import { getServerSideURL } from "@/lib/getURL";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

if (!process.env.PAYLOAD_SECRET) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("PAYLOAD_SECRET must be set in production");
  }
  console.warn(
    "WARNING: PAYLOAD_SECRET is not set. This will cause issues in production."
  );
}

if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  console.warn("WARNING: No remote database URL set in production.");
}

/**
 * pg-connection-string v3 / pg v9 will change the semantics of
 * sslmode=prefer|require|verify-ca — today they alias to verify-full, and in
 * the next major they'll adopt libpq semantics (weaker verification). We opt
 * in to the libpq-compatible behavior explicitly so the deprecation warning
 * goes away and the connection string's meaning is stable across upgrades.
 */
function normalizeDatabaseUrl(url: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    const sslmode = u.searchParams.get("sslmode");
    if (
      sslmode &&
      ["prefer", "require", "verify-ca"].includes(sslmode) &&
      !u.searchParams.has("uselibpqcompat")
    ) {
      u.searchParams.set("uselibpqcompat", "true");
    }
    return u.toString();
  } catch {
    return url;
  }
}

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ["@/components/BeforeLogin#BeforeLogin"],
      beforeDashboard: ["@/components/BeforeDashboard#BeforeDashboard"],
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, collectionConfig, globalConfig }) => {
        if (collectionConfig?.slug === "posts" && data?.slug) {
          return `/blog/${data.slug}`;
        }

        if (collectionConfig?.slug === "pages" && data?.slug) {
          return `/${data.slug}`;
        }

        if (globalConfig?.slug === "site-settings") {
          return "/terms";
        }

        return "/";
      },
      collections: ["posts", "pages"],
      globals: ["site-settings"],
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablet",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Desktop",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  collections: [Users, Posts, Pages, Media, Categories, Tags, OutboundClicks],
  globals: [
    SiteSettings,
    ContentGenerationSettings, // optional: remove if AI content generation is not needed
    Header,
    Footer,
  ],
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET ?? "",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  cors: [getServerSideURL()].filter(Boolean),
  csrf: [
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : []),
  ],
  db: postgresAdapter({
    pool: {
      connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL || ""),
    },
  }),
  email: resendAdapter({
    defaultFromAddress:
      process.env.RESEND_DEFAULT_FROM_ADDRESS || "noreply@yourdomain.com",
    defaultFromName: process.env.RESEND_DEFAULT_FROM_NAME || "Your App Name",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  plugins: [
    redirectsPlugin({
      collections: ["pages", "posts"],
      overrides: {
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
    nestedDocsPlugin({
      collections: ["categories"],
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ""),
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
      },
      formOverrides: {
        fields: ({ defaultFields }) =>
          defaultFields.map((field) => {
            if ("name" in field && field.name === "confirmationMessage") {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({
                      enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                    }),
                  ],
                }),
              };
            }
            return field;
          }),
      },
    }),
    vercelBlobStorage({
      enabled: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
    searchPlugin({
      collections: ["posts"],
      beforeSync: ({ originalDoc, searchDoc }) => ({
        ...searchDoc,
        slug: originalDoc.slug,
        excerpt: originalDoc.excerpt,
        status: originalDoc._status,
      }),
      searchOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          { name: "excerpt", type: "textarea" },
          { name: "slug", type: "text" },
          { name: "status", type: "text" },
        ],
      },
    }),
    sentryPlugin({
      enabled: !!process.env.SENTRY_DSN,
    }),
    seoPlugin({
      collections: ["posts", "pages"],
      uploadsCollection: "media",
      generateTitle: (({ doc }) =>
        doc?.title
          ? `${doc.title} | ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Site"}`
          : process.env.NEXT_PUBLIC_SITE_NAME || "Your Site") as GenerateTitle,
      generateDescription: (({ doc }) =>
        (doc as any)?.excerpt || "") as GenerateDescription,
      generateURL: (({ doc }) => {
        const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        return doc?.slug ? `${url}/${doc.slug}` : url;
      }) as GenerateURL,
    }),
  ],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }) => {
        if (req.user) return true;
        const secret = process.env.CRON_SECRET;
        if (!secret) return false;
        const authHeader = req.headers.get("authorization");
        return authHeader === `Bearer ${secret}`;
      },
    },
    tasks: [],
  },
});
