-- HouseOfDev production test seed template.
-- Run only after creating real Supabase Auth users with scripts/create-portal-user.mjs.
-- Replace the placeholder emails with the exact emails used for test accounts.
-- This file does not create Auth users.

begin;

with
  admin_user as (
    select id from public.profiles where email = 'admin-test@houseofdev.local' limit 1
  ),
  employee_user as (
    select id from public.profiles where email = 'employee-test@houseofdev.local' limit 1
  ),
  business_client_user as (
    select id from public.profiles where email = 'business-client-test@houseofdev.local' limit 1
  ),
  individual_client_user as (
    select id from public.profiles where email = 'individual-client-test@houseofdev.local' limit 1
  ),
  upsert_client_account as (
    insert into public.client_accounts (profile_id, credit_balance, credit_limit, billing_email, account_status)
    select id, 25000, 50000, 'billing-test@houseofdev.local', 'active'
    from business_client_user
    on conflict (profile_id) do update
    set credit_balance = excluded.credit_balance,
        credit_limit = excluded.credit_limit,
        billing_email = excluded.billing_email,
        account_status = excluded.account_status,
        updated_at = now()
    returning profile_id
  ),
  project_one as (
    insert into public.projects (client_id, title, description, status, budget, credit_cost, progress_percent, start_date, due_date)
    select id, 'Production Test Website', 'End-to-end test project for the client portal.', 'in_progress', 24999, 10000, 55, current_date, current_date + 14
    from business_client_user
    returning id, client_id
  ),
  project_two as (
    insert into public.projects (client_id, title, description, status, budget, credit_cost, progress_percent, start_date, due_date)
    select id, 'Production Test SEO Setup', 'Secondary project for invoice and support testing.', 'reviewing', 9999, 5000, 20, current_date, current_date + 21
    from individual_client_user
    returning id, client_id
  ),
  member_assignment as (
    insert into public.project_members (project_id, employee_id, role_title, assignment_status, due_date)
    select project_one.id, employee_user.id, 'Full-stack Developer', 'assigned', current_date + 7
    from project_one cross join employee_user
    on conflict (project_id, employee_id) do update
    set role_title = excluded.role_title,
        assignment_status = excluded.assignment_status,
        due_date = excluded.due_date
    returning id, project_id, employee_id
  ),
  task_one as (
    insert into public.tasks (project_id, assignee_id, title, description, status, priority, exp_points, due_date)
    select project_one.id, employee_user.id, 'Audit portal access flow', 'Confirm client, employee, and admin role separation.', 'todo', 'high', 50, current_date + 3
    from project_one cross join employee_user
    returning id
  ),
  task_two as (
    insert into public.tasks (project_id, assignee_id, title, description, status, priority, exp_points, due_date)
    select project_one.id, employee_user.id, 'Update project progress', 'Verify client portal progress card and roadmap table.', 'in_progress', 'normal', 40, current_date + 5
    from project_one cross join employee_user
    returning id
  ),
  task_three as (
    insert into public.tasks (project_id, assignee_id, title, description, status, priority, exp_points, due_date)
    select project_two.id, employee_user.id, 'Prepare SEO checklist', 'Create starter checklist for local business SEO.', 'todo', 'normal', 30, current_date + 8
    from project_two cross join employee_user
    returning id
  ),
  invoice_one as (
    insert into public.invoices (client_id, project_id, invoice_number, amount, currency, status, due_date)
    select project_one.client_id, project_one.id, 'HOD-TEST-001', 24999, 'INR', 'pending', current_date + 10
    from project_one
    on conflict (invoice_number) do update
    set amount = excluded.amount,
        currency = excluded.currency,
        status = excluded.status,
        due_date = excluded.due_date
    returning id
  ),
  payment_one as (
    insert into public.payments (invoice_id, amount, provider, provider_reference, status)
    select invoice_one.id, 5000, 'manual', 'TEST-ADVANCE-001', 'paid'
    from invoice_one
    returning id
  ),
  support_ticket_one as (
    insert into public.support_tickets (client_id, project_id, subject, body, priority, status)
    select project_one.client_id, project_one.id, 'Production test support ticket', 'This ticket verifies client support visibility.', 'normal', 'new'
    from project_one
    returning id
  ),
  attendance_one as (
    insert into public.employee_attendance (employee_id, work_date, check_in, mode, status, notes)
    select employee_user.id, current_date, now(), 'remote', 'present', 'Production readiness test check-in'
    from employee_user
    on conflict (employee_id, work_date) do update
    set check_in = excluded.check_in,
        mode = excluded.mode,
        status = excluded.status,
        notes = excluded.notes,
        updated_at = now()
    returning id
  )
insert into public.client_credit_ledger (client_id, credit_change, description, reference_type, created_by)
select business_client_user.id, 25000, 'Production test credit balance', 'seed', admin_user.id
from business_client_user cross join admin_user;

commit;

-- Verification queries:
-- select email, role from public.profiles order by created_at desc;
-- select title, status, progress_percent from public.projects order by created_at desc;
-- select title, status, priority from public.tasks order by created_at desc;
-- select invoice_number, amount, status from public.invoices order by created_at desc;
