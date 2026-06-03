import { AlertTriangle, Clock3, Database, LogIn, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { recordAttendanceCheckIn, recordAttendanceCheckOut, signInToPortal, signOutFromPortal } from "@/app/portal-actions";
import { getPortalRoleLabel, getPortalRoute, type PortalDashboardData } from "@/lib/portal";

type PortalAuthPanelProps = {
  dashboard: PortalDashboardData;
  authError?: string;
};

export function PortalAuthPanel({ dashboard, authError }: PortalAuthPanelProps) {
  const returnTo = getPortalRoute(dashboard.kind);
  const showLogin = dashboard.mode === "signed_out";
  const showSignedIn = dashboard.profile && (dashboard.mode === "live" || dashboard.mode === "unauthorized");
  const showAttendance = dashboard.mode === "live" && dashboard.kind === "employee";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-white">
          {dashboard.backendConfigured ? <ShieldCheck className="h-5 w-5" /> : <Database className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {dashboard.backendConfigured ? "Backend Connected" : "Demo Mode"}
          </p>
          <p className="text-xs text-slate-500">
            {dashboard.mode === "live" ? "Live Supabase records" : "Safe preview data"}
          </p>
        </div>
      </div>

      {authError ? (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <p>{authError}</p>
          </div>
        </div>
      ) : null}

      {showSignedIn ? (
        <div className="mt-5 rounded-md bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <UserCircle className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-950">{dashboard.profile?.fullName}</p>
              <p className="mt-1 text-xs text-slate-500">{dashboard.profile?.email}</p>
              {dashboard.profile ? (
                <p className="mt-2 text-xs font-semibold text-emerald-700">
                  {getPortalRoleLabel(dashboard.profile.role)}
                </p>
              ) : null}
            </div>
          </div>
          <form action={signOutFromPortal} className="mt-4">
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      ) : null}

      {showAttendance ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-emerald-700" />
            <p className="text-sm font-semibold text-emerald-950">Today&apos;s Attendance</p>
          </div>
          <form action={recordAttendanceCheckIn} className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Mode</span>
              <select
                name="mode"
                defaultValue="office"
                className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
              >
                <option value="office">Office</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="field">Field Work</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Notes</span>
              <input
                name="notes"
                placeholder="Optional update"
                className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-slate-950"
            >
              Check In
            </button>
          </form>
          <form action={recordAttendanceCheckOut} className="mt-3">
            <button
              type="submit"
              className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-emerald-300 bg-white px-4 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-100"
            >
              Check Out
            </button>
          </form>
        </div>
      ) : null}

      {showLogin ? (
        <form action={signInToPortal} className="mt-5 grid gap-4">
          <input type="hidden" name="returnTo" value={returnTo} />
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
            />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-slate-950"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </button>
        </form>
      ) : null}

      {!dashboard.backendConfigured ? (
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Configure Supabase URL, anon key, and service role key in Vercel to activate login and live dashboard data.
        </p>
      ) : null}
    </aside>
  );
}
