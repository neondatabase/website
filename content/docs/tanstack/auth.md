---
title: Neon Auth with TanStack Start and Router
subtitle: Add Managed Better Auth to TanStack Router apps and TanStack Start server functions
summary: >-
  Set up Managed Better Auth on Neon with TanStack. For a TanStack Router single-page
  app, create the auth client and guard routes in beforeLoad with getSession(). For
  TanStack Start, mount the same-origin auth proxy, read the session in server
  function middleware, and keep personalized responses out of shared caches.
enableTableOfContents: true
noindex: true
updatedOn: '2026-11-13T06:40:29.274Z'
---

[Managed Better Auth](/docs/auth/overview) stores users and sessions in your Lakebase Postgres database on Neon, and branches them with the rest of your data. This page covers two setups:

- **TanStack Router single-page app:** the browser talks to Managed Better Auth directly, and routes are guarded in `beforeLoad`.
- **TanStack Start:** the app mounts an auth proxy on its own origin, and server functions read the session from the request's cookies.

## Before you begin

Enable Managed Better Auth on your branch, either with `auth: true` in `neon.ts` followed by `neon deploy`, or from the Neon Console. Then add each origin your app runs on:

```bash filename="Terminal"
neon neon-auth domain add http://localhost:3000
neon neon-auth domain add https://myapp.com
```

```bash filename="Terminal"
npm install @neon/auth
```

## TanStack Router single-page app

Create the auth client with the branch's Auth URL:

```ts filename="src/auth.ts"
import { createAuthClient } from '@neon/auth';
import { BetterAuthReactAdapter } from '@neon/auth/react/adapters';

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter({ fetchOptions: { credentials: 'include' } }),
});
```

Guard signed-in routes in a pathless layout route. `beforeLoad` runs before anything renders, so protected content never flashes:

```tsx filename="src/routes/_authenticated.tsx"
import { createFileRoute, redirect } from '@tanstack/react-router';

import { authClient } from '../auth';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();
    if (!session) {
      throw redirect({
        to: '/auth/$path',
        params: { path: 'sign-in' },
        search: { redirectTo: location.href },
      });
    }
    return { user: session.user };
  },
});
```

- Concurrent `getSession()` calls are deduplicated, so calling it on every navigation is cheap.
- Child routes read the non-null `user` from route context. In components, `authClient.useSession()` returns reactive session state.
- For prebuilt sign-in, sign-up and settings pages, follow the [TanStack Router quick start](/docs/auth/quick-start/tanstack-router), which adds [Better Auth UI](https://better-auth-ui.com) components with the shadcn CLI. Validate the `redirectTo` target with `getSafeRedirectTo()` before navigating.

<Admonition type="important" title="Route guards are not API protection">
A single-page app calls its backend directly. Every backend endpoint must verify the session itself. For database reads from the browser, use the [Data API with Row-Level Security](/docs/tanstack/data-api).
</Admonition>

## TanStack Start

In TanStack Start, the auth server runs inside the app. The session cookie lives on the app's origin, so server functions read it per request and the browser holds no token. A dedicated Managed Better Auth adapter for TanStack Start isn't out yet; the server below uses `@neon/auth/server` with Start's request helpers.

| Variable                  | Value                                                           |
| ------------------------- | --------------------------------------------------------------- |
| `NEON_AUTH_BASE_URL`      | The branch's Auth URL, written by `neon deploy`                 |
| `NEON_AUTH_COOKIE_SECRET` | At least 32 characters. Generate with `openssl rand -base64 32` |

### Create the auth server

```ts filename="src/auth.server.ts"
import { createAuthServer, extractNeonAuthCookies } from '@neon/auth/server';
import { getRequest, setCookie } from '@tanstack/react-start/server';

export const authConfig = {
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookieSecret: process.env.NEON_AUTH_COOKIE_SECRET!,
};

export const auth = createAuthServer({
  ...authConfig,
  context: () => {
    const request = getRequest();
    return {
      getCookies: () => extractNeonAuthCookies(request.headers),
      setCookie,
      getHeader: (name) => request.headers.get(name),
      getOrigin: () => request.headers.get('origin') ?? new URL(request.url).origin,
      getFramework: () => 'tanstack-start',
    };
  },
});
```

### Mount the auth proxy

```ts filename="src/routes/api/auth/$.ts"
import { handleAuthProxyRequest } from '@neon/auth/server';
import { createFileRoute } from '@tanstack/react-router';

import { authConfig } from '../../../auth.server';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      ANY: ({ request, params }) =>
        handleAuthProxyRequest({ request, path: params._splat ?? '', ...authConfig }),
    },
  },
});
```

Point the browser client at the proxy. An empty URL uses `/api/auth` on the page's origin:

```ts filename="src/auth.client.ts"
import { createAuthClient } from '@neon/auth';

export const authClient = createAuthClient('');
```

### Read the session in middleware

```ts filename="src/auth.functions.ts"
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { setResponseHeader, setResponseStatus } from '@tanstack/react-start/server';

import { auth } from './auth.server';

// The data boundary: use on every server function that reads or writes private data.
export const requireUser = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const { data } = await auth.getSession();
  if (!data?.user) {
    setResponseStatus(401);
    throw new Error('UNAUTHENTICATED');
  }
  return next({ context: { user: { id: data.user.id } } });
});

// For route guards: returns the user or null without throwing.
export const getSessionUser = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store');
  const { data } = await auth.getSession();
  return data?.user ? { id: data.user.id } : null;
});
```

Put the user on router context for every navigation, and keep pages out of shared caches:

```tsx filename="src/routes/__root.tsx"
import { createRootRoute } from '@tanstack/react-router';

import { getSessionUser } from '../auth.functions';

export const Route = createRootRoute({
  beforeLoad: async () => ({ user: await getSessionUser() }),
  headers: () => ({ 'Cache-Control': 'private, no-store', Vary: 'Cookie' }),
});
```

## Common pitfalls

| Pitfall                                            | Fix                                                                                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Trusting a user ID sent by the browser             | Take identity from `auth.getSession()` in middleware. Treat a `userId` in the body as input to check.                          |
| Protecting only the route, not the server function | A route guard doesn't protect a `createServerFn`. Add `requireUser` to the server function.                                    |
| Caching a personalized SSR response                | Send `Cache-Control: private, no-store` and `Vary: Cookie`, including on SSR redirects, which skip the root route's `headers`. |
| Keeping one user's client state after sign-out     | Make sign-in and sign-out full page loads, so per-user caches and collections are dropped.                                     |

---

## Related docs (TanStack)

- [Neon Realtime with TanStack DB](/docs/tanstack/realtime-db)
- [Data API for client-only TanStack Router apps](/docs/tanstack/data-api)
- [Managed Better Auth overview](/docs/auth/overview)
- [TanStack Router quick start](/docs/auth/quick-start/tanstack-router)
- [Realtime server-side rendering](/docs/realtime/guides/ssr)
