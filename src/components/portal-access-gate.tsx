import Link from "next/link";
import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, FolderKanban, LogIn, LogOut, ShieldCheck, Sparkles } from "lucide-react";
import { signInToPortal, signOutFromPortal } from "@/app/portal-actions";
import { BrandLogo } from "@/components/brand-logo";
import { PasswordField } from "@/components/password-field";
import { getPortalRoute, getPortalRoleLabel, type PortalDashboardData } from "@/lib/portal";

type PortalAccessGateProps = {
  dashboard: PortalDashboardData;
  authError?: string;
  authNotice?: string;
};

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function MessageBlock({ tone, children }: { tone: "error" | "notice" | "warning"; children: ReactNode }) {
  const styles = { error: "border-red-200 bg-red-50 text-red-700", notice: "border-emerald-200 bg-emerald-50 text-emerald-800", warning: "border-amber-200 bg-amber-50 text-amber-900" };
  return <div className={`rounded-xl border p-3 text-sm ${styles[tone]}`}><div className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 flex-none" /><div>{children}</div></div></div>;
}

function PortalIllustration() {
  return (
    <div className="relative mx-auto mt-10 h-[300px] w-full max-w-[560px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-blue-950/40">
      <div className="absolute -left-16 -top-16 h-44 w-44 animate-pulse rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -bottom-20 -right-12 h-56 w-56 animate-pulse rounded-full bg-violet-500/20 blur-3xl [animation-delay:700ms]" />
      <svg viewBox="0 0 560 270" className="relative h-full w-full" role="img" aria-label="Local businesses connected to the HouseOfDev online platform">
        <path d="M95 172 C170 80 226 92 280 132 C338 176 390 80 475 112" fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 10" opacity=".65" />
        <path d="M110 188 C190 230 250 204 296 158 C354 100 420 170 474 145" fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="8 10" opacity=".55" />
        <g transform="translate(25 112)"><rect width="145" height="105" rx="20" fill="#0f172a" stroke="#334155" /><path d="M22 47 72 13l51 34" fill="none" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /><path d="M38 45v40h69V45" fill="none" stroke="white" strokeWidth="5" strokeLinejoin="round" /><rect x="59" y="58" width="27" height="27" rx="5" fill="#3b82f6" /><text x="72" y="100" fill="#94a3b8" fontSize="11" textAnchor="middle">LOCAL BUSINESS</text></g>
        <g transform="translate(210 48)"><rect width="145" height="145" rx="28" fill="#f8fafc" /><rect x="18" y="19" width="109" height="88" rx="14" fill="#e2e8f0" /><circle cx="34" cy="34" r="5" fill="#22d3ee" /><circle cx="50" cy="34" r="5" fill="#60a5fa" /><circle cx="66" cy="34" r="5" fill="#a78bfa" /><rect x="31" y="55" width="82" height="9" rx="4.5" fill="#94a3b8" /><rect x="31" y="72" width="55" height="9" rx="4.5" fill="#cbd5e1" /><rect x="31" y="89" width="70" height="9" rx="4.5" fill="#cbd5e1" /><path d="M59 124h28" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" /><text x="72" y="137" fill="#0f172a" fontSize="11" fontWeight="700" textAnchor="middle">ONLINE</text></g>
        <g transform="translate(390 90)"><rect width="145" height="126" rx="20" fill="#0f172a" stroke="#334155" /><rect x="22" y="23" width="101" height="12" rx="6" fill="#334155" /><rect x="22" y="50" width="68" height="12" rx="6" fill="#22d3ee" /><rect x="22" y="77" width="90" height="12" rx="6" fill="#8b5cf6" /><circle cx="109" cy="99" r="12" fill="#34d399" /><path d="m103 99 4 4 8-9" fill="none" stroke="#052e16" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><text x="22" y="111" fill="#94a3b8" fontSize="11">GROWTH</text></g>
      </svg>
    </div>
  );
}

export function PortalAccessGate({ dashboard, authError, authNotice }: PortalAccessGateProps) {
  const returnTo = getPortalRoute(dashboard.kind);
  const signedInButBlocked = dashboard.mode === "unauthorized" && dashboard.profile;

  return (
    <section className="min-h-[100dvh] overflow-hidden bg-[#050816] text-white">
      <div className="grid min-h-[100dvh] lg:grid-cols-[minmax(0,1.05fr)_minmax(480px,.95fr)]">
        <div className="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,.12),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,.16),transparent_34%)]" />
          <div className="relative"><BrandLogo inverted /><div className="mt-14 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200"><Sparkles className="h-3.5 w-3.5" />Every local business deserves an online future</span><h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">One clear workspace for every person building the project.</h1><p className="mt-6 max-w-xl text-base leading-8 text-slate-300">Clients understand progress. Employees know what to do next. Admins see the business without opening ten disconnected tools.</p></div><PortalIllustration /></div>
          <div className="relative grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><FolderKanban className="h-5 w-5 text-cyan-300" /><p className="mt-3 text-sm font-semibold">Project clarity</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><BarChart3 className="h-5 w-5 text-blue-300" /><p className="mt-3 text-sm font-semibold">Useful reporting</p></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><ShieldCheck className="h-5 w-5 text-violet-300" /><p className="mt-3 text-sm font-semibold">Role-based access</p></div></div>
        </div>

        <div className="flex items-center justify-center bg-slate-50 p-4 text-slate-950 sm:p-8 xl:p-14">
          <div className="w-full max-w-[520px]">
            <div className="mb-8 lg:hidden"><BrandLogo /><p className="mt-5 text-sm leading-6 text-slate-600">Project progress, daily work, finance, and requests in one secure workspace.</p></div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/10 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Secure portal</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Welcome back</h2><p className="mt-3 text-sm leading-6 text-slate-600">Sign in once. HouseOfDev opens the correct admin, employee, or client workspace automatically.</p>
              <div className="mt-6 grid gap-3">{authError ? <MessageBlock tone="error">{authError}</MessageBlock> : null}{authNotice ? <MessageBlock tone="notice">{authNotice}</MessageBlock> : null}{dashboard.notices.map((notice) => <MessageBlock key={notice} tone="warning">{notice}</MessageBlock>)}</div>
              {signedInButBlocked ? <div className="mt-7 rounded-2xl bg-slate-50 p-5"><p className="font-semibold">Signed in as {dashboard.profile?.fullName}</p><p className="mt-1 text-sm text-slate-500">{dashboard.profile?.email}</p>{dashboard.profile ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{getPortalRoleLabel(dashboard.profile.role)}</p> : null}<form action={signOutFromPortal} className="mt-5"><input type="hidden" name="returnTo" value={returnTo} /><button type="submit" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold hover:bg-slate-100"><LogOut className="h-4 w-4" />Sign out</button></form></div> : <form action={signInToPortal} className="mt-7 grid gap-5"><input type="hidden" name="returnTo" value={returnTo} /><label><span className="text-sm font-semibold text-slate-700">Email address</span><input name="email" type="email" autoComplete="email" required className={inputClass} placeholder="you@example.com" /></label><PasswordField label="Password" name="password" autoComplete="current-password" className={inputClass} /><button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"><LogIn className="h-4 w-4" />Open my workspace</button></form>}
              <div className="mt-6 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2"><Link href="/portal-access" className="group inline-flex min-h-11 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">Request access <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link><Link href="/portal-reset" className="group inline-flex min-h-11 items-center justify-between rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">Reset password <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link></div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4 flex-none" />Your portal only shows information allowed for your role.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
