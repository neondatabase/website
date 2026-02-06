---
title: Neon Auth & Data API TypeScript SDKs
subtitle: Reference documentation for building applications with Neon Auth and Data API
summary: >-
  Covers the setup and usage of the Neon TypeScript SDK for implementing
  authentication and database operations in applications, including various
  adapter options for different frameworks.
enableTableOfContents: true
layout: wide
updatedOn: '2026-02-06T22:07:33.145Z'
---

The Neon TypeScript SDK (`@neondatabase/neon-js`) provides authentication and database operations for your applications.

Authentication is provided through an adapter-based architecture, letting you work more easily with your existing code or preferred framework. Available adapters:

- **BetterAuthVanillaAdapter** (default) — Promise-based authentication methods like `client.auth.signIn.email()`. Used in all examples on this page.
- **BetterAuthReactAdapter** — Similar API but with React hooks like `useSession()`. See the [React quickstart](/docs/auth/quick-start/react).
- **SupabaseAuthAdapter** — Supabase-compatible API for easy migration. See the [migration guide](/docs/auth/migrate/from-supabase).

Database query methods (`client.from()`, `.select()`, etc.) work the same regardless of which adapter you use.

<TwoColumnLayout>

<TwoColumnLayout.Item title="Installation" id="installation">
<TwoColumnLayout.Block>

Install the TypeScript SDK in your project using npm, yarn, pnpm, or bun.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```bash
npm install @neondatabase/neon-js
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Initialize the client" method="createClient(), createAuthClient()" id="initializing">
<TwoColumnLayout.Block>

**Full client (`createClient`)**

Use this when you need both authentication and database queries. You get:

- Auth methods like `client.auth.signIn.email()` and `client.auth.signUp.email()`.
- Database queries like `client.from('todos').select()` and `client.from('users').insert()`.

**Auth-only client (`createAuthClient`)**

Use this when you only need authentication (no database queries). You get:

- Auth methods like `auth.signIn.email()` and `auth.signUp.email()`
- No database query methods

The auth methods are identical—only the access path differs. `client.auth.signIn.email()` and `auth.signIn.email()` do the same thing.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Full client","Auth-only","With TypeScript types","With a different adapter"]}>

```typescript
import { createClient } from '@neondatabase/neon-js';

const client = createClient({
  auth: {
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});
```

```typescript
import { createAuthClient } from '@neondatabase/neon-js/auth';

const auth = createAuthClient(import.meta.env.VITE_NEON_AUTH_URL);
```

```typescript
import { createClient } from '@neondatabase/neon-js';
import type { Database } from './types/database.types';

const client = createClient<Database>({
  auth: {
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});
```

```typescript
import { createClient } from '@neondatabase/neon-js';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

const client = createClient({
  auth: {
    adapter: BetterAuthReactAdapter(),
    url: import.meta.env.VITE_NEON_AUTH_URL,
  },
  dataApi: {
    url: import.meta.env.VITE_NEON_DATA_API_URL,
  },
});
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Create a new user account" method="auth.signUp.email()" id="auth-signup">
<TwoColumnLayout.Block>

- Returns user and session data on success
- User data is stored in your database
- Sessions are managed automatically

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type                | Required |
| -------------------- | ------------------- | -------- |
| <tt>email</tt>       | string              | ✓        |
| <tt>name</tt>        | string              | ✓        |
| <tt>password</tt>    | string              | ✓        |
| <tt>image</tt>       | string \| undefined |          |
| <tt>callbackURL</tt> | string \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const result = await client.auth.signUp.email({
  email: 'user@example.com',
  password: 'password123',
  name: 'John Doe'
})

if (result.error) {
console.error('Sign up error:', result.error.message)
} else {
console.log('User created:', result.data.user)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Sign in with email and password" method="auth.signIn.email()" id="auth-signinwithpassword">
<TwoColumnLayout.Block>

- Returns user and session on success
- Session tokens are cached automatically
- Authentication state syncs across browser tabs

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type                 | Required |
| -------------------- | -------------------- | -------- |
| <tt>email</tt>       | string               | ✓        |
| <tt>password</tt>    | string               | ✓        |
| <tt>rememberMe</tt>  | boolean \| undefined |          |
| <tt>callbackURL</tt> | string \| undefined  |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const result = await client.auth.signIn.email({
  email: 'user@example.com',
  password: 'password123'
})

if (result.error) {
console.error('Sign in error:', result.error.message)
} else {
console.log('Signed in:', result.data.user.email)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Sign in with OAuth provider" method="auth.signIn.social()" id="auth-signinwithoauth">
<TwoColumnLayout.Block>

Sign in with an OAuth provider like Google, GitHub, etc.

- Redirects user to provider's authorization page
- User is redirected back after authorization
- Session is created automatically

### Parameters

<details>
<summary>View parameters</summary>

| Parameter                   | Type                  | Required |
| --------------------------- | --------------------- | -------- |
| <tt>provider</tt>           | string                | ✓        |
| <tt>callbackURL</tt>        | string \| undefined   |          |
| <tt>newUserCallbackURL</tt> | string \| undefined   |          |
| <tt>errorCallbackURL</tt>   | string \| undefined   |          |
| <tt>disableRedirect</tt>    | boolean \| undefined  |          |
| <tt>idToken</tt>            | object                |          |
| <tt>scopes</tt>             | string[] \| undefined |          |
| <tt>requestSignUp</tt>      | boolean \| undefined  |          |
| <tt>loginHint</tt>          | string \| undefined   |          |
| <tt>additionalData</tt>     | object                |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Sign in with GitHub","Sign in with custom redirect"]}>

```typescript
await client.auth.signIn.social({
  provider: 'github',
  callbackURL: 'https://yourapp.com/auth/callback',
});
```

```typescript
await client.auth.signIn.social({
  provider: 'google',
  callbackURL: 'https://yourapp.com/auth/callback',
});
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Sign out" method="auth.signOut()" id="auth-signout">
<TwoColumnLayout.Block>

- Clears local session cache
- Notifies other browser tabs (cross-tab sync)
- Removes authentication tokens

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { error } = await client.auth.signOut()

if (error) {
console.error('Sign out error:', error.message)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Get current session" method="auth.getSession()" id="auth-getsession">
<TwoColumnLayout.Block>

- Returns cached session if available (fast)
- Automatically refreshes expired tokens
- Returns null if no active session

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client.auth.getSession()

if (data.session) {
console.log('User is logged in:', data.session.user.email)
} else {
console.log('No active session')
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Update user profile" method="auth.updateUser()" id="auth-updateuser">
<TwoColumnLayout.Block>

Note: Password updates require password reset flow for security.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type                        | Required |
| -------------- | --------------------------- | -------- |
| <tt>name</tt>  | string \| undefined         |          |
| <tt>image</tt> | string \| null \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client.auth.updateUser({
  name: 'New Name'
})
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Send verification OTP code" method="auth.emailOtp.sendVerificationOtp()" id="auth-sendverificationotp">
<TwoColumnLayout.Block>

Sends an OTP (one-time password) code to the user's email for sign-in.
The user must then call `signIn.emailOtp()` with the received code.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type                                                   | Required |
| -------------- | ------------------------------------------------------ | -------- |
| <tt>email</tt> | string                                                 | ✓        |
| <tt>type</tt>  | "email-verification" \| "sign-in" \| "forget-password" | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { error } = await client.auth.emailOtp.sendVerificationOtp({
  email: 'user@example.com',
  type: 'sign-in'
})

if (error) {
console.error('Failed to send OTP:', error.message)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Sign in with OTP code" method="auth.signIn.emailOtp()" id="auth-signinwithotp">
<TwoColumnLayout.Block>

Signs in a user using an OTP code received via email.
First call `emailOtp.sendVerificationOtp()` to send the code.

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
const { data, error } = await client.auth.signIn.emailOtp({
  email: 'user@example.com',
  otp: '123456'
})

if (error) {
console.error('OTP verification failed:', error.message)
} else {
console.log('Signed in:', data.user.email)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Verify email with OTP" method="auth.emailOtp.verifyEmail()" id="auth-verifyemailotp">
<TwoColumnLayout.Block>

Verifies a user's email address using an OTP code sent during signup.
This is typically used after `signUp.email()` when email verification is required.

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
const { data, error } = await client.auth.emailOtp.verifyEmail({
  email: 'user@example.com',
  otp: '123456'
})

if (error) {
console.error('Email verification failed:', error.message)
} else {
console.log('Email verified successfully')
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Check verification OTP code" method="auth.emailOtp.checkVerificationOtp()" id="auth-checkverificationotp">
<TwoColumnLayout.Block>

Checks if an OTP code is valid without completing the verification flow.
Useful for password reset flows where you need to verify the code before allowing password change.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type                                                   | Required |
| -------------- | ------------------------------------------------------ | -------- |
| <tt>email</tt> | string                                                 | ✓        |
| <tt>type</tt>  | "email-verification" \| "sign-in" \| "forget-password" | ✓        |
| <tt>otp</tt>   | string                                                 | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client.auth.emailOtp.checkVerificationOtp({
  email: 'user@example.com',
  otp: '123456',
  type: 'forget-password'
})

if (error || !data.success) {
console.error('Invalid OTP code')
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Send verification email" method="auth.sendVerificationEmail()" id="auth-sendverificationemail">
<TwoColumnLayout.Block>

Sends a verification email to the user. Used for email verification after signup or email change.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter            | Type                | Required |
| -------------------- | ------------------- | -------- |
| <tt>email</tt>       | string              | ✓        |
| <tt>callbackURL</tt> | string \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { error } = await client.auth.sendVerificationEmail({
  email: 'user@example.com',
  callbackURL: 'https://yourapp.com/verify-email'
})

if (error) {
console.error('Failed to send verification email:', error.message)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Verify email address" method="auth.verifyEmail()" id="auth-verifyemail">
<TwoColumnLayout.Block>

Verifies an email address using a token from a verification email link.
Used for email change verification.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type   | Required |
| -------------- | ------ | -------- |
| <tt>query</tt> | object | ✓        |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client.auth.verifyEmail({
  query: {
    token: 'verification-token-from-email',
    callbackURL: 'https://yourapp.com/email-verified'
  }
})

if (error) {
console.error('Email verification failed:', error.message)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Request password reset" method="auth.requestPasswordReset()" id="auth-requestpasswordreset">
<TwoColumnLayout.Block>

Sends a password reset email to the user. The email contains a link to reset the password.

### Parameters

<details>
<summary>View parameters</summary>

| Parameter           | Type                | Required |
| ------------------- | ------------------- | -------- |
| <tt>email</tt>      | string              | ✓        |
| <tt>redirectTo</tt> | string \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { error } = await client.auth.requestPasswordReset({
  email: 'user@example.com',
  redirectTo: 'https://yourapp.com/reset-password'
})

if (error) {
console.error('Failed to send password reset email:', error.message)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Fetch data from a table" method="from().select()" id="select">
<TwoColumnLayout.Block>

- Authentication token is included automatically if user is signed in
- Returns typed data based on your database schema
- Row-level security policies determine what data is returned

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Select all rows","Select specific columns","Select with filter","Select with related tables"]}>

```typescript
const { data, error } = await client.from('todos').select('*');
```

```typescript
const { data, error } = await client.from('todos').select('id, title, completed');
```

```typescript
const { data, error } = await client.from('todos').select('*').eq('completed', false);
```

```typescript
const { data, error } = await client.from('todos').select('*, owner:users(*)');
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Insert data into a table" method="from().insert()" id="insert">
<TwoColumnLayout.Block>

- Authentication token is included automatically
- Can insert single or multiple rows
- Returns inserted data by default

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Insert a single row","Insert multiple rows"]}>

```typescript
const { data, error } = await client
  .from('todos')
  .insert({ title: 'Buy groceries', completed: false })
  .select();
```

```typescript
const { data, error } = await client
  .from('todos')
  .insert([
    { title: 'Task 1', completed: false },
    { title: 'Task 2', completed: false },
  ])
  .select();
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Update existing rows" method="from().update()" id="update">
<TwoColumnLayout.Block>

- Requires filter to specify which rows to update
- Authentication token is included automatically

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .update({ completed: true })
  .eq('id', 1)
  .select()
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Delete rows from a table" method="from().delete()" id="delete">
<TwoColumnLayout.Block>

- Requires filter to specify which rows to delete
- Authentication token is included automatically

### Parameters

<details>
<summary>View parameters</summary>

| Parameter      | Type                                             | Required |
| -------------- | ------------------------------------------------ | -------- |
| <tt>count</tt> | "exact" \| "planned" \| "estimated" \| undefined |          |

</details>

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { error } = await client
  .from('todos')
  .delete()
  .eq('id', 1)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Call a stored procedure" method=".rpc()" id="rpc">
<TwoColumnLayout.Block>

- Authentication token is included automatically
- Pass parameters as object
- Returns function result

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client.rpc('get_user_stats', {
  user_id: 123,
  start_date: '2024-01-01'
})

if (error) {
console.error('RPC error:', error.message)
} else {
console.log('Stats:', data)
}

```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is equal to a value" method=".eq(column, value)" id="eq">
<TwoColumnLayout.Block>

Filters rows where the specified column equals the given value.
Can be chained with other filters to create complex queries.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .eq('completed', true)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is not equal to a value" method=".neq(column, value)" id="neq">
<TwoColumnLayout.Block>

Filters rows where the specified column does not equal the given value.
Useful for excluding specific values from results.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .neq('status', 'archived')
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is greater than a value" method=".gt(column, value)" id="gt">
<TwoColumnLayout.Block>

Filters rows where the specified column is greater than the given value.
Works with numeric values, dates, and other comparable types.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .gt('priority', 5)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is less than a value" method=".lt(column, value)" id="lt">
<TwoColumnLayout.Block>

Filters rows where the specified column is less than the given value.
Works with numeric values, dates, and other comparable types.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .lt('priority', 10)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Order results by column" method=".order(column, options)" id="order">
<TwoColumnLayout.Block>

Sorts query results by the specified column.
Use `{ ascending: true }` for ascending order or `{ ascending: false }` for descending order.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Order ascending","Order descending"]}>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .order('created_at', { ascending: true });
```

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .order('created_at', { ascending: false });
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Limit number of results" method=".limit(count)" id="limit">
<TwoColumnLayout.Block>

Limits the number of rows returned by the query.
Useful for pagination and preventing large result sets.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .limit(10)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is greater than or equal to a value" method=".gte(column, value)" id="gte">
<TwoColumnLayout.Block>

Filters rows where the specified column is greater than or equal to the given value.
The comparison is inclusive (includes rows where column equals the value).

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .gte('priority', 5)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is less than or equal to a value" method=".lte(column, value)" id="lte">
<TwoColumnLayout.Block>

Filters rows where the specified column is less than or equal to the given value.
The comparison is inclusive (includes rows where column equals the value).

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .lte('priority', 10)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column matches a pattern" method=".like(column, pattern)" id="like">
<TwoColumnLayout.Block>

Filter rows where column matches pattern (case-sensitive).

Use % as wildcard: '%pattern%' matches any string containing 'pattern'

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .like('title', '%groceries%')
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column matches a pattern (case-insensitive)" method=".ilike(column, pattern)" id="ilike">
<TwoColumnLayout.Block>

Use % as wildcard: '%pattern%' matches any string containing 'pattern'

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .ilike('title', '%groceries%')
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column is null or not null" method=".is(column, value)" id="is">
<TwoColumnLayout.Block>

Filters rows based on whether a column is null or not null.
Use `null` to find rows where the column is null, or `'not.null'` to find rows where it's not null.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>
<CodeTabs labels={["Is null","Is not null"]}>

```typescript
const { data, error } = await client.from('todos').select('*').is('deleted_at', null);
```

```typescript
const { data, error } = await client.from('todos').select('*').is('completed_at', 'not.null');
```

</CodeTabs>
</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column value is in an array" method=".in(column, array)" id="in">
<TwoColumnLayout.Block>

Filters rows where the column value matches any value in the provided array.
Useful for filtering by multiple possible values (e.g., status in ['pending', 'active']).

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .in('status', ['pending', 'in-progress'])
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Array or JSONB column contains value" method=".contains(column, value)" id="contains">
<TwoColumnLayout.Block>

Filters rows where an array or JSONB column contains the specified value.
For arrays, checks if the value exists in the array. For JSONB, checks if the value is contained in the JSON object.

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .contains('tags', ['urgent'])
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

<TwoColumnLayout.Item title="Column value is between two values" method=".range(column, start, end)" id="range">
<TwoColumnLayout.Block>

Range is inclusive (includes both start and end values).

</TwoColumnLayout.Block>
<TwoColumnLayout.Block>

```typescript
const { data, error } = await client
  .from('todos')
  .select('*')
  .range('priority', 5, 10)
```

</TwoColumnLayout.Block>
</TwoColumnLayout.Item>

</TwoColumnLayout>
