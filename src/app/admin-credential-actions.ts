"use server";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendLeadNotifications } from "@/lib/notifications";
import { getServerVerifiedPortalRole } from "@/lib/portal-session";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const credentialRoles = new Set<UserRole>(["admin", "employee", "business_client", "individual_client"]);
const adminRoles = new Set<UserRole>(["admin", "super_admin"]);

function fail(message: string): never {
  redirect(`/admin-dashboard/access?portal_error=${encodeURIComponent(message)}`);
}

function done(message: string): never {
  redirect(`/admin-dashboard/access?portal_notice=${encodeURIComponent(message)}`);
}

function cleanRole(value: FormDataEntryValue | null): UserRole | null {
  const role = String(value || "").trim() as UserRole;
  return credentialRoles.has(role) ? role : null;
}

function creditAmount(value: FormDataEntryValue | null) {
  const amount = Number(String(value || "").trim());
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

async function findAuthUserByEmail(supabase: SupabaseClient, email: string): Promise<User | null> {
  const normalized = email.toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const user = data.users.find((candidate) => candidate.email?.toLowerCase() === normalized);
    if (user || data.users.length < 1000) return user || null;
  }
  return null;
}

export async function createPortalCredentialWithNotification(formData: FormData) {
  const headerStore = await headers();
  const ip = (headerStore.get("x-forwarded-for") || headerStore.get("x-real-ip") || "anonymous").split(",")[0].trim();
  if (!(await checkRateLimit(`portal-create-user:${ip}`))) fail("Too many credential attempts. Please wait a minute and try again.");

  const server = await getSupabaseServerClient();
  if (!server) fail("Supabase Auth is not configured for this deployment.");
  const { data: { user: adminUser }, error: authError } = await server.auth.getUser();
  if (authError || !adminUser) fail("Sign in before creating portal credentials.");
  const adminRole = await getServerVerifiedPortalRole(adminUser.id);
  if (!adminRole || !adminRoles.has(adminRole)) fail("Only admin accounts can create portal credentials.");

  const db = getSupabaseAdmin();
  if (!db) fail("Supabase service role key is required before admins can create credentials.");

  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const role = cleanRole(formData.get("role"));
  const companyName = String(formData.get("companyName") || "").trim();
  const jobTitle = String(formData.get("jobTitle") || "").trim();
  const department = String(formData.get("department") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const requestId = String(formData.get("requestId") || "").trim();
  const creditLimit = creditAmount(formData.get("creditLimit"));

  if (fullName.length < 2 || !email.includes("@") || phone.length < 8 || password.length < 8 || !role) {
    fail("Enter name, email, phone, password, and a valid account role.");
  }
  if (role === "admin" && adminRole !== "super_admin") fail("Only a super admin can create another admin account.");

  const metadata = {
    full_name: fullName,
    phone,
    company_name: companyName || undefined,
    job_title: jobTitle || undefined,
    department: department || undefined,
  };

  let authAction: "created" | "updated" = "created";
  let portalUser: User;
  const createResult = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    phone: phone || undefined,
    app_metadata: { portal_role: role },
    user_metadata: metadata,
  });

  if (!createResult.error && createResult.data.user) {
    portalUser = createResult.data.user;
  } else {
    const message = createResult.error?.message.toLowerCase() || "";
    if (!message.includes("already") && !message.includes("registered")) fail(createResult.error?.message || "Could not create portal user.");
    const existing = await findAuthUserByEmail(db, email);
    if (!existing) fail("The email exists, but the portal user could not be found for repair.");
    const updateResult = await db.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      phone: phone || undefined,
      app_metadata: { ...(existing.app_metadata || {}), portal_role: role },
      user_metadata: { ...(existing.user_metadata || {}), ...metadata },
    });
    if (updateResult.error) fail(`Could not update the existing portal user: ${updateResult.error.message}`);
    authAction = "updated";
    portalUser = updateResult.data.user || existing;
  }

  const profileResult = await db.from("profiles").upsert({
    id: portalUser.id,
    full_name: fullName,
    email,
    phone,
    role,
    company_name: companyName || null,
    job_title: jobTitle || null,
    department: department || null,
    is_active: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });

  if (profileResult.error) {
    if (authAction === "created") await db.auth.admin.deleteUser(portalUser.id);
    fail(`Portal profile storage failed: ${profileResult.error.message}`);
  }

  if (["business_client", "individual_client"].includes(role)) {
    const clientResult = await db.from("client_accounts").upsert({
      profile_id: portalUser.id,
      credit_balance: creditLimit,
      credit_limit: creditLimit,
      billing_email: email,
      account_status: "active",
      updated_at: new Date().toISOString(),
    }, { onConflict: "profile_id" });
    if (clientResult.error) fail(`Credential created, but client account setup failed: ${clientResult.error.message}`);

    if (creditLimit > 0) {
      await db.from("client_credit_ledger").insert({
        client_id: portalUser.id,
        credit_change: creditLimit,
        description: "Opening credit balance",
        created_by: adminUser.id,
      });
    }
  }

  const sourceRequestId = /^[0-9a-f-]{32,36}$/i.test(requestId) ? requestId : null;
  const credentialResult = await db.from("portal_credential_events").insert({
    auth_user_id: portalUser.id,
    created_by: adminUser.id,
    email,
    role,
    action: authAction,
    source_request_id: sourceRequestId,
    notes: notes || null,
  }).select("id").maybeSingle();
  const credentialEventId = credentialResult.data?.id ? String(credentialResult.data.id) : null;

  const approval = {
    status: "approved",
    reviewed_by: adminUser.id,
    reviewed_at: new Date().toISOString(),
    admin_notes: notes || "Credential created.",
    updated_at: new Date().toISOString(),
  };
  if (sourceRequestId) {
    await db.from("portal_access_requests").update(approval).eq("id", sourceRequestId);
  } else {
    await db.from("portal_access_requests").update(approval).eq("email", email).eq("status", "new");
  }

  await db.from("portal_activity_logs").insert({
    actor_id: adminUser.id,
    email,
    event_type: "credential_created",
    status: "success",
    ip_address: ip,
    user_agent: headerStore.get("user-agent") || null,
    metadata: { createdUserId: portalUser.id, role, companyName, requestId: sourceRequestId, action: authAction },
  });

  const results = await sendLeadNotifications({
    subject: `HouseOfDev portal credential ${authAction} — ${fullName}`,
    html: `<h2>Portal credential ${authAction}</h2><p><strong>${fullName}</strong> now has ${role.replaceAll("_", " ")} access.</p><p>Email: ${email}<br/>Phone: ${phone}<br/>Company: ${companyName || "-"}</p><p>The temporary password is intentionally not included in this notification.</p>`,
    text: [
      `HouseOfDev portal credential ${authAction}`,
      `Name: ${fullName}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Company: ${companyName || "-"}`,
      `Role: ${role}`,
      "Temporary password is not included for security.",
    ].join("\n"),
  });

  if (credentialEventId) {
    await db.from("notification_events").insert(results.map((result) => ({
      related_table: "portal_credential_events",
      related_id: credentialEventId,
      event_type: "credential_created",
      channel: result.channel,
      target: result.target,
      status: result.sent ? "sent" : "skipped",
      response: result.response || result.reason || null,
    })));
  }

  done(
    results.some((result) => result.sent)
      ? `Credential ${authAction} for ${email}. Owner notifications were sent.`
      : `Credential ${authAction} for ${email}. Notification channels are not configured yet.`,
  );
}
