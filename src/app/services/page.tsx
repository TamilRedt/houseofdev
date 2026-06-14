import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { services } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services",
  description:
    "Explore HouseOfDev services including website development, web applications, cloud, AWS, AI chatbots, automation, CRM, SEO, UI/UX, security, and APIs.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Premium digital services for launch, growth, and enterprise operations"
        description="Every service includes strategy, implementation, conversion thinking, SEO discipline, and a production-ready technical foundation."
      >
        <ButtonLink href="/contact" variant="light">
          Plan My Project
        </ButtonLink>
      </PageHero>

      <section className="bg-white py-20">
        <Container>
          <SectionHeader
            eyebrow="Capabilities"
            title="Detailed service cards for every stage of the digital journey"
            description="Pick one focused service or combine several into a complete digital transformation roadmap."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = getIcon(service.icon);
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="interactive-card group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-600" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                  <div className="mt-5 space-y-2">
                    {service.benefits.slice(0, 2).map((benefit) => (
                      <p key={benefit} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {benefit}
                      </p>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

