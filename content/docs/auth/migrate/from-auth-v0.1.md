---
title: Migrate from Neon Auth SDK v0.1 to v0.2
subtitle: Upgrade guide for breaking changes in the Neon Auth SDK
summary: >-
  Covers the migration process from Neon Auth SDK v0.1.x to v0.2.x, detailing
  changes such as a unified API, session caching, and explicit configuration
  requirements.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.755Z'
---

This guide helps you migrate from Neon Auth SDK v0.1.x to v0.2.x, which introduces a unified API and performance improvements through session caching.

## What's new in v0.2

### Unified entry point

The SDK now uses a single `createNeonAuth()` function that replaces four separate imports:

- `neonAuth()` → `auth.getSession()`
- `authApiHandler()` → `auth.handler()`
- `neonAuthMiddleware()` → `auth.middleware()`
- `createAuthServer()` → `createNeonAuth()`

### Session caching

Session data is automatically cached in a signed cookie, reducing API calls to the Auth Server by 95-99%. Sessions are cached for 5 minutes by default (configurable).

### Explicit configuration

Configuration is now explicit rather than implicit. You must pass `baseUrl` and `cookies.secret` directly to `createNeonAuth()` instead of relying on automatic environment variable reading.

## Migration steps

### 1. Update package version

Update to the latest version:

```bash
npm install @neondatabase/auth@latest
```

### 2. Add required environment variable

Add `NEON_AUTH_COOKIE_SECRET` to your `.env` file. This secret is required for signing session data cookies:

```bash
# .env
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

Generate a secure secret with:

```bash
openssl rand -base64 32
```

<Admonition type="important">
The secret must be at least 32 characters for HMAC-SHA256 security.
</Admonition>

### 3. Create unified auth instance

Create a new `lib/auth/server.ts` file with your auth configuration:

**Before (v0.1):**

```typescript
// lib/auth/server.ts
import { createAuthServer } from '@neondatabase/auth/next/server';

export const authServer = createAuthServer();
```

**After (v0.2):**

```typescript
// lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

<Admonition type="note">
The `auth` object provides all functionality: `handler()`, `middleware()`, `getSession()`, and all Better Auth server methods.
</Admonition>

### 4. Update API route handler

**Before (v0.1):**

```typescript
// app/api/auth/[...path]/route.ts
import { authApiHandler } from '@neondatabase/auth/next/server';

export const { GET, POST } = authApiHandler();
```

**After (v0.2):**

```typescript
// app/api/auth/[...path]/route.ts
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

### 5. Update middleware

**Before (v0.1):**

```typescript
// proxy.ts
import { neonAuthMiddleware } from '@neondatabase/auth/next/server';

export default neonAuthMiddleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: ['/account/:path*'],
};
```

**After (v0.2):**

```typescript
// proxy.ts
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: ['/account/:path*'],
};
```

### 6. Update server components

**Before (v0.1):**

```typescript
// app/dashboard/page.tsx
import { neonAuth } from '@neondatabase/auth/next/server';

export default async function DashboardPage() {
  const { session, user } = await neonAuth();

  if (!user) {
    return <div>Not logged in</div>;
  }

  return <div>Hello {user.name}</div>;
}
```

**After (v0.2):**

```typescript
// app/dashboard/page.tsx
import { auth } from '@/lib/auth/server';

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  return <div>Hello {session.user.name}</div>;
}
```

<Admonition type="important">
Server components that use `auth` methods must set `export const dynamic = 'force-dynamic'` because session data depends on cookies that can only be read at request time.
</Admonition>

### 7. Update server actions

**Before (v0.1):**

```typescript
'use server';
import { authServer } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  await authServer.signOut();
  redirect('/auth/sign-in');
}
```

**After (v0.2):**

```typescript
'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  await auth.signOut();
  redirect('/auth/sign-in');
}
```

<Admonition type="note">
All Better Auth server methods are available directly on the `auth` object: `signIn`, `signUp`, `signOut`, `updateUser`, `organization.*`, `admin.*`, etc.
</Admonition>

### 8. Update API routes

**Before (v0.1):**

```typescript
// app/api/user/route.ts
import { authServer } from '@/lib/auth/server';

export async function GET() {
  const { data } = await authServer.getSession();

  if (!data?.session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ user: data.user });
}
```

**After (v0.2):**

```typescript
// app/api/user/route.ts
import { auth } from '@/lib/auth/server';

export async function GET() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return Response.json({ user: session.user });
}
```

### 9. Client-side code (no changes)

Client-side code using `createAuthClient()` remains unchanged:

```typescript
// lib/auth/client.ts
'use client';

import { createAuthClient } from '@neondatabase/auth/next';

export const authClient = createAuthClient();
```

Client components and hooks work the same way:

```typescript
'use client';
import { authClient } from '@/lib/auth/client';

export function UserProfile() {
  const { data } = authClient.useSession();
  return <div>{data?.user?.name}</div>;
}
```

## API changes reference

### Removed APIs

| v0.1 API               | v0.2 Replacement    |
| ---------------------- | ------------------- |
| `neonAuth()`           | `auth.getSession()` |
| `authApiHandler()`     | `auth.handler()`    |
| `neonAuthMiddleware()` | `auth.middleware()` |
| `createAuthServer()`   | `createNeonAuth()`  |

### Return value changes

#### `getSession()` return format

**Before (v0.1):**

```typescript
const { session, user } = await neonAuth();
// Returns: { session: Session, user: User }
```

**After (v0.2):**

```typescript
const { data: session } = await auth.getSession();
// Returns: { data: { session: Session, user: User } | null, error: Error | null }
```

The new format is consistent with Better Auth's standard response pattern.

## Configuration options

The `createNeonAuth()` function accepts these configuration options:

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

## Performance improvements

The v0.2 SDK includes automatic session caching that reduces API calls by 95-99%:

- Session data is cached in a signed cookie (`__Secure-neon-auth.next.session_data`)
- Cache is valid for 5 minutes by default (configurable via `sessionDataTtl`)
- Automatically refreshed when the session token is refreshed
- Falls back to API calls if cache is stale or missing

No code changes are needed to benefit from this caching. It works automatically after you configure `cookies.secret`.

## Troubleshooting

### Error: "Missing required config: cookies.secret"

You need to add `NEON_AUTH_COOKIE_SECRET` to your environment variables:

```bash
NEON_AUTH_COOKIE_SECRET=$(openssl rand -base64 32)
```

### Error: "Server Component functions should be marked with 'force-dynamic'"

Add this to any server component that uses auth methods:

```typescript
export const dynamic = 'force-dynamic';
```

### Session not persisting

Ensure your `NEON_AUTH_COOKIE_SECRET` is:

- At least 32 characters long
- The same across all environments
- Not changing between deployments

### TypeScript errors after upgrade

Run:

```bash
npm install @neondatabase/auth@latest
rm -rf node_modules/.cache
npm run dev
```

## Complete migration checklist

- [ ] Update `@neondatabase/auth` to v0.2.x
- [ ] Add `NEON_AUTH_COOKIE_SECRET` to `.env`
- [ ] Create `lib/auth/server.ts` with `createNeonAuth()`
- [ ] Update `app/api/auth/[...path]/route.ts` to use `auth.handler()`
- [ ] Update `proxy.ts` to use `auth.middleware()`
- [ ] Replace all `neonAuth()` calls with `auth.getSession()`
- [ ] Replace all `authServer` imports with `auth`
- [ ] Add `export const dynamic = 'force-dynamic'` to server components
- [ ] Update return value destructuring from `{ session, user }` to `{ data: session }`
- [ ] Test authentication flow in development
- [ ] Deploy with new environment variable

## Additional resources

- [Next.js Server SDK Reference](/docs/auth/reference/nextjs-server) - Complete API documentation
- [Neon Auth SDK Changelog](https://github.com/neondatabase/neon-js/blob/main/packages/auth/CHANGELOG.md#020-beta1)
- [Next.js Integration Guide](/docs/auth/quick-start/nextjs)
- [Neon Auth Overview](/docs/auth/overview)

<NeedHelp/>
