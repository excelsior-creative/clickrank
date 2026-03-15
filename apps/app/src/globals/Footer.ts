import type { GlobalConfig } from "payload";

import { linkGroup } from "@/fields/linkGroup";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [linkGroup()],
};
