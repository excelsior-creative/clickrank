import type { CollectionSlug } from "payload";

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: "/blog",
  pages: "",
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug?: string | null;
};

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null;
  }

  const encodedSlug = encodeURIComponent(slug);
  const pathPrefix = collectionPrefixMap[collection];

  if (!pathPrefix) {
    return null;
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: `${pathPrefix}/${encodedSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || "",
  });

  return `/next/preview?${encodedParams.toString()}`;
};
