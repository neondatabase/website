---
title: Connection pooling
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
---

Each PostgreSQL connection creates a new process in the operating system, which consumes resources. PostgreSQL limits the number of open connections for this reason. In Neon, the size of your compute determines the `max_connections` limit. The formula used to calculate `max_connections` is `RAM in bytes / 9531392 bytes`. For a Free Tier compute, which has 1 GB of RAM, this works out to approximately 100 connections. Larger computes offered with the Neon Pro plan have more RAM and therefore support a larger number of connections. For example, a compute with 12 GB of RAM supports 1351 connections. You can check the `max_connections` limit for your compute by running `SHOW max_connections;` from the Neon SQL Editor or from a client connected to Neon.

<Admonition type="note">
When [Autoscaling](../introduction/autoscaling) is enabled, `max_connections` is calculated based on the minimum compute size you selected in your Autoscaling configuration.
</Admonition>

A small number of connections are reserved for administrative purposes. The `max_connections` limit may not be sufficient for some applications. To increase the number of connections that Neon supports, you can use connection pooling.

<Admonition type="note">
Connection pooling is supported with [Autoscaling](../introduction/autoscaling) <b><sup>Beta</sup></b>. If you expect a large number of concurrent connections, we recommend using a **Fixed size** compute (the default), which supports connection pooling. For compute configuration instructions, see [Compute size and Autoscaling configuration](../manage/endpoints#compute-size-and-autoscaling-configuration).
</Admonition>

## Connection pooling

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations, to running many instances of an application, or to applications with serverless functions. With regular PostgreSQL, new connections are rejected when reaching the `max_connections` limit. To overcome this limitation, Neon supports connection pooling using [PgBouncer](https://www.pgbouncer.org/), allowing Neon to support up to 10000 concurrent connections.

PgBouncer is an open-source connection pooler for PostgreSQL. When an application needs to connect to a database, PgBouncer provides a connection from the pool. Connections in the pool are routed to a smaller number of actual PostgreSQL connections. When a connection is no longer required, it is returned to the pool and is available to be used again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

Neon uses `PgBouncer` in `transaction mode`. For limitations associated with `transaction mode`, see [Connection pooling notes and limitations](#connection-pooling-notes-and-limitations). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Enable connection pooling

Enabling connection pooling in Neon requires adding a `-pooler` suffix to the compute endpoint ID, which is part of the hostname. Connection requests that specify the `-pooler` suffix use a pooled connection.

Add the `-pooler` suffix to the endpoint ID, as shown:

<CodeBlock shouldWrap>

```text
postgres://sally:<password>@ep-throbbing-boat-918849-pooler.us-east-2.aws.neon.tech/neondb
```

</CodeBlock>

The **Connection Details** widget on the Neon **Dashboard** provides **Pooled connection** and **Direct connection** tabs, allowing you to copy a connection string with or without the `-pooler` option.

![Connection Details pooled connection string](/docs/connect/connection_details_pooled.png)

<Admonition type="note">
The previous method of enabling connection pooling for a compute endpoint is deprecated. When using a pooling-enabled connection, as described above, ensure that connection pooling is not enabled for the compute endpoint. To disable pooling for a compute endpoint, refer to the instructions in [Edit a compute endpoint](../manage/endpoints#edit-a-compute-endpoint).
</Admonition>

## Connection pooling notes and limitations

Connection pooling is not yet supported with [Autoscaling](../introduction/autoscaling) <b><sup>Beta</sup></b>. To use connection pooling, use a **Fixed size** compute (the default). For compute configuration instructions, see [Compute size and Autoscaling configuration](../manage/endpoints#compute-size-and-autoscaling-configuration).

Neon uses PgBouncer in _transaction mode_, which does not support PostgreSQL features such as prepared statements or [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html). For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.

Some clients and applications may require connection pooling. For example, using Prisma Client with PgBouncer from a serverless function requires connection pooling. To ensure that a pooled connection is used, use a pooled connection string (described in the section above) and add the `?pgbouncer=true` flag to the connection string, as shown in the following example:

<CodeBlock shouldWrap>

```text
postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true
```

</CodeBlock>

Prisma Migrate, however, requires a direct connection to the database, and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in any environment that enables PgBouncer for connection pooling results in the following error:

```text
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

To use Prisma Migrate, you need to provide a non-pooled connection string for your Neon database. You can configure Prisma Migrate to use a non-pooled connection string by adding the `directUrl` property to the datasource block in your `schema.prisma` file. For example:

```text
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

<Admonition type="note">
This feature is available from Prisma version [4.10.0](https://github.com/prisma/prisma/releases/tag/4.10.0) and higher.
</Admonition>

Next, update your `.env` file with both the `DATABASE_URL` and `DIRECT_URL` variables settings. As shown in the following example, set `DATABASE_URL` to the pooled connection string for your Neon database, and set `DIRECT_URL` to the non-pooled connection string.

<CodeBlock shouldWrap>

```text
DATABASE_URL="postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true"
DIRECT_URL="postgres://casey:<password>@ep-square-sea-260584.us-east-2.aws.neon.tech:5432/neondb"
```

</CodeBlock>

For more information about using Prisma in a PgBouncer-enabled environment, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
