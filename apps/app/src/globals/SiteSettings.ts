import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    livePreview: {
      url: "/terms",
    },
    preview: () => {
      const params = new URLSearchParams({
        path: "/terms",
        previewSecret: process.env.PREVIEW_SECRET || "",
      });

      return `/next/preview?${params.toString()}`;
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteTitle",
      type: "text",
      required: true,
      defaultValue: "My Site",
    },
    {
      name: "termsOfService",
      type: "richText",
      required: true,
    },
    {
      name: "privacyPolicy",
      type: "richText",
      required: true,
    },
  ],
};
