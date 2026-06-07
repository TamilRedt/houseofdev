-- HouseOfDev homepage growth content and lead capture tables.
-- Run in Supabase SQL Editor or apply through the Supabase MCP migration tool.

create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_type text,
  phone text not null,
  email text,
  message text,
  selected_package text,
  budget text,
  source text default 'website',
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price_one_time numeric,
  price_monthly numeric,
  features jsonb default '[]'::jsonb,
  is_popular boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.demo_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  business_type text,
  description text,
  image_url text,
  demo_url text,
  features jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  business_name text,
  message text not null,
  rating int default 5 check (rating between 1 and 5),
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  business_type text,
  selected_date timestamptz,
  selected_package text,
  notes text,
  status text default 'pending',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;
alter table public.packages enable row level security;
alter table public.demo_projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;
alter table public.bookings enable row level security;

revoke all on table public.leads, public.site_settings, public.bookings from anon, authenticated;
revoke all on table public.packages, public.demo_projects, public.testimonials from anon, authenticated;
grant select on table public.packages, public.demo_projects, public.testimonials to anon, authenticated;

drop policy if exists "Admins can manage leads" on public.leads;
create policy "Admins can manage leads"
on public.leads for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active packages" on public.packages;
create policy "Public can read active packages"
on public.packages for select
using (is_active = true);

drop policy if exists "Admins can manage packages" on public.packages;
create policy "Admins can manage packages"
on public.packages for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active demo projects" on public.demo_projects;
create policy "Public can read active demo projects"
on public.demo_projects for select
using (is_active = true);

drop policy if exists "Admins can manage demo projects" on public.demo_projects;
create policy "Admins can manage demo projects"
on public.demo_projects for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read active testimonials" on public.testimonials;
create policy "Public can read active testimonials"
on public.testimonials for select
using (is_active = true);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
on public.bookings for all
using (public.is_admin())
with check (public.is_admin());

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_phone_idx on public.leads(phone);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists packages_active_idx on public.packages(is_active);
create index if not exists demo_projects_active_idx on public.demo_projects(is_active);
create index if not exists testimonials_active_idx on public.testimonials(is_active);
create index if not exists bookings_status_idx on public.bookings(status);

insert into public.packages (name, slug, description, price_one_time, price_monthly, features, is_popular, is_active)
values
  (
    'Starter',
    'starter',
    'Best for small businesses needing a basic online presence.',
    4999,
    999,
    '["1-3 pages", "Mobile responsive design", "Contact form", "WhatsApp button", "Basic SEO setup", "Deployment support"]'::jsonb,
    false,
    true
  ),
  (
    'Business',
    'business',
    'Best for businesses that want enquiries and growth.',
    9999,
    1999,
    '["5-8 pages", "Booking/enquiry form", "WhatsApp integration", "SEO setup", "Analytics setup", "1 month support"]'::jsonb,
    true,
    true
  ),
  (
    'Premium',
    'premium',
    'Best for businesses needing advanced features.',
    24999,
    3999,
    '["Custom pages", "Dashboard/project tracking", "Advanced forms", "SEO structure", "Maintenance support", "Priority updates"]'::jsonb,
    false,
    true
  )
on conflict (slug) do update
set description = excluded.description,
    price_one_time = excluded.price_one_time,
    price_monthly = excluded.price_monthly,
    features = excluded.features,
    is_popular = excluded.is_popular,
    is_active = excluded.is_active;

insert into public.demo_projects (title, slug, business_type, description, demo_url, features, is_active)
values
  (
    'Clinic Website',
    'clinic-website',
    'Clinic',
    'Demo Project: appointment form, WhatsApp enquiry, service pages, and Google-ready SEO structure.',
    '/portfolio/sudersan-clinic',
    '["Appointment form", "WhatsApp enquiry", "Local SEO"]'::jsonb,
    true
  ),
  (
    'Restaurant Website',
    'restaurant-website',
    'Restaurant',
    'Demo Project: menu browsing, reservation enquiry, offer sections, and location-first contact flow.',
    '/portfolio/urban-taste-restaurant',
    '["Menu sections", "Reserve CTA", "Offer blocks"]'::jsonb,
    true
  ),
  (
    'Local Shop Website',
    'local-shop-website',
    'Shop',
    'Demo Project: product highlights, WhatsApp ordering, map-ready contact, and simple enquiry capture.',
    '/portfolio/buildpro-constructions',
    '["Product cards", "WhatsApp order", "Map-ready contact"]'::jsonb,
    true
  )
on conflict (slug) do update
set business_type = excluded.business_type,
    description = excluded.description,
    demo_url = excluded.demo_url,
    features = excluded.features,
    is_active = excluded.is_active;

insert into public.site_settings (key, value)
values
  (
    'homepage_contact',
    '{"phone":"+91 88384 01597","email":"arasanredt@gmail.com","whatsapp":"+918838401597"}'::jsonb
  )
on conflict (key) do update
set value = excluded.value,
    updated_at = now();
