"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendNotificationEmail } from "@/lib/email";
import { getDefaultPortalRouteForRole } from "@/lib/portal";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

const allowedReturnPaths = new Set(["/portal", "/employee-portal", "/admin-dashboard"]);
const accessTypes = new Set(["Client account", "Employee account", "Admin account"]);

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

  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("contact_requests").insert({
      full_name: fullName,
      company_name: companyName || "Not provided",
      email,
      phone,
      industry: "Portal access",
      budget: "Account request",
      service_required: accountType,
      message: requestMessage,
      source: "portal-access",
      status: "new",
    });

    if (error) {
      errorRedirect(returnTo, "We could not store the access request. Please use the contact page or try again.");
    }
  }

  await sendNotificationEmail({
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

  noticeRedirect(
    returnTo,
    supabase
      ? "Request received. The HouseOfDev team will confirm your account and contact you."
      : "Request noted. Please also use the contact page so the team can confirm your account.",
  );
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
