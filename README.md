# HouseOfDev

Premium digital agency website and business management foundation built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, AWS SES, React Hook Form, Zod, Server Actions.

**Live Demo:** https://[houseofdev-mm47yh2hv-tamilredts-projects.vercel.app](https://houseofdev-mauve.vercel.app?_vercel_share=JRkn93fxSY0vtlD04KxXhNybnzPn1whu)

## What Is Included

- Premium responsive agency website with sticky navigation, mega menu, mobile navigation, animated statistics, structured CTAs, and polished route-level pages.
- Public pages: Home, Services, Industries, Solutions, Portfolio, Pricing, About Us, Careers, Blog, Contact.
- Dynamic detail pages for services, industries, solutions, portfolio projects, and blog posts.
- Blog explorer with search, categories, tags, related posts, and comment-ready UI.
- Contact and career forms using React Hook Form, Zod validation, Server Actions, Supabase inserts, AWS SES notifications, honeypot spam control, and basic rate limiting.
- Client portal, employee portal, and admin dashboard routes with Supabase Auth, role checks, admin-only credential creation, request-first account access, client credits, employee attendance, project assignments, reviews, and EXP records.
- SEO foundations: dynamic metadata, Open Graph route image, Twitter cards, organization schema, local business schema, sitemap, and robots.txt.
- Production docs, environment template, Supabase/PostgreSQL schema, and portal user setup command.

## Tech Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase and PostgreSQL
- AWS SES for notifications
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

Forms work in demo mode without credentials, but submissions are only persisted when Supabase variables are configured. Email notifications are only sent when AWS SES variables are configured. Portal routes do not expose dashboard data to signed-out visitors; they show the shared sign-in, password reset, and request-access screen.

Portal credentials live in Supabase Auth, while dashboard access is controlled by `public.profiles.role`. Signed-out visitors see only a shared access screen with sign-in, password reset, and request-access forms. After adding Supabase env vars and confirming the person by call or message, create users from `/admin-dashboard` or with:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --password "StrongPass123!" --role admin --name "HouseOfDev Admin"
```

See `docs/PORTAL_USERS.md` for client, employee, and admin examples.

For an existing Supabase database, run `database/portal-system-migration.sql` once to add portal access requests, admin credential audit events, client credit tables, employee assignments, attendance, project reviews, and EXP tracking.

## Folder Structure

```text
src/app
  actions.ts                  Server Actions for contact and careers
  portal-actions.ts           Server Actions for portal sign-in and sign-out
  api/health                  Health check route
  services/[slug]             Dynamic service detail routes
  industries/[slug]           Dynamic industry routes
  solutions/[slug]            Dynamic solution routes
  portfolio/[slug]            Dynamic portfolio routes
  blog/[slug]                 Dynamic blog routes
src/components                Reusable UI, forms, navigation, visuals
src/lib                       Data, SEO, validation, Supabase, AWS, portal data, utilities
database/schema.sql           Supabase/PostgreSQL schema and RLS starter
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

## Deployment

See `docs/DEPLOYMENT.md`.
