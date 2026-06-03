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

export function getPortalRoute(kind: PortalKind) {
  return portalCopy[kind].route;
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

function addError(notices: string[], label: string, error?: { message?: string } | null) {
  if (error?.message) {
    notices.push(`${label}: ${error.message}`);
  }
}

function isMissingAuthSession(error?: { message?: string } | null) {
  return error?.message?.toLowerCase().includes("auth session missing") || false;
}

async function loadClientDashboard(db: SupabaseClient, profile: PortalProfile, notices: string[]): Promise<PortalDashboardData> {
  const [projectsResult, invoicesResult, ticketsResult] = await Promise.all([
    db
      .from("projects")
      .select("title, status, budget, due_date, updated_at")
      .eq("client_id", profile.id)
      .order("updated_at", { ascending: false })
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
  addError(notices, "Invoices", invoicesResult.error);
  addError(notices, "Support tickets", ticketsResult.error);

  const projects = projectsResult.data || [];
  const invoices = invoicesResult.data || [];
  const tickets = ticketsResult.data || [];
  const activeProjects = projects.filter((project) => !["completed", "closed"].includes(String(project.status))).length;
  const openTickets = tickets.filter((ticket) => !["completed", "closed"].includes(String(ticket.status))).length;
  const pendingInvoices = invoices.filter((invoice) => !["paid", "closed"].includes(String(invoice.status)));
  const pendingAmount = pendingInvoices.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);

  return {
    ...demoDashboard("client", "live", notices, profile),
    stats: [
      { label: "Active Projects", value: String(activeProjects), helper: `${projects.length} total linked projects` },
      { label: "Open Tickets", value: String(openTickets), helper: `${tickets.length} support records` },
      { label: "Pending Invoices", value: formatMoney(pendingAmount), helper: `${pendingInvoices.length} awaiting closure` },
      { label: "Next Due Date", value: formatDate(projects[0]?.due_date), helper: "Nearest visible milestone" },
    ],
    tables: [
      {
        title: "Project Roadmap",
        description: "Live projects linked to your client profile.",
        columns: ["Project", "Status", "Budget", "Due"],
        rows: asRows(projects, (project) => [
          String(project.title || "-"),
          humanize(project.status),
          formatMoney(project.budget),
          formatDate(project.due_date),
        ]),
        emptyText: "No projects are linked to this profile yet.",
      },
      {
        title: "Invoices and Support",
        description: "Live billing and support records linked to your profile.",
        columns: ["Item", "Status", "Amount/Priority", "Updated"],
        rows: [
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
  const [tasksResult, attendanceResult, leaveResult] = await Promise.all([
    db
      .from("tasks")
      .select("title, status, due_date, project_id, created_at")
      .eq("assignee_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(8),
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
  ]);

  addError(notices, "Tasks", tasksResult.error);
  addError(notices, "Attendance", attendanceResult.error);
  addError(notices, "Leave requests", leaveResult.error);

  const tasks = tasksResult.data || [];
  const attendance = attendanceResult.data || [];
  const leaveRequests = leaveResult.data || [];
  const openTasks = tasks.filter((task) => !["done", "completed", "closed"].includes(String(task.status))).length;
  const pendingLeaves = leaveRequests.filter((request) => ["new", "reviewing"].includes(String(request.status))).length;

  return {
    ...demoDashboard("employee", "live", notices, profile),
    stats: [
      { label: "Assigned Tasks", value: String(openTasks), helper: `${tasks.length} recent task records` },
      { label: "Logged Days", value: String(attendance.length), helper: "Recent attendance entries" },
      { label: "Leave Requests", value: String(pendingLeaves), helper: `${leaveRequests.length} total visible requests` },
      { label: "Next Due Date", value: formatDate(tasks[0]?.due_date), helper: "Nearest visible assignment" },
    ],
    tables: [
      {
        title: "Task Queue",
        description: "Live tasks assigned to your employee profile.",
        columns: ["Task", "Project", "Status", "Due"],
        rows: asRows(tasks, (task) => [
          String(task.title || "-"),
          task.project_id ? String(task.project_id).slice(0, 8) : "-",
          humanize(task.status),
          formatDate(task.due_date),
        ]),
        emptyText: "No tasks are assigned yet.",
      },
      {
        title: "Attendance and Leave",
        description: "Live attendance entries and leave requests.",
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
    contactCount,
    careerCount,
    profileCount,
    projectCount,
    invoiceCount,
    paymentCount,
    ticketCount,
    contactResult,
    careerResult,
    projectResult,
    invoiceResult,
  ] = await Promise.all([
    countRows(db, "contact_requests", notices, "Contact count"),
    countRows(db, "career_applications", notices, "Career count"),
    countRows(db, "profiles", notices, "Profile count"),
    countRows(db, "projects", notices, "Project count"),
    countRows(db, "invoices", notices, "Invoice count"),
    countRows(db, "payments", notices, "Payment count"),
    countRows(db, "support_tickets", notices, "Ticket count"),
    db
      .from("contact_requests")
      .select("full_name, company_name, service_required, status, created_at")
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

  addError(notices, "Recent contacts", contactResult.error);
  addError(notices, "Recent careers", careerResult.error);
  addError(notices, "Recent projects", projectResult.error);
  addError(notices, "Recent invoices", invoiceResult.error);

  return {
    ...demoDashboard("admin", "live", notices, profile),
    stats: [
      { label: "Leads", value: String(contactCount), helper: "Contact requests" },
      { label: "Candidates", value: String(careerCount), helper: "Career applications" },
      { label: "Projects", value: String(projectCount), helper: `${profileCount} user profiles` },
      { label: "Finance", value: `${invoiceCount}/${paymentCount}`, helper: `${ticketCount} support tickets` },
    ],
    tables: [
      {
        title: "Latest Contact Requests",
        description: "Live sales inquiries from website forms.",
        columns: ["Name", "Company", "Service", "Status"],
        rows: asRows(contactResult.data || [], (request) => [
          String(request.full_name || "-"),
          String(request.company_name || "-"),
          String(request.service_required || "-"),
          humanize(request.status),
        ]),
        emptyText: "No contact requests yet.",
      },
      {
        title: "Careers, Projects, and Finance",
        description: "Recent hiring, delivery, and billing records.",
        columns: ["Item", "Type", "Status", "Signal"],
        rows: [
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
      "Supabase backend is not fully configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in Vercel to switch from demo data to live records.",
    );
    return demoDashboard(kind, "demo", notices);
  }

  const serverClient = await getSupabaseServerClient();

  if (!serverClient) {
    notices.push("Supabase Auth is unavailable in this runtime.");
    return demoDashboard(kind, "error", notices);
  }

  const {
    data: { user },
    error: userError,
  } = await serverClient.auth.getUser();

  if (userError && !isMissingAuthSession(userError)) {
    notices.push(`Authentication check failed: ${userError.message}`);
  }

  if (!user) {
    notices.push("Sign in with a Supabase Auth user whose profile role is allowed for this portal. Demo data is shown until a valid session is available.");
    return demoDashboard(kind, "signed_out", notices, null);
  }

  const db = getSupabaseAdmin() || serverClient;
  const profile = await loadProfile(db, user);

  if (!canAccessPortal(kind, profile.role)) {
    notices.push(
      `${getPortalRoleLabel(profile.role)} accounts cannot access ${getPortalTitle(kind)}. Use the correct portal or ask an admin to update the profile role.`,
    );
    return demoDashboard(kind, "unauthorized", notices, profile);
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
    return demoDashboard(kind, "error", notices, profile);
  }
}
