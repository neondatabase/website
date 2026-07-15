---
title: I Would Not Test RLS on Localhost Alone
subtitle: Validate row level security policies on production-like branches with restricted roles and preview auth.
author: rishi-raj-jain
enableTableOfContents: true
createdAt: '2026-07-02T00:00:00.000Z'
updatedOn: '2026-07-15T00:08:00.682Z'
---

Row level security (RLS) is a Postgres feature that attaches per-row access rules to a table, so a SELECT, INSERT, UPDATE, or DELETE only accesses the rows the current role is permitted to. You define this with a policy, and as that policy changes over time, it gets hard to prove on every change that it still runs for every caller you have in production, and that is not just your web app. It is also cron jobs, serverless functions, background workers, and internal services, each connecting with its own role and level of access.

A local Postgres instance is a fine place to draft a policy and check its syntax, but it runs as one app on one connection with mock data. Production is the opposite where many callers connect at once with different access levels, the connection pool reuses connections across requests, and the auth layer sets the identity on each request.

In this guide, you will learn how the owner role bypasses RLS, a production-shaped [Neon branch](/docs/introduction/branching) running the same restricted role as production helps you catch RLS issues, and that you can integrate a check into CI so a PR is well tested before its merged.

## What localhost can not prove

![In production, callers like the web app, cron jobs, serverless functions, and internal services each connect with their own role and pass through one RLS policy into Postgres, while localhost is a single connection as the owner that skips the policy](/docs/guides/rls-callers-vs-localhost.svg 'no-border')

There are a few things localhost cannot help you prove on its own:

1. That RLS is even running, since the owner role skips it.
2. That your policy holds at production volume and on messy real rows. You cannot recreate that data on a laptop, and pointing your local app at the production database to check is not safe.
3. That the other services reading the table still work. Your background jobs and internal services point at the production database, and you cannot repoint them at your laptop to test a change.
4. That auth middleware and the connection pool set tenant context on every request.
5. That the risky cases return nothing (instead of the wrong rows): denied users, workers with no tenant, and org switching.

So here's a checklist to catch each of those gaps:

<CheckList title="Pre-merge RLS checklist">
  Use this before merging any pull request that touches policies, grants, or auth middleware, with each item explained in the section below it.
  <CheckItem title="1. Split roles">
    Define a migration (owner) role for schema changes, and a restricted app_user for runtime. Use these consistently across local, CI, preview, and production.
  </CheckItem>
  <CheckItem title="2. Use a non-owner DATABASE_URL">
    Make sure your application DATABASE_URL connects as the restricted app_user, never the database owner or a superuser, and fail the deploy if it does.
  </CheckItem>
  <CheckItem title="3. Enable RLS on every tenant table">
    Confirm RLS is enabled on every tenant table, including any new ones. Keep the owner role out of the runtime query path so the bypass never applies.
  </CheckItem>
  <CheckItem title="4. Use preview branches">
    On every PR touching RLS, create a Neon branch from a production-shaped parent. Clean up the branch automatically when the PR closes.
  </CheckItem>
  <CheckItem title="5. Restricted credentials for preview">
    Point the preview app at the branch with <code>app_user</code> (not <code>neondb_owner</code>) credentials.
  </CheckItem>
  <CheckItem title="6. Set tenant context in pool">
    Set tenant context with <code>SET LOCAL</code> (or <code>set_config(..., true)</code>), and always verify through the pooled endpoint, not a direct connection.
  </CheckItem>
  <CheckItem title="7. CI and integration test coverage">
    Run fast RLS policy unit tests in CI, then integration tests against the preview app using real authentication flows.
  </CheckItem>
  <CheckItem title="8. Test other entry points">
    Verify RLS through all callers: background jobs, schedulers, and internal services that read tenant tables.
  </CheckItem>
  <CheckItem title="9. Negative/edge cases">
    Test negative scenarios: denied users, requests missing tenant context, handling org switching, workers running without an assigned tenant.
  </CheckItem>
  <CheckItem title="10. Confirm query plans & indexes">
    Examine query plans on preview branch data to make sure RLS still benefits from indexes. Index the filtered column, for example <code>CREATE INDEX ON projects (org_id)</code>, and wrap <code>current_setting</code> in a scalar subquery like <code>(SELECT current_setting('app.current_org')::uuid)</code> so the planner evaluates it once per statement.
  </CheckItem>
</CheckList>

## What localhost actually proves

Say you enable RLS on a `projects` table (in a local Postgres instance) and scope it reads to the caller's org with the following policy:

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_read ON projects
  FOR SELECT
  USING (org_id = current_setting('app.current_org')::uuid);
```

Now you can test it locally: `SET app.current_org` in a psql session, insert a couple of orgs, and check that each `SELECT` returns only that org's rows.

But that only holds while your local setup looks like production, and keeping it that way is either really hard or time consuming: the same extensions, the same data shape, and seed scripts you have to maintain. Over time those seed scripts fall out of sync and pick up bugs, so a passing local test might just mean **your test data is wrong** (and not that the updated policy works).

What localhost does not prove is everything that happens once a real app is in the loop. It cannot tell you:

- whether your code sets `app.current_org` on **every pool checkout**
- whether **background jobs** use the same restricted role as web requests
- whether the preview **`DATABASE_URL`** points at `app_user` or `neondb_owner`
- whether a user in **two orgs** sees only the active one when session variables changes

It also under-represents your real data. Synthetic seeds do not have the messy shapes that live in production:

- **orphaned memberships**
- **soft-deleted users** who still hold API keys
- **legacy rows** with a null `org_id`
- **contractors** with cross-tenant access

Eventually you realize that a local run only tells you the policy is shaped right, not whether it still holds in production, and it gives you no quick way to check.

## The owner bypass, the most expensive RLS mistake

![The same count query on the same table returns every org's rows when you connect as the owner because the policy is skipped, but only the caller's org when you connect as app_user because the policy is enforced](/docs/guides/rls-owner-bypass.svg 'no-border')

The most common mistake is connecting your app as a superuser or the table owner. Postgres applies RLS to normal roles, but owners and superusers skip it by default. Local `.env` files often use the owner URL from docker-compose, so the problem easily remains unnoticed locally.

To test the difference, create two orgs, a policy on `projects`, and then connect as the owner:

```sql
-- connected as neondb_owner
SET app.current_org = '11111111-1111-1111-1111-111111111111';
SELECT count(*) FROM projects;   -- returns every org's rows, not just org A
```

Even though the policy is enabled and the GUC is set, and you would still be able to see everything, because the owner is exempt. Now connect with a restricted role:

```sql
-- connected as app_user
SET app.current_org = '11111111-1111-1111-1111-111111111111';
SELECT count(*) FROM projects;   -- returns only org A's rows
```

Even though it's the same policy over the same data, the result is different. The path that actually proves enforcement is the one your app uses in production, run as a role that cannot bypass RLS. So use the owner role for migrations and give runtime a restricted role with only the grants it needs:

```sql
-- run while connected as the owner / migration role
CREATE ROLE app_user LOGIN PASSWORD 'AbC123dEf';
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO app_user;

-- app_user has no BYPASSRLS, so policies always apply
```

Then point the application's connection string at that role, everywhere, including previews.

```text
DATABASE_URL=postgresql://app_user:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

To validate against the bypass, fail the application build when the app's connection string uses a privileged role. Here's a one-line guard that you may use:

```ts
const role = new URL(process.env.DATABASE_URL!).username;
if (['neondb_owner', 'postgres'].includes(role)) {
  throw new Error(`App must not connect as ${role}. Use app_user.`);
}
```

Overall, you would want to keep the owner role for migrations only, and make every runtime path use the restricted role, including web requests, background jobs, schedulers, and internal services. This approach helps you make sure nothing in production ever connects as the owner at all. A superuser or `BYPASSRLS` role skips policies anyway, so the safest habit, both locally and in production, is to keep those roles off the runtime path.

## Test on a production-shaped Neon branch

To test policy changes on real data locally, you would need to copy production, strip the sensitive parts, and reload it, then repeat every time the data changes. It only gets worse to maintain as the database grows, since a dump that is quick at a few gigabytes but is far too slow to run per pull request past 100GB.

A [Neon branch](/docs/introduction/branching) skips all of it. It is copy-on-write, so it is ready in a second or two whether the parent is 1GB or 1TB, and each PR gets its own anonymized copy of the production database. Each copy has the same schema, data, roles, and extensions from the parent. So your tests run against real data and the same restricted `app_user` you use in production, where it genuinely cannot bypass RLS.

Here's the step-by-step workflow for testing an RLS change with a Neon branch:

<Steps>

## Create a branch from production

Use the [Neon CLI](/docs/reference/cli-branches) to branch off your production database.

```bash
neon branches create --name pr-1234 --parent production
```

## Get a restricted connection string

Grab a [connection string](/docs/reference/cli-connection-string) for the `app_user` role, not the owner. Add `--pooled` so you test through the same pooled endpoint your app uses.

```bash
neon connection-string pr-1234 --role-name app_user --database-name dbname --pooled
```

## Run your migrations and RLS tests

Point the preview app at that URL and run the checks (in the same way as on CI).

```bash
export DATABASE_URL="$(neon connection-string pr-1234 --role-name app_user --database-name dbname --pooled)"
npm run migrate
npm test
```

## Delete the branch when the PR closes

Clean up the branch when the testing is complete.

```bash
neon branches delete pr-1234
```

## Automate it on every pull request

Wire it into CI with the [Neon GitHub Actions](/docs/guides/branching-github-actions), or let the [Neon GitHub integration](/docs/guides/neon-github-integration) create and delete the branch as the PR opens and closes.

```yaml
# .github/workflows/rls-preview.yml
- name: Create a Neon branch for this PR
  id: branch
  uses: neondatabase/create-branch-action@v5
  with:
    project_id: ${{ vars.NEON_PROJECT_ID }}
    branch_name: pr-${{ github.event.number }}
    role: app_user
    api_key: ${{ secrets.NEON_API_KEY }}

- name: Run RLS tests against the branch
  env:
    DATABASE_URL: ${{ steps.branch.outputs.db_url }}
  run: npm test
```

</Steps>

## Test through the real auth flow on previews

RLS depends on who is calling, and in production that caller may come from your auth stack. Following is a [pg_session_jwt](/docs/extensions/pg_session_jwt) policy that reads the caller from the verified session token lets you scope rules per user (and limit them with short-lived tokens):

```sql
-- the caller comes from the validated session JWT
-- auth.uid() returns the sub claim as uuid, matching a uuid user_id column
CREATE POLICY user_read ON documents
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
```

Here the app connects through the restricted `authenticated` role, and the token decides which user that is. It is the same split from earlier applied to auth: migrations use the owner role, and requests use a role that cannot bypass RLS.

Because the caller and their claims come from the token, you can separate roles inside a single workspace. Take an org of 100 employees where 2 are admins who manage it and 98 are regular members. The same policy keeps every read inside the org, lets a member touch only their own documents, and lets the 2 admins manage all of the org's documents:

```sql
-- one org, two roles: admins manage all docs, members only their own.
-- org_id and role are custom claims your auth provider adds to the token.
CREATE POLICY doc_access ON documents
  FOR ALL
  TO authenticated
  USING (
    org_id = (SELECT auth.session() ->> 'org_id')::uuid
    AND (
      user_id = (SELECT auth.uid())
      OR (SELECT auth.session() ->> 'role') = 'admin'
    )
  )
  -- FOR ALL covers writes, so repeat the rule as WITH CHECK for inserts and updates
  WITH CHECK (
    org_id = (SELECT auth.session() ->> 'org_id')::uuid
    AND (
      user_id = (SELECT auth.uid())
      OR (SELECT auth.session() ->> 'role') = 'admin'
    )
  );
```

Since `role` and `org_id` come from the verified token and the rule is defined in the policy, every route, worker, and service hits the same check. This approach also helps you de-duplicate the permission logic within each service or layer that accesses the database.

Testing policy changes like these before deploying to production, which affect user-level access, needs real users and sessions in the preview database. While locally you may be able to seed data with few entries, replicating production like cases will be hard and time consuming for the reasons we learned earlier in this guide.

[Managed Better Auth](/docs/auth/overview) keeps users and sessions in Postgres, so [branching with auth](/docs/auth/branching-authentication) copies them onto each preview branch. You sign in on the preview URL, hit real API routes, and let the stack set the session the same way production does.

<Callout title="Any Postgres-backed auth works">
Auth.js or Better Auth work too, as long as sessions live in Postgres and previews copy those tables. With them you usually read the session in app code and set a GUC rather than call `auth.uid()`, so the policy looks different, but the testing story does not change. Managed Better Auth just removes the wiring for teams already on Neon.
</Callout>

## Connection pooling and the `SET LOCAL` trap

On your laptop, the app holds one direct connection, so a session variable like `SET app.current_org` stays put and every query sees the right tenant. Production is different. Neon's pooled endpoint runs PgBouncer in transaction mode, which returns your connection to the pool after each transaction and gives the next request whatever connection is free.

With a plain `SET`, the value stays on that connection after your transaction ends. The next request that reuses it picks up your tenant, and now one user reads as another. The fix is to tie the variable to the transaction so it clears as soon as the transaction ends:

```ts
// one transaction on the pooled connection the app actually uses
await db.transaction(async (tx) => {
  // the third argument, true, makes the setting local to this transaction
  await tx.execute(sql`SELECT set_config('app.current_org', ${orgId}, true)`);
  return tx.execute(sql`SELECT * FROM projects`);
});
```

`set_config(..., true)` is just the function form of `SET LOCAL`. Both reset when the transaction ends, so a reused connection never carries one tenant's context into another request. You cannot reproduce this on one direct connection, which is why it slips through local tests. Run it on a Neon branch through the pooled host, send two tenants at once, and check that neither sees the other's rows.

## Two test layers before merge

To stop RLS from breaking a live application once you go from local testing to production, two of these checks should run on their own for every pull request:

<Steps>

## Fast policy unit tests in CI

Fast unit tests would help you catch the obvious failures, like syntax errors and basic allow or deny cases. You'd want to keep them as plain SQL checks against a throwaway database so they run on every commit:

```sql
-- fails CI if any public table is missing RLS
SELECT relname
FROM pg_class
WHERE relkind = 'r'
  AND relnamespace = 'public'::regnamespace
  AND NOT relrowsecurity;
```

If it returns a row or two, it's a table to fix, or to add to an explicit allowlist of tables that are not tenant-scoped.

## Integration tests on the branch

Integration tests help you catch the enforcement gaps with policy changes. Use them to connect with the preview branch (`DATABASE_URL` with `app_user`), log in through the real auth flow, and hit the API routes that read and write tenant data:

```ts
// runs against the preview app, signed in as a member of org A
test('a tenant cannot read another org', async () => {
  const session = await loginAs('alex@example.com'); // belongs to org A
  const res = await session.get('/api/projects');

  const orgs = new Set(res.body.map((p) => p.org_id));
  expect(orgs).toEqual(new Set([orgA])); // must never contain org B
});
```

Then add the negative cases in the same file to cover tests like a user who should be denied or a worker with no tenant set.

</Steps>

The fast unit tests catch cheap mistakes on every commit, and the branch tests prove the policy holds with a real login and real data. Together they show that your RLS actually runs before you merge a pull request.

## Conclusion

The issue with testing RLS locally is that of a one app on one connection, while production is many services that connect with different levels of access. The owner role skips policies, the connection pool can hand one tenant's context to the next request, the login flow decides who the user is, and real data has messy rows. A Neon branch gives you all of that at once. So before you merge an RLS change, run it on a branch with the same restricted role and login flow you use in production, and check that both test layers pass. For the policy patterns themselves, see [Adopt Postgres RLS for Multi-Tenant Apps](/guides/rls-multi-tenant-apps).
