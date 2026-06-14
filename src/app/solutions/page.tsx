import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { solutions } from "@/lib/data";
import { getIcon } from "@/lib/icons";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Solutions",
  description:
    "Explore digital transformation, automation, cloud migration, AI integration, enterprise software, booking systems, inventory, HR, attendance, portals, and dashboards.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Business platforms that connect customers, teams, and operations"
        description="Use these solution tracks as starting points for SaaS-quality systems tailored to your business."
      />
      <section className="surface-grid bg-slate-50 py-20">
        <Container>
          <SectionHeader
            eyebrow="System Blueprints"
            title="Dedicated solutions for high-value business workflows"
            description="Each solution can stand alone or become part of a larger business management platform."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = getIcon(solution.icon);
              return (
                <Link
                  key={solution.slug}
                  href={`/solutions/${solution.slug}`}
                  className="interactive-card group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/8"
                >
                  <div className="flex items-start justify-between">
                    <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-blue-600" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">{solution.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{solution.description}</p>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}

