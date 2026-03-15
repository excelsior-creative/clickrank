import React from "react";
import Image from "next/image";

import { Container } from "@/components/Container";

type HeroData = {
  type?: "none" | "highImpact" | "mediumImpact" | "lowImpact";
  title?: string;
  description?: string;
  image?: { url?: string | null; alt?: string | null } | null;
};

export const RenderHero = ({ type = "none", title, description, image }: HeroData) => {
  if (type === "none") {
    return null;
  }

  const headingSize =
    type === "highImpact"
      ? "text-5xl md:text-7xl"
      : type === "mediumImpact"
        ? "text-4xl md:text-5xl"
        : "text-3xl md:text-4xl";

  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center space-y-6">
          {title ? <h1 className={`${headingSize} font-bold tracking-tight`}>{title}</h1> : null}
          {description ? (
            <p className="text-lg md:text-xl text-muted-foreground">{description}</p>
          ) : null}
          {image && typeof image === "object" && image.url ? (
            <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl shadow-xl">
              <Image src={image.url} alt={image.alt || title || "Hero image"} fill className="object-cover" />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
};
