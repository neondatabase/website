---
title: Auth troubleshooting
subtitle: Common issues when implementing Neon Auth and how to fix them
summary: >-
  Troubleshooting guide for common Neon Auth implementation issues, including
  environment configuration, adapter setup, CSS imports, and framework-specific
  requirements.
enableTableOfContents: true
updatedOn: '2026-03-23T00:00:00.000Z'
---

This page covers common issues when integrating [Neon Auth](/docs/auth/overview) with `@neondatabase/auth` (Next.js) or `@neondatabase/neon-js` (React SPAs).

## Missing NEON_AUTH_COOKIE_SECRET

If your Next.js app throws an error about a missing or invalid cookie secret at startup, the `NEON_AUTH_COOKIE_SECRET` environment variable is either unset or too short. The secret must be at least 32 characters for HMAC-SHA256. Generate one with:

```bash
openssl rand -base64 32
```

See the [Next.js Server SDK reference](/docs/auth/reference/nextjs-server) for the full list of required environment variables.

## Missing force-dynamic on server components

If `next build` fails with a "Dynamic server usage" error on a page that calls `auth.getSession()`, the server component needs to opt out of static rendering:

```typescript
export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data: session } = await auth.getSession();
  // ...
}
```

This is required because `getSession()` reads cookies, which are only available at request time. See [getSession](/docs/auth/reference/nextjs-server#get-session) in the Next.js Server SDK reference.

## Using v0.1 API patterns

If you are upgrading from v0.1, use `createNeonAuth()` + `auth.handler()` instead of the old standalone `authApiHandler()`. See the [migration guide](/docs/auth/migrate/from-auth-v0.1) for details.

## Using useSession() without adapter in React SPA

In a React SPA, `createAuthClient(url)` without an adapter returns a vanilla client with no React hooks. Calling `useSession()` on this client will fail. Either pass `BetterAuthReactAdapter()` or use UI components (`SignedIn`, `SignedOut`, `UserButton`) which do not require an adapter.

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';

const authClient = createAuthClient(url, {
  adapter: BetterAuthReactAdapter(),
});
```

The [TanStack Router quick start](/docs/auth/quick-start/tanstack-router) shows a complete setup with the React adapter.

## Wrong BetterAuthReactAdapter import

The adapter must be imported from a subpath and called as a function:

```typescript
// Wrong
import { BetterAuthReactAdapter } from '@neondatabase/neon-js';

// Correct
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react';
const client = createAuthClient(url, { adapter: BetterAuthReactAdapter() });
```

## CSS import conflicts

Choose one CSS import method. Never use both, as this causes duplicate styles:

- **Without Tailwind:** `import '@neondatabase/auth/ui/css'` (Next.js) or `import '@neondatabase/neon-js/ui/css'` (React SPA)
- **With Tailwind v4:** `@import '@neondatabase/auth/ui/tailwind'` (Next.js) or `@import '@neondatabase/neon-js/ui/tailwind'` (React SPA)

See the [UI Components reference](/docs/auth/reference/ui-components) for complete setup instructions.

## Missing "use client" directive

In Next.js, any component that uses `useSession()` or other React hooks must include `"use client"` at the top of the file. Without it, Next.js treats the file as a server component where React hooks are not available.

## Wrong createAuthClient signature

The `createAuthClient` function has different signatures depending on the import path:

```typescript
// React SPA — import from @neondatabase/neon-js/auth
import { createAuthClient } from '@neondatabase/neon-js/auth';
createAuthClient(url);
createAuthClient(url, { adapter: BetterAuthReactAdapter() });

// Next.js — import from @neondatabase/auth/next (no arguments, uses proxy)
import { createAuthClient } from '@neondatabase/auth/next';
createAuthClient();
```

See the [Next.js quick start](/docs/auth/quick-start/nextjs-api-only) and the [React quick start](/docs/auth/quick-start/react) for complete client setup examples.

<NeedHelp/>
