---
title: Migrate to Managed Better Auth
subtitle: Update from the legacy Stack Auth-based implementation
summary: >-
  Migration guide for upgrading from legacy Neon Auth (Stack Auth) to Managed
  Better Auth. Replace Stack Auth environment variables with a single
  `NEON_AUTH_BASE_URL` and swap the `@stackframe/stack` SDK for
  `@neon/auth`. Use this page when moving an existing Next.js or React
  SPA project off Stack Auth, or when ejecting to a self-managed Stack Auth
  project.
enableTableOfContents: true
updatedOn: '2026-10-09T09:41:16.035Z'
redirectFrom:
  - /docs/neon-auth/quick-start/nextjs
  - /docs/neon-auth/quick-start/react
  - /docs/neon-auth/quick-start/javascript
  - /docs/neon-auth/quick-start/drizzle
  - /docs/neon-auth/tutorial
  - /docs/neon-auth/demo
  - /docs/guides/neon-auth
  - /docs/guides/neon-auth-demo
---

This guide shows you the code differences between legacy Neon Auth (Stack Auth) and Managed Better Auth. Use it as a reference to understand what changes if you decide to upgrade.

<Admonition type="important" title="Legacy Neon Auth (Stack Auth) is no longer accepting new users">
If you're using legacy Neon Auth with Stack Auth, you can continue using it. We'll keep supporting it for existing users. But we encourage you to try Managed Better Auth instead.
</Admonition>

## Why Managed Better Auth?

- **Native Branching Support**

  Authentication branches automatically with your database. Each branch gets isolated users, sessions, and auth configuration, perfect for preview environments and testing.

- **Database as Source of Truth**

  Your Neon database is the single source of truth for authentication data. No webhooks, no sync delays, no external dependencies. Query users directly with SQL.

- **Simplified Configuration**

  One environment variable instead of four. Easier setup, fewer moving parts.

- **Open-Source Foundation**

  Built on Better Auth, enabling faster development of new features and better community support.

## Environment variables

Update your environment variables to use Better Auth's configuration.

```env filename=".env (before - Stack Auth)"
NEXT_PUBLIC_STACK_PROJECT_ID=your-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-client-key
STACK_SECRET_SERVER_KEY=your-server-secret
```

```env filename=".env (after - Better Auth)"
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-2.aws.neon.build/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

<Admonition type="note">
For React SPAs, use <code>VITE_NEON_AUTH_URL</code> instead. The <code>NEON_AUTH_COOKIE_SECRET</code> is only needed for Next.js (generate with <code>openssl rand -base64 32</code>).
</Admonition>

You can find your Auth URL in the Neon Console under **Settings** > **Better Auth** > **Project Info**.

**What changed**  
You replace multiple Stack Auth-specific keys with a single Better Auth URL that points at your Neon project. For Next.js, you also need a cookie secret for session caching.

## Next.js migration

### Install packages (#nextjs-install-packages)

Uninstall Stack Auth packages, install `@neon/auth`, and add [Better Auth UI](/docs/auth/reference/ui-components)'s components with the shadcn CLI. Add the [npm overrides](/docs/auth/reference/ui-components#npm-overrides) to `package.json` before the shadcn commands.

```bash filename="Terminal"
npm uninstall @stackframe/stack
npm install @neon/auth@latest
npm install --save-exact better-auth@1.7.12
npx shadcn@latest init
npx shadcn@latest add @better-auth-ui/auth @better-auth-ui/user-button
```

**What changed**  
Your app now depends on Managed Better Auth's Next.js SDK instead of the Stack Auth SDK, and the auth UI components are copied into `components/auth/`.

### Update SDK initialization (#nextjs-sdk-initialization)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
// stack.ts
import { StackServerApp } from '@stackframe/stack';

export const stackServerApp = new StackServerApp({
  tokenStore: 'nextjs-cookie',
});
```

```tsx
// ./lib/auth/client.ts
'use client';
import { createAuthClient } from '@neon/auth/next';

// to use in react client components
export const authClient = createAuthClient();

// ./lib/auth/server.ts
import { createNeonAuth } from '@neon/auth/next/server';

// to use in react server components, server actions, and API routes
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

</CodeTabs>

**What changed**  
You initialize the Managed Better Auth client with `createAuthClient` for client components and with `createNeonAuth()` for server-side auth. The unified `auth` instance provides `.handler()`, `.middleware()`, `.getSession()`, and all Better Auth server methods.

### Replace components (#nextjs-replace-components)

#### Sign in page

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { SignIn } from '@stackframe/stack';

export default function SignInPage() {
  return <SignIn />;
}
```

```tsx
import { Auth } from '@/components/auth/auth';

export default function SignInPage() {
  return <Auth view="signIn" />;
}
```

</CodeTabs>

**What changed**  
You render Better Auth UI's `Auth` component and tell it which flow to show with the `view` prop. To serve every auth flow from one route, use `app/auth/[path]/page.tsx` with `<Auth path={path} />`, as in the [UI components reference](/docs/auth/reference/ui-components#nextjs-app-router).

#### Sign up page

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { SignUp } from '@stackframe/stack';

export default function SignUpPage() {
  return <SignUp />;
}
```

```tsx
import { Auth } from '@/components/auth/auth';

export default function SignUpPage() {
  return <Auth view="signUp" />;
}
```

</CodeTabs>

**What changed**  
You swap the dedicated `<SignUp />` component for the same `Auth` component, configured with the `signUp` view.

#### User button

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { UserButton } from '@stackframe/stack';

export function Header() {
  return <UserButton />;
}
```

```tsx
import { UserButton } from '@/components/auth/user/user-button';

export function Header() {
  return <UserButton />;
}
```

</CodeTabs>

**What changed**  
You keep a `UserButton`, now the one the shadcn CLI copied into `components/auth/user/`.

### Replace hooks (#nextjs-replace-hooks)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
'use client';
import { useUser } from '@stackframe/stack';

export function MyComponent() {
  const user = useUser();
  return <div>{user ? `Hello, ${user.displayName}` : 'Not logged in'}</div>;
}
```

```tsx
'use client';
import { useSession } from '@/lib/auth/client';

export function MyComponent() {
  const { data } = useSession();
  const user = data?.user;

  return <div>{user ? `Hello, ${user.name || user.email}` : 'Not logged in'}</div>;
}
```

</CodeTabs>

**What changed**  
Instead of `useUser()`, you call `useSession()` hook from `authClient` and read the user & session data from response.

### Update provider setup (#nextjs-update-provider)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackServerApp } from './stack';

export default function RootLayout({ children }) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>{children}</StackTheme>
    </StackProvider>
  );
}
```

```tsx
// components/providers.tsx, rendered by app/layout.tsx around {children}
'use client';
import { getSafeRedirectTo } from '@better-auth-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { authClient } from '@/lib/auth/client';

export function Providers({ children }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        emailAndPassword={{ requireEmailVerification: false }}
        navigate={({ to, replace }) => {
          const path = getSafeRedirectTo(to, window.location.origin);
          const target = path.startsWith('//') ? '/' : path;
          if (replace) router.replace(target);
          else router.push(target);
        }}
        Link={Link}
        redirectTo="/"
      >
        {children}
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

</CodeTabs>

**What changed**  
You wrap your app in a TanStack Query provider and Better Auth UI's `AuthProvider`, and pass it the `authClient`. `navigate` validates the `?redirectTo=` target the components pass it after sign-in. There's no stylesheet to import: your Tailwind build compiles the copied components.

<Admonition type="tip" title="Styling options">
To change how the auth UI looks, edit the shadcn/ui theme or the copied components. See [Styling](/docs/auth/reference/ui-components#styling).
</Admonition>

### Replace auth handler route

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
// app/handler/[...stack]/page.tsx
import { StackHandler } from '@stackframe/stack';
import { stackServerApp } from '@/stack';

export default function Handler(props: any) {
  return <StackHandler fullPage app={stackServerApp} {...props} />;
}
```

```tsx
// app/api/auth/[...path]/route.ts
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

</CodeTabs>

**What changed**  
You proxy Managed Better Auth APIs from your Next.js application. The `auth.handler()` method forwards all API requests to the Managed Better Auth server.

### Protect routes

#### Component-level protection

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
'use client';
import { useUser } from '@stackframe/stack';

export default function ProtectedPage() {
  const user = useUser({ or: 'redirect' });
  return <div>Protected content</div>;
}
```

```tsx
'use client';
import { useSession } from '@better-auth-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authClient } from '@/lib/auth/client';

export default function ProtectedPage() {
  const router = useRouter();
  const { data, isFetching } = useSession(authClient);
  const signedOut = !data && !isFetching;

  useEffect(() => {
    if (signedOut) router.replace('/auth/sign-in');
  }, [signedOut, router]);

  if (!data) return null;
  return <div>Protected content</div>;
}
```

</CodeTabs>

**What changed**  
You read the session with `useSession()` and redirect once it has loaded without a user. For page loads, prefer the middleware below, which redirects on the server.

#### Middleware-based protection

<NextjsProxyNote/>

```tsx filename="proxy.ts (new)"
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  // Redirects unauthenticated users to sign-in page
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    // Protected routes requiring authentication
    '/dashboard/:path*',
    '/settings/:path*',

    // Do not run the middleware for the static resources
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**What changed**  
You can optionally add middleware to enforce auth at the edge for specific paths.

### Server-side user access

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { stackServerApp } from '@/stack';

export default async function ServerComponent() {
  const user = await stackServerApp.getUser();
  return <div>{user?.displayName}</div>;
}
```

```tsx
import { auth } from '@/lib/auth/server';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function ServerComponent() {
  const { data: session } = await auth.getSession();
  return <div>{session?.user?.name || session?.user?.email}</div>;
}
```

</CodeTabs>

**What changed**  
Server components now call `auth.getSession()` and read the user from the returned session. Components using auth methods must set `dynamic = 'force-dynamic'`.

## React SPA migration

### Install packages (#react-install-packages)

Uninstall Stack Auth packages, install `@neon/auth`, and add [Better Auth UI](/docs/auth/reference/ui-components)'s components with the shadcn CLI. Add the [npm overrides](/docs/auth/reference/ui-components#npm-overrides) to `package.json` before the shadcn commands.

```bash filename="Terminal"
npm uninstall @stackframe/stack
npm install @neon/auth@latest
npm install --save-exact better-auth@1.7.12
npx shadcn@latest init
npx shadcn@latest add @better-auth-ui/auth @better-auth-ui/user-button
```

**What changed**  
You use the Managed Better Auth SDK and Better Auth UI's components instead of the Stack Auth client SDK.

### Update SDK initialization (#react-sdk-initialization)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
// src/stack.ts
import { StackClientApp } from '@stackframe/stack';

export const stackClientApp = new StackClientApp({
  urls: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
});
```

```tsx
// src/auth.ts
import { createAuthClient } from '@neon/auth';
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});
const { useSession } = authClient;
```

</CodeTabs>

**What changed**  
You replace the Stack Auth client app with a Managed Better Auth `authClient` wired to your Managed Better Auth URL.

### Replace components (#react-replace-components)

Components are the same as Next.js. Use `<Auth>` and `<UserButton>` from `components/auth/`, and `useSession()` from `@better-auth-ui/react` for signed-in checks.

**What changed**  
The UI building blocks are shared across frameworks, so you can reuse the same auth components in SPAs.

### Replace hooks (#react-replace-hooks)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { useUser } from '@stackframe/stack';

export function MyComponent() {
  const user = useUser();
  return <div>{user ? `Hello, ${user.displayName}` : 'Not logged in'}</div>;
}
```

```tsx
import { useSession } from './auth';

export function MyComponent() {
  const { data } = useSession();
  const user = data?.user;

  return <div>{user ? `Hello, ${user.name || user.email}` : 'Not logged in'}</div>;
}
```

</CodeTabs>

**What changed**  
Instead of a React hook from Stack Auth, you call the `useSession()` hook from `authClient` and read the user from its response.

### Update provider setup (#react-update-provider)

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { StackProvider, StackTheme } from '@stackframe/stack';
import { stackClientApp } from './stack';

function App() {
  return (
    <StackProvider app={stackClientApp}>
      <StackTheme>{/* Your app */}</StackTheme>
    </StackProvider>
  );
}
```

```tsx
import { getSafeRedirectTo } from '@better-auth-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/components/auth/auth-provider';
import { authClient } from './auth';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        navigate={({ to }) => {
          const path = getSafeRedirectTo(to, window.location.origin);
          window.location.assign(path.startsWith('//') ? '/' : path);
        }}
        Link={({ to: _to, ...props }) => <a {...props} />}
      >
        {/* Your app */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

</CodeTabs>

**What changed**  
You drop the Stack Auth provider/theme and wrap your app in a TanStack Query provider and Better Auth UI's `AuthProvider`. `navigate` validates the `?redirectTo=` target the components pass it after sign-in.

<Admonition type="tip" title="Styling options">
To change how the auth UI looks, edit the shadcn/ui theme or the copied components. See [Styling](/docs/auth/reference/ui-components#styling).
</Admonition>

### Remove auth handler route

Delete any `StackHandler` routes. Create pages for sign-in and sign-up using `<Auth>`.

```tsx filename="src/pages/SignIn.tsx"
import { Auth } from '@/components/auth/auth';

export default function SignIn() {
  return <Auth view="signIn" />;
}
```

**What changed**  
Routing is fully controlled by your SPA, and the `Auth` component renders the view you pass it.

### React Router integration

If you're using React Router, pass navigation helpers to the provider.

```tsx filename="src/App.tsx (React Router)"
import { getSafeRedirectTo } from '@better-auth-ui/core';
import { useNavigate, Link } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/auth-provider';
import { authClient } from './auth';

function App() {
  const navigate = useNavigate();

  return (
    <AuthProvider
      authClient={authClient}
      navigate={({ to, replace }) => {
        const path = getSafeRedirectTo(to, window.location.origin);
        navigate(path.startsWith('//') ? '/' : path, { replace });
      }}
      Link={({ href, to: _to, ...props }) => <Link to={href} {...props} />}
    >
      {/* Your app */}
    </AuthProvider>
  );
}
```

**What changed**  
You let Better Auth reuse your router's navigation and Link components so redirects and links stay in sync with your SPA.

## Eject to Stack Auth

If you prefer to continue using Stack Auth independently instead of migrating to Better Auth, you can claim your Stack Auth project and manage it directly.

<Steps>

## Claim your project via the Neon Console

1. Go to your project's **Auth** page, **Configuration** tab in the Neon Console.
2. Click **Claim project** in the Claim project section.
3. Follow the prompts to select the Stack Auth account that should receive ownership.

After claiming, you'll have direct access to manage your project in the Stack Auth dashboard.

## Update your environment variables

Once claimed, update your environment variables to use Stack Auth's direct configuration. Your existing code will continue to work without changes since you're already using the Stack Auth SDK (`@stackframe/stack`).

## Manage independently

After claiming, you can:

- Manage OAuth providers directly in Stack Auth.
- Configure production security settings.
- Access Stack Auth's dashboard and features.

</Steps>

<Admonition type="important">
Ejecting to Stack Auth means you'll manage authentication independently from Neon. You'll need to handle updates, support, and infrastructure yourself. Your authentication data will no longer be managed through the Neon Console.
</Admonition>
