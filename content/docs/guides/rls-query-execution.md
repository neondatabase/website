---
title: Run RLS queries with Drizzle ORM
subtitle: Learn how to execute RLS queries securely with Drizzle ORM, including best
  practices for Postgres roles, connection management, and dynamic client setup.
summary: >-
  Covers how to execute RLS queries using Drizzle ORM securely, with details on
  Postgres custom roles, advanced connection string configurations, and dynamic
  client setup with auth callbacks.
enableTableOfContents: true
updatedOn: '2026-03-23T18:27:00.724Z'
---

<InfoBlock>
<DocsList title="What you'll learn">
<p>How to create and use custom Postgres roles for RLS with Drizzle</p>
<p>Differences between authenticated and admin connection strings and when to use each</p>
<p>How to use Drizzle and RLS with the Data API (frontend)</p>
<p>Drizzle client setup using auth token callbacks (backend)</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/rls-drizzle">Simplify RLS with Drizzle</a>
  <a href="/docs/guides/row-level-security">Row-Level Security with Neon</a>
  <a href="https://orm.drizzle.team/docs/rls">RLS in Drizzle</a>
</DocsList>
</InfoBlock>

After defining Row-Level Security (RLS) policies [in your Drizzle schema](/docs/guides/rls-drizzle), you need to choose how to connect to Postgres and execute queries that respect these policies.

Depending on your application architecture, you might connect from a frontend (using the Data API) or a backend (using the Neon serverless driver).

Before diving into client implementations, it’s important to understand how Postgres roles and connection strings affect RLS enforcement. The role you use to connect determines whether RLS policies are applied or bypassed, so configuring roles correctly is essential for maintaining security.

- **Admin connection strings** (e.g., `neondb_owner`) include the `BYPASSRLS` attribute, meaning they ignore RLS policies entirely. Use these only for administrative tasks such as migrations or privileged background jobs.
- **Authenticated roles** (e.g., the default `authenticated`, `anonymous` roles used by the Data API) have the `NOLOGIN` attribute, so they cannot be used for direct backend connections. To enforce RLS in your backend, you’ll need a custom login-enabled role.

## Creating custom roles for RLS

To properly enforce RLS, avoid using default administrative roles like `neondb_owner`, as they bypass all policies. Instead, create a custom role that:

- Has login privileges (`LOGIN`)
- Does **not** have the `BYPASSRLS` attribute
- Is distinct from the built-in `authenticated` role.

Using custom roles allows you to enforce RLS consistently while tailoring permissions for different user groups (e.g., users, moderators, admins) based on your application’s security requirements.

### 1. Create a custom role in Postgres

You can execute these commands in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or via a custom database migration to set up the role and grant the necessary schema permissions.

<Admonition type="tip" title="Why not use Drizzle migrations?">
Drizzle’s migration system is focused on schema changes and does not currently support role management or permission grants. To configure roles, you’ll need to run SQL commands directly in Postgres or include them in a custom (empty) migration file.
</Admonition>

For example, the following SQL creates a role named `authenticated_backend` with login privileges and grants it access to the `public` schema and specific table `todos`. Optionally, use the commented sql commands to set default privileges for all present and future tables in the `public` schema.

```sql shouldWrap
-- Create a custom role to be used by your application backend to connect
CREATE ROLE authenticated_backend WITH LOGIN PASSWORD 'your_secure_password';

-- Grant schema access
GRANT USAGE ON SCHEMA public TO authenticated_backend;

-- Grant access to specific tables (e.g., todos, users)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE todos TO authenticated_backend;

-- Note: Repeat the GRANT statement for any other tables this role needs to access (e.g., users, projects, etc.)
-- GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated_backend;

-- Set default privileges for future tables in the schema:
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated_backend;
```

### 2. Map the custom role in Drizzle

Once the role exists, map it in your Drizzle schema to apply RLS policies for that specific role.

```typescript {5,19-23}
import { sql } from 'drizzle-orm';
import { authUid, crudPolicy } from 'drizzle-orm/neon';
import { bigint, boolean, pgRole, pgTable, text } from 'drizzle-orm/pg-core';

export const backendRole = pgRole('authenticated_backend').existing();

export const todos = pgTable(
  'todos',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
  },
  (table) => [
    // Users: can access and modify their own todos
    crudPolicy({
      role: backendRole,
      read: authUid(table.userId), // Can only read their own todos
      modify: authUid(table.userId), // Can only modify their own todos
    }),
  ]
);
```

Similarly, you can define additional custom roles (e.g., `moderator_backend`, `admin_backend`) with tailored permissions and map them in your Drizzle schema to support more advanced access control.

Add these as separate `crudPolicy` entries. For example, a `moderator_backend` role could have read access to all todos but only update its own, while an `admin_backend` role might have full read and write access across all todos.

<details>

<summary>Example with multiple roles</summary>

```typescript
import { sql } from 'drizzle-orm';
import { authUid, crudPolicy } from 'drizzle-orm/neon';
import { bigint, boolean, pgRole, pgTable, text } from 'drizzle-orm/pg-core';

export const backendRole = pgRole('authenticated_backend').existing();
export const moderatorRole = pgRole('moderator_backend').existing();
export const adminRole = pgRole('admin_backend').existing();

export const todos = pgTable(
  'todos',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text().notNull(),
    isComplete: boolean().notNull().default(false),
  },
  (table) => [
    // Users: can access and modify their own todos
    crudPolicy({
      role: backendRole,
      read: authUid(table.userId), // Can only read their own todos
      modify: authUid(table.userId), // Can only modify their own todos
    }),
    // Moderators: can read all todos but only modify their own
    crudPolicy({
      role: moderatorRole,
      read: true, // Can read all todos
      modify: authUid(table.userId), // Can only modify their own todos
    }),
    // Admins: can read and modify all todos
    crudPolicy({
      role: adminRole,
      read: true, // Can read all todos
      modify: true, // Can modify all todos
    })
  ]
);
```

Ensure your backend uses the correct connection string for each role and that your application logic assigns roles based on user permissions.

For example, an admin dashboard might connect using the `admin_backend` role, while user-facing APIs use the `authenticated_backend` role.

</details>

## Managing connection strings for RLS

When building applications with RLS, a standard architectural pattern is splitting your database connections into two different URLs to limit risk:

1. **`DATABASE_AUTHENTICATED_URL`**: Used by your main application logic (handling user requests). It connects using your restricted custom role (e.g., `authenticated_backend`) so that RLS is strictly enforced.
2. **`DATABASE_URL` (or `DATABASE_ADMIN_URL`)**: The administrative connection string (e.g., `neondb_owner`). This bypasses RLS (`BYPASSRLS`) and has full privileges. It should **only** be used for running migrations, executing administrative webhooks, building dashboards, or background workers that require a system-wide view of the data.

An example `.env` file structure:

```bash
# Connects with 'authenticated_backend' - enforce RLS, used by user-facing backend APIs
DATABASE_AUTHENTICATED_URL="postgresql://authenticated_backend:xxx@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Connects with 'neondb_owner' - bypass RLS, used for setup, migrations, and cron administrative tasks
DATABASE_URL="postgresql://neondb_owner:xxx@ep-cool-snowflake-12345.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Using the correct connection string ensures your user-facing queries are always secured by RLS, while letting background services accomplish administrative tasks without friction.

## How to run authenticated queries

After defining RLS policies, the next step is choosing how to run queries that respect these policies. Depending on your application architecture, you have two main options for running authenticated queries with RLS.

### Frontend: Use the Data API

For frontend applications, use the [Data API](/docs/data-api/get-started#connect-and-query), which provides a REST interface for your database. In this setup, Drizzle is used only to **declare and migrate RLS policies**; query execution is done with a PostgREST-compatible client such as `@neondatabase/neon-js`, `postgrest-js` etc.

When requests go through the Data API, your database enforces RLS policies automatically based on the JWT claims included in the request. This means that as long as your frontend includes the appropriate authentication token, users will only be able to access the data they're authorized to see.

For complete examples of using Drizzle and RLS with the Data API, see:

- [Data API tutorial](/docs/data-api/demo) - Full note-taking app example built with Neon Auth, Drizzle RLS, and the Data API
- [Data API getting started](/docs/data-api/get-started) - Setup and basic queries

### Backend: Use Drizzle with the serverless driver

When connecting a backend API directly to the database using the Neon serverless driver, you have two options for handling authorization. The approach you choose depends on the Postgres role you use to connect.

As mentioned earlier, you must connect using a custom role to enforce RLS at the database level. If you connect using an administrative role (like `neondb_owner`), RLS is bypassed and you must enforce authorization manually in your queries.

Install the necessary dependencies for either approach:

```bash
npm install drizzle-orm @neondatabase/serverless jose
```

#### Secure Backend RLS Client setup

To enforce RLS across your backend securely, you can configure your Drizzle client to automatically apply the user's JWT.

When setting up connection pooling over WebSockets or TCP using `@neondatabase/serverless` and `Pool`, you must open a transaction and manually inject the verified claims using `set_config`.

Below is an abstracted function `getAuthenticatedDb` that transparently handles this lifecycle:

<Admonition type="note">
The `$withAuth` method in Drizzle is deprecated; instead, set JWT claims in the transaction context as shown below.
</Admonition>

```typescript
iimport { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import { todos } from './schema';

// Note: Use DATABASE_AUTHENTICATED_URL that connects via your scoped RLS role
const pool = new Pool({ connectionString: process.env.DATABASE_AUTHENTICATED_URL! });
const db = drizzle(pool);

const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL!));

async function verifyJWT(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: new URL(process.env.JWKS_URL!).origin, // Update according to your JWT issuer
    });
    if (!payload.sub) throw new Error('JWT missing sub claim');
    return payload;
}

/**
 * Wraps your Drizzle instance in a transaction that automatically applies
 * the given JWT claims natively to Postgres block state.
 */
export const getAuthenticatedDb = async <T>(
    token: string,
    callback: (tx: any) => Promise<T>
): Promise<T> => {
    const claims = await verifyJWT(token);

    // Use a Drizzle transaction to set auth context and execute the provided callback
    return db.transaction(async (tx) => {
        // Inject the claims into the transaction session context
        await tx.execute(sql`select set_config('request.jwt.claims', ${claims}, true)`);

        // Run the user's query against the isolated session
        return callback(tx);
    });
};

// Example usage
getAuthenticatedDb('eyJh...', async (tx) => {
    const todosForUser = await tx.select().from(todos);
    console.log(todosForUser);
});
```

#### Using bypass RLS

When connecting with an administrative role like `neondb_owner` (which inherently has `BYPASSRLS`), RLS policies are **not enforced on the server edge**.

In this case, you must verify the JWT in your backend completely manually and apply access control explicitly inside your `WHERE` clauses.

<Admonition type="important">
If you choose this approach, RLS policies in your database will be ignored. You must ensure that all queries correctly enforce access control based on the authenticated user's identity. This puts the responsibility for security solely on your backend code.
</Admonition>

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { todos } from './schema';
import { sql } from 'drizzle-orm';
import { jwtVerify, createRemoteJWKSet } from 'jose'

async function getTodosForUser(jwtToken: string) {
    // DATABASE_URL here connects with neondb_owner (BYPASSRLS)
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const db = drizzle(pool);

    try {
        const JWKS = createRemoteJWKSet(new URL("https://your-jwks-url.json"));
        const { payload } = await jwtVerify(jwtToken, JWKS, {
            issuer: "https://your-jwks-url.json"
        });

        // You MUST apply access control manually via WHERE
        const result = await db.select()
          .from(todos)
          .where(sql`${todos.userId} = ${payload.sub}`);

        return result;
    } finally {
        await pool.end();
    }
}
```

<NeedHelp/>
