import React from "react";

type Stat = { num: string; suffix?: string; label: string };

const DEFAULT_STATS: Stat[] = [
  { num: "500", suffix: "+", label: "Products reviewed" },
  { num: "50K", suffix: "+", label: "Monthly readers" },
  { num: "100", suffix: "+", label: "Categories covered" },
  { num: "4.9", suffix: "/5", label: "Reader trust score" },
];

/**
 * Horizontal trust/stats row — sits directly under the hero. Numbers are set
 * in the editorial serif; labels are monospace caps separated by hair-line
 * dividers.
 */
export const TrustRow = ({ stats = DEFAULT_STATS }: { stats?: Stat[] }) => {
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
          {stats.map((stat) => (
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
