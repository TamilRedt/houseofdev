import { getPortalDashboard, type PortalDashboardData } from "@/lib/portal";
import { getSupabaseAdmin, getSupabaseServerClient } from "@/lib/supabase";

export type AdminClientRecord = {
  id: string;
  name: string;
  email: string;
  company: string;
  activeProjects: number;
  pendingAmount: number;
  lastLogin: string | null;
};

export type AdminEmployeeRecord = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  activeProjects: number;
  openTasks: number;
  updateCount: number;
  rating: number;
  lastLogin: string | null;
};

export type AdminProjectRecord = {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  budget: number;
  startDate: string | null;
  dueDate: string | null;
  clientId: string | null;
  clientName: string;
  employees: { id: string; name: string; role: string }[];
  openTasks: number;
  updateCount: number;
};

export type MonthPoint = { label: string; clients: number; employees: number; income: number; invoiced: number };

export type AdminWorkspaceData = {
  dashboard: PortalDashboardData;
  clients: AdminClientRecord[];
  employees: AdminEmployeeRecord[];
  projects: AdminProjectRecord[];
  months: MonthPoint[];
  invoices: { id: string; number: string; amount: number; status: string; dueDate: string | null; clientName: string; projectTitle: string }[];
  recentUpdates: { id: string; title: string; body: string; projectTitle: string; authorName: string; createdAt: string }[];
  notices: string[];
};

type AnyRow = Record<string, unknown>;

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : value == null ? fallback : String(value);
}

function numberValue(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date);
}

function lastSixMonths(): MonthPoint[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return { label: formatMonth(date), clients: 0, employees: 0, income: 0, invoiced: 0 };
  });
}

function emptyData(dashboard: PortalDashboardData, notices: string[]): AdminWorkspaceData {
  return { dashboard, clients: [], employees: [], projects: [], months: lastSixMonths(), invoices: [], recentUpdates: [], notices };
}

export async function getAdminWorkspaceData(): Promise<AdminWorkspaceData> {
  const dashboard = await getPortalDashboard("admin");
  const notices = [...dashboard.notices];

  if (dashboard.mode !== "live") return emptyData(dashboard, notices);

  const db = getSupabaseAdmin() || (await getSupabaseServerClient());
  if (!db) return emptyData(dashboard, [...notices, "The workspace database connection is unavailable."]);

  const [profilesResult, projectsResult, membersResult, tasksResult, updatesResult, reviewsResult, invoicesResult, paymentsResult, activityResult] = await Promise.all([
    db.from("profiles").select("id, full_name, email, role, company_name, job_title, department, is_active, created_at").order("created_at", { ascending: false }).limit(500),
    db.from("projects").select("id, client_id, title, description, status, budget, progress_percent, start_date, due_date, created_at, updated_at").order("updated_at", { ascending: false }).limit(500),
    db.from("project_members").select("id, project_id, employee_id, role_title, assignment_status, due_date, completed_at, assigned_at").limit(1000),
    db.from("tasks").select("id, project_id, assignee_id, title, status, priority, due_date, completed_at, created_at").limit(1500),
    db.from("project_updates").select("id, project_id, author_id, title, body, created_at").order("created_at", { ascending: false }).limit(1000),
    db.from("project_reviews").select("id, project_id, employee_id, reviewer_id, rating, review, review_type, created_at").order("created_at", { ascending: false }).limit(500),
    db.from("invoices").select("id, client_id, project_id, invoice_number, amount, currency, status, due_date, created_at").order("created_at", { ascending: false }).limit(1000),
    db.from("payments").select("id, invoice_id, amount, status, created_at").order("created_at", { ascending: false }).limit(1000),
    db.from("portal_activity_logs").select("id, actor_id, email, event_type, status, created_at").eq("event_type", "login_success").order("created_at", { ascending: false }).limit(1500),
  ]);

  const results = [profilesResult, projectsResult, membersResult, tasksResult, updatesResult, reviewsResult, invoicesResult, paymentsResult, activityResult];
  results.forEach((result) => {
    if (result.error) notices.push(result.error.message);
  });

  const profiles = (profilesResult.data || []) as AnyRow[];
  const projectRows = (projectsResult.data || []) as AnyRow[];
  const members = (membersResult.data || []) as AnyRow[];
  const tasks = (tasksResult.data || []) as AnyRow[];
  const updates = (updatesResult.data || []) as AnyRow[];
  const reviews = (reviewsResult.data || []) as AnyRow[];
  const invoiceRows = (invoicesResult.data || []) as AnyRow[];
  const payments = (paymentsResult.data || []) as AnyRow[];
  const activities = (activityResult.data || []) as AnyRow[];

  const profileById = new Map(profiles.map((profile) => [stringValue(profile.id), profile]));
  const projectById = new Map(projectRows.map((project) => [stringValue(project.id), project]));
  const invoiceById = new Map(invoiceRows.map((invoice) => [stringValue(invoice.id), invoice]));
  const lastLoginByActor = new Map<string, string>();

  activities.forEach((activity) => {
    const actorId = stringValue(activity.actor_id);
    if (actorId && !lastLoginByActor.has(actorId)) lastLoginByActor.set(actorId, stringValue(activity.created_at));
  });

  const clients = profiles
    .filter((profile) => ["business_client", "individual_client"].includes(stringValue(profile.role)))
    .map((profile) => {
      const id = stringValue(profile.id);
      const clientProjects = projectRows.filter((project) => stringValue(project.client_id) === id);
      const pendingAmount = invoiceRows
        .filter((invoice) => stringValue(invoice.client_id) === id && !["paid", "closed", "completed"].includes(stringValue(invoice.status).toLowerCase()))
        .reduce((sum, invoice) => sum + numberValue(invoice.amount), 0);
      return {
        id,
        name: stringValue(profile.full_name, "Client"),
        email: stringValue(profile.email),
        company: stringValue(profile.company_name, "Individual client"),
        activeProjects: clientProjects.filter((project) => !["completed", "closed"].includes(stringValue(project.status).toLowerCase())).length,
        pendingAmount,
        lastLogin: lastLoginByActor.get(id) || null,
      };
    });

  const employees = profiles
    .filter((profile) => stringValue(profile.role) === "employee")
    .map((profile) => {
      const id = stringValue(profile.id);
      const employeeMembers = members.filter((member) => stringValue(member.employee_id) === id);
      const employeeTasks = tasks.filter((task) => stringValue(task.assignee_id) === id);
      const employeeUpdates = updates.filter((update) => stringValue(update.author_id) === id);
      const employeeReviews = reviews.filter((review) => stringValue(review.employee_id) === id && numberValue(review.rating) > 0);
      const rating = employeeReviews.length ? employeeReviews.reduce((sum, review) => sum + numberValue(review.rating), 0) / employeeReviews.length : 0;
      return {
        id,
        name: stringValue(profile.full_name, "Employee"),
        email: stringValue(profile.email),
        jobTitle: stringValue(profile.job_title, "Team member"),
        department: stringValue(profile.department, "Delivery"),
        activeProjects: employeeMembers.filter((member) => !["completed", "closed", "finished"].includes(stringValue(member.assignment_status).toLowerCase())).length,
        openTasks: employeeTasks.filter((task) => !["done", "completed", "closed"].includes(stringValue(task.status).toLowerCase())).length,
        updateCount: employeeUpdates.length,
        rating,
        lastLogin: lastLoginByActor.get(id) || null,
      };
    });

  const projects = projectRows.map((project) => {
    const id = stringValue(project.id);
    const clientId = stringValue(project.client_id) || null;
    const client = clientId ? profileById.get(clientId) : null;
    const projectMembers = members.filter((member) => stringValue(member.project_id) === id);
    return {
      id,
      title: stringValue(project.title, "Untitled project"),
      description: stringValue(project.description, "No description added yet."),
      status: stringValue(project.status, "new"),
      progress: Math.max(0, Math.min(100, numberValue(project.progress_percent))),
      budget: numberValue(project.budget),
      startDate: stringValue(project.start_date) || null,
      dueDate: stringValue(project.due_date) || null,
      clientId,
      clientName: stringValue(client?.company_name || client?.full_name, "Unassigned client"),
      employees: projectMembers.map((member) => {
        const employeeId = stringValue(member.employee_id);
        const employee = profileById.get(employeeId);
        return { id: employeeId, name: stringValue(employee?.full_name, "Team member"), role: stringValue(member.role_title, "Team member") };
      }),
      openTasks: tasks.filter((task) => stringValue(task.project_id) === id && !["done", "completed", "closed"].includes(stringValue(task.status).toLowerCase())).length,
      updateCount: updates.filter((update) => stringValue(update.project_id) === id).length,
    };
  });

  const months = lastSixMonths();
  const monthDates = Array.from({ length: 6 }, (_, index) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
  });
  const monthIndex = new Map(monthDates.map((date, index) => [monthKey(date), index]));

  activities.forEach((activity) => {
    const createdAt = new Date(stringValue(activity.created_at));
    const index = monthIndex.get(monthKey(createdAt));
    if (index == null) return;
    const role = stringValue(profileById.get(stringValue(activity.actor_id))?.role);
    if (role === "employee") months[index].employees += 1;
    if (["business_client", "individual_client"].includes(role)) months[index].clients += 1;
  });

  invoiceRows.forEach((invoice) => {
    const createdAt = new Date(stringValue(invoice.created_at));
    const index = monthIndex.get(monthKey(createdAt));
    if (index != null) months[index].invoiced += numberValue(invoice.amount);
  });

  payments.forEach((payment) => {
    if (!["paid", "success", "completed", "captured"].includes(stringValue(payment.status).toLowerCase())) return;
    const createdAt = new Date(stringValue(payment.created_at));
    const index = monthIndex.get(monthKey(createdAt));
    if (index != null) months[index].income += numberValue(payment.amount);
  });

  const invoices = invoiceRows.map((invoice) => {
    const client = profileById.get(stringValue(invoice.client_id));
    const project = projectById.get(stringValue(invoice.project_id));
    return {
      id: stringValue(invoice.id),
      number: stringValue(invoice.invoice_number, "Invoice"),
      amount: numberValue(invoice.amount),
      status: stringValue(invoice.status, "draft"),
      dueDate: stringValue(invoice.due_date) || null,
      clientName: stringValue(client?.company_name || client?.full_name, "Unassigned client"),
      projectTitle: stringValue(project?.title, "General billing"),
    };
  });

  const recentUpdates = updates.slice(0, 20).map((update) => ({
    id: stringValue(update.id),
    title: stringValue(update.title, "Project update"),
    body: stringValue(update.body),
    projectTitle: stringValue(projectById.get(stringValue(update.project_id))?.title, "Project"),
    authorName: stringValue(profileById.get(stringValue(update.author_id))?.full_name, "HouseOfDev team"),
    createdAt: stringValue(update.created_at),
  }));

  return { dashboard, clients, employees, projects, months, invoices, recentUpdates, notices };
}
