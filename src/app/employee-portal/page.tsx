import { 
  BriefcaseBusiness, 
  Calendar, 
  Clock, 
  FileText, 
  Fingerprint, 
  Network 
} from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

// Explicitly type the tuple array: [title, description, Icon component]
const cards: [string, string, React.ComponentType<{ className?: string }>][] = [
  ["Task Tracking", "View assigned tasks, update project progression, and log development sprints.", BriefcaseBusiness],
  ["Time Logging", "Submit daily worksheets, manage clock-in events, and log active work sessions.", Clock],
  ["Leave Management", "Submit time-off requests, view holiday schedules, and track remaining balance.", Calendar],
  ["Pay Slips", "Access historical payroll receipts, tax breakdowns, and year-end compensation sheets.", FileText],
  ["Org Directory", "Navigate company hierarchy structural mappings and locate employee profiles.", Network],
  ["Identity Access", "Manage authorization authentications, SSH profile keys, and system permissions.", Fingerprint]
];

export const metadata = createMetadata({
  title: "Employee Portal",
  description: "Internal workspace for HouseOfDev team operations, task logging, and business systems.",
  path: "/employee-portal",
});

export default function EmployeePortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Employee Workspace"
        title="Internal dashboard portal for your daily operations"
        description="Access structural resources, log development timelines, review performance schedules, and coordinate team workflows seamlessly."
      />
      <section className="bg-slate-50 py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(([title, description, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <Icon className="h-6 w-6 text-emerald-600" />
                <h2 className="mt-5 text-xl font-semibold text-slate-950">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
