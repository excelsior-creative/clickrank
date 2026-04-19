import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";

import config from "@payload-config";
import { RichText } from "@/components/RichText";
import { PostCard } from "@/components/PostCard";
import { Media } from "@/payload-types";

type Block = {
  blockType?: string;
  [key: string]: unknown;
};

const WRAP = "max-w-[1280px] mx-auto px-5 md:px-10";

export const RenderBlocks = async ({ blocks = [] }: { blocks?: Block[] }) => {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  const renderedBlocks = await Promise.all(
    blocks.map(async (block, index) => {
      if (block.blockType === "content" && block.content) {
        return (
          <section className="py-12" key={index}>
            <div className={WRAP}>
              <div
                className="mx-auto max-w-[760px] prose prose-invert prose-lg"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  lineHeight: 1.7,
                }}
              >
                <RichText data={block.content as any} className="max-w-none" />
              </div>
            </div>
          </section>
        );
      }

      if (block.blockType === "mediaBlock" && block.media && typeof block.media === "object") {
        const media = block.media as Media;
        return (
          <section className="py-12" key={index}>
            <div className={WRAP}>
              <div className="mx-auto max-w-[1000px]">
                {media.url ? (
                  <div
                    className="relative aspect-video overflow-hidden rounded-[14px]"
                    style={{
                      border: "1px solid var(--color-rule)",
                      boxShadow: "0 30px 80px -30px oklch(10% 0.04 255)",
                    }}
                  >
                    <Image
                      src={media.url}
                      alt={media.alt || "Media"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
                {typeof block.caption === "string" && block.caption ? (
                  <p
                    className="mt-4 text-center font-mono"
                    style={{
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      color: "var(--color-ink-3)",
                    }}
                  >
                    {block.caption}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        );
      }

      if (block.blockType === "cta") {
        return (
          <section className="py-16" key={index}>
            <div className={WRAP}>
              <div
                className="mx-auto max-w-[860px] rounded-[18px] p-10 text-center"
                style={{
                  background:
                    "linear-gradient(120deg, oklch(22% 0.06 285) 0%, oklch(24% 0.08 320) 100%)",
                  border: "1px solid var(--color-rule)",
                  boxShadow: "0 30px 80px -30px oklch(10% 0.04 255)",
                }}
              >
                {typeof block.title === "string" ? (
                  <h2
                    className="m-0 mb-4"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontWeight: 380,
                      fontSize: "clamp(28px, 3.6vw, 44px)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                      color: "var(--color-ink)",
                      textWrap: "balance",
                    }}
                  >
                    {block.title}
                  </h2>
                ) : null}
                {typeof block.description === "string" && block.description ? (
                  <p
                    className="mx-auto m-0"
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontWeight: 300,
                      fontSize: 17,
                      color: "var(--color-ink-2)",
                      maxWidth: "48ch",
                    }}
                  >
                    {block.description}
                  </p>
                ) : null}
                {typeof block.buttonUrl === "string" && typeof block.buttonLabel === "string" ? (
                  <Link
                    href={block.buttonUrl}
                    className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:-translate-y-px hover:mint-glow"
                    style={{
                      background: "var(--color-mint)",
                      color: "var(--color-mint-ink)",
                    }}
                  >
                    {block.buttonLabel} <span aria-hidden>→</span>
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        );
      }

      if (block.blockType === "archive") {
        const payload = await getPayload({ config });
        const limit = typeof block.limit === "number" ? block.limit : 3;
        const { docs } = await payload.find({
          collection: "posts",
          where: { _status: { equals: "published" } },
          sort: "-publishedDate",
          limit,
          depth: 1,
        });

        return (
          <section className="py-16" key={index}>
            <div className={WRAP}>
              {typeof block.title === "string" ? (
                <h2
                  className="m-0 mb-3"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 380,
                    fontSize: "clamp(28px, 3.6vw, 44px)",
                    letterSpacing: "-0.02em",
                    color: "var(--color-ink)",
                  }}
                >
                  {block.title}
                </h2>
              ) : null}
              {typeof block.intro === "string" && block.intro ? (
                <p
                  className="m-0 mb-8 max-w-[56ch]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 300,
                    color: "var(--color-ink-2)",
                    fontSize: 17,
                  }}
                >
                  {block.intro}
                </p>
              ) : null}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {docs.map((post) => (
                  <PostCard key={post.id} post={post as any} />
                ))}
              </div>
            </div>
          </section>
        );
      }

      return null;
    })
  );

  return <>{renderedBlocks}</>;
};
