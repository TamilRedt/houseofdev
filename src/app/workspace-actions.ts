"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buildConsultationSlot, createConsultationEvent } from "@/lib/google-calendar";
import { sendLeadNotifications } from "@/lib/notifications";
import { getServerVerifiedPortalRole } from "@/lib/portal-session";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const adminRoles = new Set<UserRole>(["admin", "super_admin"]);
const employeeRoles = new Set<UserRole>(["employee", "admin", "super_admin"]);
const clientRoles = new Set<UserRole>(["business_client", "individual_client", "admin", "super_admin"]);
const projectStatuses = new Set(["new", "reviewing", "approved", "in_progress", "completed", "closed"]);

function uuid(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text) ? text : null;
}

function safeText(value: FormDataEntryValue | null, max = 2000) {
  return String(value || "").trim().slice(0, max);
}

function amount(value: FormDataEntryValue | null) {
  const parsed = Number(String(value || "").replace(/,/g, ""));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
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

export async function adminCreateProject(formData: FormData) {
  const path = "/admin-dashboard/projects";
  const { user, role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can create projects.");

  const clientId = uuid(formData.get("clientId"));
  const employeeId = uuid(formData.get("employeeId"));
  const title = safeText(formData.get("title"), 140);
  const description = safeText(formData.get("description"), 2500);
  const statusInput = safeText(formData.get("status"), 40) || "new";
  const status = projectStatuses.has(statusInput) ? statusInput : "new";
  const progress = Math.max(0, Math.min(100, Number(formData.get("progress") || 0)));
  const startDate = safeText(formData.get("startDate"), 20) || null;
  const dueDate = safeText(formData.get("dueDate"), 20) || null;
  const budget = amount(formData.get("budget"));
  const roleTitle = safeText(formData.get("roleTitle"), 100) || "Team member";

  if (!clientId) go(path, "error", "Choose a client before creating the project.");
  if (title.length < 3) go(path, "error", "Enter a clear project title.");
  if (dueDate && startDate && dueDate < startDate) go(path, "error", "Delivery date cannot be before the start date.");

  const { data: client } = await db.from("profiles").select("id, full_name, email, company_name, role").eq("id", clientId).maybeSingle();
  if (!client || !["business_client", "individual_client"].includes(String(client.role))) {
    go(path, "error", "The selected profile is not an active client account.");
  }

  const insertResult = await db
    .from("projects")
    .insert({
      client_id: clientId,
      title,
      description: description || null,
      status,
      progress_percent: progress,
      budget,
      start_date: startDate,
      due_date: dueDate,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .maybeSingle();

  if (insertResult.error || !insertResult.data) go(path, "error", insertResult.error?.message || "Project could not be created.");
  const projectId = String(insertResult.data.id);

  if (employeeId) {
    const { data: employee } = await db.from("profiles").select("id, role").eq("id", employeeId).maybeSingle();
    if (employee?.role === "employee") {
      await db.from("project_members").upsert(
        {
          project_id: projectId,
          employee_id: employeeId,
          role_title: roleTitle,
          assignment_status: "assigned",
          due_date: dueDate,
        },
        { onConflict: "project_id,employee_id" },
      );
    }
  }

  await db.from("audit_logs").insert({
    actor_id: user.id,
    action: "project_created",
    entity_type: "project",
    entity_id: projectId,
    metadata: { clientId, employeeId, title, status, progress, dueDate },
  });

  await sendLeadNotifications({
    subject: `HouseOfDev project created — ${title}`,
    html: `<h2>Project created</h2><p><strong>${title}</strong> was connected to ${String(client.company_name || client.full_name)}.</p><p>Status: ${status.replaceAll("_", " ")} · Progress: ${progress}% · Due: ${dueDate || "Not scheduled"}</p>`,
    text: [
      "HouseOfDev project created",
      `Project: ${title}`,
      `Client: ${String(client.company_name || client.full_name)}`,
      `Client email: ${String(client.email || "-")}`,
      `Status: ${status}`,
      `Progress: ${progress}%`,
      `Due: ${dueDate || "Not scheduled"}`,
    ].join("\n"),
  });

  revalidatePath("/admin-dashboard");
  revalidatePath("/admin-dashboard/projects");
  revalidatePath("/portal");
  revalidatePath("/employee-portal");
  go(`/admin-dashboard/projects/${projectId}`, "notice", "Project created and connected to the client.");
}

export async function adminUpdateProject(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const path = projectId ? `/admin-dashboard/projects/${projectId}` : "/admin-dashboard/projects";
  const { role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can update project delivery status.");
  if (!projectId) go(path, "error", "Choose a valid project.");

  const progress = Math.max(0, Math.min(100, Number(formData.get("progress") || 0)));
  const statusInput = safeText(formData.get("status"), 40) || "in_progress";
  const status = projectStatuses.has(statusInput) ? statusInput : "in_progress";
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

export async function adminAddProjectReview(formData: FormData) {
  const projectId = uuid(formData.get("projectId"));
  const path = projectId ? `/admin-dashboard/projects/${projectId}` : "/admin-dashboard/projects";
  const { user, role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can add a project review.");
  if (!projectId) go(path, "error", "Choose a valid project.");

  const review = safeText(formData.get("review"), 2000);
  const rating = Math.max(1, Math.min(5, Number(formData.get("rating") || 3)));
  if (review.length < 8) go(path, "error", "Write a useful project review before saving.");

  const { error } = await db.from("project_reviews").insert({
    project_id: projectId,
    reviewer_id: user.id,
    employee_id: null,
    rating,
    review,
    review_type: "admin_project",
  });
  if (error) go(path, "error", error.message);
  revalidatePath(path);
  revalidatePath("/portal");
  go(path, "notice", "Project review was saved.");
}

export async function adminScheduleConsultation(formData: FormData) {
  const consultationId = uuid(formData.get("consultationId"));
  const path = "/admin-dashboard/consultations";
  const { role, db } = await signedIn(path);
  if (!adminRoles.has(role)) go(path, "error", "Only an admin can schedule consultations.");
  if (!consultationId) go(path, "error", "Choose a valid consultation request.");

  const date = safeText(formData.get("date"), 20);
  const time = safeText(formData.get("time"), 20);
  const notes = safeText(formData.get("notes"), 1000);
  const slot = buildConsultationSlot(date, time);
  if (!slot) go(path, "error", "Choose a valid date and time.");

  const { data: consultation, error: fetchError } = await db
    .from("consultation_requests")
    .select("id, full_name, company_name, email, phone, service_required, message")
    .eq("id", consultationId)
    .maybeSingle();
  if (fetchError || !consultation) go(path, "error", "Consultation request could not be loaded.");

  const booking = await createConsultationEvent({
    slot,
    fullName: String(consultation.full_name),
    companyName: String(consultation.company_name || ""),
    email: String(consultation.email),
    phone: String(consultation.phone),
    service: String(consultation.service_required),
    message: String(consultation.message),
  });

  if (booking.available === false) {
    await db.from("consultation_requests").update({ status: "reviewing", admin_notes: `Calendar conflict. ${notes}`.trim(), updated_at: new Date().toISOString() }).eq("id", consultationId);
    go(path, "error", "That time conflicts with an existing Google Calendar event.");
  }

  if (!booking.booked) {
    go(path, "error", booking.reason || "Google Calendar is not configured or the event could not be created.");
  }

  await db.from("consultation_requests").update({
    status: "approved",
    preferred_date: date,
    preferred_time: time,
    appointment_at: slot.start,
    admin_notes: [notes, booking.eventUrl].filter(Boolean).join("\n"),
    updated_at: new Date().toISOString(),
  }).eq("id", consultationId);

  await sendLeadNotifications({
    subject: `Consultation booked — ${String(consultation.full_name)}`,
    html: `<h2>Consultation booked</h2><p>${String(consultation.full_name)} is booked for ${date} at ${time}.</p>`,
    text: `HouseOfDev consultation booked\n${String(consultation.full_name)}\n${date} ${time}\n${booking.eventUrl || ""}`,
  });

  revalidatePath(path);
  go(path, "notice", "Consultation was booked in Google Calendar.");
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
