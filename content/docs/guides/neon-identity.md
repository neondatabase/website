---
title: About Neon Auth
subtitle: Automatically sync user profiles from your auth provider directly to your
  database
enableTableOfContents: true
tag: beta
updatedOn: '2025-01-31T21:21:32.228Z'
---

<ComingSoon />

**Neon Auth** connects your authentication provider to your Neon database, automatically synchronizing user profiles so that you own your auth data. Access your user data directly in your database environment, with no custom integration code needed.

## Authentication and synchronization

When implementing user authentication, it is common to use managed authentication providers like Stack Auth, Clerk, and others to handle the complexities of user identity, passwords, and security. However, keeping your database in sync with these providers typically requires additional development work.

Neon Auth solves this by integrating your auth provider with your Postgres database, ensuring your application always has access to up-to-date user information right from your database.

## Key benefits

- Provision auth provider projects and manage your users directly from the Neon Console
- Automated synchronization of user profiles between auth provider and your database
- Easy database relationships, since your user profiles are available as any other table

## How Neon Auth works

When you set up Neon Auth, we create a `neon_identity` schema in your database. As users authenticate and manage their profiles in your auth provider, their data is automatically synchronized to your database.

Here is the basic flow:

1. **User profiles are created and managed in your authentication provider**

   This view shows the list of users inside your auth provider (e.g. Stack Auth). When new users sign up or update their profiles in your app, their data first appears here:
   ![Users in Auth Provider](/docs/guides/stackauth_users.png)

2. **Neon Auth syncs their data to your database**

   This view shows the synced user profiles in Neon Auth. This is where Neon manages the connection between your database and the authentication provider.
   ![Same users in Neon Auth](/docs/guides/identity_users.png)

3. **The data is immediately available in your database**

   The synchronized data is available in the `neon_identity.users_sync` table shortly after the auth provider processes changes. Here's an example query to inspect the synchronized data:

   ```sql
   SELECT * FROM neon_identity.users_sync;
   ```

   | id          | name       | email             | created_at    | raw_json                      |
   | ----------- | ---------- | ----------------- | ------------- | ----------------------------- |
   | 21373f88... | Sarah Chen | sarah@acme.dev    | 2024-12-17... | \{"id": "21373f88-...", ...\} |
   | 0310a9a5... | Alex Kumar | alex@startmeup.co | 2024-12-17... | \{"id": "0310a9a5-...", ...\} |

### Table structure

The following columns are included in the `neon_identity.users_sync` table:

- `raw_json`: Complete user profile as JSON
- `id`: The unique ID of the user
- `name`: The user's display name (nullable)
- `email`: The user's primary email (nullable)
- `created_at`: When the user signed up (nullable)
- `deleted_at`: When the user was deleted, if applicable (nullable)

Updates to user profiles in the auth provider are automatically synchronized.

<Admonition type="note">
Do not try to change the `neon_identity.users_sync` table name. It's needed for the synchronization process to work correctly.
</Admonition>

## Before and after Neon Auth

Let's take a look at how Neon Identiy can help simplify the code in a typical todos application:

### Before Neon Auth

Without Neon Auth, keeping user data in sync often involves:

1. Using additional services (like Inngest) for background jobs
2. Writing and maintaining sync logic

Here's how you'd typically sync user data without Neon Auth:

```typescript
import { AuthProvider } from '@auth/sdk';
import { BackgroundJobs } from '@jobs/sdk';
import { db } from '@/db';

// Set up sync handling
const jobs = new BackgroundJobs();

jobs.on('user.updated', async (event) => {
  const { userId } = event;

  // Fetch user data from auth provider
  const auth = new AuthProvider();
  const user = await auth.getUser(userId);

  // Update database
  await db.query(
    `
    INSERT INTO users (id, email, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO UPDATE 
    SET email = $2, name = $3
  `,
    [user.id, user.email, user.name]
  );
});
```

### After Neon Auth

With Neon Auth, much of this complexity is eliminated. Since user data is automatically synced to `neon_identity.users_sync`, you can just create the todo:

```typescript
async function createTodo(userId: string, task: string) {
  return db.query(
    `INSERT INTO todos (task, user_id) 
     VALUES ($1, $2)`,
    [task, userId]
  );
}
```

## Getting started

1. From the Neon Console, navigate to the **Identity** tab. Choose your provider and click **Connect**. Currently, only Stack Auth is available for Early Access users.
1. You'll be asked to authenticate and select the project you want to integrate with.
1. Once connected, you'll see the integration view. This shows your synced users, connection status, and quick links to your provider's documentation and console to help configure your application (e.g. SSO or API keys)

Here's an example of Neon Auth with Stack Auth. As we add more providers and features, this interface will continue to evolve.

![identity with stackauth deployed](/docs/guides/identity_stackauth.png)

## Best practices

### Foreign keys and the users_sync table

Since the `neon_identity.users_sync` table is updated asynchronously, there may be a brief delay (usually at most a few seconds) before a user's data appears in the `users_sync` table. You may need to implement retry logic or error handling in your application for database operations that reference new users.

If you do use foreign keys, make sure to specify an `ON DELETE` behavior that matches your needs: for example, `CASCADE` for personal data like todos or user preferences, and `SET NULL` for content like blog posts or comments that should persist after user deletion.

```sql
-- For personal data that should be removed with the user (e.g., todos)
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES neon_identity.users_sync(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For content that should persist after user deletion (e.g., blog posts)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES neon_identity.users_sync(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Read more about foreign keys in [PostgreSQL](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK).
