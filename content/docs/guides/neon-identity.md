---
title: About Neon Identity
subtitle: Automatically sync user profiles from your auth provider directly to your
  database
enableTableOfContents: true
updatedOn: '2024-12-23T17:04:27.879Z'
---

<ComingSoon />

**Neon Identity** connects your authentication provider to your Neon database, automatically synchronizing user profiles so that you own your auth data. Access your user data directly in your database environment, with no custom integration code needed.

## Authentication and synchronization

When implementing user authentication, it is common to use managed authentication providers like Stack Auth, Clerk, and others to handle the complexities of user identity, passwords, and security. However, keeping your database in sync with these providers typically requires additional development work.

Neon Identity solves this by integrating your auth provider with your Postgres database, ensuring your application always has access to up-to-date user information right from your database.

## Key benefits

- Provision auth provider projects and manage your users directly from the Neon Console
- Automated synchronization of user profiles between auth provider and your database
- Easy database relationships, since your user profiles are available as any other table

## How Neon Identity works

When you set up Neon Identity, we create a `neon_identity` schema in your database. As users authenticate and manage their profiles in your auth provider, their data is automatically synchronized to your database.

Here is the basic flow:

1. **User profiles are created and managed in your authentication provider**

   This view shows the list of users inside your auth provider (e.g. Stack Auth). When new users sign up or update their profiles in your app, their data first appears here:
   ![Users in Auth Provider](/docs/guides/stackauth_users.png)

2. **Neon Identity syncs their data to your database**

   This view shows the synced user profiles in Neon Identity. This is where Neon manages the connection between your database and the authentication provider.
   ![Same users in Neon Identity](/docs/guides/identity_users.png)

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

## Before and after Neon Identity

Let's take a look at how Neon Identiy can help simplify the code in a typical todos application:

### Before Neon Identity

Without Neon Identity, keeping user data in sync often involves:

1. Using additional services (like Inngest) for background jobs
2. Writing and maintaining sync logic

Here's how you'd typically sync user data without Neon Identity:

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

### After Neon Identity

With Neon Identity, much of this complexity is eliminated. Since user data is automatically synced to `neon_identity.users_sync`, you can just create the todo:

```typescript
async function createTodo(userId: string, task: string) {
  return db.query(
    `INSERT INTO todos (task, user_id) 
     VALUES ($1, $2)`,
    [task, userId]
  );
}
```

## Getting Started

1. From the Neon Console, navigate to the **Identity** tab. Choose your provider and click **Connect**. Currently, only Stack Auth is available for Early Access users.
1. You'll be asked to authenticate and select the project you want to integrate with.
1. Once connected, you'll see the integration view. This shows your synced users, connection status, and quick links to your provider's documentation and console to help configure your application (e.g. SSO or API keys)

Here's an example of Neon Identity with Stack Auth. As we add more providers and features, this interface will continue to evolve.

![identity with stackauth deployed](/docs/guides/identity_stackauth.png)
