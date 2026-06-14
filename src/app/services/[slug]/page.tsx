import { notFound } from "next/navigation";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { services } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) {
    return createMetadata({ title: "Service" });
  }

  return createMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = getIcon(service.icon);

  return (
    <>
      <PageHero eyebrow="Service" title={service.title} description={service.description}>
        <ButtonLink href="/contact" variant="light">
          {service.cta}
        </ButtonLink>
      </PageHero>

      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="interactive-card rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
              <div className="rounded-md bg-blue-50 p-3 text-blue-700 w-fit">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">What this service delivers</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                A focused engagement that turns business goals into a polished, measurable, and scalable digital asset.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {service.benefits.map((benefit) => (
                <div key={benefit} className="interactive-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Process</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">A clear delivery path from idea to launch</h2>
              <div className="mt-8 space-y-4">
                {service.process.map((step, index) => (
                  <div key={step} className="interactive-card flex gap-4 rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-300">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-950 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="text-sm font-medium leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">FAQ</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950">Questions before starting</h2>
              <div className="mt-8 space-y-4">
                {service.faq.map((item) => (
                  <div key={item.question} className="interactive-card rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-300">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-slate-950">{item.question}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

