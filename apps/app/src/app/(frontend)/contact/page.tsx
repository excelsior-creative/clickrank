import React from "react";
import { Container } from "@/components/Container";
import Header from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { Mail } from "lucide-react";

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="py-20 bg-dark">
      <Container>
        <Header
          badge="Contact Us"
          title="Get in Touch"
          subtitle="Have a question about a product or want to suggest a review? We'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">Contact Information</h3>
                <p className="text-gray-400 mb-6">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email</p>
                    <p className="text-gray-400">hello@clickrank.net</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-light p-6 rounded-xl border border-white/5">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
