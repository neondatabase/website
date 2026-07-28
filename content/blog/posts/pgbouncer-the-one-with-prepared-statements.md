---
title: 'PgBouncer: The one with prepared statements'
description: Protocol-Level Support for Prepared Statements
excerpt: >-
  We’re happy to announce Neon’s support for PgBouncer 1.22.0. This latest
  release increases query throughput by 15% to 250% and includes support for
  DEALLOCATE ALL and DISCARD ALL, as well as protocol-level prepared statements
  released in 1.21.0. In this article, we’ll explore wha...
date: '2024-02-15T09:43:20'
updatedOn: '2024-02-29T11:33:09'
category: postgres
categories:
  - postgres
  - community
authors:
  - raouf-chebri
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pgbouncer-the-one-with-prepared-statements/cover.png
  alt: null
isFeatured: false
seo:
  title: 'PgBouncer: The one with prepared statements - Neon'
  description: Protocol-Level Support for Prepared Statements
  keywords: []
  noindex: false
  ogTitle: 'PgBouncer: The one with prepared statements - Neon'
  ogDescription: >-
    We’re happy to announce Neon’s support for PgBouncer 1.22.0. This latest
    release increases query throughput by 15% to 250% and includes support for
    DEALLOCATE ALL and DISCARD ALL, as well as protocol-level prepared
    statements released in 1.21.0. In this article, we’ll explore what prepared
    statements are and how to use PgBouncer to optimize your queries […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/pgbouncer-the-one-with-prepared-statements/social.png
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/pgbouncer-the-one-with-prepared-statements/image-26-1024x576-e9b9e6b4.png)

We’re happy to announce Neon’s support for [PgBouncer 1.22.0](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_22_0). This latest release increases query throughput by 15% to 250% and includes support for `DEALLOCATE ALL` and `DISCARD ALL`, as well as protocol-level prepared statements released in [1.21.0](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_21_0).

In this article, we’ll explore what prepared statements are and how to use PgBouncer to optimize your queries in Neon.

## What are Prepared Statements?

In Postgres, a prepared statement is a feature that allows you to create and optimize an SQL query once and then execute it multiple times with different parameters. It’s a template where you define the structure of your query and later fill in the specific values you want to use.

Here’s an example of creating a prepared statement with `PREPARE`:

```sql
PREPARE user_fetch_plan (TEXT) AS
SELECT * FROM users WHERE username = $1;
```

Here, `user_fetch_plan` is the name of the prepared statement, and `$1` is a placeholder for the parameter.

Here is how to execute the prepared statement:

```sql
EXECUTE user_fetch_plan('alice');
```

This query will fetch all columns from the `users` table where the `username` is `alice`.

## Why Use Prepared Statements?

1\. **Performance**: Since the SQL statement is parsed and the execution plan is created only once, subsequent executions can be faster. However, this benefit might be more noticeable in databases with heavy and repeated traffic.

2\. **Security**: Prepared statements are a great way to avoid SQL injection attacks. Since data values are sent separately from the query, they aren’t executed as SQL, making injecting malicious SQL code difficult.

## What is PgBouncer?

Before diving into what PgBouncer is, let’s take a step back and briefly touch on how Postgres operates.

Postgres runs on a system of several interlinked processes, with the `postmaster` taking the lead. This initial process kicks things off, supervises other processes, and listens for new connections. The `postmaster` also allocates a shared memory for these processes to interact.

Whenever a client wants to establish a new connection, the `postmaster` creates a new backend process for that client. This new connection starts a session with the backend, which stays active until the client decides to leave or the connection drops.

Here’s where it gets tricky: Many applications, such as serverless backends, open numerous connections, and most eventually become inactive. Postgres needs to create a unique backend process for each client connection. When many clients try to connect, more memory is needed. In Neon, for example, the default maximum number of [concurrent direct connections is set to 100](https://neon.tech/docs/connect/connection-pooling#default-connection-limits).

The solution to this problem is connection pooling with PgBouncer, which helps keep the number of active backend processes low.

PgBouncer is a lightweight connection pooler which primary function is to manage and maintain a pool of database connections to overcome Postgres’ connection limitations. Neon projects come by default with direct and pooled connections. The latter uses PgBouncer and currently offers up to 10,000 connections.

To use PgBouncer on Neon, check the “Pooled connection” box in the connection details widget. Note the -pooler suffix on the endpoint ID in your connection string.

```bash
postgres://johndoe:mypassword@ep-billowing-wood-25959289-pooler.us-east-1.aws.neon.tech/neondb
```

## Using Prepared Statements with PgBouncer in client libraries:

[PgBouncer](https://github.com/pgbouncer/pgbouncer/releases/tag/pgbouncer_1_22_0) supports prepared statements at the protocol level, and therefore, the above SQL-level prepared statement using `PREPARE` and `EXECUTE` will not work with PgBouncer. See [PgBouncer’s documentation](https://www.pgbouncer.org/config.html#max_prepared_statements) for more information.

However, you can use prepared statements with pooled connections in a client library. Most PostgreSQL client libraries offer support for prepared statements, often abstracting away the explicit use of `PREPARE` and `EXECUTE`. Here’s how you might use it in a few popular languages:

```python
// using psycopg2
cur = conn.cursor()
  query = "SELECT * FROM users WHERE username = %s;"
  cur.execute(query, ('alice',), prepare=True)
  results = cur.fetchall()
```

```javascript
// using pg  
const query = {
   // give the query a unique name
   name: 'fetch-user',
      text: 'SELECT * FROM users WHERE username = $1',
      values: ['alice'],
  };
  client.query(query);
```

In these client libraries, the actual SQL command is parsed and prepared on the server, and then the data values are sent separately, ensuring both efficiency and security.

Under the hood, PgBouncer examines all the queries sent as a prepared statement by clients and assigns each unique query string an internal name (e.g. PGBOUNCER_123). PgBouncer rewrites each command that uses a prepared statement to use the matching internal name before forwarding the corresponding command to Postgres.

```bash
                +-------------+
                |   Client            |
                +------+------+
                       |
                       | Sends Prepared Statement (e.g., "SELECT * FROM users WHERE id =?")
                       |
                +------v------+
                |  PgBouncer  |
                |             |
                | 1. Examines and tracks the client's statement.    |
                | 2. Assigns an internal name (e.g., PGBOUNCER_123).|
                | 3. Checks if the statement is already prepared    |
                |    on the PostgreSQL server.                       |
                | 4. If not, prepares the statement on the server.  |
                | 5. Rewrites the client's command to use the       |
                |    internal name.                                 |
                +------^------+
                       |
                       | Forwards Rewritten Statement (e.g., "SELECT * FROM users WHERE id =?" as PGBOUNCER_123)
                       |
                +------v------+
                | PostgreSQL |
                |   Server   |
                |             |
                | Executes the forwarded statement with the internal name. |
                +-------------+
```

## In Summary

PgBouncer bridges the gap between the inherent connection limitations of Postgres and the ever-growing demand for higher concurrency in modern applications.

Leveraging prepared statements can be a valuable asset to boost your Postgres query performance and adds a layer of security against potential SQL injection attacks when using pooled connections.

You can try prepared statements in PgBouncer with Neon today. We can’t wait to see what you build using it. Happy querying.<br />If you have any questions or feedback, don’t hesitate to get in touch with us on [Discord](https://neon.tech/discord). We’d love to hear from you.
