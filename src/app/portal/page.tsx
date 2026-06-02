import { CalendarDays, FileDown, FolderKanban, LifeBuoy, LockKeyhole, MessageSquareText } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

const features = [
  ["Login and Register", "Supabase Auth-ready sign-in and onboarding flows", LockKeyhole],
  ["Project Tracking", "Milestones, status, deliverables, and project notes", FolderKanban],
  ["Invoice Download", "Secure invoice history and payment references", FileDown],
  ["File Sharing", "Client assets, approvals, and project handoff files", MessageSquareText],
  ["Support Tickets", "Issue tracking with priority, status, and audit history", LifeBuoy],
  ["Meeting Scheduling", "Consultation, review, and launch meeting coordination", CalendarDays],
];

export const metadata = createMetadata({
  title: "Client Portal",
  description:
    "HouseOfDev client portal for login, registration, project tracking, invoices, files, support tickets, meetings, and communication.",
  path: "/portal",
});

export default function PortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Client Portal"
        title="A secure client workspace for every project relationship"
        description="Business clients and individual clients can track projects, download invoices, share files, manage support, and communicate with the HouseOfDev team."
      >
        <ButtonLink href="/contact" variant="light">
          Request Portal Access
        </ButtonLink>
      </PageHero>
      <section className="premium-gradient py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map(([title, description, Icon]) => (
              <div key={String(title)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
                <Icon className="h-6 w-6 text-blue-600" />
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600">Roles</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {["Super Admin", "Admin", "Employee", "Business Client", "Individual Client"].map((role) => (
                <div key={role} className="rounded-md bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  {role}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

