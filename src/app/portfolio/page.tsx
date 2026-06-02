import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { ProjectVisual } from "@/components/project-visual";
import { portfolioProjects } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Portfolio",
  description:
    "Explore realistic HouseOfDev demo projects for healthcare, restaurants, construction, education, and corporate technology companies.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Demo projects that show how HouseOfDev solves real business goals"
        description="Each project includes screenshots, features, technologies, results, and the client goal behind the build."
      />
      <section className="premium-gradient py-20">
        <Container className="grid gap-8">
          {portfolioProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="group grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 transition hover:-translate-y-1 hover:border-blue-300 lg:grid-cols-[0.95fr_1.05fr]"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">
                  {project.category}
                </p>
                <h2 className="mt-4 text-3xl font-semibold text-slate-950 group-hover:text-blue-700">
                  {project.title}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{project.summary}</p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-700">
                  View project <ArrowRight className="h-4 w-4" />
                </div>
              </div>
              <ProjectVisual project={project} />
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}

