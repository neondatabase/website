---
title: About Neon Identity
subtitle: Automatically sync user profiles from your auth provider directly to your database
enableTableOfContents: true
---

_<b>Q:</b> This EAP message is re-purposed from another feature. We can modify if, for example, we want to link to sign up for the EAP etc_

<ComingSoon />

**Neon Identity** connects your authentication provider to your Neon database, automatically synchronizing user profiles. Access your user data directly in your database environment, with no custom integration code needed.

## Authentication and synchronization

When implementing user authentication, it is common to use dedicated authentication providers like StackAuth, Clerk, and others to handle the complexities of user identity, passwords, and security. However, keeping your database in sync with these providers typically requires additional development work.

Neon Identity solves this by maintaining a direct connection between your auth provider and database, ensuring your application always has access to up-to-date user information right from your database.

_<b>Q:</b> What specific benefits can we list out here? Less API calls, etc?_

## How Neon Identity works

When you set up Neon Identity, we create a `neon_identity` schema in your database. As users authenticate and manage their profiles in your auth provider, their data is automatically synchronized to your database.

Here is the basic flow:

1. **User profiles are created and managed in your authentication provider**

   This view shows the list of users inside your auth provider (e.g. StackAuth). When new users sign up or update their profiles in your app, their data first appears here:
   ![Users in Auth Provider](/docs/guides/stackauth_users.png)

2. **Neon Identity syncs their data to your database**

   This view shows the synced user profiles in Neon Identity. This is where Neon manages the connection between your database and the authentication provider.
   ![Same users in Neon Identity](/docs/guides/identity_users.png)

3. **The data is immediately available in your database**

   The synchronized data is immediately available in the `neon_identity.users_sync` table. Here's an example query to inspect the synchronized data:

   ```sql
   SELECT * FROM neon_identity.users_sync;
   ```

   | id | name | email | created_at | raw_json |
   |----|------|-------|------------|----------|
   | 21373f88... | Sarah Chen | sarah@acme.dev | 2024-12-17... | \{"id": "21373f88-...", ...\} |
   | 0310a9a5... | Alex Kumar | alex@startmeup.co | 2024-12-17... | \{"id": "0310a9a5-...", ...\} |

### Table structure

The following columns are included in the `neon_identity.users_sync` table:

- `raw_json`: Complete user profile as JSON
- `id`: The unique ID of the user
- `name`: The user's display name
- `email`: The user's primary email
- `created_at`: When the user signed up

Updates to user profiles in the auth provider are automatically synchronized.

## Before and after Neon Identity

Let's take a look at how Neon Identiy can help simplify the code in a typical todos application:

### Before Neon Identity

_<b>Q:</b> Is this before/after example realistic/representative?_

You need to handle user data synchronization manually:

```typescript
async function createTodo(userId: string, task: string) {
  // 1. Verify user exists and get latest profile
  const userProfile = await authProvider.getUser(userId);
  
  // 2. Ensure user data is in sync
  await db.query(`
    INSERT INTO my_app_users (id, email, name)
    VALUES ($1, $2, $3)
    ON CONFLICT (id) DO UPDATE 
    SET email = $2, name = $3
  `, [userProfile.id, userProfile.email, userProfile.name]);
  
  // 3. Finally create the todo
  return db.query(`
    INSERT INTO todos (task, user_id) 
    VALUES ($1, $2)
  `, [task, userId]);
}
```

### After Neon Identity

Since user data is automatically synced, you can just create the todo:

```typescript
async function createTodo(userId: string, task: string) {
  return db.query(`
    INSERT INTO todos (task, user_id) 
    VALUES ($1, $2)
  `, [task, userId]);
}
```

## Getting Started

1. From the Neon Console, navigate to the **Identity** tab. Choose your provider and click **Connect**. Currently, only StackAuth is available for Early Access users.
1. You'll be asked to authenticate and select the project you want to integrate with.
1. Once connected, you'll see the integration view. This shows your synced users, connection status, and quick links to your provider's documentation and console to help configure your application (e.g. SSO or API keys)

Here's an example of Neon Identity with StackAuth. As we add more providers and features, this interface will continue to evolve.

![identity with stackauth deployed](/docs/guides/identity_stackauth.png)

## Working with user profiles

_<b>Q:</b>What are a couple typical use cases for the raw_json column?_

The `neon_identity.users_sync` table provides standard columns (`id`, `name`, `email`) for common queries, along with a `raw_json` column containing the complete user profile.

You can also explore user profiles directly in the Neon Console. The User Details panel provides two views:

1. **Summary** view displays key details such as ID, email, and joined date—ideal for quick validation or reference.
2. **Raw JSON** view offers the full, unfiltered user profile for debugging or custom integrations.

<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <img src="/docs/guides/identity_user_summary.png" style={{ width: '45%', marginRight: '2%' }} alt="User Summary View" />
  <img src="/docs/guides/identity_user_raw_json.png" style={{ width: '45%' }} alt="User Raw JSON View" />
</div>

Here's an example of querying the `raw_json` column to extract specific fields from a user profile via SQL:

```sql
SELECT raw_json->>'primary_email_verified' as email_verified,
       raw_json->>'has_password' as has_password,
       raw_json->>'otp_auth_enabled' as otp_enabled
FROM neon_identity.users_sync
WHERE email = 'sarah@acme.dev';
```
