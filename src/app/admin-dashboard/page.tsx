import { AdminOperationsDashboard } from "@/components/admin-operations-dashboard";
import { getPortalDashboard } from "@/lib/portal";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Admin Dashboard",
  description: "HouseOfDev operations workspace for business administration.",
  path: "/admin-dashboard",
});

export default async function AdminDashboardPage() {
  const dashboard = await getPortalDashboard("admin");
  return <AdminOperationsDashboard dashboard={dashboard} />;
}
