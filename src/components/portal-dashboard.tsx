import { AlertTriangle, BriefcaseBusiness, Building2, LayoutDashboard } from "lucide-react";
import { Container } from "@/components/container";
import { PortalAuthPanel } from "@/components/portal-auth-panel";
import type { PortalDashboardData, PortalKind, PortalTable } from "@/lib/portal";

type PortalDashboardProps = {
  dashboard: PortalDashboardData;
  authError?: string;
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

  return "Demo";
}

function DataTable({ table }: { table: PortalTable }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
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

export function PortalDashboard({ dashboard, authError }: PortalDashboardProps) {
  const Icon = portalIcons[dashboard.kind];

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
            <div className="rounded-lg border border-white/10 bg-white/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Status</p>
              <p className="mt-2 text-2xl font-semibold">{modeLabel(dashboard.mode)}</p>
              <p className="mt-2 text-sm text-slate-300">
                {dashboard.backendConfigured ? "Supabase backend is ready." : "Showing safe fallback data."}
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
                <div key={notice} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
                  <div key={stat.label} className="min-h-32 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
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
