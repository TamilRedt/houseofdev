import { NextResponse } from "next/server";
import { isEmailConfigured } from "@/lib/email";
import {
  isPortalBackendConfigured,
  isSupabaseAdminConfigured,
  isSupabasePublicConfigured,
} from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "houseofdev",
    next: "16",
    supabasePublicConfigured: isSupabasePublicConfigured(),
    supabaseAdminConfigured: isSupabaseAdminConfigured(),
    portalBackendConfigured: isPortalBackendConfigured(),
    emailConfigured: isEmailConfigured(),
    timestamp: new Date().toISOString(),
  });
}

