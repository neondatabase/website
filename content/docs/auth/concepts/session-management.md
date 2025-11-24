---
title: Session Management
subtitle: How Neon Auth manages user sessions and tokens
enableTableOfContents: true
updatedOn: '2025-11-23T00:00:00.000Z'
---

After a user signs in, Neon Auth maintains their authenticated session using two types of tokens: a session cookie for Auth API requests and a JWT token for database queries. The SDK manages both automatically, but understanding how they work helps you build secure applications and debug authentication issues.

## How Sessions Work

When a user signs in, Neon Auth creates a session and returns two tokens:

```typescript
const { data } = await client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// You get back:
// 1. Session cookie (set automatically in browser)
// 2. JWT token (in data.session.access_token)
```

The **session cookie** (`__Secure-neonauth.session_token`) is an HTTP-only cookie that the browser sends automatically with every Auth API request. You never touch this cookie directly—the SDK handles it completely.

The **JWT token** is available in `session.access_token` and contains the user's ID, email, and role. You use this token when you need to authenticate database queries or pass user identity to your backend.

Sessions persist across page reloads. When a user refreshes the page, the browser automatically sends the session cookie, and the SDK retrieves their session, no need to sign in again.

## Listening for Auth Changes

The most common pattern in client applications is to listen for authentication state changes. This keeps your UI in sync when users sign in, sign out, or when sessions refresh:

```typescript
import { useEffect, useState } from 'react';
import { createClient } from '@neondatabase/neon-js';

const client = createClient(process.env.NEXT_PUBLIC_NEON_BASE_URL);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <div>{user ? `Hello ${user.email}` : 'Not signed in'}</div>;
}
```

The `onAuthStateChange()` callback fires when:

- User signs in
- User signs out
- Session token refreshes
- Session expires

This pattern works across browser tabs automatically—sign in on one tab and all tabs receive the update.

## Using JWT Tokens

### Automatic with Data API

When using the unified SDK with Data API, JWT tokens are automatically included in database requests. You don't need to do anything:

```typescript
// JWT is automatically injected into the Authorization header
const { data } = await client.from('posts').select('*');
```

The Data API validates the JWT and makes the user ID available to Row Level Security policies via `auth.user_id()`.

### Manual for Custom Backends

If you're calling your own backend API, get the JWT from the session:

```typescript
const { data } = await client.auth.getSession();
const jwt = data.session.access_token;

await fetch('/api/protected', {
  headers: {
    Authorization: `Bearer ${jwt}`,
  },
});
```

Your backend can validate the JWT using the public keys from `/auth/jwks`:

```typescript
const response = await fetch('https://ep-xxx.neonauth.region.domain/neondb/auth/jwks');
const jwks = await response.json();
// Use jwks to verify JWT signature
```

### JWT Contents

The JWT contains claims you can use for authorization:

```json
{
  "sub": "dc42fa70-09a7-4038-a3bb-f61dda854910",
  "email": "user@example.com",
  "role": "authenticated",
  "exp": 1763848395,
  "iat": 1763847495
}
```

The `sub` claim is the user ID from `neon_auth.user.id`. This is what RLS policies use to identify the current user.

## Protecting Routes

Check for an active session before rendering protected pages:

```typescript
// In your route loader or component
const { data, error } = await client.auth.getSession();

if (error || !data.session) {
  // Redirect to sign in
  redirect('/login');
}

// User is authenticated, render page
```

This pattern works in route loaders (React Router), getServerSideProps (Next.js), or directly in components.

## Session Lifecycle

Sessions are created when users sign in and remain valid until they expire or the user signs out. The SDK automatically refreshes sessions before they expire, so users stay signed in without interruption.

To explicitly end a session:

```typescript
await client.auth.signOut();
```

This deletes the session from the database, clears the cookie, and invalidates the JWT token.

## Multiple Sessions

Users can have multiple active sessions from different devices or browsers. Each session is independent with its own token and expiration time. Signing out from one device doesn't affect other active sessions.

## Security Best Practices

**For session cookies:**

- Never access or modify the session cookie manually
- Always use HTTPS in production (required for secure cookies)
- Let the SDK manage cookie lifecycle

**For JWT tokens:**

- Don't store JWTs in localStorage (vulnerable to XSS)
- Keep tokens in memory or let the SDK manage them
- Always validate JWT signatures in your backend
- Use HTTPS to prevent token interception

## Debugging Sessions

### Check Session Status

```typescript
const { data, error } = await client.auth.getSession();

if (error) {
  console.error('Session error:', error);
} else if (data.session) {
  console.log('Active session for:', data.user.email);
  console.log('Expires:', new Date(data.session.expires_at * 1000));
} else {
  console.log('No active session');
}
```

### Inspect Session Cookie

Open your browser's DevTools:

1. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Look under **Cookies**
3. Find `__Secure-neonauth.session_token`
4. Verify it exists and check the expiration time

If the cookie is missing, the user isn't signed in or the cookie expired.

### Decode JWT

Visit [jwt.io](https://jwt.io) and paste the JWT from `session.access_token` to inspect its contents. You can verify:

- The `sub` claim matches the expected user ID
- The `exp` timestamp hasn't passed
- The `role` claim is correct

Don't paste production JWTs into public tools—use this only for development.

### Query Active Sessions

See all active sessions for debugging:

```sql
SELECT
  u.email,
  s."createdAt",
  s."expiresAt",
  s."ipAddress",
  s."userAgent"
FROM neon_auth.session s
JOIN neon_auth.user u ON u.id = s."userId"
WHERE s."expiresAt" > NOW()
ORDER BY s."createdAt" DESC;
```

This shows who's signed in, when sessions were created, and when they expire.

<NeedHelp/>
