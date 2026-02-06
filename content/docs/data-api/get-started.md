---
title: Getting started with Neon Data API
subtitle: Learn how to enable and use the Neon Data API
summary: >-
  How to enable the Neon Data API for your database, create a table with
  Row-Level Security (RLS), and execute your first query, including optional
  authentication and schema access configurations.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.811Z'
---

In this guide, you'll learn how to enable the Neon Data API for your database, create a table with Row-Level Security (RLS), and run your first query.

## Before you begin

- The Neon Data API is enabled at the **branch** level for a single database. Each branch has its own Data API configuration, so you must select the correct branch before enabling the API.
- Neon Data API does not currently support projects with [IP Allow](/docs/manage/projects#configure-ip-allow) or [Private Networking](/docs/guides/neon-private-networking) enabled.

<Steps>

## Enable the Data API

<Admonition type="tip">
You can also enable the Data API programmatically using the Neon MCP Server. The `provision_neon_data_api` tool enables LLMs to provision HTTP-based Data API access for Neon databases with optional JWT authentication. See the [Neon MCP Server documentation](/docs/ai/neon-mcp-server#supported-actions-tools) for more information.
</Admonition>

### 1. Navigate to the Data API page

In the Neon Console, select your project and go to the **Data API** page in the sidebar.

![Data API page with enable button](/docs/data-api/data_api_sidebar.png)

### 2. Configure Neon Auth (optional)

The **Use Neon Auth** checkbox allows you to enable [Neon Auth](/docs/auth/overview) as your authentication provider for the Data API. When enabled, Neon Auth manages sign-up, login, and account access, issuing the JWTs required for API requests.

If you prefer to use a different authentication provider (such as Auth0, Clerk, or Firebase Auth), leave this checkbox unchecked and configure your provider later. See [Custom authentication providers](/docs/data-api/custom-authentication-providers) for details.

<Admonition type="note" title="Authentication required">
All requests to the Data API require authentication with a valid JWT token.
</Admonition>

### 3. Configure schema access (optional)

The **Grant public schema access** checkbox automatically applies database permissions so the `authenticated` role can read and write to tables in the `public` schema.

<details>
<summary>View the GRANT statements applied</summary>

```sql
-- Schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- For existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- For future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES TO authenticated;

-- For sequences (for identity columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

</details>

Enable this checkbox unless you need to manage permissions manually. If you leave it unchecked, see [Access control](/docs/data-api/access-control) for details on granting permissions yourself.

### 4. Click Enable Data API

Click **Enable Data API** to activate the Data API. Once enabled, you'll see the Data API page.

![Data API enabled view](/docs/data-api/data-api-enabled.png)

On the **API** tab, you'll see:

- **API URL**: Your REST API endpoint for accessing your database
- **Refresh schema cache**: A button to update the Data API when you make schema changes
- **Security section**: Options to configure Neon Auth and enable Row-Level Security on your tables

<Admonition type="warning">
If you have tables without RLS enabled, you'll see a warning that authenticated users can view all rows in those tables. We'll show you how to add RLS in the next step.
</Admonition>

For advanced configuration options like custom authentication providers, exposed schemas, and CORS settings, see the **Settings** tab or refer to [Managing the Data API](/docs/data-api/manage).

Next, you'll create a table with **Row-Level Security (RLS)** policies to define which rows users can access.

## Create a table with RLS

The Data API interacts directly with your Postgres schema. Because the API is accessible over the internet, it's crucial to enforce security at the database level using PostgreSQL's **Row-Level Security (RLS)** features.

In this example, we'll create a `posts` table where users can read published posts and manage their own posts securely. **Choose the approach that matches how you manage your database schema:**

- **SQL**: Write SQL directly in the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or manage migrations manually. See our [PostgreSQL RLS tutorial](/postgresql/postgresql-administration/postgresql-row-level-security) for more on RLS fundamentals.
- **Drizzle (crudPolicy)**: A high-level helper that generates all four CRUD policies (select, insert, update, delete) in one declaration. Best for simple cases where read and modify permissions follow the same pattern.
- **Drizzle (pgPolicy)**: Define individual policies for each operation. Use this when you need different logic for different operations (e.g., time-limited updates, different rules for INSERT vs UPDATE).

For more on Drizzle RLS, see our [Drizzle RLS guide](/docs/guides/rls-drizzle).

<CodeTabs labels={["SQL", "Drizzle (crudPolicy)", "Drizzle (pgPolicy)"]}>

```sql
-- This script creates a posts table, enables RLS, and defines four policies:
-- one allows authenticated users to read published posts or their own posts,
-- and the other three let users insert, update, and delete only their own posts.

-- 1. Create the table
CREATE TABLE posts (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id text DEFAULT (auth.user_id()) NOT NULL,
  content text NOT NULL,
  is_published boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy: Users can see all published posts and their own posts
CREATE POLICY "Public read access" ON posts
  AS PERMISSIVE
  FOR SELECT TO authenticated
  USING (is_published OR (select auth.user_id() = "posts"."user_id"));

-- 4. Create Policy: Users can insert their own posts
CREATE POLICY "Users can insert their own posts" ON posts
  AS PERMISSIVE
  FOR INSERT TO "authenticated"
  WITH CHECK ((select auth.user_id() = "posts"."user_id"));

-- 5. Create Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  AS PERMISSIVE
  FOR UPDATE TO "authenticated"
  USING ((select auth.user_id() = "posts"."user_id"))
  WITH CHECK ((select auth.user_id() = "posts"."user_id"));

CREATE POLICY "Users can delete their own posts" ON posts
  AS PERMISSIVE
  FOR DELETE TO "authenticated"
  USING ((select auth.user_id() = "posts"."user_id"));
```

```typescript
// This schema defines the same posts table using Drizzle ORM. The crudPolicy helper
// generates all four RLS policies (select, insert, update, delete) in a single declaration:
// `read` controls who can view posts, and `modify` controls who can insert, update, or delete them.

import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Policy for authenticated users
    crudPolicy({
      role: authenticatedRole,
      read: sql`is_published OR (select auth.user_id() = ${table.userId})`, // Can read published posts or their own posts
      modify: authUid(table.userId), // Can only modify their own posts
    }),
  ]
);
```

```typescript
// This schema defines the same posts table using Drizzle ORM with individual pgPolicy
// declarations for each operation. This approach gives you fine-grained control when
// you need different logic for select, insert, update, and delete.

import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid } from 'drizzle-orm/neon';
import { bigint, boolean, pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Authenticated users
    pgPolicy('Allow authenticated users to read published posts and their own posts', {
      to: authenticatedRole,
      for: 'select',
      using: sql`is_published OR (select auth.user_id() = ${table.userId})`,
    }),
    pgPolicy('Allow authenticated users to insert their own posts', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: authUid(table.userId),
    }),
    pgPolicy('Allow authenticated users to update their own posts', {
      to: authenticatedRole,
      for: 'update',
      using: authUid(table.userId),
      withCheck: authUid(table.userId),
    }),
    pgPolicy('Allow authenticated users to delete their own posts', {
      to: authenticatedRole,
      for: 'delete',
      using: authUid(table.userId),
    }),
  ]
);
```

</CodeTabs>

<Admonition type="info" title="What is auth.user_id() and authUid()?">
`auth.user_id()` is a Data API helper that extracts the User ID from the JWT token for secure database permission enforcement. `authUid()` is a Drizzle ORM helper that simplifies using `auth.user_id()` in policies.
</Admonition>

## Refresh schema cache

The Data API caches your database schema for performance. When you modify your schema (adding tables, modifying columns, or changing structure, etc.), you need to refresh this cache for the changes to take effect.

To refresh the cache, go to the **Data API** page in the Neon Console and click **Refresh schema cache**.

![Data API refresh schema cache button](/docs/data-api/data_api_schema_refresh.png)

## Connect and Query

You can connect to the Data API using a client library or direct HTTP requests.

### Option 1: Using a client library

Install a client library and run your first query. Choose the option that matches your authentication provider:

<Tabs labels={["Neon Auth", "Other authentication provider"]}>

<TabItem>

Use [`@neondatabase/neon-js`](https://www.npmjs.com/package/@neondatabase/neon-js) if you're using Neon Auth. This library handles token management automatically.

**1. Install**

```bash
npm install @neondatabase/neon-js
```

**2. Usage**

```typescript shouldWrap
import { createClient } from '@neondatabase/neon-js';

// Initialize with Neon Auth
const client = createClient({
  auth: {
    url: process.env.NEON_AUTH_URL, // Your Neon Auth endpoint (from the Neon Console)
  },
  dataApi: {
    url: process.env.NEON_DATA_API_URL, // Your Data API endpoint (from the Neon Console)
  },
});

// Query - the JWT token is injected automatically when the user is signed in
const { data, error } = await client
  .from('posts')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });

console.log(data);
```

</TabItem>

<TabItem>

Use [`@neondatabase/postgrest-js`](https://www.npmjs.com/package/@neondatabase/postgrest-js) if you're using another authentication provider like [Auth0](https://auth0.com/), [Clerk](https://clerk.com/), or [Firebase Auth](https://firebase.google.com/products/auth).

**1. Install**

```bash
npm install @neondatabase/postgrest-js
```

**2. Usage**

Provide a function that retrieves the JWT token from your authentication system. This token is included in each request to enforce RLS policies.

```typescript shouldWrap
import { fetchWithToken, NeonPostgrestClient } from '@neondatabase/postgrest-js';

const getTokenFromAuthSystem = async (): Promise<string> => {
  // Retrieve the JWT token from your auth system
  return 'your-jwt-token';
};

// Initialize the client
const client = new NeonPostgrestClient({
  dataApiUrl: process.env.NEON_DATA_API_URL!, // Your Data API endpoint (from the Neon Console)
  options: {
    global: {
      fetch: fetchWithToken(getTokenFromAuthSystem),
    },
  },
});

// Query
const { data, error } = await client
  .from('posts')
  .select('*')
  .eq('is_published', true)
  .order('created_at', { ascending: false });

console.log(data);
```

</TabItem>

</Tabs>

> For detailed guidance on performing `INSERT`, `UPDATE`, `DELETE`, and advanced queries (filters, joins, stored procedures, etc.) in either case, refer to the [Neon Javascript SDK documentation](/docs/reference/javascript-sdk#insert).

### Option 2: Direct HTTP requests

Query the Data API directly using any HTTP client. Include the `Authorization` header with a valid JWT token from your authentication provider. The token must include a `sub` claim for RLS policies to work correctly.

**Where to get the JWT token:**

- **Neon Auth (manual testing)**: Use the Auth API reference UI (navigate to your Auth URL with `/reference` appended, e.g., `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/reference`) to sign in and get a token. See [Testing with Postman or cURL](#testing-with-postman-or-curl) below.
- **Neon Auth (programmatic)**: Retrieve the token using `client.auth.getSession()` from the `@neondatabase/neon-js` library. See [Get current session](/docs/reference/javascript-sdk#auth-getsession) for details.
- **Other providers**: Retrieve the token from your auth provider's SDK (e.g., `getAccessToken()` in Auth0, `getToken()` in Clerk).

**About the `sub` claim:**

For RLS policies to work correctly, the JWT token must include a `sub` (subject) claim, which contains the user's unique identifier. The Data API uses this claim to enforce [Row-Level Security](/docs/guides/neon-rls) policies via the `auth.user_id()` function. Most authentication providers include this claim by default.

**Example: SELECT (GET)**

This request queries the `posts` table for all published posts, ordered by most recent first:

```bash shouldWrap
curl -X GET 'https://your-data-api-endpoint/rest/v1/posts?is_published=eq.true&order=created_at.desc' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json'
```

**Example: INSERT (POST)**

This request inserts a new row into the `posts` table, setting the `content` column:

```bash shouldWrap
curl -X POST 'https://your-data-api-endpoint/rest/v1/posts' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"content": "Hello world"}'
```

> For UPDATE, DELETE, filtering, and other operations, see the [PostgREST documentation](https://postgrest.org/en/stable/references/api.html).

</Steps>

## Testing with Postman or cURL

If you're using Neon Auth and want to test the Data API without building an application first, you can use the Auth API reference UI to create test users and obtain JWT tokens.

<Admonition type="note" title="Neon Auth only">
This workflow applies when using Neon Auth as your authentication provider. If you're using a different provider, obtain JWT tokens through your provider's authentication flow.
</Admonition>

1. **Open the Auth API reference:** Navigate to your Auth URL with `/reference` appended (e.g., `https://ep-example.neonauth.us-east-1.aws.neon.tech/neondb/auth/reference`). This interactive UI lets you explore and test all auth endpoints. It's powered by [Better Auth's OpenAPI plugin](https://www.better-auth.com/docs/plugins/open-api#usage). You can find your **Auth URL** on the **Auth** page on the **Configuration** tab in the Neon Console.

2. **Create a test user:** In the API reference, call `POST /api/auth/sign-up/email` with a JSON body:

   ```json
   {
     "email": "test@example.com",
     "password": "your-password",
     "name": "Test User"
   }
   ```

3. **Or sign in with an existing user:** Call `POST /api/auth/sign-in/email` with:

   ```json
   {
     "email": "test@example.com",
     "password": "your-password"
   }
   ```

4. **Get the JWT token:** Call `GET /api/auth/get-session` and copy the JWT from the `Set-Auth-Jwt` response header.

5. **Query the Data API:** Use the JWT in your requests:
   ```bash
   curl -X GET 'https://your-data-api-endpoint/rest/v1/posts' \
     -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
     -H 'Content-Type: application/json'
   ```

<Admonition type="tip" title="Token expiration">
JWTs expire after approximately 15 minutes. If you receive a `"JWT token has expired"` error, sign in again to get a fresh token.
</Admonition>

## Query patterns

The Data API supports full CRUD operations and advanced queries. Here's a quick reference of the most common methods available in the [Neon TypeScript SDK](/docs/reference/javascript-sdk):

### CRUD operations

| Operation  | Method      | Example                                                         | SDK Reference                                   |
| ---------- | ----------- | --------------------------------------------------------------- | ----------------------------------------------- |
| **Select** | `.select()` | `client.from('posts').select('*')`                              | [select](/docs/reference/javascript-sdk#select) |
| **Insert** | `.insert()` | `client.from('posts').insert({ title: 'New post' })`            | [insert](/docs/reference/javascript-sdk#insert) |
| **Update** | `.update()` | `client.from('posts').update({ title: 'Updated' }).eq('id', 1)` | [update](/docs/reference/javascript-sdk#update) |
| **Delete** | `.delete()` | `client.from('posts').delete().eq('id', 1)`                     | [delete](/docs/reference/javascript-sdk#delete) |
| **RPC**    | `.rpc()`    | `client.rpc('function_name', { param: 'value' })`               | [rpc](/docs/reference/javascript-sdk#rpc)       |

### Filters

| Filter     | Description                      | Example                                |
| ---------- | -------------------------------- | -------------------------------------- |
| `.eq()`    | Equals                           | `.eq('status', 'published')`           |
| `.neq()`   | Not equals                       | `.neq('status', 'draft')`              |
| `.gt()`    | Greater than                     | `.gt('price', 100)`                    |
| `.lt()`    | Less than                        | `.lt('price', 50)`                     |
| `.gte()`   | Greater than or equal            | `.gte('quantity', 1)`                  |
| `.lte()`   | Less than or equal               | `.lte('quantity', 10)`                 |
| `.like()`  | Pattern match (case-sensitive)   | `.like('title', '%hello%')`            |
| `.ilike()` | Pattern match (case-insensitive) | `.ilike('title', '%hello%')`           |
| `.is()`    | Is null / not null               | `.is('deleted_at', null)`              |
| `.in()`    | Value in array                   | `.in('status', ['active', 'pending'])` |

### Modifiers

| Modifier    | Description         | Example                                      |
| ----------- | ------------------- | -------------------------------------------- |
| `.order()`  | Sort results        | `.order('created_at', { ascending: false })` |
| `.limit()`  | Limit rows returned | `.limit(10)`                                 |
| `.single()` | Return single row   | `.select('*').eq('id', 1).single()`          |

For the complete list of methods and detailed examples, see the [Neon Auth & Data API TypeScript SDKs](/docs/reference/javascript-sdk).

## Next steps

- [Build a note-taking app](/docs/data-api/demo) — Hands-on tutorial with Data API queries
- [Neon Auth & Data API TypeScript SDKs](/docs/reference/javascript-sdk) — All database methods: select, insert, update, delete, filters, and more
- [Generate TypeScript types](/docs/data-api/generate-types) — Get autocomplete for table names and columns
- [SQL to REST Converter](/docs/data-api/sql-to-rest) — Convert SQL queries to API calls
- [Row-Level Security with Neon](/docs/guides/row-level-security) — Secure your data at the database level
