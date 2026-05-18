---
title: 'Where can I find my DATABASE_URL in Neon?'
subtitle: 'Copy it from the Connect widget on the Project Dashboard and drop it into your .env.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Your `DATABASE_URL` is the Postgres connection string Neon builds for you. Open your project in the [Neon Console](https://console.neon.tech), click **Connect** on the **Project Dashboard**, and copy the connection string from the **Connect to your database** modal. Paste it into your framework's `.env` file as `DATABASE_URL` and you're set.

## Get the URL

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Copy the connection string. Keep **Connection pooling** on unless you specifically need a direct connection.

A Neon `DATABASE_URL` looks like:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

Both `sslmode=require` and `channel_binding=require` are part of the URL because Neon requires TLS. Don't strip them. See [Connect from any app](/docs/connect/connect-from-any-app) for what each segment means.

## Use it in your app

Save it as `DATABASE_URL` in your `.env`:

```text filename=".env"
DATABASE_URL="postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
```

Then read it from your code:

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

Common conventions in framework integrations:

- **Vercel**: When you connect Neon through the Vercel integration, Neon writes `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) to your Vercel project's env vars. See the [Vercel managed integration](/docs/guides/vercel-managed-integration).
- **Prisma**: Set `url = env("DATABASE_URL")` (pooled) and `directUrl = env("DIRECT_URL")` (direct) in `schema.prisma`. See [Connect from Prisma](/docs/guides/prisma).
- **Drizzle**: A single `DATABASE_URL` (pooled) is usually enough. See [Connect from Drizzle](/docs/guides/drizzle).

<Admonition type="warning" title="Treat DATABASE_URL as a secret">
The URL contains the role's password in plain text. Never commit it to a repo, log it, or paste it in a chat. If it ever leaks, [reset the role's password](/docs/manage/roles#reset-a-password) right away. The old URL stops working as soon as the reset completes.
</Admonition>

<CTA title="Framework guides" description="Find your stack's guide for Next.js, Prisma, Drizzle, Django, FastAPI, and more." buttonText="See all guides" buttonUrl="/docs/get-started/frameworks" />
