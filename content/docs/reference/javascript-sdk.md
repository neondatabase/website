---
title: Neon JavaScript SDK
subtitle: A unified TypeScript SDK for Neon, providing authentication and PostgreSQL database queries
enableTableOfContents: true
layout: wide
contentLayout: split
---

## Installation

Install the Neon JavaScript SDK in your project:

```bash
npm install @neondatabase/neon-js
```

## Initializing

Create a new Neon client for use in your application. The SDK automatically configures both authentication and database access from this single URL.

<CodeTabs labels={["Create a client","Create a client with TypeScript types"]}>

```typescript showLineNumbers
import { createClient } from '@neondatabase/neon-js';

const client = createClient(import.meta.env.VITE_NEON_URL);
```

```typescript showLineNumbers
import { createClient } from '@neondatabase/neon-js';
import type { Database } from './types/database.types';

const client = createClient<Database>(import.meta.env.VITE_NEON_URL);
```

</CodeTabs>

The client automatically handles authentication token management, database query routing, and type-safe database operations.

For TypeScript projects, generate types from your database schema: `npx @neondatabase/neon-js gen-types --db-url "postgresql://..."`

## auth.signUp()

Creates a new user account with email and password.

- Returns user and session data on success
- User data is stored in your database
- Sessions are managed automatically

### Parameters

- **email**: `string` (required)

- **password**: `string` (required)

- **options**: `{ emailRedirectTo?: string | undefined; data?: object | undefined; captchaToken?: string | undefined; channel?: "sms" | "whatsapp" | undefined; } | undefined` (optional)

```typescript showLineNumbers
const { data, error } = await client.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});

if (error) {
  console.error('Sign up error:', error.message);
} else {
  console.log('User created:', data.user);
}
```

## auth.signInWithPassword()

Sign in an existing user with email and password.

- Returns user and session on success
- Session tokens are cached automatically
- Authentication state syncs across browser tabs

### Parameters

- **email**: `string` (required)

- **password**: `string` (required)

- **options**: `{ captchaToken?: string | undefined; } | undefined` (optional)

```typescript showLineNumbers
const { data, error } = await client.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});

if (error) {
  console.error('Sign in error:', error.message);
} else {
  console.log('Signed in:', data.user.email);
}
```

## auth.signInWithOAuth()

Sign in with an OAuth provider like Google, GitHub, etc.

- Redirects user to provider's authorization page
- User is redirected back after authorization
- Session is created automatically

### Parameters

- **provider**: `Provider` (required)

- **options**: `{ redirectTo?: string | undefined; scopes?: string | undefined; queryParams?: { [key: string]: string; } | undefined; skipBrowserRedirect?: boolean | undefined; } | undefined` (optional)

<CodeTabs labels={["Sign in with GitHub","Sign in with custom redirect"]}>

```typescript showLineNumbers
const { data, error } = await client.auth.signInWithOAuth({
  provider: 'github',
});
```

```typescript showLineNumbers
const { data, error } = await client.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://yourapp.com/auth/callback',
  },
});
```

</CodeTabs>

## auth.signOut()

Signs out the current user and clears the session.

- Clears local session cache
- Notifies other browser tabs (cross-tab sync)
- Removes authentication tokens

### Parameters

- **scope**: `"global" | "local" | "others" | undefined` (optional)

```typescript showLineNumbers
const { error } = await client.auth.signOut();

if (error) {
  console.error('Sign out error:', error.message);
}
```

## auth.getSession()

Retrieves the current session.

- Returns cached session if available (fast)
- Automatically refreshes expired tokens
- Returns null if no active session

<CodeTabs labels={["Get current session","Check session in React"]}>

```typescript showLineNumbers
const { data, error } = await client.auth.getSession();

if (data.session) {
  console.log('User is logged in:', data.session.user.email);
} else {
  console.log('No active session');
}
```

```typescript showLineNumbers
import { useState, useEffect } from 'react'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>Loading...</div>
  if (!session) return <div>Please sign in</div>

  return <div>Welcome, {session.user.email}</div>
}
```

</CodeTabs>

## auth.getUser()

Retrieves the current user from the session.

```typescript showLineNumbers
const { data, error } = await client.auth.getUser();

if (data.user) {
  console.log('User ID:', data.user.id);
  console.log('Email:', data.user.email);
}
```

## auth.updateUser()

Updates user profile information.

Note: Password updates require password reset flow for security.

### Parameters

- **email**: `string | undefined` (optional)

- **phone**: `string | undefined` (optional)

- **password**: `string | undefined` (optional)

- **nonce**: `string | undefined` (optional)

- **data**: `object | undefined` (optional)

```typescript showLineNumbers
const { data, error } = await client.auth.updateUser({
  email: 'newemail@example.com',
});
```

## auth.onAuthStateChange()

Subscribe to authentication state changes.

- Fires on sign in, sign out, token refresh, and user updates
- Syncs automatically across browser tabs
- Returns subscription with unsubscribe() method

```typescript showLineNumbers
import { useState, useEffect } from 'react'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    client.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Listen for changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    // Cleanup
    return () => subscription.unsubscribe()
  }, [])

  return <div>{session ? 'Logged in' : 'Logged out'}</div>
}
```

## auth.resetPasswordForEmail()

Sends a password reset email to the user.

```typescript showLineNumbers
const { data, error } = await client.auth.resetPasswordForEmail('user@example.com');
```

## from().select()

Perform a SELECT query on a table.

- Authentication token is included automatically
- Returns typed data based on your database schema
- Requires active session (throws AuthRequiredError if not signed in)

<CodeTabs labels={["Select all rows","Select specific columns","Select with filter","Select with related tables"]}>

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*');
```

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('id, title, completed');
```

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').eq('completed', false);
```

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*, owner:users(*)');
```

</CodeTabs>

## from().insert()

Insert new rows into a table.

- Authentication token is included automatically
- Can insert single or multiple rows
- Returns inserted data by default

<CodeTabs labels={["Insert a single row","Insert multiple rows"]}>

```typescript showLineNumbers
const { data, error } = await client
  .from('todos')
  .insert({ title: 'Buy groceries', completed: false })
  .select();
```

```typescript showLineNumbers
const { data, error } = await client
  .from('todos')
  .insert([
    { title: 'Task 1', completed: false },
    { title: 'Task 2', completed: false },
  ])
  .select();
```

</CodeTabs>

## from().update()

Update existing rows in a table.

- Requires filter to specify which rows to update
- Authentication token is included automatically

```typescript showLineNumbers
const { data, error } = await client.from('todos').update({ completed: true }).eq('id', 1).select();
```

## from().delete()

Delete rows from a table.

- Requires filter to specify which rows to delete
- Authentication token is included automatically

### Parameters

- **count**: `"exact" | "planned" | "estimated" | undefined` (optional)

```typescript showLineNumbers
const { error } = await client.from('todos').delete().eq('id', 1);
```

## .eq()

Filter rows where column equals value.

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').eq('completed', true);
```

## .neq()

Filter rows where column does not equal value.

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').neq('status', 'archived');
```

## .gt()

Filter rows where column is greater than value.

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').gt('priority', 5);
```

## .lt()

Filter rows where column is less than value.

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').lt('priority', 10);
```

## .order()

Order query results by column.

<CodeTabs labels={["Order ascending","Order descending"]}>

```typescript showLineNumbers
const { data, error } = await client
  .from('todos')
  .select('*')
  .order('created_at', { ascending: true });
```

```typescript showLineNumbers
const { data, error } = await client
  .from('todos')
  .select('*')
  .order('created_at', { ascending: false });
```

</CodeTabs>

## .limit()

Limit the number of rows returned.

```typescript showLineNumbers
const { data, error } = await client.from('todos').select('*').limit(10);
```
