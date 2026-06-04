#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const roles = new Set(["super_admin", "admin", "employee", "business_client", "individual_client"]);
const portalRoutesByRole = {
  super_admin: ["/admin-dashboard", "/employee-portal", "/portal"],
  admin: ["/admin-dashboard", "/employee-portal", "/portal"],
  employee: ["/employee-portal"],
  business_client: ["/portal"],
  individual_client: ["/portal"],
};

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);

    if (key === "help" || key === "generate-password") {
      options[key] = true;
      continue;
    }

    const value = argv[index + 1];

    if (!value || value.startsWith("--")) {
      throw new Error(`Missing value for --${key}.`);
    }

    options[key] = value;
    index += 1;
  }

  return options;
}

function usage() {
  console.log(`
Create or update a Supabase Auth user and matching public.profiles role.

Usage:
  npm run create:portal-user -- --email user@example.com --password "StrongPass123!" --role admin --name "HouseOfDev Admin"

Options:
  --email               Required login email.
  --password            Login password. Required unless --generate-password is used.
  --generate-password   Generate a strong temporary password and print it once.
  --role                One of: super_admin, admin, employee, business_client, individual_client.
  --name                Full name stored in public.profiles.
  --company             Optional company name.
  --phone               Optional phone number.

Required env:
  NEXT_PUBLIC_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`);
}

function required(value, label) {
  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function normalizeSupabaseUrl(value) {
  const raw = value?.trim().replace(/^['"]|['"]$/g, "");

  if (!raw) {
    return "";
  }

  const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  return url.origin;
}

function generatedPassword() {
  return randomBytes(18).toString("base64url");
}

async function findUserByEmail(supabase, email) {
  const normalizedEmail = email.toLowerCase();
  const perPage = 1000;

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) {
      throw new Error(`Could not search existing users: ${error.message}`);
    }

    const found = data.users.find((user) => user.email?.toLowerCase() === normalizedEmail);

    if (found || data.users.length < perPage) {
      return found || null;
    }
  }

  return null;
}

async function createOrUpdateAuthUser(supabase, options) {
  const metadata = {
    full_name: options.name,
    phone: options.phone || undefined,
    company_name: options.company || undefined,
  };

  const createResult = await supabase.auth.admin.createUser({
    email: options.email,
    password: options.password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createResult.error) {
    return { action: "created", user: createResult.data.user };
  }

  const message = createResult.error.message.toLowerCase();

  if (!message.includes("already") && !message.includes("registered")) {
    throw new Error(`Could not create auth user: ${createResult.error.message}`);
  }

  const existingUser = await findUserByEmail(supabase, options.email);

  if (!existingUser) {
    throw new Error("Supabase reported that the email exists, but the user could not be found.");
  }

  const updateResult = await supabase.auth.admin.updateUserById(existingUser.id, {
    password: options.password,
    email_confirm: true,
    user_metadata: {
      ...(existingUser.user_metadata || {}),
      ...metadata,
    },
  });

  if (updateResult.error) {
    throw new Error(`Could not update existing auth user: ${updateResult.error.message}`);
  }

  return { action: "updated", user: updateResult.data.user || existingUser };
}

async function upsertProfile(supabase, user, options) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: options.name,
      email: options.email,
      phone: options.phone || null,
      role: options.role,
      company_name: options.company || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(
      `Could not upsert public.profiles row: ${error.message}. Run database/portal-auth-migration.sql in Supabase, then try again.`,
    );
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    usage();
    return;
  }

  options.email = required(options.email, "--email").trim().toLowerCase();
  options.role = options.role || "individual_client";
  options.name = options.name || options.email.split("@")[0] || "Portal User";
  options.password = options.password || (options["generate-password"] ? generatedPassword() : "");

  if (!roles.has(options.role)) {
    throw new Error(`Invalid --role "${options.role}". Use one of: ${Array.from(roles).join(", ")}.`);
  }

  if (!options.password) {
    throw new Error("--password is required unless --generate-password is used.");
  }

  if (options.password.length < 8) {
    throw new Error("Use a password with at least 8 characters.");
  }

  const supabaseUrl = normalizeSupabaseUrl(required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"));
  const serviceRoleKey = required(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { action, user } = await createOrUpdateAuthUser(supabase, options);
  await upsertProfile(supabase, user, options);

  console.log(`Portal user ${action}.`);
  console.log(`Email: ${options.email}`);
  console.log(`Password: ${options.password}`);
  console.log(`Role: ${options.role}`);
  console.log(`Allowed portals: ${portalRoutesByRole[options.role].join(", ")}`);
  console.log(`Supabase user id: ${user.id}`);
  console.log("Store the password securely; Supabase stores only the hashed password.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
