import type { Block } from "payload";

export const CallToAction: Block = {
  slug: "cta",
  interfaceName: "CallToActionBlock",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "buttonLabel",
      type: "text",
    },
    {
      name: "buttonUrl",
      type: "text",
    },
  ],
};
