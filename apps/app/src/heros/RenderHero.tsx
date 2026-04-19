import React from "react";
import Image from "next/image";

type HeroData = {
  type?: "none" | "highImpact" | "mediumImpact" | "lowImpact";
  title?: string;
  description?: string;
  image?: { url?: string | null; alt?: string | null } | null;
};

/**
 * Editorial CMS hero. Used by dynamic Pages (and any Post opting in to a
 * custom hero). Mirrors the homepage hero's serif-display treatment but sits
 * full-bleed instead of in a two-column layout.
 */
export const RenderHero = ({ type = "none", title, description, image }: HeroData) => {
  if (type === "none") return null;

  const size =
    type === "highImpact"
      ? "clamp(46px, 6.4vw, 92px)"
      : type === "mediumImpact"
      ? "clamp(38px, 5vw, 70px)"
      : "clamp(32px, 4vw, 52px)";

  return (
    <section
      className="relative overflow-hidden border-b"
      style={{
        borderColor: "var(--color-rule)",
        padding: "clamp(64px, 9vw, 128px) 0 clamp(48px, 6vw, 96px)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: "-20%",
          right: "-10%",
          width: "60vw",
          height: "70vh",
          filter: "blur(40px)",
          background:
            "radial-gradient(closest-side, oklch(62% 0.26 330 / .18), transparent 70%), radial-gradient(closest-side, oklch(60% 0.23 285 / .14), transparent 70%)",
        }}
      />

      <div className="max-w-[960px] mx-auto px-5 md:px-10 relative text-center">
        {title && (
          <h1
            className="m-0 mb-6"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 380,
              fontSize: size,
              letterSpacing: "-0.022em",
              lineHeight: 1.03,
              textWrap: "balance",
              color: "var(--color-ink)",
            }}
          >
            {title}
          </h1>
        )}
        {description && (
          <p
            className="mx-auto m-0 max-w-[60ch]"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(17px, 1.5vw, 20px)",
              color: "var(--color-ink-2)",
              lineHeight: 1.55,
            }}
          >
            {description}
          </p>
        )}
        {image && typeof image === "object" && image.url && (
          <div
            className="relative mt-10 aspect-video overflow-hidden rounded-[14px] mx-auto"
            style={{
              border: "1px solid var(--color-rule)",
              boxShadow: "0 30px 80px -30px oklch(10% 0.04 255)",
            }}
          >
            <Image
              src={image.url}
              alt={image.alt || title || "Hero image"}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};
