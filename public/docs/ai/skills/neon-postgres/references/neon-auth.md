# Neon Auth

Neon Auth provides managed authentication that stores users, sessions, and auth configuration directly in your Neon database. When you branch your database, your entire auth state branches with it.

See the [official Neon Auth docs](https://neon.com/docs/auth/overview.md) for complete details.

## Package Selection

| Framework / Use Case    | Package                 | Notes                          |
| ----------------------- | ----------------------- | ------------------------------ |
| Next.js                 | `@neondatabase/auth`    | Server + client SDK            |
| React SPA (Vite, etc)   | `@neondatabase/neon-js` | Client SDK + optional Data API |
| Auth + Database queries | `@neondatabase/neon-js` | Full SDK                       |

Both packages share auth exports (`@neondatabase/neon-js/auth/*` re-exports `@neondatabase/auth/*`).

```bash
# Next.js
npm install @neondatabase/auth@latest

# React SPA / Full SDK
npm install @neondatabase/neon-js@latest
```

> **Note:** While these packages are in pre-release (beta), you must use `@latest` with npm. Without it, npm may install an older version. This is not needed with pnpm or yarn.

## Next.js Setup

**1. Server auth instance** (`lib/auth/server.ts`):

```typescript
import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

**2. API route handler** (`app/api/auth/[...path]/route.ts`):

```typescript
import { auth } from "@/lib/auth/server";
export const { GET, POST } = auth.handler();
```

**3. Middleware** (`middleware.ts`):

```typescript
import { auth } from "@/lib/auth/server";

export default auth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: ["/account/:path*"],
};
```

**4. Client** (`lib/auth/client.ts`):

```typescript
"use client";
import { createAuthClient } from "@neondatabase/auth/next";
export const authClient = createAuthClient();
```

**5. Server component access** (must set `force-dynamic`):

```typescript
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return <div>Not logged in</div>;
  return <div>Hello {session.user.name}</div>;
}
```

**6. UI setup** — Add the provider, CSS, and page components. See [UI Components](#ui-components) below for `NeonAuthUIProvider`, CSS imports, `AuthView`, and `AccountView` setup.

See the [Next.js quickstart](https://neon.com/docs/auth/quick-start/nextjs.md) and [server SDK reference](https://neon.com/docs/auth/reference/nextjs-server.md) for the full setup.

### Environment Variables (Next.js)

```bash
NEON_AUTH_BASE_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

Get your Auth URL from the Neon Console: Project -> Branch -> Auth -> Configuration.

Generate a cookie secret: `openssl rand -base64 32`

## React SPA Setup

**1. Auth client** (`lib/auth.ts`):

```typescript
import { createAuthClient } from "@neondatabase/neon-js/auth";

export const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

If you need `useSession()` in custom components, pass an adapter:

```typescript
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";

const authClient = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL, {
  adapter: BetterAuthReactAdapter(),
});
```

UI components (`AuthView`, `SignedIn`, etc.) work without an adapter.

**2. UI setup** — Wrap your app with `NeonAuthUIProvider` and import CSS. See [UI Components](#ui-components) below. In a SPA, the provider and CSS go in your root component (e.g., `App.tsx` or your router layout).

**3. Routing** — Map `AuthView` and `AccountView` to routes in your router (React Router, TanStack Router, etc.). For example, with React Router:

```tsx
<Route path="/auth/:path" element={<AuthView />} />
<Route path="/account/:path" element={<AccountView />} />
```

### Environment Variables (React SPA)

```bash
VITE_NEON_AUTH_URL=https://ep-xxx.neonauth.us-east-1.aws.neon.tech/neondb/auth
```

See the [React quickstart with UI components](https://neon.com/docs/auth/quick-start/react-router-components.md) and [React API-only quickstart](https://neon.com/docs/auth/quick-start/react.md) for the full setup.

## UI Components

Use pre-built components instead of building custom auth forms.

| Component                | Purpose                                   |
| ------------------------ | ----------------------------------------- |
| `AuthView`               | Sign-in, sign-up, forgot-password pages   |
| `AccountView`            | Account settings, security pages          |
| `UserButton`             | User avatar with dropdown menu            |
| `SignedIn` / `SignedOut` | Conditional rendering based on auth state |
| `RedirectToSignIn`       | Redirect unauthenticated users            |
| `RedirectToSignUp`       | Redirect to sign-up page                  |

See the [UI components reference](https://neon.com/docs/auth/reference/ui-components.md) for full props and customization.

### CSS (choose one, never both)

The CSS import path depends on which package you installed:

```typescript
// Next.js (@neondatabase/auth)
import "@neondatabase/auth/ui/css";

// React SPA (@neondatabase/neon-js)
import "@neondatabase/neon-js/ui/css";
```

```css
/* With Tailwind v4 — Next.js */
@import "tailwindcss";
@import "@neondatabase/auth/ui/tailwind";

/* With Tailwind v4 — React SPA */
@import "tailwindcss";
@import "@neondatabase/neon-js/ui/tailwind";
```

### Provider Setup

Wrap your app with `NeonAuthUIProvider`. Only `authClient` is required.

In Next.js, add `suppressHydrationWarning` to the `<html>` tag in your root layout — the provider injects theme attributes (`className="light"`, `color-scheme`) client-side that don't exist in the server render:

```tsx
// app/layout.tsx
import { NeonAuthUIProvider, UserButton } from "@neondatabase/auth/react";
import { authClient } from "@/lib/auth/client";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NeonAuthUIProvider
          authClient={authClient}
          social={{ providers: ["google", "github", "vercel"] }} // optional
        >
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
```

**Social login** requires TWO configurations: enable in Neon Console AND add `social` prop to provider.

### AuthView (Next.js)

Create `app/auth/[path]/page.tsx`:

```tsx
import { AuthView } from "@neondatabase/auth/react";

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return <AuthView path={path} />;
}
```

Auth paths: `sign-in`, `sign-up`, `forgot-password`, `reset-password`, `magic-link`, `two-factor`, `callback`, `sign-out`

### AccountView (Next.js)

Create `app/account/[path]/page.tsx`:

```tsx
import { AccountView } from "@neondatabase/auth/react";
import { accountViewPaths } from "@neondatabase/auth/react/ui/server";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  return <AccountView path={path} />;
}
```

Account paths: `settings`, `security`

### Conditional Rendering

```tsx
import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth/react";

<SignedOut>
  <a href="/auth/sign-in">Sign In</a>
</SignedOut>
<SignedIn>
  <UserButton />
</SignedIn>
```

## Auth Methods Quick Reference

| Method                                          | Usage                                          |
| ----------------------------------------------- | ---------------------------------------------- |
| `auth.signUp.email({ email, password, name })`  | Create account (server)                        |
| `auth.signIn.email({ email, password })`        | Sign in (server)                               |
| `auth.signIn.social({ provider, callbackURL })` | OAuth sign-in (server)                         |
| `auth.signOut()`                                | Sign out (server)                              |
| `auth.getSession()`                             | Get session (server, requires `force-dynamic`) |
| `authClient.useSession()`                       | Session hook (client, needs React adapter)     |
| `authClient.getSession()`                       | Get session (client, no adapter needed)        |
| `authClient.signIn.email(...)`                  | Sign in (client)                               |
| `authClient.signUp.email(...)`                  | Create account (client)                        |

### Session Data

```typescript
const { data: session } = await auth.getSession();
// session.user: { id, name, email, image, emailVerified, createdAt, updatedAt }
// session.session: { id, expiresAt, token, createdAt, updatedAt, userId }
```

### Error Handling

```typescript
const { error } = await auth.signIn.email({ email, password });
if (error) {
  // error.code: "INVALID_EMAIL_OR_PASSWORD", "EMAIL_NOT_VERIFIED",
  //             "USER_NOT_FOUND", "TOO_MANY_REQUESTS"
  console.error(error.message);
}
```

## Key Imports

```typescript
// Server (Next.js)
import { createNeonAuth } from "@neondatabase/auth/next/server";

// Client (Next.js) -- includes React adapter automatically
import { createAuthClient } from "@neondatabase/auth/next";

// Client (React SPA)
import { createAuthClient } from "@neondatabase/neon-js/auth";

// React adapter (only needed for useSession() in React SPA)
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";

// UI components
import {
  NeonAuthUIProvider,
  AuthView,
  AccountView,
  SignedIn,
  SignedOut,
  UserButton,
} from "@neondatabase/auth/react";
import { accountViewPaths } from "@neondatabase/auth/react/ui/server";

// CSS (choose one, never both; path matches your package)
import "@neondatabase/auth/ui/css"; // Next.js
import "@neondatabase/neon-js/ui/css"; // React SPA
// or in CSS: @import "@neondatabase/auth/ui/tailwind";      (Next.js)
// or in CSS: @import "@neondatabase/neon-js/ui/tailwind";   (React SPA)
```

## Common Mistakes

### Missing NEON_AUTH_COOKIE_SECRET

Required for Next.js, must be 32+ characters for HMAC-SHA256. Generate with `openssl rand -base64 32`.

### Missing force-dynamic on server components

```typescript
// WRONG -- will error
export default async function Page() {
  const { data: session } = await auth.getSession();
}

// CORRECT
export const dynamic = "force-dynamic";
export default async function Page() {
  const { data: session } = await auth.getSession();
}
```

### Using v0.1 API patterns

Use `createNeonAuth()` + `auth.handler()`, not the old standalone `authApiHandler()`. See the [migration guide](https://neon.com/docs/auth/migrate/from-auth-v0.1.md).

### Using useSession() without adapter in React SPA

`createAuthClient(url)` without an adapter returns a vanilla client with no React hooks. Either pass `BetterAuthReactAdapter()` or use UI components (`SignedIn`, etc.) which don't require an adapter.

### Wrong BetterAuthReactAdapter import

Must use subpath import and call as function:

```typescript
// WRONG
import { BetterAuthReactAdapter } from "@neondatabase/neon-js";

// CORRECT
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react";
const client = createAuthClient(url, { adapter: BetterAuthReactAdapter() });
```

### CSS import conflicts

Choose ONE: `ui/css` (without Tailwind) or `ui/tailwind` (with Tailwind v4). Never import both -- causes ~94KB of duplicate styles.

### Missing "use client" directive

Required for any component using `useSession()` or other React hooks.

### Wrong createAuthClient signature

URL is the first argument, not a property in an options object:

```typescript
// WRONG
createAuthClient({ url: myUrl });

// CORRECT (React SPA)
createAuthClient(url);
createAuthClient(url, { adapter: BetterAuthReactAdapter() });

// CORRECT (Next.js) -- no arguments, uses proxy
createAuthClient();
```

## Documentation

| Topic                | URL                                                               |
| -------------------- | ----------------------------------------------------------------- |
| Auth Overview        | https://neon.com/docs/auth/overview.md                            |
| Next.js Quickstart   | https://neon.com/docs/auth/quick-start/nextjs.md                  |
| Next.js API-only     | https://neon.com/docs/auth/quick-start/nextjs-api-only.md         |
| React with UI        | https://neon.com/docs/auth/quick-start/react-router-components.md |
| React API Methods    | https://neon.com/docs/auth/quick-start/react.md                   |
| TanStack Router      | https://neon.com/docs/auth/quick-start/tanstack-router.md         |
| Server SDK Reference | https://neon.com/docs/auth/reference/nextjs-server.md             |
| UI Components Ref    | https://neon.com/docs/auth/reference/ui-components.md             |
| Client SDK Reference | https://neon.com/docs/reference/javascript-sdk.md                 |
| v0.1 Migration Guide | https://neon.com/docs/auth/migrate/from-auth-v0.1.md              |
| OAuth Setup          | https://neon.com/docs/auth/guides/setup-oauth.md                  |
| Email Verification   | https://neon.com/docs/auth/guides/email-verification.md           |
| Branching Auth       | https://neon.com/docs/auth/branching-authentication.md            |
