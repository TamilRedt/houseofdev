import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { pricingPackages } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pricing",
  description:
    "HouseOfDev pricing packages start at INR 4,999 for starter websites, INR 9,999 for business websites, and INR 24,999+ for premium digital solutions.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Premium digital packages with clear starting points"
        description="Start small, scale intelligently, and add custom software, automation, AI, and dashboards when the business is ready."
      />
      <section className="premium-gradient py-20">
        <Container>
          <SectionHeader
            eyebrow="Packages"
            title="Choose the foundation that matches your stage"
            description="Every package includes mobile-first delivery, clean implementation, and launch guidance."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {pricingPackages.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-lg border p-6 shadow-xl ${
                  plan.featured
                    ? "border-blue-500 bg-blue-50 shadow-blue-950/8"
                    : "border-slate-200 bg-white shadow-slate-950/5"
                }`}
              >
                <h2 className="text-2xl font-semibold text-slate-950">{plan.name}</h2>
                <p className="mt-3 text-4xl font-semibold text-blue-700">{plan.price}</p>
                <p className="mt-4 text-sm leading-6 text-slate-600">{plan.description}</p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <p key={feature} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {feature}
                    </p>
                  ))}
                </div>
                <div className="mt-8">
                  <ButtonLink href="/contact" variant={plan.featured ? "primary" : "secondary"}>
                    Start With {plan.name}
                  </ButtonLink>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Custom Scope</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Need a SaaS-quality portal, enterprise workflow, or AI automation platform?
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">
              Custom builds are scoped after discovery. We define user roles, data models, integrations,
              timeline, deployment architecture, and maintenance expectations before development begins.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}

