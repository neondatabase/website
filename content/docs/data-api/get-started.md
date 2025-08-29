---
title: Getting started with Neon Data API
description: >-
  Learn how to use the Neon Data API, a ready-to-use REST API built on top of
  your Neon database
enableTableOfContents: true
updatedOn: '2025-08-22T19:04:58.896Z'
tag: beta
---

<FeatureBetaProps feature_name="Neon Data API" />

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Neon Auth</a>
    <a href="/docs/data-api/demo">Building a note-taking app</a>
  </DocsList>
  <DocsList title="Demo app" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-data-api-neon-auth">Neon Data API demo note-taking app</a>
  </DocsList>
</InfoBlock>

The Neon Data API, powered by [PostgREST](https://docs.postgrest.org/en/v13/), offers a ready-to-use REST API for your Neon database. You can interact with any table, view, or function using standard HTTP verbs (`GET`, `POST`, `PATCH`, `DELETE`). To simplify querying, use client libraries like [`postgrest-js`](https://github.com/supabase/postgrest-js), [`postgrest-py`](https://github.com/supabase-community/postgrest-py), or [`postgrest-go`](https://github.com/supabase-community/postgrest-go):

```javascript shouldWrap
const { data } = await client.from('posts').select('*');
```

> When using the Data API, it is essential to set up RLS policies so that you can safely expose your databases to clients such as web apps. Make sure that all of your tables have RLS policies, and that you have carefully reviewed each policy.

<Admonition type="info" title="A note on Neon RLS">
You might notice another feature in Neon called **Neon RLS**. Please be aware that it's a different method for client-side querying and **is not compatible with the Data API**.
</Admonition>

<Steps>
## Enabling the Data API

Enable the Data API at the **branch** level for a single database.

To get started, open the **Data API** page from the project sidebar and click **Enable**.

![Data API page with enable button](/docs/data-api/data_api_sidebar.png)

By default, we install Neon Auth as your **Authentication provider**. We recommend using Neon Auth for a seamless experience, but you can also select **Other provider** if you manage your own JWTs, or skip this step to configure authentication later.

Once enabled, you'll see your **REST API Endpoint** — this is your base URL for API requests, with a copy-to-clipboard control.

![Data API enabled view with REST API Endpoint](/docs/data-api/data-api-enabled.png)

_Always secure your data before using the Data API in production._

### About activation times and schema changes

- After enabling the Data API, it may take a minute for your endpoints to become available. Be aware of that.
- If you change your database schema, you'll need to tell the Data API to refresh its cache. You can do this by reloading the schema from the SQL Editor:

  ```sql
  NOTIFY pgrst, 'reload schema'
  ```

## Authentication

Once enabled, the **Working with the Data API** section shows your current security status and next steps. If you skipped the auth provider selection, you'll also see an option to add an authentication provider.

![configuration section of Data API](/docs/data-api/data_api_config.png)

The security model consists of two parts:

### Neon Auth (default)

[Neon Auth](/docs/neon-auth/overview) manages user authentication, generating JWT tokens for secure API requests. If you accepted the default during setup, Neon Auth is already configured and you'll see the JWKS URL in the Authentication providers section.

**What you need to do**:

- Add Neon Auth keys to your app's environment variables. See [Get your Neon Auth keys](/docs/neon-auth/quick-start/nextjs#add-neon-auth-to-a-project).
- Include JWT tokens in Data API requests.
- **Recommended**: Use the Neon Auth SDK for user sign-in/sign-up. See [Neon Auth SDKs](/docs/neon-auth/sdk/nextjs/overview). There are SDKs for Next.js and React.

> You can start using the Data API immediately without authentication, but make sure you set up auth and RLS before going to production.

To make sure your application works correctly with both authenticated and anonymous users, run the following SQL statements to grant the right permissions to the `authenticated` and `anonymous` roles. This setup lets you control what **logged-in** users (authenticated) and **users who are **not logged in** (anonymous) can do.

<Admonition type="important">
These `GRANT` statements only give table privileges to the `authenticated` and `anonymous` roles. You still need to set up Row-Level Security (RLS) policies for each table to control exactly what actions each role can perform. Match these policies to your application's requirements.
</Admonition>

```sql
-- For existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  TO authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  TO anonymous;

-- For future tables
ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO authenticated;

ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO anonymous;

-- Grant USAGE on "public" schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anonymous;
```

- **Authenticated role**: Intended for users who are logged in. Your application should send the authorization token when connecting using this role.
- **Anonymous role**: Intended for users who are not logged in. This role should have limited access, such as reading public content, and should not be used for sensitive operations.

Make sure to review your RLS policies to ensure that only the appropriate data is accessible to each role.

### Row-Level Security (RLS)

RLS controls row access in tables. **Neon does not auto-enable RLS**; enable it manually per table.

```sql
-- Enable RLS on your table
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Create a policy (example: users can only access their own data)
CREATE POLICY "user_can_access_own_data" ON your_table
FOR ALL USING (auth.user_id() = user_id);
```

We recommend using [Drizzle ORM](/docs/guides/rls-drizzle) to help simplify writing RLS policies for the Data API.

<Admonition type="info" title="About auth.user_id()">
The `auth.user_id()` function extracts the user's ID from the JSON Web Token (JWT) issued by [Neon Auth](/docs/guides/neon-auth). The Data API validates this token, making the user's ID available to your RLS policies for enforcing per-user access.

For guidance on writing RLS policies, see our [PostgreSQL RLS tutorial](/postgresql/postgresql-administration/postgresql-row-level-security) for the basics, or our recommended [Drizzle RLS guide](/docs/guides/rls-drizzle) for a simpler approach.
</Admonition>

## Using the Data API

By default, all tables in your database are accessible via the API with `SELECT` permissions granted to **unauthenticated requests**. This lets you directly interact with the API without requiring additional authorization headers.

> **Warning:** This means your data is **publicly accessible** until you enable Row-Level Security (RLS). Again, enable RLS on _all_ your tables before using the Data API in production.

### Example of creating a table and querying it via the Data API

This example shows how to set up RLS policies on a sample `notes` table—using either plain SQL or Drizzle ORM—to control who can read or modify data:

- **Public read access:** Anyone, including anonymous users, can view posts.
- **Restricted modifications:** Only authenticated users can create, update, or delete posts and only for posts they own.

With these policies, users can read all content, but they can only modify their own rows.

> Use Drizzle ORM to streamline the creation of RLS policies. Drizzle helps reduce boilerplate and makes your access control logic easier to maintain as your tables evolve.

<CodeTabs labels={["SQL", "Drizzle (crudPolicy)", "Drizzle (pgPolicy)"]}>

```sql shouldWrap
CREATE TABLE "posts" (
	"id" bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
	"userId" text DEFAULT (auth.user_id()) NOT NULL,
	"content" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL
);

-- Enable RLS and create policy
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous users to read any post" ON "posts"
AS PERMISSIVE FOR SELECT TO "anonymous"
USING (true);

CREATE POLICY "Deny anonymous users from inserting posts" ON "posts"
AS PERMISSIVE FOR INSERT TO "anonymous"
WITH CHECK (false);

CREATE POLICY "Deny anonymous users from updating posts" ON "posts"
AS PERMISSIVE FOR UPDATE TO "anonymous"
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny anonymous users from deleting posts" ON "posts"
AS PERMISSIVE FOR DELETE TO "anonymous"
USING (false);

CREATE POLICY "Allow authenticated users to read any post" ON "posts"
AS PERMISSIVE FOR SELECT TO "authenticated"
USING (true);

CREATE POLICY "Allow authenticated users to insert their own posts" ON "posts"
AS PERMISSIVE FOR INSERT TO "authenticated"
WITH CHECK ((select auth.user_id() = "posts"."userId"));

CREATE POLICY "Allow authenticated users to update their own posts" ON "posts"
AS PERMISSIVE FOR UPDATE TO "authenticated"
USING ((select auth.user_id() = "posts"."userId"))
WITH CHECK ((select auth.user_id() = "posts"."userId"));

CREATE POLICY "Allow authenticated users to delete their own posts" ON "posts"
AS PERMISSIVE FOR DELETE TO "authenticated"
USING ((select auth.user_id() = "posts"."userId"));
```

```typescript
import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid, anonymousRole } from 'drizzle-orm/neon';
import { bigint, boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Public read access
    crudPolicy({
      role: anonymousRole,
      read: true, // Anyone can read
      modify: false, // No one can modify anonymously
    }),
    // Policy for authenticated users
    crudPolicy({
      role: authenticatedRole,
      read: true, // Can also read all posts
      modify: authUid(table.userId), // Can only modify their own posts
    }),
  ]
);
```

```typescript
import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid, anonymousRole } from 'drizzle-orm/neon';
import { bigint, boolean, pgPolicy, pgTable, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Anonymous users
    pgPolicy('Allow anonymous users to read any post', {
      to: anonymousRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('Deny anonymous users from inserting posts', {
      to: anonymousRole,
      for: 'insert',
      withCheck: sql`false`,
    }),
    pgPolicy('Deny anonymous users from updating posts', {
      to: anonymousRole,
      for: 'update',
      withCheck: sql`false`,
      using: sql`false`,
    }),
    pgPolicy('Deny anonymous users from deleting posts', {
      to: anonymousRole,
      for: 'delete',
      using: sql`false`,
    }),

    // Authenticated users
    pgPolicy('Allow authenticated users to read any post', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
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

With the `posts` table and its RLS policies in place, you can now securely query and modify posts using the Data API. These policies ensure that only authorized users can create, update, or delete their own posts, while anyone can read public content as intended.

<Admonition type="important" title="Schema changes">
If you make changes to your database schema, you must notify the PostgREST server to reload the schema so your updates are recognized by the Data API. To do this, run the following SQL command:

```sql
NOTIFY pgrst, 'reload schema';
```

This ensures the Data API reflects your latest schema changes.
</Admonition>

#### Insert example posts

```sql
INSERT INTO posts ("userId", "content", "published") VALUES
  ('user1', 'Hello world!', true),
  ('user2', 'This is a test post.', true);
```

#### Querying with Curl

- **Without JWT (unauthenticated request):**

  > Replace `<YOUR_NEON_DATA_API_URL>` with your actual Neon Data API endpoint.

  In this example, we query the `posts` table without providing an authentication token. Because Row-Level Security (RLS) is enabled and allows anonymous users to read posts, the response will include all published posts.

  ```bash shouldWrap
  curl --location --request GET '<YOUR_NEON_DATA_API_URL>/posts' \
    --header 'Accept: application/json'
  ```

  **Response:**

  ```json
  [
    { "id": 1, "userId": "user1", "content": "Hello world!", "published": true },
    { "id": 2, "userId": "user2", "content": "This is a test post.", "published": true }
  ]
  ```

- **With JWT (authenticated request):**

  > Replace `<jwt>` with your actual JWT token. Refer to your authentication provider’s documentation for instructions on obtaining this token, look for terms like "session token," "JWT," or "auth token".

  ```bash shouldWrap
  curl --location --request GET '<YOUR_NEON_DATA_API_URL>/posts' \
    --header 'Accept: application/json' \
    --header 'Authorization: Bearer <jwt>'
  ```

  **Response:**

  The response will be same as the unauthenticated request as the RLS policies for viewing posts are the same for both authenticated and unauthenticated users.

  **Insert a post using JWT:**

  ```bash
  curl --location --request POST '<YOUR_NEON_DATA_API_URL>/posts' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer <jwt>' \
    --data '{
      "userId": "user1",
      "content": "This is a new post.",
      "published": true
    }'
  ```

  For example here is an example of inserting a post using a real JWT:

  ```bash
  curl --location 'https://app-polished-grass-38985127.dpl.myneon.app/posts' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJFUzI1NiIsImtpZCI6IjlkRlBBdzJ5RTlEZiJ9.eyJzdWIiOiJkMTAwM2I2Yi03NTBiLTRhOTAtYTA4Ny0yZTIzOGYxOGNmNmUiLCJicmFuY2hJZCI6Im1haW4iLCJyZWZyZXNoVG9rZW5JZCI6IjI2ZDA3YzEwLThkZTItNDY4OC1hYzc4LTFmMzUyZTQ0ZDE1OCIsInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiaXNzIjoiaHR0cHM6Ly9hcGkuc3RhY2stYXV0aC5jb20vYXBpL3YxL3Byb2plY3RzL2ZhMzQyNTU3LWEzN2QtNDZkNy05OWE3LWZlODM2ODUxNTQ2YSIsImlhdCI6MTc1NjI3OTUzOSwiYXVkIjoiZmEzNDI1NTctYTM3ZC00NmQ3LTk5YTctZmU4MzY4NTE1NDZhIiwiZXhwIjoxNzU2MjgzMTM5fQ.uVRRzrGSoymphH3Q5VHscDYsA1iBigHIo9TLO38IVG0ObD-6s2-NtKQrqlU_UF_5DLJTNgpq3nHHokf0qcCfXg' \
    --data '{
        "userId": "d1003b6b-750b-4a90-a087-2e238f18cf6e",
        "content": "This is a new post.",
        "published": true
    }'
  ```

  If the post is created successfully, you will receive a `201 Created` response with an empty response body.

  If you make the same request without including an `Authorization` header, the API will return a `401 Unauthorized` error.

  ```json
  {
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"posts\""
  }
  ```

## Querying with PostgREST

The Neon Data API is powered by **PostgREST**, so it uses standard PostgREST query and data manipulation formats. For a more developer-friendly experience, you can use wrapper libraries like [postgrest-js](https://github.com/supabase/postgrest-js), which provide an ORM-like interface for interacting with your data.

When making requests, be sure to replace `<YOUR_NEON_DATA_API_URL>` with your actual Neon Data API endpoint. For authenticated requests, include a valid JWT token in the `Authorization` header, as provided by your authentication provider.

Use this `accessToken` as the Bearer token in your API requests.

```javascript shouldWrap
import { PostgrestClient } from '@supabase/postgrest-js';

// https://github.com/supabase/postgrest-js/blob/master/src/PostgrestClient.ts#L41
const client = new PostgrestClient('<YOUR_NEON_DATA_API_URL>', {
  headers: {
    Authorization: 'Bearer <jwt>', // Include this header for authenticated requests
    // omit it for anonymous access if permitted by your RLS policies
  },
});

const { data } = await client.from('posts').select('*').eq('userId', '<user_id>');

console.table(data);
```

> For a complete example of how to configure the Bearer token with Neon Auth, see the [postgrest.ts](https://github.com/neondatabase-labs/neon-data-api-neon-auth/blob/main/src/lib/postgrest.ts) file from our demo app.

## Try the demo app

To see a complete, working example of an application built with the Data API, Neon Auth, and RLS, check out our demo note-taking app.

- **[Live Demo](https://neon-data-api-neon-auth.vercel.app/)**
- **[GitHub Repository](https://github.com/neondatabase-labs/neon-data-api-neon-auth)**

</Steps>

## What's Next?

- Faster cold starts (we're working on it)
