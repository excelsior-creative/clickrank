import type { Field } from "payload";

export const hero: Field = {
  name: "hero",
  type: "group",
  fields: [
    {
      name: "type",
      type: "select",
      defaultValue: "mediumImpact",
      options: [
        { label: "None", value: "none" },
        { label: "High Impact", value: "highImpact" },
        { label: "Medium Impact", value: "mediumImpact" },
        { label: "Low Impact", value: "lowImpact" },
      ],
      required: true,
    },
    {
      name: "title",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.type !== "none",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        condition: (_, siblingData) => siblingData?.type !== "none",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        condition: (_, siblingData) => siblingData?.type !== "none",
      },
    },
  ],
};
