---
title: Migrate from Supabase to Neon
subtitle: Switch from Supabase Auth and Database to Neon in a few steps
summary: >-
  Step-by-step migration from Supabase Auth and Supabase database to Managed BetterAuth
  and Neon Data API. Replace `@supabase/supabase-js` with `@neondatabase/neon-js`,
  swap environment variables, and update client initialization while keeping
  existing auth method calls and `from()` database queries code-compatible.
  Existing password-based users cannot transfer due to incompatible password
  hashing algorithms, so this guide targets new projects, early development, or
  OAuth-only apps. Managed BetterAuth does not support phone authentication (SMS/WhatsApp),
  SAML SSO, or Web3 wallet sign-in.
enableTableOfContents: true
updatedOn: '2026-07-11T12:07:28.894Z'
---

<FeatureBetaProps feature_name="Managed BetterAuth" />

Managed BetterAuth provides a Supabase-compatible API, and Neon Data API provides PostgreSQL database access. This guide shows how to migrate from Supabase to Neon.

<Admonition type="About user migration">
Existing password-based users cannot migrate due to different hashing algorithms. They'll need to create new accounts or re-authenticate via OAuth. This guide works best for new projects, early development, or rebuilding your app.
</Admonition>

## Prerequisites

- A Neon project ([create one here](https://console.neon.tech))
- Data API enabled (Managed BetterAuth is enabled by default when you enable Data API):
  - Go to **Data API** in the Neon Console and enable it
  - In **Data API → Configuration**, verify it's configured with **Managed BetterAuth**
  - Copy your Neon connection host and database name from **Connect** in the Console. The SDK derives both the Auth and Data API URLs from this single base URL. See [Initialize the client](/docs/reference/javascript-sdk#initializing) for the derivation rules, or use the separate Auth and Data API base URLs instead if you'd rather configure them explicitly

<Steps>

## Install Neon SDK

Replace the Supabase SDK with Neon's:

```bash filename="Terminal"
npm uninstall @supabase/supabase-js
npm install @neondatabase/neon-js@latest
```

## Update environment variables

Replace your Supabase credentials with a single Neon base URL. `createClient()` derives both the Auth and Data API URLs from it automatically:

```env filename=".env"
# Remove these:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Add this:
VITE_NEON_URL=https://ep-xxx.c-2.us-east-2.aws.neon.build/dbname
```

**Get your URL:**

Your Neon base URL is the host and database name from your Neon connection string, served over `https://`. Find these values under **Connect** in the Neon Console.

<Admonition type="note">
The `VITE_` prefix is for Vite. Use `NEXT_PUBLIC_` for Next.js, or no prefix for Node.js.
</Admonition>

<Admonition type="tip">
If you already copied separate Auth and Data API base URLs from the Console (for example, from an earlier setup), you can still pass them explicitly with the object form. See [Initialize the client](/docs/reference/javascript-sdk#initializing) for both forms.
</Admonition>

## Update client initialization

Find your Supabase client file, typically `src/supabase.ts` or `src/lib/supabase.ts`, and update it:

**Before (Supabase):**

```typescript filename="src/supabase.ts"
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);
```

**After (Neon):**

```typescript filename="src/auth.ts"
import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js';

export const client = createClient(import.meta.env.VITE_NEON_URL, {
  auth: { adapter: SupabaseAuthAdapter() },
});
```

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

```typescript filename="Auth methods"
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

## Your database queries stay the same

Your existing `client.from()` queries work without any code changes:

```typescript
// Same as Supabase - no changes needed
const { data: posts } = await client.from('posts').select('*');
const { data: user } = await client.from('users').select('*').eq('id', userId).single();
```

<Admonition type="note">
For production apps, use Row Level Security (RLS) to secure your data. See our [RLS with Drizzle guide](/docs/guides/rls-drizzle) for the recommended setup.
</Admonition>

## Test the migration

Run your app:

```bash filename="Terminal"
npm run dev
```

**Test your app:**

1. Sign up a new user
2. Sign in with that user
3. Verify the session persists across page reloads
4. If you enabled Data API: Test user actions that involve database queries (creating posts, loading lists, etc.)

Your authentication and database queries should work the same as they did with Supabase.

**Verify users in Neon Console:**

Go to **Auth → Users** in the Neon Console to see your newly created users, or query directly:

```sql filename="SQL Editor"
SELECT id, email, "createdAt"
FROM neon_auth.user
ORDER BY "createdAt" DESC;
```

</Steps>

## What changed?

| Feature                   | Supabase                            | Neon                                                |
| ------------------------- | ----------------------------------- | --------------------------------------------------- |
| **User ID type**          | `UUID`                              | `UUID`                                              |
| **Client config**         | URL + anon key                      | Single base URL (auto-derives Auth + Data API URLs) |
| **Environment variables** | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | `NEON_URL`                                          |
| **SDK package**           | `@supabase/supabase-js`             | `@neondatabase/neon-js`                             |

## API compatibility

Managed BetterAuth supports most Supabase Auth methods including sign up, sign in (password and OAuth), session management, user updates, and email verification. See the [Neon TypeScript SDK](/docs/reference/javascript-sdk) for the complete API.

**Not supported:**

| Method              | Details                             |
| ------------------- | ----------------------------------- |
| `signInWithPhone()` | Phone authentication (SMS/WhatsApp) |
| SAML SSO methods    | Enterprise SAML authentication      |
| Web3 authentication | Blockchain wallet sign-in           |

**Different behavior:**

| Method             | Notes                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `updateUser()`     | Does not support `password` or `email` parameters                                                                                                                                                                   |
| Email verification | Unlike Supabase's automatic verification flow, Managed BetterAuth requires you to build the verification UI in your app. See [Email Verification](/docs/auth/guides/email-verification) for implementation details. |

If you're using any unsupported methods or verification flows, you'll need to adjust your implementation.

<NeedHelp/>
