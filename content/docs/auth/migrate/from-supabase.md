---
title: Migrate from Supabase Auth to Neon Auth
subtitle: Update your authentication from Supabase to Neon in a few steps
enableTableOfContents: true
updatedOn: '2025-11-21T00:00:00.000Z'
---

Neon Auth provides a Supabase-compatible API. This guide shows how to switch your authentication provider from Supabase Auth to Neon Auth.

<Admonition type="About user migration">
Existing password-based users cannot migrate due to different hashing algorithms. They'll need to create new accounts or re-authenticate via OAuth. This guide works best for new projects, early development, or rebuilding your app.
</Admonition>

## Prerequisites

- A Neon project with Auth enabled ([enable it here](https://console.neon.tech))
- Your Neon base URL (get it from Console after enabling Auth)

<Steps>

## Install Neon SDK

Replace the Supabase SDK with Neon's:

<CodeWithLabel label="Terminal">

```bash
npm uninstall @supabase/supabase-js
npm install @neondatabase/neon-js
```

</CodeWithLabel>

## Update environment variables

Replace your Supabase credentials with your Neon base URL:

<CodeWithLabel label=".env">

```env
# Remove these:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add this:
VITE_NEON_BASE_URL=https://ep-xxx.region.domain/neondb/
```

</CodeWithLabel>

Get your base URL from the Neon Console after enabling Auth.

<Admonition type="note">
The `VITE_` prefix is for Vite. Use `NEXT_PUBLIC_` for Next.js, or no prefix for Node.js.
</Admonition>

## Update client initialization

Find your Supabase client file, typically `src/supabase.ts` or `src/lib/supabase.ts`, and update it:

**Before (Supabase):**

<CodeWithLabel label="src/supabase.ts">

```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
```

</CodeWithLabel>

**After (Neon Auth):**

<CodeWithLabel label="src/auth.ts">

```typescript
import { createClient } from '@neondatabase/neon-js';

export const client = createClient(import.meta.env.VITE_NEON_BASE_URL);
```

</CodeWithLabel>

This example renames the file to `auth.ts` and the variable to `client` for a provider-agnostic setup. You can use any naming, just stay consistent throughout your codebase.

Find **all files that import this client** and update them:

```typescript
// Before
import { supabase } from './supabase';

// After
import { client } from './auth';
```

## Your auth code stays the same

After updating imports, use find/replace to change all instances throughout your codebase:

**`supabase.` → `client.`**

Your authentication methods, parameters, and responses work identically. Your components, hooks, and auth flows don't change.

<CodeWithLabel label="Auth methods">

```typescript
// Sign up
await client.auth.signUp({ email, password });

// Sign in with password
await client.auth.signInWithPassword({ email, password });

// OAuth sign in
await client.auth.signInWithOAuth({ provider: 'google' });

// Get current user
const {
  data: { user },
} = await client.auth.getUser();

// Get session
const {
  data: { session },
} = await client.auth.getSession();

// Sign out
await client.auth.signOut();
```

</CodeWithLabel>

## Enable Data API for database queries (optional)

If you were using Supabase's `client.from()` queries, enable Neon's Data API to get the same experience.

In your Neon Console:

1. Go to **Data API** and enable it
2. Go to **Data API → Configuration**
3. Select **Other Provider**
4. Paste your Neon Auth JWKS URL (found in **Auth → Configuration**)

Your existing `client.from()` queries will work the same as with Supabase.

<Admonition type="note">
For production apps, use Row Level Security (RLS) to secure your data. See our [RLS with Drizzle guide](/docs/guides/rls-drizzle) for the recommended setup.
</Admonition>

## Test the migration

Run your app:

<CodeWithLabel label="Terminal">

```bash
npm run dev
```

</CodeWithLabel>

**Test your app:**

1. Sign up a new user
2. Sign in with that user
3. Verify the session persists across page reloads
4. If you enabled Data API: Test user actions that involve database queries (creating posts, loading lists, etc.)

Your authentication and database queries should work the same as they did with Supabase.

**Verify users in Neon Console:**

Go to **Auth → Users** in the Neon Console to see your newly created users, or query directly:

<CodeWithLabel label="SQL Editor">

```sql
SELECT id, email, createdAt
FROM neon_auth.user
ORDER BY createdAt DESC;
```

</CodeWithLabel>

</Steps>

## What changed?

| Feature                   | Supabase                            | Neon Auth               |
| ------------------------- | ----------------------------------- | ----------------------- |
| **User ID type**          | `UUID`                              | `TEXT` (~21 characters) |
| **Client config**         | URL + anon key                      | Single base URL         |
| **Environment variables** | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | `NEON_BASE_URL`         |
| **SDK package**           | `@supabase/supabase-js`             | `@neondatabase/neon-js` |

## API compatibility

Neon Auth supports most Supabase Auth methods including sign up, sign in (password and OAuth), session management, user updates, and email verification. See the [JavaScript SDK reference](/docs/reference/javascript-sdk) for the complete API.

**Not supported:**

| Method                | Details                             |
| --------------------- | ----------------------------------- |
| `signInWithPhone()`   | Phone authentication (SMS/WhatsApp) |
| `signInAnonymously()` | Anonymous sign-in                   |
| SAML SSO methods      | Enterprise SAML authentication      |
| Web3 authentication   | Blockchain wallet sign-in           |

**Different behavior:**

| Method             | Notes                                                                                                                                                                                                      |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateUser()`     | Does not support `password` or `email` parameters                                                                                                                                                          |
| Email verification | Unlike Supabase's automatic verification flow, Neon Auth requires you to build the verification UI in your app. See [Email Verification](/docs/auth/guides/email-verification) for implementation details. |

If you're using any unsupported methods or verification flows, you'll need to adjust your implementation.

<NeedHelp/>
