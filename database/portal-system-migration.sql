-- HouseOfDev portal system migration.
-- Run this in Supabase SQL Editor for an existing database.
-- It is safe to run more than once.

create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'user_role'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.user_role as enum (
      'super_admin',
      'admin',
      'employee',
      'business_client',
      'individual_client'
    );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'request_status'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.request_status as enum (
      'new',
      'reviewing',
      'approved',
      'in_progress',
      'completed',
      'closed'
    );
  end if;
end
$$;

alter type public.request_status add value if not exists 'approved';

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  role public.user_role not null default 'individual_client',
  company_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists role public.user_role not null default 'individual_client';
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists job_title text;
alter table public.profiles add column if not exists department text;
alter table public.profiles add column if not exists exp_points integer not null default 0;
alter table public.profiles add column if not exists is_active boolean not null default true;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $function$
  select role from public.profiles where id = auth.uid()
$function$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $function$
  select public.current_user_role() in ('admin', 'super_admin')
$function$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $function$
begin
  insert into public.profiles (id, full_name, email, phone, role, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Portal User'),
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'phone',
    'individual_client',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      phone = coalesce(public.profiles.phone, excluded.phone),
      company_name = coalesce(public.profiles.company_name, excluded.company_name),
      updated_at = now();

  return new;
end;
$function$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text,
  email text not null,
  phone text not null,
  industry text,
  budget text,
  service_required text,
  message text,
  source text not null default 'website',
  status public.request_status not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.contact_requests add column if not exists company_name text;
alter table public.contact_requests add column if not exists industry text;
alter table public.contact_requests add column if not exists budget text;
alter table public.contact_requests add column if not exists service_required text;
alter table public.contact_requests add column if not exists message text;
alter table public.contact_requests add column if not exists source text not null default 'website';
alter table public.contact_requests add column if not exists status public.request_status not null default 'new';
alter table public.contact_requests add column if not exists created_at timestamptz not null default now();

create table if not exists public.portal_access_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  account_type text not null,
  message text,
  source text not null default 'portal-access',
  status public.request_status not null default 'new',
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_credential_events (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  email text not null,
  role public.user_role not null,
  action text not null default 'created',
  source_request_id uuid references public.portal_access_requests(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status public.request_status not null default 'new',
  budget numeric(12,2),
  credit_cost numeric(12,2) not null default 0,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects add column if not exists credit_cost numeric(12,2) not null default 0;
alter table public.projects add column if not exists progress_percent integer not null default 0;

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.client_accounts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  credit_balance numeric(12,2) not null default 0,
  credit_limit numeric(12,2) not null default 0,
  billing_email text,
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  credit_change numeric(12,2) not null,
  description text not null,
  reference_type text,
  reference_id uuid,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  employee_id uuid not null references public.profiles(id) on delete cascade,
  role_title text not null default 'Team Member',
  assignment_status text not null default 'assigned',
  assigned_at timestamptz not null default now(),
  due_date date,
  completed_at timestamptz,
  unique(project_id, employee_id)
);

create table if not exists public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete set null,
  employee_id uuid references public.profiles(id) on delete set null,
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  review text not null,
  review_type text not null default 'client',
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  invoice_number text unique not null,
  amount numeric(12,2) not null,
  currency text not null default 'INR',
  status text not null default 'draft',
  file_path text,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete set null,
  amount numeric(12,2) not null,
  provider text,
  provider_reference text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  subject text not null,
  body text not null,
  priority text not null default 'normal',
  status public.request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employee_attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  work_date date not null,
  check_in timestamptz,
  check_out timestamptz,
  mode text not null default 'office',
  status text not null default 'present',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(employee_id, work_date)
);

alter table public.employee_attendance add column if not exists status text not null default 'present';
alter table public.employee_attendance add column if not exists created_at timestamptz not null default now();
alter table public.employee_attendance add column if not exists updated_at timestamptz not null default now();

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  reason text not null,
  status public.request_status not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'normal',
  exp_points integer not null default 0,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.tasks add column if not exists priority text not null default 'normal';
alter table public.tasks add column if not exists exp_points integer not null default 0;
alter table public.tasks add column if not exists completed_at timestamptz;

create table if not exists public.employee_xp_events (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null,
  reason text not null,
  project_id uuid references public.projects(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.contact_requests enable row level security;
alter table public.portal_access_requests enable row level security;
alter table public.portal_credential_events enable row level security;
alter table public.projects enable row level security;
alter table public.project_updates enable row level security;
alter table public.client_accounts enable row level security;
alter table public.client_credit_ledger enable row level security;
alter table public.project_members enable row level security;
alter table public.project_reviews enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.support_tickets enable row level security;
alter table public.employee_attendance enable row level security;
alter table public.leave_requests enable row level security;
alter table public.tasks enable row level security;
alter table public.employee_xp_events enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Admins can read profiles" on public.profiles;
create policy "Admins can read profiles"
on public.profiles for select
using (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage contact requests" on public.contact_requests;
create policy "Admins can manage contact requests"
on public.contact_requests for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can manage portal access requests" on public.portal_access_requests;
create policy "Admins can manage portal access requests"
on public.portal_access_requests for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read portal credential events" on public.portal_credential_events;
create policy "Admins can read portal credential events"
on public.portal_credential_events for select
using (public.is_admin());

drop policy if exists "Admins can insert portal credential events" on public.portal_credential_events;
create policy "Admins can insert portal credential events"
on public.portal_credential_events for insert
with check (public.is_admin());

drop policy if exists "Clients can read own projects" on public.projects;
create policy "Clients can read own projects"
on public.projects for select
using (client_id = auth.uid());

drop policy if exists "Employees can read assigned projects" on public.projects;
create policy "Employees can read assigned projects"
on public.projects for select
using (
  exists (
    select 1 from public.project_members
    where project_members.project_id = projects.id
      and project_members.employee_id = auth.uid()
  )
);

drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects"
on public.projects for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own project updates" on public.project_updates;
create policy "Clients can read own project updates"
on public.project_updates for select
using (
  exists (
    select 1 from public.projects
    where projects.id = project_updates.project_id
      and projects.client_id = auth.uid()
  )
);

drop policy if exists "Employees can read assigned project updates" on public.project_updates;
create policy "Employees can read assigned project updates"
on public.project_updates for select
using (
  exists (
    select 1
    from public.project_members
    where project_members.project_id = project_updates.project_id
      and project_members.employee_id = auth.uid()
  )
);

drop policy if exists "Admins can manage project updates" on public.project_updates;
create policy "Admins can manage project updates"
on public.project_updates for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own account" on public.client_accounts;
create policy "Clients can read own account"
on public.client_accounts for select
using (profile_id = auth.uid());

drop policy if exists "Admins can manage client accounts" on public.client_accounts;
create policy "Admins can manage client accounts"
on public.client_accounts for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own credit ledger" on public.client_credit_ledger;
create policy "Clients can read own credit ledger"
on public.client_credit_ledger for select
using (client_id = auth.uid());

drop policy if exists "Admins can manage client credit ledger" on public.client_credit_ledger;
create policy "Admins can manage client credit ledger"
on public.client_credit_ledger for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Employees can read own project memberships" on public.project_members;
create policy "Employees can read own project memberships"
on public.project_members for select
using (employee_id = auth.uid());

drop policy if exists "Clients can read project memberships for own projects" on public.project_members;
create policy "Clients can read project memberships for own projects"
on public.project_members for select
using (
  exists (
    select 1 from public.projects
    where projects.id = project_members.project_id
      and projects.client_id = auth.uid()
  )
);

drop policy if exists "Admins can manage project memberships" on public.project_members;
create policy "Admins can manage project memberships"
on public.project_members for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read reviews for own projects" on public.project_reviews;
create policy "Clients can read reviews for own projects"
on public.project_reviews for select
using (
  exists (
    select 1 from public.projects
    where projects.id = project_reviews.project_id
      and projects.client_id = auth.uid()
  )
);

drop policy if exists "Employees can read own project reviews" on public.project_reviews;
create policy "Employees can read own project reviews"
on public.project_reviews for select
using (employee_id = auth.uid());

drop policy if exists "Admins can manage project reviews" on public.project_reviews;
create policy "Admins can manage project reviews"
on public.project_reviews for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own invoices" on public.invoices;
create policy "Clients can read own invoices"
on public.invoices for select
using (client_id = auth.uid());

drop policy if exists "Admins can manage invoices" on public.invoices;
create policy "Admins can manage invoices"
on public.invoices for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own payments" on public.payments;
create policy "Clients can read own payments"
on public.payments for select
using (
  exists (
    select 1 from public.invoices
    where invoices.id = payments.invoice_id
      and invoices.client_id = auth.uid()
  )
);

drop policy if exists "Admins can manage payments" on public.payments;
create policy "Admins can manage payments"
on public.payments for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Clients can read own tickets" on public.support_tickets;
create policy "Clients can read own tickets"
on public.support_tickets for select
using (client_id = auth.uid());

drop policy if exists "Admins can manage tickets" on public.support_tickets;
create policy "Admins can manage tickets"
on public.support_tickets for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Employees can read own attendance" on public.employee_attendance;
create policy "Employees can read own attendance"
on public.employee_attendance for select
using (employee_id = auth.uid());

drop policy if exists "Employees can insert own attendance" on public.employee_attendance;
create policy "Employees can insert own attendance"
on public.employee_attendance for insert
with check (employee_id = auth.uid());

drop policy if exists "Employees can update own attendance" on public.employee_attendance;
create policy "Employees can update own attendance"
on public.employee_attendance for update
using (employee_id = auth.uid())
with check (employee_id = auth.uid());

drop policy if exists "Admins can manage attendance" on public.employee_attendance;
create policy "Admins can manage attendance"
on public.employee_attendance for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Employees can read own leave requests" on public.leave_requests;
create policy "Employees can read own leave requests"
on public.leave_requests for select
using (employee_id = auth.uid());

drop policy if exists "Admins can manage leave requests" on public.leave_requests;
create policy "Admins can manage leave requests"
on public.leave_requests for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Employees can read assigned tasks" on public.tasks;
create policy "Employees can read assigned tasks"
on public.tasks for select
using (assignee_id = auth.uid());

drop policy if exists "Admins can manage tasks" on public.tasks;
create policy "Admins can manage tasks"
on public.tasks for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Employees can read own xp events" on public.employee_xp_events;
create policy "Employees can read own xp events"
on public.employee_xp_events for select
using (employee_id = auth.uid());

drop policy if exists "Admins can manage xp events" on public.employee_xp_events;
create policy "Admins can manage xp events"
on public.employee_xp_events for all
using (public.is_admin())
with check (public.is_admin());

create index if not exists contact_requests_status_idx on public.contact_requests(status);
create index if not exists portal_access_requests_status_idx on public.portal_access_requests(status);
create index if not exists portal_access_requests_email_idx on public.portal_access_requests(email);
create index if not exists portal_credential_events_email_idx on public.portal_credential_events(email);
create index if not exists portal_credential_events_created_by_idx on public.portal_credential_events(created_by);
create index if not exists projects_client_id_idx on public.projects(client_id);
create index if not exists project_members_employee_id_idx on public.project_members(employee_id);
create index if not exists client_credit_ledger_client_id_idx on public.client_credit_ledger(client_id);
create index if not exists project_reviews_employee_id_idx on public.project_reviews(employee_id);
create index if not exists employee_xp_events_employee_id_idx on public.employee_xp_events(employee_id);
create index if not exists support_tickets_client_id_idx on public.support_tickets(client_id);
create index if not exists employee_attendance_employee_date_idx on public.employee_attendance(employee_id, work_date);
create index if not exists tasks_assignee_id_idx on public.tasks(assignee_id);
