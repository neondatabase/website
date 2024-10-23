---
title: Set up Clerk with Neon Authorize
subtitle: Integrate Clerk with Neon Authorize to secure your application at the database level
enableTableOfContents: true
---

<InfoBlock>
<DocsList title="Learn how to">
<p>Set up Clerk for Neon Authorize</p>
<p>Set up Postgres with RLS policies</p>
<p>Connect to the Neon Serverless driver</p>
<p>Run a sample authenticated query</p>
</DocsList>

<DocsList title="Clerk docs" theme="docs">
  <a href="https://clerk.com/docs/backend-requests/making/jwt-templates">Clerk JWT Templates</a>
  <a href="https://clerk.com/docs/backend-requests/resources/session-tokens">Session tokens</a>
</DocsList>

<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-neon-authorize">Clerk + Neon Authorize</a>
</DocsList>
</InfoBlock>

<ComingSoon/>

This guide shows the basics of using Clerk with Neon Authorize in a Next.js project, with the goal of moving authorization to the database level using Row-level Security (RLS).

## How it works

Clerk generates JSON Web Tokens (JWTs) upon user authentication, which are then passed to Neon Authorize. Neon validates the JWT and uses its auth metadata to enforce the Row-Level Security (RLS) policies that you define directly in Postgres, securing database queries based on the user's identity.

### Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech). Your Neon project comes with a ready-to-use Postgres database named `neondb`.
- A [Clerk](https://clerk.com/) account and application. Clerk provides a free plan that you can use to get started.
- A local development environment set up for running JavaScript applications, including [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/). These are required to run the Next.js application and manage dependencies.

## 1. Create a JWT Template and get your JWKS endpoint URL

<div style={{ display: 'flex', alignItems: 'center' }}>
  <div style={{ flex: '0 0 60%', paddingRight: '20px' }}>
In the Clerk Dashboard, go to **Configure > JWT Templates** and create a blank **New template**.

You can leave the claims field empty, as Clerk will include the necessary `sub` (subject) field as part of the default [session claims](https://clerk.com/docs/backend-requests/resources/session-tokens). This will include the `user_id` that we'll need for our Neon integration.

Copy the **JWKS Endpoint** URL.
  </div>
  <div style={{ flex: '0 0 40%', marginTop: '-20px' }}>
![JWT URL location in clerk](/docs/guides/clerk_jwks_url.png)
  </div>
</div>

## 2. Add Clerk as authorization provider in the Neon Console

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 60%', paddingRight: '20px' }}>
Once you have the JWKS URL, go to the **Neon Console** and add Clerk as an authentication provider under the **Authorize** page — paste your copied URL and the matching provider will be automatically recognized and selected.
  </div>
  <div style={{ flex: '0 0 40%', marginTop: '-20px' }}>
![Add Authentication Provider](/docs/guides/clerk_jwks_url_in_neon.png)
  </div>
</div>

At this point, you can use the **Get Started** setup steps in the side drawer to complete the setup — this guide is modelled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

## 3. Install the pg_session_jwt Extension

Neon Authorize uses the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension to handle authenticated sessions through JSON Web Tokens (JWTs). This extension allows secure transmission of authentication data from your application to Postgres, where you can enforce Row-Level Security (RLS) policies based on the user's identity.

When installed, the `pg_session_jwt` enables passwordless connections by using JWTs for user authentication. Two roles are create for you: `authenticated` and `anonymous`.

To install the extension in the `neondb` database, run:

```sql
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;
```

<Admonition type="note">
In a future update, setting up the `pg_session_jwt` extension and granting role privileges will be done automatically when adding a provider to your project.
</Admonition>

## 4. Set up Roles

Next, you can define the table-level permissions for these new roles. For most use cases of Neon Authorize, you should run the following commands in order to give the roles access to read and write to any table in your public schema:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO anonymous;
```

Later, you can define RLS policies that will restrict what your application's users can do with these roles.

## 5. Set up Row-Level Security

Now, let's add RLS policies to enforce authorization at the database level. While RLS allows for fine-grained access control, this guide focuses on securing actions based on user identiy. Below are examples of a simple **todos** schema and policies, implemented through SQL or Drizzle.

### Schema

<Tabs labels={["SQL","Drizzle"]}>

<TabItem>

```sql
-- schema for TODOs table
CREATE TABLE todos (
  id bigint generated by default as identity primary key,
  user_id text not null default (auth.user_id()),
  task text check (char_length(task) > 0),
  is_complete boolean default false,
  inserted_at timestamp not null
);
  
```

</TabItem>

<TabItem>

```typescript

import { InferSelectModel, sql } from 'drizzle-orm';
import { bigint, boolean, pgPolicy, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'bigint' })
      .primaryKey()
      .generatedByDefaultAsIdentity(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
    insertedAt: timestamp('inserted_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    p1: pgPolicy("create todos", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`(select auth.user_id() = user_id)`,
    }),

    p2: pgPolicy("view todos", {
      for: "select",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p3: pgPolicy("update todos", {
      for: "update",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p4: pgPolicy("delete todos", {
      for: "delete",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),
  }),
);

export type Todo = InferSelectModel<typeof todos>;

```

</TabItem>
</Tabs>

### Row-level security

<Tabs labels={["SQL","Drizzle"]}>

<TabItem>

```sql
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
import { pgPolicy, pgTable } from 'drizzle-orm/pg-core';

// full schema definition in drizzle-schema.ts
export const todos = pgTable(
  'todos',
  {...},
  (t) => ({
    p1: pgPolicy("create todos", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`(select auth.user_id() = user_id)`,
    }),

    p2: pgPolicy("view todos", {
      for: "select",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p3: pgPolicy("update todos", {
      for: "update",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),

    p4: pgPolicy("delete todos", {
      for: "delete",
      to: "authenticated",
      using: sql`(select auth.user_id() = user_id)`,
    }),
  }),
);
```

</TabItem>
</Tabs>

## 6. Install the Neon Serverless Driver

Neon’s Serverless Driver manages the connection between your application and the Neon Postgres database. It supports HTTP, WebSockets, and TCP connections. For Neon Authorize, the connection must be established over HTTP.

Install it using the following command:
```bash
npm install @neondatabase/serverless
```

To learn more about the driver, see [Neon Serverless Driver](/docs/serverless/serverless-driver).

## 7. Setup environment variables

Copy the `authenticated` role connection string into your `.env` file.

```bash
# Neon "authenticated" role connection string
DATABASE_AUTHENTICATED_URL='postgresql://authenticated@ep-bold-queen-w33bqbhq.eastus2.azure.neon.build/neondb?sslmode=require'
```

This connection string can also be retrieved from the Console dashboard.

## 8. Run your first authorized query

Run a query using the Neon Serverless Driver along with your application's access token. This will work seamlessly on both the client and server side.

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
