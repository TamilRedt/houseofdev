"use client";

import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { SiteEngagementLayer } from "@/components/site-engagement-layer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const workspaceRoutes = ["/admin-dashboard", "/employee-portal", "/portal"];

function isWorkspaceRoute(pathname: string) {
  return workspaceRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspace = isWorkspaceRoute(pathname);

  return (
    <>
      {!isWorkspace ? (
        <>
          <SiteEngagementLayer />
          <SiteHeader />
        </>
      ) : null}
      <PageTransition>{children}</PageTransition>
      {!isWorkspace ? <SiteFooter /> : null}
    </>
  );
}
