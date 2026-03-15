import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION } from "@/lib/metadata";
import config from "@payload-config";
import { getPayload } from "payload";

export async function GET() {
  const payload = await getPayload({ config });

  const { docs: posts } = await payload.find({
    collection: "posts",
    limit: 20,
    sort: "-publishedDate",
    where: {
      _status: {
        equals: "published",
      },
    },
  });

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${SITE_NAME}</title>
  <link>${SITE_URL}</link>
  <description>${DEFAULT_DESCRIPTION}</description>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  ${posts
    .map((post) => {
      const publishedDate = post.publishedDate
        ? new Date(post.publishedDate).toUTCString()
        : new Date(post.createdAt).toUTCString();
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid>${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${publishedDate}</pubDate>
      <description><![CDATA[${post.excerpt || ""}]]></description>
    </item>`;
    })
    .join("")}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

