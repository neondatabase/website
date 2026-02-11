---
title: Use Neon Auth with Next.js (API methods)
subtitle: Build your own auth UI using SDK methods
summary: >-
  How to integrate Neon Auth into a Next.js project using SDK methods, including
  enabling authentication, installing the Neon SDK, and setting up environment
  variables.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.767Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

<Admonition type="note">
Upgrading from Neon Auth SDK v0.1? See the [migration guide](/docs/auth/migrate/from-auth-v0.1) for step-by-step instructions.
</Admonition>

This guide shows you how to integrate Neon Auth into a [Next.js](https://nextjs.org) (App Router) project using SDK methods directly. To use our pre-built UI components instead, see the [UI components guide](/docs/auth/quick-start/nextjs).

<TwoColumnLayout>

<TwoColumnLayout.Step title="Enable Auth in your Neon project">
<TwoColumnLayout.Block>

Enable Auth in your [Neon project](https://console.neon.tech) and copy your Auth URL from Configuration.

**Console path:** Project → Branch → Auth → Configuration

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install the Neon SDK">
<TwoColumnLayout.Block>

Install the Neon SDK into your Next.js app.

<details>
<summary>_If you don't have a Next.js project_</summary>
```bash
npx create-next-app@latest my-app --yes
cd my-app
```
</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm install @neondatabase/auth
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up environment variables">
<TwoColumnLayout.Block>

Create a `.env.local` file in your project root and add your Auth URL and a cookie secret:

<Admonition type="note">
Replace the Auth URL with your actual Auth URL from the Neon Console. Generate a secure cookie secret with `openssl rand -base64 32`.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label=".env.local">

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create auth server instance">
<TwoColumnLayout.Block>

Create a unified auth instance in `lib/auth/server.ts`. This single instance provides all server-side auth functionality:

- `.handler()` for API routes
- `.middleware()` for route protection
- `.getSession()` and all Better Auth server methods

See the [Next.js Server SDK reference](/docs/auth/reference/nextjs-server) for complete API documentation.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="lib/auth/server.ts">

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up auth API routes">
<TwoColumnLayout.Block>

Create an API route handler that proxies auth requests. All Neon Auth APIs will be routed through this handler. Create a route file inside `/api/auth/[...path]` directory:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="app/api/auth/[...path]/route.ts">

```typescript
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Add authentication middleware">
<TwoColumnLayout.Block>

The middleware ensures users are authenticated before accessing protected routes. Create `proxy.ts` file in your project root:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="proxy.ts">

```typescript
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/account/:path*',
  ],
};
```

</TwoColumnLayout.Block>
<TwoColumnLayout.Footer>
<Admonition type="note">
Your Next.js project is now fully configured to use Neon Auth. Now, lets proceed with setting up the auth clients.
</Admonition>
</TwoColumnLayout.Footer>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Configure the auth client">
<TwoColumnLayout.Block>

Create the auth client in `lib/auth/client.ts` for client-side auth operations (form submissions, hooks, etc.).

<Admonition type="note">
The server-side `auth` instance was already created in a previous step. The client is separate and handles browser-side auth operations.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="lib/auth/client.ts">

```tsx
'use client';

import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create Sign up form">
<TwoColumnLayout.Block>

Lets create a sign-up form and action in `app/auth/sign-up/page.tsx` and `app/auth/sign-up/actions.ts` files respectively using the auth instance we created in previous step

- To create user with email and password, we will use `auth.signUp.email()` with user name, email address, and password
- You can optionally add business logic before invoking the API, for example restrict signups to emails ending with `@my-company.com`

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

<Tabs labels={["Signup action", "Signup form"]}>
<TabItem>

Copy and paste following code in `app/auth/sign-up/actions.ts` file:

```ts
'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: "Email address must be provided." }
  }

  // Optionally restrict sign ups based on email address
  // if (!email.trim().endsWith("@my-company.com")) {
  //  return { error: 'Email must be from my-company.com' };
  // }

  const { error } = await auth.signUp.email({
    email,
    name: formData.get('name') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    return { error: error.message || 'Failed to create account' };
  }

  redirect('/');
}
```

</TabItem>
<TabItem>

Copy and paste following code in `app/auth/sign-up/page.tsx` file:

```tsx
'use client';

import { useActionState } from 'react';
import { signUpWithEmail } from './actions';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center bg-gray-900">

      <div className="w-sm">
        <h1 className="mt-10 text-center text-2xl/9 font-bold text-white">Create new account</h1>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="name" className="block text-sm font-medium text-gray-100">Name</label>
        <input id="name" name="name" type="text" required placeholder="John Doe"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10 focus:outline-indigo-500"
        />
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email address</label>
        <input id="email" name="email" type="email" required placeholder="john@my-company.com"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
        <input id="password" name="password" type="password" required placeholder="*****"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="flex w-sm justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400">
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
```

</TabItem>
</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create Sign in form">
<TwoColumnLayout.Block>

Lets create a sign-in form and action in `app/auth/sign-in/page.tsx` and `app/auth/sign-in/actions.ts` files respectively.

- To sign-in the user we will use `auth.signIn.email()` with user's email address and password.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Sign In">

<Tabs labels={["Sign-in action", "Sign-in form"]}>
<TabItem>

```ts
'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const { error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }

  redirect('/');
}
```

</TabItem>
<TabItem>

```tsx
'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <form action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center bg-gray-900">

      <div className="w-sm">
       <h1 className="mt-10 text-center text-2xl/9 font-bold text-white">Sign in to your account</h1>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="email" className="block text-sm font-medium text-gray-100">Email address</label>
        <input id="email" name="email" type="email" required placeholder="john@my-company.com"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      <div className='flex flex-col gap-1.5 w-sm'>
        <label htmlFor="password" className="block text-sm font-medium text-gray-100">Password</label>
        <input id="password" name="password" type="password" required placeholder="*****"
          className="block rounded-md w-full bg-white/5 px-2 py-1.5 placeholder:text-gray-500 text-white outline-1 outline-white/10  focus:outline-indigo-500"/>
      </div>

      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      <button type="submit" disabled={isPending}
        className="flex w-sm justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400">
        Sign in
      </button>
    </form>
  );
}
```

</TabItem>
</Tabs>

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create home page">
<TwoColumnLayout.Block>

In last step, lets create the home page and display authenticated user status:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="app/page.tsx">

```typescript
import { auth } from '@/lib/auth/server';
import Link from 'next/link';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
        <h1 className="mb-4 text-4xl">
          Logged in as <span className="font-bold underline">{session.user.name}</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
        <Link
          href="/auth/sign-up"
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-up
        </Link>
        <Link
          href="/auth/sign-in"
          className="inline-flex text-lg text-indigo-400 hover:underline"
        >
          Sign-in
        </Link>
      </div>
    </div>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Start your app">
<TwoColumnLayout.Block>

Start the development server:

Open your browser to [http://localhost:3000](http://localhost:3000) and test sign-up and sign-in.

<Admonition type="note" title="Safari users">
Safari blocks third-party cookies on non-HTTPS connections. Use `npm run dev -- --experimental-https` and open `https://localhost:3000` instead.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Terminal">

```bash
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## Available SDK methods

Both `authClient` and `auth` expose similar API methods. Use `authClient` for client components and `auth` for server components, server actions, and API routes.

- [authClient.signUp.email()](/docs/reference/javascript-sdk#auth-signup) / `auth.signUp.email()` - Create a new user account
- [authClient.signIn.email()](/docs/reference/javascript-sdk#auth-signinwithpassword) / `auth.signIn.email()` - Sign in with email and password
- [authClient.signOut()](/docs/reference/javascript-sdk#auth-signout) / `auth.signOut()` - Sign out the current user
- [authClient.getSession()](/docs/reference/javascript-sdk#auth-getsession) / `auth.getSession()` - Get the current session
- `authClient.updateUser()` / `auth.updateUser()` - Update user details

The `auth` instance also includes `.handler()` for API routes and `.middleware()` for route protection.

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Branching authentication](/docs/auth/branching-authentication)

<NeedHelp/>
