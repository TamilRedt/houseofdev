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
  job_title text,
  department text,
  exp_points integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_user_role()
returns user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select public.current_user_role() in ('admin', 'super_admin')
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
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
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

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
  credit_cost numeric(12,2) not null default 0,
  progress_percent integer not null default 0 check (progress_percent >= 0 and progress_percent <= 100),
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

create table client_accounts (
  profile_id uuid primary key references profiles(id) on delete cascade,
  credit_balance numeric(12,2) not null default 0,
  credit_limit numeric(12,2) not null default 0,
  billing_email text,
  account_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table client_credit_ledger (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  credit_change numeric(12,2) not null,
  description text not null,
  reference_type text,
  reference_id uuid,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  employee_id uuid not null references profiles(id) on delete cascade,
  role_title text not null default 'Team Member',
  assignment_status text not null default 'assigned',
  assigned_at timestamptz not null default now(),
  due_date date,
  completed_at timestamptz,
  unique(project_id, employee_id)
);

create table project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  reviewer_id uuid references profiles(id) on delete set null,
  employee_id uuid references profiles(id) on delete set null,
  rating integer check (rating is null or (rating >= 1 and rating <= 5)),
  review text not null,
  review_type text not null default 'client',
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

create table consultation_requests (
  id uuid primary key default gen_random_uuid(),
  contact_request_id uuid references contact_requests(id) on delete set null,
  full_name text not null,
  company_name text,
  email text not null,
  phone text not null,
  industry text,
  budget text,
  service_required text not null,
  message text not null,
  preferred_date date,
  preferred_time text,
  source text not null default 'website-consultation',
  status request_status not null default 'new',
  appointment_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table portal_access_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  account_type text not null,
  message text,
  source text not null default 'portal-access',
  status request_status not null default 'new',
  reviewed_by uuid references profiles(id) on delete set null,
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table portal_credential_events (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references profiles(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
  email text not null,
  role user_role not null,
  action text not null default 'created',
  source_request_id uuid references portal_access_requests(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create table portal_activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  email text,
  event_type text not null,
  status text not null default 'success',
  ip_address text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table account_change_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete set null,
  email text not null,
  phone text,
  request_type text not null,
  current_package text,
  requested_package text,
  message text not null,
  status request_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table notification_events (
  id uuid primary key default gen_random_uuid(),
  related_table text not null,
  related_id uuid,
  event_type text not null,
  channel text not null,
  target text,
  status text not null default 'pending',
  response text,
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
  status text not null default 'present',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
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
  priority text not null default 'normal',
  exp_points integer not null default 0,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table employee_xp_events (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references profiles(id) on delete cascade,
  points integer not null,
  reason text not null,
  project_id uuid references projects(id) on delete set null,
  task_id uuid references tasks(id) on delete set null,
  created_by uuid references profiles(id) on delete set null,
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
alter table consultation_requests enable row level security;
alter table portal_access_requests enable row level security;
alter table portal_credential_events enable row level security;
alter table portal_activity_logs enable row level security;
alter table account_change_requests enable row level security;
alter table notification_events enable row level security;
alter table career_applications enable row level security;
alter table projects enable row level security;
alter table project_updates enable row level security;
alter table client_accounts enable row level security;
alter table client_credit_ledger enable row level security;
alter table project_members enable row level security;
alter table project_reviews enable row level security;
alter table blog_posts enable row level security;
alter table blog_comments enable row level security;
alter table invoices enable row level security;
alter table payments enable row level security;
alter table support_tickets enable row level security;
alter table employee_attendance enable row level security;
alter table leave_requests enable row level security;
alter table tasks enable row level security;
alter table employee_xp_events enable row level security;
alter table audit_logs enable row level security;

-- Public inserts used by server actions with service role.
-- Keep direct anon access disabled unless you add explicit policies.

create policy "Users can read own profile"
on profiles for select
using (auth.uid() = id);

create policy "Admins can read profiles"
on profiles for select
using (public.is_admin());

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Admins can update profiles"
on profiles for update
using (public.is_admin())
with check (public.is_admin());

create policy "Published blog posts are public"
on blog_posts for select
using (is_published = true);

create policy "Admins can manage blog posts"
on blog_posts for all
using (public.is_admin())
with check (public.is_admin());

create policy "Approved comments are public"
on blog_comments for select
using (is_approved = true);

create policy "Admins can manage blog comments"
on blog_comments for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own projects"
on projects for select
using (client_id = auth.uid());

create policy "Employees can read assigned projects"
on projects for select
using (
  exists (
    select 1 from project_members
    where project_members.project_id = projects.id
      and project_members.employee_id = auth.uid()
  )
);

create policy "Admins can manage projects"
on projects for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own project updates"
on project_updates for select
using (
  exists (
    select 1 from projects
    where projects.id = project_updates.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "Admins can manage project updates"
on project_updates for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own account"
on client_accounts for select
using (profile_id = auth.uid());

create policy "Admins can manage client accounts"
on client_accounts for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own credit ledger"
on client_credit_ledger for select
using (client_id = auth.uid());

create policy "Admins can manage client credit ledger"
on client_credit_ledger for all
using (public.is_admin())
with check (public.is_admin());

create policy "Employees can read own project memberships"
on project_members for select
using (employee_id = auth.uid());

create policy "Clients can read project memberships for own projects"
on project_members for select
using (
  exists (
    select 1 from projects
    where projects.id = project_members.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "Admins can manage project memberships"
on project_members for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read reviews for own projects"
on project_reviews for select
using (
  exists (
    select 1 from projects
    where projects.id = project_reviews.project_id
      and projects.client_id = auth.uid()
  )
);

create policy "Employees can read own project reviews"
on project_reviews for select
using (employee_id = auth.uid());

create policy "Admins can manage project reviews"
on project_reviews for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own invoices"
on invoices for select
using (client_id = auth.uid());

create policy "Admins can manage invoices"
on invoices for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own payments"
on payments for select
using (
  exists (
    select 1 from invoices
    where invoices.id = payments.invoice_id
      and invoices.client_id = auth.uid()
  )
);

create policy "Admins can manage payments"
on payments for all
using (public.is_admin())
with check (public.is_admin());

create policy "Clients can read own tickets"
on support_tickets for select
using (client_id = auth.uid());

create policy "Admins can manage tickets"
on support_tickets for all
using (public.is_admin())
with check (public.is_admin());

create policy "Employees can read own attendance"
on employee_attendance for select
using (employee_id = auth.uid());

create policy "Employees can insert own attendance"
on employee_attendance for insert
with check (employee_id = auth.uid());

create policy "Employees can update own attendance"
on employee_attendance for update
using (employee_id = auth.uid())
with check (employee_id = auth.uid());

create policy "Admins can manage attendance"
on employee_attendance for all
using (public.is_admin())
with check (public.is_admin());

create policy "Employees can read own leave requests"
on leave_requests for select
using (employee_id = auth.uid());

create policy "Admins can manage leave requests"
on leave_requests for all
using (public.is_admin())
with check (public.is_admin());

create policy "Employees can read assigned tasks"
on tasks for select
using (assignee_id = auth.uid());

create policy "Admins can manage tasks"
on tasks for all
using (public.is_admin())
with check (public.is_admin());

create policy "Employees can read own xp events"
on employee_xp_events for select
using (employee_id = auth.uid());

create policy "Admins can manage xp events"
on employee_xp_events for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage contact requests"
on contact_requests for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage consultation requests"
on consultation_requests for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can manage portal access requests"
on portal_access_requests for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read portal credential events"
on portal_credential_events for select
using (public.is_admin());

create policy "Admins can insert portal credential events"
on portal_credential_events for insert
with check (public.is_admin());

create policy "Admins can read portal activity logs"
on portal_activity_logs for select
using (public.is_admin());

create policy "Users can read own activity logs"
on portal_activity_logs for select
using (actor_id = auth.uid());

create policy "Users can create own account change requests"
on account_change_requests for insert
with check (requester_id = auth.uid());

create policy "Users can read own account change requests"
on account_change_requests for select
using (requester_id = auth.uid());

create policy "Admins can manage account change requests"
on account_change_requests for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read notification events"
on notification_events for select
using (public.is_admin());

create policy "Admins can manage career applications"
on career_applications for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can read audit logs"
on audit_logs for select
using (public.is_admin());

create index contact_requests_status_idx on contact_requests(status);
create index consultation_requests_status_idx on consultation_requests(status);
create index consultation_requests_email_idx on consultation_requests(email);
create index portal_access_requests_status_idx on portal_access_requests(status);
create index portal_access_requests_email_idx on portal_access_requests(email);
create index portal_credential_events_email_idx on portal_credential_events(email);
create index portal_credential_events_created_by_idx on portal_credential_events(created_by);
create index portal_activity_logs_actor_idx on portal_activity_logs(actor_id);
create index portal_activity_logs_event_type_idx on portal_activity_logs(event_type);
create index account_change_requests_requester_idx on account_change_requests(requester_id);
create index account_change_requests_status_idx on account_change_requests(status);
create index notification_events_related_idx on notification_events(related_table, related_id);
create index career_applications_status_idx on career_applications(status);
create index projects_client_id_idx on projects(client_id);
create index project_members_employee_id_idx on project_members(employee_id);
create index client_credit_ledger_client_id_idx on client_credit_ledger(client_id);
create index project_reviews_employee_id_idx on project_reviews(employee_id);
create index employee_xp_events_employee_id_idx on employee_xp_events(employee_id);
create index support_tickets_client_id_idx on support_tickets(client_id);
create index employee_attendance_employee_date_idx on employee_attendance(employee_id, work_date);
create index tasks_assignee_id_idx on tasks(assignee_id);
create index blog_posts_slug_idx on blog_posts(slug);

