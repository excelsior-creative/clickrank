import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { RichText } from "@/components/RichText";
import { draftMode } from "next/headers";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export const revalidate = 3600;

export default async function PrivacyPage() {
  const { isEnabled: draft } = await draftMode();
  const payload = await getPayload({ config });
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
    draft,
    overrideAccess: draft,
  });

  return (
    <div className="py-20">
      {draft && <LivePreviewListener />}
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
          Transparency · Privacy
        </div>
        <h1
          className="m-0 mb-10"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 380,
            fontSize: "clamp(36px, 5vw, 64px)",
            letterSpacing: "-0.022em",
            lineHeight: 1.03,
            color: "var(--color-ink)",
          }}
        >
          Privacy policy
        </h1>
        {!siteSettings.privacyPolicy ? (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              color: "var(--color-ink-3)",
            }}
          >
            Privacy policy content has not been populated in the CMS yet.
          </p>
        ) : (
          <div
            className="prose prose-invert prose-lg max-w-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              lineHeight: 1.7,
            }}
          >
            <RichText data={siteSettings.privacyPolicy} className="max-w-none" />
          </div>
        )}
      </div>
    </div>
  );
}
