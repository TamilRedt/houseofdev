import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { AdminCredentialManager } from "@/components/admin-credential-manager";
import { AdminMobileHeader, AdminSidebar } from "@/components/admin-dashboard-navigation";
import {
  AdminActivityFeed,
  AdminDataTable,
  AdminMetricCard,
  AdminSystemHealth,
} from "@/components/admin-dashboard-widgets";
import { PortalAccessGate } from "@/components/portal-access-gate";
import { getPortalRoleLabel } from "@/lib/portal";
import type { PortalDashboardData } from "@/lib/portal";

type AdminOperationsDashboardProps = {
  dashboard: PortalDashboardData;
  authError?: string;
  authNotice?: string;
};

function modeLabel(mode: PortalDashboardData["mode"]) {
  if (mode === "live") return "Live";
  if (mode === "signed_out") return "Login required";
  if (mode === "unauthorized") return "Access restricted";
  if (mode === "error") return "Backend warning";
  return "Setup required";
}

export function AdminOperationsDashboard({
  dashboard,
  authError,
  authNotice,
}: AdminOperationsDashboardProps) {
  if (dashboard.mode !== "live") {
    return <PortalAccessGate dashboard={dashboard} authError={authError} authNotice={authNotice} />;
  }

  const roleLabel = dashboard.profile ? getPortalRoleLabel(dashboard.profile.role) : "Admin";
  const today = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <section className="min-h-[100dvh] bg-slate-100 text-slate-950">
      <div className="mx-auto w-full max-w-[1920px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <AdminSidebar dashboard={dashboard} />

        <div className="min-w-0">
          <AdminMobileHeader dashboard={dashboard} />

          <main className="min-w-0 p-4 sm:p-6 xl:p-8">
            {dashboard.notices.length || authError || authNotice ? (
              <div className="mb-6 grid gap-3">
                {authError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <div className="flex gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                      <p>{authError}</p>
                    </div>
                  </div>
                ) : null}
                {authNotice ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none" />
                      <p>{authNotice}</p>
                    </div>
                  </div>
                ) : null}
                {dashboard.notices.map((notice) => (
                  <div key={notice} className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                      <p>{notice}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <section id="overview" className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:p-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {dashboard.eyebrow}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {roleLabel}
                    </span>
                  </div>
                  <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {dashboard.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    {dashboard.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    {today}
                  </span>
                  <span
                    className={`inline-flex min-h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-semibold ${
                      dashboard.backendConfigured
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {dashboard.backendConfigured ? "Supabase live" : "Backend setup"}
                  </span>
                  <a
                    href="#access"
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create access
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Workspace status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{modeLabel(dashboard.mode)}</p>
                </div>
                <p className="text-sm text-slate-600">Only verified admin users can view and change these records.</p>
              </div>
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4" aria-label="Business metrics">
              {dashboard.stats.map((stat, index) => (
                <AdminMetricCard key={stat.label} stat={stat} index={index} />
              ))}
            </section>

            <section id="operations" className="mt-6 scroll-mt-28">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-slate-950">Operations</h2>
                <p className="mt-1 text-sm text-slate-600">Live business records and recent workspace activity.</p>
              </div>

              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid min-w-0 gap-6">
                  {dashboard.tables.map((table) => (
                    <AdminDataTable key={table.title} table={table} />
                  ))}
                </div>
                <div className="grid gap-6 xl:sticky xl:top-6">
                  <AdminActivityFeed tables={dashboard.tables} />
                  <AdminSystemHealth dashboard={dashboard} />
                </div>
              </div>
            </section>

            <section id="access" className="mt-6 scroll-mt-28">
              <AdminCredentialManager
                requests={dashboard.credentialRequests}
                users={dashboard.credentialUsers}
                canCreateAdmin={dashboard.profile?.role === "super_admin"}
              />
            </section>
          </main>
        </div>
      </div>
    </section>
  );
}
