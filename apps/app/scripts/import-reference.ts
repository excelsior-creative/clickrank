/**
 * Import legacy ClickRank reviews from the top-level `reference/` folder into
 * Payload. Each reference folder is a scraped WordPress/Elementor snapshot;
 * we pull the Article JSON-LD + meta tags for metadata and extract the
 * content from the `theme-post-content.default` Elementor widget.
 *
 * Usage (from repo root):
 *   pnpm --filter app import:reference
 *   pnpm --filter app import:reference -- --dry-run
 *   pnpm --filter app import:reference -- --limit 5
 *   pnpm --filter app import:reference -- --overwrite
 *   pnpm --filter app import:reference -- --skip-images
 */

import { getPayload } from "payload";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type CliArgs = {
  limit?: number;
  dryRun: boolean;
  overwrite: boolean;
  skipImages: boolean;
  help: boolean;
};

type ParsedReview = {
  slug: string;
  title: string;
  excerpt: string;
  publishedDate: string | null;
  tags: string[];
  categories: string[];
  thumbnailUrl?: string;
  productName?: string;
  affiliateUrl?: string;
  wordCount?: number;
  contentHtml: string;
};

const parseArgs = (argv: string[]): CliArgs => {
  const args: CliArgs = {
    dryRun: false,
    overwrite: false,
    skipImages: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--overwrite") args.overwrite = true;
    else if (a === "--skip-images") args.skipImages = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a.startsWith("--limit=")) args.limit = Number(a.slice(8));
  }
  return args;
};

const usage = `
Import legacy reviews from ./reference into Payload.

Flags:
  --dry-run       Parse everything but don't write to the DB
  --overwrite     Replace posts whose slug already exists (default: skip)
  --limit <n>     Only import the first n posts (useful for testing)
  --skip-images   Skip resolving + uploading cover images
  --help          Show this message
`.trim();

// ---------------------------------------------------------------------------
// HTML helpers — intentionally pragmatic. The reference corpus is ~93 files
// of WordPress/Elementor output, so we don't need a full HTML parser.
// ---------------------------------------------------------------------------

const decodeEntities = (s: string): string =>
  s
    .replace(/&#8217;/g, "\u2019")
    .replace(/&#8216;/g, "\u2018")
    .replace(/&#8220;/g, "\u201c")
    .replace(/&#8221;/g, "\u201d")
    .replace(/&#8211;/g, "\u2013")
    .replace(/&#8212;/g, "\u2014")
    .replace(/&#038;/g, "&")
    .replace(/&#8230;/g, "\u2026")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (s: string): string =>
  decodeEntities(s.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const extractMeta = (html: string, property: string): string | undefined => {
  const re = new RegExp(
    `<meta\\s+property=["']${property}["']\\s+content=["']([^"']*)["']`,
    "i",
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : undefined;
};

const extractMetaName = (html: string, name: string): string | undefined => {
  const re = new RegExp(
    `<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`,
    "i",
  );
  const m = html.match(re);
  return m ? decodeEntities(m[1]) : undefined;
};

const extractJsonLd = (html: string): any | null => {
  const m = html.match(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i,
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
};

/**
 * Given a slice of HTML that begins just after the opening tag of a div, find
 * the offset of the matching closing `</div>` by counting nested div tags.
 */
const findMatchingDivEnd = (html: string, startFrom: number): number => {
  let depth = 1;
  let i = startFrom;
  const open = /<div\b[^>]*>/gi;
  const close = /<\/div>/gi;
  while (depth > 0 && i < html.length) {
    open.lastIndex = i;
    close.lastIndex = i;
    const nextOpen = open.exec(html);
    const nextClose = close.exec(html);
    if (!nextClose) return -1;
    if (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      i = nextOpen.index + nextOpen[0].length;
    } else {
      depth -= 1;
      i = nextClose.index + nextClose[0].length;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const extractPostContentBlock = (html: string): string | null => {
  const marker = html.indexOf('data-widget_type="theme-post-content.default"');
  if (marker === -1) return null;
  // Advance past the opening tag of the widget div.
  const tagEnd = html.indexOf(">", marker);
  if (tagEnd === -1) return null;
  const end = findMatchingDivEnd(html, tagEnd + 1);
  if (end === -1) return null;
  return html.slice(tagEnd + 1, end);
};

/**
 * Pull concatenated HTML out of every `text-editor.default` widget inside the
 * post-content block. We look at each widget's `elementor-widget-container`
 * div so we skip the wrapping chrome.
 */
const extractTextEditorContent = (block: string): string => {
  const widgets = Array.from(
    block.matchAll(
      /data-widget_type="text-editor\.default"[^>]*>([\s\S]*?)(?=<div class="elementor-element|<\/div>\s*<\/section>|$)/gi,
    ),
  );
  const parts: string[] = [];
  for (const w of widgets) {
    const container = w[1].match(
      /<div class="elementor-widget-container">([\s\S]*?)<\/div>/,
    );
    parts.push(container ? container[1] : w[1]);
  }
  return parts.join("\n");
};

// ---------------------------------------------------------------------------
// HTML → Lexical conversion. Only the subset we see in the corpus: h1–h4, p,
// ul, ol, li, strong/b, em/i, a. Anything else falls back to plain text.
// ---------------------------------------------------------------------------

type LexNode = Record<string, unknown>;

const textNode = (text: string, format = 0): LexNode => ({
  type: "text",
  text,
  version: 1,
  detail: 0,
  format,
  mode: "normal",
  style: "",
});

const paragraphNode = (children: LexNode[]): LexNode => ({
  type: "paragraph",
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
});

const headingNode = (tag: string, children: LexNode[]): LexNode => ({
  type: "heading",
  tag,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
});

const listNode = (
  listType: "bullet" | "number",
  items: LexNode[][],
): LexNode => ({
  type: "list",
  listType,
  tag: listType === "bullet" ? "ul" : "ol",
  start: 1,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children: items.map((childs, idx) => ({
    type: "listitem",
    value: idx + 1,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children: childs,
  })),
});

const linkNode = (url: string, children: LexNode[]): LexNode => ({
  type: "link",
  fields: { url, newTab: true, linkType: "custom" },
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children,
});

/** Parse the inline text of a block element, preserving bold/italic/links. */
const parseInline = (html: string): LexNode[] => {
  const out: LexNode[] = [];
  const src = html.replace(/\s+/g, " ").trim();
  let i = 0;
  let buffer = "";
  let format = 0;

  const flushText = () => {
    if (!buffer) return;
    out.push(textNode(decodeEntities(buffer), format));
    buffer = "";
  };

  while (i < src.length) {
    if (src[i] === "<") {
      const tagMatch = src.slice(i).match(/^<(\/?)(\w+)([^>]*)>/);
      if (!tagMatch) {
        buffer += src[i];
        i += 1;
        continue;
      }
      flushText();
      const [, closing, tagName, attrs] = tagMatch;
      const name = tagName.toLowerCase();
      i += tagMatch[0].length;

      if (closing) {
        if (name === "strong" || name === "b") format &= ~1;
        if (name === "em" || name === "i") format &= ~2;
        continue;
      }

      if (name === "strong" || name === "b") format |= 1;
      else if (name === "em" || name === "i") format |= 2;
      else if (name === "br") out.push(textNode("\n", format));
      else if (name === "a") {
        const hrefMatch = attrs.match(/href=["']([^"']+)["']/);
        const closeIdx = src.indexOf("</a>", i);
        const innerRaw = closeIdx === -1 ? src.slice(i) : src.slice(i, closeIdx);
        const children = parseInline(innerRaw);
        if (hrefMatch) out.push(linkNode(decodeEntities(hrefMatch[1]), children));
        else out.push(...children);
        i = closeIdx === -1 ? src.length : closeIdx + 4;
      }
      // any other tag — skip and keep going; its content will be handled as
      // bare text below.
    } else {
      buffer += src[i];
      i += 1;
    }
  }
  flushText();
  return out;
};

/** Convert the concatenated text-editor HTML to a Lexical root. */
const htmlToLexical = (html: string): any => {
  const children: LexNode[] = [];
  // Top-level h1..h4, p, ul, ol — li is handled when we enter ul/ol.
  const topRe = /<(h[1-4]|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = topRe.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    if (tag.startsWith("h")) {
      const inlineChildren = parseInline(inner);
      if (inlineChildren.length) children.push(headingNode(tag, inlineChildren));
    } else if (tag === "p") {
      const inlineChildren = parseInline(inner);
      if (inlineChildren.length) children.push(paragraphNode(inlineChildren));
    } else if (tag === "ul" || tag === "ol") {
      const items: LexNode[][] = [];
      const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let li: RegExpExecArray | null;
      while ((li = liRe.exec(inner)) !== null) {
        const inlineChildren = parseInline(li[1]);
        if (inlineChildren.length) items.push(inlineChildren);
      }
      if (items.length)
        children.push(listNode(tag === "ul" ? "bullet" : "number", items));
    }
  }

  if (!children.length) {
    // Final fallback — any stray text becomes one paragraph so the post isn't
    // a bare, uneditable empty doc in the admin.
    const txt = stripTags(html);
    if (txt)
      children.push(paragraphNode([textNode(txt)]));
  }

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children,
    },
  };
};

// ---------------------------------------------------------------------------
// Cover image resolution. Old clickrank.net URLs are dead, but the reference
// folder has ~477 real PNGs on disk under reference/wp-content/uploads/. wget
// also saved ~1152 `*.png.html` stubs at the same paths — we reject those.
// ---------------------------------------------------------------------------

const MIN_IMAGE_BYTES = 2048;

const mimeForExt = (ext: string): string | null => {
  switch (ext.toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return null;
  }
};

const resolveLocalImagePath = (
  url: string | undefined,
  referenceDir: string,
): string | null => {
  if (!url) return null;
  // Anything ending in .html is a wget-saved stub, not a real image.
  if (/\.html?$/i.test(url)) return null;

  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // Relative URL — treat as already a pathname.
    pathname = url.startsWith("/") ? url : `/${url}`;
  }

  const cleaned = pathname.replace(/^\/+/, "");
  if (!cleaned.startsWith("wp-content/")) return null;

  const abs = path.join(referenceDir, cleaned);
  if (!fs.existsSync(abs)) return null;

  const stat = fs.statSync(abs);
  if (!stat.isFile() || stat.size < MIN_IMAGE_BYTES) return null;
  if (!mimeForExt(path.extname(abs))) return null;

  return abs;
};

// ---------------------------------------------------------------------------
// Per-folder extraction
// ---------------------------------------------------------------------------

const parseReview = (folderName: string, html: string): ParsedReview | null => {
  const block = extractPostContentBlock(html);
  if (!block) return null;

  let contentHtml = extractTextEditorContent(block);

  const ogTitle = extractMeta(html, "og:title");
  const ogDescription = extractMeta(html, "og:description");
  const ogImage = extractMeta(html, "og:image");
  const publishedTime = extractMeta(html, "article:published_time");

  // Stub posts in the corpus (~3 of them) keep their body in a
  // theme-post-excerpt widget that lives above the content block. Fall back
  // to the og:description in that case so we still land a post.
  if (!stripTags(contentHtml)) {
    if (ogDescription && ogDescription.trim()) {
      contentHtml = `<p>${ogDescription.trim()}</p>`;
    } else {
      return null;
    }
  }

  const jsonLd = extractJsonLd(html);
  const graph: any[] = jsonLd?.["@graph"] ?? [];
  const article = graph.find((n) => n["@type"] === "Article") || {};

  const rawTitle =
    article.headline || ogTitle || folderName.replace(/-/g, " ");
  const title = decodeEntities(String(rawTitle)).replace(
    /\s*-\s*ClickRank\.NET\s*$/i,
    "",
  );

  const tags: string[] = Array.isArray(article.keywords)
    ? article.keywords.map((k: string) => decodeEntities(k))
    : [];
  const categories: string[] = Array.isArray(article.articleSection)
    ? article.articleSection.map((c: string) => decodeEntities(c))
    : [];

  const thumbnailUrl: string | undefined =
    article.thumbnailUrl ||
    article.image?.url ||
    ogImage ||
    undefined;

  // Affiliate URL — first `hop.clickbank.net` link in the content block.
  const affMatch = block.match(/href=["']([^"']*hop\.clickbank\.net[^"']*)["']/);
  const affiliateUrl = affMatch ? decodeEntities(affMatch[1]) : undefined;
  const vendorMatch = affiliateUrl?.match(/vendor=([^&]+)/i);
  const productName = vendorMatch ? vendorMatch[1] : undefined;

  const wordCount =
    typeof article.wordCount === "number" ? article.wordCount : undefined;

  const slug = slugify(folderName, { lower: true, strict: true });

  return {
    slug,
    title,
    excerpt: ogDescription ? decodeEntities(ogDescription) : "",
    publishedDate: publishedTime || null,
    tags,
    categories,
    thumbnailUrl,
    productName,
    affiliateUrl,
    wordCount,
    contentHtml,
  };
};

// ---------------------------------------------------------------------------
// Main — wire everything up against Payload
// ---------------------------------------------------------------------------

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage);
    return;
  }

  const repoRoot = path.resolve(__dirname, "..", "..", "..");
  const referenceDir = path.join(repoRoot, "reference");
  if (!fs.existsSync(referenceDir)) {
    throw new Error(`Reference directory not found at ${referenceDir}`);
  }

  const entries = fs
    .readdirSync(referenceDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  console.log(`Scanning ${entries.length} folders in ${referenceDir}\n`);

  const parsed: ParsedReview[] = [];
  let scanned = 0;
  for (const name of entries) {
    const htmlPath = path.join(referenceDir, name, "index.html");
    if (!fs.existsSync(htmlPath)) continue;
    scanned += 1;
    const html = fs.readFileSync(htmlPath, "utf8");
    const review = parseReview(name, html);
    if (!review) continue;
    parsed.push(review);
    if (args.limit && parsed.length >= args.limit) break;
  }

  console.log(
    `Parsed ${parsed.length} reviews (from ${scanned} index.html files).`,
  );

  if (args.dryRun) {
    for (const r of parsed.slice(0, 10)) {
      console.log(
        `- ${r.slug}  |  cats=[${r.categories.join(", ")}]  tags=${r.tags.length}  words=${r.wordCount ?? "?"}`,
      );
    }
    console.log("\nDry run complete. Nothing was written.");
    return;
  }

  const { default: config } = await import("../src/payload.config");
  const payload = await getPayload({ config });

  // Resolve (or create) an admin author to own the imported posts.
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  let author = (
    await payload.find({
      collection: "users",
      where: { email: { equals: adminEmail } },
      limit: 1,
      overrideAccess: true,
    })
  ).docs[0];
  if (!author) {
    author = await payload.create({
      collection: "users",
      overrideAccess: true,
      data: {
        email: adminEmail,
        name: "ClickRank Team",
        role: "admin",
        password:
          process.env.ADMIN_PASSWORD ||
          `Import${Math.random().toString(36).slice(2)}!1A`,
      },
    });
    console.log(`Created admin user ${adminEmail}`);
  }

  const categoryCache = new Map<string, number | string>();
  const tagCache = new Map<string, number | string>();

  const upsertCategory = async (name: string) => {
    const key = name.toLowerCase();
    if (categoryCache.has(key)) return categoryCache.get(key)!;
    const slug = slugify(name, { lower: true, strict: true });
    const found = await payload.find({
      collection: "categories",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs[0]) {
      categoryCache.set(key, found.docs[0].id);
      return found.docs[0].id;
    }
    const created = await payload.create({
      collection: "categories",
      overrideAccess: true,
      data: { name, slug },
    });
    categoryCache.set(key, created.id);
    return created.id;
  };

  const upsertTag = async (name: string) => {
    const key = name.toLowerCase();
    if (tagCache.has(key)) return tagCache.get(key)!;
    const slug = slugify(name, { lower: true, strict: true });
    const found = await payload.find({
      collection: "tags",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs[0]) {
      tagCache.set(key, found.docs[0].id);
      return found.docs[0].id;
    }
    const created = await payload.create({
      collection: "tags",
      overrideAccess: true,
      data: { name, slug },
    });
    tagCache.set(key, created.id);
    return created.id;
  };

  // Per-run cache so two posts sharing the same basename don't double-upload.
  const mediaCache = new Map<string, number | string>();

  const uploadMedia = async (
    absPath: string,
    alt: string,
  ): Promise<{ id: number | string; reused: boolean } | null> => {
    const basename = path.basename(absPath);
    const cached = mediaCache.get(basename);
    if (cached) return { id: cached, reused: true };

    // Idempotency across runs: Payload stores the original filename in the
    // `filename` field on media uploads.
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: basename } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs[0]) {
      mediaCache.set(basename, existing.docs[0].id);
      return { id: existing.docs[0].id, reused: true };
    }

    const mimetype = mimeForExt(path.extname(absPath));
    if (!mimetype) return null;
    const buffer = fs.readFileSync(absPath);

    const created = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: { alt },
      file: {
        data: buffer,
        mimetype,
        name: basename,
        size: buffer.length,
      },
    });
    mediaCache.set(basename, created.id);
    return { id: created.id, reused: false };
  };

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let mediaCreated = 0;
  let mediaReused = 0;
  let mediaMissing = 0;

  for (const r of parsed) {
    try {
      const existing = await payload.find({
        collection: "posts",
        where: { slug: { equals: r.slug } },
        limit: 1,
        overrideAccess: true,
      });
      if (existing.docs[0] && !args.overwrite) {
        skipped += 1;
        continue;
      }

      const categoryIds = (
        await Promise.all(r.categories.map((c) => upsertCategory(c)))
      ).filter(Boolean);
      const tagIds = (
        await Promise.all(r.tags.map((t) => upsertTag(t)))
      ).filter(Boolean);

      let mediaId: number | string | undefined;
      if (!args.skipImages) {
        const abs = resolveLocalImagePath(r.thumbnailUrl, referenceDir);
        if (abs) {
          const media = await uploadMedia(abs, r.title);
          if (media) {
            mediaId = media.id;
            if (media.reused) mediaReused += 1;
            else mediaCreated += 1;
          }
        } else if (r.thumbnailUrl) {
          mediaMissing += 1;
          console.warn(
            `  - ${r.slug}: cover not found locally (${r.thumbnailUrl})`,
          );
        }
      }

      const data: any = {
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        author: author.id,
        _status: "published",
        publishedDate: r.publishedDate,
        categories: categoryIds,
        tags: tagIds,
        content: htmlToLexical(r.contentHtml),
        meta: {
          title: r.title,
          description: r.excerpt,
          image: mediaId,
        },
        featuredImage: mediaId,
        affiliateUrl: r.affiliateUrl,
        productName: r.productName,
      };

      if (existing.docs[0]) {
        await payload.update({
          collection: "posts",
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        });
        updated += 1;
      } else {
        await payload.create({
          collection: "posts",
          data,
          overrideAccess: true,
        });
        created += 1;
      }
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ${r.slug}: ${msg}`);
    }
  }

  console.log(
    `\nDone. posts: created=${created} updated=${updated} skipped=${skipped} failed=${failed}` +
      `\nmedia: created=${mediaCreated} reused=${mediaReused} missing=${mediaMissing}`,
  );
  process.exit(0);
};

main().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err);
  console.error(`Import failed: ${msg}`);
  if (err instanceof Error && err.stack) console.error(err.stack);
  process.exit(1);
});
