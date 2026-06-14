import { NextResponse, type NextRequest } from "next/server";
import { getServerVerifiedPortalRole, setPortalSessionCookies } from "@/lib/portal-session";
import { getSupabaseServerClient } from "@/lib/supabase";

const allowedNextPaths = new Set(["/portal", "/employee-portal", "/admin-dashboard", "/update-password"]);

function cleanNextPath(value: string | null) {
  return value && allowedNextPaths.has(value) ? value : "/portal";
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = cleanNextPath(url.searchParams.get("next"));
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/portal?portal_error=${encodeURIComponent("Authentication link is missing a code.")}`);
  }

  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(`${origin}/portal?portal_error=${encodeURIComponent("Authentication is not configured.")}`);
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/portal?portal_error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = user ? await getServerVerifiedPortalRole(user.id) : null;

  if (role) {
    await setPortalSessionCookies(role);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
