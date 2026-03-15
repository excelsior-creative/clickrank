import type { Media, Post } from "@/payload-types";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "./metadata";

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.svg`,
      width: 512,
      height: 512,
    },
    description: DEFAULT_DESCRIPTION,
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "en-US",
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(article: Post) {
  const featuredImage = article.featuredImage as Media | undefined;
  const imageUrl = featuredImage?.url ? `${SITE_URL}${featuredImage.url}` : "";

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: article.publishedDate,
    dateModified: article.updatedAt,
    image: imageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

/**
 * Generate combined global schema for every page
 */
export function generateGlobalSchema() {
  return combineSchemas(generateOrganizationSchema(), generateWebSiteSchema());
}

/**
 * Combine multiple schemas into a single graph
 */
export function combineSchemas(...schemas: (object | null)[]) {
  const validSchemas = schemas.filter(Boolean);
  if (validSchemas.length === 0) return null;
  if (validSchemas.length === 1) return validSchemas[0];

  return {
    "@context": "https://schema.org",
    "@graph": validSchemas.map((schema) => {
      const { "@context": _, ...rest } = schema as { "@context"?: string };
      return rest;
    }),
  };
}
