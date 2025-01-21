---
title: Secure your data with WorkOS and Neon Authorize
subtitle: Implement Row-level Security policies in Postgres using WorkOS and Neon Authorize
enableTableOfContents: true
updatedOn: '2025-01-02T00:00:00.000Z'
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/workos-drizzle-sveltekit-neon-authorize">WorkOS + Neon Authorize</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize-tutorial">Neon Authorize Tutorial</a>
  <a href="/docs/guides/neon-authorize-drizzle">Simplify RLS with Drizzle</a>
</DocsList>
</InfoBlock>

Use WorkOS with Neon Authorize to add secure, database-level authorization to your application. This guide assumes you already have an application using WorkOS for user authentication. It shows you how to integrate WorkOS with Neon Authorize, then provides sample Row-level Security (RLS) policies to help you model your own application schema.

## How it works

WorkOS handles user authentication by generating JSON Web Tokens (JWTs), which are securely passed to Neon Authorize. Neon Authorize validates these tokens and uses the embedded user identity metadata to enforce the [Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) policies that you define directly in Postgres, securing database queries based on that user identity. This authorization flow is made possible using the Postgres extension [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt), which you'll install as part of this guide.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. Sign up at [Neon](https://neon.tech) if you don't have one.
- A [WorkOS](https://www.workos.com) Workspace with an existing application (e.g., a **todos** app) that uses WorkOS for user authentication.

## Integrate WorkOS with Neon Authorize

In this first set of steps, we’ll integrate WorkOS as an authorization provider in Neon. When these steps are complete, WorkOS will start passing JWTs to your Neon database, which you can then use to create policies.

### 1. Get your WorkOS JWKS URL

When integrating WorkOS with Neon, you'll need to provide the JWKS (JSON Web Key Set) URL. This allows your database to validate the JWT tokens and extract the user_id for use in RLS policies.

The WorkOS JWKS URL follows this format:

```
https://api.workos.com/sso/jwks/{YOUR_CLIENT_ID}
```

You can locate your WorkOS Client Id by navigating to the **Overview** page in the WorkOS dashboard.

![WorkOS Overview Page](/docs/guides/workos_overview_page.png)

Replace `{YOUR_CLIENT_ID}` with your WorkOS URL. For example, if your Client Id is `client_12345`, your JWKS URL would be:

```
https://api.workos.com/sso/jwks/client_12345
```

### 2. Add WorkOS as an authorization provider in the Neon Console

Once you have the JWKS URL, go to the **Neon Console** and add WorkOS as an authentication provider under the **Authorize** page. Paste your copied URL into the **Json Web Key Set (JWKS) URL** field.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/workos_jwks_url_in_neon.png" alt="Add Authentication Provider" style={{ width: '60%', maxWidth: '600px', height: 'auto' }} />
</div>

At this point, you can use the **Get Started** setup steps from the Authorize page in Neon to complete the setup — this guide is modeled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

### 3. Install the pg_session_jwt extension in your database

Neon Authorize uses the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension to handle authenticated sessions through JSON Web Tokens (JWTs). This extension allows secure transmission of authentication data from your application to Postgres, where you can enforce Row-Level Security (RLS) policies based on the user's identity.

To install the extension in the `neondb` database, run:

```sql
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;
```

### 4. Set up Postgres roles

The integration creates the `authenticated` and `anonymous` roles for you. Let's define table-level permissions for these roles. To allow both roles to read and write to tables in your public schema, run:

```sql shouldWrap
-- For existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to anonymous;

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

- **Authenticated role**: This role is intended for users who are logged in. Your application should send the authorization token when connecting using this role.
- **Anonymous role**: This role is intended for users who are not logged in. It should allow limited access, such as reading public content (e.g., blog posts) without authentication.

### 5. Install the Neon Serverless Driver

Neon’s Serverless Driver manages the connection between your application and the Neon Postgres database. For Neon Authorize, you must use HTTP. While it is technically possible to access the HTTP API without using our driver, we recommend using the driver for best performance. The driver also supports WebSockets and TCP connections, so make sure you use the HTTP method when working with Neon Authorize.

Install it using the following command:

```bash
npm install @neondatabase/serverless
```

To learn more about the driver, see [Neon Serverless Driver](/docs/serverless/serverless-driver).

### 6. Set up environment variables

Here is an example of setting up administrative and authenticated database connections in your `.env` file. Copy the connection strings for both the `neondb_owner` and `authenticated` roles. You can find them from **Connection Details** in the Neon Console, or using the Neon CLI:

```bash
neonctl connection-string --role-name neondb_owner
neonctl connection-string --role-name authenticated
```

Add these to your `.env` file.

```bash shouldWrap
# Database owner connection string
DATABASE_URL='<DB_OWNER_CONNECTION_STRING>'

# Neon "authenticated" role connection string
DATABASE_AUTHENTICATED_URL='<AUTHENTICATED_CONNECTION_STRING>'
```

The `DATABASE_URL` is intended for admin tasks and can run any query while the `DATABASE_AUTHENTICATED_URL` should be used for connections from authorized users, where you pass the required authorization token. You can see an example in [Run your first authorized query](#2-run-your-first-authorized-query) below.

## Add RLS policies

Now that you’ve integrated WorkOS with Neon Authorize, you can securely pass JWTs to your Neon database. Let's start looking at how to add RLS policies to your schema and how you can execute authenticated queries from your application.

### 1. Add Row-Level Security policies

Here are examples of implementing RLS policies for a **todos** table – the Drizzle example leverages the simplified `crudPolicy` function, while the SQL example demonstrates the use of individual RLS policies.

<Tabs labels={["Drizzle","SQL"]}>

<TabItem>

```typescript shouldWrap
import { InferSelectModel, sql } from 'drizzle-orm';
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon';

// schema for TODOs table
export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
    insertedAt: timestamp('inserted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  // Create RLS policy for the table
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ]
);

export type Todo = InferSelectModel<typeof todos>;
```

</TabItem>

<TabItem>

```sql shouldWrap
-- schema for TODOs table
CREATE TABLE todos (
  id bigint generated by default as identity primary key,
  user_id text not null default (auth.user_id()),
  task text check (char_length(task) > 0),
  is_complete boolean default false,
  inserted_at timestamptz not null default now()
);

-- 1st enable row level security for your table
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 2nd create policies for your table
CREATE POLICY "Individuals can create todos." ON todos FOR INSERT
TO authenticated
WITH CHECK ((select auth.user_id()) = user_id);

CREATE POLICY "Individuals can view their own todos." ON todos FOR SELECT
TO authenticated
USING ((select auth.user_id()) = user_id);

CREATE POLICY "Individuals can update their own todos." ON todos FOR UPDATE
TO authenticated
USING ((select auth.user_id()) = user_id)
WITH CHECK ((select auth.user_id()) = user_id);

CREATE POLICY "Individuals can delete their own todos." ON todos FOR DELETE
TO authenticated
USING ((select auth.user_id()) = user_id);
```

</TabItem>
</Tabs>

The `crudPolicy` function simplifies policy creation by generating all necessary CRUD policies with a single declaration.

### 2. Run your first authorized query

With RLS policies in place, you can now query the database using JWTs from WorkOS, restricting access based on the user's identity. Here are examples of how you could run authenticated queries from the backend of our sample **todos** application. Highlighted lines in the code samples emphasize key actions related to authentication and querying.

<Tabs labels={["server-component.tsx", "client-component.tsx" ,".env"]}>

<TabItem>

```typescript shouldWrap
'use server';

import { neon } from '@neondatabase/serverless';
import { withAuth } from '@workos-inc/authkit-nextjs';

export default async function TodoList() {
    const { user, accessToken } = await withAuth({ ensureSignedIn: true }); // [!code highlight]
     if (!user) {
        throw new Error('No user');
    }

    const jwt = accessToken;

    const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
        authToken: async () => {
            if (!jwt) {
                throw new Error('No JWT token available');
            }
            return jwt; // [!code highlight]
        },
    });

    // WHERE filter is optional because of RLS.
    // But we send it anyway for performance reasons.
    const todos = await
        sql('SELECT * FROM todos WHERE user_id = auth.user_id()'); // [!code highlight]

    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>{todo.task}</li>
            ))}
        </ul>
    );
}
```

</TabItem>

<TabItem>

```typescript shouldWrap
'use client';

import type { Todo } from '@/app/schema';
import { neon } from '@neondatabase/serverless';
import { useAuth } from '@workos-inc/authkit-nextjs/components';
import { useEffect, useState } from 'react';

const getDb = (token: string) =>
    neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
        authToken: token, // [!code highlight]
    });

export default function TodoList() {
    const [todos, setTodos] = useState<Array<Todo>>();
    const { accessToken } = useAuth({ ensureSignedIn: true });

    useEffect(() => {
        async function loadTodos() {
            if (!accessToken) {
                return;
            }

            const sql = getDb(accessToken);

            // WHERE filter is optional because of RLS.
            // But we send it anyway for performance reasons.
            const todosResponse = await
                sql('select * from todos where user_id = auth.user_id()'); // [!code highlight]

            setTodos(todosResponse as Array<Todo>);
        }

        loadTodos();
    }, [accessToken]);

    return (
        <ul>
            {todos?.map((todo) => (
                <li key={todo.id}>
                    {todo.task}
                </li>
            ))}
        </ul>
    );
}
```

</TabItem>

<TabItem>

```bash shouldWrap
# Used for database migrations
DATABASE_URL='<DB_OWNER_CONNECTION_STRING>'

# Used for server-side fetching
DATABASE_AUTHENTICATED_URL='<AUTHENTICATED_CONNECTION_STRING>'

# Used for client-side fetching
NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL='<AUTHENTICATED_CONNECTION_STRING>'
```

</TabItem>
</Tabs>
