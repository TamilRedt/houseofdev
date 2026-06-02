-- HouseOfDev Supabase/PostgreSQL schema
-- Run in the Supabase SQL editor after creating the project.

create extension if not exists "pgcrypto";

create type user_role as enum (
  'super_admin',
  'admin',
  'employee',
  'business_client',
  'individual_client'
);

create type request_status as enum (
  'new',
  'reviewing',
  'approved',
  'in_progress',
  'completed',
  'closed'
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role user_role not null default 'individual_client',
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  benefits jsonb not null default '[]'::jsonb,
  process jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status request_status not null default 'new',
  budget numeric(12,2),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  email text not null,
  phone text not null,
  industry text not null,
  budget text not null,
  service_required text not null,
  message text not null,
  source text not null default 'website',
  status request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table career_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  role text not null,
  portfolio text,
  message text not null,
  resume_path text,
  status request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  excerpt text not null,
  category text not null,
  tags text[] not null default '{}',
  content jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references blog_posts(id) on delete cascade,
  author_name text not null,
  author_email text,
  body text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  invoice_number text unique not null,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status text not null default 'draft',
  file_path text,
  due_date date,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references invoices(id) on delete set null,
  amount numeric(12,2) not null,
  provider text,
  provider_reference text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references profiles(id) on delete set null,
  project_id uuid references projects(id) on delete set null,
  subject text not null,
  body text not null,
  priority text not null default 'normal',
  status request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table employee_attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  mode text not null default 'office',
  notes text,
  unique(employee_id, work_date)
);

create table leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  status request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  assignee_id uuid references profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo',
  due_date date,
  created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table contact_requests enable row level security;
alter table career_applications enable row level security;
alter table projects enable row level security;
alter table project_updates enable row level security;
alter table blog_posts enable row level security;
alter table blog_comments enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table support_tickets enable row level security;
alter table employee_attendance enable row level security;
alter table leave_requests enable row level security;
alter table tasks enable row level security;
alter table audit_logs enable row level security;

-- Public inserts used by server actions with service role.
-- Keep direct anon access disabled unless you add explicit policies.

create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Published blog posts are public"
on blog_posts for select
using (is_published = true);

create policy "Approved comments are public"
on blog_comments for select
using (is_approved = true);

create policy "Clients can read own projects"
on projects for select
using (client_id = auth.uid());

create policy "Clients can read own invoices"
on invoices for select
using (client_id = auth.uid());

create policy "Clients can read own tickets"
on support_tickets for select
using (client_id = auth.uid());

create policy "Employees can read own attendance"
on employee_attendance for select
using (employee_id = auth.uid());

create policy "Employees can read own leave requests"
on leave_requests for select
using (employee_id = auth.uid());

create index contact_requests_status_idx on contact_requests(status);
create index career_applications_status_idx on career_applications(status);
create index projects_client_id_idx on projects(client_id);
create index support_tickets_client_id_idx on support_tickets(client_id);
create index blog_posts_slug_idx on blog_posts(slug);

