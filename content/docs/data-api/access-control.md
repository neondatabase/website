---
title: Access control & security
subtitle: Understand how the Data API authenticates requests and enforces database
  permissions.
summary: >-
  Covers the authentication process of the Neon Data API, detailing how it
  utilizes PostgreSQL's security model to enforce role privileges and Row-Level
  Security for database access control.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.805Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/data-api/get-started">Getting started with Data API</a>
    <a href="/docs/data-api/custom-authentication-providers">Custom authentication providers</a>
    <a href="/docs/guides/rls-tutorial">Secure your app with RLS</a>
  </DocsList>
</InfoBlock>

The Neon Data API is designed to be secure by default. It relies on PostgreSQL's native security model, meaning the API does not have its own separate permission system — it simply acts as a gateway that respects the roles and Row-Level Security (RLS) policies defined in your database.

Securing your data involves two layers:

1.  **Role Privileges (GRANT):** Determining which tables the API is allowed to access.
2.  **Row-Level Security (RLS):** Determining which specific rows a user is allowed to see.

## API Roles

When the Data API receives an HTTP request, it switches to a specific PostgreSQL role before executing the query. The role chosen depends on whether the request includes an Authorization header.

### 1. The `authenticated` role

**Used for:** Requests with a valid JWT token.

When a client sends a valid Bearer token, the API switches to the `authenticated` role. This is the primary role for your application users.

- The JWT token identifies _who_ the user is (via the `sub` claim).
- The `authenticated` role defines _what_ the application is allowed to touch.

### 2. The `anonymous` role

**Used for:** Requests without a token.
If a request arrives with no `Authorization` header, the API switches to the `anonymous` role.

- By default, this role has **no permissions**.
- You can explicitly `GRANT` SELECT permissions to this role if you want to expose public data (e.g., a list of products or public blog posts) without requiring users to log in.
- The `GRANT` statements would be similar to the grants for the `authenticated` role. See [Configure schema access](/docs/data-api/get-started#3-configure-schema-access) for an example.

### 3. Custom roles

The API determines the role based on the `role` claim in the JWT. If you issue your own tokens with a custom role claim (e.g., `"role": "admin"`), the API will attempt to switch to a Postgres role named `admin`. You must ensure this role exists in your database and has the correct permissions.

The following Layers explain how to configure these roles for secure access.

## Layer 1: Table Privileges

Before RLS can even apply, the database role must have permission to perform the action (SELECT, INSERT, etc.) on the table.

### Automatic configuration

When you enable the Data API via the Console, Neon automatically applies default `GRANT` statements to the `authenticated` role for the `public` schema. See the manual configuration section below for the statements that are applied.

### Manual configuration

If you skipped the default Data API setup in the Neon Console or you are adding custom roles or working with schemas other than `public`, you may need to grant permissions explicitly.

The following example SQL commands grant the `authenticated` role access to all existing and future tables in the `public` schema. If your tables are in a different schema (e.g., `sales`, `analytics` etc), update the schema name accordingly. You can also substitute `authenticated` with a custom role (e.g., `admin`), but you must ensure that the role exists in your database.

Run these commands in the [SQL Editor](/docs/get-started/query-with-neon-sql-editor) to ensure your API users can access your tables:

```sql
-- 1. Grant usage on the schema
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant access to existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public TO authenticated;

-- 3. Ensure future tables are automatically accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated;

-- 4. Grant access to sequences (required for auto-incrementing IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

<Admonition type="info" title="Permission denied errors?">
If you encounter a "permission denied" error immediately after creating a new table, it is likely because the `authenticated` role hasn't been granted privileges on it. Running the `GRANT` commands above usually resolves this.
</Admonition>

## Layer 2: Row-Level Security (RLS)

Granting `SELECT` access to the `authenticated` role allows the API to read **all rows** in the table. To restrict access to specific data (e.g., "users can only see their own posts"), you must enable Row-Level Security and create policies.

### Understanding RLS states

RLS has three distinct states that affect data visibility:

| State                        | Behavior                                                         |
| ---------------------------- | ---------------------------------------------------------------- |
| **RLS disabled**             | All authenticated users see all rows (no filtering)              |
| **RLS enabled, no policies** | All access is blocked (users see nothing)                        |
| **RLS enabled + policies**   | Rows filtered by policy rules (typically using `auth.user_id()`) |

<Admonition type="warning" title="RLS disabled means no filtering">
If RLS is disabled on a table, any authenticated user can see all rows in that table. This is different from "filtering without policies" — it means there is no filtering at all.
</Admonition>

### Checking RLS status in the Console

The **Data API** page in the Neon Console shows the RLS status of your tables. If a table has RLS disabled, you'll see a warning message like:

> "table_name has RLS disabled. All authenticated users can view all rows in this table(s)."

You can click the **Enable RLS** button to enable Row-Level Security on the table without writing SQL. After enabling RLS, you'll need to create policies to allow access.

### The `user_id` column pattern

To filter rows by user, your tables need a column that stores the user's ID. The Data API provides `auth.user_id()`, a SQL function that extracts the User ID (`sub` claim) from the current request's JWT. Use this function to:

1. **Set a default value** so new rows are automatically associated with the current user
2. **Filter rows in policies** so users only see their own data

```sql
-- Example table with user_id column
CREATE TABLE posts (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id text DEFAULT (auth.user_id()) NOT NULL,  -- Automatically set to current user
  content text NOT NULL
);
```

### Example workflow

1.  **Enable RLS on the table:**

    ```sql
    ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
    ```

    _Once enabled, all access is blocked by default until a policy is created._

2.  **Create a policy:**
    ```sql
    CREATE POLICY "User owns data" ON posts
      FOR ALL
      TO authenticated
      USING ( select auth.user_id() = user_id )
      WITH CHECK ( select auth.user_id() = user_id );
    ```

Now, even though the `authenticated` role has `SELECT` permission on the table, the database will only return rows where the `user_id` column matches the ID in the user's token.
