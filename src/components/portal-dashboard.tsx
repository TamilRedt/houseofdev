import {
  Activity,
  AlertTriangle,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Container } from "@/components/container";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { PortalAuthPanel } from "@/components/portal-auth-panel";
import { getPortalRoleLabel } from "@/lib/portal";
import type { PortalDashboardData, PortalKind, PortalStat, PortalTable } from "@/lib/portal";

type PortalDashboardProps = {
  dashboard: PortalDashboardData;
  authError?: string;
  authNotice?: string;
};

const portalIcons: Record<PortalKind, typeof Building2> = {
  client: Building2,
  employee: BriefcaseBusiness,
  admin: LayoutDashboard,
};

function modeLabel(mode: PortalDashboardData["mode"]) {
  if (mode === "live") {
    return "Live";
  }

  if (mode === "signed_out") {
    return "Login Required";
  }

  if (mode === "unauthorized") {
    return "Access Restricted";
  }

  if (mode === "error") {
    return "Backend Warning";
  }

  return "Setup Required";
}

function getStatusTone(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("paid") || normalized.includes("complete") || normalized.includes("approved")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized.includes("review") || normalized.includes("pending") || normalized.includes("processing")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalized.includes("new") || normalized.includes("open") || normalized.includes("progress")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function StatusPill({ value }: { value: string }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-3 text-xs font-semibold ${getStatusTone(value)}`}>
      {value}
    </span>
  );
}

function DataTable({ table }: { table: PortalTable }) {
  return (
    <div className="interactive-card rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-950">{table.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{table.description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {table.columns.map((column) => (
                <th key={column} className="px-5 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.rows.length ? (
              table.rows.map((row, index) => (
                <tr key={`${table.title}-${index}`} className="hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${table.title}-${index}-${cellIndex}`}
                      className={cellIndex === 0 ? "px-5 py-4 font-semibold text-slate-950" : "px-5 py-4 text-slate-600"}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-6 text-slate-500" colSpan={table.columns.length}>
                  {table.emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Leads", icon: UserPlus },
  { label: "Clients", icon: Users },
  { label: "Projects", icon: FolderKanban },
  { label: "Finance", icon: CircleDollarSign },
  { label: "Support", icon: MessageSquare },
  { label: "Reports", icon: FileText },
];

const adminMetricIcons = [CalendarDays, Users, FolderKanban, CircleDollarSign];
const adminMetricTones = [
  "bg-blue-50 text-blue-700",
  "bg-emerald-50 text-emerald-700",
  "bg-violet-50 text-violet-700",
  "bg-amber-50 text-amber-700",
];

function AdminMetricCard({ stat, index }: { stat: PortalStat; index: number }) {
  const Icon = adminMetricIcons[index] || Activity;

  return (
    <div className="interactive-card rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="flex items-start justify-between gap-4">
        <div className={`grid h-10 w-10 flex-none place-items-center rounded-lg ${adminMetricTones[index] || adminMetricTones[0]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{stat.label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{stat.value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{stat.helper}</p>
    </div>
  );
}

function AdminDataTable({ table }: { table: PortalTable }) {
  return (
    <div className="interactive-card overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{table.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{table.description}</p>
        </div>
        <span className="inline-flex min-h-8 w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600">
          {table.rows.length} records
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-100 text-xs font-semibold text-slate-600">
            <tr>
              {table.columns.map((column) => (
                <th key={column} className="px-5 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.rows.length ? (
              table.rows.map((row, index) => (
                <tr key={`${table.title}-${index}`} className="transition hover:bg-slate-50">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${table.title}-${index}-${cellIndex}`}
                      className={cellIndex === 0 ? "px-5 py-4 font-semibold text-slate-950" : "px-5 py-4 text-slate-600"}
                    >
                      {cellIndex === 0 ? (
                        <span className="inline-flex items-center gap-3">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                          {cell}
                        </span>
                      ) : cellIndex === row.length - 1 ? (
                        <StatusPill value={cell} />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-5 py-6 text-slate-500" colSpan={table.columns.length}>
                  {table.emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminActivityFeed({ tables }: { tables: PortalTable[] }) {
  const activity = tables
    .flatMap((table) =>
      table.rows.slice(0, 3).map((row) => ({
        title: row[0] || table.title,
        meta: `${table.title} / ${row[1] || "Record"}`,
        status: row[row.length - 1] || "New",
      })),
    )
    .slice(0, 6);

  return (
    <div className="interactive-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-950">Activity Feed</h2>
        <Activity className="h-5 w-5 text-blue-600" />
      </div>
      <div className="mt-5 grid gap-4">
        {activity.length ? (
          activity.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-blue-600" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.meta}</p>
                <div className="mt-2">
                  <StatusPill value={item.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-slate-500">No operational activity has been recorded yet.</p>
        )}
      </div>
    </div>
  );
}

function AdminCommandCenter({ dashboard, authError }: PortalDashboardProps) {
  const profileInitial = dashboard.profile?.fullName?.trim().charAt(0).toUpperCase() || "H";
  const roleLabel = dashboard.profile ? getPortalRoleLabel(dashboard.profile.role) : "Admin";
  const today = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="bg-[#eef0f3] py-6 text-slate-950">
      <Container>
        {dashboard.notices.length ? (
          <div className="mb-5 grid gap-3">
            {dashboard.notices.map((notice) => (
              <div key={notice} className="interactive-card rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <div className="flex gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                  <p>{notice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[244px_minmax(0,1fr)_340px]">
          <aside className="h-fit rounded-lg bg-white p-3 shadow-sm">
            <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                {profileInitial}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{dashboard.profile?.fullName || "HouseOfDev"}</p>
                <p className="mt-1 text-xs text-slate-500">{roleLabel}</p>
              </div>
            </div>

            <nav className="mt-4 grid gap-1" aria-label="Admin dashboard">
              {adminNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold ${
                      item.active ? "bg-slate-950 text-white" : "text-slate-600"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </div>
                );
              })}
            </nav>

            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <p className="text-sm font-semibold text-slate-950">HouseOfDev OS</p>
              <p className="mt-1 text-xs text-slate-500">Operations workspace</p>
            </div>
          </aside>

          <main className="grid gap-5">
            <div className="interactive-card rounded-lg bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-h-11 items-center gap-3 rounded-lg bg-slate-100 px-4 text-sm text-slate-500 lg:min-w-[320px]">
                  <Search className="h-4 w-4 text-blue-600" />
                  Quick search
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    {today}
                  </span>
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-sm font-semibold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Supabase live
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600">
                    <Bell className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-slate-950 p-5 text-white shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    <LayoutDashboard className="h-4 w-4" />
                    {dashboard.eyebrow}
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">{dashboard.title}</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{dashboard.subtitle}</p>
                </div>
                <div className="grid min-w-[220px] gap-2 rounded-lg border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-semibold text-slate-300">Workspace Status</p>
                  <p className="text-2xl font-semibold">{modeLabel(dashboard.mode)}</p>
                  <p className="text-sm text-slate-300">Only verified admin users can view these records.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {dashboard.stats.map((stat, index) => (
                <AdminMetricCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>

            <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-5">
                {dashboard.tables.map((table) => (
                  <AdminDataTable key={table.title} table={table} />
                ))}
              </div>
              <div className="grid h-fit gap-5">
                <AdminActivityFeed tables={dashboard.tables} />
                <div className="interactive-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-950">System Health</h2>
                  <div className="mt-5 grid gap-3">
                    {[
                      ["Authentication", "Active"],
                      ["Role Access", "Protected"],
                      ["Database", dashboard.backendConfigured ? "Connected" : "Setup needed"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
                        <span className="text-sm font-semibold text-slate-600">{label}</span>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <div className="grid h-fit gap-5 xl:sticky xl:top-6">
            <PortalAuthPanel dashboard={dashboard} authError={authError} />
            <div className="interactive-card rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-950">Admin workflow</p>
                  <p className="mt-1 text-xs text-slate-500">Review requests, create credentials, track activity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function PortalDashboard({ dashboard, authError, authNotice }: PortalDashboardProps) {
  const Icon = portalIcons[dashboard.kind];

  if (dashboard.mode !== "live") {
    return <PortalAccessGate dashboard={dashboard} authError={authError} authNotice={authNotice} />;
  }

  if (dashboard.kind === "admin") {
    return <AdminCommandCenter dashboard={dashboard} authError={authError} authNotice={authNotice} />;
  }

  return (
    <>
      <section className="bg-slate-950 py-14 text-white">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                <Icon className="h-4 w-4" />
                {dashboard.eyebrow}
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal sm:text-5xl">
                {dashboard.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">{dashboard.subtitle}</p>
            </div>
            <div className="interactive-card rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Status</p>
              <p className="mt-2 text-2xl font-semibold">{modeLabel(dashboard.mode)}</p>
              <p className="mt-2 text-sm text-slate-300">
                {dashboard.backendConfigured ? "Supabase backend is ready." : "Secure backend setup is required."}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-slate-50 py-10">
        <Container>
          {dashboard.notices.length ? (
            <div className="mb-6 grid gap-3">
              {dashboard.notices.map((notice) => (
                <div key={notice} className="interactive-card rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <div className="flex gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                    <p>{notice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {dashboard.stats.map((stat) => (
                  <div key={stat.label} className="interactive-card min-h-32 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300">
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-slate-950">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-600">{stat.helper}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6">
                {dashboard.tables.map((table) => (
                  <DataTable key={table.title} table={table} />
                ))}
              </div>
            </div>

            <PortalAuthPanel dashboard={dashboard} authError={authError} />
          </div>
        </Container>
      </section>
    </>
  );
}
