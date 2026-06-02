import { Mail, MapPin, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Contact HouseOfDev for website development, web applications, AI automation, cloud, SEO, branding, and digital transformation projects.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what you want to build, improve, or automate"
        description="Share your business context, budget range, service need, and timeline. We will respond with a practical next step."
      />
      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Start with a free consultation</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Use the form to request a website, app, automation workflow, cloud setup, AI integration, SEO plan, or full digital transformation roadmap.
              </p>
              <div className="mt-8 space-y-4">
                <p className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  <Mail className="h-5 w-5 text-blue-600" /> hello@houseofdev.com
                </p>
                <p className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  <PhoneCall className="h-5 w-5 text-blue-600" /> Discovery calls by appointment
                </p>
                <p className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700">
                  <MapPin className="h-5 w-5 text-blue-600" /> Hosur, Bangalore, and remote across India
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}

