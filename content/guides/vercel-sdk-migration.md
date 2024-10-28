---
title: Migrate from Vercel Postgres SDK to the Neon serverless driver
subtitle: Learn how to smoothly transition your Next.js application from the Vercel Postgres SDK to the Neon serverless driver
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-10-28T00:00:00.000Z'
updatedAt: '2024-10-28T00:00:00.000Z'
---

With Vercel Postgres transitioning to Neon's native integration in the [Vercel Marketplace](https://vercel.com/blog/introducing-the-vercel-marketplace), now is the perfect time to migrate from the Vercel Postgres SDK (@vercel/postgres) to the Neon serverless driver. This guide will walk you through the migration process, helping you leverage the full power of Neon's serverless PostgreSQL capabilities.

## Why migrate?

Switching to the Neon serverless driver offers several advantages over the Vercel Postgres SDK:

- **Direct database access**: Connect directly to your database without added abstraction layers.
- **Enhanced performance**: Benefit from Neon's optimized database driver.
- **Greater flexibility**: Choose HTTP for single queries or WebSockets for transactions.
- **Improved maintainability**: Rely on Neon's actively maintained, native database driver.

## Prerequisites

To begin, you’ll need:

- An existing Next.js application using the Vercel Postgres SDK
- A [Neon account](https://neon.tech/docs/get-started-with-neon/signing-up) (your Vercel Postgres database will automatically migrate to Neon)
- Basic knowledge of PostgreSQL and Next.js

## Migration Steps

### 1. Install the Neon serverless driver

Start by installing the Neon serverless driver in your Next.js project:

```bash
npm install @neondatabase/serverless
```

### 2. Update your database connection

Replace your Vercel Postgres SDK imports and connection setup with the Neon serverless driver. You have two options:

#### Option A: Using HTTP (Recommended for simple queries)

```typescript
// Before (Vercel Postgres SDK)
import { sql } from '@vercel/postgres';

// After (Neon serverless driver)
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.POSTGRES_URL!);
```

#### Option B: Using WebSockets (Recommended for transactions)

```typescript
// Before (Vercel Postgres SDK)
import { db } from '@vercel/postgres';

// After (Neon serverless driver)
import { Pool, neonConfig } from '@neondatabase/serverless';
const ws = require('ws');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
neonConfig.webSocketConstructor = ws;
```

### 3. Update your queries

Here are common query patterns and how to migrate them:

#### Simple Queries

```typescript
// Before (Vercel Postgres SDK)
const { rows } = await sql`SELECT * FROM users WHERE id = ${userId}`;

// After (Neon HTTP)
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`;

// After (Neon WebSockets)
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

#### Transactions

```typescript
// Before (Vercel Postgres SDK)
import { db } from '@vercel/postgres';

async function transferFunds(fromId: number, toId: number, amount: number) {
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [
      amount,
      fromId,
    ]);
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

// After (Neon serverless driver - WebSockets)
import { Pool } from '@neondatabase/serverless';

async function transferFunds(fromId: number, toId: number, amount: number) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query('BEGIN');
    await pool.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]);
    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]);
    await pool.query('COMMIT');
  } catch (e) {
    await pool.query('ROLLBACK');
    throw e;
  } finally {
    await pool.end();
  }
}
```

### 4. Environment Variables

Update your environment variable names if necessary:

```bash
# Before
POSTGRES_URL="postgres://..."

# After
DATABASE_URL="postgres://..."
```

## Best practices

1.  **Choose the right connection method**:

    - Use HTTP (`neon()`) for single queries and simple transactions.
    - Use WebSockets (`Pool`) for complex transactions and session-based operations.

2.  **Connection management**:

    - For HTTP queries, reuse the `sql` query function.
    - For WebSocket connections in serverless environments, always close connections:

    ```typescript
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
      // Your queries here
    } finally {
      await pool.end();
    }
    ```

3.  **Error Handling**:
    ```typescript
    try {
      const result = await sql`SELECT * FROM users`;
      return result;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error('Failed to fetch users');
    }
    ```

## Working with ORMs

If you're using an ORM, here are the recommended configurations:

### Prisma

Install the Prisma adapter for Neon, along with the Neon serverless driver and ws packages:

```bash
npm install @prisma/adapter-neon @neondatabase/serverless ws
npm install --save-dev @types/ws
```

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });
```

### Drizzle ORM

Install the Neon serverless driver and Drizzle ORM:

```bash
npm install @neondatabase/serverless drizzle-orm ws
npm install --save-dev @types/ws
```

For HTTP connections:

```typescript
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

For WebSocket connections:

```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });
```

## Conclusion

Migrating from the Vercel Postgres SDK to the Neon serverless driver allows direct access to Neon's powerful features and optimizations. With flexible HTTP and WebSocket connections, you can tailor your database operations to meet the needs of your specific use case, from rapid single queries to complex transactions.

<NeedHelp/>
