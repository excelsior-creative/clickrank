import type { Field } from "payload";

import { link } from "@/fields/link";

export const linkGroup = (): Field => {
  return {
    name: "navItems",
    type: "array",
    admin: {
      initCollapsed: true,
    },
    fields: [link({ appearances: false })],
  };
};
