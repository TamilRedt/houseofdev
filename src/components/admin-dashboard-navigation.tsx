import {
  CircleDollarSign,
  FileText,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  UserPlus,
  Users,
} from "lucide-react";
import { getPortalRoleLabel } from "@/lib/portal";
import type { PortalDashboardData } from "@/lib/portal";

const adminNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#overview" },
  { label: "Leads", icon: UserPlus, href: "#operations" },
  { label: "Clients", icon: Users, href: "#operations" },
  { label: "Projects", icon: FolderKanban, href: "#operations" },
  { label: "Finance", icon: CircleDollarSign, href: "#operations" },
  { label: "Support", icon: MessageSquare, href: "#operations" },
  { label: "Reports", icon: FileText, href: "#reports" },
  { label: "Access", icon: KeyRound, href: "#access" },
];

export function AdminSidebar({ dashboard }: { dashboard: PortalDashboardData }) {
  const profileInitial = dashboard.profile?.fullName?.trim().charAt(0).toUpperCase() || "H";
  const roleLabel = dashboard.profile ? getPortalRoleLabel(dashboard.profile.role) : "Admin";

  return (
    <aside className="sticky top-0 hidden h-[100dvh] flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 text-white lg:flex">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-sm font-bold">HD</div>
          <div>
            <p className="font-semibold">HouseOfDev</p>
            <p className="mt-0.5 text-xs text-slate-400">Operations Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5" aria-label="Admin workspace">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
        <div className="mt-3 grid gap-1">
          {adminNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  index === 0 ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-white/10 text-sm font-semibold">
              {profileInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{dashboard.profile?.fullName || "HouseOfDev Admin"}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <p className="mt-3 truncate text-xs text-slate-400">{dashboard.profile?.email}</p>
          <a
            href="#access"
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Manage access
          </a>
        </div>
      </div>
    </aside>
  );
}

export function AdminMobileHeader({ dashboard }: { dashboard: PortalDashboardData }) {
  const profileInitial = dashboard.profile?.fullName?.trim().charAt(0).toUpperCase() || "H";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-xs font-bold text-white">HD</div>
          <div>
            <p className="text-sm font-semibold text-slate-950">HouseOfDev</p>
            <p className="text-xs text-slate-500">Admin workspace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live
          </span>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
            {profileInitial}
          </div>
        </div>
      </div>
      <nav className="overflow-x-auto border-t border-slate-100 px-3 py-2" aria-label="Mobile admin workspace">
        <div className="flex w-max gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
