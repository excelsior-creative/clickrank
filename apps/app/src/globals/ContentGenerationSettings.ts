/**
 * OPTIONAL FEATURE: AI Content Generation Settings
 *
 * This global stores configuration for AI-assisted content generation workflows
 * (topic research, post drafting, image generation prompts, etc.).
 *
 * If you do not need AI content generation, you can safely:
 *   1. Remove this file
 *   2. Remove its import and entry from the `globals` array in payload.config.ts
 *   3. Run `pnpm payload migrate:create` to generate a migration that drops the table
 */
import type { GlobalConfig } from "payload";

export const ContentGenerationSettings: GlobalConfig = {
  slug: "content-generation-settings",
  admin: {
    group: "Settings",
  },
  fields: [
    {
      name: "apiConfig",
      type: "group",
      fields: [
        { name: "baseUrl", type: "text", label: "API Base URL" },
        { name: "apiKey", type: "text", label: "API Key" },
      ],
    },
    {
      name: "companyContext",
      type: "group",
      fields: [
        { name: "companyName", type: "text" },
        { name: "location", type: "text" },
        { name: "expertise", type: "textarea" },
        { name: "primaryColor", type: "text" },
        { name: "secondaryColor", type: "text" },
      ],
    },
    {
      name: "keywords",
      type: "array",
      fields: [{ name: "keyword", type: "text", required: true }],
    },
    {
      name: "topicResearch",
      label: "Post Topic Research",
      type: "group",
      fields: [{ name: "prompt", type: "textarea" }],
    },
    {
      name: "postGeneration",
      label: "Post Content Generation",
      type: "group",
      fields: [{ name: "prompt", type: "textarea" }],
    },
    {
      name: "featuredImageStyles",
      label: "Post Featured Image Styles",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "model", type: "text" },
        {
          name: "prompt",
          type: "textarea",
          admin: {
            description: "Prompt for the post featured image",
          },
        },
      ],
    },
    {
      name: "infographic",
      label: "Post Infographic Settings",
      type: "group",
      fields: [
        {
          name: "dataExtractionPrompt",
          type: "textarea",
          admin: {
            description:
              "Prompt to extract infographic data from the generated post",
          },
        },
        {
          name: "imageGenerationPrompt",
          type: "textarea",
          admin: {
            description: "Prompt to generate the infographic image for the post",
          },
        },
      ],
    },
  ],
};
