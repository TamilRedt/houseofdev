import { BriefcaseBusiness, FileCheck2 } from "lucide-react";
import { CareerForm } from "@/components/career-form";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { jobs } from "@/lib/data";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Careers",
  description:
    "Apply for HouseOfDev jobs and internships in frontend development, full stack development, and digital growth.",
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Join a team building premium digital systems for real businesses"
        description="Explore current roles, internships, and application tracking designed for a growing agency team."
      />
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">Open roles and internships</h2>
              <div className="mt-8 grid gap-4">
                {jobs.map((job) => (
                  <div key={job.title} className="rounded-lg border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <BriefcaseBusiness className="mt-1 h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-950">{job.title}</h3>
                        <p className="mt-1 text-sm font-medium text-emerald-700">
                          {job.type} / {job.location}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{job.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                <h3 className="mt-3 font-semibold text-slate-950">Application Tracking</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Applications are stored with status fields in Supabase, ready for admin review, resume tracking, and candidate communication.
                </p>
              </div>
            </div>
            <CareerForm />
          </div>
        </Container>
      </section>
    </>
  );
}

