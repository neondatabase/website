---
title: AI Rules Neon Serverless Driver
subtitle: Context rules for AI tools to help implement the Neon Serverless driver
enableTableOfContents: true
updatedOn: '2025-05-30T16:54:40.446Z'
---

<InfoBlock>
<DocsList title="Related docs" theme="docs">
  <a href="/docs/serverless/serverless-driver">Neon Serverless Driver</a>
</DocsList>

<DocsList title="Repository" theme="repo">
  <a href="https://github.com/neondatabase-labs/ai-rules#readme">README</a>
  <a href="https://github.com/neondatabase-labs/ai-rules/blob/main/neon-serverless.mdc">neon-serverless.mdc</a>
</DocsList>
</InfoBlock>

<AIRule file="neon-serverless.mdc" name="Neon Serverless" />

## Rules

````markdown shouldWrap
---
description: Use these rules to query your Neon database using the Neon Serverless driver
globs: *.tsx, *.ts
alwaysApply: false
---

# Neon Serverless Guidelines

## Overview

This guide provides specific patterns and best practices for connecting to Neon databases in serverless environments. Follow these guidelines to ensure efficient database connections, proper query handling, and optimal performance in functions with ephemeral runtimes.

## Installation

Install the Neon Serverless PostgreSQL driver with the correct package name:

```bash
npm install @neondatabase/serverless
```

```bash
bunx jsr add @neon/serverless
```

For projects that depend on pg but want to use Neon:

```json
"dependencies": {
  "pg": "npm:@neondatabase/serverless@^0.10.4"
},
"overrides": {
  "pg": "npm:@neondatabase/serverless@^0.10.4"
}
```

Avoid incorrect package names like `neon-serverless` or `pg-neon`.

## Connection String

Use environment variables for database connection strings:

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
```

Never hardcode credentials:

```javascript
// Don't do this
const sql = neon('postgres://username:password@host.neon.tech/neondb');
```

## Parameter Interpolation

Use template literals with the SQL tag for safe parameter interpolation:

```javascript
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
```

Don't concatenate strings directly (SQL injection risk):

```javascript
// Don't do this
const [post] = await sql('SELECT * FROM posts WHERE id = ' + postId);
```

## WebSocket Environments

Configure WebSocket support for Node.js v21 and earlier:

```javascript
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket support for Node.js
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
```

## Serverless Lifecycle Management

In serverless environments, create, use, and close connections within a single request handler:

```javascript
export default async (req, ctx) => {
  // Create pool inside request handler
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const { rows } = await pool.query('SELECT * FROM users');
    return new Response(JSON.stringify(rows));
  } finally {
    // Close connection before response completes
    ctx.waitUntil(pool.end());
  }
};
```

Avoid creating connections outside request handlers as they won't be properly closed.

## Query Functions

Choose the appropriate query function based on your needs:

```javascript
// For simple one-shot queries (uses fetch, fastest)
const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;

// For multiple queries in a single transaction
const [posts, tags] = await sql.transaction([
  sql`SELECT * FROM posts LIMIT 10`,
  sql`SELECT * FROM tags`,
]);

// For session/transaction support or compatibility with libraries
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();
```

Use `neon()` for simple queries rather than `Pool` when possible, and use `transaction()` for multiple related queries.

## Transactions

Use proper transaction handling with error management:

```javascript
// Using transaction() function for simple cases
const [result1, result2] = await sql.transaction([
  sql`INSERT INTO users(name) VALUES(${name}) RETURNING id`,
  sql`INSERT INTO profiles(user_id, bio) VALUES(${userId}, ${bio})`,
]);

// Using Client for interactive transactions
const client = await pool.connect();
try {
  await client.query('BEGIN');
  const {
    rows: [{ id }],
  } = await client.query('INSERT INTO users(name) VALUES($1) RETURNING id', [name]);
  await client.query('INSERT INTO profiles(user_id, bio) VALUES($1, $2)', [id, bio]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}
```

Always include proper error handling and rollback mechanisms.

## Environment-Specific Optimizations

Apply environment-specific optimizations for best performance:

```javascript
// For Vercel Edge Functions, specify nearest region
export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Region nearest to your Neon DB
};

// For Cloudflare Workers, consider using Hyperdrive instead
// https://neon.com/blog/hyperdrive-neon-faq
```

## Error Handling

Implement proper error handling for database operations:

```javascript
// Pool error handling
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Query error handling
try {
  const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  if (!post) {
    return new Response('Not found', { status: 404 });
  }
} catch (err) {
  console.error('Database query failed:', err);
  return new Response('Server error', { status: 500 });
}
```

## Library Integration

Properly integrate with query builders and ORM libraries:

```javascript
// Kysely integration
import { Pool } from '@neondatabase/serverless';
import { Kysely, PostgresDialect } from 'kysely';

const dialect = new PostgresDialect({
  pool: new Pool({ connectionString: process.env.DATABASE_URL }),
});

const db = new Kysely({
  dialect,
  // schema definitions...
});
```

Don't attempt to use the `neon()` function directly with ORMs that expect a Pool interface.
````
