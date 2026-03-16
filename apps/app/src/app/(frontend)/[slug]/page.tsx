import React from "react";
import { draftMode } from "next/headers";
import { getPayload } from "payload";

import config from "@payload-config";
import { LivePreviewListener } from "@/components/LivePreviewListener";
import { PayloadRedirects } from "@/components/PayloadRedirects";
import { RenderBlocks } from "@/blocks/RenderBlocks";
import { RenderHero } from "@/heros/RenderHero";

export const dynamic = 'force-dynamic';

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function CMSPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = "" } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const url = `/${decodedSlug}`;

  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "pages",
    draft,
    overrideAccess: draft,
    limit: 1,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  });

  const page = docs[0] as any;

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  return (
    <article>
      {draft && <LivePreviewListener />}
      <PayloadRedirects disableNotFound url={url} />
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </article>
  );
}
