import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  FolderKanban,
  Inbox,
  ReceiptText,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { createMetadata } from "@/lib/seo";

const controls = [
  ["Manage Users", UsersRound],
  ["Manage Employees", UsersRound],
  ["Manage Clients", ShieldCheck],
  ["Manage Services", Settings2],
  ["Manage Projects", FolderKanban],
  ["Manage Portfolio", BriefcaseBusiness],
  ["Manage Pricing", CreditCard],
  ["Manage Blog", FileText],
  ["Manage Careers", Inbox],
  ["Manage Contact Requests", Inbox],
  ["Manage Invoices", ReceiptText],
  ["Manage Payments", CreditCard],
];

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description:
    "HouseOfDev super admin dashboard for users, employees, clients, services, projects, portfolio, pricing, blog, careers, contacts, invoices, payments, and analytics.",
  path: "/admin-dashboard",
});

export default function AdminDashboardPage() {
  return (
    <>
      <PageHero
        eyebrow="Admin Dashboard"
        title="A super admin control center for the whole business"
        description="The admin architecture is prepared for role-based management, business records, content, finance, analytics, and audit-ready operations."
      />
      <section className="surface-grid bg-slate-50 py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/5">
              <BarChart3 className="h-7 w-7 text-blue-600" />
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">Analytics Dashboard</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Track leads, projects, revenue, support load, employee utilization, campaign activity, and performance KPIs from a single view.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["New Leads", "128"],
                  ["Active Projects", "24"],
                  ["Invoices", "INR 8.4L"],
                  ["Tickets", "17"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-md bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {controls.map(([title, Icon]) => (
                <div key={String(title)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <Icon className="h-5 w-5 text-emerald-600" />
                  <h2 className="mt-4 text-base font-semibold text-slate-950">{title}</h2>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

