"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendLeadNotifications, type NotificationResult } from "@/lib/notifications";
import { getDefaultPortalRouteForRole } from "@/lib/portal";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const allowedReturnPaths = new Set(["/portal", "/employee-portal", "/admin-dashboard"]);
const accessTypes = new Set(["Client account", "Employee account", "Admin account"]);
const attendanceModes = new Set(["office", "remote", "hybrid", "field"]);
const attendanceRoles = new Set<UserRole>(["employee", "admin", "super_admin"]);
const credentialRoles = new Set<UserRole>(["admin", "employee", "business_client", "individual_client"]);
const adminRoles = new Set<UserRole>(["admin", "super_admin"]);
const accountChangeTypes = new Set(["package_upgrade", "package_change", "password_help", "account_details"]);

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

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid path specified") || normalized.includes("invalid url")) {
    return "Portal authentication URL is not valid yet. Check Vercel env NEXT_PUBLIC_SUPABASE_URL and keep only the Supabase project URL.";
  }

  if (normalized.includes("fetch failed") || normalized.includes("failed to fetch")) {
    return "Portal authentication could not reach Supabase. Try again in a moment or check the Supabase project settings.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Email or password is incorrect. Use the admin-created credential or request a reset.";
  }

  return message;
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

async function getRequestContext() {
  const headerStore = await headers();

  return {
    ip: getFirstIp(headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip")),
    userAgent: headerStore.get("user-agent") || null,
  };
}

async function logPortalActivity({
  actorId,
  email,
  eventType,
  status = "success",
  metadata = {},
}: {
  actorId?: string | null;
  email?: string | null;
  eventType: string;
  status?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return;
  }

  const context = await getRequestContext();
  await supabase.from("portal_activity_logs").insert({
    actor_id: actorId || null,
    email: email || null,
    event_type: eventType,
    status,
    ip_address: context.ip,
    user_agent: context.userAgent,
    metadata,
  });
}

async function recordNotificationEvents({
  relatedTable,
  relatedId,
  eventType,
  results,
}: {
  relatedTable: string;
  relatedId: string | null;
  eventType: string;
  results: NotificationResult[];
}) {
  const supabase = getSupabaseAdmin();

  if (!supabase || !results.length) {
    return;
  }

  await supabase.from("notification_events").insert(
    results.map((result) => ({
      related_table: relatedTable,
      related_id: relatedId,
      event_type: eventType,
      channel: result.channel,
      target: result.target,
      status: result.sent ? "sent" : "skipped",
      response: result.response || result.reason || null,
    })),
  );
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
    await logPortalActivity({
      email,
      eventType: "login_failed",
      status: "failed",
      metadata: { reason: error.message, returnTo },
    });
    errorRedirect(returnTo, getFriendlyAuthError(error.message));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user ? await getSignedInRole(user.id) : null;

  await logPortalActivity({
    actorId: user?.id || null,
    email,
    eventType: "login_success",
    metadata: { role, returnTo },
  });

  redirect(role ? getDefaultPortalRouteForRole(role) : returnTo);
}

export async function signOutFromPortal(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await logPortalActivity({
      actorId: user?.id || null,
      email: user?.email || null,
      eventType: "logout",
      metadata: { returnTo },
    });
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
  const notificationText = [
    "New HouseOfDev portal access request",
    `Name: ${fullName}`,
    `Company: ${companyName || "Not provided"}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Account: ${accountType}`,
    `Message: ${message || "Please contact me for a free consultation."}`,
  ].join("\n");
  let notificationResults: NotificationResult[] = [];

  try {
    notificationResults = await sendLeadNotifications({
      subject: `HouseOfDev portal access request - ${accountType}`,
      html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#0f172a">Portal access request</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
        Name: fullName,
        Company: companyName || "Not provided",
        Email: email,
        Phone: phone,
        Account: accountType,
        Message: message || "Please contact me for a free consultation.",
      })}</table>`,
      text: notificationText,
    });
    emailSent = notificationResults.some((result) => result.sent);
  } catch (error) {
    console.error("Portal access notification failed", error);
  }

  await logPortalActivity({
    email,
    eventType: "portal_access_request_submitted",
    metadata: { accountType, storageTarget: storage.target },
  });
  await recordNotificationEvents({
    relatedTable: storage.target === "portal_access_requests" ? "portal_access_requests" : "contact_requests",
    relatedId: null,
    eventType: "portal_access_request_submitted",
    results: notificationResults,
  });

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

export async function submitAccountChangeRequest(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const limited = await assertRateLimit("account-change");

  if (!limited) {
    errorRedirect(returnTo, "Too many requests. Please wait a minute and try again.");
  }

  const { user } = await getSignedInPortalUser(returnTo);
  const requestType = String(formData.get("requestType") || "").trim();
  const currentPackage = String(formData.get("currentPackage") || "").trim();
  const requestedPackage = String(formData.get("requestedPackage") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  if (!accountChangeTypes.has(requestType) || message.length < 8) {
    errorRedirect(returnTo, "Choose a request type and enter a short message.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase backend is required to store account change requests.");
  }

  const insertResult = await supabase.from("account_change_requests").insert({
    requester_id: user.id,
    email: user.email || "",
    phone: phone || null,
    request_type: requestType,
    current_package: currentPackage || null,
    requested_package: requestedPackage || null,
    message,
    status: "new",
  }).select("id").maybeSingle();

  if (insertResult.error) {
    errorRedirect(returnTo, "Could not store the account change request. Run database/portal-system-migration.sql in Supabase.");
  }

  const requestId = insertResult.data?.id ? String(insertResult.data.id) : null;
  const notificationText = [
    "New HouseOfDev account change request",
    `Email: ${user.email || "-"}`,
    `Phone: ${phone || "-"}`,
    `Type: ${requestType}`,
    `Current package: ${currentPackage || "-"}`,
    `Requested package: ${requestedPackage || "-"}`,
    `Message: ${message}`,
  ].join("\n");
  const notificationResults = await sendLeadNotifications({
    subject: `HouseOfDev account change request - ${requestType}`,
    html: `<h2 style="font-family:Inter,Arial,sans-serif;color:#0f172a">Account change request</h2><table style="border-collapse:collapse;font-family:Inter,Arial,sans-serif">${rows({
      Email: user.email || "-",
      Phone: phone || "-",
      Type: requestType,
      "Current Package": currentPackage || "-",
      "Requested Package": requestedPackage || "-",
      Message: message,
    })}</table>`,
    text: notificationText,
  });

  await logPortalActivity({
    actorId: user.id,
    email: user.email || null,
    eventType: "account_change_request_submitted",
    metadata: { requestId, requestType, currentPackage, requestedPackage },
  });
  await recordNotificationEvents({
    relatedTable: "account_change_requests",
    relatedId: requestId,
    eventType: "account_change_request_submitted",
    results: notificationResults,
  });

  noticeRedirect(returnTo, "Request saved. The HouseOfDev team will review it and contact you.");
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

  await logPortalActivity({
    actorId: adminUser.id,
    email,
    eventType: "credential_created",
    metadata: { createdUserId: createdUser.id, role, companyName, requestId: sourceRequestId },
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
    await logPortalActivity({
      email,
      eventType: "password_reset_requested",
      status: "failed",
      metadata: { reason: error.message },
    });
    errorRedirect(returnTo, getFriendlyAuthError(error.message));
  }

  await logPortalActivity({
    email,
    eventType: "password_reset_requested",
    metadata: { returnTo },
  });

  noticeRedirect(returnTo, "If that email has an account, a password reset link has been sent.");
}

export async function deletePortalCredential(formData: FormData) {
  const returnTo = "/admin-dashboard";
  const { user: adminUser, role: adminRole } = await getSignedInPortalUser(returnTo);

  if (!adminRoles.has(adminRole)) {
    errorRedirect(returnTo, "Only admin accounts can remove portal credentials.");
  }

  const profileId = String(formData.get("profileId") || "").trim();
  const confirmEmail = String(formData.get("confirmEmail") || "").trim().toLowerCase();

  if (!profileId || !confirmEmail.includes("@")) {
    errorRedirect(returnTo, "Select a user and confirm their email address before deleting.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase service role key is required to remove credentials.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", profileId)
    .single();

  if (!profile) {
    errorRedirect(returnTo, "User not found. They may have already been removed.");
  }

  if (profile.email !== confirmEmail) {
    errorRedirect(returnTo, "Email confirmation does not match. Re-enter the exact email address.");
  }

  if (profile.role === "super_admin") {
    errorRedirect(returnTo, "The super admin account cannot be deleted here.");
  }

  const { error } = await supabase.auth.admin.deleteUser(profileId);

  if (error) {
    errorRedirect(returnTo, `Could not remove credential: ${error.message}`);
  }

  await logPortalActivity({
    actorId: adminUser.id,
    email: confirmEmail,
    eventType: "credential_deleted",
    metadata: { deletedProfileId: profileId },
  });

  noticeRedirect(returnTo, `Credential removed for ${confirmEmail}.`);
}

export async function updatePortalCredential(formData: FormData) {
  const returnTo = "/admin-dashboard";
  const { user: adminUser, role: adminRole } = await getSignedInPortalUser(returnTo);

  if (!adminRoles.has(adminRole)) {
    errorRedirect(returnTo, "Only admin accounts can update portal credentials.");
  }

  const profileId = String(formData.get("profileId") || "").trim();
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const role = cleanCredentialRole(formData.get("role"));
  const companyName = String(formData.get("companyName") || "").trim();
  const jobTitle = String(formData.get("jobTitle") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const password = String(formData.get("password") || "");

  if (!profileId || fullName.length < 2 || !role) {
    errorRedirect(returnTo, "Select a user, enter their name, and choose a valid role.");
  }

  if (role === "admin" && adminRole !== "super_admin") {
    errorRedirect(returnTo, "Only a super admin can assign the admin role.");
  }

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    errorRedirect(returnTo, "Supabase service role key is required to update credentials.");
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      role,
      company_name: companyName || null,
      job_title: jobTitle || null,
      department: department || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (profileError) {
    errorRedirect(returnTo, `Profile update failed: ${profileError.message}`);
  }

  if (password && password.length >= 8) {
    const { error: passwordError } = await supabase.auth.admin.updateUserById(profileId, { password });
    if (passwordError) {
      errorRedirect(returnTo, `Profile updated but password change failed: ${passwordError.message}`);
    }
  }

  await logPortalActivity({
    actorId: adminUser.id,
    email: null,
    eventType: "credential_updated",
    metadata: { updatedProfileId: profileId, role, fullName },
  });

  noticeRedirect(returnTo, `Credential updated for ${fullName}.`);
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await logPortalActivity({
      actorId: user?.id || null,
      email: user?.email || null,
      eventType: "password_update",
      status: "failed",
      metadata: { reason: error.message },
    });
    redirect(`/update-password?portal_error=${encodeURIComponent(getFriendlyAuthError(error.message))}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  await logPortalActivity({
    actorId: user?.id || null,
    email: user?.email || null,
    eventType: "password_update",
  });

  await supabase.auth.signOut();
  redirect(`/portal?portal_notice=${encodeURIComponent("Password updated. Sign in with your new password.")}`);
}
