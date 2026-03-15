import React from "react";
import { getPayload } from "payload";
import config from "@/payload.config";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { draftMode } from "next/headers";
import { LivePreviewListener } from "@/components/LivePreviewListener";

export const dynamic = 'force-dynamic';

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
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          {!siteSettings.privacyPolicy ? (
            <p className="text-muted-foreground italic">
              Privacy policy content has not been populated in the CMS yet.
            </p>
          ) : (
            <RichText data={siteSettings.privacyPolicy} className="max-w-none" />
          )}
        </div>
      </Container>
    </div>
  );
}

