---
title: Use Managed Better Auth with TanStack Router
subtitle: Set up authentication using pre-built UI components
summary: >-
  Managed Better Auth quick start for TanStack Router (file-router) using the
  `@neon/auth` SDK and Better Auth UI's shadcn/ui components (`<Auth>`,
  `<UserButton>`, `<Settings>`). Use this page when you need sign-in, sign-up,
  account settings, and route protection without writing custom auth UI. User profiles are stored automatically in the `neon_auth.user` table
  in your database.
enableTableOfContents: true
updatedOn: '2026-10-09T10:21:18.858Z'
layout: wide
---

<AuthAISetupTip />

<TwoColumnLayout>

<TwoColumnLayout.Step title="Create a Neon project with Auth enabled">
<TwoColumnLayout.Block>

If you don't have a Neon project yet, create one at [console.neon.tech](https://console.neon.tech).

In the Neon Console, open the **Better Auth** page and click **Enable Auth**.

You can then find your Auth URL on the Configuration tab. Copy this URL - you'll need it in the next step.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block label="Console">

![Managed Better Auth Base URL](/docs/auth/neon-auth-base-url.png)

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create a TanStack Router app">
<TwoColumnLayout.Block>

Create a new TanStack Router app using the file-router template.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npx create-tsrouter-app@latest my-app --template file-router --tailwind
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Install the Managed Better Auth SDK and UI">
<TwoColumnLayout.Block>

Install the Managed Better Auth SDK, initialize [shadcn/ui](https://ui.shadcn.com), and add [Better Auth UI](https://better-auth-ui.com)'s auth views, user menu, and settings pages. The shadcn CLI copies the components into `src/components/`.

Add the `overrides` block from [npm overrides](/docs/auth/reference/ui-components#npm-overrides) to `package.json` before you run the shadcn commands. It keeps one version of the Better Auth packages. Install `better-auth` with the same exact version first, because npm rejects an override that differs from a direct dependency's version.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
cd my-app
npm install @neon/auth@latest
npm install --save-exact better-auth@1.7.12
# add the overrides block to package.json
npx shadcn@latest init
npx shadcn@latest add @better-auth-ui/auth @better-auth-ui/user-button @better-auth-ui/settings
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Set up environment variables">
<TwoColumnLayout.Block>

Create a `.env` file in your project root and add your Auth URL:

<Admonition type="note">
Replace the URL with your actual Auth URL from the Neon Console.
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename=".env"
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Configure the auth client">
<TwoColumnLayout.Block>

Create a `src/auth.ts` file to initialize the auth client:

<Admonition type="tip" title="Using Auth and Data API together?">
This quick start uses the standalone Auth client. For one `createClient()` instance that derives both Auth and Data API URLs from a single Neon URL, see [`createClient()` initialization](/docs/reference/javascript-sdk#initializing).
</Admonition>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript filename="src/auth.ts"
import { createAuthClient } from '@neon/auth';
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters';

// credentials: 'include' sends the session cookie on cross-origin requests.
// Required if you later call authClient.token() from an origin other than your Managed Better Auth URL.
export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter({ fetchOptions: { credentials: 'include' } }),
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Auth Provider">
<TwoColumnLayout.Block>

Wrap your application in a TanStack Query `QueryClientProvider` and the `AuthProvider` the shadcn CLI copied into `src/components/auth/`. This makes the auth state available to the UI components used throughout your app.

`navigate` receives the URL's `?redirectTo=` value after sign-in, so it checks the target before navigating. See [Validate redirect targets](/docs/auth/reference/ui-components#validate-redirect-targets). For the other props, see the [UI components reference](/docs/auth/reference/ui-components#provider-setup).

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```tsx filename="src/routes/__root.tsx"
import { getSafeRedirectTo } from '@better-auth-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Outlet, createRootRoute, useRouter } from '@tanstack/react-router';
import type { ComponentProps } from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { authClient } from '../auth';
import '../styles.css';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        emailAndPassword={{ requireEmailVerification: false }}
        navigate={({ to, replace }) => {
          const path = getSafeRedirectTo(to, window.location.origin);
          const target = path.startsWith('//') ? '/' : path;
          void router.navigate({ href: target, replace });
        }}
        Link={RouterLink}
        redirectTo="/"
      >
        <TooltipProvider>
          <Outlet />
        </TooltipProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Better Auth UI passes an href with a query string, which `to` doesn't parse.
function RouterLink({
  href,
  to: _to,
  ...props
}: { href: string; to?: string } & Omit<ComponentProps<'a'>, 'href'>) {
  const url = new URL(href, window.location.origin);
  return (
    <Link
      to={url.pathname}
      search={Object.fromEntries(url.searchParams)}
      hash={url.hash.slice(1)}
      {...props}
    />
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Auth page">
<TwoColumnLayout.Block>

Create a route to handle authentication views (sign in, sign up, etc.). Create `src/routes/auth.$path.tsx`:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```tsx filename="src/routes/auth.$path.tsx"
import { createFileRoute } from '@tanstack/react-router';
import { Auth } from '@/components/auth/auth';

export const Route = createFileRoute('/auth/$path')({
  component: AuthPage,
});

function AuthPage() {
  const { path } = Route.useParams();
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Auth path={path} />
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Create the Settings page">
<TwoColumnLayout.Block>

Create a route for the account and security settings. The user menu links to it. Create `src/routes/settings.$path.tsx`:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```tsx filename="src/routes/settings.$path.tsx"
import { createFileRoute } from '@tanstack/react-router';
import { Settings } from '@/components/auth/settings/settings';

export const Route = createFileRoute('/settings/$path')({
  component: SettingsPage,
});

function SettingsPage() {
  const { path } = Route.useParams();
  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <Settings path={path} />
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Protect your routes">
<TwoColumnLayout.Block>

Read the session with `useSession`, and send signed-out visitors to the sign-in page. Wait until the session query has finished fetching: right after sign-up, the cached result is still signed out while the new session loads.

Update `src/routes/index.tsx` to protect the home page:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```tsx filename="src/routes/index.tsx"
import { useSession } from '@better-auth-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { UserButton } from '@/components/auth/user/user-button';
import { authClient } from '@/auth';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { data, isFetching } = useSession(authClient);
  const signedOut = !data && !isFetching;

  useEffect(() => {
    if (signedOut) void navigate({ to: '/auth/$path', params: { path: 'sign-in' } });
  }, [signedOut, navigate]);

  if (!data) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <div className="text-center">
        <h1>Welcome!</h1>
        <p>You're successfully authenticated.</p>
        <UserButton />
        <p className="mt-4 font-medium text-gray-700 dark:text-gray-200">Session and User Data:</p>
        <pre className="mx-auto w-full max-w-full overflow-x-auto rounded-lg bg-gray-900 p-4 text-left text-sm break-words whitespace-pre-wrap text-gray-100 sm:max-w-2xl">
          <code>{JSON.stringify({ session: data.session, user: data.user }, null, 2)}</code>
        </pre>
      </div>
    </main>
  );
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="Start your app">
<TwoColumnLayout.Block>

Start the development server, then open [http://localhost:3000](http://localhost:3000). You'll be redirected to the sign-in page.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash filename="Terminal"
npm run dev
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

<TwoColumnLayout.Step title="See your users in the database">
<TwoColumnLayout.Block>

As users sign up, their profiles are stored in your Neon database in the `neon_auth.user` table.

Query your users table in the SQL Editor to see your new users:

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```sql filename="SQL Editor"
SELECT * FROM neon_auth.user;
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Step>

</TwoColumnLayout>

## Next steps

- [Add email verification](/docs/auth/guides/email-verification)
- [Learn how to branch your auth](/docs/auth/branching-authentication)
- [More example apps](/docs/auth/about#example-applications)
