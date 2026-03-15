import React from "react";
import { Container } from "@/components/Container";
import Header from "@/components/Header";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

export const revalidate = 3600;

export default function ContactPage() {
  return (
    <div className="py-20">
      <Container>
        <Header
          badge="Contact Us"
          title="Get in Touch"
          subtitle="Have a question or want to work together? We'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <p className="text-muted-foreground mb-6">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">hello@example.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 000-0000</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-medium">Office</p>
                    <p className="text-muted-foreground">
                      123 Innovation Drive<br />
                      Silicon Valley, CA 94025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
