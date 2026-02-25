---
title: Data API Advisors
subtitle: Identify security and performance issues in your API-exposed database
enableTableOfContents: true
updatedOn: '2026-02-25T00:00:00.000Z'
---

The Data API Advisors analyze your database schema and configuration to detect security and performance issues for tables and objects exposed by the [Data API](/docs/data-api/overview) feature. They run a set of checks against your database and report issues with severity levels and recommended fixes.

Because the Data API exposes your database schema directly over HTTP, security misconfigurations that would normally be hidden behind an application server become directly exploitable. Missing RLS policies and overly permissive views are especially dangerous in this context. The advisors also check for common performance issues like unindexed foreign keys and table bloat, helping you catch issues before they reach production.

## Prerequisites

- Your compute must be active (not suspended) when running a scan.
- If the Data API is not yet enabled, the Advisors screen will show a "Data API not enabled" message. Enable the [Data API](/docs/data-api/get-started) to run scans.

## How to access

### Neon Console

In the Neon Console, go to **Monitoring > Data API Advisors** for your branch. The advisor scans your database and displays any issues found, grouped by category.

![Data API advisor](/docs/data-api/data-api-database-advisor-monitor.png)

Each issue includes a severity level, a description, and a recommended fix. Clicking an issue opens a detail view with an **Ask Assistant** option that analyzes the risk and suggests a specific fix (such as a SQL query tailored to your schema), along with a **Read our docs** link for general guidance on that type of issue.

![Data API advisor solution](/docs/data-api/data-api-database-advisor-resolve.png)

### API

You can also retrieve advisor issues via the [Neon API](https://api-docs.neon.tech/reference/getprojectadvisorsecurityissues):

```
GET /projects/{project_id}/advisors
```

Optional query parameters:

- `branch_id`: Target branch (defaults to the primary branch)
- `database_name`: Target database (required if the branch has multiple databases)
- `category`: Filter by `SECURITY` or `PERFORMANCE`
- `min_severity`: Minimum severity to include: `INFO`, `WARN`, or `ERROR`. For example, `WARN` returns WARN and ERROR issues but not INFO.

<details>
<summary>Example response</summary>

```json
{
  "issues": [
    {
      "name": "rls_disabled_in_public",
      "title": "RLS Disabled in Public",
      "level": "ERROR",
      "facing": "EXTERNAL",
      "categories": ["SECURITY"],
      "description": "Detects cases where row level security (RLS) has not been enabled on tables in schemas exposed to Data-API",
      "detail": "Table `public.users` is public, but RLS has not been enabled.",
      "remediation": "https://neon.com/docs/data-api/database-advisor#rls-disabled-in-public",
      "metadata": {}
    }
  ]
}
```

</details>

## Security checks

| Check                                                                   | Severity | Description                                                                          |
| ----------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------ |
| [RLS disabled in public](#rls-disabled-in-public)                       | ERROR    | Tables exposed via the Data API without row-level security                           |
| [Policy exists RLS disabled](#policy-exists-rls-disabled)               | ERROR    | RLS policies exist but RLS is not enabled on the table                               |
| [Sensitive columns exposed](#sensitive-columns-exposed)                 | ERROR    | API-exposed tables without RLS that contain potentially sensitive columns            |
| [Security definer view](#security-definer-view)                         | ERROR    | Views using SECURITY DEFINER, bypassing the querying user's permissions              |
| [Neon Auth users exposed](#neon-auth-users-exposed)                     | ERROR    | Views exposing `neon_auth.user` data to API roles                                    |
| [RLS references Neon Auth metadata](#rls-references-neon-auth-metadata) | ERROR    | RLS policies referencing user-editable Neon Auth fields                              |
| [FK to Neon Auth unique constraint](#fk-to-neon-auth-unique-constraint) | ERROR    | Foreign keys referencing Neon Auth unique constraints instead of primary keys        |
| [RLS policy always true](#rls-policy-always-true)                       | WARN     | RLS policies with always-true expressions that bypass access control                 |
| [Function search path mutable](#function-search-path-mutable)           | WARN     | Functions without an explicit `search_path` setting                                  |
| [Extension in public](#extension-in-public)                             | WARN     | Extensions installed in the `public` schema, exposing their objects via the Data API |
| [Extension versions outdated](#extension-versions-outdated)             | WARN     | Extensions not using the recommended default version                                 |
| [Materialized view in API](#materialized-view-in-api)                   | WARN     | Materialized views accessible to API roles, bypassing RLS                            |
| [Foreign table in API](#foreign-table-in-api)                           | WARN     | Foreign tables accessible over the Data API, which cannot use RLS                    |
| [Unsupported reg types](#unsupported-reg-types)                         | WARN     | Columns using `reg*` types that prevent `pg_upgrade`                                 |
| [RLS enabled no policy](#rls-enabled-no-policy)                         | INFO     | RLS is enabled but no policies have been created                                     |

## Performance checks

| Check                                                         | Severity | Description                                                                     |
| ------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| [Auth RLS InitPlan](#auth-rls-initplan)                       | WARN     | RLS policy functions re-evaluated per row instead of once per query             |
| [Multiple permissive policies](#multiple-permissive-policies) | WARN     | Multiple permissive RLS policies on the same table for the same role and action |
| [Duplicate index](#duplicate-index)                           | WARN     | Two or more identical indexes on the same table                                 |
| [Unindexed foreign keys](#unindexed-foreign-keys)             | INFO     | Foreign key columns without a covering index                                    |
| [Unused index](#unused-index)                                 | INFO     | Indexes that have never been used                                               |
| [No primary key](#no-primary-key)                             | INFO     | Tables without a primary key                                                    |
| [Table bloat](#table-bloat)                                   | INFO     | Tables with excessive bloat that may benefit from maintenance                   |

---

## Security check details

### RLS disabled in public

**Severity:** ERROR

Tables in schemas exposed through the Data API are accessible to anyone with your project's API URL if RLS is not enabled. Without RLS, all rows are fully readable and writable via the API.

See [Data API access control](/docs/data-api/access-control) and [RLS tutorial](/docs/guides/rls-tutorial).

<details>
<summary>Show resolution</summary>

Enable RLS on the affected table:

```sql
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;
```

After enabling RLS, no data is accessible via the Data API until you create policies to define access rules.

If the table should not be accessible via the API at all, remove its schema from the exposed schemas in your [Data API settings](/docs/data-api/manage).

</details>

---

### Policy exists RLS disabled

**Severity:** ERROR

RLS policies have been created on a table, but RLS itself is not enabled. The policies have no effect until RLS is turned on, which may give a false sense of security.

<details>
<summary>Show resolution</summary>

Enable RLS on the table:

```sql
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;
```

</details>

---

### Sensitive columns exposed

**Severity:** ERROR

Tables exposed via the Data API that contain columns with potentially sensitive data (credentials, personal identifiers, financial info) are at risk if RLS is not enabled. Without RLS, any API user can read all rows.

<details>
<summary>Show resolution</summary>

This check matches exact column names (case-insensitive, hyphens treated as underscores) against known sensitive patterns, including:

- **Credentials:** `password`, `secret`, `api_key`, `token`, `jwt`, `access_token`, `refresh_token`, `otp`, `2fa_secret`, and others
- **Personal identifiers:** `ssn`, `passport_number`, `tax_id`, `driver_license`, `national_id`
- **Financial data:** `credit_card`, `cvv`, `bank_account`, `iban`, `routing_number`
- **Other:** `health_record`, `ssh_key`, `pgp_key`, `mac_address`, `facial_recognition`

A column named `user_password_hash` would not be flagged because matching is on the full column name, not substrings.

Enable RLS on the table and create appropriate policies:

```sql
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY restrict_access ON <schema>.<table>
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);
```

Alternatively, move sensitive columns to a separate table with its own RLS policies, or remove the schema from the Data API's exposed schemas if API access is not needed.

</details>

---

### Security definer view

**Severity:** ERROR

Views default to SECURITY DEFINER in PostgreSQL, meaning they execute with the permissions of the view creator rather than the querying user. This bypasses RLS policies on the underlying tables and can expose more data than intended through the Data API.

See [PostgreSQL views](/postgresql/postgresql-views/managing-postgresql-views) for background.

<details>
<summary>Show resolution</summary>

Set the view to use SECURITY INVOKER mode so it respects the querying user's permissions and RLS policies:

```sql
CREATE OR REPLACE VIEW <schema>.<view_name>
  WITH (security_invoker=on)
AS
SELECT ...
FROM ...;
```

Note: The `security_invoker` option requires PostgreSQL 15 or later. This check only runs on PostgreSQL 15+.

</details>

---

### Neon Auth users exposed

**Severity:** ERROR

Views or materialized views that reference `neon_auth.user` can expose sensitive user data to API roles. Views in PostgreSQL default to SECURITY DEFINER mode, which means they bypass [row-level security](/postgresql/postgresql-administration/postgresql-row-level-security) policies on the underlying tables.

See [Neon Auth overview](/docs/auth/overview) and [Data API access control](/docs/data-api/access-control) for background.

<details>
<summary>Show resolution</summary>

**Option 1: Use a profiles table with a trigger**

Create a `public.profiles` table with only the user fields your application needs, and populate it via a trigger on `neon_auth.user`:

```sql
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES neon_auth.user ON DELETE CASCADE,
  display_name text,
  PRIMARY KEY (id)
);

CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON neon_auth.user
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

Then enable RLS on `public.profiles` and create policies to control access.

**Option 2: Use a security invoker view**

Create a view with `security_invoker=on` so it respects the querying user's permissions:

```sql
CREATE VIEW public.members
  WITH (security_invoker=on)
AS
SELECT id, created_at
FROM neon_auth.user;
```

Note: For this approach to work, RLS must also be enabled on the `neon_auth.user` table with appropriate policies. Otherwise, the security invoker view still exposes all rows.

</details>

---

### RLS references Neon Auth metadata

**Severity:** ERROR

RLS policies that reference user-editable fields from Neon Auth (such as `user.role` or `organization.metadata`) are insecure. Users can modify these fields, allowing them to bypass security checks.

See [Neon Auth overview](/docs/auth/overview).

<details>
<summary>Show resolution</summary>

Remove references to user-editable Neon Auth fields from your RLS policies. The specific fields detected by this check are:

- `neon_auth.user.role` -- users can change their own role
- `neon_auth.organization.metadata` -- organization metadata can be modified

Instead, base security decisions on stable, non-editable fields like the user's `id`.

For example, replace:

```sql
-- Insecure: references neon_auth.user.role which users can modify
CREATE POLICY role_based_access ON public.documents
  FOR SELECT
  USING (
    (SELECT role FROM neon_auth.user WHERE id = (SELECT auth.uid())) = 'admin'
  );
```

With a policy based on a stable identifier:

```sql
CREATE POLICY owner_access ON public.documents
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);
```

</details>

---

### FK to Neon Auth unique constraint

**Severity:** ERROR

Foreign keys referencing unique constraints (rather than primary keys) in the `neon_auth` schema are not supported. These unique constraints may change in future updates, which would break your foreign key references and block migrations.

<details>
<summary>Show resolution</summary>

Drop the foreign key constraint referencing the unique constraint and recreate it referencing the primary key instead:

```sql
ALTER TABLE <schema>.<table> DROP CONSTRAINT <foreign_key_name>;

ALTER TABLE <schema>.<table>
  ADD CONSTRAINT <foreign_key_name>
  FOREIGN KEY (<column>) REFERENCES neon_auth.user(id);
```

</details>

---

### RLS policy always true

**Severity:** WARN

RLS policies that use always-true expressions like `USING (true)` or `WITH CHECK (true)` for write operations (INSERT, UPDATE, DELETE) effectively bypass row-level security. While the table appears to have RLS enabled, these policies grant unrestricted access.

Note: `USING (true)` on SELECT-only policies is excluded from this check, as it is a common pattern for intentional public read access.

<details>
<summary>Show resolution</summary>

Replace the always-true policy with one that enforces actual access control:

```sql
DROP POLICY <policy_name> ON <schema>.<table>;

CREATE POLICY <new_policy_name> ON <schema>.<table>
  FOR <action>
  USING ((SELECT auth.uid()) = user_id);
```

If you need broad read access combined with restricted writes, use a restrictive policy:

```sql
CREATE POLICY restrict_writes ON <schema>.<table>
  AS RESTRICTIVE
  FOR UPDATE
  USING ((SELECT auth.uid()) = user_id);
```

</details>

---

### Function search path mutable

**Severity:** WARN

Functions without an explicit `search_path` inherit the calling user's session `search_path`. This can lead to inconsistent behavior and potential security issues if a user manipulates their `search_path` to resolve unqualified names to unexpected objects.

See [PostgreSQL schemas and search_path](/postgresql/postgresql-administration/postgresql-schema) for background.

<details>
<summary>Show resolution</summary>

Set `search_path` to an empty string in the function definition, and fully qualify all object references:

```sql
CREATE OR REPLACE FUNCTION <schema>.<function_name>()
  RETURNS void
  LANGUAGE sql
  SET search_path = ''
AS $$
  -- Use fully qualified names, e.g. public.my_table
$$;
```

</details>

---

### Extension in public

**Severity:** WARN

Extensions installed in the `public` schema make their functions, tables, and views appear as part of your API surface. This is usually unintentional and can expose internal functionality.

See [Neon extensions](/docs/extensions/pg-extensions) for more on managing extensions.

<details>
<summary>Show resolution</summary>

Move the extension to a non-exposed schema:

```sql
ALTER EXTENSION <extension_name> SET SCHEMA <non_exposed_schema>;
```

For example, to move the `ltree` extension out of `public`:

```sql
ALTER EXTENSION ltree SET SCHEMA extensions;
```

</details>

---

### Extension versions outdated

**Severity:** WARN

Running an outdated extension version may expose your database to known security vulnerabilities and prevent you from benefiting from bug fixes and performance improvements.

See [managing extensions](/docs/extensions/pg-extensions) for background.

<details>
<summary>Show resolution</summary>

Check the current and available versions:

```sql
SELECT name, installed_version, default_version
FROM pg_catalog.pg_available_extensions
WHERE name = '<extension_name>';
```

Then update to the default version:

```sql
ALTER EXTENSION <extension_name> UPDATE;
```

**Note:** Some extension updates may include breaking changes. Test the update in a development branch before applying to production, and review the extension's changelog if available.

</details>

---

### Materialized view in API

**Severity:** WARN

Materialized views cannot be protected with RLS. If a materialized view is accessible to API roles (`anonymous` or `authenticated`), all rows are visible to any API user.

See [PostgreSQL materialized views](/postgresql/postgresql-views/postgresql-materialized-views).

<details>
<summary>Show resolution</summary>

Revoke `SELECT` access from API roles:

```sql
REVOKE SELECT ON <schema>.<materialized_view> FROM public, anonymous, authenticated;
```

You can verify the change with:

```sql
SELECT pg_catalog.has_table_privilege('anonymous', '<schema>.<materialized_view>'::regclass::oid, 'select');
-- Should return: false
```

</details>

---

### Foreign table in API

**Severity:** WARN

Foreign tables do not support RLS. If a foreign table is accessible over the Data API, all rows are visible to any API user.

<details>
<summary>Show resolution</summary>

Revoke `SELECT` access from API roles:

```sql
REVOKE SELECT ON <schema>.<foreign_table> FROM public, anonymous, authenticated;
```

If you need to access data from the foreign table over the API, move it to a non-exposed schema, grant API roles access in the new schema, and create a function that implements security rules:

```sql
CREATE SCHEMA private;
ALTER FOREIGN TABLE public.<foreign_table> SET SCHEMA private;

-- Ensure API roles can still read from the foreign table
GRANT SELECT ON private.<foreign_table> TO anonymous, authenticated;

-- Create a function with security rules, accessible via RPC
CREATE OR REPLACE FUNCTION public.secure_foreign_read()
  RETURNS TABLE (id integer, data text, author_id uuid)
  LANGUAGE sql
  SET search_path = ''
AS $$
  SELECT id, data, author_id
  FROM private.<foreign_table>
  WHERE author_id = (SELECT auth.uid());
$$;
```

</details>

---

### Unsupported reg types

**Severity:** WARN

Columns using certain `reg*` types that reference PostgreSQL internals are not supported by [pg_upgrade](https://www.postgresql.org/docs/current/pgupgrade.html), the standard tool for upgrading between PostgreSQL versions. Using these types can block future database upgrades. The flagged types are: `regcollation`, `regconfig`, `regdictionary`, `regnamespace`, `regoper`, `regoperator`, `regproc`, and `regprocedure`.

<details>
<summary>Show resolution</summary>

Replace the `reg*` type column with a `text` column storing the object's name:

```sql
-- Instead of:
CREATE TABLE public.bad_table (
  id int PRIMARY KEY,
  my_collation regcollation
);

-- Use:
CREATE TABLE public.good_table (
  id int PRIMARY KEY,
  my_collation_name text
);
```

</details>

---

### RLS enabled no policy

**Severity:** INFO

RLS is enabled on a table but no policies have been created. This means no data is accessible via the Data API for this table, which may or may not be intentional.

<details>
<summary>Show resolution</summary>

If the table should be accessible, create an appropriate RLS policy:

```sql
CREATE POLICY select_own_rows ON <schema>.<table>
  FOR SELECT
  USING ((SELECT auth.uid()) = user_id);
```

If blocking all access is intentional, make it explicit with a denial policy:

```sql
CREATE POLICY deny_all ON <schema>.<table>
  FOR SELECT
  USING (false);
```

See [Secure your app with RLS](/docs/guides/rls-tutorial) for a step-by-step guide.

</details>

---

## Performance check details

### Auth RLS InitPlan

**Severity:** WARN

When RLS policies call functions like `auth.uid()` or `current_setting()` directly, PostgreSQL may re-evaluate them for every row the query touches. At scale, this adds significant overhead. Wrapping the call in a subquery caches the result for the duration of the query.

See [RLS performance with subqueries](/docs/guides/rls-tutorial) for more context.

<details>
<summary>Show resolution</summary>

Wrap the function call in a `SELECT` subquery:

```sql
-- Before (re-evaluated per row):
CREATE POLICY access_policy ON documents
  USING (auth.uid() = user_id);

-- After (evaluated once per query):
CREATE POLICY access_policy ON documents
  USING ((SELECT auth.uid()) = user_id);
```

This applies to `auth.uid()`, `auth.role()`, `auth.jwt()`, `auth.email()`, and `current_setting()` calls in RLS policies.

</details>

---

### Multiple permissive policies

**Severity:** WARN

When multiple permissive RLS policies apply to the same table for the same role and action, PostgreSQL must evaluate all of them (they combine with `OR` logic). This increases query overhead and can also lead to unintentionally broad access.

See [row-level security](/postgresql/postgresql-administration/postgresql-row-level-security) for background on policy types.

<details>
<summary>Show resolution</summary>

Consolidate multiple permissive policies into a single policy that combines the conditions:

```sql
-- Instead of two separate policies:
DROP POLICY policy_a ON <table>;
DROP POLICY policy_b ON <table>;

-- Combine into one:
CREATE POLICY consolidated_policy ON <table>
  FOR SELECT
  USING (
    <condition_a> OR <condition_b>
  );
```

This reduces the number of policy evaluations per row and gives the query planner better optimization opportunities.

Consolidation is a best practice, not a hard rule. If combining conditions leads to unreadable SQL, multiple policies may be acceptable for maintainability.

</details>

---

### Duplicate index

**Severity:** WARN

Two or more identical indexes on the same table add write overhead with no performance benefit. Each duplicate must be updated on every insert, update, and delete operation.

<details>
<summary>Show resolution</summary>

Drop all but one instance of the duplicate index:

```sql
DROP INDEX <schema_name>.<duplicate_index_name>;
```

</details>

---

### Unindexed foreign keys

**Severity:** INFO

Foreign key columns without a covering index can lead to slow joins and increased resource usage, especially as tables grow. Adding an index on foreign key columns improves join performance.

See [PostgreSQL foreign keys](/postgresql/postgresql-tutorial/postgresql-foreign-key) and [index types](/docs/postgresql/index-types) for background.

<details>
<summary>Show resolution</summary>

Create an index on the foreign key column:

```sql
CREATE INDEX ON <table>(<foreign_key_column>);
```

For example, if `order_item.customer_id` references `customer.id`:

```sql
CREATE INDEX ix_order_item_customer_id ON order_item(customer_id);
```

Choose an index type appropriate for the column's data type and query patterns. The default B-tree index works well for most foreign key columns.

</details>

---

### Unused index

**Severity:** INFO

Indexes that have never been used by any query still add overhead on every write operation (insert, update, delete) and consume storage. Removing unused indexes can improve write performance. This check only flags non-unique, non-primary-key indexes.

**Important:** PostgreSQL tracks index usage in `pg_stat_user_indexes`, but these statistics are local to the compute and do not persist across compute restarts (including suspend/resume cycles and failovers). An index showing zero scans may simply not have been used since the last compute start, not since it was created. Allow enough time for representative traffic before treating an index as truly unused.

See [PostgreSQL indexes](/postgresql/postgresql-indexes/postgresql-create-index) for background.

<details>
<summary>Show resolution</summary>

Before removing an index, confirm it is not needed for upcoming features or seasonal workloads. Then drop it:

```sql
DROP INDEX <schema_name>.<index_name>;
```

Consider testing in a development branch first to verify no performance regression.

</details>

---

### No primary key

**Severity:** INFO

Tables without a primary key lack a guaranteed unique row identifier. This can degrade query performance and prevents establishing [foreign key](/postgresql/postgresql-tutorial/postgresql-foreign-key) relationships with other tables.

<details>
<summary>Show resolution</summary>

Add a primary key to the table:

```sql
ALTER TABLE <schema>.<table> ADD PRIMARY KEY (<column>);
```

If no single column is unique, use a composite key:

```sql
ALTER TABLE <schema>.<table> ADD PRIMARY KEY (<column1>, <column2>);
```

Use simple, fixed-size types like `int`, `bigint`, or `uuid` for primary keys when possible.

</details>

---

### Table bloat

**Severity:** INFO

Tables with excessive bloat contain unused space from deleted or updated rows. This increases storage usage, slows down sequential scans, and increases I/O overhead. PostgreSQL's autovacuum normally reclaims this space, but it may not keep up with high-churn tables.

See [pg_repack](/docs/extensions/pg_repack) and [pgstattuple](/docs/extensions/pgstattuple) for tools to analyze and resolve bloat.

<details>
<summary>Show resolution</summary>

Start with a standard `VACUUM` which runs without locking the table:

```sql
VACUUM <schema>.<table>;
```

If that is not sufficient, `VACUUM FULL` reclaims more space but **locks the table** for the duration. Duration scales with table size — plan for potential downtime on large tables.

```sql
VACUUM FULL <schema>.<table>;
```

For large or heavily used tables where downtime is not acceptable, consider using [pg_repack](/docs/extensions/pg_repack) as a less disruptive alternative.

You can check table size before and after:

```sql
SELECT pg_size_pretty(pg_table_size('<schema>.<table>'));
```

If a table is repeatedly flagged for bloat, review your autovacuum settings to ensure vacuuming runs frequently enough. Contact [Neon support](/docs/introduction/support) for help tuning autovacuum for high-churn tables.

</details>

Database lints originally based on [open-source lints](https://github.com/supabase/supabase/blob/master/apps/studio/lib/api/self-hosted/lints.ts) from the Supabase project, Apache 2.0.
