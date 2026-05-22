---
title: 'Where can I find the pooled connection string in my Neon dashboard?'
subtitle: 'Open the Connect widget on the Project Dashboard and toggle Connection pooling on.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

Open your project in the [Neon Console](https://console.neon.tech), click **Connect** on the **Project Dashboard**, and turn the **Connection pooling** toggle on. The hostname in the connection string gains a `-pooler` suffix, which routes traffic through Neon's PgBouncer pool. The toggle is on by default for new projects.

## Get the pooled string

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.
3. Pick a **Branch**, **Compute**, **Database**, and **Role**.
4. Make sure **Connection pooling** is on.
5. Copy the connection string.

A pooled URL looks like:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The direct URL for the same compute is identical except the hostname has no `-pooler`:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

See [Connect from any app](/docs/connect/connect-from-any-app) for the field-by-field breakdown.

## Pooled vs direct: which one to use

Neon's pooled endpoint supports up to 10,000 concurrent client connections by multiplexing them over a smaller pool of real Postgres connections. Use it when you'd otherwise exhaust `max_connections` (104 on a 0.25 CU compute, 419 on a 1 CU compute).

| Use case                                                      | Use this |
| ------------------------------------------------------------- | -------- |
| Serverless functions (Vercel, AWS Lambda, Cloudflare Workers) | Pooled   |
| Web apps with many short-lived connections                    | Pooled   |
| ORMs (Prisma, Drizzle) in production                          | Pooled   |
| Schema migrations and `pg_dump`                               | Direct   |
| `LISTEN`/`NOTIFY`                                             | Direct   |
| Logical replication                                           | Direct   |
| Long-running analytics or session-level features              | Direct   |

The pooled endpoint runs PgBouncer in transaction mode, which means session-level features like `SET`, `LISTEN`/`NOTIFY`, and SQL `PREPARE` aren't available. Use a direct connection for those.

See [Connection pooling](/docs/connect/connection-pooling) for the full guidance, including the connection limits per compute size.

<Admonition type="tip" title="You can use both">
A common pattern is to use the pooled URL for runtime queries and the direct URL for migrations. Most app frameworks let you set two environment variables (for example, `DATABASE_URL` for pooled, `DIRECT_URL` for direct). Prisma's `directUrl` field is one such example.
</Admonition>

<CTA title="How pooling works in Neon" description="Pool sizes by compute, transaction-mode caveats, and monitoring pooler activity." buttonText="Read the docs" buttonUrl="/docs/connect/connection-pooling" />
