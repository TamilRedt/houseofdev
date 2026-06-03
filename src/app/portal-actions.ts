"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";

const allowedReturnPaths = new Set(["/portal", "/employee-portal", "/admin-dashboard"]);

function cleanReturnTo(value: FormDataEntryValue | null) {
  const path = String(value || "/portal");
  return allowedReturnPaths.has(path) ? path : "/portal";
}

function errorRedirect(path: string, message: string): never {
  redirect(`${path}?portal_error=${encodeURIComponent(message)}`);
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

  redirect(returnTo);
}

export async function signOutFromPortal(formData: FormData) {
  const returnTo = cleanReturnTo(formData.get("returnTo"));
  const supabase = await getSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(returnTo);
}
