# HouseOfDev Portal Testing Checklist

Use this checklist before merging portal changes or giving access to a real client.

## 1. Environment

Confirm these are set in Vercel production and preview environments:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_RESUME_BUCKET`

Optional notification channels:

- AWS SES: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `CONTACT_EMAIL_FROM`, `CONTACT_EMAIL_TO`
- Telegram: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- WhatsApp: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TO_NUMBER`

## 2. First Super Admin

Create the first super admin using the server-only script:

```bash
npm run create:portal-user -- --email owner@example.com --generate-password --role super_admin --name "HouseOfDev Owner"
```

Store the generated password in a password manager and change it after first login.

## 3. Test Accounts

Create one account for each role:

- `super_admin`
- `admin`
- `employee`
- `business_client`
- `individual_client`

Never use public self-registration for privileged roles.

## 4. Database Seed

After the Auth users exist, update the placeholder emails in:

```text
database/production-test-seed.sql
```

Then run the SQL in Supabase SQL Editor.

## 5. Portal Access Tests

### Client Portal: `/portal`

Expected:

- Business client can access.
- Individual client can access.
- Employee is blocked.
- Admin and super admin can access for support.
- Client sees only their own projects, invoices, support tickets, and credit records.

### Employee Portal: `/employee-portal`

Expected:

- Employee can access.
- Admin and super admin can access.
- Client users are blocked.
- Employee sees only assigned projects and tasks.
- Attendance check-in and check-out create/update one record for the India work date.

### Admin Dashboard: `/admin-dashboard`

Expected:

- Admin and super admin can access.
- Employee and client users are blocked.
- Admin can see leads, consultations, access requests, users, projects, invoices, support tickets, and activity logs.
- Only super admin can create or promote admin-level users.

## 6. Form Tests

Submit and verify database rows for:

- Contact request
- Consultation request
- Portal access request
- Career application
- Account change request
- Support ticket

## 7. Security Checks

- No service-role key in browser code.
- No secret values committed to GitHub.
- RLS enabled on all user-facing tables.
- Server Actions re-check user role before modifying data.
- Client users cannot read another client's records.
- Employee users cannot read unrelated employee records.
- Admin actions are logged in `portal_activity_logs` or `audit_logs`.

## 8. Build Checks

Run locally before merging:

```bash
npm install
npm run lint
npm run build
```

On Windows PowerShell, use:

```bash
npm.cmd install
npm.cmd run lint
npm.cmd run build
```

## 9. Merge Rule

Do not merge if any of these are true:

- Build fails.
- Role access is wrong.
- RLS blocks legitimate users or exposes wrong records.
- Demo data appears as real production data.
- Admin credential workflow fails.
- Any secret appears in frontend code or Git history.
