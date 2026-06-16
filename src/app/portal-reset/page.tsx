import Link from "next/link";
import { sendPortalPasswordReset } from "@/app/portal-actions";
import { BrandLogo } from "@/components/brand-logo";

export default function PortalResetPage() {
  return (
    <main className="flex min-h-[100dvh] items-center bg-slate-950 p-4">
      <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
        <BrandLogo />
        <h1 className="mt-8 text-3xl font-semibold text-slate-950">Reset your portal password</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Enter the email connected to your HouseOfDev account. We will send the secure reset instructions there.</p>
        <form action={sendPortalPasswordReset} className="mt-7 grid gap-5">
          <input type="hidden" name="returnTo" value="/portal" />
          <label>
            <span className="text-sm font-semibold text-slate-700">Account email</span>
            <input name="resetEmail" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 px-3 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
          </label>
          <button type="submit" className="min-h-12 rounded-xl bg-slate-950 px-6 text-sm font-bold text-white hover:bg-violet-700">Send reset link</button>
        </form>
        <Link href="/portal" className="mt-6 inline-flex text-sm font-semibold text-blue-700 hover:text-violet-700">Back to sign in</Link>
      </div>
    </main>
  );
}
