import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CircleDollarSign,
  Download,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  Users,
  UserRoundCog,
} from "lucide-react";
import { AdminCredentialManager } from "@/components/admin-credential-manager";
import { FinanceTrendChart, LoginActivityChart, ProjectProgressChart } from "@/components/admin-analytics-charts";
import { AdminMobileHeader, AdminSidebar } from "@/components/admin-dashboard-navigation";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { getAdminWorkspaceData, type AdminWorkspaceData } from "@/lib/admin-workspace";

export type AdminSection = "home" | "clients" | "employees" | "projects" | "finance" | "upcoming" | "reports" | "access";

const sectionCopy: Record<AdminSection, { eyebrow: string; title: string; description: string }> = {
  home: { eyebrow: "Operations overview", title: "Good decisions start with a clear dashboard.", description: "See the business signal first, then open the page where the work is managed." },
  clients: { eyebrow: "Client operations", title: "Clients and portal engagement", description: "Understand who is active, which projects belong to them, and where payment or delivery needs attention." },
  employees: { eyebrow: "Delivery team", title: "Employees, assignments, and reviews", description: "See workload, project participation, task pressure, daily updates, and client or admin review signals." },
  projects: { eyebrow: "Delivery pipeline", title: "Project development control", description: "Track every client project, assigned employee, progress percentage, task load, and daily update history." },
  finance: { eyebrow: "Business finance", title: "Income and billing", description: "Compare income with invoices, identify pending amounts, and understand recent monthly movement." },
  upcoming: { eyebrow: "Forward planning", title: "Upcoming projects and deadlines", description: "Focus on incomplete work with the nearest delivery dates before it becomes urgent." },
  reports: { eyebrow: "Management reports", title: "Business performance reports", description: "Review portal usage, delivery progress, client activity, and finance from one reporting screen." },
  access: { eyebrow: "Identity and access", title: "Portal access management", description: "Create, update, or remove client and employee access without mixing credentials into daily operations." },
};

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
}

function date(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function dateTime(value: string | null) {
  if (!value) return "No login recorded";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes("complete") || value.includes("paid") || value.includes("approved")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value.includes("progress") || value.includes("active") || value.includes("review")) return "border-blue-200 bg-blue-50 text-blue-700";
  if (value.includes("pending") || value.includes("new") || value.includes("draft")) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function MetricCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: typeof Users }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white"><Icon className="h-5 w-5" /></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">Live</span></div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </article>
  );
}

const quickActions = [
  { href: "/admin-dashboard/clients", label: "Clients", detail: "Accounts, activity, projects and pending value", icon: Users },
  { href: "/admin-dashboard/employees", label: "Employees", detail: "Assignments, tasks, updates and reviews", icon: UserRoundCog },
  { href: "/admin-dashboard/projects", label: "Projects", detail: "Progress, ownership, deadlines and updates", icon: FolderKanban },
  { href: "/admin-dashboard/finance", label: "Finance", detail: "Income, invoices and pending collections", icon: CircleDollarSign },
  { href: "/admin-dashboard/upcoming", label: "Upcoming", detail: "Nearest project deadlines and attention points", icon: CalendarClock },
  { href: "/admin-dashboard/access", label: "Access", detail: "Create and manage portal credentials", icon: KeyRound },
];

function HomeSection({ data }: { data: AdminWorkspaceData }) {
  const openProjects = data.projects.filter((project) => !["completed", "closed"].includes(project.status.toLowerCase()));
  const pending = data.invoices.filter((invoice) => !["paid", "closed", "completed"].includes(invoice.status.toLowerCase())).reduce((sum, invoice) => sum + invoice.amount, 0);
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Clients" value={String(data.clients.length)} helper={`${data.clients.filter((client) => client.activeProjects > 0).length} with active projects`} icon={Users} />
        <MetricCard label="Employees" value={String(data.employees.length)} helper={`${data.employees.reduce((sum, employee) => sum + employee.openTasks, 0)} open tasks`} icon={UserRoundCog} />
        <MetricCard label="Active projects" value={String(openProjects.length)} helper={`${data.projects.reduce((sum, project) => sum + project.updateCount, 0)} team updates recorded`} icon={FolderKanban} />
        <MetricCard label="Pending value" value={money(pending)} helper={`${data.invoices.filter((invoice) => !["paid", "closed", "completed"].includes(invoice.status.toLowerCase())).length} invoices need attention`} icon={CircleDollarSign} />
      </div>
      <section className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-6 text-white shadow-xl sm:p-8">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Choose a workspace</p><h2 className="mt-3 text-2xl font-semibold sm:text-3xl">The home page shows the signal. Each button opens the place where the work actually happens.</h2></div>
        <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => { const Icon = action.icon; return <Link key={action.href} href={action.href} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-white/10"><div className="flex items-start justify-between gap-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Icon className="h-5 w-5" /></span><ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></div><h3 className="mt-4 font-semibold">{action.label}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{action.detail}</p></Link>; })}
        </div>
      </section>
      <div className="mt-6 grid gap-6 2xl:grid-cols-2"><LoginActivityChart months={data.months} /><ProjectProgressChart projects={data.projects} /></div>
    </>
  );
}

function ClientsSection({ data }: { data: AdminWorkspaceData }) {
  return <><LoginActivityChart months={data.months} /><div className="mt-6 grid gap-4 xl:grid-cols-2">{data.clients.length ? data.clients.map((client) => <article key={client.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">{client.company}</h2><p className="mt-1 text-sm text-slate-500">{client.name} · {client.email}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{client.activeProjects} active</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Pending amount</p><p className="mt-1 font-bold text-slate-950">{money(client.pendingAmount)}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">Last login</p><p className="mt-1 text-sm font-bold text-slate-950">{dateTime(client.lastLogin)}</p></div></div><Link href={`/admin-dashboard/projects?client=${client.id}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-blue-700">Open client projects <ArrowRight className="h-4 w-4" /></Link></article>) : <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">Client records will appear after client access is created.</p>}</div></>;
}

function EmployeesSection({ data }: { data: AdminWorkspaceData }) {
  return <><LoginActivityChart months={data.months} /><div className="mt-6 grid gap-4 xl:grid-cols-2">{data.employees.length ? data.employees.map((employee) => <article key={employee.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">{employee.name}</h2><p className="mt-1 text-sm text-slate-500">{employee.jobTitle} · {employee.department}</p><p className="mt-1 text-xs text-slate-400">{employee.email}</p></div><span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{employee.rating ? `${employee.rating.toFixed(1)}/5` : "No review"}</span></div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Projects</p><p className="mt-1 text-xl font-bold">{employee.activeProjects}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Open tasks</p><p className="mt-1 text-xl font-bold">{employee.openTasks}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Updates</p><p className="mt-1 text-xl font-bold">{employee.updateCount}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Last login</p><p className="mt-1 text-xs font-bold leading-5">{dateTime(employee.lastLogin)}</p></div></div><Link href={`/admin-dashboard/projects?employee=${employee.id}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-violet-700">See assigned projects <ArrowRight className="h-4 w-4" /></Link></article>) : <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">Employee records will appear after employee access is created.</p>}</div></>;
}

function ProjectsSection({ data, upcoming = false }: { data: AdminWorkspaceData; upcoming?: boolean }) {
  const now = Date.now();
  const projects = upcoming ? data.projects.filter((project) => project.dueDate && new Date(project.dueDate).getTime() >= now && !["completed", "closed"].includes(project.status.toLowerCase())).sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()) : data.projects;
  return <><ProjectProgressChart projects={projects} /><div className="mt-6 grid gap-4 xl:grid-cols-2">{projects.length ? projects.map((project) => <article key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h2 className="truncate text-lg font-semibold text-slate-950">{project.title}</h2><p className="mt-1 text-sm text-slate-500">{project.clientName}</p></div><span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(project.status)}`}>{project.status.replaceAll("_", " ")}</span></div><p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{project.description}</p><div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold text-slate-600"><span>Development progress</span><span>{project.progress}%</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" style={{ width: `${project.progress}%` }} /></div></div><div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Employees</p><p className="mt-1 text-lg font-bold">{project.employees.length}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Open tasks</p><p className="mt-1 text-lg font-bold">{project.openTasks}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Updates</p><p className="mt-1 text-lg font-bold">{project.updateCount}</p></div></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5">Due {date(project.dueDate)}</span>{project.employees.map((employee) => <span key={employee.id} className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">{employee.name} · {employee.role}</span>)}</div><Link href={`/admin-dashboard/projects/${project.id}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-blue-700">Open project workspace <ArrowRight className="h-4 w-4" /></Link></article>) : <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">No matching projects are available.</p>}</div></>;
}

function FinanceSection({ data }: { data: AdminWorkspaceData }) {
  return <><FinanceTrendChart months={data.months} /><section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 p-5"><h2 className="text-xl font-semibold text-slate-950">Invoices</h2><p className="mt-1 text-sm text-slate-500">Billing records connected to client projects.</p></div><div className="divide-y divide-slate-100">{data.invoices.length ? data.invoices.map((invoice) => <div key={invoice.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"><div><p className="font-semibold text-slate-950">{invoice.number} · {invoice.clientName}</p><p className="mt-1 text-sm text-slate-500">{invoice.projectTitle} · Due {date(invoice.dueDate)}</p></div><span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(invoice.status)}`}>{invoice.status}</span><p className="font-bold text-slate-950">{money(invoice.amount)}</p></div>) : <p className="p-8 text-sm text-slate-500">No invoices have been created.</p>}</div></section></>;
}

function ReportsSection({ data }: { data: AdminWorkspaceData }) {
  return <><div className="grid gap-6 2xl:grid-cols-2"><LoginActivityChart months={data.months} /><FinanceTrendChart months={data.months} /></div><div className="mt-6 grid gap-6 2xl:grid-cols-2"><ProjectProgressChart projects={data.projects} /><section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Export</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Management report</h2><p className="mt-2 text-sm leading-6 text-slate-500">Download a CSV containing current client, employee, project, invoice, and portal activity summaries.</p><a href="/api/admin/report" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-blue-700"><Download className="h-4 w-4" />Download report</a></section></div></>;
}

export async function AdminWorkspacePage({ section }: { section: AdminSection }) {
  const data = await getAdminWorkspaceData();
  if (data.dashboard.mode !== "live") return <PortalAccessGate dashboard={data.dashboard} />;
  const copy = sectionCopy[section];
  return (
    <section className="min-h-[100dvh] bg-slate-100 text-slate-950"><div className="mx-auto w-full max-w-[1920px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]"><AdminSidebar dashboard={data.dashboard} /><div className="min-w-0"><AdminMobileHeader dashboard={data.dashboard} /><main className="min-w-0 p-4 sm:p-6 xl:p-8"><header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between"><div className="max-w-4xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">{copy.eyebrow}</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{copy.title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{copy.description}</p></div><div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" />Supabase live</div></div></header>{data.notices.length ? <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Some data sources reported: {Array.from(new Set(data.notices)).join(" · ")}</div> : null}<div className="mt-6">{section === "home" ? <HomeSection data={data} /> : null}{section === "clients" ? <ClientsSection data={data} /> : null}{section === "employees" ? <EmployeesSection data={data} /> : null}{section === "projects" ? <ProjectsSection data={data} /> : null}{section === "upcoming" ? <ProjectsSection data={data} upcoming /> : null}{section === "finance" ? <FinanceSection data={data} /> : null}{section === "reports" ? <ReportsSection data={data} /> : null}{section === "access" ? <AdminCredentialManager requests={data.dashboard.credentialRequests} users={data.dashboard.credentialUsers} canCreateAdmin={data.dashboard.profile?.role === "super_admin"} /> : null}</div></main></div></div></section>
  );
}
