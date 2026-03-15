import React from "react";
import { getPayload } from "payload";
import { notFound, redirect } from "next/navigation";
import { unstable_cache } from "next/cache";

import config from "@payload-config";

type Props = {
  url: string;
  disableNotFound?: boolean;
};

const resolveRedirectURL = (to: any) => {
  if (!to) return null;

  if (to.type === "custom" && to.url) {
    return to.url;
  }

  if (
    to.type === "reference" &&
    to.reference &&
    typeof to.reference === "object"
  ) {
    const relation = to.reference.relationTo;
    const value = to.reference.value;

    if (typeof value === "object" && value?.slug) {
      return relation === "posts" ? `/blog/${value.slug}` : `/${value.slug}`;
    }
  }

  return null;
};

const getCachedRedirect = unstable_cache(
  async (url: string) => {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "redirects",
      where: { from: { equals: url } },
      limit: 1,
    });
    return docs[0] ?? null;
  },
  ["redirect"],
  {
    tags: ["redirects"],
  },
);

export const PayloadRedirects = async ({
  url,
  disableNotFound = false,
}: Props) => {
  const redirectDoc = await getCachedRedirect(url);
  const target = redirectDoc ? resolveRedirectURL((redirectDoc as any).to) : null;

  if (target) {
    redirect(target);
  }

  if (!disableNotFound) {
    notFound();
  }

  return null;
};
