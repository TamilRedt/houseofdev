# Portal Users and Credentials

The portal does not keep user passwords in the website code. Credentials live in Supabase Auth, and portal permissions live in the `public.profiles` table.

Signed-out visitors do not see client, employee, or admin dashboard data. Every portal route shows the same access screen with sign-in, password reset, and request-access options.

## What The Sign-In Message Means

`Auth session missing` means the browser does not have a Supabase login session cookie yet. It is the normal signed-out state. The app suppresses that technical message and asks the visitor to sign in.

After a valid Supabase Auth user signs in, the app reads that user's `public.profiles.role` and opens the matching portal automatically.

## Role Access

- `individual_client` and `business_client`: `/portal`
- `employee`: `/employee-portal`
- `admin` and `super_admin`: `/admin-dashboard`, `/employee-portal`, and `/portal`

## Request Before Credentials

Do not create portal credentials for every visitor. If a visitor does not have an account, they should use the portal access request form or the contact page. That creates a normal `contact_requests` lead with `source = portal-access`.

Recommended flow:

1. Visitor requests access with name, phone, email, account type, and message.
2. Team confirms the person by call or message.
3. Team creates credentials in Supabase Auth.
4. Team assigns the correct `public.profiles.role`.
5. User signs in and is routed to the right portal.

## Create Credentials From This Repo

1. Add Supabase credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. If the database already exists, run `database/portal-auth-migration.sql` once in the Supabase SQL Editor. For a new database, run the full `database/schema.sql`.

3. Create the user:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --password "StrongPass123!" --role admin --name "HouseOfDev Admin"
```

Create an employee:

```bash
npm run create:portal-user -- --email employee@houseofdev.com --password "StrongPass123!" --role employee --name "Team Member" --company "HouseOfDev"
```

Create a client:

```bash
npm run create:portal-user -- --email client@example.com --password "StrongPass123!" --role business_client --name "Demo Client" --company "Demo Business"
```

You can generate a temporary password instead:

```bash
npm run create:portal-user -- --email admin@houseofdev.com --generate-password --role admin --name "HouseOfDev Admin"
```

The command creates or updates the Supabase Auth login and upserts the matching `public.profiles` row. Store the password securely; Supabase stores only the hashed password.

## Password Reset

The access screen includes a password reset form. Supabase sends the reset email, the link returns to `/auth/callback`, and the user sets a new password at `/update-password`.

## Create Credentials Manually In Supabase

1. Open Supabase Dashboard.
2. Go to Authentication > Users.
3. Click Add user.
4. Enter email and password, then confirm the user.
5. Go to Table Editor > `profiles`.
6. Find the row with the same user id and set `role` to the required value.

If the profile row is missing, run `database/portal-auth-migration.sql`, then create the user again or insert a row with the Auth user id.
