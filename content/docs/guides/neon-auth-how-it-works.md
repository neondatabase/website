---
title: How Neon Auth works
enableTableOfContents: true
tag: beta
updatedOn: '2025-05-16T19:06:06.841Z'
---

<InfoBlock>
  <DocsList title="Related docs" theme="docs">
    <a href="/docs/guides/neon-auth">Get started</a>
    <a href="/docs/guides/neon-auth-demo">Tutorial</a>
  </DocsList>

  <DocsList title="Sample project" theme="repo">
    <a href="https://github.com/neondatabase-labs/neon-auth-demo-app">Neon Auth Demo App</a>
  </DocsList>
</InfoBlock>

**Neon Auth** simplifies user management by bundling auth with your database, so your user data is always available right from Postgres. No custom integration required.

<FeatureBetaProps feature_name="Neon Auth" />

## How it works

When you set up Neon Auth, we create a `neon_auth` schema in your database. As users authenticate and manage their profiles in Neon Auth, you'll see them appear in your list of users on the **Auth** page.

![Users in Neon Auth](/docs/guides/identity_users.png)

**User data is immediately available in your database**

User data is available in the `neon_auth.users_sync` table shortly after the Neon Auth processes the updates. Here's an example query to inspect the synchronized data:

```sql
SELECT * FROM neon_auth.users_sync;
```

| id          | name          | email             | created_at          | updated_at          | deleted_at | raw_json                         |
| ----------- | ------------- | ----------------- | ------------------- | ------------------- | ---------- | -------------------------------- |
| d37b6a30... | Jordan Rivera | jordan@company.co | 2025-05-09 16:15:00 | null                | null       | `{\"id\": \"d37b6a30...\", ...}` |
| 51e491df... | Sam Patel     | sam@startup.dev   | 2025-02-27 18:36:00 | 2025-02-27 18:36:00 | null       | `{\"id\": \"51e491df...\", ...}` |

The following columns are included in the `neon_auth.users_sync` table:

- `raw_json`: Complete user profile as JSON
- `id`: The unique ID of the user
- `name`: The user's display name
- `email`: The user's primary email
- `created_at`: When the user signed up
- `deleted_at`: When the user was deleted, if applicable (nullable)
- `updated_at`: When the user was last updated, if applicable (nullable)

Updates to user profiles in Neon Auth are automatically reflected in your database.

<Admonition type="note">
Do not try to change the `neon_auth.users_sync` table name. It's needed for the synchronization process to work correctly.
</Admonition>

Let's take a look at how Neon Auth simplifies database operations in a typical todos application, specifically when associating todos with users.

<Steps>

## Before Neon Auth

Without Neon Auth, you would typically need to:

1. Create and manage your own `users` table to store user information in your database.
2. Implement synchronization logic to keep this `users` table in sync with your authentication provider. This includes handling user creation and, crucially, user updates and deletions.
3. Create a `todos` table that references your `users` table using a foreign key.

Here's how you would structure your database and perform insert operations _without_ Neon Auth:

### 1. Create a `users` table:

```sql
CREATE TABLE users (
    id TEXT PRIMARY KEY, -- User ID from your auth provider (TEXT type)
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    -- ... other user fields
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);
```

### 2. Insert a user into the `users` table:

To insert this user into your database when a new user is created in your auth provider, you might set up a webhook endpoint. Here's an example of a simplified webhook handler that would receive a `user.created` event from your auth provider and insert the user into your `users` table:

```typescript
// Webhook handler to insert a user into the 'users' table for a 'user.created' event

import { db } from '@/db';

export async function POST(request: Request) {
  await checkIfRequestIsFromAuthProvider(request); // Validate request authenticity using headers, etc.
  const payload = await request.json(); // Auth Provider webhook payload

  // Extract user data from the webhook payload
  const userId = payload.user_id;
  const email = payload.email_address;
  const name = payload.name;

  try {
    await db.query(
      `INSERT INTO users (id, email, name)
       VALUES ($1, $2, $3)`,
      [userId, email, name]
    );
    return new Response('User added successfully', { status: 200 });
  } catch (error) {
    console.error('Database error inserting user:', error);

    // Retry logic, error handling, etc. as needed
    // Send notification to on-call team, etc to check why the insert operation failed

    return new Response('Error inserting user into database', { status: 500 });
  }
}
```

<Admonition type="note">
- This code snippet only handles the `user.created` event. To achieve complete synchronization, you would need to write separate webhook handlers for `user.updated`, `user.deleted`, and potentially other event types. Each handler adds complexity and requires careful error handling, security considerations, and ongoing maintenance.
- The provided webhook example is a simplified illustration, and a production-ready solution would necessitate more robust error handling, security measures, and potentially queueing mechanisms to ensure reliable synchronization.
</Admonition>

### 3. Create a `todos` table with a foreign key to the `users` table:

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Insert a todo, referencing the `users` table:

```sql
INSERT INTO todos (task, user_id)
VALUES ('Buy groceries', 'user-id-123');
```

## After Neon Auth

With Neon Auth, Neon automatically creates and manages the `neon_auth.users_sync` table. User profiles are stored automatically in your database, so you can directly rely on this table for up-to-date user data, simplifying your database operations.

Here's how you would structure your `todos` table and perform insert operations _with_ Neon Auth:

### Users table

`neon_auth.users_sync` table is automatically created and kept in sync by Neon Auth (no action needed from you) and is available for direct use in your schema and queries. Here is the table structure as discussed above:

```sql
-- schema of neon_auth.users_sync table ( automatically created by Neon Auth )
id TEXT PRIMARY KEY,
raw_json JSONB,
name TEXT,
email TEXT,
created_at TIMESTAMPTZ,
deleted_at TIMESTAMPTZ,
updated_at TIMESTAMPTZ
```

#### 1. Create a `todos` table with a foreign key to the `neon_auth.users_sync` table:

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES neon_auth.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Insert a todo, referencing the `neon_auth.users_sync` table:

```sql
INSERT INTO todos (task, user_id)
```

</Steps>

<NeedHelp />
