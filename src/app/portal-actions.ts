"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendNotificationEmail } from "@/lib/email";
import { getDefaultPortalRouteForRole } from "@/lib/portal";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const allowedReturnPaths = new Set(["/portal", "/employee-portal", "/admin-dashboard"]);
const accessTypes = new Set(["Client account", "Employee account", "Admin account"]);
const attendanceModes = new Set(["office", "remote", "hybrid", "field"]);
const attendanceRoles = new Set<UserRole>(["employee", "admin", "super_admin"]);
const credentialRoles = new Set<UserRole>(["admin", "employee", "business_client", "individual_client"]);
const adminRoles = new Set<UserRole>(["admin", "super_admin"]);

function cleanReturnTo(value: FormDataEntryValue | null) {
  const path = String(value || "/portal");
  return allowedReturnPaths.has(path) ? path : "/portal";
}

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?portal_error=${encodeURIComponent(message)}`);
}

function noticeRedirect(path: string, message: string): never {
  redirect(`${path}?portal_notice=${encodeURIComponent(message)}`);
}

function getFirstIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "anonymous";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function rows(payload: Record<string, string | null | undefined>) {
  return Object.entries(payload)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#475569">${escapeHtml(label)}</td><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;font-weight:600">${escapeHtml(value || "-")}</td></tr>`,
    )
    .join("");
}

async function assertRateLimit(scope: string) {
  const headerStore = await headers();
  const ip = getFirstIp(headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip"));
  return checkRateLimit(`${scope}:${ip}`);
}

async function getRequestOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto") || "http";

  return host ? `${proto}://${host}` : "http://localhost:3000";
}

async function getSignedInRole(userId: string): Promise<UserRole | null> {
  const db = getSupabaseAdmin() || (await getSupabaseServerClient());

  if (!db) {
    return null;
  }

  const { data } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return data?.role ? (data.role as UserRole) : null;
}

async function getSignedInPortalUser(returnTo: string) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase Auth is not configured for this deployment.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    errorRedirect(returnTo, "Sign in before using this portal action.");
  }

  const role = await getSignedInRole(user.id);

  if (!role) {
    errorRedirect(returnTo, "Your account profile is missing. Ask an admin to activate your role.");
  }

  return { user, role };
}

function getIndiaWorkDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function cleanAttendanceMode(value: FormDataEntryValue | null) {
  const mode = String(value || "office").trim().toLowerCase();
  return attendanceModes.has(mode) ? mode : "office";
}

function cleanCredentialRole(value: FormDataEntryValue | null): UserRole | null {
  const role = String(value || "").trim() as UserRole;
  return credentialRoles.has(role) ? role : null;
}

function parseCreditAmount(value: FormDataEntryValue | null) {
  const raw = String(value || "").trim();

  if (!raw) {
    return 0;
  }

  const amount = Number(raw);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

async function storePortalAccessRequest(payload: {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  accountType: string;
  message: string;
  requestMessage: string;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { stored: false, target: "none" };
  }

  const portalResult = await supabase.from("portal_access_requests").insert({
    full_name: payload.fullName,
    company_name: payload.companyName || null,
    email: payload.email,
    phone: payload.phone,
    account_type: payload.accountType,
    message: payload.message || "Please contact me for a free consultation.",
    source: "portal-access",
    status: "new",
  });

  if (!portalResult.error) {
    return { stored: true, target: "portal_access_requests" };
  }

  const contactPayload = {
    full_name: payload.fullName,
    company_name: payload.companyName || "Not provided",
    email: payload.email,
    phone: payload.phone,
    industry: "Portal access",
    budget: "Account request",
    service_required: payload.accountType,
    message: payload.requestMessage,
    source: "portal-access",
    status: "new",
  };

  const contactResult = await supabase.from("contact_requests").insert(contactPayload);

  if (!contactResult.error) {
    return { stored: true, target: "contact_requests" };
  }

  const legacyContactResult = await supabase.from("contact_requests").insert({
    ...contactPayload,
    source: undefined,
  });

  if (!legacyContactResult.error) {
    return { stored: true, target: "contact_requests_legacy" };
  }

  console.error("Portal access request storage failed", {
    portalAccessRequests: portalResult.error.message,
    contactRequests: contactResult.error.message,
    legacyContactRequests: legacyContactResult.error.message,
  });

  return { stored: false, target: "failed" };
}

export async function signInToPortal(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    errorRedirect(returnTo, "Enter your email and password.");
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase Auth is not configured for this deployment.");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    errorRedirect(returnTo, error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user ? await getSignedInRole(user.id) : null;

  redirect(role ? getDefaultPortalRouteForRole(role) : returnTo);
}

export async function signOutFromPortal(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(returnTo);
}

export async function requestPortalAccess(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const limited = await assertRateLimit("portal-access");

  if (!limited) {
    errorRedirect(returnTo, "Too many requests. Please wait a minute and try again.");
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const companyName = String(formData.get("companyName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const accountType = String(formData.get("accountType") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const website = String(formData.get("website") || "").trim();

  if (website) {
    noticeRedirect(returnTo, "Thanks. Your request has been received.");
  }

  if (fullName.length < 2 || !email.includes("@") || phone.length < 8 || !accessTypes.has(accountType)) {
    errorRedirect(returnTo, "Enter your name, email, phone number, and requested account type.");
  }

  const requestMessage = [
    `Portal account request: ${accountType}`,
    companyName ? `Company: ${companyName}` : "Company: Not provided",
    message ? `Message: ${message}` : "Message: Please contact me for a free consultation.",
  ].join("\n");

  const storage = await storePortalAccessRequest({
    fullName,
    companyName,
    email,
    phone,
    accountType,
    message,
    requestMessage,
  });

  let emailSent = false;

  try {
    const emailResult = await sendNotificationEmail({
      subject: `HouseOfDev portal access request - ${accountType}`,
      html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#0f172a">Portal access request</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
        Name: fullName,
        Company: companyName || "Not provided",
        Email: email,
        Phone: phone,
        Account: accountType,
        Message: message || "Please contact me for a free consultation.",
      })}</table>`,
    });
    emailSent = emailResult.sent;
  } catch (error) {
    console.error("Portal access notification failed", error);
  }

  noticeRedirect(
    returnTo,
    storage.stored
      ? "Request received. The HouseOfDev team will confirm your account and contact you."
      : emailSent
        ? "Request received. The team has been notified; please use the contact page too if this is urgent."
        : "Request noted. Please use the contact page too so the team can confirm your account.",
  );
}

export async function recordAttendanceCheckIn(formData: FormData) {
  const returnTo = "/employee-portal";
  const { user, role } = await getSignedInPortalUser(returnTo);

  if (!attendanceRoles.has(role)) {
    errorRedirect(returnTo, "Only employee accounts can record attendance.");
  }

  const supabase = getSupabaseAdmin() || (await getSupabaseServerClient());

  if (!supabase) {
    errorRedirect(returnTo, "Attendance backend is not configured yet.");
  }

  const now = new Date().toISOString();
  const workDate = getIndiaWorkDate();
  const mode = cleanAttendanceMode(formData.get("mode"));
  const notes = String(formData.get("notes") || "").trim();

  const { error } = await supabase.from("employee_attendance").upsert(
    {
      employee_id: user.id,
      work_date: workDate,
      check_in: now,
      mode,
      notes: notes || null,
      status: "present",
      updated_at: now,
    },
    { onConflict: "employee_id,work_date" },
  );

  if (error) {
    errorRedirect(returnTo, "Attendance table is not ready. Run database/portal-system-migration.sql in Supabase.");
  }

  noticeRedirect(returnTo, "Attendance check-in saved for today.");
}

export async function recordAttendanceCheckOut() {
  const returnTo = "/employee-portal";
  const { user, role } = await getSignedInPortalUser(returnTo);

  if (!attendanceRoles.has(role)) {
    errorRedirect(returnTo, "Only employee accounts can record attendance.");
  }

  const supabase = getSupabaseAdmin() || (await getSupabaseServerClient());

  if (!supabase) {
    errorRedirect(returnTo, "Attendance backend is not configured yet.");
  }

  const now = new Date().toISOString();
  const workDate = getIndiaWorkDate();
  const updateResult = await supabase
    .from("employee_attendance")
    .update({
      check_out: now,
      status: "completed",
      updated_at: now,
    })
    .eq("employee_id", user.id)
    .eq("work_date", workDate)
    .select("id")
    .maybeSingle();

  if (updateResult.error) {
    errorRedirect(returnTo, "Attendance table is not ready. Run database/portal-system-migration.sql in Supabase.");
  }

  if (!updateResult.data) {
    const insertResult = await supabase.from("employee_attendance").insert({
      employee_id: user.id,
      work_date: workDate,
      check_out: now,
      mode: "office",
      status: "completed",
      updated_at: now,
    });

    if (insertResult.error) {
      errorRedirect(returnTo, "Attendance table is not ready. Run database/portal-system-migration.sql in Supabase.");
    }
  }

  noticeRedirect(returnTo, "Attendance check-out saved for today.");
}

export async function createPortalCredential(formData: FormData) {
  const returnTo = "/admin-dashboard";
  const limited = await assertRateLimit("portal-create-user");

  if (!limited) {
    errorRedirect(returnTo, "Too many credential attempts. Please wait a minute and try again.");
  }

  const { user: adminUser, role: adminRole } = await getSignedInPortalUser(returnTo);

  if (!adminRoles.has(adminRole)) {
    errorRedirect(returnTo, "Only admin accounts can create portal credentials.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase service role key is required before admins can create credentials.");
  }

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const role = cleanCredentialRole(formData.get("role"));
  const companyName = String(formData.get("companyName") || "").trim();
  const jobTitle = String(formData.get("jobTitle") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const creditLimit = parseCreditAmount(formData.get("creditLimit"));
  const notes = String(formData.get("notes") || "").trim();
  const requestId = String(formData.get("requestId") || "").trim();

  if (fullName.length < 2 || !email.includes("@") || phone.length < 8 || password.length < 8 || !role) {
    errorRedirect(returnTo, "Enter name, email, phone, password, and a valid account role.");
  }

  if (role === "admin" && adminRole !== "super_admin") {
    errorRedirect(returnTo, "Only a super admin can create another admin account.");
  }

  const createResult = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    phone: phone || undefined,
    user_metadata: {
      full_name: fullName,
      phone,
      company_name: companyName || undefined,
      job_title: jobTitle || undefined,
      department: department || undefined,
    },
  });

  if (createResult.error || !createResult.data.user) {
    errorRedirect(returnTo, createResult.error?.message || "Could not create Supabase Auth user.");
  }

  const createdUser = createResult.data.user;
  const profileResult = await supabase.from("profiles").upsert(
    {
      id: createdUser.id,
      full_name: fullName,
      email,
      phone,
      role,
      company_name: companyName || null,
      job_title: jobTitle || null,
      department: department || null,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (profileResult.error) {
    await supabase.auth.admin.deleteUser(createdUser.id);
    errorRedirect(returnTo, `Auth user was created but profile storage failed. Rolled back login. ${profileResult.error.message}`);
  }

  if (role === "business_client" || role === "individual_client") {
    const clientResult = await supabase.from("client_accounts").upsert(
      {
        profile_id: createdUser.id,
        credit_balance: creditLimit,
        credit_limit: creditLimit,
        billing_email: email,
        account_status: "active",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "profile_id" },
    );

    if (clientResult.error) {
      errorRedirect(returnTo, `Credential created, but client credit account failed: ${clientResult.error.message}`);
    }

    if (creditLimit > 0) {
      await supabase.from("client_credit_ledger").insert({
        client_id: createdUser.id,
        credit_change: creditLimit,
        description: "Opening credit balance",
        created_by: adminUser.id,
      });
    }
  }

  const sourceRequestId = requestId.length >= 32 ? requestId : null;

  await supabase.from("portal_credential_events").insert({
    auth_user_id: createdUser.id,
    created_by: adminUser.id,
    email,
    role,
    source_request_id: sourceRequestId,
    notes: notes || null,
  });

  if (sourceRequestId) {
    await supabase
      .from("portal_access_requests")
      .update({
        status: "approved",
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes || "Credential created.",
        updated_at: new Date().toISOString(),
      })
      .eq("id", sourceRequestId);
  } else {
    await supabase
      .from("portal_access_requests")
      .update({
        status: "approved",
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
        admin_notes: notes || "Credential created.",
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("status", "new");
  }

  noticeRedirect(returnTo, `Credential created for ${email}. Share the temporary password securely.`);
}

export async function sendPortalPasswordReset(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const email = String(formData.get("resetEmail") || formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    errorRedirect(returnTo, "Enter the email address linked to your account.");
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    errorRedirect(returnTo, "Password reset is not configured yet. Request access and the team will help you.");
  }

  const origin = await getRequestOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    errorRedirect(returnTo, error.message);
  }

  noticeRedirect(returnTo, "If that email has an account, a password reset link has been sent.");
}

export async function updatePortalPassword(formData: FormData) {
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password.length < 8) {
    redirect(`/update-password?portal_error=${encodeURIComponent("Use a password with at least 8 characters.")}`);
  }

  if (password !== confirmPassword) {
    redirect(`/update-password?portal_error=${encodeURIComponent("Passwords do not match.")}`);
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    redirect(`/update-password?portal_error=${encodeURIComponent("Password update is not configured for this deployment.")}`);
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/update-password?portal_error=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();
  redirect(`/portal?portal_notice=${encodeURIComponent("Password updated. Sign in with your new password.")}`);
}
