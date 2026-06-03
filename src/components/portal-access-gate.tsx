import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, CalendarCheck, KeyRound, LockKeyhole, LogIn, LogOut, Mail, Phone } from "lucide-react";
import { requestPortalAccess, sendPortalPasswordReset, signInToPortal, signOutFromPortal } from "@/app/portal-actions";
import { Container } from "@/components/container";
import { getPortalRoute, getPortalRoleLabel, type PortalDashboardData } from "@/lib/portal";

type PortalAccessGateProps = {
  dashboard: PortalDashboardData;
  authError?: string;
  authNotice?: string;
};

const inputClass =
  "mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";

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
    <section className="bg-slate-50 py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              <LockKeyhole className="h-4 w-4" />
              Private Account Access
            </div>
            <h1 className="mt-5 max-w-xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Sign in to your HouseOfDev account
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Client, employee, and admin users use this same secure login. After your credentials are verified, the portal opens the correct workspace for your account role.
            </p>

            <div className="mt-7 grid gap-3">
              {authError ? <MessageBlock tone="error">{authError}</MessageBlock> : null}
              {authNotice ? <MessageBlock tone="notice">{authNotice}</MessageBlock> : null}
              {dashboard.notices.map((notice) => (
                <MessageBlock key={notice} tone="warning">
                  {notice}
                </MessageBlock>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Link
                href="/contact"
                className="group flex min-h-24 items-center justify-between gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-950 transition hover:border-blue-400 hover:bg-white"
              >
                <span>
                  <span className="block text-sm font-semibold">Book free consultation</span>
                  <span className="mt-1 block text-sm text-blue-800">No account yet? Request one first.</span>
                </span>
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <a
                href="mailto:arasanredt@gmail.com"
                className="group flex min-h-24 items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-950 transition hover:border-emerald-400 hover:bg-white"
              >
                <span>
                  <span className="block text-sm font-semibold">Message the team</span>
                  <span className="mt-1 block text-sm text-emerald-800">Use email if your access is urgent.</span>
                </span>
                <Mail className="h-5 w-5 transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/6 sm:p-6">
              {signedInButBlocked ? (
                <div>
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
                <form action={signInToPortal} className="grid gap-4">
                  <input type="hidden" name="returnTo" value={returnTo} />
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Email</span>
                    <input name="email" type="email" autoComplete="email" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Password</span>
                    <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-slate-950"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </button>
                </form>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1">
              <form action={sendPortalPasswordReset} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <input type="hidden" name="returnTo" value={returnTo} />
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  <h2 className="text-sm font-semibold text-slate-950">Forgot password?</h2>
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-700">Account Email</span>
                  <input name="resetEmail" type="email" autoComplete="email" required className={inputClass} />
                </label>
                <button
                  type="submit"
                  className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
                >
                  Send Reset Link
                </button>
              </form>

              <form action={requestPortalAccess} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <input type="hidden" name="returnTo" value={returnTo} />
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-emerald-600" />
                  <h2 className="text-sm font-semibold text-slate-950">Request account access</h2>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <input name="fullName" autoComplete="name" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Phone</span>
                    <input name="phone" type="tel" autoComplete="tel" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Email</span>
                    <input name="email" type="email" autoComplete="email" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Company</span>
                    <input name="companyName" autoComplete="organization" className={inputClass} />
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-700">Account Type</span>
                  <select name="accountType" required className={inputClass} defaultValue="">
                    <option value="" disabled>
                      Select account type
                    </option>
                    <option>Client account</option>
                    <option>Employee account</option>
                    <option>Admin account</option>
                  </select>
                </label>
                <label className="mt-4 block">
                  <span className="text-sm font-semibold text-slate-700">Message</span>
                  <textarea
                    name="message"
                    className={`${inputClass} min-h-24 resize-y py-3`}
                    placeholder="Tell us what account you need and the best time to contact you."
                  />
                </label>
                <label className="hide-honeypot">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <button
                  type="submit"
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-blue-700"
                >
                  <Phone className="h-4 w-4" />
                  Request Call
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
