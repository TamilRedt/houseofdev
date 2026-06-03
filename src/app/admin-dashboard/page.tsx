import { PortalDashboard } from "@/components/portal-dashboard";
import { getPortalDashboard } from "@/lib/portal";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description:
    "HouseOfDev admin dashboard for leads, careers, users, projects, finance, support, and business operations.",
  path: "/admin-dashboard",
});

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getAuthError(params?: Record<string, string | string[] | undefined>) {
  const value = params?.portal_error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const [dashboard, params] = await Promise.all([getPortalDashboard("admin"), searchParams]);

  return <PortalDashboard dashboard={dashboard} authError={getAuthError(params)} />;
}
