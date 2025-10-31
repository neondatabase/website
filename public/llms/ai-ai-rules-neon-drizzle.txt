# AI Rules: Neon with Drizzle

> The document "AI Rules: Neon with Drizzle" outlines the integration of AI-driven rules within the Neon platform using Drizzle, detailing the setup and configuration processes for implementing automated decision-making workflows.

## Source

- [AI Rules: Neon with Drizzle HTML](https://neon.com/docs/ai/ai-rules-neon-drizzle): The original HTML version of this documentation

**Note** AI Rules are in Beta: AI Rules are currently in beta. We're actively improving them and would love to hear your feedback. Join us on [Discord](https://discord.gg/92vNTzKDGp) to share your experience and suggestions.

Related docs:
- [Get started with Drizzle and Neon](https://orm.drizzle.team/docs/get-started/neon-new)

Repository:
- [README](https://github.com/neondatabase-labs/ai-rules)
- [neon-drizzle.mdc](https://github.com/neondatabase-labs/ai-rules/blob/main/neon-drizzle.mdc)

## How to use

You can use these rules in two ways:

## Option 1: Copy from this page

With Cursor, save the [rules](https://docs.cursor.com/context/rules-for-ai#project-rules-recommended) to `.cursor/rules/neon-drizzle.mdc` and they'll be automatically applied when working with matching files (`*.ts`, `*.tsx`).

For other AI tools, you can include these rules as context when chatting with your AI assistant - check your tool's documentation for the specific method (like using "Include file" or context commands).

## Option 2: Clone from repository

If you prefer, you can clone or download the rules directly from our [AI Rules repository](https://github.com/neondatabase-labs/ai-rules).

Once added to your project, AI tools will automatically use these rules when working with Neon with Drizzle code. You can also reference them explicitly in prompts.

## Rules

````md
---
description: Use this rules when integrating Neon (serverless Postgres) with Drizzle ORM
globs: *.ts, *.tsx
alwaysApply: false
---
# Neon and Drizzle Integration Guidelines

## Overview

This guide covers the specific integration patterns, configurations, and optimizations for using **Drizzle ORM** with **Neon** Postgres. Follow these guidelines to ensure efficient, secure, and robust database operations in serverless and traditional environments.

## Dependencies
For Neon with Drizzle ORM integration, include these specific dependencies. The `ws` package is required for persistent WebSocket connections in Node.js environments older than v22.

```bash
npm install drizzle-orm @neondatabase/serverless ws
npm install -D drizzle-kit dotenv @types/ws
```

## Neon Connection String
Always use the Neon connection string format and store it in an environment file (`.env`, `.env.local`).

```text
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require&channel_binding=require"
```

## Connection Setup: Choosing the Right Driver Adapter

Neon's serverless driver offers two connection methods: HTTP and WebSocket. Drizzle has a specific adapter for each.

### 1. HTTP Adapter (Recommended for Serverless/Edge)
This method is ideal for short-lived, stateless environments like Vercel Edge Functions or AWS Lambda. It uses `fetch` for each query, resulting in very low latency for single operations.

- Use the `neon` client from `@neondatabase/serverless`.
- Use the `drizzle` adapter from `drizzle-orm/neon-http`.

```typescript
// src/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
```

### 2. WebSocket Adapter (for `node-postgres` compatibility)
This method is suitable for long-running applications (e.g., a standard Node.js server) or when you need support for interactive transactions. It maintains a persistent WebSocket connection.

- Use the `Pool` client from `@neondatabase/serverless`.
- Use the `drizzle` adapter from `drizzle-orm/neon-serverless`.
- Configure the WebSocket constructor for Node.js environments older than v22.

```typescript
// src/db.ts
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { config } from "dotenv";
import ws from 'ws';

config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Required for Node.js < v22
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);
```

## Drizzle Config for Neon
Configure `drizzle.config.ts` to manage your schema and migrations. Neon is fully Postgres-compatible, so the dialect is `postgresql`.

```typescript
// drizzle.config.ts
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env.local' }); // Use .env.local for local dev

export default defineConfig({
  schema: "./src/schema.ts",
  out: "./drizzle", // Or your preferred migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});

```

## Migrations with Drizzle Kit
`drizzle-kit` is used to generate and apply schema changes to your Neon database.

### 1. Generate Migrations
After changing your schema in `src/schema.ts`, generate a new migration file.

```bash
npx drizzle-kit generate
```
This command reads your `drizzle.config.ts`, compares your schema to the database state, and creates SQL files in your output directory (`./drizzle`).

### 2. Apply Migrations
You can apply migrations via the command line or programmatically.

**Command Line:**
```bash
npx drizzle-kit migrate
```

## Schema Considerations for Neon

### Standard Postgres Schema
Define your schema using Postgres-specific types from `drizzle-orm/pg-core`.

```typescript
// src/schema.ts
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Export types for type safety
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

// Example posts table for relationship demonstrations
export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;
```

### Integrating the Neon Auth `users_sync` Table
Neon Auth automatically synchronizes user data to a `neon_auth.users_sync` table. Drizzle provides a dedicated helper to integrate this seamlessly.

- **Use the `usersSync` helper:** Import `usersSync` from `drizzle-orm/neon` to represent the table without defining its columns manually.
- **Create foreign key relationships:** Link your application tables to `usersSync.id` to enforce data integrity.

```typescript
// src/schema.ts
import { pgTable, text, bigint, boolean, timestamp } from 'drizzle-orm/pg-core';
// Import the dedicated Neon Auth helper from Drizzle
import { usersSync } from 'drizzle-orm/neon';
import { eq } from 'drizzle-orm';

// Example: A `todos` table where each todo belongs to a Neon Auth user
export const todos = pgTable('todos', {
  id: bigint('id', { mode: 'bigint' }).primaryKey().generatedByDefaultAsIdentity(),
  task: text('task').notNull(),
  isComplete: boolean('is_complete').default(false).notNull(),
  insertedAt: timestamp('inserted_at').defaultNow().notNull(),
  
  // Create a foreign key relationship to the users_sync table
  ownerId: text('owner_id')
    .notNull()
    .references(() => usersSync.id, { onDelete: 'cascade' }),
});

// This allows for direct SQL joins with user data
async function getTodosWithUserEmails(db) {
  return db
    .select({
      task: todos.task,
      ownerEmail: usersSync.email
    })
    .from(todos)
    .leftJoin(usersSync, eq(todos.ownerId, usersSync.id));
}
```

## Neon-Specific Query Optimizations

### Efficient Queries for Serverless
Optimize for Neon's serverless environment:
- Keep connections short-lived
- Use prepared statements for repeated queries
- Batch operations when possible

```typescript
// Example of optimized query for Neon
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { usersTable } from '../schema';

export async function batchInsertUsers(users: NewUser[]) {
  // More efficient than multiple individual inserts on Neon
  return db.insert(usersTable).values(users).returning();
}

// For complex queries, use prepared statements
export const getUsersByRolePrepared = db.select()
  .from(usersTable)
  .where(sql`${usersTable.role} = $1`)
  .prepare('get_users_by_role');

// Usage: getUsersByRolePrepared.execute(['admin'])
```

### Transaction Handling with Neon
Neon supports transactions through Drizzle:

```typescript
import { db } from '../db';
import { usersTable, postsTable } from '../schema';

export async function createUserWithPosts(user: NewUser, posts: NewPost[]) {
  return await db.transaction(async (tx) => {
    const [newUser] = await tx.insert(usersTable).values(user).returning();
    
    if (posts.length > 0) {
      await tx.insert(postsTable).values(
        posts.map(post => ({
          ...post,
          userId: newUser.id
        }))
      );
    }
    
    return newUser;
  });
}
```



## Working with Neon Branches
A key feature of Neon is database branching. You can create isolated copies of your database for development, testing, or preview environments. Manage connections to these branches using environment variables.

Here is a common pattern for setting up your database client to connect to different branches based on the environment:

```typescript
// Using different Neon branches with environment variables
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// For multi-branch setup
const getBranchUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'development') {
    return process.env.DEV_DATABASE_URL;
  } else if (env === 'test') {
    return process.env.TEST_DATABASE_URL;
  }
  return process.env.DATABASE_URL;
};

const sql = neon(getBranchUrl()!);
export const db = drizzle({ client: sql });
```

## Neon-Specific Error Handling
Handle Neon-specific connection issues:

```typescript
import { db } from '../db';
import { usersTable } from '../schema';

export async function safeNeonOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Handle Neon-specific error codes
    if (error.message?.includes('connection pool timeout')) {
      console.error('Neon connection pool timeout');
      // Handle appropriately
    }
    
    // Re-throw for other handling
    throw error;
  }
}

// Usage
export async function getUserSafely(id: number) {
  return safeNeonOperation(() => 
    db.select().from(usersTable).where(eq(usersTable.id, id))
  );
}
```

## Best Practices for Neon with Drizzle

1. **Connection Management**
   - Keep connection times short for serverless functions
   - Use connection pooling for high traffic applications

2. **Neon Features**
   - Utilize Neon branching for development and testing
   - Consider Neon's auto-scaling for database design

3. **Query Optimization**
   - Batch operations when possible
   - Use prepared statements for repeated queries
   - Optimize complex joins to minimize data transfer

4. **Schema Design**
   - Leverage Postgres-specific features supported by Neon
   - Use appropriate indexes for your query patterns
   - Consider Neon's performance characteristics for large tables
````
