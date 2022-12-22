---
title: Connection pooling
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
---

## PostgreSQL connection limits

Each PostgreSQL connection creates a new process in the operating system, which consumes resources. For this reason, PostgreSQL limits the number of open connections. Neon permits 100 simultaneous PostgreSQL connections by default (`max_connections=100`). A small number of those connections are reserved for administrative purposes.

## Connection pooling in Neon

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations or to running many instances of an application. With regular PostgreSQL, new connections are rejected when reaching the `max_connections` limit. To overcome this limitation, Neon supports connection pooling using PgBouncer.

PgBouncer is an open-source connection pooler for PostgreSQL. When an application needs to connect to a database, PgBouncer provides it with a connection from the pool. Connections in the pool are routed to a smaller number of actual PostgreSQL connections. When a connection is no longer required, it is returned to the pool and is available to be used again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

With connection pooling enabled, Neon is able to handle up to 1000 connections. Neon uses `PgBouncer` in `transaction mode`. For limitations associated with `transaction mode`, see [Connection pooling notes and limitations](#connection-pooling-notes-and-limitations). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Enable connection pooling

To enable connection pooling for your Neon project:

1. Navigate to the [Neon console](https://console.neon.tech/).
2. On the **Dashboard**, select your project.
3. Select **Settings** > **General**.
5. Toggle **Enable pooling** to the on position.
6. Click **Save**.

## Connection pooling notes and limitations

- Neon uses PgBouncer in _transaction mode_. PostgreSQL features such as prepared statements and [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html) are not supported with connection pooling in _transaction mode_. For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section, in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.
- Some clients and applications may require connection pooling. For example, to use Prisma Client with PgBouncer from a serverless function, you have to add the `?pgbouncer=true` flag to your PostgreSQL connection URL. For Neon, this appears similar to the following example:

  ```text
  postgres://<user>:<password>@<endpoint_hostname>:5432/neondb?pgbouncer=true
  ```

  Prisma Migrate, however, requires a direct connection to the database, and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in any environment that enables PgBouncer for connection pooling results in the following error:

  ```text
  Error: undefined: Database error
  Error querying the database: db error: ERROR: prepared statement "s0" already exists
  ```

  You may encounter this error with other applications that require a direct connection to PostgreSQL or that are not compatible with PgBouncer in `transaction mode`. In this case, you can disable connection pooling in Neon.
  
  For more information about using Prisma in a PgBouncer-enabled environment, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).
