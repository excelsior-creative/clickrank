import type { Field } from "payload";

type LinkFieldOptions = {
  appearances?: false;
};

export const link = (_options?: LinkFieldOptions): Field => {
  return {
    name: "link",
    type: "group",
    fields: [
      {
        type: "row",
        fields: [
          {
            name: "type",
            type: "radio",
            defaultValue: "reference",
            admin: {
              layout: "horizontal",
              width: "50%",
            },
            options: [
              { label: "Internal link", value: "reference" },
              { label: "Custom URL", value: "custom" },
            ],
          },
          {
            name: "newTab",
            type: "checkbox",
            label: "Open in new tab",
            admin: {
              width: "50%",
              style: { alignSelf: "flex-end" },
            },
          },
        ],
      },
      {
        type: "row",
        fields: [
          {
            name: "reference",
            type: "relationship",
            relationTo: ["pages", "posts"],
            required: true,
            admin: {
              condition: (_, siblingData) => siblingData?.type === "reference",
              width: "50%",
            },
          },
          {
            name: "url",
            type: "text",
            required: true,
            admin: {
              condition: (_, siblingData) => siblingData?.type === "custom",
              width: "50%",
            },
          },
          {
            name: "label",
            type: "text",
            required: true,
            admin: {
              width: "50%",
            },
          },
        ],
      },
    ],
  };
};
