---
title: Use Neon Auth with Next.js (API methods)
subtitle: Build your own auth UI using SDK methods
enableTableOfContents: true
updatedOn: '2025-12-08T00:00:00.000Z'
layout: wide
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

This guide shows you how to integrate Neon Auth into a [Next.js](https://nextjs.org) (App Router) project using SDK methods directly. To use our pre-built UI components instead, see the [UI components guide](/docs/auth/quick-start/nextjs).

<TwoColumnLayout>

<TwoColumnStep title="Enable Auth in your Neon project">
  <LeftContent>

Enable Auth in your [Neon project](https://console.neon.tech) and copy your Auth URL from Configuration.

**Console path:** Project → Branch → Auth → Configuration

  </LeftContent>
  <RightImage label="Console">

![Neon Auth Base URL](/docs/auth/neon-auth-base-url.png)

  </RightImage>
</TwoColumnStep>

<TwoColumnStep title="Install the Neon SDK">
  <LeftContent>

Install the Neon SDK into your Next.js app.

<details>
<summary>_If you don't have a Next.js project_</summary>
```bash
npx create-next-app@latest my-app --yes
cd my-app
```
</details>

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm install @neondatabase/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up environment variables">
  <LeftContent>

Create a `.env.local` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

  </LeftContent>
  <RightCode label=".env.local">

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up your auth API routes">
  <LeftContent>

We need to mount the `authApiHandler` handler to the auth API route. All Neon Auth APIs will be routed through this handler. Create a route file inside `/api/auth/[...path]` directory and add the following code:

  </LeftContent>
  <RightCode label="app/api/auth/[...path]/route.ts">

```typescript
import { authApiHandler } from '@neondatabase/auth/next/server';

export const { GET, POST } = authApiHandler();
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Add neonAuthMiddleware()">
  <LeftContent>

The `neonAuthMiddleware()` ensures that user is authenticated before the request reaches your page components or API routes. Create `proxy.ts` file in your project root:

  </LeftContent>
  <RightCode label="proxy.ts">

```typescript
import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    "/account/:path*",
  ],
};
```

  </RightCode>
</TwoColumnStep>



<Admonition type="note">
Your Next.js project is now fully configured to use Neon Auth. Now, lets proceed with setting up the Auth UI Provider and wrap your layout with auth context. 
</Admonition>


<TwoColumnStep title="Configure the auth clients">
  <LeftContent>

**Client Components:**
  - The Auth UI components are client rendered and need access to the auth APIs. Lets first create the auth client in `lib/auth/client.ts` file then we pass it to `NeonAuthUIProvider`

**Server Components:** 
  - To use Auth APIs in server components and server actions, you can also create auth-server in `lib/auth/server.ts` file.

  </LeftContent>
  <RightCode>
<Tabs labels={["Auth Client", "Auth Server"]}>

<TabItem>

Copy and paste following code in `lib/auth/client.ts` file:

```tsx
'use client';

import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
```

  </TabItem>
  <TabItem>

Copy and paste following code in `lib/auth/server.ts` file:

```tsx
import { createAuthServer } from '@neondatabase/auth/next/server';

export const authServer = createAuthServer();
```

  </TabItem>
  </Tabs>
  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create Sign up form">
  <LeftContent>

Lets create a sign-up form and action in `app/auth/sign-up/page.tsx` and `app/auth/sign-up/actions.ts` files respectively using the auth server instance we created in previous step

  - To create user with email and password, we will use `authServer.signUp.email()` with user name, email address, and password
  - You can optionally add business logic before invoking the API, for example restrict signups to emails ending with `@my-company.com`

  </LeftContent>
  <RightCode>

  <Tabs labels={["Signup action", "Signup form"]}>
  <TabItem>
  
Copy and paste following code in `app/auth/sign-up/actions.ts` file:

```ts
'use server';

import { authServer } from '@/lib/auth/server';
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

  const { error } = await authServer.signUp.email({
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


  </RightCode>
</TwoColumnStep>


<TwoColumnStep title="Create Sign in form">
  <LeftContent>

Lets create a sign-in form and action in `app/auth/sign-in/page.tsx` and `app/auth/sign-in/actions.ts` files respectively.

  - To sign-in the user we will use `authServer.signIn.email()` with user's email address and password.

  </LeftContent>
  <RightCode label="Sign In">

  <Tabs labels={["Sign-in action", "Sign-in form"]}>
  <TabItem>
  
```ts
'use server';

import { authServer } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const { error } = await authServer.signIn.email({
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


  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Create home page">
  <LeftContent>

In last step, lets create the home page and display authenticated user status:

  </LeftContent>
  <RightCode label="app/page.tsx">

```typescript
import { authServer } from "@/lib/auth/server";
import Link from "next/link";

export default async function Home() {
  const { data } = await authServer.getSession();

  if (data && data.user) {
    return (
      <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
        <h1 className="mb-4 text-4xl">
          Logged in as <span className="font-bold underline">{data.user.name}</span>
        </h1>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 min-h-screen items-center justify-center bg-gray-900">
      <h1 className="mb-4 text-4xl font-bold">Not logged in</h1>
      <div className="flex item-center gap-2">
      <Link 
        href='/auth/sign-up' 
        className="inline-flex text-lg text-indigo-400 hover:underline">
          Sign-up
      </Link>
      <Link 
        href='/auth/sign-in' 
        className="inline-flex text-lg text-indigo-400 hover:underline">
          Sign-in
      </Link>
      </div>
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server:

Open your browser to [http://localhost:3000](http://localhost:3000) and test sign-up and sign-in.

<Admonition type="note" title="Safari users">
Safari blocks third-party cookies on non-HTTPS connections. Use `npm run dev -- --experimental-https` and open `https://localhost:3000` instead.
</Admonition>


  </LeftContent>
  <RightCode label="Terminal">

```bash
npm run dev
```

  </RightCode>
</TwoColumnStep>

</TwoColumnLayout>

## Available SDK methods

Both `authClient` and `authServer` expose similar API methods. If you would like to use auth APIs in client components, you can use `authClient`.

- [authClient.signUp.email()](/docs/reference/javascript-sdk#auth-signup) - Create a new user account
- [authClient.signIn.email()](/docs/reference/javascript-sdk#auth-signinwithpassword) - Sign in with email and password
- [authClient.signOut()](/docs/reference/javascript-sdk#auth-signout) - Sign out the current user
- [authClient.getSession()](/docs/reference/javascript-sdk#auth-getsession) - Get the current session
- `authServer.updateUser()` - To update user details

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Branching authentication](/docs/auth/branching-authentication)

<NeedHelp/>
