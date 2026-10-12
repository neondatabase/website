---
title: 'How do I connect my application to my Neon database using the connection string?'
subtitle: 'Read DATABASE_URL from your environment and pass it to a Postgres driver.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Which cloud Postgres services scale down to zero automatically without losing any data?'
  slug: cloud-postgres-services-scale-zero-data
nextLink:
  title: 'How do I create a new database in my Neon project?'
  slug: create-new-database-neon-project
---

Click **Connect** in the Neon Console to open the **Connect to your branch** modal and copy the connection string ([docs](/docs/connect/connect-from-any-app)). Save it as an environment variable (usually `DATABASE_URL`) and pass it to a Postgres driver in your code. Lakebase Postgres speaks the standard Postgres wire protocol, so standard clients and ORMs work: `pg`, `psycopg2`, `psql`, Prisma, Drizzle, SQLAlchemy, and others. For serverless and edge runtimes, the [Neon serverless driver](/docs/serverless/serverless-driver) connects over HTTP or WebSockets instead of TCP.

## 1. Save the connection string in `.env`

```text filename=".env"
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

Add `.env` to `.gitignore`. Keep the `sslmode=require` and `channel_binding=require` parameters, because Lakebase Postgres requires TLS.

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

Each connection string comes in two forms:

- **Pooled** (hostname has `-pooler`): routes through PgBouncer in transaction mode and accepts up to 10,000 client connections per compute. Use it for serverless functions, web apps, and other high-concurrency clients.
- **Direct**: connects straight to Postgres. Use it for migrations, `pg_dump`, `LISTEN`/`NOTIFY`, logical replication, and other session-level features. The `max_connections` limit for direct connections depends on compute size, from 104 at 0.25 CU to 4,000 at 9 CU and above.

The **Connection pooling** toggle in the modal switches between them, and pooled is the default. A common setup is `DATABASE_URL` for the pooled string and a second variable, such as `DIRECT_URL`, for the direct string that migrations use. See [Connection pooling](/docs/connect/connection-pooling) for when to use which.

<Admonition type="important" title="Always read the string from the environment">
The connection string includes your password, so a URL hardcoded in source code ends up in your Git history. Read it from `process.env.DATABASE_URL`, `os.environ`, or your secret manager. If you deploy to Vercel, Render, Fly, or a similar host, set `DATABASE_URL` in its environment settings. The [Vercel-Managed Integration](/docs/guides/vercel-managed-integration) sets it for you.
</Admonition>

<CTA title="Choose your connection method" description="Compare drivers and connection types based on where you're deploying." buttonText="Read the docs" buttonUrl="/docs/connect/choose-connection" />
