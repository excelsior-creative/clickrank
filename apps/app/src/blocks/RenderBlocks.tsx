import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";

import config from "@payload-config";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { PostCard } from "@/components/PostCard";
import { Media } from "@/payload-types";

type Block = {
  blockType?: string;
  [key: string]: unknown;
};

export const RenderBlocks = async ({ blocks = [] }: { blocks?: Block[] }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  const renderedBlocks = await Promise.all(
    blocks.map(async (block, index) => {
      if (block.blockType === "content" && block.content) {
        return (
          <section className="py-12" key={index}>
            <Container>
              <RichText data={block.content as any} className="mx-auto max-w-3xl" />
            </Container>
          </section>
        );
      }

      if (block.blockType === "mediaBlock" && block.media && typeof block.media === "object") {
        const media = block.media as Media;

        return (
          <section className="py-12" key={index}>
            <Container>
              <div className="mx-auto max-w-5xl">
                {media.url ? (
                  <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                    <Image
                      src={media.url}
                      alt={media.alt || "Media"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
                {typeof block.caption === "string" && block.caption ? (
                  <p className="mt-4 text-center text-sm text-muted-foreground">{block.caption}</p>
                ) : null}
              </div>
            </Container>
          </section>
        );
      }

      if (block.blockType === "cta") {
        return (
          <section className="py-16" key={index}>
            <Container>
              <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 text-center shadow-sm">
                {typeof block.title === "string" ? (
                  <h2 className="text-3xl font-bold tracking-tight">{block.title}</h2>
                ) : null}
                {typeof block.description === "string" && block.description ? (
                  <p className="mt-4 text-muted-foreground">{block.description}</p>
                ) : null}
                {typeof block.buttonUrl === "string" && typeof block.buttonLabel === "string" ? (
                  <Link
                    href={block.buttonUrl}
                    className="mt-8 inline-flex rounded-md bg-brand px-6 py-3 text-white hover:bg-brand-light"
                  >
                    {block.buttonLabel}
                  </Link>
                ) : null}
              </div>
            </Container>
          </section>
        );
      }

      if (block.blockType === "archive") {
        const payload = await getPayload({ config });
        const limit = typeof block.limit === "number" ? block.limit : 3;
        const { docs } = await payload.find({
          collection: "posts",
          where: {
            _status: { equals: "published" },
          },
          sort: "-publishedDate",
          limit,
        });

        return (
          <section className="py-16" key={index}>
            <Container>
              <div className="mx-auto max-w-6xl">
                {typeof block.title === "string" ? (
                  <h2 className="text-3xl font-bold tracking-tight">{block.title}</h2>
                ) : null}
                {typeof block.intro === "string" && block.intro ? (
                  <p className="mt-3 text-muted-foreground">{block.intro}</p>
                ) : null}
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {docs.map((post) => (
                    <PostCard key={post.id} post={post as any} />
                  ))}
                </div>
              </div>
            </Container>
          </section>
        );
      }

      return null;
    })
  );

  return (
    <>{renderedBlocks}</>
  );
};
