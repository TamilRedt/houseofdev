import { ClipboardList, Clock3, FileText, MessageCircle, TrendingUp, Umbrella } from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

const employeeFeatures = [
  ["Attendance Tracking", "Daily attendance logs, work mode, shift data, and manager review", Clock3],
  ["Leave Requests", "Leave applications, approvals, holiday calendars, and policy notes", Umbrella],
  ["Assigned Projects", "Project ownership, milestones, blockers, and delivery status", ClipboardList],
  ["Timesheets and Tasks", "Work logs, tasks, priorities, deadlines, and productivity reporting", FileText],
  ["Documents", "Offer letters, policies, certificates, and employee records", FileText],
  ["Team Communication", "Project channels, notes, meeting summaries, and handoffs", MessageCircle],
  ["Performance Tracking", "Goals, feedback, growth metrics, and review history", TrendingUp],
];

export const metadata = createMetadata({
  title: "Employee Portal",
  description:
    "HouseOfDev employee portal for attendance, leave, projects, timesheets, tasks, documents, communication, and performance tracking.",
  path: "/employee-portal",
});

export default function EmployeePortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Employee Portal"
        title="A focused operations workspace for the HouseOfDev team"
        description="Employee workflows are modeled for attendance, leave, delivery, documentation, communication, and performance visibility."
      />
      <section className="bg-white py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {employeeFeatures.map(([title, description, Icon]) => (
              <div key={String(title)} className="rounded-lg border border-slate-200 p-6 shadow-sm">
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

