# HouseOfDev

Premium local-business website and portal foundation built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, AWS SES, React Hook Form, Zod, and Server Actions.

**Live Website:** https://houseofdev-8xymz9d9s-tamilredts-projects.vercel.app

## What Is Included

- Premium responsive homepage with six focused sections: Hero, Services, Demo Work, Process, Pricing, and Contact/WhatsApp CTA.
- Mobile-safe layout with overflow guards, zoom-resistant cards/forms, sticky mobile CTA, and a compact dark navigation experience.
- Public pages: Home, Services, Industries, Solutions, Portfolio, Pricing, About Us, Careers, Blog, Contact.
- Dynamic detail pages for services, industries, solutions, portfolio projects, and blog posts.
- Blog explorer with search, categories, tags, related posts, and comment-ready UI.
- Homepage lead, contact, consultation, portal access, and career forms using Zod validation, Server Actions, Supabase inserts, email/Telegram/WhatsApp notifications, honeypot spam control, and basic rate limiting.
- Client portal, employee portal, and admin dashboard routes with Supabase Auth, role checks, admin-only credential create/update/delete, request-first account access, client credits, employee attendance, project assignments, account change requests, activity logs, reviews, and EXP records.
- SEO foundations: dynamic metadata, Open Graph route image, Twitter cards, organization schema, local business schema, sitemap, and robots.txt.
- Production docs, environment template, Supabase/PostgreSQL migrations, and portal user setup command.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase and PostgreSQL
- AWS SES, Telegram, and WhatsApp Cloud API notifications
- Vercel deployment
- React Hook Form
- Zod validation
- Server Actions

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell, if `npm` is blocked by script execution policy, use `npm.cmd`:

```bash
npm.cmd run dev
```

## Environment

Create `.env.local` using `.env.example`.

Forms can be tested locally without credentials, but submissions are only persisted when Supabase variables are configured. Lead notifications are sent by whichever channels are configured: AWS SES email, Telegram bot, and WhatsApp Cloud API. Portal routes do not expose dashboard data to signed-out visitors; they show the shared sign-in, password reset, and request-access screen.

Portal credentials live in Supabase Auth, while dashboard access is controlled by `public.profiles.role`. Signed-out visitors see only a shared access screen with sign-in, password reset, and request-access forms. After adding Supabase env vars and confirming the person by call or message, create users from `/admin-dashboard` or with:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --password "StrongPass123!" --role admin --name "HouseOfDev Admin"
```

See `docs/PORTAL_USERS.md` for client, employee, and admin examples.

For an existing Supabase database, run these migrations in order:

1. `database/portal-auth-migration.sql`
2. `database/portal-system-migration.sql`
3. `database/homepage-growth-migration.sql`

The homepage migration adds `leads`, `packages`, `demo_projects`, `testimonials`, `site_settings`, and `bookings`. Public visitors can only read active package/demo/testimonial content. Lead, booking, and settings data are private and are written through server-side actions.

Do not delete live Supabase tables unless there is a verified backup and an explicit cleanup plan. Current production data uses `contact_requests`, `consultation_requests`, `leads`, `profiles`, Auth users, and portal audit tables.

## Folder Structure

```text
src/app
  actions.ts                  Server Actions for homepage leads, contact, and careers
  portal-actions.ts           Server Actions for portal sign-in, credential management, and portal workflows
  api/health                  Health check route
  services/[slug]             Dynamic service detail routes
  industries/[slug]           Dynamic industry routes
  solutions/[slug]            Dynamic solution routes
  portfolio/[slug]            Dynamic portfolio routes
  blog/[slug]                 Dynamic blog routes
src/components                Reusable UI, forms, navigation, homepage, portal, and visual components
src/lib                       Data, homepage content, SEO, validation, Supabase, AWS, portal data, utilities
database/schema.sql           Supabase/PostgreSQL schema and RLS starter
database/homepage-growth-migration.sql  Homepage content and lead capture tables
database/portal-system-migration.sql  Idempotent portal database repair/migration
docs/DEPLOYMENT.md            Vercel/Supabase/AWS deployment guide
docs/PRODUCTION_SETUP.md      Production hardening checklist
docs/PORTAL_USERS.md          Supabase Auth credential setup
```

## Verification

```bash
npm run lint
npm run build
```

Before deploying UI changes, check desktop and mobile widths. The homepage is designed to stay stable at common mobile widths and browser zoom levels without horizontal page overflow.

## Deployment

Push to `main` to trigger the connected Vercel production deployment for [https://houseofdev-mauve.vercel.app](https://houseofdev-mauve.vercel.app). See `docs/DEPLOYMENT.md`.
