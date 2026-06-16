import { AdminProjectsPage } from "@/components/admin-projects-page";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  return <AdminProjectsPage clientId={first(params?.client)} employeeId={first(params?.employee)} />;
}
