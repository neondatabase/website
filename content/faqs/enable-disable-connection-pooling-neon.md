---
title: 'How do I enable or disable connection pooling for my Neon database?'
subtitle: 'Toggle pooled connections from the Connect widget, or set pooler_enabled on the endpoint via the API.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

Open your project in the [Neon Console](https://console.neon.tech) and click **Connect** on the **Project Dashboard**. In the **Connect to your database** widget, toggle **Connection pooling** on or off. The displayed connection string switches between the pooled hostname (with a `-pooler` suffix) and the direct hostname. Pooled connections support up to 10,000 client connections through PgBouncer in transaction mode. See [Connection pooling](/docs/connect/connection-pooling) for the full reference.

## Toggle pooling from the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. On the **Project Dashboard**, click **Connect**.
3. In the **Connect to your database** modal, choose a **Branch**, **Compute**, **Database**, and **Role**.
4. Use the **Connection pooling** switch to flip between pooled and direct.

A pooled connection string has `-pooler` in the hostname:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

A direct connection string has no `-pooler` segment:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

The toggle does not turn the pooler off at the compute. It selects which hostname your app uses. Both endpoints are available as long as `pooler_enabled` is set on the compute.

## Set `pooler_enabled` via the API

To make the pooled hostname available (or remove it) for a compute, patch the endpoint:

```bash
curl -X PATCH \
  "https://console.neon.tech/api/v2/projects/$PROJECT_ID/endpoints/$ENDPOINT_ID" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ "endpoint": { "pooler_enabled": true } }'
```

Set `"pooler_enabled": false` to disable it. See [Manage computes with the Neon API](/docs/manage/computes#manage-computes-with-the-neon-api) and the [Update compute](https://api-docs.neon.tech/reference/updateprojectendpoint) reference.

## When to use pooled vs direct

Use the pooled hostname for:

- Serverless functions and edge runtimes
- Connection-per-request web frameworks
- Workloads with many short-lived connections

Use the direct hostname for:

- `pg_dump` and `pg_restore` (uses session-level `SET` statements)
- `LISTEN` / `NOTIFY`
- Long-running transactions, schema migrations, and SQL-level `PREPARE` / `DEALLOCATE`
- Session-level advisory locks and `SET` / `RESET`

Neon's PgBouncer runs in transaction mode, so anything that relies on persistent session state needs a direct connection. See the [pooled vs direct table](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections) for the full list.

<Admonition type="tip" title="Quick check">
If a connection string contains `-pooler`, you're using the pooled endpoint. If it doesn't, you're connecting directly.
</Admonition>

<CTA title="Read the full pooling guide" description="See how Neon configures PgBouncer, per-user pool sizes, and how to avoid common errors." buttonText="Connection pooling docs" buttonUrl="/docs/connect/connection-pooling" />
