---
title: 'How do I enable or disable connection pooling for my Neon database?'
subtitle: 'Toggle pooled connections in the Connect modal, or append -pooler to the endpoint hostname in your connection string.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I create and download a backup of my Neon database to my local machine?'
  slug: download-database-backup-locally
nextLink:
  title: 'How do I enable the pgvector extension in my Neon database?'
  slug: enable-pgvector-extension
---

You turn pooling on or off by choosing which hostname your app connects to. The pooler is always running, so there's no setting to change on the compute. A hostname with a `-pooler` suffix goes through Neon's PgBouncer pooler, which accepts up to 10,000 client connections in transaction mode. A hostname without it connects directly to Postgres. To get either string, click **Connect** in the [Neon Console](https://console.neon.tech) nav and turn the **Connection pooling** toggle on or off. See [Connection pooling](/docs/connect/connection-pooling) for the full reference.

## Switch between pooled and direct in the Console

1. Sign in to the [Neon Console](https://console.neon.tech) and select your project.
2. Click **Connect** in the Console nav.
3. In the **Connect to your branch** modal, choose a **Branch**, **Compute**, **Database**, and **Role**.
4. Turn **Connection pooling** on for the pooled string or off for the direct string, then copy it. The toggle is on by default for new projects.

The toggle only changes which string the modal displays. It doesn't start or stop the pooler.

A pooled connection string has `-pooler` in the hostname:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

A direct connection string doesn't:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

## Switch by editing the connection string

You can also add or remove `-pooler` after the endpoint ID (`ep-...`) in any connection string you already have. That's the method Neon recommends. The `pooler_enabled` property on the API's endpoint object is deprecated. See [How to use connection pooling](/docs/connect/connection-pooling#how-to-use-connection-pooling).

## When to use pooled vs direct

Use the pooled hostname for:

- Serverless functions and edge runtimes
- Web apps and connection-per-request frameworks
- Workloads with many short-lived connections

Use the direct hostname for:

- `pg_dump` and `pg_restore`, which use session-level `SET` statements
- Schema migrations, since some migration tools don't support transaction pooling
- Logical replication
- Long-running analytics queries, to avoid contention for pooled connections
- Session features that transaction mode doesn't support: `SET` / `RESET`, `LISTEN` / `NOTIFY`, SQL-level `PREPARE` / `DEALLOCATE`, and session-level advisory locks

See [When to use pooled vs direct connections](/docs/connect/connection-pooling#when-to-use-pooled-vs-direct-connections) for the full table.

<CTA title="Read the full pooling guide" description="See how Neon configures PgBouncer, per-user pool sizes, and how to avoid common errors." buttonText="Connection pooling docs" buttonUrl="/docs/connect/connection-pooling" />
