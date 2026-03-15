import type { Block } from "payload";

export const Archive: Block = {
  slug: "archive",
  interfaceName: "ArchiveBlock",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
    },
    {
      name: "limit",
      type: "number",
      defaultValue: 3,
      min: 1,
      max: 12,
    },
  ],
};
