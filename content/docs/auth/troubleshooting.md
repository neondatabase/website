---
title: Auth troubleshooting
subtitle: Common issues when implementing Neon Auth and how to fix them
summary: >-
  Troubleshooting for common Neon Auth errors in `@neondatabase/auth` (Next.js)
  and `@neondatabase/neon-js` (React SPA). Covers missing `NEON_AUTH_COOKIE_SECRET`,
  missing `force-dynamic` on server components, `NETWORK_DNS` / `NETWORK_TIMEOUT`
  upstream errors, and OAuth `redirect_uri_mismatch` from misconfigured callback
  URIs. Use this page when Neon Auth fails at startup, sessions do not persist,
  or OAuth logins loop back to the provider instead of the app.
enableTableOfContents: true
updatedOn: '2026-06-05T17:20:32.620Z'
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

## Neon Auth server logging in the terminal

You may see structured **`warn`** or **`error`** lines in the Next.js server console when the auth proxy cannot reach Neon Auth or when session cookies fail validation. This is expected: the SDK defaults to **`logLevel: 'warn'`** (opt-out).

To mute Neon Auth console output:

```typescript
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
  logLevel: 'silent',
});
```

To investigate further, use **`logLevel: 'debug'`** or a custom **`logger`**. See [Server logging](/docs/auth/reference/nextjs-server#server-logging).

## Upstream NETWORK\_\* errors

Server actions or API routes may return errors with **`code`** values such as **`NETWORK_DNS`**, **`NETWORK_REFUSED`**, or **`NETWORK_TIMEOUT`**. These mean your app could not reach the Auth server at **`NEON_AUTH_BASE_URL`** (typo, wrong branch URL, offline network, or TLS issue).

1. Confirm **`NEON_AUTH_BASE_URL`** in `.env.local` matches the Auth URL in the Neon Console (Project → Branch → Auth → Configuration).
2. Restart the dev server after changing env vars.
3. Enable **`logLevel: 'debug'`** and retry; logs include a safe **`detail`** field.

See [Upstream fetch errors](/docs/auth/reference/nextjs-server#upstream-fetch-errors) for the full code list.

## Cookies blocked in iframe or cross-site embeds

Neon Auth cookies default to **`SameSite=Strict`**. If your app runs inside another site's **iframe**, or needs cookies on top-level cross-site navigations, sessions may not persist.

Set an explicit SameSite mode when creating the auth instance:

```typescript
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    sameSite: 'lax', // or 'none' for third-party iframe contexts (requires HTTPS)
  },
});
```

See [Configuration reference](/docs/auth/reference/nextjs-server#configuration-reference) and the [Next.js quick start](/docs/auth/quick-start/nextjs-api-only).

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

- **Without Tailwind:** `import '@neondatabase/auth-ui/css'`
- **With Tailwind v4:** `@import '@neondatabase/auth-ui/tailwind'`

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

## OAuth errors (`redirect_uri_mismatch`, blocked consent, redirect loops)

**`redirect_uri_mismatch` from Google (or another provider)**

The authorized redirect URI in the provider's dashboard must match Neon Auth's callback route exactly: **`{NEON_AUTH_BASE_URL}/callback/{provider}`** (for example `.../callback/google`). See [Production setup](/docs/auth/guides/setup-oauth#production-setup).

Common mistakes:

- Registering only your marketing site or only the `callbackURL` from `signIn.social()`, instead of **`{NEON_AUTH_BASE_URL}/callback/{provider}`**.
- Using a branch's **`NEON_AUTH_BASE_URL`** in your app while Google still lists redirect URIs for a different branch's Auth base URL.

**OAuth succeeds but the user never reaches your app**

Neon Auth only redirects to [trusted domains](/docs/auth/guides/configure-domains). Add every origin you use in **`callbackURL`** (including `https://www.example.com` separately if you use www).

**Google consent screen shows an unexpected hostname**

That hostname comes from the OAuth redirect URI (your app vs Neon Auth). See [Google OAuth branding](/docs/auth/guides/setup-oauth#google-oauth-branding).

**Google says the app is in Testing / users outside test accounts cannot sign in**

Add testers in Google Cloud Console or publish the OAuth consent screen for production use. See [Google OAuth branding](/docs/auth/guides/setup-oauth#google-oauth-branding).

<NeedHelp/>
