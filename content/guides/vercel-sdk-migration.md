---
title: Migrate from Vercel Postgres SDK to the Neon serverless driver
subtitle: Move your application from the Vercel Postgres SDK to the Neon serverless driver
author: dhanush-reddy
enableTableOfContents: true
createdAt: '2024-10-28T00:00:00.000Z'
updatedAt: '2024-10-28T00:00:00.000Z'
---

Vercel transitioned all Vercel Postgres stores to Neon's native integration in the [Vercel Marketplace](https://vercel.com/blog/introducing-the-vercel-marketplace) (see the [Vercel Postgres transition guide](/docs/guides/vercel-postgres-transition-guide)). This guide shows how to migrate your code from the Vercel Postgres SDK [(@vercel/postgres)](https://vercel.com/docs/storage/vercel-postgres/sdk) to the [Neon serverless driver](https://github.com/neondatabase/serverless).

## Why migrate?

The Neon serverless driver lets you choose between HTTP for one-shot queries and non-interactive transactions, or WebSockets for sessions, interactive transactions, and full [node-postgres](https://node-postgres.com/) compatibility. Neon actively maintains it.

## Prerequisites

To begin, you’ll need:

- An existing application using the Vercel Postgres SDK
- A [Neon account](/docs/get-started/signing-up) (Vercel Postgres databases have already moved to Neon)

## Migration steps

### 1. Install the Neon serverless driver

Start by installing the Neon serverless driver in your project:

```bash
npm install @neondatabase/serverless
```

<Admonition type="important">
The examples in this guide read the connection string from a `DATABASE_URL` environment variable. Make sure that variable is set in your environment, or change the examples to match the variable name you use.
</Admonition>

### 2. Update your database connection

Replace your Vercel Postgres SDK imports and connection setup with the Neon serverless driver. You have two options:

#### Option A: Using HTTP (recommended for one-shot queries)

```diff
import { sql } from '@vercel/postgres'; // [!code --]

import { neon } from '@neondatabase/serverless'; // [!code ++]
const sql = neon(process.env.DATABASE_URL!); // [!code ++]
```

#### Option B: Using WebSockets (recommended for interactive transactions)

```diff
import { db } from '@vercel/postgres'; // [!code --]

import ws from 'ws'; // [!code ++]
import { Pool, neonConfig } from '@neondatabase/serverless'; // [!code ++]

const pool = new Pool({ connectionString: process.env.DATABASE_URL }); // [!code ++]
neonConfig.webSocketConstructor = ws; // [!code ++]
```

### 3. Update your queries

Here are common query patterns and how to migrate them:

#### Simple queries

```diff
# Vercel Postgres SDK
const { rows } = await sql`SELECT * FROM users WHERE id = ${userId}`; // [!code --]

# Neon HTTP
const rows = await sql`SELECT * FROM users WHERE id = ${userId}`; // [!code ++]

# Neon WebSockets
const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]); // [!code ++]
```

#### Transactions

An interactive transaction must run all its statements on one connection, so check out a client with `pool.connect()` instead of calling `pool.query()` for each statement:

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
  const client = await pool.connect(); // [!code ++]
  try { // [!code ++]
    await client.query('BEGIN'); // [!code ++]
    await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [amount, fromId]); // [!code ++]
    await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [amount, toId]); // [!code ++]
    await client.query('COMMIT'); // [!code ++]
  } catch (e) { // [!code ++]
    await client.query('ROLLBACK'); // [!code ++]
    throw e; // [!code ++]
  } finally { // [!code ++]
    client.release(); // [!code ++]
    await pool.end(); // [!code ++]
  } // [!code ++]
} // [!code ++]
```

## Best practices

1.  **Choose the right connection method**:
    - Use HTTP (`neon()`) for one-shot queries and non-interactive transactions with [`sql.transaction()`](/docs/serverless/serverless-driver#issue-multiple-queries-with-the-transaction-function).
    - Use WebSockets (`Pool`) for interactive transactions and session-based operations.

2.  **Connection management**:
    - For HTTP queries, reuse the `sql` query function.
    - In serverless environments, WebSocket connections can't outlive a single request. Create, use, and close the `Pool` inside the request handler:

    ```typescript
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    try {
      // Your queries here
    } finally {
      await pool.end();
    }
    ```

3.  **Error handling**:
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

## Advanced configuration

Most applications don't need advanced configuration. For custom setups or troubleshooting, these are the key options:

- **poolQueryViaFetch**: Setting `poolQueryViaFetch` to true sends `Pool.query()` calls as low-latency `HTTP` fetch requests (currently defaults to false).

- **wsProxy**: This option is for connecting via a WebSocket proxy deployed in front of your own Postgres instance, which allows you to use the Neon serverless driver with a local development environment.

For more information about these options, see [Advanced configuration](https://github.com/neondatabase/serverless/blob/main/CONFIG.md#advanced-configuration).

<NeedHelp/>
