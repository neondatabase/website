---
title: Access control & security
subtitle: Understand how the Data API authenticates requests and enforces database
  permissions.
enableTableOfContents: true
updatedOn: '2025-12-10T22:18:02.763Z'
---

<FeatureBetaProps feature_name="Neon Data API" />

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

When you enable the Data API via the Console, Neon automatically applies default `GRANT` statements to the `authenticated` role for the `public` schema. See [Configure schema access](/docs/data-api/get-started#3-configure-schema-access) for the statements that are applied.

### Manual configuration

If you skipped the default Data API setup or you are adding custom roles or working with schemas other than `public`, you may need to grant permissions explicitly.

The following example SQL commands grant the `authenticated` role access to all existing and future tables in the `public` schema. If your tables are in a different schema (e.g., `sales`, `analytics` etc), update the schema name accordingly. You can also substitute `authenticated` with a custom role (e.g., `admin`), but you must ensure that the role exists in your database.

Run these commands in the [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) to ensure your API users can access your tables:

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

Granting `SELECT` access to the `authenticated` role allows the API to read **all rows** in the table. To restrict access to specific data (e.g., "users can only see their own posts"), you must enable Row-Level Security.

The Data API provides a special SQL function, `auth.user_id()`, which extracts the User ID (`sub` claim) from the current request's JWT.

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

Now, even though the `authenticated` role has `SELECT` permission on the table, the database will hide any rows where the `user_id` column does not match the ID in the user's token.
