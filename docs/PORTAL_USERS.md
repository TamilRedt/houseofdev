# Portal Users and Credentials

The portal does not keep user passwords in the website code. Credentials live in Supabase Auth, and portal permissions live in the `public.profiles` table.

Signed-out visitors do not see client, employee, or admin dashboard data. Every portal route shows the same access screen with sign-in, password reset, and request-access options.

## What The Sign-In Message Means

`Auth session missing` means the browser does not have a Supabase login session cookie yet. It is the normal signed-out state. The app suppresses that technical message and asks the visitor to sign in.

After a valid Supabase Auth user signs in, the app reads that user's `public.profiles.role` and opens the matching portal automatically.

## Role Access

- `individual_client` and `business_client`: `/portal`
- `employee`: `/employee-portal`
- `admin` and `super_admin`: `/admin-dashboard`, `/employee-portal`, and `/portal`

## Request Before Credentials

Do not create portal credentials for every visitor. If a visitor does not have an account, they should use the portal access request form or the contact page. The portal form stores a `portal_access_requests` row when the portal system migration has been run, and falls back to `contact_requests` for older databases. The contact consultation form stores both a `contact_requests` row and a `consultation_requests` row.

Recommended flow:

1. Visitor requests access with name, phone, email, account type, and message.
2. Team confirms the person by call or message.
3. Admin signs in to `/admin-dashboard`.
4. Admin creates credentials from the admin dashboard or with the repo script.
5. The app stores the user details in `public.profiles`.
6. The app stores client credit details in `client_accounts` when the user is a client.
7. User signs in and is routed to the right portal.

## Database Tables

Run `database/portal-system-migration.sql` in Supabase SQL Editor for an existing project. It creates or repairs the portal system without deleting data.

Main portal tables:

- `profiles`: one row per Supabase Auth user, with `role`, phone, company, job title, department, and active status.
- `consultation_requests`: free consultation requests with phone, email, preferred date/time, status, and message.
- `portal_access_requests`: account requests from visitors before credentials are created.
- `portal_credential_events`: admin-only audit trail for credential creation. It never stores passwords.
- `portal_activity_logs`: login success/failure, logout, password reset, password update, credential creation, consultation, and account-change audit records.
- `account_change_requests`: client/admin-visible requests such as package upgrades, package changes, password help, and account detail changes.
- `notification_events`: email, Telegram, and WhatsApp notification attempts for consultation, career, access, and account-change requests.
- `client_accounts`: client credit balance, credit limit, billing email, and account status.
- `client_credit_ledger`: credit additions and usage history shown to clients.
- `projects` and `project_updates`: client project status, progress, budget, credit cost, and updates.
- `project_members`: employee project assignments, upcoming work, and finished work.
- `tasks`: employee tasks, due dates, priority, and task EXP.
- `employee_attendance`: employee check-in/check-out records.
- `leave_requests`: employee leave requests.
- `project_reviews`: finished project reviews for employees and projects.
- `employee_xp_events`: employee EXP points history.
- `invoices`, `payments`, and `support_tickets`: client billing and support records.

## Create Credentials As Admin

Only an authenticated `admin` or `super_admin` can create portal credentials inside the website. The public request form does not create Supabase Auth users.

Admin dashboard flow:

1. Sign in to `/admin-dashboard`.
2. Use `Create Portal Credential`.
3. Enter full name, email, phone, temporary password, role, and optional company/team details.
4. Share the temporary password securely with the user.
5. Ask the user to use Forgot Password after first sign-in if they want to set their own password.

The server action checks the signed-in admin role before calling the Supabase Admin API. Passwords are sent to Supabase Auth only; they are not stored in `profiles` or any portal table.

## Notification Flow

Requests are stored first, then the app attempts configured notifications:

- Email uses AWS SES variables from `.env.example`.
- Telegram uses `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
- WhatsApp uses the WhatsApp Cloud API variables `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TO_NUMBER`, and `WHATSAPP_GRAPH_API_VERSION`.

Each attempt is written to `notification_events`, so admins can see whether a channel sent, failed, or was skipped because the environment variables were missing.

## Create Credentials From This Repo

1. Add Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. If the database already exists, run `database/portal-system-migration.sql` once in the Supabase SQL Editor. For a new database, run the full `database/schema.sql`.

3. Create the user:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --password "StrongPass123!" --role admin --name "HouseOfDev Admin"
```

Create an employee:

```bash
npm run create:portal-user -- --email employee@houseofdev.com --password "StrongPass123!" --role employee --name "Team Member" --company "HouseOfDev"
```

Create a client:

```bash
npm run create:portal-user -- --email client@example.com --password "StrongPass123!" --role business_client --name "Demo Client" --company "Demo Business"
```

You can generate a temporary password instead:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --generate-password --role admin --name "HouseOfDev Admin"
```

The command creates or updates the Supabase Auth login and upserts the matching `public.profiles` row. Store the password securely; Supabase stores only the hashed password.

## Password Reset

The access screen includes a password reset form. Supabase sends the reset email, the link returns to `/auth/callback`, and the user sets a new password at `/update-password`.

## Create Credentials Manually In Supabase

1. Open Supabase Dashboard.
2. Go to Authentication > Users.
3. Click Add user.
4. Enter email and password, then confirm the user.
5. Go to Table Editor > `profiles`.
6. Find the row with the same user id and set `role` to the required value.

If the profile row is missing, run `database/portal-system-migration.sql`, then create the user again or insert a row with the Auth user id.
