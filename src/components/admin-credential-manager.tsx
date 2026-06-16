"use client";

import { useMemo, useState } from "react";
import { KeyRound, Save, ShieldAlert, Trash2, UserCog, UserPlus, Users } from "lucide-react";
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

type CredentialTab = "create" | "edit" | "delete";

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
  "mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10";
const dangerInputClass =
  "mt-2 min-h-11 w-full rounded-xl border border-red-300 bg-white px-3.5 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-600 focus:ring-4 focus:ring-red-600/10";
const labelClass = "block text-sm font-medium text-slate-700";

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

const tabs: Array<{ id: CredentialTab; label: string; helper: string; icon: typeof UserPlus }> = [
  { id: "create", label: "Create access", helper: "New or requested account", icon: UserPlus },
  { id: "edit", label: "Manage users", helper: "Role, profile, or password", icon: UserCog },
  { id: "delete", label: "Remove access", helper: "Revoke a portal credential", icon: Trash2 },
];

export function AdminCredentialManager({ requests, users, canCreateAdmin }: AdminCredentialManagerProps) {
  const [activeTab, setActiveTab] = useState<CredentialTab>("create");
  const [requestId, setRequestId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [deleteUserId, setDeleteUserId] = useState("");

  const editableUsers = useMemo(() => users.filter((user) => user.role !== "super_admin"), [users]);
  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === requestId) || emptyRequest,
    [requestId, requests],
  );
  const selectedUser = useMemo(
    () => editableUsers.find((user) => user.id === selectedUserId) || null,
    [editableUsers, selectedUserId],
  );
  const deleteUser = useMemo(
    () => editableUsers.find((user) => user.id === deleteUserId) || null,
    [deleteUserId, editableUsers],
  );
  const selectedRequestRole = selectedRequest.accountType
    ? roleFromAccountType(selectedRequest.accountType)
    : "business_client";
  const selectedCreateRole =
    selectedRequestRole === "admin" && !canCreateAdmin ? "business_client" : selectedRequestRole;
  const selectedEditRole =
    selectedUser?.role === "admin" && !canCreateAdmin
      ? "business_client"
      : selectedUser?.role || "business_client";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-slate-950 text-white">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Access and credentials</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Create portal access, repair user records, reset passwords, and revoke credentials.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            {requests.length} pending requests
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            {users.length} portal users
          </span>
        </div>
      </div>

      <div className="border-b border-slate-200 bg-slate-50/80 px-3 py-3 sm:px-5">
        <div className="grid gap-2 sm:grid-cols-3" role="tablist" aria-label="Credential management">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-14 items-center gap-3 rounded-xl border px-3.5 text-left transition sm:px-4 ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm"
                    : "border-transparent bg-transparent text-slate-600 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4 flex-none" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{tab.label}</span>
                  <span className={`mt-0.5 block truncate text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>
                    {tab.helper}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === "create" ? (
          <form key={`create-${requestId || "manual"}`} action={createPortalCredential}>
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <UserPlus className="h-5 w-5 flex-none text-blue-700" />
              <div>
                <p className="text-sm font-semibold text-blue-950">Create or repair portal access</p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Use an existing request to prefill the account, or enter the details manually.
                </p>
              </div>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>
                Existing access request
                <select
                  name="requestId"
                  value={requestId}
                  onChange={(event) => setRequestId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Manual entry</option>
                  {requests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.fullName} — {request.accountType} — {request.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Full name
                <input
                  name="fullName"
                  required
                  autoComplete="name"
                  defaultValue={selectedRequest.fullName}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={selectedRequest.email}
                  className={inputClass}
                />
              </label>
              <label className={labelClass}>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  defaultValue={selectedRequest.phone}
                  className={inputClass}
                />
              </label>

              <PasswordField
                label="Temporary password"
                name="password"
                autoComplete="new-password"
                minLength={8}
                className={inputClass}
                labelClassName={labelClass}
              />
              <label className={labelClass}>
                Portal role
                <select name="role" defaultValue={selectedCreateRole} required className={inputClass}>
                  <RoleOptions canCreateAdmin={canCreateAdmin} />
                </select>
              </label>
              <label className={labelClass}>
                Company
                <input
                  name="companyName"
                  autoComplete="organization"
                  defaultValue={selectedRequest.companyName || ""}
                  className={inputClass}
                />
              </label>

              <label className={labelClass}>
                Job title
                <input name="jobTitle" className={inputClass} />
              </label>
              <label className={labelClass}>
                Department
                <input name="department" className={inputClass} />
              </label>
              <label className={labelClass}>
                Credit limit
                <input name="creditLimit" type="number" min="0" step="1" inputMode="numeric" className={inputClass} />
              </label>

              <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>
                Admin notes
                <textarea
                  name="notes"
                  defaultValue={selectedRequest.message || ""}
                  className={`${inputClass} min-h-24 resize-y py-3`}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Passwords must contain at least eight characters. Admin access is restricted to the super admin.
              </p>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20"
              >
                <UserPlus className="h-4 w-4" />
                Create credential
              </button>
            </div>
          </form>
        ) : null}

        {activeTab === "edit" ? (
          <form key={`edit-${selectedUserId || "none"}`} action={updatePortalCredential}>
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <UserCog className="h-5 w-5 flex-none text-emerald-700" />
              <div>
                <p className="text-sm font-semibold text-emerald-950">Manage an existing portal user</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">
                  Update profile fields, change access level, or issue a password reset.
                </p>
              </div>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
              <label className={`${labelClass} md:col-span-2 xl:col-span-3`}>
                Portal user
                <select
                  name="profileId"
                  value={selectedUserId}
                  onChange={(event) => setSelectedUserId(event.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select a user</option>
                  {editableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} — {user.role} — {user.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Full name
                <input name="fullName" required defaultValue={selectedUser?.fullName || ""} className={inputClass} />
              </label>
              <label className={labelClass}>
                Email address
                <input value={selectedUser?.email || ""} readOnly className={`${inputClass} bg-slate-100 text-slate-500`} />
              </label>
              <label className={labelClass}>
                Phone number
                <input name="phone" type="tel" defaultValue={selectedUser?.phone || ""} className={inputClass} />
              </label>

              <PasswordField
                label="New password"
                name="password"
                autoComplete="new-password"
                required={false}
                className={inputClass}
                labelClassName={labelClass}
              />
              <label className={labelClass}>
                Portal role
                <select name="role" required defaultValue={selectedEditRole} className={inputClass}>
                  <RoleOptions canCreateAdmin={canCreateAdmin} />
                </select>
              </label>
              <label className={labelClass}>
                Company
                <input name="companyName" defaultValue={selectedUser?.companyName || ""} className={inputClass} />
              </label>

              <label className={labelClass}>
                Job title
                <input name="jobTitle" defaultValue={selectedUser?.jobTitle || ""} className={inputClass} />
              </label>
              <label className={labelClass}>
                Department
                <input name="department" defaultValue={selectedUser?.department || ""} className={inputClass} />
              </label>
              <label className={`${labelClass} md:col-span-2 xl:col-span-1`}>
                Admin notes
                <textarea name="notes" className={`${inputClass} min-h-24 resize-y py-3`} />
              </label>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-200 pt-5">
              <button
                type="submit"
                disabled={!selectedUserId}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Save changes
              </button>
            </div>
          </form>
        ) : null}

        {activeTab === "delete" ? (
          <form action={deletePortalCredential} className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-red-700 text-white">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-red-950">Revoke portal access</h3>
                  <p className="mt-1 text-sm leading-6 text-red-800">
                    This removes the selected credential. The super-admin account cannot be deleted here.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <label className="block text-sm font-medium text-red-900">
                  Portal user
                  <select
                    name="profileId"
                    value={deleteUserId}
                    onChange={(event) => setDeleteUserId(event.target.value)}
                    required
                    className={dangerInputClass}
                  >
                    <option value="">Select a user</option>
                    {editableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} — {user.role} — {user.email}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm font-medium text-red-900">
                  Type the email address to confirm
                  <input
                    name="confirmEmail"
                    type="email"
                    required
                    placeholder={deleteUser?.email || "user@example.com"}
                    className={dangerInputClass}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-red-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-red-800">
                  <Users className="h-4 w-4" />
                  {editableUsers.length} removable user accounts
                </div>
                <button
                  type="submit"
                  disabled={!deleteUserId}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete credential
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
