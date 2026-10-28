---
title: UI Components Reference
subtitle: Sign-in, sign-up, and user menu components for Managed Better Auth
summary: >-
  How to add Better Auth UI's shadcn/ui components to an app on Managed Better
  Auth: install them with the shadcn CLI, wrap the app in `AuthProvider` with
  the `@neon/auth` client, and render `<Auth>` on `/auth/[path]` and
  `<UserButton>` in the header. Use this page for the provider props, the npm
  `overrides` block, redirect validation, and route protection.
enableTableOfContents: true
updatedOn: '2026-09-16T15:38:57.808Z'
---

Managed Better Auth works with [Better Auth UI](https://better-auth-ui.com): sign-in, sign-up, password reset, and user menu components for Better Auth. The shadcn CLI copies the components into your app, so you can edit them. `@better-auth-ui/react` provides the hooks and data layer they use.

<Admonition type="note" title="Coming from @neondatabase/auth-ui">
`@neondatabase/auth-ui` is deprecated. Existing apps keep working; new apps use Better Auth UI. `NeonAuthUIProvider` becomes `AuthProvider`, `<AuthView path>` becomes `<Auth path>`, and the CSS imports go away because your app's Tailwind compiles the copied components.
</Admonition>

## Installation

Better Auth UI needs React 19.2.6 or later and Tailwind CSS 4.3.2 or later. If the project doesn't use shadcn/ui yet, initialize it first:

```bash
npx shadcn@latest init
```

### npm overrides

`@neon/auth` pins Better Auth to an exact version. `@better-auth-ui/react` requires `@better-auth/api-key` and `@better-auth/passkey` as peers, and npm installs them at their latest version, so `npm install` fails with `ERESOLVE`. Before you add the components, install `better-auth` at an exact version and add `overrides` to `package.json` that hold every Better Auth package at that version. npm rejects an override that differs from a direct dependency's version, so the two must match.

```bash
npm install --save-exact better-auth@1.7.12
```

```json
{
  "overrides": {
    "better-auth": "1.7.12",
    "@better-auth/core": "1.7.12",
    "@better-auth/oauth-provider": "1.7.12",
    "better-call": "1.4.4",
    "@better-auth/utils": "0.5.0",
    "@better-auth/api-key": "1.7.12",
    "@better-auth/passkey": "1.7.12"
  }
}
```

### Add the components

Add the auth views, and the user menu if you want one:

```bash
npx shadcn@latest add @better-auth-ui/auth
npx shadcn@latest add @better-auth-ui/user-button
```

The CLI writes the components to `components/auth/` and their shadcn/ui primitives to `components/ui/`, and installs `@better-auth-ui/react`, `@better-auth-ui/core`, and TanStack Query.

## Provider setup

Wrap the app in a TanStack Query `QueryClientProvider` and the copied `AuthProvider`. Pass the client from `createAuthClient()` in `@neon/auth` as `authClient`; it needs no adapter or type cast.

```tsx
'use client';

import { getSafeRedirectTo } from '@better-auth-ui/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { authClient } from '@/lib/auth/client';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        emailAndPassword={{ requireEmailVerification: false }} // match your branch's setting
        navigate={({ to, replace }) => {
          const path = getSafeRedirectTo(to, window.location.origin);
          const target = path.startsWith('//') ? '/' : path;
          if (replace) router.replace(target);
          else router.push(target);
        }}
        Link={Link}
        redirectTo="/"
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

Render `<Toaster />` once: the components report errors as toasts. In a single-page app, you can create the `QueryClient` once at module level instead.

| Prop               | Description                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `authClient`       | **Required.** The client from `createAuthClient()` in `@neon/auth`.                                                         |
| `navigate`         | **Required.** Called with `{ to, replace }` for every navigation the components make.                                       |
| `Link`             | **Required.** The router's link component, for example `next/link` or a TanStack Router `Link` adapter.                     |
| `redirectTo`       | Where to go after sign-in when the URL has no `?redirectTo=`.                                                               |
| `emailAndPassword` | Email and password options. Set `requireEmailVerification` to match your branch's **Verify email at signup** setting.       |
| `socialProviders`  | OAuth provider buttons to show, for example `['google', 'github']`. Configure the providers for your branch first.          |
| `plugins`          | Better Auth UI plugins, for example `emailOtpPlugin()`. A UI plugin doesn't enable the matching Managed Better Auth plugin. |

### Validate redirect targets

After sign-in, the components call `navigate` with the `?redirectTo=` value from the URL. Check it before you navigate, as in the example above, so a link like `/auth/sign-in?redirectTo=https://example.com` can't send a signed-in user to another site. `getSafeRedirectTo` returns `/` for other origins, but it can return a protocol-relative path such as `//example.com` for `/a/..//example.com`, so also reject a result that starts with `//`.

## Components

| Component      | Purpose                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| `<Auth>`       | Renders the auth view for a path: `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `sign-out`, ... |
| `<UserButton>` | Avatar and menu with the signed-in user and Sign Out. `hideSettings` hides the Settings link.                |

Hooks from `@better-auth-ui/react`:

| Hook                          | Purpose                                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- |
| `useSession(authClient)`      | The session as a TanStack Query result (`data`, `isPending`, `isFetching`).                           |
| `useAuthenticate(authClient)` | The session, and a redirect to sign-in when there is none. See [Protected routes](#protected-routes). |

## Next.js App Router

Create `app/auth/[path]/page.tsx`. The valid paths come from `viewPaths.auth` in `@better-auth-ui/core`:

```tsx
import { viewPaths } from '@better-auth-ui/core';
import { Auth } from '@/components/auth/auth';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(viewPaths.auth).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Auth path={path} />
    </main>
  );
}
```

The `/auth/[path]` route also serves `/auth/sign-out`, which the user menu's **Sign Out** opens.

Add the user menu to a header. Its **Settings** link opens `/settings/account`: add `npx shadcn@latest add @better-auth-ui/settings` and a `settings/[path]` route that renders `<Settings path={path} />`, or pass `hideSettings`.

```tsx
import { UserButton } from '@/components/auth/user/user-button';

export function Header() {
  return (
    <header>
      <UserButton size="icon" hideSettings />
    </header>
  );
}
```

## Protected routes

Redirect signed-out requests on the server, with `auth.middleware()` in `proxy.ts` (see the [Next.js server reference](/docs/auth/reference/nextjs-server)) or your router's guard. On the page, read the session with `useSession()` and wait for it to load.

`useAuthenticate()` redirects whenever it has no session and the query isn't pending, including while a stale signed-out result refetches. Right after sign-up, that sends the new user back to sign-in. If you redirect on the client, wait until `isFetching` is `false`:

```tsx
const { data: session, isFetching } = useSession(authClient);
const signedOut = !session && !isFetching;
```

## Styling

The copied components use your app's Tailwind build and shadcn/ui theme variables. `shadcn init` adds the theme to your global CSS, including:

```css
@import 'tailwindcss';
@import 'tw-animate-css';
@import 'shadcn/tailwind.css';
```

To change colors, radius, or dark mode, edit the theme variables in that file or the component files in `components/auth/`.

## Known limitations

- `@neon/auth` returns Supabase-style error codes, such as `invalid_credentials`, and Better Auth UI looks up messages by Better Auth's codes, such as `INVALID_EMAIL_OR_PASSWORD`. A wrong password shows "Please sign in again to continue." instead of an invalid-credentials message.
- For the same reason, signing in with an email that isn't verified yet doesn't redirect to the verify-email view. Sign-up does show it when `requireEmailVerification` is `true`.

## Next steps

- See the [Neon examples](https://github.com/neondatabase/examples/tree/main/realtime) for apps that use these components with Next.js, TanStack Start, and Vite
- Read the [Better Auth UI docs](https://better-auth-ui.com/docs) for every component, plugin, and hook
- Check the [Neon TypeScript SDK](/docs/reference/javascript-sdk) for programmatic auth methods
