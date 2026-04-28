import React from "react";

/**
 * Editorial "commitment / about" band. Sticky left-side display quote, right
 * column reads like a short letter-from-the-editor with a drop-cap first
 * paragraph and a signature line.
 */
export const CommitmentSection = () => {
  return (
    <section
      id="about"
      className="relative"
      style={{ padding: "clamp(72px, 9vw, 132px) 0" }}
    >
      <div className="max-w-[1280px] mx-auto px-5 md:px-10">
        <div className="grid gap-10 lg:gap-24 grid-cols-1 lg:grid-cols-[1fr_1.2fr] items-start">
          <h2
            className="m-0 lg:sticky lg:top-[110px]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 380,
              fontSize: "clamp(34px, 4.6vw, 62px)",
              letterSpacing: "-0.022em",
              lineHeight: 1.03,
              textWrap: "balance",
              color: "var(--color-ink)",
            }}
          >
            Passion and dedication lead&nbsp;to{" "}
            <em className="font-serif-italic text-[var(--color-mint)]">
              accurate
            </em>{" "}
            reviews.
          </h2>

          <div>
            <p
              className="m-0 mb-5 commitment-first"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 380,
                fontSize: 18,
                lineHeight: 1.65,
                color: "var(--color-ink-2)",
              }}
            >
              ClickBank sales pages are designed to make &ldquo;wait, let me
              think&rdquo; feel expensive. Countdown timers, stacked upsells,
              anonymous testimonials, claims you can&apos;t verify without
              buying first. The whole funnel rewards not reading carefully.
            </p>
            <p
              className="m-0 mb-5"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 380,
                fontSize: 18,
                lineHeight: 1.65,
                color: "var(--color-ink-2)",
              }}
            >
              ClickRank is an independent, analysis-driven review site. We
              don&apos;t run hands-on product testing and we don&apos;t claim
              to. What we do: read each sales page carefully, research vendor
              claims, and publish an honest-favorable review that leads with
              real strengths and names real caveats. Every review ships with a
              plain FTC disclosure and links to the product through a tracked
              redirect so you always see where you&apos;re going before you
              leave.
            </p>
            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 380,
                fontSize: 18,
                lineHeight: 1.65,
                color: "var(--color-ink-2)",
              }}
            >
              We use AI assistance to draft long-form copy at scale, then gate
              every draft through an automated editorial check that rejects
              fabrication tells, missing disclosures, and claims we can&apos;t
              support. When we get something wrong, we correct the page rather
              than quietly rewrite it. That&apos;s the deal.
            </p>

            <div
              className="mt-10 flex items-center gap-3.5 pt-7"
              style={{ borderTop: "1px solid var(--color-rule)" }}
            >
              <div
                aria-hidden
                className="w-12 h-12 rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-mag) 0%, var(--color-vio) 100%)",
                  border: "1px solid var(--color-rule)",
                }}
              />
              <div className="font-sans text-[13px]">
                <strong
                  className="block font-medium"
                  style={{ color: "var(--color-ink)" }}
                >
                  ClickRank editorial
                </strong>
                <span
                  className="font-mono"
                  style={{
                    color: "var(--color-ink-3)",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  Independent · Affiliate-disclosed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .commitment-first::first-letter{
            font-family: var(--font-serif);
            font-weight: 420;
            font-size: 76px;
            line-height: 0.85;
            float: left;
            padding: 8px 12px 0 0;
            color: var(--color-mint);
          }
          `,
        }}
      />
    </section>
  );
};
