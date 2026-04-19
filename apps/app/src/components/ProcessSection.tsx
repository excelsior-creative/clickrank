import React from "react";
import { SectionHead } from "./SectionHead";
import { Search, FileCheck, BarChart3, Shield, Zap, Users } from "lucide-react";

type Step = {
  num: string;
  title: string;
  body: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  {
    num: "Step 01",
    title: "In-depth research",
    body:
      "We track what's actually selling on ClickBank, what's climbing search, and what readers are asking about — not what affiliate networks want us to push.",
    Icon: Search,
  },
  {
    num: "Step 02",
    title: "Hands-on testing",
    body:
      "We buy the product, work through it the way a reader would, and document every upsell, broken link, and \"bonus\" that turned out to be filler.",
    Icon: FileCheck,
  },
  {
    num: "Step 03",
    title: "Data analysis",
    body:
      "We cross-reference refund rates, gravity scores, independent user reports, and BBB complaints before we settle on a score we're willing to defend.",
    Icon: BarChart3,
  },
  {
    num: "Step 04",
    title: "Quality assurance",
    body:
      "A second editor reads the draft with the product open alongside. If they can't reproduce a claim in the review, the claim comes out.",
    Icon: Shield,
  },
  {
    num: "Step 05",
    title: "Fast updates",
    body:
      "Digital products change — prices, modules, names. Every review is revisited on a 90-day cycle and updated, not quietly replaced.",
    Icon: Zap,
  },
  {
    num: "Step 06",
    title: "Community feedback",
    body:
      "Thousands of readers tell us when they bought, what they thought, and whether we got it right. Their notes feed the next update.",
    Icon: Users,
  },
];

/**
 * "How we test" — six equal cards on a dark band with a subtle radar-style
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
          eyebrow="The Process · How we test"
          title={
            <>
              Every review, the <em className="font-serif-italic text-[var(--color-mint)]">same</em> six steps.
            </>
          }
          description="We don't score products from a sales page. Each item is bought, opened, and worked through before we publish a word — then updated as it changes."
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
