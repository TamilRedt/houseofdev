"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminSessionButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function endSession() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      router.replace("/admin-dashboard");
      router.refresh();
      return;
    }

    setPending(true);
    const client = createBrowserClient(url, key);
    await client.auth.signOut();
    router.replace("/admin-dashboard");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={endSession}
      disabled={pending}
      aria-label="Sign out of the admin workspace"
      className={
        compact
          ? "grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 disabled:opacity-50"
          : "inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
      }
    >
      <LogOut className="h-4 w-4" />
      {compact ? <span className="sr-only">Sign out</span> : pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
