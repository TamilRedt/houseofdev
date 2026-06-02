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

## 3. Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Select the `houseofdev` project root if this repository contains other folders.
4. Add environment variables.
5. Build command: `npm run build`
6. Output: Next.js default
7. Deploy.

## 4. DNS and Domain

1. Add the production domain in Vercel.
2. Configure DNS records through your registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to the production origin, for example `https://houseofdev.com`.

## 5. Post-Deploy Checks

Run these after deployment:

- Open `/api/health`
- Open `/sitemap.xml`
- Open `/robots.txt`
- Submit a contact form
- Submit a career form with a small test resume
- Confirm Supabase rows are created
- Confirm AWS SES notification arrives
- Run Lighthouse on Home, Services, Blog, and Contact

