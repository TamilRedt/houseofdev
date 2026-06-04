# Deployment Guide

## 1. Supabase

1. Create a Supabase project.
2. Run `database/schema.sql` in the SQL editor.
3. Create a private storage bucket named `career-resumes`.
4. Copy these values into Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_RESUME_BUCKET`

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it to the browser.

The portal routes need both the public auth variables and the service role key. Run the latest `database/schema.sql` for a new database. If the database already exists, run `database/portal-system-migration.sql` to create or repair consultation requests, account requests, profiles, client credits, employee attendance, project assignments, account change requests, project reviews, EXP records, portal activity logs, notification events, and portal policies without deleting existing data.

Portal credentials are created in Supabase Auth and mapped through `public.profiles.role`. Signed-out visitors see a shared access screen, not demo dashboard data. See `docs/PORTAL_USERS.md`.

## 2. AWS SES

1. Verify the sender domain or sender email in AWS SES.
2. Move SES out of sandbox mode if sending to unverified recipients.
3. Create a scoped IAM user or role for SES send access.
4. Add these variables to Vercel:
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `CONTACT_EMAIL_FROM`
   - `CONTACT_EMAIL_TO`

## 3. Telegram and WhatsApp Alerts

Consultation, account access, career, and account change requests can notify the team through multiple channels. Configure any channels you want to use:

- Telegram:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- WhatsApp Cloud API:
  - `WHATSAPP_GRAPH_API_VERSION`
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`
  - `WHATSAPP_TO_NUMBER`

If a channel is missing, the form still stores the request and records a skipped notification event in Supabase.

## 4. Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select the `houseofdev` project root if this repository contains other folders.
4. Add environment variables.
5. Build command: `npm run build`
6. Output: Next.js default
7. Deploy.

## 5. DNS and Domain

1. Add the production domain in Vercel.
2. Configure DNS records through your registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin, for example `https://houseofdev.com`.

## 6. Post-Deploy Checks

Run these after deployment:

- Open `/api/health`
- Confirm `/api/health` reports `portalBackendConfigured: true`
- Sign in to `/portal`, `/employee-portal`, and `/admin-dashboard` with users whose `profiles.role` values match the route
- Submit a consultation request and confirm rows appear in `contact_requests`, `consultation_requests`, `portal_activity_logs`, and `notification_events`
- Submit a portal access request and confirm a row appears in `portal_access_requests`
- Sign in as an admin and create a test credential, then confirm rows appear in `profiles` and `portal_credential_events`
- Sign in as a client and submit a package/account change request, then confirm a row appears in `account_change_requests`
- Sign in as an employee and save a check-in/check-out record in `employee_attendance`
- Open `/sitemap.xml`
- Open `/robots.txt`
- Submit a contact form
- Submit a career form with a small test resume
- Confirm Supabase rows are created
- Confirm the configured email, Telegram, or WhatsApp notification arrives
- Run Lighthouse on Home, Services, Blog, and Contact

