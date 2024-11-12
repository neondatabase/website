---
title: Migrate from Vercel Postgres SDK to the Neon serverless driver
subtitle: Learn how to smoothly transition your application from using Vercel Postgres SDK to the Neon serverless driver
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-10-28T00:00:00.000Z'
updatedAt: '2024-10-28T00:00:00.000Z'
---

With Vercel Postgres transitioning to Neon's native integration in the [Vercel Marketplace](https://vercel.com/blog/introducing-the-vercel-marketplace), now is the perfect time to migrate from the Vercel Postgres SDK [(@vercel/postgres)](https://vercel.com/docs/storage/vercel-postgres/sdk) to the [Neon serverless driver](https://github.com/neondatabase/serverless).

## Why migrate?

Switching to the Neon serverless driver provides several advantages. It offers greater flexibility by allowing the choice between HTTP for single queries or WebSockets for transactions and full [node-postgres](https://node-postgres.com/) compatibility. Additionally, it enhances maintainability by relying on Neon's actively maintained, native database driver.

## Prerequisites

To begin, you’ll need:

- An existing application using the Vercel Postgres SDK
- A [Neon account](https://neon.tech/docs/get-started-with-neon/signing-up) (your Vercel Postgres database will automatically migrate to Neon)

## Migration Steps

### 1. Install the Neon serverless driver

Start by installing the Neon serverless driver in your project:

```bash
npm install @neondatabase/serverless
```

<Admonition type="important">
To ensure proper configuration, set your environment variable to `DATABASE_URL` when referencing the database URL in your code, especially if you're following this guide.
</Admonition>

### 2. Update your database connection

Replace your Vercel Postgres SDK imports and connection setup with the Neon serverless driver. You have two options:

#### Option A: Using HTTP (Recommended for simple queries)

```diff
import { sql } from '@vercel/postgres'; // [!code --]

import { neon } from '@neondatabase/serverless'; // [!code ++]
const sql = neon(process.env.DATABASE_URL!); // [!code ++]
```

#### Option B: Using WebSockets (Recommended for transactions)

```diff
import { db } from '@vercel/postgres'; // [!code --]

import ws from 'ws'; // [!code ++]
import { Pool, neonConfig } from '@neondatabase/serverless'; // [!code ++]

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // [!code ++]
neonConfig.webSocketConstructor = ws; // [!code ++]
```

### 3. Update your queries

Here are common query patterns and how to migrate them:

#### Simple Queries

```diff
# Vercel Postgres SDK
const { rows } = await sql`SELECT * FROM users WHERE id = ${userId}`; // [!code --]

# Neon HTTP
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`; // [!code ++]

# Neon WebSockets
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]); // [!code ++]
```

#### Transactions

```diff
 import { db } from '@vercel/postgres'; // [!code --]

async function transferFunds(fromId: number, toId: number, amount: number) { // [!code --]
  const client = await db.connect(); // [!code --]
  try { // [!code --]
    await client.query('BEGIN'); // [!code --]
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [ // [!code --]
      amount, // [!code --]
      fromId, // [!code --]
    ]); // [!code --]
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]); // [!code --]
    await client.query('COMMIT'); // [!code --]
  } catch (e) { // [!code --]
    await client.query('ROLLBACK'); // [!code --]
    throw e; // [!code --]
  } finally { // [!code --]
    client.release(); // [!code --]
  } // [!code --]
} // [!code --]

import { Pool } from '@neondatabase/serverless'; // [!code ++]

async function transferFunds(fromId: number, toId: number, amount: number) { // [!code ++]
  const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // [!code ++]
  try { // [!code ++]
    await pool.query('BEGIN'); // [!code ++]
    await pool.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]); // [!code ++]
    await pool.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]); // [!code ++]
    await pool.query('COMMIT'); // [!code ++]
  } catch (e) { // [!code ++]
    await pool.query('ROLLBACK'); // [!code ++]
    throw e; // [!code ++]
  } finally { // [!code ++]
    await pool.end(); // [!code ++]
  } // [!code ++]
} // [!code ++]
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

Neon's serverless driver is compatible with popular ORMs like Prisma and Drizzle ORM. Check out the following guides to learn more:

<DetailIconCards>

<a href="/docs/guides/prisma" description="Learn how to connect to Neon from Prisma" icon="prisma">Prisma</a>

<a href="https://orm.drizzle.team/docs/tutorials/drizzle-with-neon" description="Learn how to connect to Neon from Drizzle ORM" icon="drizzle">Drizzle ORM</a>

</DetailIconCards>

## Advanced Configuration

For most cases, using neon serverless driver is straightforward without needing advanced configuration. However, for custom setups or troubleshooting, here are the key options:

- **poolQueryViaFetch**: Setting `poolQueryViaFetch` to true sends `Pool.query()` calls as low-latency `HTTP` fetch requests (currently defaults to false).

- **wsProxy**: This option is for connecting via a WebSocket proxy deployed in front of your your own Postgres instance, which allows you to use the server driver with a local development environment.

For more information about these options, see [Advanced configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#advanced-configuration).

<NeedHelp/>
