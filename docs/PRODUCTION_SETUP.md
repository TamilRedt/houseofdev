# Production Setup Guide

## Security

- Keep Supabase service role and AWS secrets only in server-side environment variables.
- Use Supabase RLS for every table exposed to authenticated users.
- Add admin policies only after implementing explicit role checks.
- Add WAF/rate limiting at Vercel or a managed edge layer for production traffic.
- Rotate credentials after initial deployment and after team changes.
- Review audit logs for admin, finance, invoice, user, and project actions.

## Authentication and Authorization

Planned roles:

- Super Admin
- Admin
- Employee
- Business Client
- Individual Client

Recommended flow:

1. Use Supabase Auth for login and registration.
2. Run the schema trigger so each signup creates a `profiles` row with the default role `individual_client`.
3. Allow only super admins to promote roles.
4. Re-check authorization in Server Components, Server Actions, and Route Handlers.
5. Avoid relying only on middleware for access control.

Implemented portal access:

- `/portal`: `individual_client`, `business_client`, `admin`, and `super_admin`.
- `/employee-portal`: `employee`, `admin`, and `super_admin`.
- `/admin-dashboard`: `admin` and `super_admin`.

## Performance

- Use `next/image` for remote images and set priority only for above-the-fold assets.
- Keep client components limited to interactive islands.
- Keep service, industry, solution, portfolio, and blog detail pages statically generated.
- Use Supabase indexes for dashboard filters.
- Add real monitoring through Vercel Analytics, Speed Insights, or a dedicated APM.

## SEO

Included:

- Dynamic metadata
- Open Graph route image
- Twitter card metadata
- LocalBusiness schema
- Organization schema
- Sitemap
- Robots.txt

Recommended next steps:

- Add real address, phone, and social URLs when public.
- Add dedicated landing pages for Bangalore, Hosur, and priority service keywords.
- Add real case studies and verified testimonials.

## Operations

- Create admin views for contact requests, career applications, projects, invoices, payments, and support tickets.
- Create status transitions for requests and tickets.
- Add email templates for client updates.
- Add file retention rules for resumes, project assets, and invoices.
- Back up Supabase daily for production.

