import { MemberWorkspacePage } from "@/components/member-workspace-page";

export const dynamic = "force-dynamic";

export default function EmployeeUpdatesPage() {
  return <MemberWorkspacePage kind="employee" section="updates" />;
}
