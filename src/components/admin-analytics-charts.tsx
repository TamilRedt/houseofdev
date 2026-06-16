import type { AdminProjectRecord, MonthPoint } from "@/lib/admin-workspace";

function money(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, notation: "compact" }).format(value);
}

export function LoginActivityChart({ months }: { months: MonthPoint[] }) {
  const max = Math.max(1, ...months.flatMap((month) => [month.clients, month.employees]));
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Portal usage</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Client and employee logins</h2><p className="mt-1 text-sm text-slate-500">Successful sign-ins across the last six months.</p></div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-cyan-500" />Clients</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-violet-500" />Employees</span></div>
      </div>
      <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 sm:gap-5" aria-label="Login activity chart">
        {months.map((month) => (
          <div key={month.label} className="flex h-full min-w-0 flex-col items-center justify-end gap-2">
            <div className="flex h-[180px] w-full max-w-14 items-end justify-center gap-1.5 rounded-2xl bg-slate-50 px-2 py-2">
              <div title={`${month.clients} client logins`} className="w-1/2 rounded-t-md bg-gradient-to-t from-cyan-600 to-cyan-300 transition hover:brightness-110" style={{ height: `${Math.max(month.clients ? 8 : 2, (month.clients / max) * 100)}%` }} />
              <div title={`${month.employees} employee logins`} className="w-1/2 rounded-t-md bg-gradient-to-t from-violet-700 to-violet-400 transition hover:brightness-110" style={{ height: `${Math.max(month.employees ? 8 : 2, (month.employees / max) * 100)}%` }} />
            </div>
            <span className="text-xs font-semibold text-slate-500">{month.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinanceTrendChart({ months }: { months: MonthPoint[] }) {
  const max = Math.max(1, ...months.flatMap((month) => [month.income, month.invoiced]));
  const points = (key: "income" | "invoiced") => months.map((month, index) => `${index * 100 + 20},${190 - (month[key] / max) * 150}`).join(" ");
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Cash flow</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Income versus invoiced</h2><p className="mt-1 text-sm text-slate-500">Paid collections and invoices raised over six months.</p></div><div className="text-right"><p className="text-xs text-slate-500">Collected</p><p className="text-lg font-bold text-emerald-700">{money(months.reduce((sum, item) => sum + item.income, 0))}</p></div></div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950 p-3 sm:p-5">
        <svg viewBox="0 0 540 230" className="h-auto w-full" role="img" aria-label="Income and invoiced line chart">
          {[40, 90, 140, 190].map((y) => <line key={y} x1="20" x2="520" y1={y} y2={y} stroke="#334155" strokeDasharray="4 6" />)}
          <polyline points={points("invoiced")} fill="none" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={points("income")} fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {months.map((month, index) => <text key={month.label} x={index * 100 + 20} y="218" textAnchor="middle" fill="#94a3b8" fontSize="12">{month.label}</text>)}
        </svg>
      </div>
      <div className="mt-4 flex gap-5 text-xs font-semibold text-slate-600"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Income</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-blue-400" />Invoiced</span></div>
    </section>
  );
}

export function ProjectProgressChart({ projects }: { projects: AdminProjectRecord[] }) {
  const visible = [...projects].sort((a, b) => b.progress - a.progress).slice(0, 6);
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Delivery health</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Project development progress</h2><p className="mt-1 text-sm text-slate-500">A clear view of delivery progress, not technical noise.</p></div>
      <div className="mt-7 grid gap-5">
        {visible.length ? visible.map((project) => (
          <div key={project.id}>
            <div className="mb-2 flex items-center justify-between gap-4"><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{project.title}</p><p className="truncate text-xs text-slate-500">{project.clientName}</p></div><span className="text-sm font-bold text-slate-900">{project.progress}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" style={{ width: `${project.progress}%` }} /></div>
          </div>
        )) : <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">Project progress will appear after the first project is created.</p>}
      </div>
    </section>
  );
}
