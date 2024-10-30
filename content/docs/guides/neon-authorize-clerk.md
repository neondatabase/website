---
title: Secure your data with Clerk and Neon Authorize
subtitle: Implement Row-level Security policies in Postgres using Clerk and Neon
  Authorize
enableTableOfContents: true
updatedOn: '2024-10-30T15:45:40.101Z'
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize">Clerk + Neon Authorize</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize-tutorial">Neon Authorize Tutorial</a>
  <a href="https://clerk.com/docs/backend-requests/handling/manual-jwt">Manual JWT verification</a>
</DocsList>
</InfoBlock>

Use Clerk with Neon Authorize to add secure, database-level authorization to your application. This guide assumes you already have an application using Clerk for user authentication. It shows you how to integrate Clerk with Neon Authorize, then provides sample Row-level Security (RLS) policies to help you model your own application schema.

## How it works

Clerk handles user authentication by generating JSON Web Tokens (JWTs), which are securely passed to Neon Authorize. Neon Authorize validates these tokens and uses the embedded user identity metadata to enforce the [Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) policies that you define directly in Postgres, securing database queries based on that user identity.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech).
- A [Clerk](https://clerk.com/) account and an existing application (e.g., a **todos** app) that uses Clerk for user authentication. If you don't have an app, check our [demo](https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize) for similar schema and policies in action.

## Integrate Clerk with Neon Authorize

In this first set of steps, we’ll integrate Clerk as an authorization provider in Neon. When these steps are complete, Clerk will start passing JWTs to your Neon database, which you can then use to create policies.

### 1. Get your Clerk JWKS URL

For a basic integration, the default JWT claims from Clerk, including the `user_id`, are all you need for Neon Authorize. Use the following JWKS URL format:

```bash
https://{yourClerkDomain}/.well-known/jwks.json
```

You can find your JWKS URL in the Clerk Dashboard under: **Configure → Developers → API Keys**. Click **Show JWT Public Key** and copy the JWKS URL for later.

**Neon JWT Template**: For advanced JWT configuration, such as adding claims or setting token lifespans, use the dedicated Neon template under: **Configure > JWT Templates**

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/clerk_neon_jwt_template.png" alt="Neon-specific template option in Clerk templates" style={{ width: '40%', maxWidth: '600px', height: 'auto' }} />
</div>

### 2. Add Clerk as an authorization provider in the Neon Console

Once you have the JWKS URL, go to the **Neon Console** and add Clerk as an authentication provider under the **Authorize** page. Paste your copied URL and Clerk will be automatically recognized and selected.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/clerk_jwks_url_in_neon.png" alt="Add Authentication Provider" style={{ width: '60%', maxWidth: '600px', height: 'auto' }} />
</div>

At this point, you can use the **Get Started** setup steps from the Authorize page in Neon to complete the setup — this guide is modelled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

### 3. Install the pg_session_jwt extension in your database

Neon Authorize uses the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension to handle authenticated sessions through JSON Web Tokens (JWTs). This extension allows secure transmission of authentication data from your application to Postgres, where you can enforce Row-Level Security (RLS) policies based on the user's identity.

When installed, the `pg_session_jwt` enables passwordless connections by using JWTs for user authentication. Two roles are created for you: `authenticated` and `anonymous`.

To install the extension in the `neondb` database, run:

```sql
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;
```

<Admonition type="note">
In a future update, setting up the `pg_session_jwt` extension and granting role privileges will be done automatically when you add an authentication provider to your Neon project.
</Admonition>

### 4. Set up Postgres roles

The integration creates the `authenticated` and `anonymous` roles for you. Let's define table-level permissions for these roles. To allow both roles to read and write to tables in your public schema, run:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;
```

- **Authenticated role**: This role is intended for users who are logged in, where Clerk will send and can send JWTs, allowing them to create, update, and delete their own records.
  
- **Anonymous role**: This role is intended for users who are not logged in. It allows limited access, such as reading public content (e.g., blog posts) without authentication.

When you define Row-Level Security (RLS) policies later, you'll focus on the authenticated role to restrict what users can do with their own data.

### 5. Install the Neon Serverless Driver

Neon’s Serverless Driver manages the connection between your application and the Neon Postgres database. It supports HTTP, WebSockets, and TCP connections. For Neon Authorize, the connection must be established over HTTP. For HTTP, we recommend using this driver.

Install it using the following command:

```bash
npm install @neondatabase/serverless
```

To learn more about the driver, see [Neon Serverless Driver](/docs/serverless/serverless-driver).

### 6. Set up environment variables

Copy the `authenticated` role connection string into your `.env` file. You can find it from **Connection Details** in the Neon Console, or using the Neon CLI:

```bash
neonctl connection-string --role-name authenticated
```

Add this to your `.env` file.

```bash shouldWrap
# Neon "authenticated" role connection string
DATABASE_AUTHENTICATED_URL='postgresql://authenticated@random-host-12345.eastus2.azure.neon.build/random-db?sslmode=require'
```

Your application will use this connection string to establish a connection to the Neon database. Here’s an example of how you might use it in your application:

```typescript
import { neon } from '@neondatabase/serverless';

// Establish a connection to the Neon database using the authenticated URL
const sql = neon(process.env.DATABASE_AUTHENTICATED_URL, { authToken: myAuthProvider.getJWT() });

// Execute a query to select all todos for the logged-in user
await sql(`select * from todos`);
```

In this example, the application connects to the Neon database using the `DATABASE_AUTHENTICATED_URL` and passes the JWT obtained from the authentication provider. This allows the app to execute authorized queries, ensuring that the user can only access their own data.

<Admonition type="note">
This guide focuses on the `authenticated` role, but we also granted the `anonymous` role similar CRUD access to your database tables. Depending on your application, you might use both roles. For instance, in a **blog application**, the `anonymous` role could allow users to read articles without logging in, while the `authenticated` role lets users create or edit their own posts. The [demo repositories](/guides/neon-authorize#sample-applications) mostly showcase the `authenticated` role, but you can adapt your setup to include the `anonymous` role as needed.
</Admonition>

## Add RLS policies

At this point, Clerk is now fully integrated with Neon Authorize. JWTs are now passed securely to your Neon database. You can now start adding RLS policies to your schema and running authenticated queries from your application.

### 1. Add Row-Level Security policies

Here are some examples of RLS policies for a **todos** table, designed to restrict access so that users can only create, view, update, or delete their own todos.

<Tabs labels={["SQL","Drizzle"]}>

<TabItem>

```sql
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

<TabItem>

```typescript
import { InferSelectModel, sql } from 'drizzle-orm';
import { bigint, boolean, pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
  // Create policies for your table
  (t) => ({
    p1: pgPolicy('create todos', {
      for: 'insert',
      to: 'authenticated',
      withCheck: sql`(select auth.user_id() = user_id)`,
    }),

    p2: pgPolicy('view todos', {
      for: 'select',
      to: 'authenticated',
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p3: pgPolicy('update todos', {
      for: 'update',
      to: 'authenticated',
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p4: pgPolicy('delete todos', {
      for: 'delete',
      to: 'authenticated',
      using: sql`(select auth.user_id() = user_id)`,
    }),
  })
);

export type Todo = InferSelectModel<typeof todos>;
```

</TabItem>
</Tabs>

### 2. Run your first authorized query

With RLS policies in place, you can now query the database using JWTs from Clerk, restricting access based on the user's identity. Here are examples of how you could run authenticated queries from both the backend and the frontend of our sample **todos** application.

<Tabs labels={["server-component.tsx","client-component.tsx",".env"]}>

<TabItem>

```tsx shouldWrap
'use server';

import { neon } from '@neondatabase/serverless';
import { auth } from '@clerk/nextjs/server';

export async function TodoList() {
  const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
    authToken: async () => {
      const token = await auth().getToken();
      if (!token) {
        throw new Error('No token');
      }
      return token;
    },
  });

  // WHERE filter is optional because of RLS.
  // But we send it anyway for performance reasons.
  const todos = await sql('select * from todos where user_id = auth.user_id()');

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
          authToken: token,
      });

  export function TodoList() {
      const { getToken } = useAuth();
      const [todos, setTodos] = useState<Array<Todo>>();

      useEffect(() => {
          async function loadTodos() {
              const authToken = await getToken();

              if (!authToken) {
                  return;
              }

              const sql = getDb(authToken);

              // WHERE filter is optional because of RLS.
              // But we send it anyway for performance reasons.
              const todosResponse = await
                  sql('select * from todos where user_id = auth.user_id()');

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
# used for server side fetching
DATABASE_AUTHENTICATED_URL='postgresql://authenticated@ep-mute-night-123456.eastus2.azure.neon.build/neondb?sslmode=require'

# used for client side fetching
NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL='postgresql://authenticated@ep-mute-night-123456.eastus2.azure.neon.build/neondb?sslmode=require'
```

</TabItem>
</Tabs>
