import React from "react";
import { getPayload } from "payload";
import config from "@payload-config";

type Stat = { num: string; suffix?: string; label: string };

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
};

/**
 * Honest trust row. Pulls real counts from the DB at request time: how many
 * reviews we've actually published, how many categories are covered, and the
 * date of the most recent review. The fourth cell is a static transparency
 * badge (FTC-disclosed on every page) rather than a fabricated rating.
 *
 * Prior versions rendered invented numbers ("500+ products", "50K+ readers",
 * "4.9/5 trust score"). Those violated the Honest-Favorable editorial
 * standard and are gone.
 */
export const TrustRow = async ({ stats }: { stats?: Stat[] } = {}) => {
  let resolved: Stat[];

  if (stats) {
    resolved = stats;
  } else {
    const payload = await getPayload({ config });
    const [postsRes, catsRes, latestRes] = await Promise.all([
      payload.count({
        collection: "posts",
        where: { _status: { equals: "published" } },
      }),
      payload.count({ collection: "categories" }),
      payload.find({
        collection: "posts",
        limit: 1,
        sort: "-publishedDate",
        where: { _status: { equals: "published" } },
        depth: 0,
      }),
    ]);

    const postCount = postsRes.totalDocs || 0;
    const catCount = catsRes.totalDocs || 0;
    const latest = latestRes.docs?.[0];
    const latestDate = latest?.publishedDate
      ? new Date(latest.publishedDate)
      : null;
    const updatedLabel = latestDate
      ? latestDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "—";

    resolved = [
      {
        num: formatCount(postCount),
        label: postCount === 1 ? "Review published" : "Reviews published",
      },
      {
        num: formatCount(catCount),
        label: catCount === 1 ? "Category covered" : "Categories covered",
      },
      { num: updatedLabel, label: "Last review added" },
      { num: "FTC", suffix: "✓", label: "Disclosed on every page" },
    ];
  }

  return (
    <section
      className="trust-row border-b"
      style={{
        background: "oklch(15% 0.035 255)",
        borderColor: "var(--color-rule)",
        padding: "36px 0",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="trust-row__grid">
          {resolved.map((stat) => (
            <div key={stat.label} className="trust-row__cell">
              <span className="trust-row__num">
                {stat.num}
                {stat.suffix && <span className="trust-row__suffix">{stat.suffix}</span>}
              </span>
              <span className="trust-row__lbl">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .trust-row__grid{
            display:grid;
            grid-template-columns: repeat(2, 1fr);
            row-gap: 28px;
          }
          @media (min-width: 720px){
            .trust-row__grid{ grid-template-columns: repeat(4, 1fr); row-gap: 0; }
          }
          .trust-row__cell{
            padding: 8px 24px;
            display: flex; flex-direction: column; gap: 4px;
            border-left: 1px solid var(--color-rule-soft);
          }
          .trust-row__cell:first-child{ border-left: 0; padding-left: 0; }
          @media (max-width: 719.98px){
            .trust-row__cell:nth-child(3){ border-left: 0; padding-left: 0; }
          }
          .trust-row__num{
            font-family: var(--font-serif);
            font-weight: 380;
            font-size: clamp(30px, 3.4vw, 44px);
            letter-spacing: -0.02em;
            line-height: 1;
            color: var(--color-ink);
          }
          .trust-row__suffix{
            font-size: 0.55em; color: var(--color-ink-3); font-weight: 400;
          }
          .trust-row__lbl{
            font-family: var(--font-mono);
            font-size: 11px; letter-spacing: 0.14em;
            color: var(--color-ink-3); text-transform: uppercase;
          }
          `,
        }}
      />
    </section>
  );
};
