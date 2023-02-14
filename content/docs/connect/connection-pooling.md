---
title: Connection pooling
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/connection-pooling
---

Each PostgreSQL connection creates a new process in the operating system, which consumes resources. For this reason, PostgreSQL limits the number of open connections. Neon permits 100 simultaneous PostgreSQL connections by default with a `max_connections=100` setting, which is the typical default for this parameter. In Neon, a small number of those connections are reserved for administrative purposes. A connection limit of 100 may not be sufficient for some applications. To increase the number of connections that Neon supports, you can enable connection pooling.

## Connection pooling

Some applications open numerous connections, with most eventually becoming inactive. This behavior can often be attributed to database driver limitations, to running many instances of an application, or to applications with serverless functions. With regular PostgreSQL, new connections are rejected when reaching the `max_connections` limit. To overcome this limitation, Neon supports connection pooling using [PgBouncer](https://www.pgbouncer.org/), allowing Neon to support up to 1000 concurrent connections.

PgBouncer is an open-source connection pooler for PostgreSQL. When an application needs to connect to a database, PgBouncer provides a connection from the pool. Connections in the pool are routed to a smaller number of actual PostgreSQL connections. When a connection is no longer required, it is returned to the pool and is available to be used again. Maintaining a pool of available connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

Neon uses `PgBouncer` in `transaction mode`. For limitations associated with `transaction mode`, see [Connection pooling notes and limitations](#connection-pooling-notes-and-limitations). For more information about `PgBouncer`, refer to [https://www.pgbouncer.org/](https://www.pgbouncer.org/).

## Enable connection pooling

In Neon, a database resides on a branch, and you connect to the database via the compute endpoint associated with the branch. You can enable connection pooling for all connections to a compute endpoint or for individual connections.

### Enable pooling for all connections

This method enables connection pooling for a compute endpoint. All connection requests to the compute endpoint will use a pooled connection. Direct connections to a database through the compute endpoint are not permitted.

To enable connection pooling for a compute endpoint:

1. Navigate to the [Neon console](https://console.neon.tech/).
1. On the **Dashboard**, select **Branches**.
1. Find the branch with endpoint you want to enable pooling for, click the kebab menu in the **Compute endpoints** table, and select **Edit**.
1. Toggle **Pooler enabled** to the on position.
1. Click **Save**.

You can also enable connection pooling when [creating a compute endpoint](/docs/manage/endpoints#create-a-compute-endpoint).

### Enable pooling for individual connections

Enabling pooling for individual connections requires adding a `-pooler` suffix to the compute endpoint ID, which is part of the hostname. Connection requests that specify the `-pooler` suffix use a pooled connection. Connections that do not specify the `-pooler` suffix connect directly to the database. This method supports workflows that require both pooled and non-pooled connections to the same database.

When using this method, ensure that connection pooling is not enabled for the compute endpoint, as described in [Enable pooling for all connections](#enable-pooling-for-all-connections). If connection pooling is enabled for the compute endpoint, all connections to the compute endpoint use a pooled connection.

To connect to a database with a pooled connection, add the `-pooler` suffix to the endpoint ID in the hostname, as shown:

```text
postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech/neondb
```

To connect to the same database directly with a non-pooled connection, use the same connection string without the `-pooler` suffix:

```text
postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech/neondb
```

## Connection pooling notes and limitations

Neon uses PgBouncer in _transaction mode_, which does not support PostgreSQL features such as prepared statements or [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html). For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.

Some clients and applications may require connection pooling. For example, using Prisma Client with PgBouncer from a serverless function requires connection pooling. To ensure that connection pooling is enabled for clients and applications that require it, you can add the `?pgbouncer=true` flag to your Neon connection string, as shown in the following example:

```text
postgres://casey:<password>@ep-square-sea-260584-pooler.us-east-2.aws.neon.tech:5432/neondb?pgbouncer=true
```

Prisma Migrate, however, requires a direct connection to the database, and currently does not support connection pooling with PgBouncer. Attempting to run Prisma Migrate commands in any environment that enables PgBouncer for connection pooling results in the following error:

```text
Error: undefined: Database error
Error querying the database: db error: ERROR: prepared statement "s0" already exists
 ```

You may encounter this error with other applications that require a direct connection to PostgreSQL or applications that are not compatible with PgBouncer in `transaction mode`. To address this issue, Neon supports both pooled and non-pooled connections to the same database. For more information, see [Enable connection pooling](#enable-connection-pooling).
  
For more information about using Prisma in a PgBouncer-enabled environment, refer to the [Prisma documentation](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/configure-pg-bouncer#add-pgbouncer-to-the-connection-url).

PostgreSQL features such as prepared statements and [LISTEN](https://www.postgresql.org/docs/15/sql-listen.html)/[NOTIFY](https://www.postgresql.org/docs/15/sql-notify.html) are not supported with connection pooling in _transaction mode_. For a complete list of limitations, refer to the "_SQL feature map for pooling modes_" section, in the [pgbouncer.org Features](https://www.pgbouncer.org/features.html) documentation.

## Need help?

Send a request to [support@neon.tech](mailto:support@neon.tech), or join the [Neon community forum](https://community.neon.tech/).
