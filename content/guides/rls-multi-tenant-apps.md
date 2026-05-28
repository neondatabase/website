---
title: Adopt Postgres RLS for Multi-Tenant Apps Without Slowing Your Team Down
subtitle: How to use row-level security for multi-tenant apps, understand its challenges and benefits, and see how branching and authentication with Neon let you safely iterate on RLS policies.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-05-02T00:00:00.000Z'
updatedOn: '2026-05-02T00:00:00.000Z'
---

If you are building a multi-tenant app on Postgres, [row level security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) sounds like a clean promise, i.e. define access rules once in the database, and every query becomes safe by default. It is a compelling idea, especially when you have many tables, many endpoints, and many ways the same data can be accessed. But RLS is not "turn it on and forget it". It changes how your application authenticates, how your queries are shaped, how you debug production issues, and how confident you can be that a new feature did not pass through your data boundary.

So the real question is not "is RLS secure?" but the question is whether it is the right tool for your system, given your team’s workflow, the kinds of queries you run, and how you ship iterations of your application. Neon does not change what RLS is, but it makes it easier to test policy changes against real application behavior before they reach production.

## What You Get with RLS

RLS gives you a database-level safety net that’s hard to maintain in app code as projects grow. Authorization logic tends to scatter and consistency gets harder over time. RLS pushes that consistency down into Postgres. If your policies are correct and your [roles](/docs/manage/roles) are configured correctly, the database becomes the place where "who can see which rows" is enforced.

That helps in two important ways:

- It reduces the surface area of mistakes that can happen in your application code, because even if your app misses a filter, the database still enforces authorization and prevents misuse.
- It promotes a data model with clear tenant boundaries i.e. using fields like `account_id` or `org_id` that saves you from threading tenant filters through every query and remembering them in every join. You can then focus on the query shape and let the database remove rows the caller should not see. That does not remove the need for application-level authorization entirely, but it can remove a lot of repetitive logic that is both boring and easy to get wrong.

For example, here’s how a Postgres query for fetching user projects might look before RLS is enforced:

```sql
-- Before RLS: tenancy enforced in every query
SELECT * FROM projects WHERE account_id = $CURRENT_TENANT_ID;
```

Now, to enable RLS, you will define a policy at the database level to enforce tenant isolation, for example:

```sql
-- Enable RLS on the projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Define a policy so only rows belonging to the current tenant are visible
CREATE POLICY tenant_isolation_policy
  ON projects
  USING (account_id = current_setting('app.current_tenant')::uuid);
```

With RLS, the application no longer needs to manually filter by `account_id` in each query. Instead, it can simply write:

```sql
SELECT * FROM projects;
```

and trust that Postgres will only return the rows the current tenant is allowed to access.

## Where RLS is a great fit

RLS tends to work best in systems where access rules are fundamentally row-shaped and stable. [Multi-tenant SaaS](/docs/guides/multitenancy) is the obvious case where each request has a user identity, that user is in an account, and the account owns rows across many tables. In those systems, a large share of your access rules can be expressed as "only rows where `account_id` matches the current tenant". Even when the rules are more particular, they are still often expressible in SQL in a way that remains understandable months later.

RLS is also a strong fit when you have multiple query surfaces that touch the same tables. If you have a REST API, server actions, background jobs, and internal tooling all using the same database, enforcing row access in one place becomes more valuable. It is not that the app layer is untrustworthy, it is that the number of places where logic can spread is large. The more ways your app accesses data, the more useful it is to have a single place to enforce access rules.

## When RLS might not be a good fit

RLS can become more trouble than it's worth if your access rules are not a simple "row matches tenant" pattern. For example, imagine you need to restrict access based on whether a user's subscription is active, with grace periods, or tie row access to dynamic application state or checks from other services. Before RLS, you might handle this logic in application code where you can coordinate data from multiple sources and write clear logic:

```js
// Before RLS: in app code
if (user.subscriptionActive && withinGracePeriod(row.created_at)) {
  // Allow access to this row
}
```

If you try to move this fully into RLS, you might end up packing complicated checks into database policy SQL, possibly calling functions or referencing volatile state:

```sql
-- Complex RLS policy example
CREATE POLICY complicated_policy ON user_data
  USING (
    user_subscription_active(current_setting('app.user_id')) AND
    within_grace_period(created_at)
  );
```

This makes your policies hard to read and debug with the maintenance burden as requirements or the rules that touch data (outside Postgres) change.

Performance might be another practical reason to avoid RLS, especially for complex logic. Consider a scenario where checking access via a direct, indexed query is much faster than encoding the same logic inside an RLS policy, which would require a per-row subquery.

**Before (application handles access check):**

```sql
SELECT * FROM project_members
WHERE project_id = $1 AND user_id = $2;
-- This uses indexed columns and stays fast
```

**After (access logic moved into an RLS policy):**

```sql
CREATE POLICY member_check ON project_members
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.project_id = project_members.project_id
      AND memberships.user_id = current_setting('app.user_id')::uuid
      AND memberships.active = true
    )
  );
```

Now, every read on `project_members` does a subquery join and function call per row. For large tables, performance can degrade because the planner must evaluate the subquery for each row and this can be much slower than a simple, indexed lookup.

RLS also means extra steps whenever you make changes to your database. When you add a new table, you’re not done until you’ve set up RLS policies and checked that the right roles and permissions are in place. Here’s a quick before and after to show what that looks like:

**Before RLS:**  

```sql
CREATE TABLE invoices (
  id serial PRIMARY KEY,
  tenant_id uuid,
  amount numeric
);
-- Application is responsible for all access checks
```

**After RLS:**  

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO app_user;
```

Now, every schema addition requires not just the table, but also:  

- Defining and validating policies  
- Setting correct roles and grants  
- Testing read/write flows in your app

Because policy changes are difficult to test safely in production, these decisions must be handled in staging environments (that are production-like) to avoid deploying insecure or misconfigured RLS setups.

## The sharp edges you need to be careful about

A common RLS mistake is letting your app use the privileged “owner” role for queries, rather than a restricted role. It’s fine to have an admin role for migrations, but **your connection string for app requests should always use the least-privileged role**.

If the app uses the wrong role, RLS can be silently bypassed:

```sql
-- Good: app connects as 'app_user' (restricted)
GRANT SELECT ON my_table TO app_user;

-- Bad: app accidentally uses 'db_owner' (no RLS enforced)
```

Keep “owner” for migrations only and let the production queries run with the restricted role by default.

Also, be cautious with RLS setups that rely on session variables or other values like [JWT claims](/docs/extensions/pg_session_jwt) or `SET LOCAL` because if they're missing, your policies might not work as expected. For example, if background jobs or queue workers connect without setting the right context, queries may run as admin or break entirely.

```sql
-- Intended request with tenant context
SET LOCAL app.tenant_id = 'abc';
SELECT * FROM invoices;  -- Policy enforced

-- Background job missing context
SELECT * FROM invoices;  -- Policy not enforced or fails, risk of admin access or errors
```

You need to always make sure every connection (including jobs and tasks) sets the needed context or uses the correct restricted role, otherwise RLS can't protect your data.

Finally, RLS can make local testing look better than it really is. If you only test with a small, fake dataset and typical user actions, you might miss problems such as policies that block certain users or break some queries. The only reliable way to use RLS is to test your policies with real-world query patterns and user roles in an environment that’s as close to production as possible.

## How Neon changes the practical trade-offs

Neon cannot write correct policies for you. What it can do is give you a **production-like loop** i.e. branch Postgres in seconds, clone both app data and auth state, point a preview app at that branch, then run real logins and queries under the same roles and session shape you use in production.

[Neon Branching](/docs/introduction/branching) lets you create an isolated copy of your current Postgres database quickly, including all schema, data, and system tables, without affecting production. Each [branch](/docs/manage/branches) is a fully functional database endpoint that you can connect to independently, making it practical to test schema changes, migrations, or RLS policy updates in a safe, production-like environment.

[Neon Auth](/docs/auth/overview) is a managed auth layer built on Better Auth. Users, sessions, and related config live in your Neon Postgres (including the `neon_auth` schema). When you create a database branch, that identity data is copied along with your application tables, so policies that join to users, org membership, or tenant rows behave like production instead of hand-written mocks.

Here’s how you can use branching and auth to safely test RLS before pushing changes to production:

### Step 1: Create a branch from production

Use the [Neon CLI](/docs/reference/neon-cli) so you get an isolated copy of schema and data at a point in time. Name it so you know it is for RLS testing.

```bash filename="Terminal"
neon branches create --name preview-rls
```

From the [Neon Console](https://neon.com), open the new branch and copy its **connection string** for the role your app uses in production (for example a restricted `app_user`, not the owner role used only for migrations).

### Step 2: Point your app preview environment at the branch

Each Neon branch has its own Postgres endpoint. If you use Neon Auth, each branch also gets [its own Auth Base URL](/docs/auth/branching-authentication). Preview and CI environments must use that branch’s URL (not the production branch’s URL), because sessions and tokens are scoped to the [Auth endpoint](/docs/auth/guides/manage-auth-api) for that branch.

Here's an example of environment variables for a preview deployment (or local run) against the branch:

```env filename=".env.preview"
DATABASE_URL="postgresql://app_user:YOUR_PASSWORD@ep-preview-abc123.us-east-2.aws.neon.tech/neondb?sslmode=require"
NEON_AUTH_BASE_URL="https://ep-preview-abc123.neonauth.us-east-2.aws.neon.tech/neondb/auth"
NEON_AUTH_COOKIE_SECRET="your-secret-at-least-32-characters-long"
```

The server-side setup with the [Neon Auth SDK](/docs/reference/javascript-sdk) would follow the same pattern as a production app and only the URLs would change:

```ts title="lib/auth/server.ts"
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET,
  },
});
```

Now, sign in on the preview hostname or localhost configuration that targets this branch. Cookies issued there belong to this (i.e. new branch) Auth endpoint only, which mirrors how you isolate real previews from production.

### Step 3: Apply RLS changes on the branch (like production)

Run your migrations or SQL against the branch's connection string so you never experiment on live data. Then validate policies with the same restricted role and session variables your app sets per request.

Manual sanity check in `psql` or the SQL editor (adjust names to match your policy):

```sql
SET ROLE app_user;
SET LOCAL app.tenant_id = '00000000-0000-0000-0000-000000000001';
SELECT * FROM projects;
RESET ROLE;
```

In your application code, **the important part is unchanged** i.e. resolve the user with Neon Auth, set tenant or user context for RLS (for example via `set_config` or your pool’s `SET` hook), and run the queries your routes and jobs actually use. Because the branch contains cloned users and membership rows, joins inside policies and "wrong role" mistakes **show up here before production**.

### Step 4: Run end-to-end tests and delete the branch when done

Making changes to RLS can sometimes cause bugs or break things you didn’t expect. Using a dedicated branch makes it easy to run full end-to-end tests (like with [Playwright](https://playwright.dev/)) or do manual QA on real user scenarios (logins, API calls, background jobs) without putting production data at risk. Just point your preview environment at the new branch with the right environment variables. Once you’re happy with your changes, clean up by [deleting the branch](/docs/manage/branches#delete-a-branch) to save costs and keep things organized. You can do this either in the Neon Console or right from your terminal using the Neon CLI:

```bash filename="Terminal"
neon branches delete preview-rls
```

## A practical way to decide

When considering RLS, look at your access patterns and team workflow. If most authorization maps cleanly to row-level rules, tenant boundaries are clear, and policies can be treated as part of your product, RLS is a good fit. But if your rules depend heavily on application state, or debugging Postgres policies is a blocker, enforcing access in the app might be simpler and more maintainable.

Neon makes RLS safer to adopt by letting you test changes on isolated branches with realistic data and workflows before going to production. This doesn’t remove the need for security best practices, but it makes the RLS development loop less risky, easier to validate, and speeds up development.
