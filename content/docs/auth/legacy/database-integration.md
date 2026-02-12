---
title: Legacy Neon Auth - Database Integration
subtitle: 'Technical reference for users_sync table, backend auth, and RLS'
summary: >-
  Covers how to utilize the `neon_auth.users_sync` table for user data
  synchronization, authenticate backend requests, and implement Row-Level
  Security (RLS) within the Legacy Neon Auth framework.
enableTableOfContents: true
tag: archived
noindex: true
updatedOn: '2026-02-06T22:07:32.752Z'
---

<Admonition type="warning" title="You are viewing legacy documentation">
**This is the documentation for the previous Neon Auth implementation built with Stack Auth.** It is no longer available for new projects but remains supported for existing users.

**For the new Neon Auth built with Better Auth**, see [Neon Auth documentation](/docs/auth/overview). Ready to upgrade? See our [migration guide](/docs/auth/migrate/from-legacy-auth).
</Admonition>

This guide covers how to work with the `neon_auth.users_sync` table, authenticate backend requests, and implement Row-Level Security (RLS) with Legacy Neon Auth.

## Database integration with users_sync

Neon Auth simplifies database operations by automatically managing user data synchronization. Instead of building custom webhook handlers and sync logic, Neon Auth creates and maintains a `neon_auth.users_sync` table that's always up-to-date with your authentication provider. This eliminates the need for custom code to handle user creation, updates, and deletion events.

### The users_sync table

The `neon_auth.users_sync` table is automatically created and kept in sync by Neon Auth. No action is needed from you—it's immediately available for use in your schema and queries.

**Table structure:**

```sql
-- schema of neon_auth.users_sync table (automatically created by Neon Auth)
id TEXT PRIMARY KEY,
raw_json JSONB,
name TEXT,
email TEXT,
created_at TIMESTAMPTZ,
deleted_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ
```

**Key columns:**

- `id` - Unique user identifier from Stack Auth
- `email` - User's email address
- `name` - User's display name
- `raw_json` - Complete user profile as JSON
- `created_at` - When the user signed up
- `updated_at` - When the user was last updated
- `deleted_at` - Soft delete timestamp (NULL if active)

### Using users_sync in your schema

You can reference the `users_sync` table directly with foreign keys. Here's an example with a `todos` table:

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

**Inserting data:**

```sql
INSERT INTO todos (task, user_id)
VALUES ('Buy groceries', 'user-id-from-neon-auth');
```

**Querying with user data:**

```sql
SELECT
    t.task,
    u.name as user_name,
    u.email as user_email
FROM todos t
JOIN neon_auth.users_sync u ON t.user_id = u.id
WHERE u.deleted_at IS NULL;
```

## Best Practices

### Foreign keys and the users_sync table

Since the `neon_auth.users_sync` table is updated asynchronously, there may be a brief delay (usually less than 1 second) before a user's data appears in the table. Consider this possible delay when deciding whether to use foreign keys in your schema.

If you do choose to use foreign keys, make sure to specify an `ON DELETE` behavior that matches your needs: for example, `CASCADE` for personal data like todos or user preferences, and `SET NULL` for content like blog posts or comments that should persist after user deletion.

```sql
-- For personal data that should be removed with the user (e.g., todos)
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- For content that should persist after user deletion (e.g., blog posts)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES neon_auth.users_sync(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### Querying user data

When querying data that relates to users:

- Use LEFT JOINs instead of INNER JOINs with the `users_sync` table in case of any sync delays. This ensures that all records from the main table (e.g., posts) are returned even if there's no matching user in the `users_sync` table yet.
- Filter out deleted users since the table uses soft deletes (users are marked with a `deleted_at` timestamp when deleted).

Here's an example of how to handle both in your queries:

```sql
SELECT posts.*, neon_auth.users_sync.name as author_name
FROM posts
LEFT JOIN neon_auth.users_sync ON posts.author_id = neon_auth.users_sync.id
WHERE neon_auth.users_sync.deleted_at IS NULL;
```

### Row-Level Security (RLS)

Row-Level Security (RLS) lets you enforce access control directly in your database, providing an extra layer of security for your app's data.

To get started adding RLS to your Neon Auth project:

1. Go to the **Configuration** tab in your Neon Auth project.
2. Copy the **JWKS URL** shown in the **Claim project** section.

   ![jwks in claim project section](/docs/changelog/neon_auth_jwks.png)

   _This JWKS URL allows Neon RLS to validate authentication tokens issued by Neon Auth._

3. In your Neon project, open **Settings > RLS** and paste the JWKS URL.
4. Continue with the standard RLS setup:
   - Install the `pg_session_jwt` extension in your database.
   - Set up the `authenticated` and `anonymous` roles.
   - Add RLS policies to your tables.

For complete RLS implementation guides, see:

- [Secure your app with RLS](/docs/guides/rls-tutorial) - Tutorial walkthrough
- [Simplify RLS with Drizzle](/docs/guides/rls-drizzle) - Using Drizzle ORM with RLS

### Important Limitation

<Admonition type="important">
Neon Auth is not compatible with Private Link (Neon Private Networking). If you have Private Link enabled for your Neon project, Neon Auth will not work. This is because Neon Auth requires internet access to connect to third-party authentication providers, while Private Link restricts connections to private AWS networks.
</Admonition>

## Backend integration

To authenticate your endpoints, you need to send the user's access token in the headers of the request to your server, and then make a request to Neon Auth's server API to verify the user's identity.

### Sending requests to your server endpoints

To authenticate your own server endpoints using Neon Auth's server API, you need to protect your endpoints by sending the user's access token in the headers of the request.

On the client side, you can retrieve the access token from the `user` object by calling `user.getAuthJson()`. This will return an object containing `accessToken`.

Then, you can call your server endpoint with these two tokens in the headers, like this:

```typescript shouldWrap
const { accessToken } = await user.getAuthJson();
const response = await fetch('/api/users/me', {
  headers: {
    'x-stack-access-token': accessToken,
  },
  // your other options and parameters
});
```

### Authenticating the user on the server endpoints

Neon Auth provides two methods for authenticating users on your server endpoints:

1. **JWT Verification**: A fast, lightweight approach that validates the user's token locally without making external requests. While efficient, it provides only essential user information encoded in the JWT.
2. **REST API Verification**: Makes a request to Neon Auth's servers to validate the token and retrieve comprehensive user information. This method provides access to the complete, up-to-date user profile.

#### Using JWT

<Tabs labels={["Node.js"]}>

<TabItem>

```javascript shouldWrap
// you need to install the jose library if it's not already installed
import * as jose from 'jose';

// you can cache this and refresh it with a low frequency
const jwks = jose.createRemoteJWKSet(
  new URL('https://api.stack-auth.com/api/v1/projects/<your-project-id>/.well-known/jwks.json')
);

const accessToken = 'access token from the headers';

try {
  const { payload } = await jose.jwtVerify(accessToken, jwks);
  console.log('Authenticated user with ID:', payload.sub);
} catch (error) {
  console.error(error);
  console.log('Invalid user');
}
```

</TabItem>

</Tabs>

#### Using the REST API

<Tabs labels={["Node.js", "Python"]}>

<TabItem>

```javascript shouldWrap
const url = 'https://api.stack-auth.com/api/v1/users/me';
const headers = {
  'x-stack-access-type': 'server',
  'x-stack-project-id': 'your Neon Auth project ID',
  'x-stack-secret-server-key': 'your Neon Auth server key',
  'x-stack-access-token': 'access token from the headers',
};

const response = await fetch(url, { headers });
if (response.status === 200) {
  console.log('User is authenticated', await response.json());
} else {
  console.log('User is not authenticated', response.status, await response.text());
}
```

</TabItem>

<TabItem>

```python shouldWrap
import requests

url = 'https://api.stack-auth.com/api/v1/users/me'
headers = {
'x-stack-access-type': 'server',
'x-stack-project-id': 'your Neon Auth project ID',
'x-stack-secret-server-key': 'your Neon Auth server key',
'x-stack-access-token': 'access token from the headers',
}

response = requests.get(url, headers=headers)
if response.status_code == 200:
print('User is authenticated', response.json())
else:
print('User is not authenticated', response.status_code, response.text)
```

</TabItem>

</Tabs>

## Related resources

### Legacy Neon Auth

- [Legacy Overview](/docs/auth/legacy/overview) - What is Legacy Neon Auth, claiming projects, environment variables
- [Migration Guide](/docs/auth/migrate/from-legacy-auth) - Upgrade to Neon Auth with Better Auth

### Stack Auth documentation

For SDK components, hooks, and OAuth configuration:

- [Stack Auth Official Docs](https://docs.stack-auth.com)

### Neon resources

- [Secure your app with RLS](/docs/guides/rls-tutorial) - RLS tutorial
- [Simplify RLS with Drizzle](/docs/guides/rls-drizzle) - RLS with Drizzle ORM
- [Neon Auth](/docs/auth/overview) - Current Neon Auth with Better Auth

<NeedHelp/>
