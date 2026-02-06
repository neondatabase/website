---
title: Migrate to Neon Auth with Better Auth
subtitle: Update from the legacy Stack Auth-based implementation
summary: >-
  Covers the code differences and necessary updates for migrating from legacy
  Neon Auth (Stack Auth) to Neon Auth with Better Auth, including environment
  variable changes and benefits of the new system.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.758Z'
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

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

This guide shows you the code differences between legacy Neon Auth (Stack Auth) and Neon Auth with Better Auth. Use it as a reference to understand what changes if you decide to upgrade.

<Admonition type="important" title="Legacy Neon Auth (Stack Auth) is no longer accepting new users">
If you're using legacy Neon Auth with Stack Auth, you can continue using it. We'll keep supporting it for existing users. But we encourage you to try Neon with Better Auth instead.
</Admonition>

## Why Neon Auth with Better Auth?

- **Native Branching Support**

  Authentication branches automatically with your database. Each branch gets isolated users, sessions, and auth configuration—perfect for preview environments and testing.

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

You can find your Auth URL in the Neon Console under **Auth** → **Configuration**.

**What changed**  
You replace multiple Stack Auth-specific keys with a single Better Auth URL that points at your Neon project. For Next.js, you also need a cookie secret for session caching.

## Next.js migration

### Install packages (#nextjs-install-packages)

Uninstall Stack Auth packages and install `@neondatabase/auth`

```bash filename="Terminal"
npm uninstall @stackframe/stack
npm install @neondatabase/auth
```

**What changed**  
Your app now depends on Neon Auth's Next.js SDK and UI package instead of the Stack Auth SDK.

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
import { createAuthClient } from '@neondatabase/auth/next';

// to use in react client components
export const authClient = createAuthClient();

// ./lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

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
You initialize the Neon Auth client with `createAuthClient` for client components and with `createNeonAuth()` for server-side auth. The unified `auth` instance provides `.handler()`, `.middleware()`, `.getSession()`, and all Better Auth server methods.

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
import { AuthView } from '@neondatabase/auth/react';

export default function SignInPage() {
  return <AuthView pathname="sign-in" />;
}
```

</CodeTabs>

**What changed**  
You render Neon Auth's `AuthView` client component and tell it which flow to show using the `pathname` prop.

#### Sign up page

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { SignUp } from '@stackframe/stack';

export default function SignUpPage() {
  return <SignUp />;
}
```

```tsx
import { AuthView } from '@neondatabase/auth/react';

export default function SignUpPage() {
  return <AuthView pathname="sign-up" />;
}
```

</CodeTabs>

**What changed**  
You swap the dedicated `<SignUp />` component for the same `AuthView` component, configured with the `"sign-up"` pathname.

#### User button

<CodeTabs labels={["Before (Stack Auth)", "After (Better Auth)"]}>

```tsx
import { UserButton } from '@stackframe/stack';

export function Header() {
  return <UserButton />;
}
```

```tsx
import { UserButton } from '@neondatabase/auth/react';

export function Header() {
  return <UserButton />;
}
```

</CodeTabs>

**What changed**  
You keep the same `UserButton` API but import it from the Neon Auth UI package and mark the component as client-side.

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
'use client';
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import '@neondatabase/auth/ui/css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
```

</CodeTabs>

**What changed**  
You wrap your app in `NeonAuthUIProvider`, pass it the `authClient`, and import the Neon Auth UI styles.

<Admonition type="tip" title="Styling options">
To learn more about applying styles to the Auth UI components, including plain CSS and Tailwind CSS v4 options, see [UI Component Styles](/docs/auth/reference/ui-components#styling).
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
You proxy Neon Auth APIs from your Next.js application. The `auth.handler()` method forwards all API requests to the Neon Auth server.

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
import { SignedIn, RedirectToSignIn } from '@neondatabase/auth/react';

export default function ProtectedPage() {
  return (
    <SignedIn>
      <div>Protected content</div>
      <RedirectToSignIn />
    </SignedIn>
  );
}
```

</CodeTabs>

**What changed**  
You switch from hook-based redirects to declarative UI helpers that show content only when the user is signed in.

#### Middleware-based protection

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

Uninstall Stack Auth packages and install `@neondatabase/auth`

```bash filename="Terminal"
npm uninstall @stackframe/stack
npm install @neondatabase/auth
```

**What changed**  
You use the framework-agnostic Neon JS SDK plus the shared UI package instead of the Stack Auth client SDK.

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
import { createAuthClient } from '@neondatabase/auth';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
const { useSession } = authClient;
```

</CodeTabs>

**What changed**  
You replace the Stack Auth client app with a Neon Auth `authClient` wired to your Neon Auth URL.

### Replace components (#react-replace-components)

Components are the same as Next.js. Use `<AuthView>`, `<UserButton>`, `<SignedIn>`, and `<SignedOut>` from `@neondatabase/neon-auth-ui`.

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
  const { data: session } = useSession();
  const user = data?.user;

  return <div>{user ? `Hello, ${user.name || user.email}` : 'Not logged in'}</div>;
}
```

</CodeTabs>

**What changed**  
Instead of a React hook from Stack Auth, you call `authClient.getSession()` and manage the session in your own component state.

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
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import '@neondatabase/auth/ui/css';
import { authClient } from './auth';

function App() {
  return <NeonAuthUIProvider authClient={authClient}>{/* Your app */}</NeonAuthUIProvider>;
}
```

</CodeTabs>

**What changed**  
You drop the Stack Auth provider/theme and wrap your app in `NeonAuthUIProvider` with the Neon Auth UI styles.

<Admonition type="tip" title="Styling options">
To learn more about applying styles to the Auth UI components, including plain CSS and Tailwind CSS v4 options, see [UI Component Styles](/docs/auth/reference/ui-components#styling).
</Admonition>

### Remove auth handler route

Delete any `StackHandler` routes. Create custom pages for sign-in and sign-up using `<AuthView>`.

```tsx filename="src/pages/SignIn.tsx"
import { AuthView } from '@neondatabase/auth/react';

export default function SignIn() {
  return <AuthView pathname="sign-in" />;
}
```

**What changed**  
Routing is fully controlled by your SPA, and the `AuthView` component just renders the appropriate view for each path.

### React Router integration

If you're using React Router, pass navigation helpers to the provider.

```tsx filename="src/App.tsx (React Router)"
import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { useNavigate, Link } from 'react-router-dom';
import { authClient } from './auth';

function App() {
  const navigate = useNavigate();

  return (
    <NeonAuthUIProvider authClient={authClient} navigate={navigate} Link={Link}>
      {/* Your app */}
    </NeonAuthUIProvider>
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
