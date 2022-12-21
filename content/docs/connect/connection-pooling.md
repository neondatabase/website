---
title: Connection pooling
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
---

## PostgreSQL connection limits

Each PostgreSQL connection creates a new process in the operating system, which consumes resources. For this reason, PostgreSQL limits the number of open connections. The Neon [Technical Preview Free Tier](/docs/reference/technical-preview-free-tier) permits 100 simultaneous PostgreSQL connections by default (`max_connections=100`). A small number of those connections are reserved for administrative purposes.

## Connection pooling in Neon

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations or to running many instances of an application. Applications that use serverless functions to access the database can also result in a large number of connections during increases in workload activity. With regular PostgreSQL, new connections are rejected when you reach the `max_connections` limit. To overcome this limitation, Neon implements connection pooling using PgBouncer. Connection pooling is enabled by default for Neon projects.

PgBouncer is an open-source connection pooler for PostgreSQL. When an application needs to make a connection to a database, it asks PgBouncer for a connection from the pool. Connections in the pool are routed to a smaller number of actual PostgreSQL connections. When the connection is no longer required, it is returned to the pool and is free to use again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Additionally, using a connection pooler avoids connections being rejected. When all connections in the pool are currently being used, PgBouncer queues new requests until a connection from the pool becomes available. Without connection pooling, PostgreSQL would simply reject the request when reaching the `max_connections` limit.

With connection pooling enabled, Neon is able to handle up to 1000 connections. Neon uses `PgBouncer` in `transaction mode`, which has some associated [limitations](#limitations). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Configure connection pooling

Connection pooling is enabled by default for a Neon project. To enable or disable connection pooling:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. On the **Dashboard**, select your project.
3. Select **Settings** > **General**.
5. Toggle **Enable pooling** to the desired position.
6. Click **Save**.

## PgBouncer application and client compatibility

Some clients and applications may require connection pooling. For example, to use Prisma Client with PgBouncer from a serverless function, add the `?pgbouncer=true` flag to your connection URL. For example:

```text
postgres://<user>:<password>@<endpoint_hostname>:5432/neondb?pgbouncer=true
```

Prisma Migrate, however, requires a direct connection to the database, and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in any environment that uses PgBouncer for connection pooling results in the following error:

```text
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
```

You may encounter this error with other applications that require a direct connection to PostgreSQL or that are not compatible with PgBouncer in `transaction mode`. In this case, you can disable connection pooling for your Neon project. See [Configure connection pooling](#configure-connection-pooling).

For more information about using Prisma with PgBouncer, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

## Limitations

PostgreSQL features such as prepared statements and [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html) are not supported with connection pooling in _transaction mode_. For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section, in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.
