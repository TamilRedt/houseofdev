import { getPortalDashboard, type PortalDashboardData, type PortalKind } from "@/lib/portal";
import { getSupabaseAdmin, getSupabaseServerClient } from "@/lib/supabase";

type Row = Record<string, unknown>;

export type MemberProject = { id: string; title: string; description: string; status: string; progress: number; dueDate: string | null; role: string; openTasks: number };
export type MemberTask = { id: string; projectId: string; projectTitle: string; title: string; description: string; status: string; priority: string; dueDate: string | null };
export type MemberUpdate = { id: string; projectId: string; projectTitle: string; title: string; body: string; author: string; createdAt: string };
export type MemberReview = { id: string; projectTitle: string; rating: number; review: string; type: string; createdAt: string };
export type MemberTicket = { id: string; projectId: string; projectTitle: string; subject: string; body: string; priority: string; status: string; createdAt: string };

export type MemberWorkspaceData = {
  dashboard: PortalDashboardData;
  projects: MemberProject[];
  tasks: MemberTask[];
  updates: MemberUpdate[];
  reviews: MemberReview[];
  tickets: MemberTicket[];
  notices: string[];
};

const text = (value: unknown, fallback = "") => typeof value === "string" ? value : value == null ? fallback : String(value);
const num = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

function empty(dashboard: PortalDashboardData, notices: string[]): MemberWorkspaceData {
  return { dashboard, projects: [], tasks: [], updates: [], reviews: [], tickets: [], notices };
}

export async function getMemberWorkspaceData(kind: Extract<PortalKind, "employee" | "client">): Promise<MemberWorkspaceData> {
  const dashboard = await getPortalDashboard(kind);
  const notices = [...dashboard.notices];
  if (dashboard.mode !== "live" || !dashboard.profile) return empty(dashboard, notices);
  const db = getSupabaseAdmin() || (await getSupabaseServerClient());
  if (!db) return empty(dashboard, [...notices, "The workspace database is unavailable."]);

  const profileId = dashboard.profile.id;
  let projectIds: string[] = [];
  let roleByProject = new Map<string, string>();

  if (kind === "employee") {
    const assignmentResult = await db.from("project_members").select("project_id, role_title, assignment_status").eq("employee_id", profileId).limit(200);
    if (assignmentResult.error) notices.push(assignmentResult.error.message);
    const assignments = (assignmentResult.data || []) as Row[];
    projectIds = assignments.map((item) => text(item.project_id)).filter(Boolean);
    roleByProject = new Map(assignments.map((item) => [text(item.project_id), text(item.role_title, "Team member")]));
  } else {
    const ownedResult = await db.from("projects").select("id").eq("client_id", profileId).limit(200);
    if (ownedResult.error) notices.push(ownedResult.error.message);
    projectIds = ((ownedResult.data || []) as Row[]).map((item) => text(item.id)).filter(Boolean);
  }

  if (!projectIds.length) return empty(dashboard, notices);

  const [projectResult, taskResult, updateResult, profileResult, reviewResult, ticketResult] = await Promise.all([
    db.from("projects").select("id, title, description, status, progress_percent, due_date").in("id", projectIds),
    db.from("tasks").select("id, project_id, assignee_id, title, description, status, priority, due_date").in("project_id", projectIds).order("created_at", { ascending: false }).limit(500),
    db.from("project_updates").select("id, project_id, author_id, title, body, created_at").in("project_id", projectIds).order("created_at", { ascending: false }).limit(300),
    db.from("profiles").select("id, full_name").limit(500),
    db.from("project_reviews").select("id, project_id, employee_id, rating, review, review_type, created_at").in("project_id", projectIds).order("created_at", { ascending: false }).limit(200),
    db.from("support_tickets").select("id, project_id, client_id, subject, body, priority, status, created_at").in("project_id", projectIds).order("created_at", { ascending: false }).limit(200),
  ]);

  [projectResult, taskResult, updateResult, profileResult, reviewResult, ticketResult].forEach((result) => { if (result.error) notices.push(result.error.message); });
  const projectRows = (projectResult.data || []) as Row[];
  const taskRows = (taskResult.data || []) as Row[];
  const updateRows = (updateResult.data || []) as Row[];
  const reviewRows = (reviewResult.data || []) as Row[];
  const ticketRows = (ticketResult.data || []) as Row[];
  const profileById = new Map(((profileResult.data || []) as Row[]).map((item) => [text(item.id), text(item.full_name, "HouseOfDev team")]));
  const projectById = new Map(projectRows.map((item) => [text(item.id), text(item.title, "Project")]));

  const projects = projectRows.map((project) => {
    const id = text(project.id);
    return {
      id,
      title: text(project.title, "Project"),
      description: text(project.description, "No description added yet."),
      status: text(project.status, "new"),
      progress: Math.max(0, Math.min(100, num(project.progress_percent))),
      dueDate: text(project.due_date) || null,
      role: roleByProject.get(id) || (kind === "client" ? "Client" : "Team member"),
      openTasks: taskRows.filter((task) => text(task.project_id) === id && !["done", "completed", "closed"].includes(text(task.status).toLowerCase())).length,
    };
  });

  const visibleTasks = kind === "employee" ? taskRows.filter((task) => text(task.assignee_id) === profileId) : taskRows;
  const tasks = visibleTasks.map((task) => ({
    id: text(task.id), projectId: text(task.project_id), projectTitle: projectById.get(text(task.project_id)) || "Project", title: text(task.title, "Task"), description: text(task.description), status: text(task.status, "todo"), priority: text(task.priority, "normal"), dueDate: text(task.due_date) || null,
  }));
  const updates = updateRows.map((update) => ({
    id: text(update.id), projectId: text(update.project_id), projectTitle: projectById.get(text(update.project_id)) || "Project", title: text(update.title, "Project update"), body: text(update.body), author: profileById.get(text(update.author_id)) || "HouseOfDev team", createdAt: text(update.created_at),
  }));
  const reviews = reviewRows.filter((review) => kind === "client" || text(review.employee_id) === profileId).map((review) => ({
    id: text(review.id), projectTitle: projectById.get(text(review.project_id)) || "Project", rating: num(review.rating), review: text(review.review), type: text(review.review_type, "review"), createdAt: text(review.created_at),
  }));
  const tickets = ticketRows.filter((ticket) => kind === "employee" || text(ticket.client_id) === profileId).map((ticket) => ({
    id: text(ticket.id), projectId: text(ticket.project_id), projectTitle: projectById.get(text(ticket.project_id)) || "Project", subject: text(ticket.subject, "Request"), body: text(ticket.body), priority: text(ticket.priority, "normal"), status: text(ticket.status, "new"), createdAt: text(ticket.created_at),
  }));

  return { dashboard, projects, tasks, updates, reviews, tickets, notices };
}
