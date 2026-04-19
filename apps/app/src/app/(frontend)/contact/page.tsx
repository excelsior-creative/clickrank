import React from "react";
import { SectionHead } from "@/components/SectionHead";
import { ContactForm } from "@/components/ContactForm";
import { Mail } from "lucide-react";

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-10 pb-24">
      <SectionHead
        eyebrow="Contact · Get in touch"
        title={
          <>
            Reach the{" "}
            <em className="font-serif-italic text-[var(--color-mint)]">editors</em>.
          </>
        }
        description="Have a question about a review, a correction, or a product you want us to look at? Send us a note — a person will read it."
      />

      <div className="grid gap-12 grid-cols-1 lg:grid-cols-2 items-start">
        <div
          className="space-y-6 p-7 rounded-[14px]"
          style={{
            background: "var(--color-card)",
            border: "1px solid var(--color-rule)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              lineHeight: 1.2,
              color: "var(--color-ink)",
              margin: 0,
            }}
          >
            Direct contact
          </h3>
          <p
            className="m-0"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              color: "var(--color-ink-2)",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Fill out the form and a member of the desk will reply within two business days.
            For urgent corrections, email us directly.
          </p>

          <div
            className="flex items-start gap-4 pt-4"
            style={{ borderTop: "1px solid var(--color-rule-soft)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "color-mix(in oklch, var(--color-mint) 12%, transparent)",
                border:
                  "1px solid color-mix(in oklch, var(--color-mint) 35%, var(--color-rule))",
                color: "var(--color-mint)",
              }}
            >
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p
                className="font-medium m-0"
                style={{ color: "var(--color-ink)", fontSize: 14 }}
              >
                Email
              </p>
              <a
                href="mailto:hello@clickrank.net"
                className="hover:text-[var(--color-mint)] transition-colors"
                style={{ color: "var(--color-ink-2)", fontSize: 14 }}
              >
                hello@clickrank.net
              </a>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
