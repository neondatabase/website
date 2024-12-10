---
title: Secure Your Data with Neon Authorize and Firebase or GCP Identity Platform
subtitle: Implement Row-Level Security in Postgres using Firebase or GCP Identity Platform
enableTableOfContents: true
updatedOn: '2024-12-03T10:00:00.000Z'
---

<InfoBlock>
<DocsList title="What You'll Learn">
  <p>Firebase/GCP Identity Platform integration</p>
  <p>JWT authentication setup</p>
  <p>Row-Level Security policies</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/neon-authorize-tutorial">Neon Authorize Tutorial</a>
  <a href="https://firebase.google.com/docs/auth">Firebase Authentication documentation</a>
  <a href="https://cloud.google.com/identity-platform/docs/sign-in-user-email">GCP Identity Platform Quickstart</a>
</DocsList>
</InfoBlock>

Use Firebase or Google Cloud Identity Platform with Neon Authorize to add secure, database-level authorization to your application.

This guide assumes you already have an application using Firebase or GCP Identity Platform for user authentication. It shows you how to integrate with Neon Authorize, then provides sample Row-level Security (RLS) policies to help you model your own application schema.

## How it works

Firebase and Google Cloud Platform Identity share the same underlying authentication infrastructure, but focus on different use cases: Firebase for mobile and web application developers, and GCP Identity Platform for enterprise-level identity management (leveraging Firebase in its implementation).

Both services generate JSON Web Tokens (JWTs) for user authentication, which are passed to Neon Authorize. Unlike some other authentication providers that issue a dedicated JWKS URL per project, Firebase and GCP Identity Platform use a common JWKS URL and rely on the Project ID in the JWT's Audience claim to identify specific projects.

When you make a database request, Neon Authorize validates these JWTs and uses the embedded user identity metadata to enforce [Row-Level Security](https://neon.tech/postgresql/postgresql-administration/postgresql-row-level-security) (RLS) policies in Postgres, securing database queries based on user identity. This flow is enabled by the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension.

## Prerequisites

To follow along with this guide, you will need:

- A Neon account. Sign up at [Neon](https://neon.tech) if you don't have one.
- A [Firebase](https://firebase.google.com) or [GCP Identity Platform](https://cloud.google.com/security/products/identity-platform) project with Authentication enabled:
  - [Set up Firebase Authentication](https://firebase.google.com/docs/auth)
  - [Set up Identity Platform](https://cloud.google.com/identity-platform/docs/sign-in-user-email)

## Integrate Firebase/GCP Identity Platform with Neon Authorize

In this first set of steps, we'll integrate Firebase/GCP Identity Platform as an authorization provider in Neon. When these steps are complete, your authentication service (whether Firebase or GCP Identity Platform) will start passing JWTs to your Neon database, which you can then use to create policies.

### 1. Get the JWKS URL and Project ID

You'll need two pieces of information:

1. **JWKS URL** - This is the same for all projects:

   ```plaintext
   https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
   ```

2. **Project ID** - This serves as your JWT Audience value:

   - Go to the [Firebase Console](https://console.firebase.google.com)
   - Navigate to **Project settings** > **General** > **Project ID**

   <Admonition type="note" title="Note">
   Every GCP Identity Platform project automatically creates a corresponding Firebase project, which is why we use the Firebase Console to get the Project ID.
   </Admonition>

   <div style={{ display: 'flex', justifyContent: 'center'}}>
     <img src="/docs/guides/firebase_project_id.png" alt="Firebase Project Id" style={{ width: '100%', maxWidth: '900px', height: 'auto' }} />
   </div>

### 2. Add Firebase/GCP Identity Platform as an authorization provider in the Neon Console

Once you have the JWKS URL, go to the **Neon Console** and add the authentication provider under the **Authorize** page. Paste your copied URL and click **Set Up**.

<div style={{ display: 'flex', justifyContent: 'center'}}>
  <img src="/docs/guides/firebase_jwks_url_in_neon.png" alt="Add Authentication Provider" style={{ width: '60%', maxWidth: '600px', height: 'auto' }} />
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

Now that you’ve integrated Descope with Neon Authorize, you can securely pass JWTs to your Neon database. Let's start looking at how to add RLS policies to your schema and how you can execute authenticated queries from your application.

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

With RLS policies in place, you can now query the database using JWTs from your authentication provider, restricting access based on the user's identity. Here's how to run authenticated queries from both the backend and the frontend of your application using authentication tokens. Highlighted lines in the code samples emphasize key actions related to authentication and querying.

<Tabs labels={["server-component.tsx","client-component.tsx",".env"]}>

<TabItem>

```typescript
'use server';

import { neon } from '@neondatabase/serverless';
import { getUserInfo } from '@/lib/auth'

export default async function TodoList() {
  const userInfo = await getUserInfo(); // [!code highlight]
  if (!userInfo) {
    throw new Error('No user info available');
  }

  const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
    authToken: async () => {
      const jwt = userInfo.token; // [!code highlight]
      if (!jwt) {
        throw new Error('No JWT token available');
      }
      return jwt;
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

```typescript
'use client';

import type { Todo } from '@/app/schema';
import { neon } from '@neondatabase/serverless';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

const getDb = (token: string) =>
  neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
    authToken: token, // [!code highlight]
  });

export function TodoList() {
  const auth = getAuth();
  const [todos, setTodos] = useState<Array<Todo>>();

  useEffect(() => {
    async function loadTodos() {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const idToken = await user.getIdToken(); // [!code highlight]
      const sql = getDb(idToken);

      const todosResponse = await
        sql('SELECT * FROM todos WHERE user_id = auth.user_id()'); // [!code highlight]
      setTodos(todosResponse as Array<Todo>);
    }

    loadTodos();
  }, [auth.currentUser]);

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
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
