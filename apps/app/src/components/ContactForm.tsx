"use client";

import { Loader2, Mail, MessageSquare, Send, User } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type FormState = "idle" | "submitting" | "success" | "error";

type ContactFormProps = {
  className?: string;
  successTitle?: string;
  successMessage?: string;
  submitLabel?: string;
  onSuccess?: () => void;
};

const FIELD_LABEL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--color-mint)",
  marginBottom: 8,
};

const FIELD_INPUT: React.CSSProperties = {
  width: "100%",
  background: "oklch(15% 0.03 255 / 0.6)",
  border: "1px solid var(--color-rule)",
  color: "var(--color-ink)",
  padding: "14px 16px",
  fontFamily: "var(--font-sans)",
  fontSize: 14,
  borderRadius: 10,
  outline: "none",
  transition: "border-color .15s, background .15s",
};

export const ContactForm = ({
  className,
  successTitle = "Message received",
  successMessage = "A member of the desk will reply within two business days.",
  submitLabel = "Send message",
  onSuccess,
}: ContactFormProps = {}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setState("submitting");
      setErrorMessage("");

      try {
        let recaptchaToken = "";
        if (executeRecaptcha) {
          recaptchaToken = await executeRecaptcha("contact_form");
        }

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message, recaptchaToken }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to send message");

        setState("success");
        onSuccess?.();
      } catch (err) {
        setState("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [name, email, message, executeRecaptcha, onSuccess]
  );

  if (state === "success") {
    return (
      <div
        className={`p-8 rounded-[14px] text-center ${className ?? ""}`}
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-rule)",
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{
            background: "color-mix(in oklch, var(--color-mint) 18%, transparent)",
            border:
              "1px solid color-mix(in oklch, var(--color-mint) 45%, var(--color-rule))",
            color: "var(--color-mint)",
          }}
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3
          className="m-0 mb-3"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 420,
            fontSize: 26,
            color: "var(--color-ink)",
          }}
        >
          {successTitle}
        </h3>
        <p
          className="m-0 mb-8"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            color: "var(--color-ink-2)",
            fontSize: 15,
          }}
        >
          {successMessage}
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setName("");
            setEmail("");
            setMessage("");
          }}
          className="px-6 py-3 rounded-full font-medium text-sm transition-all hover:mint-glow hover:-translate-y-px"
          style={{
            background: "var(--color-mint)",
            color: "var(--color-mint-ink)",
            border: 0,
            cursor: "pointer",
          }}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden p-8 rounded-[14px] ${className ?? ""}`}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-rule)",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label style={FIELD_LABEL}>
            <User className="w-3 h-3" />
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            disabled={state === "submitting"}
            style={FIELD_INPUT}
            className="focus:border-[var(--color-mint)] disabled:opacity-60"
          />
        </div>

        <div>
          <label style={FIELD_LABEL}>
            <Mail className="w-3 h-3" />
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@inbox.com"
            required
            disabled={state === "submitting"}
            style={FIELD_INPUT}
            className="focus:border-[var(--color-mint)] disabled:opacity-60"
          />
        </div>

        <div>
          <label style={FIELD_LABEL}>
            <MessageSquare className="w-3 h-3" />
            What can we help with?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A short note — a review you want us to look at, a correction, or a question."
            rows={5}
            required
            disabled={state === "submitting"}
            style={{ ...FIELD_INPUT, resize: "vertical" }}
            className="focus:border-[var(--color-mint)] disabled:opacity-60"
          />
        </div>

        {state === "error" && (
          <p
            className="font-mono text-sm"
            style={{ color: "var(--color-neg)" }}
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full py-3.5 rounded-full text-sm font-medium transition-all hover:mint-glow hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          style={{
            background: "var(--color-mint)",
            color: "var(--color-mint-ink)",
            border: 0,
            cursor: "pointer",
          }}
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {submitLabel}
            </>
          )}
        </button>
      </form>
    </div>
  );
};
