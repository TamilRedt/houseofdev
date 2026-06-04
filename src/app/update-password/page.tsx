import { KeyRound } from "lucide-react";
import { updatePortalPassword } from "@/app/portal-actions";
import { Container } from "@/components/container";
import { PasswordField } from "@/components/password-field";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Update Password",
  description: "Set a new password for your HouseOfDev portal account.",
  path: "/update-password",
});

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getMessage(params: Record<string, string | string[] | undefined> | undefined, key: string) {
  const value = params?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function UpdatePasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = getMessage(params, "portal_error");

  return (
    <section className="bg-slate-50 py-20">
      <Container className="max-w-2xl">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/8 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-slate-950 text-white">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Secure Account
              </p>
              <h1 className="text-2xl font-semibold text-slate-950">Set a new password</h1>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <form action={updatePortalPassword} className="mt-7 grid gap-5">
            <PasswordField
              label="New Password"
              name="password"
              autoComplete="new-password"
              minLength={8}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
              labelClassName="text-sm font-semibold text-slate-700"
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10"
              labelClassName="text-sm font-semibold text-slate-700"
            />
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-slate-950"
            >
              <KeyRound className="h-4 w-4" />
              Update Password
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
