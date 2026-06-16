"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClock,
  CircleDollarSign,
  FileText,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  Users,
  UserRoundCog,
} from "lucide-react";
import { AdminSessionButton } from "@/components/admin-session-button";
import { BrandLogo } from "@/components/brand-logo";
import { getPortalRoleLabel } from "@/lib/portal";
import type { PortalDashboardData } from "@/lib/portal";

const adminNavItems = [
  { label: "Admin home", icon: LayoutDashboard, href: "/admin-dashboard" },
  { label: "Clients", icon: Users, href: "/admin-dashboard/clients" },
  { label: "Employees", icon: UserRoundCog, href: "/admin-dashboard/employees" },
  { label: "Projects", icon: FolderKanban, href: "/admin-dashboard/projects" },
  { label: "Finance", icon: CircleDollarSign, href: "/admin-dashboard/finance" },
  { label: "Upcoming", icon: CalendarClock, href: "/admin-dashboard/upcoming" },
  { label: "Reports", icon: FileText, href: "/admin-dashboard/reports" },
  { label: "Access", icon: KeyRound, href: "/admin-dashboard/access" },
];

function useActiveRoute() {
  const pathname = usePathname();
  return (href: string) => href === "/admin-dashboard" ? pathname === href : pathname.startsWith(href);
}

export function AdminSidebar({ dashboard }: { dashboard: PortalDashboardData }) {
  const isActive = useActiveRoute();
  const profileInitial = dashboard.profile?.fullName?.trim().charAt(0).toUpperCase() || "H";
  const roleLabel = dashboard.profile ? getPortalRoleLabel(dashboard.profile.role) : "Admin";

  return (
    <aside className="sticky top-0 hidden h-[100dvh] flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 text-white lg:flex">
      <Link href="/admin-dashboard" className="border-b border-white/10 px-5 py-5" aria-label="HouseOfDev admin home">
        <BrandLogo inverted />
      </Link>

      <nav className="flex-1 px-3 py-5" aria-label="Admin workspace">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
        <div className="mt-3 grid gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  active ? "bg-white text-slate-950 shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-500 text-sm font-semibold text-white">
              {profileInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{dashboard.profile?.fullName || "HouseOfDev Admin"}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{roleLabel}</p>
            </div>
          </div>
          <p className="mt-3 truncate text-xs text-slate-400">{dashboard.profile?.email}</p>
          <div className="mt-4 grid gap-2">
            <Link href="/admin-dashboard/access" className="inline-flex min-h-10 w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Manage access
            </Link>
            <AdminSessionButton />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AdminMobileHeader({ dashboard }: { dashboard: PortalDashboardData }) {
  const isActive = useActiveRoute();
  const profileInitial = dashboard.profile?.fullName?.trim().charAt(0).toUpperCase() || "H";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/admin-dashboard" aria-label="HouseOfDev admin home"><BrandLogo /></Link>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live
          </span>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{profileInitial}</div>
          <AdminSessionButton compact />
        </div>
      </div>
      <nav className="overflow-x-auto border-t border-slate-100 px-3 py-2" aria-label="Mobile admin workspace">
        <div className="flex w-max gap-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
              >
                <Icon className="h-3.5 w-3.5" /> {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
