import { MemberWorkspacePage } from "@/components/member-workspace-page";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EmployeeUpdatesPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <MemberWorkspacePage
      kind="employee"
      section="updates"
      authError={first(params?.portal_error)}
      authNotice={first(params?.portal_notice)}
    />
  );
}
