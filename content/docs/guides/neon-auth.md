---
title: About Neon Auth
subtitle: Automatically sync user profiles from your auth provider directly to your
  database
enableTableOfContents: true
redirectFrom:
  - /docs/guides/neon-identity
tag: beta
updatedOn: '2025-03-07T21:27:12.098Z'
---

<FeatureBetaProps feature_name="Neon Auth" />

**Neon Auth** connects your authentication provider to your Neon database, automatically synchronizing user profiles so that you own your auth data. Access your user data directly in your database environment, with no custom integration code needed.

## Authentication and synchronization

When implementing user authentication, it is common to use managed authentication providers like Stack Auth, Clerk, and others to handle the complexities of user identity, passwords, and security. However, keeping your database in sync with these providers typically requires additional development work.

Neon Auth solves this by integrating your auth provider with your Postgres database, ensuring your application always has access to up-to-date user information right from your database.

## Key benefits

- Provision auth provider projects and manage your users directly from the Neon Console
- Automated synchronization of user profiles between auth provider and your database
- Easy database relationships, since your user profiles are available as any other table

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
   | d37b6a30... | Jordan Rivera | jordan@company.co | 2025-02-12 19:44... | null                | null       | \{"id": "d37b6a30...", ...\} |
   | 0153cc96... | Alex Kumar    | alex@acme.com     | 2025-02-12 19:44... | null                | null       | \{"id": "0153cc96...", ...\} |
   | 51e491df... | Sam Patel     | sam@startup.dev   | 2025-02-12 19:43... | 2025-02-12 19:46... | null       | \{"id": "51e491df...", ...\} |

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

To insert this user into your database when a new user is created in your auth provider, you might set up a webhook endpoint. Here’s an example of a simplified webhook handler that would receive a `user.created` event from your auth provider and insert the user into your `users` table:

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

`neon_auth.users_sync` table is automatically created and kept in sync by Neon Auth (no action needed from you) and is available for direct use in your schema and queries. Here is the table structure as [discussed above](#table-structure):

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
VALUES ('Buy groceries', 'user-id-123');
```

<Admonition type="tip" title="Simplified operations">
With Neon Auth, you skip the complexities of creating and synchronizing your own `users` table and implementing webhook handlers. Neon Auth handles the synchronization for you, making it much easier to build applications that rely on user data. This means you can directly reference the `neon_auth.users_sync` table in your schema and queries, and **updates to user profiles are automatically reflected** without you writing any synchronization code.  This significantly reduces development and maintenance overhead.
</Admonition>

For a more detailed walkthrough, see the [Neon Auth Tutorial](/docs/guides/neon-auth-tutorial).

## Getting started

Neon Auth offers two ways to connect your authentication provider:

1. **Quick Start (Recommended)**

   - Automatically provision a pre-configured Stack Auth project, managed by Neon
   - Includes recommended security settings
   - Best for new projects or first-time Stack Auth users

2. **Manual Setup**
   - Connect your existing Stack Auth project
   - Configure authentication settings to match your needs
   - Provide your Stack Auth project details during setup

Choose your setup option in the Neon Console under the **Auth** page.

<Admonition type="note">
Only [organization admins](/docs/manage/organizations#user-roles-and-permissions) can install or remove Neon Auth. Organization members and [project collaborators](/docs/guides/project-collaboration-guide) do not have permission to modify Neon Auth settings.
</Admonition>

## Transfer ownership

When you create a Neon Auth integration using the **Quick Start** option from the **Auth** page (or using the [Create integration API](/docs/guides/neon-auth-api#create-integration)), Neon manages the auth project for you.

<Tabs labels={["Neon Console", "API"]}>

<TabItem>

You can claim ownership of the project to your own Stack Auth account by clicking **Transfer ownership** in the **Auth** page.

![The Transfer ownership button appears when your integration is Neon managed](/docs/guides/auth-transfer-ownership.png)

This opens a transfer confirmation page where you can select which Stack Auth account should receive ownership of the project. After confirming the transfer, you'll have direct access to manage your project in the Stack Auth dashboard while maintaining the integration with your Neon database.

</TabItem>

<TabItem>

Request a transfer URL using the transfer ownership endpoint:

```bash shouldWrap
curl --request POST \
     --url 'https://console.neon.tech/api/v2/projects/auth/transfer_ownership' \
     --header 'authorization: Bearer $NEON_API_KEY' \
     --data '{
       "project_id": "project-id",
       "auth_provider": "stack"
     }'
```

Then open the returned URL in a browser to complete the transfer. See [Transfer ownership using the API](/docs/guides/neon-auth-api#transfer-to-your-auth-provider-optional) for details.

</TabItem>
</Tabs>

<Admonition type="note">
After transfer, you'll still be able to access your project from the Neon Console, but you'll also have direct access from the Stack Auth dashboard.
</Admonition>

## Creating users

You can create new users directly from the Neon Console, whether you're using a Neon-managed auth project or your own auth provider. This can be useful during development and testing.

![Create user in Neon Auth](/docs/guides/neon_auth_create_user.png)

The user will be created in your `neon_auth.users_sync` table and automatically propagated to your auth project (Neon-managed or provider-owned).

You can also create users from the API. See the next section for details.

## Using the API

You can manage your Neon Auth integration programmatically using the API. This includes creating integrations, managing users, and transferring ownership.

Key operations:

- Create or remove a Neon-managed auth integration
- Generate SDK keys for your integration
- Create users in your auth provider
- Transfer ownership to your auth provider

See [Manage Neon Auth using the API](/docs/guides/neon-auth-api) for more information.

## Permissions

For organization-owned projects, only organization admins can manage Neon Auth settings. Organization members and project collaborators can use Neon Auth features once configured — like adding users — but they cannot modify the integration settings.

The following table shows which actions each user can perform:

| Actions            | Admin | Members | Collaborator |
| ------------------ | :---: | :-----: | :----------: |
| Install Neon Auth  |  ✅   |   ❌    |      ❌      |
| Remove Neon Auth   |  ✅   |   ❌    |      ❌      |
| Transfer ownership |  ✅   |   ❌    |      ❌      |
| Generate SDK Keys  |  ✅   |   ❌    |      ❌      |
| Create users       |  ✅   |   ✅    |      ✅      |

For more information about organization roles and permissions, see [User roles and permissions](/docs/manage/organizations#user-roles-and-permissions).

## Best practices

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

## Limitations

<Admonition type="important">
Neon Auth is not compatible with Private Link (Neon Private Networking). If you have Private Link enabled for your Neon project, Neon Auth will not work. This is because Neon Auth requires internet access to connect to third-party authentication providers, while Private Link restricts connections to private AWS networks.
</Admonition>
