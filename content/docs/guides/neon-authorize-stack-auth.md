---
title: Secure your data with Stack Auth and Neon Authorize
subtitle: Implement Row-level Security policies in Postgres using Stack Auth and Neon Authorize
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/stack-nextjs-neon-authorize">Stack Auth + Neon Authorize</a>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize-tutorial">Neon Authorize Tutorial</a>
  <a href="https://stackauth.com/docs/backend-requests/handling/manual-jwt">Manual JWT verification</a>
</DocsList>
</InfoBlock>

<ComingSoon/>

Use Stack Auth with Neon Authorize to add secure, database-level authorization to your application. This guide assumes you already have an application using Stack Auth for user authentication. It shows you how to integrate Stack Auth with Neon Authorize, then provides sample Row-level Security (RLS) policies to help you model your own application schema.

## How it works

Stack Auth handles user authentication by generating JSON Web Tokens (JWTs), which are securely passed to Neon Authorize. Neon Authorize validates these tokens and uses the embedded user identity metadata to enforce the [Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) policies that you define directly in Postgres, securing database queries based on that user identity.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Create your first project in **AWS**. [Azure](/docs/guides/neon-authorize#current-limitations) regions are not currently supported.
- A [Stack Auth](https://stackauth.com/) account and an existing application that uses Stack Auth for user authentication. Stack Auth offers a free plan to help you get started. 
  - **Note**: If you do not have a Stack Auth-based application, you will need to set one up. This includes adding the following keys to your `.env` file:
    ```bash
    NEXT_PUBLIC_STACK_PROJECT_ID=<id>
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<id>
    STACK_SECRET_SERVER_KEY=<id>

    # For the `neondb_owner` role.
    DATABASE_URL=postgresql://neondb_owner:<password>@ep-aged-heart-a4vhounp.us-east-1.aws.neon.tech/neondb?sslmode=require
    # For the `authenticated`, passwordless role.
    DATABASE_AUTHENTICATED_URL=postgresql://authenticated@<id>.us-east-1.aws.neon.tech/neondb?sslmode=require
    ```
  - For detailed guidance on creating a Stack Auth application, refer to the [Stack Auth documentation](https://stackauth.com/docs/getting-started).

- An existing application (for example, a **todos** app) where you can model your RLS policies on the samples in this guide. If you don't have an app, refer to our [demo](https://github.com/neondatabase-labs/stack-nextjs-neon-authorize) to see similar schema and policies in action.

## Integrate Stack Auth with Neon Authorize

In this first set of steps, we’ll integrate Stack Auth as an authorization provider in Neon. When these steps are complete, Stack Auth will start passing JWTs to your Neon database, which you can then use to create policies.

### 1. Get your Stack Auth JWKS URL

You can find your JWKS URL by constructing it based on your Stack Auth project ID. The format is:

```plaintext
https://api.stack-auth.com/api/v1/projects/{yourProjectId}/.well-known/jwks.json
```

Replace `{yourProjectId}` with your actual Stack Auth project ID. This URL structure is typically used for both local testing and production environments, but please refer to the official Stack Auth documentation for any specific guidelines or best practices.

### 2. Add Stack Auth as an authorization provider in the Neon Console

Once you have the JWKS URL, go to the **Neon Console** and add Stack Auth as an authentication provider under the **Authorize** page. Paste your copied URL and Stack Auth will be automatically recognized and selected.

![Add Authentication Provider](/docs/guides/stack_auth_jwks_url_in_neon.png)

At this point, you can use the **Get Started** setup steps from the Authorize page in Neon to complete the setup — this guide is modeled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

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

### 4. Set up Roles

Next, define the table-level permissions for these new roles. For most use cases of Neon Authorize, you should run the following commands in order to give the roles access to read and write to any table in your public schema:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO anonymous;
```

Later, you can define RLS policies that will restrict what your application's users can do with these roles.

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
DATABASE_AUTHENTICATED_URL='postgresql://authenticated@ep-bold-queen-w33bqbhq.eastus2.azure.neon.build/neondb?sslmode=require'
```

## Add RLS policies

At this point, Stack Auth is now fully integrated with Neon Authorize. JWTs are now passed securely to your Neon database. You can now start adding RLS policies to your schema and running authenticated queries from your application.

### 1. Add Row-Level Security policies

Below are examples of RLS policies for a **todos** table, designed to restrict access so that users can only create, view, update, or delete their own todos.

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

With RLS policies in place, you can now query the database using JWTs from Stack Auth, restricting access based on the user's identity. Here are examples of how you could run authenticated queries from both the backend and the frontend of our sample **todos** application.

<Tabs labels={["server-component.tsx","client-component.tsx",".env"]}>

<TabItem>

```tsx shouldWrap
'use server';

import { neon } from '@neondatabase/serverless';
import { auth } from '@stackauth/nextjs/server';

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
  import { useAuth } from '@stackauth/nextjs';
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
