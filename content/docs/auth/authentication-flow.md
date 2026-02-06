---
title: Authentication flow
subtitle: Understanding the complete sign-in and sign-up process
summary: >-
  Covers the authentication flow for sign-in and sign-up processes using Neon
  Auth, detailing the SDK integration, session creation, and database
  interactions.
enableTableOfContents: true
updatedOn: '2026-02-06T22:07:32.735Z'
---

<FeatureBetaProps feature_name="Neon Auth with Better Auth" />

This guide explains the authentication flow: how sign-in works from SDK call to session creation.

<Admonition type="note">
Anyone can sign up for your application by default. Support for restricted signups is coming soon. Until then, consider adding a verification step by enabling [email verification](/docs/auth/guides/email-verification) via verification link or verification code.
</Admonition>

## Architecture overview

Neon Auth is a managed REST API service built on Better Auth that connects directly to your Neon database. You use the SDK in your application and configure settings in the Console—no servers to manage.

```
Your App (SDK)
    ↓ HTTP requests
Neon Auth Service (REST API)
    ↓ connects to database
Your Neon Database (neon_auth schema)
```

All authentication data—users, sessions, OAuth configurations—lives in your database's `neon_auth` schema. You can query these tables directly with SQL for debugging, analytics, or custom logic.

## Complete sign-in flow

Here's what happens when a user signs in, from your code to the database:

<Steps>

## User signs in

Your application calls the SDK's sign-in method:

```typescript
const { data, error } = await client.auth.signIn.email({
  email: 'user@example.com',
  password: 'password',
});
```

The SDK posts to `{NEON_AUTH_URL}/auth/sign-in/email`. The Auth service validates credentials against `neon_auth.account`, creates a session in `neon_auth.session`, and returns the session cookie with user data.

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

## Session cookie is set

The Auth service sets an HTTP-only cookie (`__Secure-neonauth.session_token`) in your browser. This cookie:

- Contains an opaque session token (not a JWT)
- Is automatically sent with every request to the Auth API
- Is secure (HTTPS only, HttpOnly, SameSite=None)
- Is managed entirely by the SDK—you never touch it

**Where to see it:** Open DevTools → Application → Cookies → look for `__Secure-neonauth.session_token`

## JWT token is retrieved

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

## JWT is used for database queries

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

## Sign-up flow

The sign-up flow creates a new user:

```typescript
const { data, error } = await client.auth.signUp.email({
  email: 'newuser@example.com',
  password: 'securepassword',
  name: 'New User',
});
```

The SDK posts to `{NEON_AUTH_URL}/auth/sign-up/email`. The Auth service creates a new row in `neon_auth.user`, stores hashed credentials in `neon_auth.account`, and returns user data. If email verification is required, it creates a verification token in `neon_auth.verification` and may delay session creation until verification.

<Admonition type="note">
By default, anyone can sign up for your application. To add an additional verification layer, enable email verification (see [Email Verification](/docs/auth/guides/email-verification)). Built-in signup restrictions are coming soon.
</Admonition>

## OAuth flow

OAuth authentication (Google, GitHub, Vercel, etc.):

```typescript
await client.auth.signIn.social({
  provider: 'google',
  callbackURL: 'http://localhost:3000/auth/callback',
});
```

The SDK redirects to the OAuth provider. After the user authenticates, the provider redirects back with an authorization code. The SDK exchanges the code for an access token, then the Auth service creates or updates the user in `neon_auth.user`, stores OAuth tokens in `neon_auth.account`, and creates a session.

## Database as source of truth

Neon Auth stores all data in your database's `neon_auth` schema:

- Changes are immediate (no sync delays)
- Query auth data directly with SQL
- Each branch has isolated auth data
- You own your data

```sql
SELECT id, email, "emailVerified", "createdAt"
FROM neon_auth.user
ORDER BY "createdAt" DESC;
```

## Data API integration

When you enable the [Data API](/docs/data-api/get-started), JWT tokens from Neon Auth are validated automatically. The user ID is available via the `auth.uid()` function, enabling Row-Level Security policies to grant data access based on the authenticated user.

**Example RLS policy:**

```sql
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT TO authenticated
USING (user_id = auth.uid());
```

**Learn more about securing your data:**

- [Row-Level Security with Neon](/docs/guides/row-level-security)
- [Simplify RLS with Drizzle](/docs/guides/rls-drizzle)

## What's next

<DetailIconCards>

<a href="/docs/auth/branching-authentication" description="How auth works with database branches" icon="split-branch">Branching Authentication</a>

<a href="/docs/guides/row-level-security" description="Secure your data with RLS policies" icon="check">Row Level Security</a>

</DetailIconCards>

<NeedHelp/>
