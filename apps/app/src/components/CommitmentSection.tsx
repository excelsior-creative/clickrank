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
            <em className="font-serif-italic text-[var(--color-mint)]">accurate</em>{" "}
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
              Navigating the world of ClickBank digital products is overwhelming on
              purpose. Countdown timers, layered upsells, anonymous testimonials, and
              sales pages that tell you everything and nothing — it's a system
              designed to make "wait, let me think" feel expensive.
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
              ClickRank exists to slow that down. A small team of editors, each with
              a real name and a real beat, spends an average of 14 hours on every
              product before we publish. We've recommended products we'd buy again
              and we've told readers to skip plenty. The scores live on the page,
              the dates live on the page, and the affiliate disclosure lives
              everywhere it should.
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
              Our only job is to be the second opinion you wished you had before the
              last one.
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
                  The ClickRank desk
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
                  Editors · Since 2023
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
