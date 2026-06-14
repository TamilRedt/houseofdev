-- Idempotent portal authentication setup.
-- For the full portal backend (access requests, client credits, employee
-- attendance, project assignments, reviews, and EXP), prefer:
-- database/portal-system-migration.sql
-- Run this in Supabase SQL Editor when the database already exists and you only
-- need Auth profiles, role checks, and portal read policies refreshed.

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
alter table public.profiles add column if not exists id uuid references auth.users(id) on delete cascade;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists role public.user_role not null default 'individual_client';
alter table public.profiles add column if not exists company_name text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'p'
  ) then
    alter table public.profiles add primary key (id);
  end if;
end
$$;

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
    case
      when new.raw_app_meta_data->>'portal_role' in ('super_admin', 'admin', 'employee', 'business_client', 'individual_client')
        then (new.raw_app_meta_data->>'portal_role')::public.user_role
      else 'individual_client'::public.user_role
    end,
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

revoke execute on function public.current_user_role() from anon, authenticated;
revoke execute on function public.is_admin() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.current_user_role() from public;
revoke execute on function public.is_admin() from public;
revoke execute on function public.handle_new_user() from public;

alter table public.profiles enable row level security;

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

do $$
begin
  if to_regclass('public.projects') is not null then
    execute 'alter table public.projects enable row level security';
    execute 'drop policy if exists "Clients can read own projects" on public.projects';
    execute 'create policy "Clients can read own projects" on public.projects for select using (client_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage projects" on public.projects';
    execute 'create policy "Admins can manage projects" on public.projects for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.project_updates') is not null and to_regclass('public.projects') is not null then
    execute 'alter table public.project_updates enable row level security';
    execute 'drop policy if exists "Clients can read own project updates" on public.project_updates';
    execute 'create policy "Clients can read own project updates" on public.project_updates for select using (exists (select 1 from public.projects where projects.id = project_updates.project_id and projects.client_id = auth.uid()))';
    execute 'drop policy if exists "Admins can manage project updates" on public.project_updates';
    execute 'create policy "Admins can manage project updates" on public.project_updates for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.invoices') is not null then
    execute 'alter table public.invoices enable row level security';
    execute 'drop policy if exists "Clients can read own invoices" on public.invoices';
    execute 'create policy "Clients can read own invoices" on public.invoices for select using (client_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage invoices" on public.invoices';
    execute 'create policy "Admins can manage invoices" on public.invoices for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.invoices') is not null then
    execute 'alter table public.payments enable row level security';
    execute 'drop policy if exists "Clients can read own payments" on public.payments';
    execute 'create policy "Clients can read own payments" on public.payments for select using (exists (select 1 from public.invoices where invoices.id = payments.invoice_id and invoices.client_id = auth.uid()))';
    execute 'drop policy if exists "Admins can manage payments" on public.payments';
    execute 'create policy "Admins can manage payments" on public.payments for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.support_tickets') is not null then
    execute 'alter table public.support_tickets enable row level security';
    execute 'drop policy if exists "Clients can read own tickets" on public.support_tickets';
    execute 'create policy "Clients can read own tickets" on public.support_tickets for select using (client_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage tickets" on public.support_tickets';
    execute 'create policy "Admins can manage tickets" on public.support_tickets for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.employee_attendance') is not null then
    execute 'alter table public.employee_attendance enable row level security';
    execute 'drop policy if exists "Employees can read own attendance" on public.employee_attendance';
    execute 'create policy "Employees can read own attendance" on public.employee_attendance for select using (employee_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage attendance" on public.employee_attendance';
    execute 'create policy "Admins can manage attendance" on public.employee_attendance for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.leave_requests') is not null then
    execute 'alter table public.leave_requests enable row level security';
    execute 'drop policy if exists "Employees can read own leave requests" on public.leave_requests';
    execute 'create policy "Employees can read own leave requests" on public.leave_requests for select using (employee_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage leave requests" on public.leave_requests';
    execute 'create policy "Admins can manage leave requests" on public.leave_requests for all using (public.is_admin()) with check (public.is_admin())';
  end if;

  if to_regclass('public.tasks') is not null then
    execute 'alter table public.tasks enable row level security';
    execute 'drop policy if exists "Employees can read assigned tasks" on public.tasks';
    execute 'create policy "Employees can read assigned tasks" on public.tasks for select using (assignee_id = auth.uid())';
    execute 'drop policy if exists "Admins can manage tasks" on public.tasks';
    execute 'create policy "Admins can manage tasks" on public.tasks for all using (public.is_admin()) with check (public.is_admin())';
  end if;
end
$$;
