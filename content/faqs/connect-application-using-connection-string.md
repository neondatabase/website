---
title: 'How do I connect my application to my Neon database using the connection string?'
subtitle: 'Read DATABASE_URL from your environment and pass it to a Postgres driver.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Once you have a connection string from the **Connect** widget on your Neon **Project Dashboard**, save it as an environment variable (commonly `DATABASE_URL`) and pass it to a Postgres driver in your code. Neon speaks the standard Postgres wire protocol, so anything that talks to Postgres works: `pg`, `psycopg2`, `psql`, Prisma, Drizzle, SQLAlchemy, and so on. For serverless and edge runtimes, the [Neon serverless driver](/docs/serverless/serverless-driver) adds HTTP and WebSocket access.

## 1. Save the connection string in `.env`

```text filename=".env"
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

Add `.env` to `.gitignore`. Keep the `sslmode=require` and `channel_binding=require` parameters in place. Neon requires TLS.

## 2. Connect from your code

<CodeTabs labels={["Node.js (neon)", "Node.js (pg)", "Python (psycopg2)", "psql"]}>

```javascript
// Best for serverless and edge runtimes
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT * FROM users WHERE id = ${1}`;
console.log(rows);
```

```javascript
// Standard Node.js (Express, Fastify, long-lived servers)
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [1]);
console.log(rows);
```

```python
import os
import psycopg2

with psycopg2.connect(os.environ["DATABASE_URL"]) as conn:
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM users WHERE id = %s", (1,))
        rows = cur.fetchall()
        print(rows)
```

```bash
psql "$DATABASE_URL"
```

</CodeTabs>

For Prisma, Drizzle, SQLAlchemy, and other ORMs, see the [framework guides](/docs/get-started/frameworks).

## 3. Pick the right connection type

Neon offers two flavors of the same connection string:

- **Pooled** (hostname has `-pooler`): routes through PgBouncer in transaction mode and supports up to 10,000 concurrent client connections per compute. Use it for serverless functions, web apps, and high-concurrency clients.
- **Direct**: opens a session straight to Postgres. Use it for migrations, `pg_dump`, `LISTEN`/`NOTIFY`, logical replication, and any session-level features. The number of direct connections you can hold open scales with compute size.

The Connect widget gives you either by toggling **Connection pooling**. Most apps set `DATABASE_URL` to the pooled URL and `DIRECT_URL` to the direct URL for migrations. See [Connection pooling](/docs/connect/connection-pooling) for when to use which.

<Admonition type="important" title="Always read the string from the environment">
Hardcoding the URL in source code is a common source of credential leaks. Read it from `process.env.DATABASE_URL`, `os.environ`, or your secret manager. If you're deploying to Vercel, Render, Fly, or similar, set `DATABASE_URL` in the platform's env settings. The [Neon-Vercel integration](/docs/guides/vercel-managed-integration) sets it automatically.
</Admonition>

<CTA title="Choose your connection method" description="Compare drivers and connection types based on where you're deploying." buttonText="Read the docs" buttonUrl="/docs/connect/choose-connection" />
