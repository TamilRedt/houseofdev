"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Save, Trash2, UserCog, UserPlus } from "lucide-react";
import {
  createPortalCredential,
  deletePortalCredential,
  updatePortalCredential,
} from "@/app/portal-actions";
import { PasswordField } from "@/components/password-field";
import type { PortalCredentialRequest, PortalCredentialUser } from "@/lib/portal";
import type { UserRole } from "@/lib/supabase";

type AdminCredentialManagerProps = {
  requests: PortalCredentialRequest[];
  users: PortalCredentialUser[];
  canCreateAdmin: boolean;
};

const emptyRequest = {
  id: "",
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  accountType: "",
  message: "",
};

const inputClass =
  "mt-2 min-h-10 w-full rounded-md border border-blue-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/10";
const dangerInputClass =
  "mt-2 min-h-10 w-full rounded-md border border-red-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-600/10";
const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-blue-800";

function roleFromAccountType(accountType: string): UserRole {
  const normalized = accountType.toLowerCase();

  if (normalized.includes("employee")) {
    return "employee";
  }

  if (normalized.includes("admin")) {
    return "admin";
  }

  if (normalized.includes("client")) {
    return "business_client";
  }

  return "individual_client";
}

function RoleOptions({ canCreateAdmin }: { canCreateAdmin: boolean }) {
  return (
    <>
      <option value="business_client">Business Client</option>
      <option value="individual_client">Individual Client</option>
      <option value="employee">Employee</option>
      {canCreateAdmin ? <option value="admin">Admin</option> : null}
    </>
  );
}

export function AdminCredentialManager({ requests, users, canCreateAdmin }: AdminCredentialManagerProps) {
  const [requestId, setRequestId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === requestId) || emptyRequest,
    [requestId, requests],
  );
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || null,
    [selectedUserId, users],
  );
  const selectedRequestRole = selectedRequest.accountType ? roleFromAccountType(selectedRequest.accountType) : "business_client";
  const selectedCreateRole = selectedRequestRole === "admin" && !canCreateAdmin ? "business_client" : selectedRequestRole;
  const selectedEditRole = selectedUser?.role === "admin" && !canCreateAdmin ? "business_client" : selectedUser?.role || "business_client";

  return (
    <div className="mt-5 grid gap-5">
      <form key={`create-${requestId || "manual"}`} action={createPortalCredential} className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-blue-700" />
          <p className="text-sm font-semibold text-blue-950">Create Portal Credential</p>
        </div>

        <label className="mt-4 block">
          <span className={labelClass}>Use Existing Request</span>
          <select
            name="requestId"
            value={requestId}
            onChange={(event) => setRequestId(event.target.value)}
            className={inputClass}
          >
            <option value="">Manual entry</option>
            {requests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.fullName} - {request.accountType} - {request.email}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className={labelClass}>Full Name</span>
            <input name="fullName" required autoComplete="name" defaultValue={selectedRequest.fullName} className={inputClass} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block">
              <span className={labelClass}>Email</span>
              <input name="email" type="email" required autoComplete="email" defaultValue={selectedRequest.email} className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Phone</span>
              <input name="phone" type="tel" required autoComplete="tel" defaultValue={selectedRequest.phone} className={inputClass} />
            </label>
          </div>
          <PasswordField
            label="Temporary Password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            className={inputClass}
            labelClassName={labelClass}
          />
          <label className="block">
            <span className={labelClass}>Role</span>
            <select name="role" defaultValue={selectedCreateRole} required className={inputClass}>
              <RoleOptions canCreateAdmin={canCreateAdmin} />
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Company</span>
            <input name="companyName" autoComplete="organization" defaultValue={selectedRequest.companyName || ""} className={inputClass} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block">
              <span className={labelClass}>Job Title</span>
              <input name="jobTitle" className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Department</span>
              <input name="department" className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>Credit Limit</span>
            <input name="creditLimit" type="number" min="0" step="1" inputMode="numeric" className={inputClass} />
          </label>
          <label className="block">
            <span className={labelClass}>Admin Notes</span>
            <textarea name="notes" defaultValue={selectedRequest.message || ""} className={`${inputClass} min-h-20 resize-y py-2`} />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-slate-950"
          >
            <UserPlus className="h-4 w-4" />
            Create or Repair Credential
          </button>
        </div>
      </form>

      <form key={`edit-${selectedUserId || "none"}`} action={updatePortalCredential} className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-emerald-700" />
          <p className="text-sm font-semibold text-emerald-950">Modify Existing Credential</p>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Portal User</span>
          <select
            name="profileId"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
            required
            className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} - {user.role} - {user.email}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 grid gap-3">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Full Name</span>
            <input name="fullName" required defaultValue={selectedUser?.fullName || ""} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Phone</span>
            <input name="phone" type="tel" defaultValue={selectedUser?.phone || ""} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
          </label>
          <PasswordField
            label="New Password"
            name="password"
            autoComplete="new-password"
            required={false}
            className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
            labelClassName="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800"
          />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Role</span>
            <select name="role" required defaultValue={selectedEditRole} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10">
              <RoleOptions canCreateAdmin={canCreateAdmin} />
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Company</span>
            <input name="companyName" defaultValue={selectedUser?.companyName || ""} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Job Title</span>
              <input name="jobTitle" defaultValue={selectedUser?.jobTitle || ""} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Department</span>
              <input name="department" defaultValue={selectedUser?.department || ""} className="mt-2 min-h-10 w-full rounded-md border border-emerald-200 bg-white px-3 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">Admin Notes</span>
            <textarea name="notes" className="mt-2 min-h-20 w-full resize-y rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/10" />
          </label>
          <button
            type="submit"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-950"
          >
            <Save className="h-4 w-4" />
            Save Credential Changes
          </button>
        </div>
      </form>

      <form action={deletePortalCredential} className="rounded-md border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-700" />
          <p className="text-sm font-semibold text-red-950">Delete Credential</p>
        </div>
        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-red-800">Portal User</span>
          <select name="profileId" required className={dangerInputClass}>
            <option value="">Select user</option>
            {users
              .filter((user) => user.role !== "super_admin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName} - {user.role} - {user.email}
                </option>
              ))}
          </select>
        </label>
        <label className="mt-3 block">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-red-800">Type Email To Confirm</span>
          <input name="confirmEmail" type="email" required className={dangerInputClass} />
        </label>
        <button
          type="submit"
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-red-700 px-4 text-sm font-semibold text-white transition hover:bg-slate-950"
        >
          <Trash2 className="h-4 w-4" />
          Delete Credential
        </button>
      </form>
    </div>
  );
}
