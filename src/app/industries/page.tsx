import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { industries } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Industries",
  description:
    "HouseOfDev serves healthcare, clinics, hospitals, restaurants, cafes, education, construction, real estate, manufacturing, retail, startups, and enterprises.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Digital systems shaped around how each industry earns trust"
        description="We adapt strategy, content, workflows, SEO, and automation to the buying behavior of your market."
      />
      <section className="bg-white py-20">
        <Container>
          <SectionHeader
            eyebrow="Target Markets"
            title="From local clinics to enterprise teams"
            description="Every industry receives a focused challenge map, solution set, case study angle, and contact path."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/8"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-slate-950">{industry.title}</h2>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-emerald-600" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{industry.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

