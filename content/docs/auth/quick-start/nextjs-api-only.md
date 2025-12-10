---
title: Use Neon Auth with Next.js (API methods)
subtitle: Build your own auth UI using SDK methods
enableTableOfContents: true
updatedOn: '2025-12-08T00:00:00.000Z'
layout: wide
---

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
npm install @neondatabase/neon-js
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

<TwoColumnStep title="Configure the auth client">
  <LeftContent>

Create a `lib/auth/client.ts` file to initialize the auth client:

  </LeftContent>
  <RightCode label="lib/auth/client.ts">

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth/next';

export const authClient = createAuthClient();
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Set up the API route">
  <LeftContent>

Create an API route to handle authentication requests:

  </LeftContent>
  <RightCode label="app/api/auth/[...all]/route.ts">

```typescript
import { authApiHandler } from '@neondatabase/neon-js/auth/next';

const handlers = authApiHandler();

export async function GET(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const params = await context.params;
  return handlers.GET(request, {
    params: Promise.resolve({ path: params.all }),
  });
}

export async function POST(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const params = await context.params;
  return handlers.POST(request, {
    params: Promise.resolve({ path: params.all }),
  });
}

export async function PUT(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const params = await context.params;
  return handlers.PUT(request, {
    params: Promise.resolve({ path: params.all }),
  });
}

export async function DELETE(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const params = await context.params;
  return handlers.DELETE(request, {
    params: Promise.resolve({ path: params.all }),
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ all: string[] }> }) {
  const params = await context.params;
  return handlers.PATCH(request, {
    params: Promise.resolve({ path: params.all }),
  });
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Server Component example">
  <LeftContent>

Check authentication in Server Components:

  </LeftContent>
  <RightCode label="app/page.tsx">

```typescript
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function signOut() {
  'use server';
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  await fetch(`http://localhost:3000/api/auth/sign-out`, {
    method: 'POST',
    headers: {
      cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
  });

  redirect('/sign-in');
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`http://localhost:3000/api/auth/get-session`, {
    headers: { cookie: cookieHeader },
  });

  let data = null;
  if (response.ok) {
    const json = await response.json();
    data = json;
  }

  // Response structure: { user, session }
  if (data?.user) {
    return (
      <div>
        <h1>Welcome, {data.user.email}</h1>
        <form action={signOut}>
          <button type="submit">Sign Out</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Not signed in</h1>
      <a href="/sign-in">Sign In</a> | <a href="/sign-up">Sign Up</a>
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Client Component example">
  <LeftContent>

Use SDK methods for sign-up, sign-in, and OAuth:

  </LeftContent>
  <RightCode label="app/sign-in/page.tsx">

```tsx
'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push('/');
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
    });
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <button onClick={handleGoogleSignIn} className="secondary">
        Sign in with Google
      </button>
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Sign up example">
  <LeftContent>

Create a sign-up page:

  </LeftContent>
  <RightCode label="app/sign-up/page.tsx">

```tsx
'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push('/');
  };

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/auth/callback`,
    });
  };

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <button onClick={handleGoogleSignUp} className="secondary">
        Sign up with Google
      </button>
      <p>
        <a href="/sign-in">Already have an account? Sign in</a>
      </p>
    </div>
  );
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Handle OAuth callback">
  <LeftContent>

Create a callback page to handle OAuth redirects:

  </LeftContent>
  <RightCode label="app/auth/callback/page.tsx">

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // OAuth callback is handled by the API route
    // Just redirect to home after a brief delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return <div>Completing sign-in...</div>;
}
```

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Add basic styling (optional)">
  <LeftContent>

The examples above use minimal styling. Add these styles to your existing `app/globals.css` to make your forms more usable:

<Admonition type="note">
This CSS is optional. The authentication will work without it, but your forms will be unstyled. Add these styles to your existing `globals.css` file—don't replace the entire file.
</Admonition>

  </LeftContent>
  <RightCode label="app/globals.css">

<details>
<summary>View form styling CSS</summary>

Add these styles to your existing `app/globals.css` file:

```css
body {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
  max-width: 420px;
  margin: 3rem auto;
  padding: 0 1rem;
  color: #000;
}

h1 {
  margin-bottom: 1.25rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.15s;
  color: #000;
  background: #fff;
}

input:focus {
  border-color: #000;
  outline: none;
}

button {
  padding: 0.75rem;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

button:hover {
  background: #1a1a1a;
}

button.secondary {
  background: #fff;
  color: #000;
  border: 1px solid #d1d5db;
}

button.secondary:hover {
  background: #f9fafb;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

a {
  display: inline-block;
  margin-top: 0.75rem;
  color: #000;
  text-decoration: none;
  font-size: 0.95rem;
}

a:hover {
  text-decoration: underline;
}
```

</details>

  </RightCode>
</TwoColumnStep>

<TwoColumnStep title="Start your app">
  <LeftContent>

Start the development server:

Open your browser to [http://localhost:3000](http://localhost:3000) and test sign-up and sign-in.

  </LeftContent>
  <RightCode label="Terminal">

```bash
npm run dev
```

  </RightCode>
</TwoColumnStep>

</TwoColumnLayout>

## Available SDK methods

- [`authClient.signUp.email()`](/docs/reference/javascript-sdk#auth-signup) - Create a new user account
- [`authClient.signIn.email()`](/docs/reference/javascript-sdk#auth-signinwithpassword) - Sign in with email and password
- [`authClient.signIn.social()`](/docs/reference/javascript-sdk#auth-signinwithoauth) - Sign in with OAuth (Google, GitHub)
- [`authClient.signOut()`](/docs/reference/javascript-sdk#auth-signout) - Sign out the current user
- [`authClient.getSession()`](/docs/reference/javascript-sdk#auth-getsession) - Get the current session
- `/api/auth/get-session` - Get session via API route (for Server Components)
- `/api/auth/sign-out` - Sign out endpoint

<Admonition type="note">
The response from `/api/auth/get-session` returns `{ user, session }` directly (not nested under `data`). Check `data?.user` to see if authenticated.
</Admonition>

## Next steps

- [Learn about Neon Auth concepts](/docs/auth/overview)
- [Use UI components instead](/docs/auth/quick-start/nextjs) if you want pre-built forms
- [Add email verification](/docs/auth/guides/email-verification) to verify user emails
- [Set up OAuth providers](/docs/auth/guides/setup-oauth) for Google and GitHub sign-in

<NeedHelp/>
