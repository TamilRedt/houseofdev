import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export type UserRole =
  | "super_admin"
  | "admin"
  | "employee"
  | "business_client"
  | "individual_client";

let adminClient: SupabaseClient | null = null;

function normalizeSupabaseUrl(value: string | undefined) {
  const raw = value?.trim().replace(/^['"]|['"]$/g, "");

  if (!raw) {
    return null;
  }

  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return url.origin;
  } catch {
    return null;
  }
}

export function getSupabaseUrl() {
  return normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAdmin() {
  const url = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isSupabasePublicConfigured() {
  return Boolean(getSupabaseUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isPortalBackendConfigured() {
  return isSupabasePublicConfigured() && isSupabaseAdminConfigured();
}

export async function getSupabaseServerClient() {
  const url = getSupabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies; Server Actions can.
        }
      },
    },
  });
}

