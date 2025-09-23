---
title: Simplify RLS with Drizzle
subtitle: Use Drizzle ORM to declaratively manage Row-Level Security policies in your
  schema
enableTableOfContents: true
updatedOn: '2025-09-03T00:13:41.648Z'
redirectFrom:
  - /docs/guides/neon-rls-authorize-drizzle
  - /docs/guides/neon-authorize-drizzle
  - /docs/guides/neon-rls-drizzle
---

<InfoBlock>
<DocsList title="What you'll learn">
<p>How to simplify Row-Level Security using `crudPolicy`</p>
<p>Common RLS patterns with Drizzle</p>
<p>How to use custom Postgres roles with your policies</p>
<p>How to set up Drizzle clients for both authenticated user queries and admin tasks</p>
<p>Using RLS with Data API</p>
</DocsList>

<DocsList title="Related docs" theme="docs">
  <a href="/docs/guides/row-level-security">Row-Level Security with Neon</a>
  <a href="/docs/data-api/get-started">Data API</a>
  <a href="https://orm.drizzle.team/docs/rls">RLS in Drizzle</a>
</DocsList>
</InfoBlock>

Row-Level Security (RLS) is an important last line of defense for protecting your data at the database level. It ensures that users can only access the data they are permitted to see. However, implementing RLS requires writing and maintaining separate SQL policies for each CRUD operation (Create, Read, Update, Delete), which can be both tedious and error-prone.

Drizzle ORM provides a declarative way to manage these policies directly within your database schema, making your security rules easier to write, review, and maintain.

## Understanding Neon's auth functions

The Neon [Data API](/docs/data-api/get-started) provides the `auth.user_id()` function that automatically extracts user information from JWT claims and makes it available in your RLS policies. It works like this:

```typescript
// In your RLS policy
using: sql`(select auth.user_id() = ${table.userId})`,
```

If you want to use your own JWT validation, you can use something like:

```javascript
// Set JWT claims and query data in a transaction
const [, my_table] = await sql.transaction([
  sql`SELECT set_config('request.jwt.claims', ${claims}, true)`,
  sql`SELECT * FROM my_table`,
]);
```

All code samples on this page assume you are using the Data API. If using your own JWT validation, make sure you modify your code accordingly.

### Granting Permissions to Postgres Roles

When you enable the Data API, it creates two special roles for you: `authenticated` and `anonymous`. These roles enable you to manage access for logged-in users (authenticated) and users who are not logged in (anonymous).

By default, the Data API grants the necessary permissions to these roles, but you can customize them as needed.

<Admonition type="important">
The following `GRANT` statements only assign table privileges to the `authenticated` and `anonymous` roles. You must still define appropriate Row-Level Security (RLS) policies for each table to control what actions these roles can perform, according to your application's requirements.

When using RLS, ensure your database connection string uses a role that does **not** have the `BYPASSRLS` attribute. Avoid using the `neondb_owner` role in your connection string, as it bypasses Row-Level Security policies.
</Admonition>

The following SQL statements grant **all privileges** (SELECT, UPDATE, INSERT, DELETE) on all existing and future tables in the `public` schema to both the `authenticated` and `anonymous` roles. You may adjust these statements to fit your specific role and permission requirements.

> For more details on managing database access and roles, see [Managing Database Access](/docs/manage/database-access).

```sql
-- Grant permissions on all existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  TO authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  TO anonymous;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO authenticated;

ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO anonymous;

-- Grant USAGE on the "public" schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anonymous;
```

- **Authenticated role**: Used for logged-in users. Your application should provide an authorization token when connecting with this role.
- **Anonymous role**: Used for users who are not logged in. This role should have restricted access, typically limited to reading public data, and should not be permitted to perform sensitive operations.

By setting these permissions, you establish a clear separation of access between authenticated and anonymous users, ensuring your security policies are enforced at the database level.

## Example schema

Below is a sample schema for a basic todo application. This example demonstrates how you would define the table structure and manually create Row-Level Security (RLS) policies for each CRUD operation using plain SQL.

```sql
CREATE TABLE IF NOT EXISTS "todos" (
    "id" bigint PRIMARY KEY,
    "user_id" text DEFAULT (auth.user_id()) NOT NULL,
    "task" text NOT NULL,
    "is_complete" boolean DEFAULT false NOT NULL
);

-- This boilerplate SQL code is required for every table you want to secure
ALTER TABLE "todos" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "create todos" ON "todos" FOR INSERT
TO "authenticated"
WITH CHECK ((select auth.user_id()) = user_id);

CREATE POLICY "view todos" ON "todos" FOR SELECT
TO "authenticated"
USING ((select auth.user_id()) = user_id);

CREATE POLICY "update todos" ON "todos" FOR UPDATE
TO "authenticated"
USING ((select auth.user_id()) = user_id)
WITH CHECK ((select auth.user_id()) = user_id);

CREATE POLICY "delete todos" ON "todos" FOR DELETE
TO "authenticated"
USING ((select auth.user_id()) = user_id);
```

These SQL policies guarantee that authenticated users can only create, view, update, or delete todo items they own, that is when `auth.user_id()` matches the `user_id` column for a given row. This enforces strict, per-user access control at the database level.

In these RLS policies, the `USING` clause defines the condition under which a row is accessible (readable) by a user, while the `WITH CHECK` clause enforces the condition required for inserting or updating a row. Together, these clauses provide precise, row-level access control to your data.

While this approach is secure and explicit, it can quickly become repetitive and hard to maintain as your application grows and you introduce more tables or roles. Drizzle’s declarative `crudPolicy` and `pgPolicy` helpers eliminate this boilerplate, letting you define and manage your security logic directly in your Drizzle schema for better maintainability.

## Simplifying RLS with crudPolicy

Drizzle provides a convenient `crudPolicy` helper to simplify the creation of RLS policies. With `crudPolicy`, you can achieve the same result declaratively. For example:

```typescript {17-21}
import { pgTable, text, bigint, boolean } from 'drizzle-orm/pg-core';
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';
import { sql } from 'drizzle-orm';

export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
  },
  (table) => [
    // Apply RLS policies for the 'authenticated' role
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId), // Users can only read their own todos
      modify: authUid(table.userId), // Users can only create, update, or delete their own todos
    }),
  ]
);
```

### Configuration parameters

The `crudPolicy` function from `drizzle-orm/neon` is a high-level helper that declaratively generates Row-Level Security (RLS) policies for your tables. It accepts the following parameters:

- **`role`**: The Postgres role or array of roles the policy applies to. Neon provides `authenticatedRole` and `anonymousRole` out of the box, but you can also use custom roles.
- **`read`**: Controls access to `SELECT` operations. Accepts:
  - `true` to allow all reads for the role
  - `false` to deny all reads
  - a custom SQL expression for fine-grained access (e.g., `authUid(table.userId)`)
  - `null` to skip generating a `SELECT` policy
- **`modify`**: Controls access to `INSERT`, `UPDATE`, and `DELETE` operations. Accepts:
  - `true` to allow all modifications
  - `false` to deny all modifications
  - a custom SQL expression for conditional access (e.g., `authUid(table.userId)`)
  - `null` to skip generating policies for these operations

The `crudPolicy` helper generates an array of RLS policy definitions for all CRUD operations (select, insert, update, delete) based on these parameters. For most use cases, this lets you express common access patterns with minimal boilerplate.

> The `authUid(column)` helper generates the SQL condition `(select auth.user_id() = column)`, which is used to restrict access to rows owned by the current user for use in `read` and `modify` policies.

### Advanced usage: Finer-grained control with `pgPolicy`

While `crudPolicy` is ideal for scenarios where a role has the same permissions for reading and modifying data, there are cases where you need more granular control. For these situations, you can use Drizzle's `pgPolicy` function, which provides the flexibility to define custom policies for each operation.

Using `pgPolicy` is ideal when you need to:

- Define different logic for `INSERT` vs. `UPDATE` operations.
- Create a policy for a single command, like `DELETE` only.
- Implement complex conditions where the `USING` and `WITH CHECK` clauses differ significantly.

For example, you might want to allow only users with an `admin` role to update or delete rows in a table, while regular users can insert new rows and view only their own data. This kind of scenario where different roles have different permissions for each operation is easy to express using `pgPolicy`, giving you fine-grained control over who can perform which actions on your data.

#### Replicating `crudPolicy` with `pgPolicy`

To understand how `pgPolicy` works, let's rewrite the `todos` example using it. The following four `pgPolicy` definitions are exactly what `crudPolicy` would generate from your simpler configuration.

```typescript {18-22,25-29,32-37,40-44}
import { pgTable, text, bigint, boolean, pgPolicy } from 'drizzle-orm/pg-core';
import { authenticatedRole, authUid } from 'drizzle-orm/neon';
import { sql } from 'drizzle-orm';

export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
  },
  (table) => {
    return [
      // Policy for viewing (SELECT) todos
      pgPolicy('view todos', {
        for: 'select',
        to: authenticatedRole,
        using: authUid(table.userId), // users can only read their own todos
      }),

      // Policy for creating (INSERT) todos
      pgPolicy('create todos', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: authUid(table.userId), // users can only create their own todos
      }),

      // Policy for updating (UPDATE) todos
      pgPolicy('update todos', {
        for: 'update',
        to: authenticatedRole,
        using: authUid(table.userId), // users can only update their own todos
        withCheck: authUid(table.userId), // users can only update their own todos
      }),

      // Policy for deleting (DELETE) todos
      pgPolicy('delete todos', {
        for: 'delete',
        to: authenticatedRole,
        using: authUid(table.userId), // users can only delete their own todos
      }),
    ];
  }
);
```

You can apply this approach to additional tables and operations, allowing you to define increasingly sophisticated and tailored security policies as your application's requirements evolve.

#### Example: Time limited updates

Here is how you can implement a rule that `crudPolicy` can't handle alone: **A user can update their todo, but only within 24 hours of creating it.** They should still be able to view and delete it anytime.

This requires a different `WITH CHECK` condition for `UPDATE` than the `USING` condition.

```typescript {17,20,24-28,31-35,38-42,45-50}
import { pgTable, text, bigint, timestamp, pgPolicy, boolean } from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/neon';
import { sql } from 'drizzle-orm';

export const todos = pgTable(
  'todos',
  {
    id: bigint('id', { mode: 'number' }).primaryKey(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    task: text('task').notNull(),
    isComplete: boolean('is_complete').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    const userOwnsTodo = sql`(select auth.user_id() = ${table.userId})`;

    // Condition for updates: user must own the todo AND it must be less than 24 hours old.
    const canUpdateTodo = sql`(${userOwnsTodo} and ${table.createdAt} > now() - interval '24 hours')`;

    return [
      // View policy remains the same.
      pgPolicy('view todos', {
        for: 'select',
        to: authenticatedRole,
        using: userOwnsTodo,
      }),

      // Insert policy also remains the same.
      pgPolicy('create todos', {
        for: 'insert',
        to: authenticatedRole,
        withCheck: userOwnsTodo,
      }),

      // Delete policy remains the same.
      pgPolicy('delete todos', {
        for: 'delete',
        to: authenticatedRole,
        using: userOwnsTodo,
      }),

      // The update policy now has a different, stricter WITH CHECK condition.
      pgPolicy('update todos (time-limited)', {
        for: 'update',
        to: authenticatedRole,
        using: userOwnsTodo, // User must own the row to even attempt an update.
        withCheck: canUpdateTodo, // The updated row must satisfy this stricter condition.
      }),
    ];
  }
);
```

This example demonstrates how `pgPolicy` gives you precise, command-level control over your security rules, making it easy to implement complex business logic directly in your database schema.

### Securing database views with RLS

Row-Level Security (RLS) can also be enabled on Postgres views, allowing you to control access to view data at the row level. For details on how to enable RLS on views and apply policies using Drizzle, refer to the [Drizzle documentation](https://orm.drizzle.team/docs/rls#rls-on-views). This approach makes it possible to expose curated or joined subsets of your data while ensuring users only see the rows they are authorized to access.

## Common RLS patterns

Using `crudPolicy` and `pgPolicy`, you can implement a variety of security models. Here are some of the most common ones:

### User-Owned Data

This is the most common RLS pattern, where each user can access only the records they own. It's ideal for applications such as personal to-do lists, user profile settings, or any scenario where users should have full control over their own data and no visibility into others' information. As demonstrated in the todos example above, this approach ensures strict data isolation and privacy.

A typical `crudPolicy` and a `pgPolicy` for this scenario might look like:

<CodeTabs labels={["Drizzle (crudPolicy)", "Drizzle (pgPolicy)"]}>

```typescript
[
  crudPolicy({
    role: authenticatedRole,
    read: authUid(table.userId),
    modify: authUid(table.userId),
  }),
];
```

```typescript
[
  pgPolicy('view todos', {
    for: 'select',
    to: authenticatedRole,
    using: authUid(table.userId),
  }),
  pgPolicy('create todos', {
    for: 'insert',
    to: authenticatedRole,
    withCheck: authUid(table.userId),
  }),
  pgPolicy('update todos', {
    for: 'update',
    to: authenticatedRole,
    using: authUid(table.userId),
    withCheck: authUid(table.userId),
  }),
  pgPolicy('delete todos', {
    for: 'delete',
    to: authenticatedRole,
    using: authUid(table.userId),
  }),
];
```

</CodeTabs>

### Role-based access control

Assign different permissions to anonymous users and authenticated users. For example, in a blog application, anyone can read posts, but only authenticated users can modify their own content. This setup uses separate policies for the `anonymousRole` (public read access) and the `authenticatedRole` (user-specific modifications), making it ideal for applications that distinguish between public and logged-in user actions.

A typical Drizzle schema with `crudPolicy` and `pgPolicy` for this scenario might look like:

<CodeTabs labels={["Drizzle (crudPolicy)", "Drizzle (pgPolicy)"]}>

```typescript {17-21,23-27}
import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid, anonymousRole } from 'drizzle-orm/neon';
import { bigint, boolean, pgTable, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id')
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Public read access
    crudPolicy({
      role: anonymousRole,
      read: true, // Anyone can read
      modify: false, // No one can modify anonymously
    }),
    // Policy for authenticated users
    crudPolicy({
      role: authenticatedRole,
      read: true, // Can also read all posts
      modify: authUid(table.userId), // Can only modify their own posts
    }),
  ]
);
```

```typescript {17-37,40-60}
import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid, anonymousRole } from 'drizzle-orm/neon';
import { bigint, boolean, pgPolicy, pgTable, text } from 'drizzle-orm/pg-core';

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Anonymous users
    pgPolicy('Allow anonymous users to read any post', {
      to: anonymousRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('Deny anonymous users from inserting posts', {
      to: anonymousRole,
      for: 'insert',
      withCheck: sql`false`,
    }),
    pgPolicy('Deny anonymous users from updating posts', {
      to: anonymousRole,
      for: 'update',
      withCheck: sql`false`,
      using: sql`false`,
    }),
    pgPolicy('Deny anonymous users from deleting posts', {
      to: anonymousRole,
      for: 'delete',
      using: sql`false`,
    }),

    // Authenticated users
    pgPolicy('Allow authenticated users to read any post', {
      to: authenticatedRole,
      for: 'select',
      using: sql`true`,
    }),
    pgPolicy('Allow authenticated users to insert their own posts', {
      to: authenticatedRole,
      for: 'insert',
      withCheck: authUid(table.userId),
    }),
    pgPolicy('Allow authenticated users to update their own posts', {
      to: authenticatedRole,
      for: 'update',
      using: authUid(table.userId),
      withCheck: authUid(table.userId),
    }),
    pgPolicy('Allow authenticated users to delete their own posts', {
      to: authenticatedRole,
      for: 'delete',
      using: authUid(table.userId),
    }),
  ]
);
```

</CodeTabs>

### Complex relationships & shared data

Secure data based on relationships in other tables, such as allowing access to a shared document only if the user is part of a specific group or project. This often involves more complex SQL queries and may require additional metadata to be stored alongside your main data.

This is where Drizzle really helps: expressing these relationship based policies declaratively in your schema is much less error-prone and far easier to maintain than writing raw SQL policies by hand.

For example, suppose you have a `notes` table and a `paragraphs` table that contains the text of each note. You want to ensure that users can only access paragraphs from notes they own or that are shared with them.

```typescript {17-21,23-27,40-44,46-50} shouldWrap
import { sql } from 'drizzle-orm';
import { crudPolicy, authenticatedRole, authUid } from 'drizzle-orm/neon';
import { boolean, pgPolicy, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const notes = pgTable(
  'notes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .default(sql`auth.user_id()`),
    title: text('title').notNull().default('untitled note'),
    shared: boolean('shared').default(false),
  },
  (table) => [
    // Users can only access their own notes
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.ownerId),
      modify: authUid(table.ownerId),
    }),
    // Shared notes are visible to authenticated users
    pgPolicy('shared_policy', {
      for: 'select',
      to: authenticatedRole,
      using: sql`${table.shared} = true`,
    }),
  ]
);

export const paragraphs = pgTable(
  'paragraphs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    noteId: uuid('note_id').references(() => notes.id),
    content: text('content').notNull(),
  },
  (table) => [
    // Users can only access paragraphs from their own notes
    crudPolicy({
      role: authenticatedRole,
      read: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
      modify: sql`(select notes.owner_id = auth.user_id() from notes where notes.id = ${table.noteId})`,
    }),
    // Shared note paragraphs are visible to authenticated users
    pgPolicy('shared_policy', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select notes.shared from notes where notes.id = ${table.noteId})`,
    }),
  ]
);
```

In this example:

- Users can only access paragraphs from notes they own or that are shared with them.
- Shared paragraphs are visible to authenticated users.

This pattern can be adapted for other relationship-based access controls, such as project teams, organization memberships, or shared resources.

### Using Custom Roles with Drizzle RLS

Custom roles are essential when your application requires more nuanced access control than what default roles (like `authenticated` or `anonymous`) provide. By defining custom roles, you can assign specific permissions to different user groups, such as moderators, editors, or admins, tailoring access to fit your business logic and security needs.

For example, in a blog application, you might define an `editor` role that can update or delete any post, while regular users can only modify their own posts. This approach lets you implement granular access control by assigning permissions based on each role's responsibilities.

Here's how you can define custom roles and apply policies in Drizzle:

```typescript {5,19-23,25-29}
import { sql } from 'drizzle-orm';
import { authenticatedRole, authUid, crudPolicy } from 'drizzle-orm/neon';
import { bigint, boolean, pgRole, pgTable, text } from 'drizzle-orm/pg-core';

export const editorRole = pgRole('editor');

export const posts = pgTable(
  'posts',
  {
    id: bigint({ mode: 'number' }).primaryKey(),
    userId: text()
      .notNull()
      .default(sql`(auth.user_id())`),
    content: text().notNull(),
    published: boolean().notNull().default(false),
  },
  (table) => [
    // Editors: full access
    crudPolicy({
      role: editorRole,
      read: true, // Editors can read all posts
      modify: true, // Editors can modify all posts
    }),
    // Authenticated users (authors): can only modify their own posts
    crudPolicy({
      role: authenticatedRole,
      read: true, // Can read all posts
      modify: authUid(table.userId), // Can only modify their own posts
    }),
  ]
);
```

<Admonition type="important">
It's important to note that while Drizzle RLS policies define row-level access, you must also grant the necessary table privileges to the `editor` role directly in Postgres. Drizzle does not manage these privileges for you. Make sure to follow the instructions in [Granting Permissions to Postgres Roles](#granting-permissions-to-postgres-roles) to ensure the `editor` role has the required access.
</Admonition>

This approach lets you easily combine multiple roles with different permissions in your schema, keeping your access logic clear and maintainable.

## Client side integration

Defining policies is only half the story. You also need to configure your Drizzle client to send authenticated requests from your application.

### Handling multiple connection strings

A typical secure setup uses two or more database connection strings:

1.  **Admin/Direct URL**: Used for running migrations and performing admin tasks from a secure backend. This connection has broad permissions.
2.  **RLS/Authenticated URL**: Used for client-facing queries. This is the special Neon connection string that enforces JWT validation and RLS.

It's best practice to initialize two separate Drizzle clients.

```typescript
// src/db/admin.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use for migrations and backend administrative tasks
const sql = neon(process.env.DATABASE_URL_ADMIN!);
export const dbAdmin = drizzle(sql);

// src/db/user.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use for all user-facing queries that need RLS
const sql = neon(process.env.DATABASE_URL_AUTHENTICATED!);
export const dbUser = drizzle(sql);

// src/db/anonymous.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use for all anonymous user queries
const sql = neon(process.env.DATABASE_URL_ANONYMOUS!);
export const dbAnonymous = drizzle(sql);
```

> You can find and copy the connection strings for each database role in your Neon Project dashboard.

### Additional drizzle clients for custom roles

If your application uses custom roles: such as `editor`, `moderator`, or `admin`, you should create similar Drizzle clients for each role. This allows you to use different connection strings or authentication tokens, ensuring that each client enforces the correct permissions and Row-Level Security (RLS) policies.

For example, to add an `editor` client:

```typescript
// src/db/editor.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Use for editor-specific operations
const sql = neon(process.env.DATABASE_URL_EDITOR!);
export const dbEditor = drizzle(sql);
```

You can then use `dbEditor` for queries that require editor privileges, while continuing to use `dbUser` and `dbAdmin` for their respective roles. This approach keeps your access control clear and ensures that each part of your application interacts with the database using the appropriate permissions.

### Authenticating queries with `.$withAuth()`

When using the `drizzle-orm/neon-http` driver with your RLS connection string, you must provide a valid JWT for every query. Drizzle enables this with the `.$withAuth()` method.

Here is a simple example of fetching todos for the currently logged-in user:

```typescript
import { dbUser } from '@/db/user';
import { todos } from '@/db/schema';

async function getTodosForUser(authToken: string) {
  // The .$withAuth() call injects the JWT into the request header.
  // Neon's proxy validates the token and makes auth.user_id() available to your RLS policies.
  const userTodos = await dbUser.$withAuth(authToken).select().from(todos);

  return userTodos;
}
```

> Replace `authToken` with your actual JWT token. Refer to your authentication provider’s documentation for instructions on obtaining this token, look for terms like "session token," "JWT," or "auth token".

If your queries use the anonymous role, you don't need to call `.$withAuth()`—authentication is only required for roles that enforce user-specific access. In those cases use the `dbAnonymous` client.

### Creating a reusable RLS client helper

Instead of calling `.$withAuth(await getToken())` for every query, you can streamline your workflow with a reusable helper. The following function integrates authentication and user context, making it easy to run queries with Row-Level Security (RLS) enforced.

The following example code uses Clerk for authentication. You must adapt it to your authentication provider to retrieve the user's JWT.

```typescript
import * as schema from '@/app/schema';
import { auth } from '@clerk/nextjs/server';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function fetchWithDrizzle<T>(
  callback: (
    db: Omit<
      NeonHttpDatabase<typeof schema> & {
        $client: NeonQueryFunction<false, false>;
      },
      '_' | 'transaction' | '$withAuth' | 'batch' | '$with' | '$client'
    >,
    { userId, authToken }: { userId: string; authToken: string }
  ) => Promise<T>
) {
  const { getToken, userId } = auth();
  const authToken = await getToken();

  if (!authToken) {
    // Optionally, you can fall back to using `DATABASE_ANONYMOUS_URL` if your application's access policies allow anonymous queries.
    throw new Error('No authentication token found.');
  }

  if (!userId) {
    throw new Error('No userId');
  }

  const db = drizzle(neon(process.env.DATABASE_AUTHENTICATED_URL!), {
    schema,
  });
  const dbWithAuth = db.$withAuth(authToken);
  return callback(dbWithAuth, { userId, authToken });
}
```

This helper ensures that every query is executed with the correct authentication context, reducing boilerplate and centralizing your RLS logic.

**Example usage in a Server Action (e.g., Next.js):**

```typescript
'use server';

import { fetchWithDrizzle } from '@/app/db';
import * as schema from '@/app/schema';
import { asc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Insert a new todo for the current user
export async function insertTodo({ newTodo }: { newTodo: string }) {
  await fetchWithDrizzle(async (db) => {
    return db.insert(schema.todos).values({
      task: newTodo,
      isComplete: false,
    });
  });
}

// Fetch todos for the current user, ordered by creation time
export async function getTodos() {
  return fetchWithDrizzle(async (db) => {
    // WHERE filter is optional due to RLS, but included for performance
    return db
      .select()
      .from(schema.todos)
      .where(eq(schema.todos.userId, sql`auth.user_id()`))
      .orderBy(asc(schema.todos.insertedAt));
  });
}
```

This pattern uses a reusable `fetchWithDrizzle` helper to ensure authentication and Row-Level Security (RLS) are consistently applied to all database operations, keeping your server actions clean and secure.

## Example applications

To see these concepts in action, check out these sample applications:

- **[Data API Demo](https://github.com/neondatabase-labs/neon-data-api-neon-auth)**: A note-taking app demonstrating `crudPolicy` with Neon's Data API.
- **[Social Wall Demo](https://github.com/neondatabase-labs/social-wall-drizzle-neon-rls)**: A social media app using `crudPolicy` with Neon RLS (JWT/JWKS integration).

<NeedHelp/>
