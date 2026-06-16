import { getAdminWorkspaceData } from "@/lib/admin-workspace";

export const dynamic = "force-dynamic";

function escapeCell(value: string | number | null | undefined) {
  const text = String(value ?? "").replaceAll('"', '""');
  return '"' + text + '"';
}

export async function GET() {
  const data = await getAdminWorkspaceData();
  if (data.dashboard.mode !== "live") return new Response("Admin sign-in required", { status: 401 });

  const rows: Array<Array<string | number>> = [["Section", "Name", "Detail 1", "Detail 2", "Detail 3"]];
  data.clients.forEach((item) => rows.push(["Client", item.company, item.name, item.activeProjects, item.pendingAmount]));
  data.employees.forEach((item) => rows.push(["Employee", item.name, item.jobTitle, item.activeProjects, item.openTasks]));
  data.projects.forEach((item) => rows.push(["Project", item.title, item.clientName, item.progress, item.status]));
  data.invoices.forEach((item) => rows.push(["Invoice", item.number, item.clientName, item.amount, item.status]));

  const content = rows.map((row) => row.map(escapeCell).join(",")).join("\n");
  return new Response(content, { headers: { "content-type": "text/csv; charset=utf-8", "cache-control": "no-store" } });
}
