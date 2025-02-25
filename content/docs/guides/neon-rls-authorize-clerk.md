---
title: Secure your data with Clerk and Neon RLS Authorize
subtitle: Implement Row-level Security policies in Postgres using Clerk and Neon RLS Authorize
enableTableOfContents: true
updatedOn: '2025-02-03T20:41:57.326Z'
redirectFrom:
  - /docs/guides/neon-authorize-clerk
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-neon-rls-authorize">Clerk + Neon RLSAuthorize</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-rls-authorize-tutorial">Neon RLS Authorize Tutorial</a>
  <a href="https://clerk.com/docs/backend-requests/handling/manual-jwt">Manual JWT verification</a>
  <a href="/docs/guides/neon-rls-authorize-drizzle">Simplify RLS with Drizzle</a>
</DocsList>
</InfoBlock>

Use Clerk with Neon RLS Authorize to add secure, database-level authorization to your application. This guide assumes you already have an application using Clerk for user authentication. It shows you how to integrate Clerk with Neon RLS Authorize, then provides sample Row-level Security (RLS) policies to help you model your own application schema.

## How it works

Clerk handles user authentication by generating JSON Web Tokens (JWTs), which are securely passed to Neon RLS Authorize. Neon RLS Authorize validates these tokens and uses the embedded user identity metadata to enforce the [Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) policies that you define directly in Postgres, securing database queries based on that user identity. This authorization flow is made possible using the Postgres extension [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt), which you'll install as part of this guide.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech).
- A [Clerk](https://clerk.com/) account and an existing application (e.g., a **todos** app) that uses Clerk for user authentication. If you don't have an app, check our [demo](https://github.com/neondatabase-labs/clerk-nextjs-neon-rls-authorize) for similar schema and policies in action.

## Integrate Clerk with Neon RLS Authorize

In this first set of steps, we'll integrate Clerk as an authorization provider in Neon. When these steps are complete, Clerk will start passing JWTs to your Neon database, which you can then use to create policies.

### 1. Get your Clerk JWKS URL

For a basic integration, the default JWT claims from Clerk, including the `user_id`, are all you need for Neon RLS Authorize. Use the following JWKS URL format:

```bash shouldWrap
https://{YOUR_CLERK_DOMAIN}/.well-known/jwks.json
```

You can find your JWKS URL in the Clerk Dashboard under: **Configure → Developers → API Keys**. Click **Show JWT Public Key** and copy the JWKS URL for later.

**Neon JWT Template**

For advanced JWT configuration, such as adding claims or setting token lifespans, use the dedicated Neon template under: **Configure > JWT Templates**

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/clerk_neon_jwt_template.png" alt="Neon-specific template option in Clerk templates" style={{ width: '40%', maxWidth: '600px', height: 'auto' }} />
</div>

### 2. Add Clerk as an authorization provider in the Neon Console

Once you have the JWKS URL, go to the **Neon Console**, navigate to **Settings** > **RLS Authorize**, and add Clerk as an authentication provider. Paste your copied URL and Clerk will be automatically recognized and selected.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/clerk_jwks_url_in_neon.png" alt="Add Authentication Provider" style={{ width: '60%', maxWidth: '600px', height: 'auto' }} />
</div>

At this point, you can use the **Get Started** setup steps from RLS Authorize in Neon to complete the setup — this guide is modeled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

### 3. Install the pg_session_jwt extension in your database

Neon RLS Authorize uses the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension to handle authenticated sessions through JSON Web Tokens (JWTs). This extension allows secure transmission of authentication data from your application to Postgres, where you can enforce Row-Level Security (RLS) policies based on the user's identity.

To install the extension in the `neondb` database, run:

```sql shouldWrap
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;
```

### 4. Set up Postgres roles

The integration creates the `authenticated` and `anonymous` roles for you. Let's define table-level permissions for these roles. To allow both roles to read and write to tables in your public schema, run:

```sql
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

Neon's Serverless Driver manages the connection between your application and the Neon Postgres database. For Neon RLS Authorize, you must use HTTP. While it is technically possible to access the HTTP API without using our driver, we recommend using the driver for best performance. The driver also supports WebSockets and TCP connections, so make sure you use the HTTP method when working with Neon RLS Authorize.

Install it using the following command:

```bash shouldWrap
npm install @neondatabase/serverless
```

To learn more about the driver, see [Neon Serverless Driver](/docs/serverless/serverless-driver).

### 6. Set up environment variables

Here is an example of setting up administrative and authenticated database connections in your `.env` file. Copy the connection strings for both the `neondb_owner` and `authenticated` roles. You can find them by clicking **Connect** on the Neon **Project Dashboard**, or using the Neon CLI:

```bash shouldWrap
neon connection-string --role-name neondb_owner
neon connection-string --role-name authenticated
```

Add these to your `.env` file.

```bash shouldWrap
# Database owner connection string
DATABASE_URL='<DB_OWNER_CONNECTION_STRING>'

# Neon "authenticated" role connection string
DATABASE_AUTHENTICATED_URL='<AUTHENTICATED_CONNECTION_STRING>'
```

The `DATABASE_URL` is intended for admin tasks and can run any query, while the `DATABASE_AUTHENTICATED_URL` should be used for connections from authorized users, where you pass the required authorization token. You can see an example in [Run your first authorized query](#2-run-your-first-authorized-query) below.

## Add RLS policies

Now that you've integrated Clerk with Neon RLS Authorize, you can securely pass JWTs to your Neon database. Let's start looking at how to add RLS policies to your schema and how you can execute authenticated queries from your application.

### 1. Add Row-Level Security policies

Here are examples of implementing RLS policies for a **todos** table – the Drizzle example leverages the simplified `crudPolicy` function, while the SQL example demonstrates the use of individual RLS policies.

<Tabs labels={["Drizzle","SQL"]}>

<TabItem>

```typescript
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
  task text,
  is_complete boolean default false,
  inserted_at timestamp not null
);

-- 1st enable row level security for your table
alter table todos enable row level security;

-- 2nd create policies for your table
create policy "Individuals can create todos." on todos for
  insert with check (auth.user_id() = user_id);

create policy "Individuals can view their own todos." on todos for
  select using (auth.user_id() = user_id);

create policy "Individuals can update their own todos." on todos for
  update using (auth.user_id() = user_id);

create policy "Individuals can delete their own todos." on todos for
  delete using (auth.user_id() = user_id);
```

</TabItem>

</Tabs>

The `crudPolicy` function simplifies policy creation by generating all necessary CRUD policies with a single declaration.

### 2. Run your first authorized query

With Row-Level Security (RLS) policies in place, you can securely query the database using JWTs from Clerk, restricting access based on each user's identity. Here are examples of running authenticated queries from both the backend and frontend of our sample **todos** application. Highlighted lines in the code samples emphasize key actions related to authentication and querying.

<Tabs labels={["server-component.tsx","client-component.tsx",".env"]}>

<TabItem>

```tsx shouldWrap
'use server';

import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';

export async function TodoList() {
  const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
    authToken: async () => {
      const token = await auth().getToken(); // [!code highlight]
      if (!token) {
        throw new Error('No token');
      }
      return token;
    },
  });

  // WHERE filter is optional because of RLS.
  // But we send it anyway for performance reasons.
  const todos = await sql('select * from todos where user_id = auth.user_id()'); // [!code highlight]

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
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const getDb = (token: string) =>
    neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
        authToken: token, // [!code highlight]
    });

export function TodoList() {
    const { getToken } = useAuth();
    const [todos, setTodos] = useState<Array<Todo>>();

    useEffect(() => {
        async function loadTodos() {
            const authToken = await getToken(); // [!code highlight]

            if (!authToken) {
                return;
            }

            const sql = getDb(authToken);

            // WHERE filter is optional because of RLS.
            // But we send it anyway for performance reasons.
            const todosResponse = await sql('select * from todos where user_id = auth.user_id()'); // [!code highlight]

            setTodos(todosResponse as Array<Todo>);
        }

        loadTodos();
    }, [getToken]);

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
