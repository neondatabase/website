---
title: Setup Clerk with Neon Authorize
subtitle: Integrate Clerk with Neon Authorize to secure your application at the database level
enableTableOfContents: true
isDraft: true
---

👷UNDER CONSTRUCTION👷: Don't review yet

<InfoBlock>
<DocsList title="What you will learn on this page:">
<p>Set up JWT handoff from Clerk to Neon Authorize</p>
<p>Implement Row-Level Security (RLS) in Postgres</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="https://clerk.com/docs/backend-requests/making/jwt-templates">Clerk JWT Templates</a>
  <a href="https://clerk.com/docs/backend-requests/resources/session-tokens">Session tokens</a>
  <a href="https://github.com/neondatabase/pg_session_jwt">pg_session_jwt extension</a>
</DocsList>

<DocsList title="Sample project" theme="repo">
  <a href="https://github.com/neondatabase-labs/clerk-nextjs-frontend-neon-authorize">Clerk + Neon Authorize (frontend sql)</a>
</DocsList>
</InfoBlock>

<ComingSoon/>

This guide shows how to use Clerk with Neon Authorize to move authorization to the database level.

## How it works

Clerk generates JSON Web Tokens (JWTs) upon user authentication, which are then passed to Neon Authorize. Neon uses the metadata within these JWTs to enforce the Row-Level Security (RLS) policies that you define directly in Postgres, securing database queries based on the user's identity.

In this guide, you'll set up Clerk for user authentication, pass JWTs to Neon Authorize, and secure your queries with RLS policies.

### Prerequisites

To follow along with this guide, you will need:

- A Neon account. If you do not have one, sign up at [Neon](https://neon.tech) and create a new project.
- A [Clerk](https://clerk.com/) account for user management. Clerk provides a free plan that you can use to get started.
- A local development environment set up for running JavaScript applications, including [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/). These are required to run the Next.js application and manage dependencies.

## 1. Create a JWT Template and get your JWKS endpoint URL

Before creating a JWT Template, make sure you have a project set up in Clerk. Once your project is ready, follow these steps to create a Clerk Template and copy the endpoint URL:

1. In the Clerk Dashboard, go to **Configure > JWT Templates**.
2. Click on **New template**.
3. Leave the claims field empty, as Clerk will include the necessary `sub` (subject) field as part of the default [session claims](https://clerk.com/docs/backend-requests/resources/session-tokens). This will include the `user_id` that we'll need for our Neon integration.

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 60%', paddingRight: '20px' }}>
Next, find and copy the **JWKS Endpoint** URL. This URL allows the Neon proxy to fetch the necessary public keys to validate the JWTs, enabling secure enforcement of Row-Level Security (RLS) policies within your database.
  </div>
  <div style={{ flex: '0 0 40%', marginTop: '-20px' }}>
![JWT URL location in clerk](/docs/guides/clerk_jwks_url.png)
  </div>
</div>

## 2. Add the Provider in the Neon Console

<div style={{ display: 'flex', alignItems: 'top' }}>
  <div style={{ flex: '0 0 60%', paddingRight: '20px' }}>
Once you have the JWKS URL, go to the **Neon Console** and add Clerk as an authentication provider under the **Authorize** page — paste your copied URL and the matching provider will be automatically recognized and selected.
  </div>
  <div style={{ flex: '0 0 40%', marginTop: '-20px' }}>
![Add Authentication Provider](/docs/guides/clerk_jwks_url_in_neon.png)
  </div>
</div>

This step ensures that Neon recognizes the JWTs passed by Clerk for enforcing access control policies through the Neon proxy, which uses these JWTs to validate user identity and enforce RLS policies in Postgres.

At this point, you can use the **Get Started** setup steps in the side drawer to complete the setup — this guide is modelled on those steps. Or feel free to keep following along in this guide, where we'll give you a bit more context.

## 3. Install the pg_session_jwt Extension

Neon Authorize relies on the [pg_session_jwt](https://github.com/neondatabase/pg_session_jwt) extension to handle JSON Web Tokens (JWTs) at the database level. This extension allows you to securely pass authentication information from your application to the database, enabling Postgres to enforce access policies based on the user's identity.

When you install the `pg_session_jwt` extension, Neon will automatically create new roles such as `authenticated` and `anonymous` to handle different levels of database access. These new roles enable passwordless connections to simplify managing access control for your application.

To install the extension in the `neondb` database, run:

```sql
CREATE EXTENSION IF NOT EXISTS pg_session_jwt;
```

<Admonition type="note">
In a future update, setting up the `pg_session_jwt` extension and granting role privileges will be done automatically when adding a provider to your project.
</Admonition>

## 4. Setup Roles

Grant privileges to the roles in the `neondb` database:

```sql
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES IN SCHEMA public TO anonymous;
```

## 5. Setup Row-Level Security

The first step into Neon Authorize is setting up Row-Level Security (RLS) policies by hooking into Neon's injected auth metadata.

Start by adding these policies through SQL or Drizzle to your database:

### SQL

#### row-level-security.sql

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

## 6. Install the Neon Serverless Driver

Neon's Serverless Driver makes it convenient to manage access control between your database requests and your Clerk users.

To integrate your application with Neon Authorize, install the driver into your project:

```bash
npm install @neondatabase/serverless
```

To learn more about the driver, check out the [GitHub Repo](https://github.com/neondatabase/serverless).

Add this URL to your environment variables:

````bash
# Clerk JWT Discovery URL
CLERK_JWT_DISCOVERY_URL='https://your-clerk-domain/.well-known/jwks.json'
```bash
# Clerk JWT Discovery URL
CLERK_JWT_DISCOVERY_URL='https://your-clerk-domain/.well-known/jwks.json'
````

To securely pass JWTs from Clerk to Neon, you need the JWT Discovery URL. You can find this in the Clerk Dashboard under **Settings > API Keys**.

Add this URL to your environment variables:

```bash
# Clerk JWT Discovery URL
CLERK_JWT_DISCOVERY_URL='https://your-clerk-domain/.well-known/jwks.json'
```

## 7. Setup environment variables

Copy the `authenticated` role connection string into your `.env` file.

```bash
# Neon "authenticated" role connection string
DATABASE_AUTHENTICATED_URL='postgresql://authenticated@ep-bold-queen-w33bqbhq.eastus2.azure.neon.build/neondb?sslmode=require'
```

This connection string can also be retrieved from the Console dashboard.

## 8. Run your first authorized query

Run a query using the Neon Serverless Driver along with your application's access token. This will work seamlessly on both the client and server side.

### Next.js

#### server-component.tsx

```tsx
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
