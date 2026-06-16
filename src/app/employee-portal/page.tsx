import { MemberWorkspacePage } from "@/components/member-workspace-page";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<Record<string, string | string[] | undefined>> };
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function EmployeePortalPage({ searchParams }: Props) {
  const params = await searchParams;
  return <MemberWorkspacePage kind="employee" section="home" authError={first(params?.portal_error)} authNotice={first(params?.portal_notice)} />;
}
