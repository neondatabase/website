---
title: Authentication Flow
subtitle: Understanding the complete sign-in and sign-up process
enableTableOfContents: true
updatedOn: '2025-11-23T00:00:00.000Z'
---

When a user signs in to your application, several steps happen behind the scenes to authenticate them and establish a secure session. This guide walks through the complete authentication flow from your code to the database.

## Architecture Overview

Neon Auth is a managed REST API service built on Better Auth that connects directly to your Neon database. You use the SDK in your application and configure settings in the Console—no servers to manage.

```
Your App (SDK)
    ↓ HTTP requests
Neon Auth Service (REST API)
    ↓ connects to database
Your Neon Database (neon_auth schema)
```

All authentication data—users, sessions, OAuth configurations—lives in your database's `neon_auth` schema. You can query these tables directly with SQL for debugging, analytics, or custom logic.

## Complete Sign-In Flow

Here's what happens when a user signs in, from your code to the database:

<Steps>

## User Signs In

Your application calls the SDK's sign-in method:

```typescript
const { data, error } = await client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

**What happens behind the scenes:**

1. SDK makes HTTP POST to `{NEON_AUTH_URL}/auth/sign-in/email`
2. Auth service validates credentials against `neon_auth.account` table
3. Service creates a session in `neon_auth.session` table
4. Response includes session cookie and user data

**Response you receive:**

```typescript
{
  data: {
    session: {
      access_token: "eyJhbGc...",  // JWT token
      expires_at: 1763848395,
      // ... other session fields
    },
    user: {
      id: "dc42fa70-09a7-4038-a3bb-f61dda854910",
      email: "user@example.com",
      emailVerified: true,
      // ... other user fields
    }
  }
}
```

## Session Cookie is Set

The Auth service automatically sets an HTTP-only cookie (`__Secure-neonauth.session_token`) that your browser stores. This cookie:

- Contains an opaque session token (not a JWT)
- Is automatically sent with every request to the Auth API
- Is secure (HTTPS only, HttpOnly, SameSite=None)
- Is managed entirely by the SDK—you never touch it

**Where to see it:** Open DevTools → Application → Cookies → look for `__Secure-neonauth.session_token`

## JWT Token is Retrieved

The SDK automatically retrieves a JWT token and stores it in `session.access_token`. You don't need to call `/auth/token` separately—the SDK handles this behind the scenes.

**What's in the JWT:**

```json
{
  "sub": "dc42fa70-09a7-4038-a3bb-f61dda854910", // User ID
  "email": "user@example.com",
  "role": "authenticated",
  "exp": 1763848395, // Expiration timestamp
  "iat": 1763847495 // Issued at timestamp
}
```

The `sub` claim contains the user ID from `neon_auth.user.id`. This is what Row Level Security policies use to identify the current user.

## JWT is Used for Database Queries

When you query your database via Data API, the SDK automatically includes the JWT in the `Authorization` header:

```typescript
// JWT is automatically included in Authorization header
const { data } = await client.from('posts').select('*');
```

**What happens:**

1. SDK gets JWT from `session.access_token`
2. Adds `Authorization: Bearer <jwt-token>` header
3. Data API validates JWT signature using JWKS public keys
4. Data API extracts user ID from JWT and makes it available to RLS policies
5. Your query runs with the authenticated user context

</Steps>

## Sign-Up Flow

The sign-up flow is similar but creates a new user:

```typescript
const { data, error } = await client.auth.signUp({
  email: 'newuser@example.com',
  password: 'securepassword',
});
```

**What happens:**

1. SDK makes HTTP POST to `{NEON_AUTH_URL}/auth/sign-up/email`
2. Auth service creates a new row in `neon_auth.user` table
3. Auth service creates credentials in `neon_auth.account` table (password is hashed)
4. If email verification is required, creates a verification token in `neon_auth.verification` table
5. Auth service creates a session (or waits for verification, depending on configuration)
6. Response includes user data and session (if auto-signed-in)

## OAuth Flow

OAuth authentication (Google, GitHub, etc.) follows a similar pattern:

```typescript
// Redirect user to OAuth provider
await client.auth.signInWithOAuth({
  provider: 'google',
  redirectTo: 'http://localhost:3000/auth/callback',
});
```

**What happens:**

1. SDK redirects user to OAuth provider (Google, GitHub, etc.)
2. User authenticates with provider
3. Provider redirects back to your app with authorization code
4. SDK exchanges code for access token
5. Auth service creates or updates user in `neon_auth.user`
6. Auth service stores OAuth tokens in `neon_auth.account`
7. Session is created and user is signed in

## Database as Source of Truth

Unlike authentication services that store user data externally, Neon Auth stores everything directly in your Neon database:

- **No sync delays** - Changes are immediate
- **Direct SQL access** - Query users, sessions, and configurations with SQL
- **Native branching** - Each database branch has its own isolated auth instance
- **You own your data** - All authentication data lives in your database

**Example query:**

```sql
SELECT id, email, "emailVerified", "createdAt"
FROM neon_auth.user
ORDER BY "createdAt" DESC;
```

## Using JWTs with Data API

When you enable the [Data API](/docs/data-api/get-started), JWT tokens from Neon Auth are automatically validated and the user ID is made available via the `auth.user_id()` function. This enables Row-Level Security policies to restrict data access based on the authenticated user.

**Learn more about securing your data:**

- [Row-Level Security with Neon](/docs/guides/row-level-security)
- [Simplify RLS with Drizzle](/docs/guides/rls-drizzle)

## What's Next

<DetailIconCards>

<a href="/docs/auth/concepts/session-management" description="Learn how tokens and sessions work" icon="privacy">Session Management</a>

<a href="/docs/auth/concepts/branching-authentication" description="How auth works with database branches" icon="split-branch">Branching Authentication</a>

<a href="/docs/guides/row-level-security" description="Secure your data with RLS policies" icon="check">Row Level Security</a>

</DetailIconCards>

<NeedHelp/>
