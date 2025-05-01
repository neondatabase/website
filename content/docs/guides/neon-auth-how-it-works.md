---
title: How Neon Auth works
enableTableOfContents: true
tag: beta
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

<FeatureBetaProps feature_name="Neon Auth" />

## Why Use Neon Auth?

- Provision auth provider projects and manage your users directly from the Neon Console
- Automated synchronization of user profiles between auth provider and your database
- Easy database relationships, since your user profiles are available as any other table

**Neon Auth** connects your authentication provider to your Neon database, automatically synchronizing user profiles so that you own your auth data. Access your user data directly in your database environment, with no custom integration code needed.

When implementing user authentication, it is common to use managed authentication providers like Stack Auth, Clerk, and others to handle the complexities of user identity, passwords, and security. However, keeping your database in sync with these providers typically requires additional development work.

Neon Auth solves this by integrating your auth provider with your Postgres database, ensuring your application always has access to up-to-date user information right from your database.

## How Neon Auth works

When you set up Neon Auth, we create a `neon_auth` schema in your database. As users authenticate and manage their profiles in your auth provider, their data is automatically synchronized to your database.

Here is the basic flow:

1. **User profiles are created and managed in your authentication provider**

   This view shows the list of users inside your auth provider (e.g. Stack Auth). When new users sign up or update their profiles in your app, their data first appears here:
   ![Users in Auth Provider](/docs/guides/stackauth_users.png)

2. **Neon Auth syncs their data to your database**

   This view shows the synced user profiles in Neon Auth. This is where Neon manages the connection between your database and the authentication provider.
   ![Same users in Neon Auth](/docs/guides/identity_users.png)

3. **The data is immediately available in your database**

   The synchronized data is available in the `neon_auth.users_sync` table shortly after the auth provider processes changes. Here's an example query to inspect the synchronized data:

   ```sql
   SELECT * FROM neon_auth.users_sync;
   ```

   | id          | name          | email             | created_at          | updated_at          | deleted_at | raw_json                     |
   | ----------- | ------------- | ----------------- | ------------------- | ------------------- | ---------- | ---------------------------- |
   | d37b6a30... | Jordan Rivera | jordan@company.co | 2025-02-12 19:44... | null                | null       | `{"id": "d37b6a30...", ...}` |
   | 0153cc96... | Alex Kumar    | alex@acme.com     | 2025-02-12 19:44... | null                | null       | `{"id": "0153cc96...", ...}` |
   | 51e491df... | Sam Patel     | sam@startup.dev   | 2025-02-12 19:43... | 2025-02-12 19:46... | null       | `{"id": "51e491df...", ...}` |

### Table structure

The following columns are included in the `neon_auth.users_sync` table:

- `raw_json`: Complete user profile as JSON
- `id`: The unique ID of the user
- `name`: The user's display name
- `email`: The user's primary email
- `created_at`: When the user signed up
- `deleted_at`: When the user was deleted, if applicable (nullable)
- `updated_at`: When the user was last updated, if applicable (nullable)

Updates to user profiles in the auth provider are automatically synchronized.

<Admonition type="note">
Do not try to change the `neon_auth.users_sync` table name. It's needed for the synchronization process to work correctly.
</Admonition>

## Before and after Neon Auth

Let's take a look at how Neon Auth simplifies database operations in a typical todos application, specifically when associating todos with users.

### Before Neon Auth

Without Neon Auth, you would typically need to:

1. **Create and manage your own `users` table** to store user information in your database.
2. **Implement synchronization logic** to keep this `users` table in sync with your authentication provider. This includes handling user creation and, crucially, **user updates** and deletions.
3. **Create a `todos` table** that references your `users` table using a foreign key.

Here's how you would structure your database and perform insert operations _without_ Neon Auth:

#### 1. Create a `users` table:

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

#### 2. Insert a user into the `users` table:

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

#### 3. Create a `todos` table with a foreign key to the `users` table:

```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. Insert a todo, referencing the `users` table:

```sql
INSERT INTO todos (task, user_id)
VALUES ('Buy groceries', 'user-id-123');
```

### After Neon Auth

With Neon Auth, Neon automatically creates and manages the `neon_auth.users_sync` table, keeping it synchronized with your connected authentication provider. You can directly rely on this table for user data, significantly simplifying your database operations.

Here's how you would structure your `todos` table and perform insert operations _with_ Neon Auth:

#### Users table

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

## Creating users

You can create users in Neon Auth using either the Neon Console or the API:

### Creating users in the Console

You can create users directly from the Neon Console—no app integration or API required. This is especially useful for development and testing, as it lets you quickly add test users and see their profiles synced to your `neon_auth.users_sync` table.

1. Go to your project's **Auth** page in the Neon Console.
2. Click **Create user** and fill in the required details.
3. The new user will appear in your auth provider and be automatically synchronized to your database.

### Creating users via the API

You can also create users programmatically using the Neon API:

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/user' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --header 'content-type: application/json' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack",
       "email": "user@example.com",
       "name": "Example User"
     }'
```

The new user will be created in your auth provider and automatically synchronized to your `neon_auth.users_sync` table.

For more details, see [Manage Neon Auth using the API](/docs/guides/neon-auth-api#create-users).

## Claiming your Neon Auth project

By default, Neon creates and manages the Stack Auth project for you behind the scenes. If you want to take direct ownership of the Stack Auth project (for advanced configuration or direct management), you can "claim" the project at any time.

### Claim via the Neon Console

1. Go to your project's **Auth** page in the Neon Console.
2. Click **Transfer ownership**.
3. Follow the prompts to select the Stack Auth account that should receive ownership.

![The Claim project button appears when your integration is Neon managed](/docs/guides/auth-transfer-ownership.png)

After claiming, you'll have direct access to manage your project in the Stack Auth dashboard, while maintaining the integration with your Neon database.

### Claim via the API

You can also claim your project programmatically:

```bash
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/transfer_ownership' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack"
     }'
```

Open the returned URL in your browser to complete the claim process.  
See [Manage Neon Auth using the API](/docs/guides/neon-auth-api#transfer-to-your-auth-provider) for more details.

<Admonition type="note">
After claiming, you'll still be able to access your project from the Neon Console, but you'll also have direct access from the Stack Auth dashboard.
</Admonition>

## Permissions and roles

For organization-owned projects, only organization admins can manage Neon Auth settings. Members and project collaborators can use Neon Auth features once configured, but cannot modify the integration settings.

| Action            | Admin | Member | Collaborator |
| ----------------- | :---: | :----: | :----------: |
| Install Neon Auth |  ✅   |   ❌   |      ❌      |
| Remove Neon Auth  |  ✅   |   ❌   |      ❌      |
| Claim project     |  ✅   |   ❌   |      ❌      |
| Generate SDK Keys |  ✅   |   ❌   |      ❌      |
| Create users      |  ✅   |   ✅   |      ✅      |

For more information about organization roles and permissions, see [User roles and permissions](/docs/manage/organizations#user-roles-and-permissions).
