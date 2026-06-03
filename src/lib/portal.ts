import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAdmin,
  getSupabaseServerClient,
  isPortalBackendConfigured,
  isSupabaseAdminConfigured,
  isSupabasePublicConfigured,
  type UserRole,
} from "@/lib/supabase";

export type PortalKind = "client" | "employee" | "admin";
export type PortalMode = "live" | "demo" | "signed_out" | "unauthorized" | "error";

export type PortalProfile = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  companyName: string | null;
};

export type PortalStat = {
  label: string;
  value: string;
  helper: string;
};

export type PortalTable = {
  title: string;
  description: string;
  columns: string[];
  rows: string[][];
  emptyText: string;
};

export type PortalDashboardData = {
  kind: PortalKind;
  mode: PortalMode;
  backendConfigured: boolean;
  authConfigured: boolean;
  title: string;
  subtitle: string;
  eyebrow: string;
  profile: PortalProfile | null;
  stats: PortalStat[];
  tables: PortalTable[];
  notices: string[];
};

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    company_name?: string;
  };
};

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  employee: "Employee",
  business_client: "Business Client",
  individual_client: "Individual Client",
};

const portalCopy: Record<PortalKind, { title: string; subtitle: string; eyebrow: string; route: string }> = {
  client: {
    title: "Client Portal",
    subtitle: "Project status, invoices, support requests, and delivery updates in one place.",
    eyebrow: "Client Workspace",
    route: "/portal",
  },
  employee: {
    title: "Employee Portal",
    subtitle: "Tasks, attendance, leave requests, and internal operations for the delivery team.",
    eyebrow: "Employee Workspace",
    route: "/employee-portal",
  },
  admin: {
    title: "Admin Dashboard",
    subtitle: "Business control center for leads, candidates, projects, finance, users, and support.",
    eyebrow: "Admin Operations",
    route: "/admin-dashboard",
  },
};

const roleAccess: Record<PortalKind, UserRole[]> = {
  client: ["individual_client", "business_client", "admin", "super_admin"],
  employee: ["employee", "admin", "super_admin"],
  admin: ["admin", "super_admin"],
};

const defaultPortalByRole: Record<UserRole, PortalKind> = {
  super_admin: "admin",
  admin: "admin",
  employee: "employee",
  business_client: "client",
  individual_client: "client",
};

export function getPortalRoute(kind: PortalKind) {
  return portalCopy[kind].route;
}

export function getDefaultPortalRouteForRole(role: UserRole) {
  return getPortalRoute(defaultPortalByRole[role]);
}

export function getPortalRoleLabel(role: UserRole) {
  return roleLabels[role];
}

export function getPortalTitle(kind: PortalKind) {
  return portalCopy[kind].title;
}

export function canAccessPortal(kind: PortalKind, role: UserRole) {
  return roleAccess[kind].includes(role);
}

function humanize(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(value: number | string | null | undefined, currency = "INR") {
  const amount = Number(value || 0);

  if (!amount) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number | string | null | undefined) {
  const percent = Number(value || 0);

  if (!percent) {
    return "0%";
  }

  return `${Math.min(100, Math.max(0, Math.round(percent)))}%`;
}

function asRows<T>(
  data: T[] | null,
  mapper: (item: T) => string[],
) {
  return (data || []).map(mapper);
}

function sampleProfile(kind: PortalKind): PortalProfile {
  if (kind === "employee") {
    return {
      id: "demo-employee",
      fullName: "HouseOfDev Team Member",
      email: "employee@houseofdev.com",
      role: "employee",
      companyName: "HouseOfDev",
    };
  }

  if (kind === "admin") {
    return {
      id: "demo-admin",
      fullName: "HouseOfDev Admin",
      email: "admin@houseofdev.com",
      role: "admin",
      companyName: "HouseOfDev",
    };
  }

  return {
    id: "demo-client",
    fullName: "Demo Client",
    email: "client@example.com",
    role: "business_client",
    companyName: "Demo Business",
  };
}

function accessDashboard(kind: PortalKind, mode: PortalMode, notices: string[], profile?: PortalProfile | null): PortalDashboardData {
  const copy = portalCopy[kind];

  return {
    kind,
    mode,
    backendConfigured: isPortalBackendConfigured(),
    authConfigured: isSupabasePublicConfigured(),
    title: copy.title,
    subtitle: copy.subtitle,
    eyebrow: copy.eyebrow,
    profile: profile || null,
    stats: [],
    tables: [],
    notices,
  };
}

function demoDashboard(kind: PortalKind, mode: PortalMode, notices: string[], profile?: PortalProfile | null): PortalDashboardData {
  const copy = portalCopy[kind];
  const demoProfile = profile || sampleProfile(kind);

  if (kind === "employee") {
    return {
      kind,
      mode,
      backendConfigured: isPortalBackendConfigured(),
      authConfigured: isSupabasePublicConfigured(),
      title: copy.title,
      subtitle: copy.subtitle,
      eyebrow: copy.eyebrow,
      profile: demoProfile,
      notices,
      stats: [
        { label: "Assigned Tasks", value: "8", helper: "3 due this week" },
        { label: "Logged Days", value: "19", helper: "This month" },
        { label: "Leave Requests", value: "1", helper: "Awaiting review" },
        { label: "Open Projects", value: "4", helper: "Across delivery teams" },
      ],
      tables: [
        {
          title: "Task Queue",
          description: "Current work assigned to this team member.",
          columns: ["Task", "Project", "Status", "Due"],
          rows: [
            ["Launch QA checklist", "Clinic Website", "In Progress", "08 Jun 2026"],
            ["Wireframe client dashboard", "Client Portal", "Review", "10 Jun 2026"],
            ["Prepare deployment notes", "Restaurant Site", "Todo", "12 Jun 2026"],
          ],
          emptyText: "No tasks are assigned yet.",
        },
        {
          title: "Attendance and Leave",
          description: "Recent attendance entries and leave requests.",
          columns: ["Date", "Type", "Status", "Notes"],
          rows: [
            ["03 Jun 2026", "Attendance", "Checked In", "Remote"],
            ["15 Jun 2026", "Leave", "Reviewing", "Personal leave"],
          ],
          emptyText: "No attendance or leave activity yet.",
        },
      ],
    };
  }

  if (kind === "admin") {
    return {
      kind,
      mode,
      backendConfigured: isPortalBackendConfigured(),
      authConfigured: isSupabasePublicConfigured(),
      title: copy.title,
      subtitle: copy.subtitle,
      eyebrow: copy.eyebrow,
      profile: demoProfile,
      notices,
      stats: [
        { label: "New Leads", value: "12", helper: "Contact requests" },
        { label: "Candidates", value: "7", helper: "Career applications" },
        { label: "Active Projects", value: "6", helper: "Delivery pipeline" },
        { label: "Open Tickets", value: "9", helper: "Client support" },
      ],
      tables: [
        {
          title: "Latest Contact Requests",
          description: "Recent sales inquiries ready for follow-up.",
          columns: ["Name", "Company", "Service", "Status"],
          rows: [
            ["Arun Kumar", "BuildPro", "Web Application Development", "New"],
            ["Priya S", "Smart Academy", "Business Website Development", "Reviewing"],
            ["Naveen R", "Urban Taste", "AI Chatbot Development", "In Progress"],
          ],
          emptyText: "No contact requests yet.",
        },
        {
          title: "Business Operations",
          description: "Projects, invoices, payments, and support workload.",
          columns: ["Area", "Current Signal", "Status", "Owner"],
          rows: [
            ["Projects", "6 active", "In Progress", "Delivery"],
            ["Invoices", "INR 2.4L pending", "Reviewing", "Finance"],
            ["Support", "9 tickets", "New", "Operations"],
          ],
          emptyText: "No operations data yet.",
        },
      ],
    };
  }

  return {
    kind,
    mode,
    backendConfigured: isPortalBackendConfigured(),
    authConfigured: isSupabasePublicConfigured(),
    title: copy.title,
    subtitle: copy.subtitle,
    eyebrow: copy.eyebrow,
    profile: demoProfile,
    notices,
    stats: [
      { label: "Active Projects", value: "3", helper: "2 in delivery" },
      { label: "Open Tickets", value: "2", helper: "Average first reply under 1 day" },
      { label: "Invoices", value: "INR 84K", helper: "1 awaiting payment" },
      { label: "Milestones", value: "5", helper: "Next release this week" },
    ],
    tables: [
      {
        title: "Project Roadmap",
        description: "Delivery status and next target dates.",
        columns: ["Project", "Status", "Budget", "Due"],
        rows: [
          ["Business Website", "In Progress", "INR 24,999", "07 Jun 2026"],
          ["Client Portal", "Reviewing", "INR 75,000", "14 Jun 2026"],
          ["SEO Foundation", "Completed", "INR 9,999", "31 May 2026"],
        ],
        emptyText: "No projects are linked to this profile yet.",
      },
      {
        title: "Invoices and Support",
        description: "Billing status and active support conversations.",
        columns: ["Item", "Status", "Amount/Priority", "Updated"],
        rows: [
          ["INV-2026-014", "Pending", "INR 42,000", "02 Jun 2026"],
          ["Homepage content update", "New", "Normal", "03 Jun 2026"],
        ],
        emptyText: "No invoices or support tickets are linked yet.",
      },
    ],
  };
}

async function loadProfile(db: SupabaseClient, user: AuthUser): Promise<PortalProfile> {
  const { data, error } = await db
    .from("profiles")
    .select("id, full_name, email, role, company_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!error && data) {
    return {
      id: String(data.id),
      fullName: String(data.full_name || user.email || "Portal User"),
      email: String(data.email || user.email || ""),
      role: data.role as UserRole,
      companyName: data.company_name || null,
    };
  }

  return {
    id: user.id,
    fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email || "Portal User",
    email: user.email || "",
    role: "individual_client",
    companyName: user.user_metadata?.company_name || null,
  };
}

function isMissingSchemaFeature(error?: { message?: string } | null) {
  const message = error?.message?.toLowerCase() || "";

  return (
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("could not find") ||
    message.includes("column")
  );
}

function addError(notices: string[], label: string, error?: { message?: string } | null) {
  if (error?.message) {
    notices.push(
      isMissingSchemaFeature(error)
        ? `${label} is not fully set up yet. Run database/portal-system-migration.sql in Supabase.`
        : `${label}: ${error.message}`,
    );
  }
}

function isMissingAuthSession(error?: { message?: string } | null) {
  return error?.message?.toLowerCase().includes("auth session missing") || false;
}

async function loadClientDashboard(db: SupabaseClient, profile: PortalProfile, notices: string[]): Promise<PortalDashboardData> {
  let projectsResult = await db
    .from("projects")
    .select("title, status, budget, credit_cost, progress_percent, due_date, updated_at")
    .eq("client_id", profile.id)
    .order("updated_at", { ascending: false })
    .limit(8);

  if (projectsResult.error && isMissingSchemaFeature(projectsResult.error)) {
    projectsResult = (await db
      .from("projects")
      .select("title, status, budget, due_date, updated_at")
      .eq("client_id", profile.id)
      .order("updated_at", { ascending: false })
      .limit(8)) as typeof projectsResult;
  }

  const [accountResult, creditLedgerResult, invoicesResult, ticketsResult] = await Promise.all([
    db
      .from("client_accounts")
      .select("credit_balance, credit_limit, account_status, updated_at")
      .eq("profile_id", profile.id)
      .maybeSingle(),
    db
      .from("client_credit_ledger")
      .select("credit_change, description, created_at")
      .eq("client_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("invoices")
      .select("invoice_number, amount, currency, status, due_date, created_at")
      .eq("client_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("support_tickets")
      .select("subject, priority, status, updated_at, created_at")
      .eq("client_id", profile.id)
      .order("updated_at", { ascending: false })
      .limit(8),
  ]);

  addError(notices, "Projects", projectsResult.error);
  addError(notices, "Client credits", accountResult.error);
  addError(notices, "Credit ledger", creditLedgerResult.error);
  addError(notices, "Invoices", invoicesResult.error);
  addError(notices, "Support tickets", ticketsResult.error);

  const projects = projectsResult.data || [];
  const account = accountResult.data || null;
  const creditLedger = creditLedgerResult.data || [];
  const invoices = invoicesResult.data || [];
  const tickets = ticketsResult.data || [];
  const activeProjects = projects.filter((project) => !["completed", "closed"].includes(String(project.status))).length;
  const openTickets = tickets.filter((ticket) => !["completed", "closed"].includes(String(ticket.status))).length;
  const pendingInvoices = invoices.filter((invoice) => !["paid", "closed"].includes(String(invoice.status)));
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
  const creditBalance = Number(account?.credit_balance || 0);
  const creditLimit = Number(account?.credit_limit || 0);

  return {
    ...demoDashboard("client", "live", notices, profile),
    stats: [
      { label: "Active Projects", value: String(activeProjects), helper: `${projects.length} total linked projects` },
      { label: "Credits Available", value: formatMoney(creditBalance), helper: `${formatMoney(creditLimit)} account limit` },
      { label: "Pending Invoices", value: formatMoney(pendingAmount), helper: `${pendingInvoices.length} awaiting closure` },
      { label: "Open Tickets", value: String(openTickets), helper: `${tickets.length} support records` },
    ],
    tables: [
      {
        title: "Project Roadmap",
        description: "Live project status, progress, and credit usage linked to your client profile.",
        columns: ["Project", "Status", "Progress", "Credits"],
        rows: asRows(projects, (project) => [
          String(project.title || "-"),
          humanize(project.status),
          formatPercent(project.progress_percent),
          project.credit_cost ? formatMoney(project.credit_cost) : formatMoney(project.budget),
        ]),
        emptyText: "No projects are linked to this profile yet.",
      },
      {
        title: "Credits, Invoices, and Support",
        description: "Live credit movements, billing status, and support conversations.",
        columns: ["Item", "Status", "Amount/Priority", "Updated"],
        rows: [
          ...asRows(creditLedger, (entry) => [
            String(entry.description || "Credit update"),
            Number(entry.credit_change || 0) >= 0 ? "Credit Added" : "Credit Used",
            formatMoney(Math.abs(Number(entry.credit_change || 0))),
            formatDate(entry.created_at),
          ]),
          ...asRows(invoices, (invoice) => [
            String(invoice.invoice_number || "-"),
            humanize(invoice.status),
            formatMoney(invoice.amount, String(invoice.currency || "INR")),
            formatDate(invoice.due_date || invoice.created_at),
          ]),
          ...asRows(tickets, (ticket) => [
            String(ticket.subject || "-"),
            humanize(ticket.status),
            humanize(ticket.priority),
            formatDate(ticket.updated_at || ticket.created_at),
          ]),
        ],
        emptyText: "No invoices or support tickets are linked yet.",
      },
    ],
  };
}

async function loadEmployeeDashboard(db: SupabaseClient, profile: PortalProfile, notices: string[]): Promise<PortalDashboardData> {
  let tasksResult = await db
    .from("tasks")
    .select("title, status, priority, exp_points, due_date, project_id, created_at")
    .eq("assignee_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(8);

  if (tasksResult.error && isMissingSchemaFeature(tasksResult.error)) {
    tasksResult = (await db
      .from("tasks")
      .select("title, status, due_date, project_id, created_at")
      .eq("assignee_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8)) as typeof tasksResult;
  }

  const [attendanceResult, leaveResult, assignmentsResult, reviewsResult, xpResult] = await Promise.all([
    db
      .from("employee_attendance")
      .select("work_date, check_in, check_out, mode, notes")
      .eq("employee_id", profile.id)
      .order("work_date", { ascending: false })
      .limit(8),
    db
      .from("leave_requests")
      .select("start_date, end_date, reason, status, created_at")
      .eq("employee_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("project_members")
      .select("project_id, role_title, assignment_status, due_date, completed_at, assigned_at")
      .eq("employee_id", profile.id)
      .order("assigned_at", { ascending: false })
      .limit(12),
    db
      .from("project_reviews")
      .select("project_id, rating, review, review_type, created_at")
      .eq("employee_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("employee_xp_events")
      .select("points, reason, project_id, created_at")
      .eq("employee_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  addError(notices, "Tasks", tasksResult.error);
  addError(notices, "Attendance", attendanceResult.error);
  addError(notices, "Leave requests", leaveResult.error);
  addError(notices, "Project assignments", assignmentsResult.error);
  addError(notices, "Project reviews", reviewsResult.error);
  addError(notices, "EXP records", xpResult.error);

  const tasks = tasksResult.data || [];
  const attendance = attendanceResult.data || [];
  const leaveRequests = leaveResult.data || [];
  const assignments = assignmentsResult.data || [];
  const reviews = reviewsResult.data || [];
  const xpEvents = xpResult.data || [];
  const projectIds = Array.from(
    new Set(
      [...tasks.map((task) => task.project_id), ...assignments.map((assignment) => assignment.project_id), ...reviews.map((review) => review.project_id)]
        .filter(Boolean)
        .map(String),
    ),
  );
  let projectResult = projectIds.length
    ? await db
        .from("projects")
        .select("id, title, status, due_date, progress_percent")
        .in("id", projectIds)
    : { data: [], error: null };

  if (projectResult.error && isMissingSchemaFeature(projectResult.error)) {
    projectResult = projectIds.length
      ? ((await db
          .from("projects")
          .select("id, title, status, due_date")
          .in("id", projectIds)) as typeof projectResult)
      : { data: [], error: null };
  }

  addError(notices, "Assigned project details", projectResult.error);

  const projectById = new Map((projectResult.data || []).map((project) => [String(project.id), project]));
  const openTasks = tasks.filter((task) => !["done", "completed", "closed"].includes(String(task.status))).length;
  const pendingLeaves = leaveRequests.filter((request) => ["new", "reviewing"].includes(String(request.status))).length;
  const activeAssignments = assignments.filter((assignment) => !["finished", "completed", "closed"].includes(String(assignment.assignment_status))).length;
  const finishedAssignments = assignments.filter((assignment) => ["finished", "completed", "closed"].includes(String(assignment.assignment_status))).length;
  const totalXp = xpEvents.reduce((sum, event) => sum + Number(event.points || 0), 0);

  return {
    ...demoDashboard("employee", "live", notices, profile),
    stats: [
      { label: "EXP Points", value: String(totalXp), helper: `${xpEvents.length} recent EXP records` },
      { label: "Assigned Projects", value: String(activeAssignments), helper: `${finishedAssignments} finished projects` },
      { label: "Logged Days", value: String(attendance.length), helper: "Recent attendance entries" },
      { label: "Assigned Tasks", value: String(openTasks), helper: `${pendingLeaves} leave requests in review` },
    ],
    tables: [
      {
        title: "Assigned and Upcoming Projects",
        description: "Projects assigned to your employee profile, including upcoming and finished work.",
        columns: ["Project", "Role", "Stage", "Due/Done"],
        rows: asRows(assignments, (assignment) => {
          const project = projectById.get(String(assignment.project_id));

          return [
            String(project?.title || assignment.project_id || "-"),
            String(assignment.role_title || "Team Member"),
            humanize(assignment.assignment_status),
            formatDate(assignment.completed_at || assignment.due_date || project?.due_date),
          ];
        }),
        emptyText: "No project assignments are linked to this profile yet.",
      },
      {
        title: "Task Queue",
        description: "Live tasks assigned to your employee profile.",
        columns: ["Task", "Project", "Status", "EXP"],
        rows: asRows(tasks, (task) => [
          String(task.title || "-"),
          task.project_id ? String(projectById.get(String(task.project_id))?.title || String(task.project_id).slice(0, 8)) : "-",
          humanize(task.status),
          task.exp_points ? `${task.exp_points} XP` : formatDate(task.due_date),
        ]),
        emptyText: "No tasks are assigned yet.",
      },
      {
        title: "Attendance, Leave, Reviews, and EXP",
        description: "Live attendance entries, leave requests, finished project reviews, and EXP activity.",
        columns: ["Date", "Type", "Status", "Notes"],
        rows: [
          ...asRows(attendance, (entry) => [
            formatDate(entry.work_date),
            humanize(entry.mode),
            entry.check_out ? "Checked Out" : entry.check_in ? "Checked In" : "Not Started",
            String(entry.notes || "-"),
          ]),
          ...asRows(leaveRequests, (request) => [
            `${formatDate(request.start_date)} - ${formatDate(request.end_date)}`,
            "Leave",
            humanize(request.status),
            String(request.reason || "-"),
          ]),
          ...asRows(reviews, (review) => [
            formatDate(review.created_at),
            "Project Review",
            review.rating ? `${review.rating}/5` : humanize(review.review_type),
            String(review.review || "-"),
          ]),
          ...asRows(xpEvents, (event) => [
            formatDate(event.created_at),
            "EXP",
            `${Number(event.points || 0)} XP`,
            String(event.reason || "-"),
          ]),
        ],
        emptyText: "No attendance or leave activity yet.",
      },
    ],
  };
}

async function countRows(db: SupabaseClient, table: string, notices: string[], label: string) {
  const { count, error } = await db.from(table).select("id", { count: "exact", head: true });
  addError(notices, label, error);
  return count || 0;
}

async function loadAdminDashboard(db: SupabaseClient, profile: PortalProfile, notices: string[]): Promise<PortalDashboardData> {
  const [
    accessCount,
    contactCount,
    careerCount,
    profileCount,
    clientAccountCount,
    assignmentCount,
    xpCount,
    projectCount,
    invoiceCount,
    paymentCount,
    ticketCount,
    accessResult,
    contactResult,
    profileResult,
    careerResult,
    projectResult,
    invoiceResult,
  ] = await Promise.all([
    countRows(db, "portal_access_requests", notices, "Portal access count"),
    countRows(db, "contact_requests", notices, "Contact count"),
    countRows(db, "career_applications", notices, "Career count"),
    countRows(db, "profiles", notices, "Profile count"),
    countRows(db, "client_accounts", notices, "Client account count"),
    countRows(db, "project_members", notices, "Project assignment count"),
    countRows(db, "employee_xp_events", notices, "EXP count"),
    countRows(db, "projects", notices, "Project count"),
    countRows(db, "invoices", notices, "Invoice count"),
    countRows(db, "payments", notices, "Payment count"),
    countRows(db, "support_tickets", notices, "Ticket count"),
    db
      .from("portal_access_requests")
      .select("full_name, company_name, account_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("contact_requests")
      .select("full_name, company_name, service_required, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("profiles")
      .select("full_name, email, role, company_name, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("career_applications")
      .select("full_name, role, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("projects")
      .select("title, status, budget, due_date, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db
      .from("invoices")
      .select("invoice_number, amount, currency, status, due_date, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  addError(notices, "Portal access requests", accessResult.error);
  addError(notices, "Recent contacts", contactResult.error);
  addError(notices, "User profiles", profileResult.error);
  addError(notices, "Recent careers", careerResult.error);
  addError(notices, "Recent projects", projectResult.error);
  addError(notices, "Recent invoices", invoiceResult.error);

  return {
    ...demoDashboard("admin", "live", notices, profile),
    stats: [
      { label: "Access Requests", value: String(accessCount), helper: `${contactCount} contact leads, ${careerCount} career applications` },
      { label: "Users", value: String(profileCount), helper: `${clientAccountCount} client credit accounts` },
      { label: "Delivery", value: String(projectCount), helper: `${assignmentCount} employee assignments, ${xpCount} EXP records` },
      { label: "Finance", value: `${invoiceCount}/${paymentCount}`, helper: `${ticketCount} support tickets` },
    ],
    tables: [
      {
        title: "Portal Access Requests",
        description: "Account requests from client, employee, and admin users before credentials are created.",
        columns: ["Name", "Company", "Account", "Status"],
        rows: [
          ...asRows(accessResult.data || [], (request) => [
            String(request.full_name || "-"),
            String(request.company_name || "-"),
            String(request.account_type || "-"),
            humanize(request.status),
          ]),
          ...asRows(contactResult.data || [], (request) => [
            String(request.full_name || "-"),
            String(request.company_name || "-"),
            String(request.service_required || "-"),
            humanize(request.status),
          ]),
        ],
        emptyText: "No portal access requests yet.",
      },
      {
        title: "Users, Careers, Projects, and Finance",
        description: "Recent users, hiring, delivery, and billing records.",
        columns: ["Item", "Type", "Status", "Signal"],
        rows: [
          ...asRows(profileResult.data || [], (userProfile) => [
            String(userProfile.full_name || userProfile.email || "-"),
            humanize(userProfile.role),
            String(userProfile.company_name || "-"),
            formatDate(userProfile.created_at),
          ]),
          ...asRows(careerResult.data || [], (application) => [
            String(application.full_name || "-"),
            String(application.role || "Career"),
            humanize(application.status),
            formatDate(application.created_at),
          ]),
          ...asRows(projectResult.data || [], (project) => [
            String(project.title || "-"),
            "Project",
            humanize(project.status),
            formatMoney(project.budget),
          ]),
          ...asRows(invoiceResult.data || [], (invoice) => [
            String(invoice.invoice_number || "-"),
            "Invoice",
            humanize(invoice.status),
            formatMoney(invoice.amount, String(invoice.currency || "INR")),
          ]),
        ],
        emptyText: "No operational records yet.",
      },
    ],
  };
}

export async function getPortalDashboard(kind: PortalKind): Promise<PortalDashboardData> {
  const notices: string[] = [];
  const authConfigured = isSupabasePublicConfigured();

  if (!authConfigured || !isSupabaseAdminConfigured()) {
    notices.push(
      "Secure account access is not fully configured yet. Book a free consultation or ask the HouseOfDev team to activate your account.",
    );
    return accessDashboard(kind, "demo", notices);
  }

  const serverClient = await getSupabaseServerClient();

  if (!serverClient) {
    notices.push("Secure login is unavailable in this runtime. Please request access and the team will contact you.");
    return accessDashboard(kind, "error", notices);
  }

  const {
    data: { user },
    error: userError,
  } = await serverClient.auth.getUser();

  if (userError && !isMissingAuthSession(userError)) {
    notices.push(`Authentication check failed: ${userError.message}`);
  }

  if (!user) {
    notices.push("Sign in with your HouseOfDev account. If you do not have one yet, request access and book a free consultation.");
    return accessDashboard(kind, "signed_out", notices, null);
  }

  const db = getSupabaseAdmin() || serverClient;
  const profile = await loadProfile(db, user);

  if (!canAccessPortal(kind, profile.role)) {
    notices.push(
      `${getPortalRoleLabel(profile.role)} accounts cannot access ${getPortalTitle(kind)}. Use the correct portal or ask an admin to update the profile role.`,
    );
    return accessDashboard(kind, "unauthorized", notices, profile);
  }

  try {
    if (kind === "employee") {
      return loadEmployeeDashboard(db, profile, notices);
    }

    if (kind === "admin") {
      return loadAdminDashboard(db, profile, notices);
    }

    return loadClientDashboard(db, profile, notices);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown portal data error.";
    notices.push(`Portal data failed to load: ${message}`);
    return accessDashboard(kind, "error", notices, profile);
  }
}
