---
title: Postgres Support Case Recap
description: >-
  Resolving connection limit error: remaining connection slots are reserved for
  non-replication superuser connections (SQLSTATE 53300)
excerpt: >-
  At Neon Support, we’ve noticed users occasionally encountering connection
  limit errors while connecting applications to their databases. Today, we’re
  sharing insights from our support exchanges to help you understand and avoid
  this issue in your setup. Specifically, our users som...
date: '2024-01-31T18:32:32'
updatedOn: '2024-02-29T11:26:30'
category: community
categories:
  - community
authors:
  - daniel-price
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-support-case-recap/cover.png
  alt: null
isFeatured: false
seo:
  title: Postgres Support Case Recap - Neon
  description: >-
    Resolving connection limit error: remaining connection slots are reserved
    for non-replication superuser connections (SQLSTATE 53300)
  keywords: []
  noindex: false
  ogTitle: Postgres Support Case Recap - Neon
  ogDescription: >-
    At Neon Support, we’ve noticed users occasionally encountering connection
    limit errors while connecting applications to their databases. Today, we’re
    sharing insights from our support exchanges to help you understand and avoid
    this issue in your setup. Specifically, our users sometimes report running
    into the following Postgres connection error: FATAL: remaining connection
    slots are reserved for […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/postgres-support-case-recap/social.jpg
source:
  wpId: 4427
  wpSlug: postgres-support-case-recap
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/postgres-support-case-recap/image-22-1024x576-b60587fc.png)

At Neon Support, we’ve noticed users occasionally encountering connection limit errors while connecting applications to their databases. Today, we’re sharing insights from our support exchanges to help you understand and avoid this issue in your setup.

Specifically, our users sometimes report running into the following Postgres connection error:

FATAL: remaining connection slots are reserved for non-replication superuser connections (SQLSTATE 53300)

## What causes this error?

The “remaining slots are reserved error” error occurs when the maximum number of simultaneous database connections, defined by the Postgres max_connections setting, is reached, with a number of those connection slots being reserved for superusers.

For example, if your Postgres instance supports 112 simultaneous connections, it might reserve 4 for superusers, allowing 108 for regular concurrent connections.

Typically, what leads to this error is a high number of simultaneous connection requests from the same Postgres user that exceeds the limit for their database. In one case, we found that a user was reaching the 108 simultaneous connection limit several times in a 24-hour period, resulting in the “remaining slots are reserved” errors during those periods.

## What is the Postgres max_connections setting?

Postgres defines the max_connections setting as follows:

“_Determines the maximum number of concurrent connections to the database server. The default is typically 100 connections, but might be less if your kernel settings will not support it (as determined during initdb). This parameter can only be set at server start._”

## Why not set a really high max_connections value?

Each Postgres connection creates a new process in the operating system, which consumes resources; i.e., each connection consumes memory, and you don’t want to run out of memory. Postgres limits the number of open connections for this reason.

## What is your max_connections limit?

Neon is a managed Postgres service, so we manage the max_connections setting for you. Rather than the Postgres limit of 100 simultaneous connections, Neon sets max_connections based on the size of your compute instance and how much memory it has. The exact formula used to configure max_connections can be found in the [neon code base](https://github.com/neondatabase/cloud/blob/main/goapp/internal/postgressettings/settings.go#L308):

maxConnections:= max(100, min(int64(ramInBytes/9_531_392), 4_000))

The following table shows the max_connection settings for different compute sizes in Neon, based on the formula above:

| **Compute Size (Compute Units (CU)** | **vCPU** | **RAM (vCPU x 4)** | **max_connections** |
| ------------------------------------ | -------- | ------------------ | ------------------- |
| .25                                  | .25      | 1 GB               | 112                 |
| .50                                  | .50      | 2 GB               | 225                 |
| 1                                    | 1        | 4 GB               | 450                 |
| 2                                    | 2        | 8 GB               | 901                 |
| 3                                    | 3        | 12 GB              | 1351                |
| 4                                    | 4        | 16 GB              | 1802                |
| 5                                    | 5        | 20 GB              | 2253                |
| 6                                    | 6        | 24 GB              | 2703                |
| 7                                    | 7        | 28 GB              | 3154                |

You can check the max_connections limit for your compute by running the following query from the Neon SQL Editor or a client connected to Neon:

SHOW max_connections;

## How do you avoid these errors?

As a Neon Free Tier user, your compute size is fixed at .25 CU, which gives you:

- .25 vCPU
- 1 GB of RAM
- A max_connections setting of 112

You have a few options in this case:

1. Find and remove long-running or idle connections.
2. Upgrade to the [Neon Pro Plan](https://neon.tech/docs/introduction/pro-plan) for larger computes with a higher max_connections setting.
3. Enable [connection pooling](https://neon.tech/docs/connect/connection-pooling).

### Find and remove long-running or idle connections

If you have a bunch of long-running or idle connections using up your connection limit, it may be enough for you to drop those connections to make room for new ones, at least in the short term.

You can use this query to check for long-running or idle connections:

```sql
SELECT
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM
    pg_stat_activity
WHERE
    (now() - pg_stat_activity.query_start) > INTERVAL '1 minute'
    OR state = '<idle>';
```

To remove those connections, you can run this query:

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'databasename'
  AND pid <> pg_backend_pid()
  AND state IN ('idle');
```

Replace ‘databasename’ with the actual name of your database.

### Upgrade to the Neon Pro Plan for larger compute sizes

You can upgrade to the [Neon Pro Plan](https://neon.tech/docs/introduction/pro-plan) from the **Billing** page in the Neon Console. Once you are signed up, you can select a larger compute size that supports more connections. You’ll find the instructions here: [Compute size and autoscaling configuration](https://neon.tech/docs/manage/endpoints#compute-size-and-autoscaling-configuration).

### Connection Pooling

Even with the largest compute size, the max_connections limit may not be sufficient for some applications, such as those that use serverless functions. To increase the number of connections that Neon supports, you can enable [connection pooling](https://neon.tech/docs/connect/connection-pooling). All Neon plans, including the [Neon Free Tier](https://neon.tech/docs/introduction/free-tier), support connection pooling.

Neon uses [PgBouncer](https://www.pgbouncer.org/) for connection pooling, which allows Neon to support up to 10,000 simultaneous connections.

When an application needs to connect to a database, PgBouncer provides a connection from the pool. Connections in the pool are routed to a smaller number of actual Postgres connections. When a connection is no longer required, it is returned to the pool and is available to be used again.

Using a pool of connections improves performance by reducing the number of connections that need to be created and torn down to service incoming requests. Connection pooling also helps avoid rejected connections. When all connections in the pool are being used, PgBouncer queues a new request until a connection from the pool becomes available.

#### How to enable connection pooling in Neon

Enabling connection pooling in Neon requires adding a -pooler suffix to the compute endpoint ID, which is part of the Neon hostname. Connections that specify the -pooler suffix in the connection string use a pooled connection. The -pooler suffix routes the connection to a pooled connection port at the Neon proxy.

You can add the -pooler suffix to the endpoint ID in your connection string as shown:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

But you don’t have to add this suffix manually. The **Connection Details** widget on the Neon **Dashboard** provides a **Pooled connection** checkbox that adds the -pooler suffix to a connection string, which you can copy and paste.

![Image](https://lh7-us.googleusercontent.com/qrt7GFFdeHg4YH4YRgIT0zKvfRXUCm4hVbNvEtfAMx69NH_ddlh6r-mKHQRibi80DUkhuPF2n5ud6DZALyyXnhACvHOmaqYDv4jkiWdV-q5ITozmK7o-SWEX7Wfpaxmxr_CqhtkR_HdSiqiduGwA5hQ)

## Conclusion

Dealing with “remaining connection slots are reserved” errors can be straightforward with the right approach. By knowing your database’s connection limit, managing long-running and idle connections, using right-size computes, or enabling connection pooling, you can ensure that you always have enough connections to handle your application load.

Thanks for reading and stay tuned for the next ** _Support Case Recap_**!

## References

- [Neon Pro Plan](https://neon.tech/docs/introduction/pro-plan)
- [Neon Free Tier](https://neon.tech/docs/introduction/free-tier)
- [Neon Support](https://neon.tech/docs/introduction/support)
- [Connection pooling in Neon](https://neon.tech/docs/connect/connection-pooling)
- [PgBouncer](https://www.pgbouncer.org/)
- [PostgreSQL Connections and Authentication](https://www.postgresql.org/docs/current/runtime-config-connection.html)
