---
title: Next.js Server SDK Reference
subtitle: Server-side authentication API for Next.js with Neon Auth
enableTableOfContents: true
updatedOn: '2026-01-30T00:00:00.000Z'
---

Reference documentation for the Neon Auth Next.js server SDK (`@neondatabase/auth/next/server`). This package provides server-side authentication for Next.js applications using React Server Components, API routes, middleware, and server actions.

For client-side authentication, see the [Client SDK reference](/docs/reference/javascript-sdk). For UI components, see the [UI Components reference](/docs/auth/reference/ui-components).

## Installation

```bash
npm install @neondatabase/auth
```

## Environment Variables

Configure these environment variables in your `.env.local` file:

```bash
# Required: Your Neon Auth server URL
NEON_AUTH_BASE_URL=https://your-neon-auth-url.neon.tech

# Required: Cookie secret for session data signing (32+ characters)
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

<Admonition type="important">
The `NEON_AUTH_COOKIE_SECRET` must be at least 32 characters long for HMAC-SHA256 security. Generate a secure secret with:

```bash
openssl rand -base64 32
```

</Admonition>

## createNeonAuth()

Creates a unified auth instance that provides all server-side authentication functionality.

### Syntax

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth(config);
```

### Configuration

| Parameter                | Type     | Required | Description                                    |
| ------------------------ | -------- | -------- | ---------------------------------------------- |
| `baseUrl`                | `string` | Yes      | Your Neon Auth server URL                      |
| `cookies.secret`         | `string` | Yes      | Secret for signing session cookies (32+ chars) |
| `cookies.sessionDataTtl` | `number` | No       | Session cache TTL in seconds (default: 300)    |
| `cookies.domain`         | `string` | No       | Cookie domain for cross-subdomain support      |

### Example

```typescript
// lib/auth/server.ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    sessionDataTtl: 300,          // Optional: 5 minutes (default)
    domain: ".example.com",        // Optional: for cross-subdomain cookies
  },
});
```

### Returns

Returns an `auth` object with the following methods:

- `handler()` - Creates API route handlers
- `middleware()` - Creates Next.js middleware for route protection
- `getSession()` - Retrieves current session
- All Better Auth server methods (signIn, signUp, signOut, etc.)

## auth.handler()

Creates GET and POST route handlers for the Neon Auth API proxy.

### Syntax

```typescript
export const { GET, POST } = auth.handler();
```

### Usage

Create a catch-all route at `app/api/auth/[...path]/route.ts`:

```typescript
// app/api/auth/[...path]/route.ts
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

This handles all authentication API calls from your client, including:

- Sign in/sign up requests
- OAuth callbacks
- Session management
- Email verification
- Password reset

### Returns

Object with `GET` and `POST` Next.js route handlers.

## auth.middleware()

Creates Next.js middleware for session validation and route protection.

### Syntax

```typescript
export default auth.middleware(options);
```

### Options

| Parameter  | Type     | Required | Description                                                       |
| ---------- | -------- | -------- | ----------------------------------------------------------------- |
| `loginUrl` | `string` | No       | Redirect URL for unauthenticated users (default: `/auth/sign-in`) |

### Usage

Create a `proxy.ts` file in your project root:

```typescript
// proxy.ts
import { auth } from '@/lib/auth/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in'
});

export const config = {
  matcher: [
    // Match all paths except static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

The middleware automatically:

- Validates session cookies on each request
- Provides session data to server components
- Redirects unauthenticated users to the login page (for protected routes)
- Refreshes session tokens when needed

## auth.getSession()

Retrieves the current session in Server Components, Server Actions, and API Routes.

### Syntax

```typescript
const { data: session, error } = await auth.getSession();
```

### Returns

Returns an object with:

| Field   | Type              | Description                                                                     |
| ------- | ----------------- | ------------------------------------------------------------------------------- |
| `data`  | `Session \| null` | Session object containing user and session data, or `null` if not authenticated |
| `error` | `Error \| null`   | Error object if session retrieval failed                                        |

### Session Object

```typescript
{
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  session: {
    id: string;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  };
}
```

### Usage in Server Components

<Admonition type="important">
Server Components that use `auth.getSession()` must export `dynamic = 'force-dynamic'` because session data depends on cookies that can only be read at request time.
</Admonition>

```typescript
// app/dashboard/page.tsx
import { auth } from '@/lib/auth/server';

// Required for Server Components using auth methods
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Welcome, {session.user.name || session.user.email}</h1>
      <p>User ID: {session.user.id}</p>
    </div>
  );
}
```

### Usage in Server Actions

```typescript
// app/actions.ts
'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  // Update user profile...
}
```

### Usage in API Routes

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

## Server-Side Auth Methods

All Better Auth server methods are available directly on the `auth` object for use in Server Actions and API Routes.

### Authentication Methods

#### auth.signIn.email()

Sign in with email and password.

```typescript
'use server';
import { auth } from '@/lib/auth/server';

export async function signIn(formData: FormData) {
  const { data, error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message };
  return { success: true };
}
```

#### auth.signIn.social()

Sign in with OAuth provider.

```typescript
const { data, error } = await auth.signIn.social({
  provider: 'google',
  callbackURL: '/dashboard',
});
```

#### auth.signIn.emailOtp()

Sign in with email OTP (one-time password).

```typescript
const { data, error } = await auth.signIn.emailOtp({
  email: 'user@example.com',
  otp: '123456',
});
```

#### auth.signUp.email()

Create a new user account.

```typescript
const { data, error } = await auth.signUp.email({
  email: 'user@example.com',
  password: 'secure-password',
  name: 'John Doe',
});
```

#### auth.signOut()

Sign out the current user.

```typescript
'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  await auth.signOut();
  redirect('/auth/sign-in');
}
```

### User Management Methods

#### auth.updateUser()

Update the current user's profile.

```typescript
const { data, error } = await auth.updateUser({
  name: 'Jane Doe',
  image: 'https://example.com/avatar.jpg',
});
```

#### auth.changePassword()

Change the current user's password.

```typescript
const { data, error } = await auth.changePassword({
  currentPassword: 'old-password',
  newPassword: 'new-password',
  revokeOtherSessions: true, // Optional: sign out other sessions
});
```

#### auth.sendVerificationEmail()

Send email verification to the current user.

```typescript
const { data, error } = await auth.sendVerificationEmail({
  callbackURL: '/dashboard',
});
```

#### auth.deleteUser()

Delete the current user account.

```typescript
const { data, error } = await auth.deleteUser();
```

### Email OTP Methods

Available when Email OTP authentication is enabled.

#### auth.emailOtp.sendVerificationOtp()

Send a one-time password via email.

```typescript
const { data, error } = await auth.emailOtp.sendVerificationOtp({
  email: 'user@example.com',
});
```

#### auth.emailOtp.verifyEmail()

Verify email with OTP code.

```typescript
const { data, error } = await auth.emailOtp.verifyEmail({
  email: 'user@example.com',
  otp: '123456',
});
```

### Session Management Methods

#### auth.listSessions()

List all active sessions for the current user.

```typescript
const { data, error } = await auth.listSessions();
```

#### auth.revokeSession()

Revoke a specific session.

```typescript
const { data, error } = await auth.revokeSession({
  sessionId: 'session-id',
});
```

#### auth.revokeOtherSessions()

Revoke all sessions except the current one.

```typescript
const { data, error } = await auth.revokeOtherSessions();
```

### Organization Methods

Available when organizations plugin is enabled.

#### auth.organization.create()

Create a new organization.

```typescript
const { data, error } = await auth.organization.create({
  name: 'My Organization',
  slug: 'my-org',
});
```

#### auth.organization.list()

List user's organizations.

```typescript
const { data, error } = await auth.organization.list();
```

#### auth.organization.inviteMember()

Invite a member to an organization.

```typescript
const { data, error } = await auth.organization.inviteMember({
  organizationId: 'org-id',
  email: 'member@example.com',
  role: 'member',
});
```

### Admin Methods

Available for users with admin role.

#### auth.admin.listUsers()

List all users.

```typescript
const { data, error } = await auth.admin.listUsers({
  limit: 100,
  offset: 0,
});
```

#### auth.admin.banUser()

Ban a user.

```typescript
const { data, error } = await auth.admin.banUser({
  userId: 'user-id',
  reason: 'Violation of terms',
});
```

#### auth.admin.setRole()

Set a user's role.

```typescript
const { data, error } = await auth.admin.setRole({
  userId: 'user-id',
  role: 'admin',
});
```

## Performance Features

### Session Caching

Session data is automatically cached in a signed, HTTP-only cookie to reduce API calls to the Auth Server by 95-99%.

**Key features:**

- Default cache TTL: 5 minutes (300 seconds)
- Configurable via `cookies.sessionDataTtl`
- Automatic expiration based on JWT `exp` claim
- Synchronous cache clearing on sign-out
- Secure HMAC-SHA256 signing

**Cache behavior:**

```typescript
// First call: Fetches from Auth Server
const { data: session } = await auth.getSession();

// Subsequent calls within TTL: Uses cached data (no API call)
const { data: session2 } = await auth.getSession();
```

### Request Deduplication

Multiple concurrent `getSession()` calls are automatically deduplicated:

- Single network request for concurrent calls
- 10x faster cold starts
- Reduces server load by N-1 for N concurrent calls

## Configuration Reference

### Complete Configuration Example

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  // Required: Your Neon Auth server URL
  baseUrl: process.env.NEON_AUTH_BASE_URL!,

  cookies: {
    // Required: Secret for signing session cookies (32+ characters)
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,

    // Optional: Session cache TTL in seconds (default: 300)
    // How long to cache session data in cookies before re-fetching
    sessionDataTtl: 300,

    // Optional: Cookie domain for cross-subdomain support
    // Allows sharing session across subdomains
    // Example: ".example.com" works for app.example.com, api.example.com
    domain: ".example.com",
  },
});
```

### Configuration Options Table

| Option                   | Type     | Required | Default     | Description                                                                |
| ------------------------ | -------- | -------- | ----------- | -------------------------------------------------------------------------- |
| `baseUrl`                | `string` | Yes      | -           | Your Neon Auth server URL from the Neon Console                            |
| `cookies.secret`         | `string` | Yes      | -           | Secret for HMAC-SHA256 signing of session cookies (must be 32+ characters) |
| `cookies.sessionDataTtl` | `number` | No       | `300`       | Time-to-live for cached session data in seconds                            |
| `cookies.domain`         | `string` | No       | `undefined` | Cookie domain for cross-subdomain sessions (e.g., ".example.com")          |

## Project Structure

Recommended file structure for Next.js with Neon Auth:

```
app/
├── api/
│   └── auth/
│       └── [...path]/
│           └── route.ts      # Auth API handlers (auth.handler())
├── auth/
│   └── [path]/
│       └── page.tsx          # Auth views (sign-in, sign-up, etc.)
├── dashboard/
│   └── page.tsx              # Protected page (uses auth.getSession())
├── actions.ts                # Server actions (uses auth methods)
└── layout.tsx                # Root layout

lib/
└── auth/
    ├── server.ts             # Server auth instance (createNeonAuth())
    └── client.ts             # Client auth instance (for client components)

proxy.ts                      # Next.js middleware (auth.middleware())
.env.local                    # Environment variables
```

## Migration from v0.1

If you're upgrading from Neon Auth SDK v0.1, see the [migration guide](/docs/auth/migrate/from-auth-v0.1) for step-by-step instructions.

## Related Documentation

- [Client SDK Reference](/docs/reference/javascript-sdk) - Client-side authentication
- [UI Components Reference](/docs/auth/reference/ui-components) - Pre-built auth UI
- [Next.js Quickstart](/docs/auth/quick-start/nextjs) - Getting started guide
- [Migration Guide](/docs/auth/migrate/from-auth-v0.1) - Upgrading from v0.1

<NeedHelp/>
