# HouseOfDev

Premium digital agency website and business management foundation built with Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Supabase, PostgreSQL, AWS SES, React Hook Form, Zod, Server Actions.

**Live Demo:** https://[houseofdev-mm47yh2hv-tamilredts-projects.vercel.app](https://houseofdev-mauve.vercel.app?_vercel_share=JRkn93fxSY0vtlD04KxXhNybnzPn1whu)

## What Is Included

- Premium responsive agency website with sticky navigation, mega menu, mobile navigation, animated statistics, structured CTAs, and polished route-level pages.
- Public pages: Home, Services, Industries, Solutions, Portfolio, Pricing, About Us, Careers, Blog, Contact.
- Dynamic detail pages for services, industries, solutions, portfolio projects, and blog posts.
- Blog explorer with search, categories, tags, related posts, and comment-ready UI.
- Contact and career forms using React Hook Form, Zod validation, Server Actions, Supabase inserts, AWS SES notifications, honeypot spam control, and basic rate limiting.
- Client portal, employee portal, and admin dashboard routes with Supabase Auth, role checks, live data loading, and demo fallback when credentials are not configured.
- SEO foundations: dynamic metadata, Open Graph route image, Twitter cards, organization schema, local business schema, sitemap, and robots.txt.
- Production docs, environment template, and Supabase/PostgreSQL schema.

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

Forms work in demo mode without credentials, but submissions are only persisted when Supabase variables are configured. Email notifications are only sent when AWS SES variables are configured. Portal routes show safe demo data until Supabase URL, anon key, and service role key are configured.

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
docs/DEPLOYMENT.md            Vercel/Supabase/AWS deployment guide
docs/PRODUCTION_SETUP.md      Production hardening checklist
```

## Verification

```bash
npm run lint
npm run build
```

## Deployment

See `docs/DEPLOYMENT.md`.
