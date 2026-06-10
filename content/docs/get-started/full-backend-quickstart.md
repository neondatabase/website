---
title: Build a full backend with Next.js and Neon
subtitle: Connect Postgres with Drizzle, add managed authentication, and ship a typed server-side backend
summary: >-
  End-to-end Next.js App Router tutorial that wires Neon Postgres, Drizzle ORM,
  and Neon Auth into a working server-side backend. Choose this page when
  building a Next.js project that needs a type-safe Postgres data layer and
  managed email authentication without a third-party auth service. Walks through
  schema push with drizzle-kit, session-aware Server Components, route
  middleware, and deployment to Vercel, Netlify, or self-hosted Node.
enableTableOfContents: true
layout: wide
updatedOn: '2026-06-05T17:20:32.620Z'
---

## Before you start

You'll need [Node.js 20+](https://nodejs.org/) installed.

<TwoColumnLayout>

<TwoColumnLayout.Step title="Create a Neon project">
<TwoColumnLayout.Block>

If you don't have a Neon account, sign up at [console.neon.tech](https://console.neon.tech/signup).

Pick a path to create the project, then copy the **connection string**. You'll add it to your environment in step 4.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

<Tabs labels={["Console", "Neon CLI", "API"]}>

<TabItem>

In the Neon Console, click **New Project**, name it `my-backend`, and create it. From the project dashboard, click **Connect** and copy the connection string.

</TabItem>

<TabItem>

```bash filename="Terminal"
npx neonctl@latest auth
npx neonctl@latest projects create --name my-backend
```

The connection string appears in the output.

</TabItem>

<TabItem>

Create an [API key](https://console.neon.tech/app/settings/api-keys), export it, then create the project:

```bash filename="Terminal"
export NEON_API_KEY=neon_...

curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "my-backend"}}'
```

The connection string is in the response under `connection_uris[0].connection_uri`.

</TabItem>

</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Enable Neon Auth">
<TwoColumnLayout.Block>

<Tag label="beta" size="sm" /> Neon Auth with Better Auth is in beta. [Share feedback on Discord](https://discord.gg/92vNTzKDGp).

Enable Auth on your project's default branch and copy the **Auth URL**. You'll add it to your environment in step 4.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

<Tabs labels={["Console", "API"]}>

<TabItem>

In the project sidebar, go to **Auth** and click **Enable Auth**. On the **Configuration** tab, copy your **Auth URL**.

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TabItem>

<TabItem>

You'll need your project ID and default branch ID. If you used the API in step 1, the response contains both. Otherwise list projects to find them:

```bash filename="Terminal"
curl https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY"
```

Enable Auth on the default branch:

```bash filename="Terminal"
curl -X POST \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches/$BRANCH_ID/auth" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"auth_provider": "better_auth"}'
```

The Auth URL is in the response under `jwks_url` (strip the `/.well-known/jwks.json` suffix).

</TabItem>

</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Scaffold a Next.js app">
<TwoColumnLayout.Block>

Create a new Next.js project with TypeScript, Tailwind CSS, and the App Router. The `--yes` flag accepts the remaining defaults without prompting.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npx create-next-app@latest my-backend --typescript --tailwind --app --eslint --yes
cd my-backend
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install dependencies and add environment variables">
<TwoColumnLayout.Block>

Install three packages: `@neondatabase/neon-js` for auth, `drizzle-orm` for typed queries, and `@neondatabase/serverless` for the HTTP driver (works in Node, edge, and serverless runtimes). Add `drizzle-kit` as a dev dependency for the schema migration.

Then create `.env.local` with your connection string, Auth URL, and a generated cookie secret.

Generate the cookie secret with `openssl rand -base64 32`. It must be at least 32 characters.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm install @neondatabase/neon-js drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

```bash filename=".env.local"
DATABASE_URL=postgresql://...
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.c-7.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=replace-with-32-char-random-secret
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Define the Drizzle schema">
<TwoColumnLayout.Block>

Create a TypeScript schema for a `posts` table. Drizzle uses this for both the migration and your type-safe queries.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="lib/db/schema.ts"
import { bigint, boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const posts = pgTable('posts', {
  id: bigint('id', { mode: 'number' })
    .primaryKey()
    .generatedByDefaultAsIdentity(),
  userId: text('user_id').notNull(),
  content: text('content').notNull(),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

```typescript filename="drizzle.config.ts"
import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';

loadEnvConfig(process.cwd());

export default defineConfig({
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

`drizzle-kit` is a standalone CLI and doesn't read `.env.local` automatically. `loadEnvConfig` matches Next.js's env loading behavior so the migration step picks up the same `DATABASE_URL` as the app.

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Push the schema and seed sample data">
<TwoColumnLayout.Block>

`drizzle-kit push` creates the table directly from your schema. In production, you'd typically use `drizzle-kit generate` and `drizzle-kit migrate` for tracked migrations, but push is faster for a tutorial.

Then seed three sample posts in the [Neon Console SQL Editor](https://console.neon.tech) — two published and one draft, so step 9's `where(eq(posts.isPublished, true))` filter has something visible to do.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npx drizzle-kit push
```

Open your project in the Neon Console, go to **SQL Editor**, and run:

```sql
INSERT INTO posts (user_id, content, is_published) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Hello from Neon', true),
  ('00000000-0000-0000-0000-000000000000', 'Welcome to your new backend', true),
  ('00000000-0000-0000-0000-000000000000', 'This draft is hidden — flip is_published to true in the SQL editor to see it appear', false);
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Wire up auth">
<TwoColumnLayout.Block>

Add four files. The server instance handles auth on the server side. The client exposes auth methods to the browser. The API route proxies sign-up, sign-in, and OAuth callbacks. The middleware redirects unauthenticated users to the sign-in page.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="lib/auth/server.ts"
import { createNeonAuth } from '@neondatabase/neon-js/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

```typescript filename="lib/auth/client.ts"
'use client';

import { createAuthClient } from '@neondatabase/neon-js/auth/next';

export const authClient = createAuthClient();
```

```typescript filename="app/api/auth/[...path]/route.ts"
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

```typescript filename="proxy.ts"
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: ['/posts/:path*'],
};
```

<NextjsProxyNote/>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Build the sign-in and sign-up pages">
<TwoColumnLayout.Block>

Each page is a client form that posts to a server action. The action calls `auth.signUp.email()` or `auth.signIn.email()` on the server, then redirects to `/posts` on success or returns an error string for the form to display.

No layout or provider component is needed. The scaffold's default `app/layout.tsx` is all the wrapper you need.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```tsx filename="app/auth/sign-up/page.tsx"
'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from './actions';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form
      action={formAction}
      className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-900"
    >
      <h1 className="text-2xl font-bold text-white">Create new account</h1>

      <label className="flex w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-100">Name</span>
        <input name="name" type="text" required
          className="rounded-md bg-white/5 px-2 py-1.5 text-white outline-1 outline-white/10" />
      </label>
      <label className="flex w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-100">Email</span>
        <input name="email" type="email" required
          className="rounded-md bg-white/5 px-2 py-1.5 text-white outline-1 outline-white/10" />
      </label>
      <label className="flex w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-100">Password</span>
        <input name="password" type="password" required
          className="rounded-md bg-white/5 px-2 py-1.5 text-white outline-1 outline-white/10" />
      </label>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}
        className="w-sm rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400">
        {isPending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
```

```typescript filename="app/auth/sign-up/actions.ts"
'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const { error } = await auth.signUp.email({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message || 'Failed to create account' };

  redirect('/posts');
}
```

```tsx filename="app/auth/sign-in/page.tsx"
'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <form
      action={formAction}
      className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-900"
    >
      <h1 className="text-2xl font-bold text-white">Sign in to your account</h1>

      <label className="flex w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-100">Email</span>
        <input name="email" type="email" required
          className="rounded-md bg-white/5 px-2 py-1.5 text-white outline-1 outline-white/10" />
      </label>
      <label className="flex w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-100">Password</span>
        <input name="password" type="password" required
          className="rounded-md bg-white/5 px-2 py-1.5 text-white outline-1 outline-white/10" />
      </label>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <button type="submit" disabled={isPending}
        className="w-sm rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400">
        {isPending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
}
```

```typescript filename="app/auth/sign-in/actions.ts"
'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInWithEmail(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const { error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message || 'Failed to sign in' };

  redirect('/posts');
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Query Postgres from a Server Component">
<TwoColumnLayout.Block>

Create the Drizzle client and a protected `/posts` page. The page is a Server Component, so both the session lookup and the Drizzle query run on the server at request time. `auth.getSession()` reads the signed-in user from cookies, Drizzle returns typed query results, and `dynamic = 'force-dynamic'` keeps the data fresh on every request.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="lib/db/client.ts"
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

```tsx filename="app/posts/page.tsx"
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db/client';
import { posts } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function PostsPage() {
  const { data: session } = await auth.getSession();

  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt))
    .limit(10);

  return (
    <main className="p-8">
      <h1 className="mb-1 text-2xl font-bold">Published posts</h1>
      {session?.user && (
        <p className="mb-4 text-sm text-gray-600">
          Signed in as <span className="font-medium">{session.user.name}</span>
        </p>
      )}
      <ul className="space-y-2">
        {allPosts.map((post) => (
          <li key={post.id} className="rounded border p-3">
            {post.content}
          </li>
        ))}
      </ul>
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Run the app">
<TwoColumnLayout.Block>

Start the dev server, then open [http://localhost:3000/auth/sign-up](http://localhost:3000/auth/sign-up). Create a test user, and you'll be redirected to `/posts` where the two published posts appear above your signed-in name.

If you visit `/posts` without signing in, the middleware redirects you to `/auth/sign-in`.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## What you built

You now have a Next.js app where:

- Sign-up and sign-in are handled by Neon Auth via server actions that call `auth.signUp.email()` and `auth.signIn.email()`
- The `/posts` route is protected by middleware
- The signed-in user's name is read from cookies via `auth.getSession()` on the same page
- Published posts are queried server-side via Drizzle with full TypeScript types
- The application can be deployed to any Next.js App Router host that supports server actions, including Vercel, Netlify, and self-hosted Node

## Next steps

- **Write data with Server Actions** ([Drizzle insert reference](https://orm.drizzle.team/docs/insert)): wire up post creation through a server action that uses the auth session for `user_id`
- **Branch for previews**: [branching authentication](/docs/auth/branching-authentication) gives every preview environment its own user state
- **Optimize for the edge**: on Vercel or Cloudflare, configure [connection pooling](/docs/connect/connection-pooling) for production
- **Generated migrations**: switch from `drizzle-kit push` to [`drizzle-kit generate`](https://orm.drizzle.team/docs/migrations) for tracked schema changes

<NeedHelp/>
