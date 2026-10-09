---
title: 'Where can I find the pooled connection string in my Neon dashboard?'
subtitle: 'Open the Connect modal in the Neon Console and turn Connection pooling on.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'Where can I find or generate API keys for Neon?'
  slug: find-or-generate-neon-api-keys
nextLink:
  title: 'What are the limits and quotas for Neon''s Free plan?'
  slug: free-plan-limits-and-quotas
---

Open your project in the [Neon Console](https://console.neon.tech), click **Connect** in the Console nav, and make sure the **Connection pooling** toggle is on (it's on by default for new projects). The hostname in the pooled string has a `-pooler` suffix, which routes traffic through Neon's PgBouncer pooler. The pooler is always available, and the toggle only changes which string the modal shows.

## Get the pooled string

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Make sure **Connection pooling** is on.
5. Copy the connection string.

A pooled URL looks like:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The direct URL for the same compute is the same except for the missing `-pooler`:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

See [Connect from any app](/docs/connect/connect-from-any-app) for a breakdown of each part.

## Pooled vs direct: which one to use

Neon's pooled endpoint accepts up to 10,000 client connections per compute and shares a smaller pool of Postgres connections among them. Use it when direct connections would exceed `max_connections`, which is 104 on a 0.25 CU (≈1 GB RAM) compute and 419 on a 1 CU (≈4 GB RAM) compute. Use direct connections for workloads that can't go through the pooler.

| Use case                                                      | Use this |
| ------------------------------------------------------------- | -------- |
| Serverless functions (Vercel, AWS Lambda, Cloudflare Workers) | Pooled   |
| Web apps with many short-lived connections                    | Pooled   |
| ORMs (Prisma, Drizzle) in production                          | Pooled   |
| Schema migrations and `pg_dump`                               | Direct   |
| `LISTEN`/`NOTIFY`                                             | Direct   |
| Logical replication                                           | Direct   |
| Long-running analytics or session-level features              | Direct   |

The pooler runs PgBouncer in transaction mode, so session-level features like `SET`, `LISTEN`/`NOTIFY`, and SQL-level `PREPARE` don't work over a pooled connection. Use a direct connection for those.

See [Connection pooling](/docs/connect/connection-pooling) for the full guidance, including the connection limits per compute size.

<Admonition type="tip" title="You can use both">
Use the pooled URL for app queries and the direct URL for migrations. Neon's [Vercel-managed integration](/docs/guides/vercel-managed-integration) and ORM guides store them as two environment variables: `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct).
</Admonition>

<CTA title="How pooling works in Neon" description="Pool sizes by compute, transaction-mode caveats, and monitoring pooler activity." buttonText="Read the docs" buttonUrl="/docs/connect/connection-pooling" />
