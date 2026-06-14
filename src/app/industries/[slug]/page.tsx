import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2, Lightbulb } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { industries } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  return createMetadata({
    title: industry ? `${industry.title} Digital Solutions` : "Industry",
    description: industry?.description,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industries.find((item) => item.slug === slug);

  if (!industry) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow="Industry" title={`${industry.title} Digital Solutions`} description={industry.description}>
        <ButtonLink href="/contact" variant="light">
          Build My Industry Plan
        </ButtonLink>
      </PageHero>
      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="interactive-card rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">Industry Challenges</h2>
              <div className="mt-6 space-y-3">
                {industry.challenges.map((challenge) => (
                  <p key={challenge} className="text-sm leading-6 text-slate-700">
                    {challenge}
                  </p>
                ))}
              </div>
            </div>
            <div className="interactive-card rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
              <Lightbulb className="h-6 w-6 text-emerald-600" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">Solutions Offered</h2>
              <div className="mt-6 space-y-3">
                {industry.solutions.map((solution) => (
                  <p key={solution} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    {solution}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="interactive-card mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-xl shadow-slate-950/5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Case Study Direction</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">How HouseOfDev would approach this market</h2>
            <p className="mt-4 max-w-4xl text-base leading-7 text-slate-600">{industry.caseStudy}</p>
          </div>
        </Container>
      </section>
    </>
  );
}

