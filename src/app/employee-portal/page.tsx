import { PortalDashboard } from "@/components/portal-dashboard";
import { getPortalDashboard } from "@/lib/portal";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Employee Portal",
  description: "Secure employee workspace for HouseOfDev tasks, attendance, leave requests, and operations.",
  path: "/employee-portal",
});

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getAuthError(params?: Record<string, string | string[] | undefined>) {
  const value = params?.portal_error;
  return Array.isArray(value) ? value[0] : value;
}

export default async function EmployeePortalPage({ searchParams }: PageProps) {
  const [dashboard, params] = await Promise.all([getPortalDashboard("employee"), searchParams]);

  return <PortalDashboard dashboard={dashboard} authError={getAuthError(params)} />;
}
