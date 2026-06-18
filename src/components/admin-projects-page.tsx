import Link from "next/link";
import { AlertTriangle, ArrowRight, CircleCheckBig, Filter, FolderKanban, ShieldCheck, Users } from "lucide-react";
import { ProjectProgressChart } from "@/components/admin-analytics-charts";
import { AdminMobileHeader, AdminSidebar } from "@/components/admin-dashboard-navigation";
import { AdminProjectCreateForm } from "@/components/admin-project-create-form";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { getAdminWorkspaceData } from "@/lib/admin-workspace";
import { reviewProjectHealth } from "@/lib/project-health";

function date(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value.includes("complete") || value.includes("approved")) return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (value.includes("progress") || value.includes("active") || value.includes("review")) return "border-blue-200 bg-blue-50 text-blue-700";
  if (value.includes("pending") || value.includes("new") || value.includes("draft")) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function healthClass(key: string) {
  if (key === "completed" || key === "healthy") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (key === "attention") return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-red-200 bg-red-50 text-red-700";
}

export async function AdminProjectsPage({ clientId, employeeId }: { clientId?: string; employeeId?: string }) {
  const data = await getAdminWorkspaceData();
  if (data.dashboard.mode !== "live") return <PortalAccessGate dashboard={data.dashboard} />;

  const selectedClient = clientId ? data.clients.find((client) => client.id === clientId) : null;
  const selectedEmployee = employeeId ? data.employees.find((employee) => employee.id === employeeId) : null;
  const projects = data.projects.filter((project) => {
    if (clientId && project.clientId !== clientId) return false;
    if (employeeId && !project.employees.some((employee) => employee.id === employeeId)) return false;
    return true;
  });

  const filterLabel = selectedClient
    ? `Client: ${selectedClient.company}`
    : selectedEmployee
      ? `Employee: ${selectedEmployee.name}`
      : null;

  return (
    <section className="min-h-[100dvh] bg-slate-100 text-slate-950">
      <div className="mx-auto w-full max-w-[1920px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar dashboard={data.dashboard} />
        <div className="min-w-0">
          <AdminMobileHeader dashboard={data.dashboard} />
          <main className="min-w-0 p-4 sm:p-6 xl:p-8">
            <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-4xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Delivery pipeline</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Project development control</h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">Create projects without Supabase, connect clients and employees, and review delivery health automatically.</p>
                </div>
                <Link href="/admin-dashboard/projects" className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                  <FolderKanban className="h-4 w-4" /> All projects
                </Link>
              </div>
            </header>

            <AdminProjectCreateForm clients={data.clients} employees={data.employees} />

            {filterLabel ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <span className="inline-flex items-center gap-2 font-semibold"><Filter className="h-4 w-4" />Showing {filterLabel}</span>
                <Link href="/admin-dashboard/projects" className="font-bold underline underline-offset-4">Clear filter</Link>
              </div>
            ) : null}

            <div className="mt-6"><ProjectProgressChart projects={projects} /></div>

            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {projects.length ? projects.map((project) => {
                const health = reviewProjectHealth({
                  status: project.status,
                  progress: project.progress,
                  dueDate: project.dueDate,
                  openTasks: project.openTasks,
                  employeeCount: project.employees.length,
                  updateCount: project.updateCount,
                  lastUpdateAt: null,
                });
                const HealthIcon = health.key === "healthy" || health.key === "completed" ? CircleCheckBig : health.key === "attention" ? AlertTriangle : ShieldCheck;

                return (
                  <article key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0"><h2 className="truncate text-lg font-semibold text-slate-950">{project.title}</h2><p className="mt-1 text-sm text-slate-500">{project.clientName}</p></div>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${statusClass(project.status)}`}>{project.status.replaceAll("_", " ")}</span>
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{project.description}</p>
                    <div className={`mt-4 rounded-2xl border p-4 ${healthClass(health.key)}`}>
                      <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-sm font-bold"><HealthIcon className="h-4 w-4" />{health.label}</span><span className="text-sm font-black">{health.score}/100</span></div>
                      <p className="mt-2 text-xs leading-5">{health.reasons[0]}</p>
                    </div>
                    <div className="mt-5"><div className="mb-2 flex justify-between text-xs font-bold text-slate-600"><span>Development progress</span><span>{project.progress}%</span></div><div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" style={{ width: `${project.progress}%` }} /></div></div>
                    <div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Employees</p><p className="mt-1 text-lg font-bold">{project.employees.length}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Open tasks</p><p className="mt-1 text-lg font-bold">{project.openTasks}</p></div><div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Updates</p><p className="mt-1 text-lg font-bold">{project.updateCount}</p></div></div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500"><span className="rounded-full bg-slate-100 px-3 py-1.5">Due {date(project.dueDate)}</span>{project.employees.map((employee) => <span key={employee.id} className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700"><Users className="mr-1 inline h-3 w-3" />{employee.name} · {employee.role}</span>)}</div>
                    <Link href={`/admin-dashboard/projects/${project.id}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-blue-700">Open project workspace <ArrowRight className="h-4 w-4" /></Link>
                  </article>
                );
              }) : (
                <div className="xl:col-span-2 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><FolderKanban className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-4 text-lg font-semibold">No matching projects</h2><p className="mt-2 text-sm text-slate-500">Create a project above or clear the current client/employee filter.</p></div>
              )}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}
