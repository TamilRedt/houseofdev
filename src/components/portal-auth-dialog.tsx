"use client";

import { useState } from "react";
import { KeyRound, LogIn, UserPlus, X } from "lucide-react";
import { requestPortalAccess, sendPortalPasswordReset, signInToPortal } from "@/app/portal-actions";
import { PasswordField } from "@/components/password-field";

type AuthMode = "signin" | "signup" | "reset";

const inputClass =
  "mt-2 min-h-12 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600";

export function PortalAuthDialog() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("signin");

  function openMode(nextMode: AuthMode) {
    setMode(nextMode);
    setOpen(true);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => openMode("signin")}
          className="rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:bg-slate-100"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => openMode("signup")}
          className="inline-flex h-10 items-center whitespace-nowrap rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:border-blue-500 hover:text-blue-700"
        >
          Sign up
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-[460px] rounded-lg border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/25 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                  HD
                </div>
                <h2 className="mt-5 text-3xl font-normal tracking-normal text-slate-950">
                  {mode === "signup" ? "Request account" : mode === "reset" ? "Recover account" : "Sign in"}
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-700">
                  {mode === "signup"
                    ? "Send your details first. HouseOfDev will confirm and create your credentials."
                    : mode === "reset"
                      ? "Enter your account email and we will send a reset link if the account exists."
                      : "Use your HouseOfDev account to open the correct client, employee, or admin portal."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close account dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {mode === "signin" ? (
              <form action={signInToPortal} className="mt-7 grid gap-5">
                <input type="hidden" name="returnTo" value="/portal" />
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Email</span>
                  <input name="email" type="email" autoComplete="email" required className={inputClass} />
                </label>
                <PasswordField
                  label="Password"
                  name="password"
                  autoComplete="current-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setMode("reset")}
                  className="justify-self-start text-sm font-semibold text-blue-700 hover:text-blue-900"
                >
                  Forgot password?
                </button>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Create account
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    <LogIn className="h-4 w-4" />
                    Next
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "reset" ? (
              <form action={sendPortalPasswordReset} className="mt-7 grid gap-5">
                <input type="hidden" name="returnTo" value="/portal" />
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Account email</span>
                  <input name="resetEmail" type="email" autoComplete="email" required className={inputClass} />
                </label>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Back to sign in
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    <KeyRound className="h-4 w-4" />
                    Send link
                  </button>
                </div>
              </form>
            ) : null}

            {mode === "signup" ? (
              <form action={requestPortalAccess} className="mt-7 grid gap-4">
                <input type="hidden" name="returnTo" value="/portal" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-blue-700">Full name</span>
                    <input name="fullName" autoComplete="name" required className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-blue-700">Phone</span>
                    <input name="phone" type="tel" autoComplete="tel" required className={inputClass} />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Email</span>
                  <input name="email" type="email" autoComplete="email" required className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Company</span>
                  <input name="companyName" autoComplete="organization" className={inputClass} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Account type</span>
                  <select name="accountType" required className={inputClass} defaultValue="Client account">
                    <option>Client account</option>
                    <option>Employee account</option>
                    <option>Admin account</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-blue-700">Message</span>
                  <textarea
                    name="message"
                    className={`${inputClass} min-h-24 resize-y py-3`}
                    placeholder="Best time to contact you."
                  />
                </label>
                <label className="hide-honeypot">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Sign in instead
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-blue-600 px-7 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
                  >
                    <UserPlus className="h-4 w-4" />
                    Request
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
