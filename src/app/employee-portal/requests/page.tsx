import { MemberWorkspacePage } from "@/components/member-workspace-page";

export const dynamic = "force-dynamic";

export default function EmployeeFeedbackPage() {
  return <MemberWorkspacePage kind="employee" section="requests" />;
}
