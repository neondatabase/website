---
title: Next.js Server SDK Reference
subtitle: Server-side authentication API for Next.js with Neon Auth
summary: >-
  Covers the setup of the Neon Auth Next.js server SDK for implementing
  server-side authentication in Next.js applications, detailing installation,
  environment variable configuration, and core functionalities like session
  management and middleware creation.
enableTableOfContents: true
layout: wide
updatedOn: '2026-02-06T22:07:32.772Z'
---

Reference documentation for the Neon Auth Next.js server SDK (`@neondatabase/auth/next/server`). This package provides server-side authentication for Next.js applications using React Server Components, API routes, middleware, and server actions.

For client-side authentication, see the [Client SDK reference](/docs/reference/javascript-sdk). For UI components, see the [UI Components reference](/docs/auth/reference/ui-components).

<TwoColumnLayout>

<TwoColumnLayout.Item title="Installation" id="installation">
<TwoColumnLayout.Block>

Install the Neon Auth package in your Next.js project using npm, yarn, pnpm, or bun.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash
npm install @neondatabase/auth
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Environment variables" id="environment-variables">
<TwoColumnLayout.Block>

Configure these environment variables in your `.env.local` file:

- **NEON_AUTH_BASE_URL** (required): Your Neon Auth server URL from the Neon Console
- **NEON_AUTH_COOKIE_SECRET** (required): Secret for signing session cookies (must be 32+ characters for HMAC-SHA256 security)

Generate a secure secret with: `openssl rand -base64 32`

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash
# Required: Your Neon Auth server URL
NEON_AUTH_BASE_URL=https://your-neon-auth-url.neon.tech

# Required: Cookie secret for session data signing (32+ characters)
NEON_AUTH_COOKIE_SECRET=your-secret-at-least-32-characters-long
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="createNeonAuth()" method="createNeonAuth(config)" id="createneonauth">
<TwoColumnLayout.Block>

Creates a unified auth instance that provides all server-side authentication functionality.

Returns an `auth` object with:

- `handler()` - Creates API route handlers
- `middleware()` - Creates Next.js middleware for route protection
- `getSession()` - Retrieves current session
- All Better Auth server methods (signIn, signUp, signOut, etc.)

### Parameters

| Parameter                       | Type   | Required | Default |
| ------------------------------- | ------ | -------- | ------- |
| <tt>baseUrl</tt>                | string | ✓        | -       |
| <tt>cookies.secret</tt>         | string | ✓        | -       |
| <tt>cookies.sessionDataTtl</tt> | number |          | 300     |
| <tt>cookies.domain</tt>         | string |          | -       |

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

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

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.handler()" method="auth.handler()" id="auth-handler">
<TwoColumnLayout.Block>

Creates GET and POST route handlers for the Neon Auth API proxy.

Create a catch-all route at `app/api/auth/[...path]/route.ts`. This handles all authentication API calls from your client, including:

- Sign in/sign up requests
- OAuth callbacks
- Session management
- Email verification
- Password reset

### Returns

Object with `GET` and `POST` Next.js route handlers.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
// app/api/auth/[...path]/route.ts
import { auth } from '@/lib/auth/server';

export const { GET, POST } = auth.handler();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.middleware()" method="auth.middleware(options)" id="auth-middleware">
<TwoColumnLayout.Block>

Creates Next.js middleware for session validation and route protection.

The middleware automatically:

- Validates session cookies on each request
- Provides session data to server components
- Redirects unauthenticated users to the login page
- Refreshes session tokens when needed

### Parameters

<details>
<summary>View parameters</summary>

| Parameter         | Type   | Required | Default         |
| ----------------- | ------ | -------- | --------------- |
| <tt>loginUrl</tt> | string |          | `/auth/sign-in` |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
// middleware.ts
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

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.getSession()" method="auth.getSession()" id="auth-getsession">
<TwoColumnLayout.Block>

Retrieves the current session in Server Components, Server Actions, and API Routes.

- Returns cached session if available (fast)
- Automatically refreshes expired tokens
- Returns null if no active session

Server Components that use `auth.getSession()` must export `dynamic = 'force-dynamic'` because session data depends on cookies.

### Returns

| Field   | Type            | Description                                          |
| ------- | --------------- | ---------------------------------------------------- |
| `data`  | Session \| null | Session with user data, or null if not authenticated |
| `error` | Error \| null   | Error object if session retrieval failed             |

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Server Component", "Server Action", "API Route"]}>

```typescript
// app/dashboard/page.tsx
import { auth } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return <h1>Welcome, {session.user.name}</h1>;
}
```

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

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.signIn.email()" method="auth.signIn.email(credentials)" id="auth-signin-email">
<TwoColumnLayout.Block>

Sign in with email and password. Use in Server Actions for form-based authentication.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter         | Type   | Required |
| ----------------- | ------ | -------- |
| <tt>email</tt>    | string | ✓        |
| <tt>password</tt> | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const { data, error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message };
  redirect('/dashboard');
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.signIn.social()" method="auth.signIn.social(options)" id="auth-signin-social">
<TwoColumnLayout.Block>

Sign in with OAuth provider like Google, GitHub, etc.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type   | Required |
| -------------------- | ------ | -------- |
| <tt>provider</tt>    | string | ✓        |
| <tt>callbackURL</tt> | string |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.signIn.social({
  provider: 'google',
  callbackURL: '/dashboard',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.signIn.emailOtp()" method="auth.signIn.emailOtp(credentials)" id="auth-signin-emailotp">
<TwoColumnLayout.Block>

Sign in with email OTP (one-time password). First call `emailOtp.sendVerificationOtp()` to send the code.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type   | Required |
| -------------- | ------ | -------- |
| <tt>email</tt> | string | ✓        |
| <tt>otp</tt>   | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.signIn.emailOtp({
  email: 'user@example.com',
  otp: '123456',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.signUp.email()" method="auth.signUp.email(credentials)" id="auth-signup-email">
<TwoColumnLayout.Block>

Create a new user account with email and password.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter         | Type   | Required |
| ----------------- | ------ | -------- |
| <tt>email</tt>    | string | ✓        |
| <tt>password</tt> | string | ✓        |
| <tt>name</tt>     | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.signUp.email({
  email: 'user@example.com',
  password: 'secure-password',
  name: 'John Doe',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.signOut()" method="auth.signOut()" id="auth-signout">
<TwoColumnLayout.Block>

Sign out the current user. Clears session and authentication tokens.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
'use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  await auth.signOut();
  redirect('/auth/sign-in');
}
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.updateUser()" method="auth.updateUser(data)" id="auth-updateuser">
<TwoColumnLayout.Block>

Update the current user's profile. Password updates require the password reset flow for security.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type                | Required |
| -------------- | ------------------- | -------- |
| <tt>name</tt>  | string \| undefined |          |
| <tt>image</tt> | string \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.updateUser({
  name: 'Jane Doe',
  image: 'https://example.com/avatar.jpg',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.changePassword()" method="auth.changePassword(passwords)" id="auth-changepassword">
<TwoColumnLayout.Block>

Change the current user's password.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter                    | Type    | Required |
| ---------------------------- | ------- | -------- |
| <tt>currentPassword</tt>     | string  | ✓        |
| <tt>newPassword</tt>         | string  | ✓        |
| <tt>revokeOtherSessions</tt> | boolean |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.changePassword({
  currentPassword: 'old-password',
  newPassword: 'new-password',
  revokeOtherSessions: true,
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.sendVerificationEmail()" method="auth.sendVerificationEmail(options)" id="auth-sendverificationemail">
<TwoColumnLayout.Block>

Send email verification to the current user.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type   | Required |
| -------------------- | ------ | -------- |
| <tt>callbackURL</tt> | string |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.sendVerificationEmail({
  callbackURL: '/dashboard',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.deleteUser()" method="auth.deleteUser()" id="auth-deleteuser">
<TwoColumnLayout.Block>

Delete the current user account. This action is irreversible.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.deleteUser();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.emailOtp.sendVerificationOtp()" method="auth.emailOtp.sendVerificationOtp(options)" id="auth-emailotp-sendverificationotp">
<TwoColumnLayout.Block>

Send a one-time password via email. Available when Email OTP authentication is enabled.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type   | Required |
| -------------- | ------ | -------- |
| <tt>email</tt> | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.emailOtp.sendVerificationOtp({
  email: 'user@example.com',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.emailOtp.verifyEmail()" method="auth.emailOtp.verifyEmail(credentials)" id="auth-emailotp-verifyemail">
<TwoColumnLayout.Block>

Verify email with OTP code.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type   | Required |
| -------------- | ------ | -------- |
| <tt>email</tt> | string | ✓        |
| <tt>otp</tt>   | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.emailOtp.verifyEmail({
  email: 'user@example.com',
  otp: '123456',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.listSessions()" method="auth.listSessions()" id="auth-listsessions">
<TwoColumnLayout.Block>

List all active sessions for the current user.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.listSessions();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.revokeSession()" method="auth.revokeSession(options)" id="auth-revokesession">
<TwoColumnLayout.Block>

Revoke a specific session by ID.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter          | Type   | Required |
| ------------------ | ------ | -------- |
| <tt>sessionId</tt> | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.revokeSession({
  sessionId: 'session-id',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.revokeOtherSessions()" method="auth.revokeOtherSessions()" id="auth-revokeothersessions">
<TwoColumnLayout.Block>

Revoke all sessions except the current one.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.revokeOtherSessions();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.organization.create()" method="auth.organization.create(data)" id="auth-organization-create">
<TwoColumnLayout.Block>

Create a new organization. Available when the organizations plugin is enabled.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter     | Type   | Required |
| ------------- | ------ | -------- |
| <tt>name</tt> | string | ✓        |
| <tt>slug</tt> | string |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.organization.create({
  name: 'My Organization',
  slug: 'my-org',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.organization.list()" method="auth.organization.list()" id="auth-organization-list">
<TwoColumnLayout.Block>

List the current user's organizations.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.organization.list();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.organization.inviteMember()" method="auth.organization.inviteMember(options)" id="auth-organization-invitemember">
<TwoColumnLayout.Block>

Invite a member to an organization.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter               | Type   | Required |
| ----------------------- | ------ | -------- |
| <tt>organizationId</tt> | string | ✓        |
| <tt>email</tt>          | string | ✓        |
| <tt>role</tt>           | string |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.organization.inviteMember({
  organizationId: 'org-id',
  email: 'member@example.com',
  role: 'member',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.admin.listUsers()" method="auth.admin.listUsers(options)" id="auth-admin-listusers">
<TwoColumnLayout.Block>

List all users. Available for users with admin role.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required |
| --------------- | ------ | -------- |
| <tt>limit</tt>  | number |          |
| <tt>offset</tt> | number |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.admin.listUsers({
  limit: 100,
  offset: 0,
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.admin.banUser()" method="auth.admin.banUser(options)" id="auth-admin-banuser">
<TwoColumnLayout.Block>

Ban a user. Available for users with admin role.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required |
| --------------- | ------ | -------- |
| <tt>userId</tt> | string | ✓        |
| <tt>reason</tt> | string |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.admin.banUser({
  userId: 'user-id',
  reason: 'Violation of terms',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="auth.admin.setRole()" method="auth.admin.setRole(options)" id="auth-admin-setrole">
<TwoColumnLayout.Block>

Set a user's role. Available for users with admin role.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter       | Type   | Required |
| --------------- | ------ | -------- |
| <tt>userId</tt> | string | ✓        |
| <tt>role</tt>   | string | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await auth.admin.setRole({
  userId: 'user-id',
  role: 'admin',
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Performance features" id="performance-features">
<TwoColumnLayout.Block>

### Session caching

Session data is automatically cached in a signed, HTTP-only cookie to reduce API calls to the Auth Server by 95-99%.

- Default cache TTL: 5 minutes (300 seconds)
- Configurable via `cookies.sessionDataTtl`
- Automatic expiration based on JWT `exp` claim
- Synchronous cache clearing on sign-out
- Secure HMAC-SHA256 signing

### Request deduplication

Multiple concurrent `getSession()` calls are automatically deduplicated:

- Single network request for concurrent calls
- 10x faster cold starts
- Reduces server load

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
// First call: Fetches from Auth Server
const { data: session } = await auth.getSession();

// Subsequent calls within TTL: Uses cached data (no API call)
const { data: session2 } = await auth.getSession();
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Configuration reference" id="configuration-reference">
<TwoColumnLayout.Block>

Complete configuration options for `createNeonAuth()`:

| Option                   | Type   | Required | Default   |
| ------------------------ | ------ | -------- | --------- |
| `baseUrl`                | string | Yes      | -         |
| `cookies.secret`         | string | Yes      | -         |
| `cookies.sessionDataTtl` | number | No       | 300       |
| `cookies.domain`         | string | No       | undefined |

- **baseUrl**: Your Neon Auth server URL from the Neon Console
- **cookies.secret**: Secret for HMAC-SHA256 signing (32+ characters)
- **cookies.sessionDataTtl**: Cache TTL in seconds
- **cookies.domain**: For cross-subdomain sessions (e.g., ".example.com")

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Project structure" id="project-structure">
<TwoColumnLayout.Block>

Recommended file structure for Next.js with Neon Auth:

- `app/api/auth/[...path]/route.ts` - Auth API handlers
- `app/auth/[path]/page.tsx` - Auth views (sign-in, sign-up)
- `app/dashboard/page.tsx` - Protected pages
- `lib/auth/server.ts` - Server auth instance
- `lib/auth/client.ts` - Client auth instance
- `middleware.ts` - Next.js middleware

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```
app/
├── api/
│   └── auth/
│       └── [...path]/
│           └── route.ts
├── auth/
│   └── [path]/
│       └── page.tsx
├── dashboard/
│   └── page.tsx
├── actions.ts
└── layout.tsx

lib/
└── auth/
    ├── server.ts
    └── client.ts

middleware.ts
.env.local
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

</TwoColumnLayout>

## Migration from v0.1

If you're upgrading from Neon Auth SDK v0.1, see the [migration guide](/docs/auth/migrate/from-auth-v0.1) for step-by-step instructions.

## Related documentation

- [Client SDK Reference](/docs/reference/javascript-sdk) - Client-side authentication
- [UI Components Reference](/docs/auth/reference/ui-components) - Pre-built auth UI
- [Next.js Quickstart](/docs/auth/quick-start/nextjs) - Getting started guide
- [Migration Guide](/docs/auth/migrate/from-auth-v0.1) - Upgrading from v0.1

<NeedHelp/>
