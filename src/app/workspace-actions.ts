"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerVerifiedPortalRole } from "@/lib/portal-session";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const adminRoles = new Set<UserRole>(["admin", "super_admin"]);
const employeeRoles = new Set<UserRole>(["employee", "admin", "super_admin"]);
const clientRoles = new Set<UserRole>(["business_client", "individual_client", "admin", "super_admin"]);

function uuid(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text) ? text : null;
}

function safeText(value: FormDataEntryValue | null, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function go(path: string, kind: "notice" | "error", message: string): never {
  redirect(`${path}?portal_${kind}=${encodeURIComponent(message)}`);
}

async function signedIn(path: string) {
  const server = await getSupabaseServerClient();
  if (!server) go(path, "error", "Portal authentication is unavailable.");
  const { data: { user }, error } = await server.auth.getUser();
  if (error || !user) go(path, "error", "Sign in before using this action.");
  const role = await getServerVerifiedPortalRole(user.id);
  if (!role) go(path, "error", "Your portal role is missing.");
  const db = getSupabaseAdmin() || server;
  return { user, role, db };
}

export async function adminUpdateProject(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const path = projectId ? `/admin-dashboard/projects/${projectId}` : "/admin-dashboard/projects";
  const { role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can update project delivery status.");
  if (!projectId) go(path, "error", "Choose a valid project.");

  const progress = Math.max(0, Math.min(100, Number(formData.get("progress") || 0)));
  const status = safeText(formData.get("status"), 40) || "in_progress";
  const dueDate = safeText(formData.get("dueDate"), 20) || null;
  const { error } = await db.from("projects").update({ progress_percent: progress, status, due_date: dueDate, updated_at: new Date().toISOString() }).eq("id", projectId);
  if (error) go(path, "error", error.message);
  revalidatePath("/admin-dashboard");
  revalidatePath("/portal");
  revalidatePath("/employee-portal");
  go(path, "notice", "Project progress and delivery status were updated.");
}

export async function adminAssignEmployee(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const employeeId = uuid(formData.get("employeeId"));
  const path = projectId ? `/admin-dashboard/projects/${projectId}` : "/admin-dashboard/projects";
  const { role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can assign employees.");
  if (!projectId || !employeeId) go(path, "error", "Choose a project and employee.");
  const roleTitle = safeText(formData.get("roleTitle"), 100) || "Team member";
  const dueDate = safeText(formData.get("dueDate"), 20) || null;
  const { error } = await db.from("project_members").upsert({ project_id: projectId, employee_id: employeeId, role_title: roleTitle, assignment_status: "assigned", due_date: dueDate }, { onConflict: "project_id,employee_id" });
  if (error) go(path, "error", error.message);
  revalidatePath(path);
  revalidatePath("/employee-portal");
  go(path, "notice", "Employee assignment was saved.");
}

export async function submitEmployeeProjectUpdate(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const path = "/employee-portal/updates";
  const { user, role, db } = await signedIn(path);
  if (!employeeRoles.has(role)) go(path, "error", "Only delivery team members can add project updates.");
  if (!projectId) go(path, "error", "Choose a project.");

  if (role === "employee") {
    const { data } = await db.from("project_members").select("id").eq("project_id", projectId).eq("employee_id", user.id).maybeSingle();
    if (!data) go(path, "error", "This project is not assigned to your account.");
  }

  const title = safeText(formData.get("title"), 120);
  const completed = safeText(formData.get("completed"), 1200);
  const next = safeText(formData.get("next"), 800);
  const blocker = safeText(formData.get("blocker"), 800);
  if (title.length < 3 || completed.length < 8) go(path, "error", "Add a clear title and describe what was completed today.");
  const body = [`Completed today: ${completed}`, `Next: ${next || "Continue planned work"}`, `Blocker: ${blocker || "None"}`].join("\n\n");
  const { error } = await db.from("project_updates").insert({ project_id: projectId, author_id: user.id, title, body });
  if (error) go(path, "error", error.message);
  revalidatePath("/employee-portal");
  revalidatePath("/portal");
  revalidatePath("/admin-dashboard");
  go(path, "notice", "Daily project update was shared with the admin and client.");
}

export async function updateEmployeeTaskStatus(formData: FormData) {
  const taskId = uuid(formData.get("taskId"));
  const path = "/employee-portal/tasks";
  const { user, role, db } = await signedIn(path);
  if (!employeeRoles.has(role)) go(path, "error", "Only delivery team members can update tasks.");
  if (!taskId) go(path, "error", "Choose a valid task.");
  const status = safeText(formData.get("status"), 30);
  if (!new Set(["todo", "in_progress", "review", "blocked", "completed"]).has(status)) go(path, "error", "Choose a valid task status.");
  let query = db.from("tasks").update({ status, completed_at: status === "completed" ? new Date().toISOString() : null }).eq("id", taskId);
  if (role === "employee") query = query.eq("assignee_id", user.id);
  const { data, error } = await query.select("id").maybeSingle();
  if (error || !data) go(path, "error", error?.message || "This task is not assigned to your account.");
  revalidatePath("/employee-portal");
  revalidatePath("/admin-dashboard");
  go(path, "notice", "Task status was updated.");
}

export async function submitClientProjectChangeRequest(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const path = "/portal/change-requests";
  const { user, role, db } = await signedIn(path);
  if (!clientRoles.has(role)) go(path, "error", "Only client accounts can request a project change.");
  if (!projectId) go(path, "error", "Choose a project.");
  if (["business_client", "individual_client"].includes(role)) {
    const { data } = await db.from("projects").select("id").eq("id", projectId).eq("client_id", user.id).maybeSingle();
    if (!data) go(path, "error", "This project is not connected to your account.");
  }
  const subject = safeText(formData.get("subject"), 140);
  const body = safeText(formData.get("body"), 2000);
  const priority = safeText(formData.get("priority"), 20) || "normal";
  if (subject.length < 3 || body.length < 8) go(path, "error", "Add a short subject and explain the requested change.");
  const { error } = await db.from("support_tickets").insert({ client_id: user.id, project_id: projectId, subject: `Change request: ${subject}`, body, priority, status: "new" });
  if (error) go(path, "error", error.message);
  revalidatePath("/portal");
  revalidatePath("/admin-dashboard");
  go(path, "notice", "Your change request was sent to the HouseOfDev team.");
}
