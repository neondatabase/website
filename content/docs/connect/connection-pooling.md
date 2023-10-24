---
title: Connection pooling
subtitle: Learn how to enable connection pooling in Neon
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
updatedOn: '2023-10-19T23:10:12.816Z'
---

Neon uses [PgBouncer](https://www.pgbouncer.org/) to offer support for connection pooling, enabling up to 10,000 concurrent connections. PgBouncer is a lightweight connection pooler for Postgres.

This topic describes Neon's default connection limits, how connection pooling works, and how you can enable connection pooling for your applications.

## Default connection limits

Each Postgres connection creates a new process in the operating system, which consumes resources. Postgres limits the number of open connections for this reason. The Postgres connection limit is defined by the `max_connections` parameter.

In Neon, the size of your compute determines the `max_connections` setting. The formula used to calculate `max_connections` is `RAM in bytes / 9531392 bytes`. For a Neon Free Tier compute, which has 1 GB of RAM, this works out to approximately 100 connections. Larger computes offered with the [Neon Pro Plan](/docs/introduction/pro-plan) have more RAM and therefore support a larger number of connections. For example, a compute with 12 GB of RAM supports 1351 connections. You can check the `max_connections` limit for your compute by running the following query from the Neon SQL Editor or a client connected to Neon:

```sql
SHOW max_connections;
```

Even with the largest compute size, the `max_connections` limit may not be sufficient for some applications, such as those that use serverless functions. To increase the number of connections that Neon supports, you can use _connection pooling_. All Neon plans, including the [Neon Free Tier](/docs/introduction/free-tier), support connection pooling.

## Connection pooling

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations, running many instances of an application, or applications with serverless functions. With regular Postgres, new connections are rejected when reaching the `max_connections` limit. To overcome this limitation, Neon supports connection pooling using [PgBouncer](https://www.pgbouncer.org/), which allows Neon to support up to 10,000 concurrent connections.

PgBouncer is an open-source connection pooler for Postgres. When an application needs to connect to a database, PgBouncer provides a connection from the pool. Connections in the pool are routed to a smaller number of actual Postgres connections. When a connection is no longer required, it is returned to the pool and is available to be used again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

Neon uses `PgBouncer` in `transaction mode`. For limitations associated with `transaction mode`, see [Connection pooling notes and limitations](#connection-pooling-notes-and-limitations). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Enable connection pooling

Enabling connection pooling in Neon requires adding a `-pooler` suffix to the compute endpoint ID, which is part of the Neon hostname. Connections that specify the `-pooler` suffix in the connection string use a pooled connection.

You can add the `-pooler` suffix to the endpoint ID in your connection string as shown:

<CodeBlock shouldWrap>

```text
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

</CodeBlock>

The **Connection Details** widget on the Neon **Dashboard** provides **Pooled connection** checkbox that adds the `-pooler` option to a connection string that you can copy and paste.

![Connection Details pooled connection string](/docs/connect/connection_details_pooled.png)

## Connection pooling notes and limitations

Neon uses PgBouncer in _transaction mode_, which does not support Postgres features such as prepared statements or [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html). For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.

## Need help?

Join the [Neon community forum](https://community.neon.tech/) to ask questions or see what others are doing with Neon. [Neon Pro Plan](/docs/introduction/pro-plan) users can open a support ticket from the console. For more detail, see [Getting Support](/docs/introduction/support).
