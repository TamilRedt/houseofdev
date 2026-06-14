import { cookies } from "next/headers";
import { getDefaultPortalRouteForRole } from "@/lib/portal";
import { getSupabaseAdmin, getSupabaseServerClient, type UserRole } from "@/lib/supabase";

export type PortalCookieRole = "client" | "employee" | "admin" | "super_admin";

const portalRoles = new Set<UserRole>([
  "super_admin",
  "admin",
  "employee",
  "business_client",
  "individual_client",
]);

const portalCookieNames = ["hod_portal_signed_in", "hod_portal_role", "hod_portal_route"];

function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  };
}

export function isPortalRole(value: unknown): value is UserRole {
  return typeof value === "string" && portalRoles.has(value as UserRole);
}

export function getPortalCookieRole(role: UserRole): PortalCookieRole {
  if (role === "super_admin") {
    return "super_admin";
  }

  if (role === "admin") {
    return "admin";
  }

  if (role === "employee") {
    return "employee";
  }

  return "client";
}

export async function getServerVerifiedPortalRole(userId: string): Promise<UserRole | null> {
  const db = getSupabaseAdmin() || (await getSupabaseServerClient());

  if (!db) {
    return null;
  }

  const { data, error } = await db
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !isPortalRole(data?.role)) {
    return null;
  }

  return data.role;
}

export async function setPortalSessionCookies(role: UserRole) {
  const cookieStore = await cookies();
  const options = getCookieOptions();

  cookieStore.set("hod_portal_signed_in", "1", options);
  cookieStore.set("hod_portal_role", getPortalCookieRole(role), options);
  cookieStore.set("hod_portal_route", getDefaultPortalRouteForRole(role), options);
}

export async function clearPortalSessionCookies() {
  const cookieStore = await cookies();

  portalCookieNames.forEach((name) => {
    cookieStore.set(name, "", {
      ...getCookieOptions(),
      maxAge: 0,
    });
  });
}
