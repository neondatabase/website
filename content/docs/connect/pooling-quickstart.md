---
title: Connection pooling quickstart
subtitle: Learn how to enable connection pooling in Neon
enableTableOfContents: true
---

Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling, enabling up to 10,000 concurrent connections. PgBouncer is a lightweight connection pooler for PostgreSQL. This quick start guide will help you set up connection pooling with PgBouncer in Neon efficiently.

### Why Use Connection Pooling?

Connection pooling helps manage multiple client connections by reducing the overhead of creating and closing database connections. PgBouncer handles these connections, optimizing resource usage and improving overall performance. It's especially beneficial for high-traffic applications, as it allows Neon to support a large number of concurrent connections.

### Steps to Enable Connection Pooling

#### Use a Pooled Connection String

To use connection pooling with Neon, replace your regular connection string with a pooled connection string. This involves adding the `-pooler` option to your compute endpoint ID:

```text shouldWrap
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

You can easily generate this connection string using the **Pooled connection** checkbox in the **Connection Details** widget on the Neon **Dashboard**. This checkbox automatically adds the `-pooler` option to your connection string.

![Connection Details pooled connection string](/docs/connect/connection_details_pooled.png)

<Admonition type="info">
The `-pooler` option routes the connection to a connection pooling port at the Neon Proxy.
</Admonition>

### Connection Limits Without Pooling

Each PostgreSQL connection creates a new process, consuming system resources. The number of open connections is limited by the `max_connections` parameter, which varies with your compute size in Neon.

| Compute Size (CU) | vCPU | RAM   | max_connections |
| :---------------- | :--- | :---- | :-------------- |
| 0.25              | 0.25 | 1 GB  | 112             |
| 0.50              | 0.50 | 2 GB  | 225             |
| 1                 | 1    | 4 GB  | 450             |
| 2                 | 2    | 8 GB  | 901             |
| 3                 | 3    | 12 GB | 1351            |
| 4                 | 4    | 16 GB | 1802            |
| 5                 | 5    | 20 GB | 2253            |
| 6                 | 6    | 24 GB | 2703            |
| 7                 | 7    | 28 GB | 3154            |
| 8                 | 8    | 32 GB | 3604            |
| 9                 | 9    | 36 GB | 4000            |
| 10                | 10   | 40 GB | 4000            |

The formula used to calculate `max_connections` for Neon computes is `RAM in bytes / 9531392 bytes`. For a Neon Free Tier compute, which has 1 GB of RAM, this works out to approximately 112 connections. Larger computes offered with paid plans have more RAM and therefore support a larger number of connections. For example, a compute with 12 GB of RAM supports up to 1351 connections. You can check the `max_connections` limit for your compute by running the following query from the Neon SQL Editor or a client connected to Neon:

```sql
SHOW max_connections;
```

<Admonition type="note">
Four connections are reserved for the Neon-managed Postgres `superuser` account. For example, for a 0.25 compute size, 4/112 connections are reserved, so you would only have 108 available connections. If you are running queries from the Neon SQL Editor, that will also use a connection. To view the currently open connections, you can run the following query:

```sql
SELECT usename FROM pg_stat_activity WHERE datname = '<database_name>';
```

</Admonition>

Even with the largest compute size, the `max_connections` limit may not be sufficient for some applications, such as those that use serverless functions. To increase the number of connections that Neon supports, you can use _connection pooling_. All Neon plans, including the [Neon Free Tier](/docs/introduction/plans#free-tier), support connection pooling.