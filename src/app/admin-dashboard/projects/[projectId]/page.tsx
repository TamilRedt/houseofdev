import Link from "next/link";
import { ArrowLeft, CalendarDays, CheckCircle2, Users } from "lucide-react";
import { adminAssignEmployee, adminUpdateProject } from "@/app/workspace-actions";
import { AdminMobileHeader, AdminSidebar } from "@/components/admin-dashboard-navigation";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { getAdminWorkspaceData } from "@/lib/admin-workspace";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function date(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

const input = "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default async function AdminProjectWorkspacePage({ params, searchParams }: Props) {
  const [{ projectId }, query, data] = await Promise.all([params, searchParams, getAdminWorkspaceData()]);
  if (data.dashboard.mode !== "live") return <PortalAccessGate dashboard={data.dashboard} />;
  const project = data.projects.find((item) => item.id === projectId);

  return (
    <section className="min-h-[100dvh] bg-slate-100 text-slate-950">
      <div className="mx-auto w-full max-w-[1920px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar dashboard={data.dashboard} />
        <div className="min-w-0">
          <AdminMobileHeader dashboard={data.dashboard} />
          <main className="min-w-0 p-4 sm:p-6 xl:p-8">
            <Link href="/admin-dashboard/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" />Back to projects</Link>
            {!project ? <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-8"><h1 className="text-2xl font-semibold">Project not found</h1><p className="mt-2 text-sm text-slate-500">The project may have been removed or the URL is incorrect.</p></div> : <>
              {first(query?.portal_error) ? <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{first(query?.portal_error)}</div> : null}
              {first(query?.portal_notice) ? <div className="mt-4 flex gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2 className="h-4 w-4 flex-none" />{first(query?.portal_notice)}</div> : null}
              <header className="mt-5 rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 p-6 text-white shadow-xl sm:p-8">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Project workspace</p><h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{project.title}</h1><p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p></div><div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4"><p className="text-xs text-slate-300">Client</p><p className="mt-1 font-semibold">{project.clientName}</p></div></div>
                <div className="mt-7"><div className="mb-2 flex justify-between text-sm font-semibold"><span>Client-visible progress</span><span>{project.progress}%</span></div><div className="h-3 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400" style={{ width: `${project.progress}%` }} /></div></div>
                <div className="mt-6 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-white/10 px-3 py-2 capitalize">{project.status.replaceAll("_", " ")}</span><span className="rounded-full bg-white/10 px-3 py-2"><CalendarDays className="mr-1 inline h-3.5 w-3.5" />Due {date(project.dueDate)}</span><span className="rounded-full bg-white/10 px-3 py-2"><Users className="mr-1 inline h-3.5 w-3.5" />{project.employees.length} employees</span></div>
              </header>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <form action={adminUpdateProject} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <input type="hidden" name="projectId" value={project.id} />
                  <h2 className="text-xl font-semibold">Update client-visible status</h2><p className="mt-2 text-sm leading-6 text-slate-500">Keep this understandable: progress, delivery stage, and expected date.</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="text-sm font-semibold">Progress percentage</span><input className={input} name="progress" type="number" min="0" max="100" defaultValue={project.progress} required /></label><label><span className="text-sm font-semibold">Delivery stage</span><select className={input} name="status" defaultValue={project.status}><option value="new">New</option><option value="reviewing">Planning</option><option value="in_progress">In progress</option><option value="approved">Client review</option><option value="completed">Completed</option><option value="closed">Closed</option></select></label></div>
                  <label className="mt-4 block"><span className="text-sm font-semibold">Expected delivery date</span><input className={input} name="dueDate" type="date" defaultValue={project.dueDate || ""} /></label>
                  <button className="mt-5 min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-blue-700" type="submit">Save project status</button>
                </form>

                <form action={adminAssignEmployee} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <input type="hidden" name="projectId" value={project.id} />
                  <h2 className="text-xl font-semibold">Assign an employee</h2><p className="mt-2 text-sm leading-6 text-slate-500">The employee will see this project and can submit daily progress updates.</p>
                  <label className="mt-5 block"><span className="text-sm font-semibold">Employee</span><select className={input} name="employeeId" required defaultValue=""><option value="" disabled>Select employee</option>{data.employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} — {employee.jobTitle}</option>)}</select></label>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2"><label><span className="text-sm font-semibold">Role in project</span><input className={input} name="roleTitle" placeholder="Frontend developer" required /></label><label><span className="text-sm font-semibold">Assignment due</span><input className={input} name="dueDate" type="date" /></label></div>
                  <button className="mt-5 min-h-11 rounded-xl bg-violet-700 px-5 text-sm font-semibold text-white hover:bg-violet-800" type="submit">Save assignment</button>
                </form>
              </div>

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Assigned delivery team</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{project.employees.length ? project.employees.map((employee) => <div key={employee.id} className="rounded-2xl bg-slate-50 p-4"><p className="font-semibold">{employee.name}</p><p className="mt-1 text-sm text-slate-500">{employee.role}</p></div>) : <p className="text-sm text-slate-500">No employee has been assigned yet.</p>}</div></section>

              <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">Recent employee updates</h2><p className="mt-1 text-sm text-slate-500">Daily reviews shared from the employee portal.</p><div className="mt-5 grid gap-3">{data.recentUpdates.filter((update) => update.projectTitle === project.title).length ? data.recentUpdates.filter((update) => update.projectTitle === project.title).map((update) => <article key={update.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{update.title}</p><span className="text-xs text-slate-500">{update.authorName} · {date(update.createdAt)}</span></div><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{update.body}</p></article>) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No daily update has been submitted yet.</p>}</div></section>
            </>}
          </main>
        </div>
      </div>
    </section>
  );
}
