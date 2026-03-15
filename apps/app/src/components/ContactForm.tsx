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

export const ContactForm = ({
  className,
  successTitle = "Message Sent!",
  successMessage = "We'll be in touch with you as soon as possible.",
  submitLabel = "Send Message",
  onSuccess,
}: ContactFormProps = {}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setState("success");
      onSuccess?.();
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }, [name, email, message, executeRecaptcha]);

  if (state === "success") {
    return (
      <div className={`text-center py-12 bg-zinc-900 border border-white/10 p-8 rounded-2xl${className ? ` ${className}` : ""}`}>
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand flex items-center justify-center">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold uppercase text-white mb-3">{successTitle}</h3>
        <p className="text-zinc-400 mb-8">{successMessage}</p>
        <button
          onClick={() => setState("idle")}
          className="px-8 py-3 bg-brand text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(var(--brand),0.5)] transition-all hover:scale-105"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-zinc-900 border border-white/10 p-8 rounded-2xl relative overflow-hidden${className ? ` ${className}` : ""}`}>
      {/* Decorative glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand/20 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand/20 blur-[100px] pointer-events-none" />

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-brand mb-2 font-mono flex items-center gap-2">
            <User className="w-3 h-3" />
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={state === "submitting"}
            className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-brand focus:bg-black/70 outline-none transition-all font-mono text-sm disabled:opacity-50 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-brand mb-2 font-mono flex items-center gap-2">
            <Mail className="w-3 h-3" />
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={state === "submitting"}
            className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-brand focus:bg-black/70 outline-none transition-all font-mono text-sm disabled:opacity-50 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-brand mb-2 font-mono flex items-center gap-2">
            <MessageSquare className="w-3 h-3" />
            What can we help you with?
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your vision..."
            rows={4}
            required
            disabled={state === "submitting"}
            className="w-full bg-black/50 border border-white/10 p-4 text-white placeholder:text-zinc-600 focus:border-brand focus:bg-black/70 outline-none transition-all font-mono text-sm resize-none disabled:opacity-50 rounded-lg"
          />
        </div>

        {state === "error" && (
          <p className="text-red-500 text-sm font-mono">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={state === "submitting"}
          className="w-full py-4 bg-brand text-white font-bold uppercase tracking-widest text-sm rounded-full hover:shadow-[0_0_30px_rgba(var(--brand),0.5)] transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
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

