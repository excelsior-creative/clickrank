import type { GlobalConfig } from "payload";

import { linkGroup } from "@/fields/linkGroup";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
  },
  fields: [linkGroup()],
};
