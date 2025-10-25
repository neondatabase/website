# Using Neon Auth with Drizzle ORM

> The document outlines the process for integrating Neon Auth with Drizzle ORM, detailing configuration steps and code examples to enable authentication within a Neon database environment.

## Source

- [Using Neon Auth with Drizzle ORM HTML](https://neon.com/docs/neon-auth/quick-start/drizzle): The original HTML version of this documentation

Neon Auth simplifies user management by automatically synchronizing user data into a `neon_auth.users_sync` table within your Neon Postgres database. This powerful feature allows you to treat user profiles as regular database rows, enabling you to create foreign key relationships, perform SQL joins, and apply row-level security (RLS) policies directly against your user data.

[Drizzle ORM](https://orm.drizzle.team/) provides first-class support for Neon Auth through a dedicated helper function, making it easy to integrate the `users_sync` table into your application's schema without manual configuration or schema introspection.

This guide explains how to use the `usersSync` helper from Drizzle to connect your application's tables to user data.

## The `usersSync` helper

Instead of defining the schema for the `neon_auth.users_sync` table manually, you can import the `usersSync` helper directly from the `drizzle-orm/neon` package. This helper provides a complete, type-safe schema definition for the table.

To use it, simply import it into your schema file:

```typescript
import { usersSync } from 'drizzle-orm/neon';
```

## `users_sync` table schema

The `usersSync` helper exposes the following columns, which are automatically populated by Neon Auth:

| Column      | Type                       | Description                                                      |
| :---------- | :------------------------- | :--------------------------------------------------------------- |
| `id`        | `text` (Primary Key)       | The unique identifier for the user.                              |
| `name`      | `text` (nullable)          | The user's full name.                                            |
| `email`     | `text` (nullable)          | The user's primary email address.                                |
| `rawJson`   | `jsonb`                    | The complete user object from the auth provider, in JSON format. |
| `createdAt` | `timestamp with time zone` | The timestamp when the user was created.                         |
| `updatedAt` | `timestamp with time zone` | The timestamp when the user was last updated.                    |
| `deletedAt` | `timestamp with time zone` | The timestamp when the user was deleted (soft delete).           |

## Creating a foreign key relationship

The most common use case for the `usersSync` helper is to establish a foreign key relationship between your application's tables and the user data. This ensures data integrity and allows you to easily associate data with the user who owns it.

Let's consider a simple `todos` table where each todo item must belong to a user.

### Define your application schema

In your Drizzle schema file (e.g., `app/db/schema.ts`), define your `todos` table and use the `usersSync` helper to create a reference to the user's `id`.

```typescript
import { pgTable, text, timestamp, bigint, boolean } from 'drizzle-orm/pg-core';
import { usersSync } from 'drizzle-orm/neon';

// Define a `todos` table that links to the `users_sync` table
export const todos = pgTable('todos', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
  task: text('task').notNull(),
  isComplete: boolean('is_complete').notNull().default(false),
  insertedAt: timestamp('inserted_at', { withTimezone: true }).defaultNow().notNull(),

  // Create a foreign key to the `users_sync` table
  ownerId: text('owner_id')
    .notNull()
    .references(() => usersSync.id),
});
```

### Understand the relationship

The key part of the schema above is the `ownerId` column:

```typescript
ownerId: text('owner_id')
  .notNull()
  .references(() => usersSync.id),
```

This code does the following:

- Creates a column named `owner_id` of type `text`.
- Ensures the column cannot be null (`.notNull()`).
- Establishes a foreign key constraint that references the `id` column in the `neon_auth.users_sync` table, which is represented by `usersSync.id`.

With this relationship in place, your database will enforce that every todo must be associated with a valid user.

### Querying with joins

Because `users_sync` is a real database table, you can now perform standard SQL `JOIN` operations to fetch user data alongside your application data in a single, efficient query.

For example, you can retrieve all todos along with the email address of the user who owns them:

```typescript
import { db } from '@/app/db';
import { todos } from '@/app/db/schema';
import { usersSync } from 'drizzle-orm/neon';
import { eq } from 'drizzle-orm';

export async function getTodosWithOwners() {
  const results = await db
    .select({
      task: todos.task,
      isComplete: todos.isComplete,
      ownerEmail: usersSync.email,
    })
    .from(todos)
    .leftJoin(usersSync, eq(todos.ownerId, usersSync.id));

  return results;
}
```

## Summary

By using Drizzle ORM's `usersSync` helper, you can seamlessly integrate Neon Auth user data into your application's database schema. This enables you to build powerful, data-consistent features by leveraging standard SQL capabilities like foreign keys and joins, all without writing complex data synchronization logic.
