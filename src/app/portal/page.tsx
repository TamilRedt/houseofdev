import { PortalDashboard } from "@/components/portal-dashboard";
import { getPortalDashboard } from "@/lib/portal";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Client Portal",
  description: "Secure client workspace for HouseOfDev project status, invoices, support, and account records.",
  path: "/portal",
});

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getAuthError(params?: Record<string, string | string[] | undefined>) {
  const value = params?.portal_error;
  return Array.isArray(value) ? value[0] : value;
}

function getAuthNotice(params?: Record<string, string | string[] | undefined>) {
  const value = params?.portal_notice;
  return Array.isArray(value) ? value[0] : value;
}

export default async function ClientPortalPage({ searchParams }: PageProps) {
  const [dashboard, params] = await Promise.all([getPortalDashboard("client"), searchParams]);

  return <PortalDashboard dashboard={dashboard} authError={getAuthError(params)} authNotice={getAuthNotice(params)} />;
}
