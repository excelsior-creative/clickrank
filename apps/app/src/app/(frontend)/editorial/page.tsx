import React from "react";
import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";

// editorial-lint: allow-file fab.handsOn -- the editorial standard explicitly
// describes the only case in which we'd ever use the phrase ("when we have
// genuine hands-on experience with a product, we say so"). The substring is
// inside the standard itself, not a shipping claim of testing.

export const revalidate = 3600;

export const metadata = {
  title: "Editorial standard",
  description:
    "How ClickRank researches, writes, and publishes reviews of ClickBank digital products. Our honest-favorable standard, fabrication rules, and affiliate disclosure policy.",
  alternates: { canonical: "/editorial" },
};

const H1_STYLE = {
  fontFamily: "var(--font-serif)",
  fontWeight: 380,
  fontSize: "clamp(36px, 5vw, 64px)",
  letterSpacing: "-0.022em",
  lineHeight: 1.03,
  color: "var(--color-ink)",
} as const;

const H2_STYLE = {
  fontFamily: "var(--font-serif)",
  fontWeight: 420,
  fontSize: "clamp(24px, 3vw, 32px)",
  letterSpacing: "-0.018em",
  color: "var(--color-ink)",
} as const;

const BODY_STYLE = {
  fontFamily: "var(--font-serif)",
  fontSize: 18,
  lineHeight: 1.7,
  color: "var(--color-ink-2)",
} as const;

export default function EditorialPage() {
  return (
    <div className="py-20">
      <div className="max-w-[760px] mx-auto px-5 md:px-10">
        <div
          className="mb-7 font-mono"
          style={{
            fontSize: 11.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
          }}
        >
          Transparency · Editorial
        </div>
        <h1 className="m-0 mb-10" style={H1_STYLE}>
          Editorial standard
        </h1>
        <p className="mb-8" style={BODY_STYLE}>
          These are the rules we hold every ClickRank review to. They exist
          because most ClickBank review sites do not have any, and that is the
          wedge we are trying to earn trust on. If we ever break one of these,
          email us and we will correct the page.
        </p>
        <AffiliateDisclosure variant="banner" className="mb-16" />

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            Honest-favorable
          </h2>
          <p className="mb-4" style={BODY_STYLE}>
            We are in the business of recommending products. Readers know that,
            and they can tell when a review is pretending otherwise. So our
            rule is simple: we lean favorable when a product deserves it, and
            we are critical when it does not. Every review leads with real
            strengths and names at least one real caveat.
          </p>
          <p style={BODY_STYLE}>
            A review with zero downsides reads like an advertisement, and
            Google has been progressively deranking sites that publish those.
            Being honest about limitations is both the right thing to do and
            the thing that compounds.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            What we never do
          </h2>
          <ul className="list-disc pl-6 space-y-3" style={BODY_STYLE}>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>No fabrication.</strong>{" "}
              We do not invent features, benefits, statistics, study results,
              testimonials, or user quotes. If we do not know something, we do
              not write it.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>No fake first-person.</strong>{" "}
              We do not claim to have tested a product we have not tested. Our
              reviews are analysis-driven, based on vendor materials, pricing,
              refund policies, and publicly available feedback. When we have
              genuine hands-on experience with a product, we say so.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>
                No medical, financial, or income guarantees.
              </strong>{" "}
              ClickBank supplements are not FDA-approved, ClickBank programs
              do not guarantee weight loss, and ClickBank courses do not
              guarantee income. If a vendor makes those claims, we present
              them as vendor claims, not endorsements.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>
                No urgency manipulation.
              </strong>{" "}
              No fake scarcity, no fake countdowns, no &ldquo;price doubles at
              midnight&rdquo; pressure language.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>
                No covering obvious scams.
              </strong>{" "}
              If a product looks deceptive or predatory, we skip it. Skipping
              a commission is cheaper than losing reader trust.
            </li>
          </ul>
        </section>

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            Our review process
          </h2>
          <ol className="list-decimal pl-6 space-y-3" style={BODY_STYLE}>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Source.</strong>{" "}
              We pick products from the ClickBank marketplace based on reader
              demand, workable commissions, and whether we can say something
              genuinely useful about them.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Research.</strong>{" "}
              We collect the vendor&apos;s claims, pricing, upsells, rebills,
              refund window, target audience, common praises, and common
              complaints from public feedback.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Write.</strong>{" "}
              We produce an analysis-driven review that follows this standard.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>QA.</strong> Every
              draft is run through an automated editorial check that blocks
              publishing if the disclosure is missing, if the review contains
              fabricated first-person testing language, if it makes forbidden
              medical or income claims, or if it fails basic structural
              requirements.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Publish.</strong>{" "}
              Only drafts that pass the gate make it into the library. We
              update sitemap and schema on publish.
            </li>
            <li>
              <strong style={{ color: "var(--color-ink)" }}>Correct.</strong>{" "}
              If a reader tells us something is wrong, we fix it. We would
              rather correct a page than defend a stale take.
            </li>
          </ol>
        </section>

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            Affiliate disclosure
          </h2>
          <p className="mb-4" style={BODY_STYLE}>
            ClickRank is an affiliate of ClickBank vendors. When you buy a
            product through a link on this site, we earn a commission. That
            commission funds the site. It does not determine which products we
            cover, and it does not determine how we rate them.
          </p>
          <p className="mb-4" style={BODY_STYLE}>
            Every page with affiliate links carries a clear disclosure at the
            top of the page, within the review body, and in the site footer.
            Outbound affiliate links are tagged with{" "}
            <code style={{ color: "var(--color-mint)" }}>
              rel=&quot;sponsored nofollow noopener&quot;
            </code>{" "}
            and open in a new tab.
          </p>
          <p style={BODY_STYLE}>
            This follows the U.S. Federal Trade Commission&apos;s guidelines
            for endorsements and testimonials. If you think we have missed a
            disclosure somewhere on the site, email us and we will correct it.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            Use of AI in our workflow
          </h2>
          <p className="mb-4" style={BODY_STYLE}>
            We use AI tooling to help with research and drafting. We are
            transparent about this because the alternative, pretending
            otherwise, is the kind of thing this standard exists to prevent.
          </p>
          <p style={BODY_STYLE}>
            Every draft, regardless of how it was written, must pass the same
            editorial QA gate: disclosure present, no fabricated testing, no
            forbidden claims, honest caveats included. A draft that fails the
            gate does not get published, full stop.
          </p>
        </section>

        <section className="mb-14">
          <h2 className="mb-4" style={H2_STYLE}>
            Corrections
          </h2>
          <p style={BODY_STYLE}>
            If you spot an inaccuracy, a missing disclosure, a misattributed
            claim, or anything else on the site that is wrong, please email
            us through the{" "}
            <Link
              href="/contact"
              className="underline underline-offset-2 hover:text-[var(--color-mint)]"
              style={{ color: "var(--color-ink)" }}
            >
              contact page
            </Link>
            . We respond to every correction request, and if you are right,
            we update the page.
          </p>
        </section>

        <section
          className="pt-8"
          style={{ borderTop: "1px solid var(--color-rule)" }}
        >
          <p
            className="font-mono"
            style={{
              fontSize: 12,
              letterSpacing: "0.04em",
              color: "var(--color-ink-3)",
            }}
          >
            This standard is a living document. We revise it when we learn
            something new about what works for readers and what keeps us
            honest. Last material revision: April 2026.
          </p>
        </section>
      </div>
    </div>
  );
}
