---
title: 'Where can I find my DATABASE_URL in Neon?'
subtitle: 'Copy it from the Connect modal in the Neon Console and add it to your .env file.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Where can I find my database connection string in Neon?'
  slug: find-database-connection-string
nextLink:
  title: 'Where can I find or generate API keys for Neon?'
  slug: find-or-generate-neon-api-keys
---

Your `DATABASE_URL` is the Postgres connection string Neon builds for you. Open your project in the [Neon Console](https://console.neon.tech), click **Connect** in the Console nav, and copy the connection string from the **Connect to your branch** modal. Save it in your app's `.env` file as `DATABASE_URL`.

## Get the URL

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the connection string. Leave **Connection pooling** on unless you need a direct connection (for example, for migrations or `pg_dump`).

A Neon `DATABASE_URL` looks like:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Lakebase Postgres requires SSL/TLS, which `sslmode=require` enforces on the client side. `channel_binding=require` makes the client and server authenticate each other with SCRAM-SHA-256-PLUS. Keep both unless your client doesn't support channel binding. See [Connect to Neon securely](/docs/connect/connect-securely) and [Connect from any app](/docs/connect/connect-from-any-app).

## Use it in your app

Add it to `.env`:

```text filename=".env"
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

Then read it in your code:

<CodeTabs labels={["Node.js", "Python", "Next.js"]}>

```javascript
import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
```

```python
import os
import psycopg2

conn = psycopg2.connect(os.environ["DATABASE_URL"])
```

```javascript
// app/api/route.ts
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT now()`;
```

</CodeTabs>

Some integrations and ORMs expect a second, direct connection string alongside `DATABASE_URL`:

- **Vercel**: The [Vercel-managed integration](/docs/guides/vercel-managed-integration) adds `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) to your Vercel project's environment variables.
- **Prisma**: In Prisma 7 and later, your app connects through the Neon adapter with the pooled `DATABASE_URL`, and `prisma.config.ts` points the Prisma CLI at the direct string (`DATABASE_URL_UNPOOLED`) for migrations. In Prisma 6 and earlier, set `url` (pooled) and `directUrl` (direct) in `schema.prisma`. See [Connect from Prisma](/docs/guides/prisma).
- **Drizzle**: Your app uses the pooled `DATABASE_URL`, and Drizzle Kit migrations use a direct `DATABASE_URL_UNPOOLED`. See [Connect from Drizzle](/docs/guides/drizzle).

<Admonition type="warning" title="Treat DATABASE_URL as a secret">
The URL contains the role's password in plain text. Don't commit it to a repo, write it to logs, or paste it in a chat. If it leaks, [reset the role's password](/docs/manage/roles#reset-a-password) right away. The old URL stops working when the reset completes.
</Admonition>

<CTA title="Framework guides" description="Find your stack's guide for Next.js, Django, Laravel, Ruby on Rails, and more." buttonText="See all guides" buttonUrl="/docs/get-started/frameworks" />
