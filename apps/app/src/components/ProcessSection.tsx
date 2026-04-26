import React from "react";
import { SectionHead } from "./SectionHead";
import { Search, FileText, ShieldCheck, BadgeCheck, Link2, RotateCcw } from "lucide-react";

type Step = {
  num: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
};

/**
 * The six steps below are what we actually do — not a stock "how we test"
 * page copied from a template. ClickRank is an analysis-driven review
 * site. We do not buy every product, we do not run hands-on tests, and
 * we do not employ a roster of named editors. Claims we can't back up
 * stay off the page.
 *
 * editorial-lint: allow-file fab.handsOn fab.namedEditor -- the JSDoc and
 * one step description explicitly deny hands-on testing and a named-editor
 * roster; substrings appear inside denials, not claims.
 */
const STEPS: Step[] = [
  {
    num: "Step 01",
    title: "Source from ClickBank",
    body:
      "We pull from ClickBank's current marketplace — the offers readers are actually being sold. Category demand and vendor signals guide which products are worth covering at all.",
    Icon: Search,
  },
  {
    num: "Step 02",
    title: "Research the offer",
    body:
      "We read the sales page end to end, log the claims, identify the target reader, and pull vendor-stated details: pricing, upsells, refund policy, support channels.",
    Icon: FileText,
  },
  {
    num: "Step 03",
    title: "Draft the review",
    body:
      "We write an honest-favorable review: lead with real strengths, name one or two fair caveats, present vendor claims as vendor claims. No fabricated first-person experience, no invented stats or testimonials.",
    Icon: BadgeCheck,
  },
  {
    num: "Step 04",
    title: "Editorial QA gate",
    body:
      "Every draft runs through an automated QA stage before it can be saved. It checks FTC disclosure, required structure, affiliate links, fabrication tells, forbidden claims, and schema completeness. Failures block publish.",
    Icon: ShieldCheck,
  },
  {
    num: "Step 05",
    title: "Disclose and link",
    body:
      "Every review renders a clear FTC affiliate disclosure at the top, inline, and in the footer. Outbound affiliate links are tracked via our /go/ redirect so readers always see where they're going before they leave.",
    Icon: Link2,
  },
  {
    num: "Step 06",
    title: "Revisit and correct",
    body:
      "Pricing, upsells, and vendor terms change. When we catch a material change — or a reader tells us we got something wrong — we update the page and log the correction rather than quietly swapping the copy.",
    Icon: RotateCcw,
  },
];

/**
 * "How we work" — six equal cards on a dark band with a subtle radar-style
 * motif bleeding off the right edge.
 */
export const ProcessSection = () => {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-t border-b"
      style={{
        borderColor: "var(--color-rule)",
        background:
          "radial-gradient(ellipse at 80% 50%, oklch(82% 0.19 165 / .06), transparent 50%), oklch(15% 0.035 255)",
        marginTop: "clamp(72px, 9vw, 120px)",
        padding: "clamp(56px, 8vw, 104px) 0",
      }}
    >
      {/* Radar motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: "-10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          opacity: 0.4,
          background:
            "radial-gradient(closest-side, transparent 78%, color-mix(in oklch, var(--color-mint) 30%, transparent) 79%, transparent 80%), radial-gradient(closest-side, transparent 58%, color-mix(in oklch, var(--color-mint) 22%, transparent) 59%, transparent 60%), radial-gradient(closest-side, transparent 38%, color-mix(in oklch, var(--color-mint) 18%, transparent) 39%, transparent 40%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 relative z-[1]">
        <SectionHead
          eyebrow="The Process · How we work"
          title={
            <>
              Every review, the <em className="font-serif-italic text-[var(--color-mint)]">same</em> six steps.
            </>
          }
          description="ClickRank is analysis-driven, not hands-on. We don't buy every offer and we don't pretend to. What we do: read the sales page carefully, write an honest-favorable review, gate it through an editorial QA stage, and disclose the affiliate relationship everywhere it appears."
          className="!pt-0"
        />

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.num}
              className="flex flex-col gap-3.5 p-7 rounded-[14px] min-h-[260px] transition-all hover:-translate-y-0.5"
              style={{
                background: "color-mix(in oklch, var(--color-card) 82%, transparent)",
                border: "1px solid var(--color-rule)",
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  color: "var(--color-ink-3)",
                  textTransform: "uppercase",
                }}
              >
                {step.num}
              </span>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-[10px] mb-auto"
                style={{
                  border:
                    "1px solid color-mix(in oklch, var(--color-mint) 35%, var(--color-rule))",
                  background: "color-mix(in oklch, var(--color-mint) 12%, transparent)",
                  color: "var(--color-mint)",
                }}
              >
                <step.Icon className="w-4 h-4" />
              </div>
              <h4
                className="m-0"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 420,
                  fontSize: 22,
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                }}
              >
                {step.title}
              </h4>
              <p
                className="m-0"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 300,
                  fontSize: 14.5,
                  color: "var(--color-ink-2)",
                  lineHeight: 1.55,
                }}
              >
                {step.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
