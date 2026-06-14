import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ProjectVisual } from "@/components/project-visual";
import { portfolioProjects } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((item) => item.slug === slug);

  return createMetadata({
    title: project?.title || "Portfolio Project",
    description: project?.summary,
    path: `/portfolio/${slug}`,
  });
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow={project.category} title={project.title} description={project.summary}>
        <ButtonLink href="/contact" variant="light">
          Build a Similar Project
        </ButtonLink>
      </PageHero>
      <section className="bg-white py-20">
        <Container>
          <ProjectVisual project={project} />
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {[
              ["Client Goals", project.goals],
              ["Features", project.features],
              ["Technologies Used", project.technologies],
              ["Results", project.results],
            ].map(([title, items]) => (
              <div key={String(title)} className="interactive-card rounded-lg border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300">
                <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
                <div className="mt-5 space-y-3">
                  {(items as string[]).map((item) => (
                    <p key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

