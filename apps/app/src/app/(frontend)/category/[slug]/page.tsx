import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@/payload.config";
import { PostCard } from "@/components/PostCard";
import { SectionHead } from "@/components/SectionHead";
import { Category, Post } from "@/payload-types";
import { SITE_NAME, SITE_URL, generatePageMetadata } from "@/lib/metadata";

// ISR: one-hour safety net. Posts.afterChange already revalidates on write.
export const revalidate = 3600;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Pull every published category slug so Next can statically render each
 * hub at build time. Falls back gracefully if the collection is empty.
 */
export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "categories",
      limit: 1000,
      select: { slug: true },
    });
    return docs
      .map((c) => (c.slug ? { slug: c.slug } : null))
      .filter((x): x is { slug: string } => x !== null);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  let category: Category | undefined;
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "categories",
      where: { slug: { equals: decoded } },
      limit: 1,
    });
    category = docs[0] as Category | undefined;
  } catch {}

  if (!category) {
    return { title: `Category not found | ${SITE_NAME}` };
  }

  return generatePageMetadata({
    title: `${category.name} reviews`,
    description: `Every ${SITE_NAME} review filed under ${category.name}. Honest, independent takes on ClickBank products — leading with real strengths, naming real caveats.`,
    path: `/category/${category.slug}`,
  });
}

async function getCategoryWithPosts(slug: string): Promise<{
  category: Category;
  posts: Post[];
  peerCategories: { name: string; slug: string }[];
} | null> {
  const payload = await getPayload({ config });

  const { docs: categoryDocs } = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const category = categoryDocs[0] as Category | undefined;
  if (!category) return null;

  const { docs: postDocs } = await payload.find({
    collection: "posts",
    sort: "-publishedDate",
    where: {
      and: [
        { _status: { equals: "published" } },
        { categories: { in: [category.id] } },
      ],
    },
    depth: 1,
    limit: 60,
  });

  // Peer categories for the rail at the bottom. We don't have per-category
  // post counts cheaply, so pull up to 12 and filter out the current one.
  const { docs: peerDocs } = await payload.find({
    collection: "categories",
    sort: "name",
    limit: 12,
    select: { name: true, slug: true },
  });
  const peerCategories = peerDocs
    .filter((c) => c.slug && c.slug !== category.slug)
    .map((c) => ({ name: c.name as string, slug: c.slug as string }))
    .slice(0, 8);

  return { category, posts: postDocs as Post[], peerCategories };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);

  let data: Awaited<ReturnType<typeof getCategoryWithPosts>> = null;
  try {
    data = await getCategoryWithPosts(decoded);
  } catch (error) {
    console.error(
      `Failed to fetch category "${slug}" during page render.`,
      error,
    );
  }

  if (!data) return notFound();
  const { category, posts, peerCategories } = data;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Reviews", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <SectionHead
        eyebrow={`The Review Desk · ${category.name}`}
        title={
          <>
            {category.name}{" "}
            <em className="font-serif-italic text-[var(--color-mint)]">
              reviews
            </em>
            .
          </>
        }
        description={`Every review we've filed in ${category.name}. Ordered by most recent first.`}
        linkHref="/blog"
        linkLabel="All reviews"
      />

      {posts.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p
            className="text-xl"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--color-ink-3)",
            }}
          >
            No reviews in {category.name} yet. Check back soon.
          </p>
        </div>
      )}

      {peerCategories.length > 0 && (
        <nav
          aria-label="More categories"
          className="mt-20 pt-10"
          style={{ borderTop: "1px solid var(--color-rule)" }}
        >
          <div
            className="inline-flex items-center gap-2.5 font-mono mb-5"
            style={{
              fontSize: 11.5,
              letterSpacing: "0.16em",
              color: "var(--color-mint)",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden
              className="inline-block w-[18px] h-px"
              style={{ background: "var(--color-mint)" }}
            />
            More categories
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {peerCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="inline-flex items-center px-4 py-2 rounded-full text-[13px] transition-colors hover:text-[var(--color-mint)]"
                  style={{
                    border: "1px solid var(--color-rule)",
                    color: "var(--color-ink-2)",
                  }}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
