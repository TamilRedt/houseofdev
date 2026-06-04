import type { ReactNode } from "react";
import { AlertTriangle, KeyRound, LogIn, LogOut, UserPlus } from "lucide-react";
import { requestPortalAccess, sendPortalPasswordReset, signInToPortal, signOutFromPortal } from "@/app/portal-actions";
import { Container } from "@/components/container";
import { getPortalRoute, getPortalRoleLabel, type PortalDashboardData } from "@/lib/portal";

type PortalAccessGateProps = {
  dashboard: PortalDashboardData;
  authError?: string;
  authNotice?: string;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600";

function MessageBlock({ tone, children }: { tone: "error" | "notice" | "warning"; children: ReactNode }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    notice: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className={`rounded-md border p-3 text-sm ${styles[tone]}`}>
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
        <div>{children}</div>
      </div>
    </div>
  );
}

export function PortalAccessGate({ dashboard, authError, authNotice }: PortalAccessGateProps) {
  const returnTo = getPortalRoute(dashboard.kind);
  const signedInButBlocked = dashboard.mode === "unauthorized" && dashboard.profile;

  return (
    <section className="bg-white py-14 sm:py-20">
      <Container>
        <div className="mx-auto w-full max-w-[560px] rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-8">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
            HD
          </div>
          <div className="mt-5 text-center">
            <p className="text-lg font-semibold text-slate-950">HouseOfDev</p>
            <h1 className="mt-3 text-4xl font-normal tracking-normal text-slate-950">Sign in</h1>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Use your HouseOfDev account. After sign-in, the correct client, employee, or admin portal opens automatically.
            </p>
          </div>

          <div className="mt-7 grid gap-3">
            {authError ? <MessageBlock tone="error">{authError}</MessageBlock> : null}
            {authNotice ? <MessageBlock tone="notice">{authNotice}</MessageBlock> : null}
            {dashboard.notices.map((notice) => (
              <MessageBlock key={notice} tone="warning">
                {notice}
              </MessageBlock>
            ))}
          </div>

          {signedInButBlocked ? (
            <div className="mt-7 rounded-md bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Signed in as {dashboard.profile?.fullName}</p>
              <p className="mt-1 text-sm text-slate-500">{dashboard.profile?.email}</p>
              {dashboard.profile ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                  {getPortalRoleLabel(dashboard.profile.role)}
                </p>
              ) : null}
              <form action={signOutFromPortal} className="mt-5">
                <input type="hidden" name="returnTo" value={returnTo} />
                <button
                  type="submit"
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          ) : (
            <form action={signInToPortal} className="mt-7 grid gap-5">
              <input type="hidden" name="returnTo" value={returnTo} />
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Email</span>
                <input name="email" type="email" autoComplete="email" required className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Password</span>
                <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
              </label>
              <div className="flex items-center justify-between gap-4">
                <a href="#request-account" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                  Create account
                </a>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                >
                  <LogIn className="h-4 w-4" />
                  Next
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 grid gap-5 border-t border-slate-200 pt-6">
            <form action={sendPortalPasswordReset} className="grid gap-3">
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-950">Forgot password?</h2>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Account email</span>
                <input name="resetEmail" type="email" autoComplete="email" required className={inputClass} />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Send reset link
              </button>
            </form>

            <form id="request-account" action={requestPortalAccess} className="grid gap-4 rounded-md bg-slate-50 p-4">
              <input type="hidden" name="returnTo" value={returnTo} />
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-emerald-700" />
                <h2 className="text-sm font-semibold text-slate-950">Request account access</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Full name</span>
                  <input name="fullName" autoComplete="name" required className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" required className={inputClass} />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Email</span>
                <input name="email" type="email" autoComplete="email" required className={inputClass} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Account type</span>
                <select name="accountType" required className={inputClass} defaultValue="Client account">
                  <option>Client account</option>
                  <option>Employee account</option>
                  <option>Admin account</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-blue-700">Message</span>
                <textarea
                  name="message"
                  className={`${inputClass} min-h-24 resize-y py-3`}
                  placeholder="Tell us the best time to contact you."
                />
              </label>
              <label className="hide-honeypot">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Request account
              </button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
