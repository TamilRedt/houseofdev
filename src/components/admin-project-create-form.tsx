import { FolderPlus, Sparkles } from "lucide-react";
import { adminCreateProject } from "@/app/workspace-actions";
import type { AdminClientRecord, AdminEmployeeRecord } from "@/lib/admin-workspace";

const input =
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function AdminProjectCreateForm({
  clients,
  employees,
}: {
  clients: AdminClientRecord[];
  employees: AdminEmployeeRecord[];
}) {
  return (
    <details className="group mt-6 overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-sm" open={!clients.length ? false : undefined}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-violet-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-slate-950 text-white">
            <FolderPlus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Create and assign a project</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Connect the client, add initial status, and optionally assign the first employee in one step.</p>
          </div>
        </div>
        <span className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 group-open:bg-blue-700 group-open:text-white">Open form</span>
      </summary>

      <form action={adminCreateProject} className="p-5 sm:p-6">
        {!clients.length ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Create a business or individual client credential first. A project cannot be client-visible without a client account.
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-semibold text-slate-700">
            Client
            <select className={input} name="clientId" required defaultValue="" disabled={!clients.length}>
              <option value="" disabled>Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.company} — {client.name}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700 md:col-span-2">
            Project title
            <input className={input} name="title" required placeholder="Example: Sudersan Clinic Website" />
          </label>

          <label className="text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-3">
            Description
            <textarea className={`${input} min-h-28 resize-y py-3`} name="description" placeholder="Scope, expected outcome, and important client requirements" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Delivery stage
            <select className={input} name="status" defaultValue="new">
              <option value="new">New</option>
              <option value="reviewing">Planning</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Progress
            <input className={input} name="progress" type="number" min="0" max="100" defaultValue="0" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Budget (INR)
            <input className={input} name="budget" type="number" min="0" step="1" placeholder="15000" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Start date
            <input className={input} name="startDate" type="date" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Expected delivery
            <input className={input} name="dueDate" type="date" />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            First employee (optional)
            <select className={input} name="employeeId" defaultValue="">
              <option value="">Assign later</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>{employee.name} — {employee.jobTitle}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-3">
            Employee role in project
            <input className={input} name="roleTitle" placeholder="Frontend developer, Project manager, QA tester..." />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 text-xs leading-5 text-slate-500"><Sparkles className="h-4 w-4 text-violet-600" />The client sees the project immediately after it is created.</p>
          <button disabled={!clients.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50" type="submit">
            <FolderPlus className="h-4 w-4" /> Create project
          </button>
        </div>
      </form>
    </details>
  );
}
