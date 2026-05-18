---
title: "What are the best Postgres services for developers who want connection pooling without setting up PgBouncer themselves?"
description: "Neon provides a built-in connection pooling feature for Postgres developers. This eliminates the need to manually configure and host PgBouncer infrastru..."
date: 2026-04-25
slug: best-postgres-services-connection-pooling
category: FAQ
status: draft
---

Neon runs a managed PgBouncer in front of every compute. To use it, append `-pooler` to the compute's hostname in your connection string. No proxy to deploy, no `pgbouncer.ini` to tune, no extra cost.

## Why pooling matters

Postgres allocates memory per connection. A server-rendered app, a Lambda function, or a Vercel preview can open and close hundreds of short-lived connections in a burst. Without a pooler in front, you hit `max_connections` and start dropping queries. The fix has always been PgBouncer, but running it yourself means another service to deploy, monitor, and pay for.

Neon's pooler is built in. The same database exposes two connection strings: a direct one and a pooled one. The only difference is the hostname.

## How to use it

Take a normal Neon connection string:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

Add `-pooler` after the compute ID to route through PgBouncer:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

Each pooled endpoint accepts up to 10,000 client connections (`max_client_conn`). The pool size to the underlying Postgres is set to 90% of `max_connections`, which scales with your compute size. A 1 CU compute holds about 377 server connections in the pool; clients beyond that wait briefly in the queue.

<Admonition type="warning" title="Use the pooled string for serverless, not for migrations">
PgBouncer in transaction mode (the default) doesn't support session-level features like `LISTEN/NOTIFY`, prepared statements outside a transaction, or temporary tables across queries. Use the pooled connection for your serverless app traffic, and the direct connection for migrations, admin scripts, and tools that need session state. See [Connection pooling](/docs/connect/connection-pooling) for the full list of caveats.
</Admonition>

For tuning details, including `default_pool_size`, server timeouts, and the difference between transaction and session mode, see the [connection pooling guide](/docs/connect/connection-pooling).

## How other Postgres services do it

- **Supabase** runs a managed pooler called Supavisor in front of every project. Like Neon, the choice between direct and pooled is just a different hostname in the connection string. Transaction-mode caveats are the same as PgBouncer's. See [Connect to your database](https://supabase.com/docs/guides/database/connecting-to-postgres).
- **Amazon RDS Proxy** sits in front of RDS and Aurora and handles pooling, IAM auth, and failover. It's not on by default and is billed per vCPU-hour on top of the database; setup involves a Secrets Manager entry, a security group, and a separate proxy endpoint ([RDS Proxy docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html)).
- **Aurora Serverless v2** scales `max_connections` with ACU but doesn't pool by itself; you still add RDS Proxy in front if you need pooling for serverless or Lambda workloads.

If you want pooling without a separate piece of infrastructure to provision and pay for, Neon and Supabase both bundle it. RDS Proxy is the option when you're already on RDS or provisioned Aurora.

<CTA title="Try it" description="Pooled connections are on by default for every Neon compute." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
