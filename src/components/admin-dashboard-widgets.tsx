import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FolderKanban,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { PortalDashboardData, PortalStat, PortalTable } from "@/lib/portal";

function getStatusTone(value: string) {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("paid") ||
    normalized.includes("complete") ||
    normalized.includes("approved") ||
    normalized.includes("success") ||
    normalized.includes("active") ||
    normalized.includes("protected") ||
    normalized.includes("connected")
  ) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("processing") ||
    normalized.includes("warning")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (
    normalized.includes("new") ||
    normalized.includes("open") ||
    normalized.includes("progress") ||
    normalized.includes("created")
  ) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (normalized.includes("fail") || normalized.includes("closed") || normalized.includes("delete")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function isStatusColumn(column: string) {
  const normalized = column.toLowerCase();
  return (
    normalized.includes("status") ||
    normalized.includes("stage") ||
    normalized.includes("signal") ||
    normalized.includes("state")
  );
}

export function AdminStatusPill({ value }: { value: string }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-xs font-semibold ${getStatusTone(value)}`}>
      {value}
    </span>
  );
}

const metricIcons = [CalendarDays, Users, FolderKanban, CircleDollarSign];
const metricTones = [
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-violet-50 text-violet-700",
  "bg-amber-50 text-amber-700",
];

export function AdminMetricCard({ stat, index }: { stat: PortalStat; index: number }) {
  const Icon = metricIcons[index] || Activity;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-11 w-11 flex-none place-items-center rounded-xl ${metricTones[index] || metricTones[0]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          Live
        </span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.helper}</p>
    </article>
  );
}

export function AdminDataTable({ table }: { table: PortalTable }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{table.title}</h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">{table.description}</p>
        </div>
        <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">
          {table.rows.length} records
        </span>
      </div>

      {table.rows.length ? (
        <>
          <div className="grid gap-3 p-4 md:hidden">
            {table.rows.map((row, rowIndex) => (
              <article key={`${table.title}-mobile-${rowIndex}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-950">{row[0]}</p>
                    <dl className="mt-4 grid gap-3">
                      {row.slice(1).map((cell, cellIndex) => {
                        const column = table.columns[cellIndex + 1];
                        return (
                          <div key={`${table.title}-${rowIndex}-${column}`} className="flex items-start justify-between gap-4">
                            <dt className="text-xs font-medium text-slate-500">{column}</dt>
                            <dd className="max-w-[68%] break-words text-right text-sm text-slate-700">
                              {isStatusColumn(column) ? <AdminStatusPill value={cell} /> : cell}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
                <tr>
                  {table.columns.map((column) => (
                    <th key={column} className="px-5 py-3.5">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {table.rows.map((row, rowIndex) => (
                  <tr key={`${table.title}-${rowIndex}`} className="transition hover:bg-slate-50/80">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={`${table.title}-${rowIndex}-${cellIndex}`}
                        className={cellIndex === 0 ? "px-5 py-4 font-semibold text-slate-950" : "px-5 py-4 text-slate-600"}
                      >
                        {cellIndex === 0 ? (
                          <span className="inline-flex items-center gap-3">
                            <span className="h-2.5 w-2.5 flex-none rounded-full bg-emerald-500" />
                            {cell}
                          </span>
                        ) : isStatusColumn(table.columns[cellIndex] || "") ? (
                          <AdminStatusPill value={cell} />
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="p-6 text-sm text-slate-500">{table.emptyText}</div>
      )}
    </section>
  );
}

export function AdminActivityFeed({ tables }: { tables: PortalTable[] }) {
  const activity = tables
    .flatMap((table) => {
      const statusIndex = table.columns.findIndex(isStatusColumn);

      return table.rows.slice(0, 3).map((row) => ({
        title: row[0] || table.title,
        meta: `${table.title} · ${row[1] || "Record"}`,
        status: statusIndex >= 0 ? row[statusIndex] : "Recorded",
      }));
    })
    .slice(0, 6);

  return (
    <section id="reports" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Recent activity</h2>
          <p className="mt-1 text-sm text-slate-500">Latest signals across operations.</p>
        </div>
        <Activity className="h-5 w-5 text-blue-600" />
      </div>
      <div className="mt-5 grid gap-5">
        {activity.length ? (
          activity.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex gap-3">
              <div className="mt-1.5 h-2.5 w-2.5 flex-none rounded-full bg-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="break-words text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 break-words text-xs leading-5 text-slate-500">{item.meta}</p>
                <div className="mt-2">
                  <AdminStatusPill value={item.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-slate-500">No operational activity has been recorded yet.</p>
        )}
      </div>
    </section>
  );
}

export function AdminSystemHealth({ dashboard }: { dashboard: PortalDashboardData }) {
  const systems = [
    ["Authentication", "Active"],
    ["Role access", "Protected"],
    ["Database", dashboard.backendConfigured ? "Connected" : "Setup needed"],
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">System health</h2>
          <p className="mt-1 text-sm text-slate-500">Core workspace services.</p>
        </div>
        <ShieldCheck className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="mt-5 grid gap-3">
        {systems.map(([label, value]) => {
          const healthy = value !== "Setup needed";
          return (
            <div key={label} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <span className="text-sm font-medium text-slate-600">{label}</span>
              <span className={`inline-flex items-center gap-2 text-sm font-semibold ${healthy ? "text-emerald-700" : "text-amber-700"}`}>
                {healthy ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
