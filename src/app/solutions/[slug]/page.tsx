import { notFound } from "next/navigation";
import { CheckCircle2, Layers3 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { solutions } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);

  return createMetadata({
    title: solution?.title || "Solution",
    description: solution?.description,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutions.find((item) => item.slug === slug);

  if (!solution) {
    notFound();
  }

  const Icon = getIcon(solution.icon);

  return (
    <>
      <PageHero eyebrow="Solution" title={solution.title} description={solution.description}>
        <ButtonLink href="/contact" variant="light">
          Scope This Solution
        </ButtonLink>
      </PageHero>
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-6 shadow-xl shadow-slate-950/5">
              <Icon className="h-7 w-7 text-blue-600" />
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">Core Modules</h2>
              <div className="mt-6 grid gap-3">
                {solution.modules.map((module) => (
                  <div key={module} className="flex items-center gap-3 rounded-md bg-slate-50 px-4 py-3">
                    <Layers3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-800">{module}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-6 shadow-xl shadow-slate-950/5">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">Business Outcomes</h2>
              <div className="mt-6 grid gap-3">
                {solution.outcomes.map((outcome) => (
                  <p key={outcome} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    {outcome}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

