---
title: Choosing your connection type
subtitle: Rules of thumb for choosing one connection type over another
enableTableOfContents: true
---

When setting up your application’s connection to your Neon Postgres database, you need to make two main choices: the type of driver and the type of connection. This flowchart will guide you through these options.

## Choosing your connection type: flowchart

![choose your connection type](/docs/connect/choose_connection.png)

## Choosing your connection type: drivers and pooling

### Step 1: Choose your Postgres driver

Your first choice is which driver to use. If working in a serverless environment, use the [Neon Serverless Driver](/docs/serverless/serverless-driver). It's built to handle dynamic workloads with high variability in traffic &#8212; for example, Vercel Edge Functions or Cloudflare Workers.

If you don't need serverless, use a traditional TCP-based Postgres driver. For example, if you’re using Node.js with a framework like Next.js, you can add the `pg` client to your dependencies, which acts as the TCP-based Postgres driver.

### Step 2: If serverless, choose HTTP or WebSocket connections

Neon offers two types of serverless connections: HTTP and WebSocket.

- **Use HTTP for**: One-shot queries and short-lived operations where connection setup and teardown costs are minimal.
- **Use WebSocket for**: [Transactions](/docs/postgresql/query-reference#transactions) and operations requiring persistent connections over a session. WebSocket connections provide lower latency for multiple queries in the same session.

<Admonition type="note">
We are working on automatic switching between HTTP and WebSocket to as needed. Check our [roadmap](/docs/introduction/roadmap) to see what's coming soon and our Friday [Changelog](/docs/changelog) for the features-of-the-week.
</Admonition>

### Step 3: Next, choose your connection type: direct or pooled

You then need to decide whether to use direct connections or pooled connections using PgBouncer:

- **In general, use pooled connections whenever you can**: Pooled connections can efficiently manage high numbers of concurrent connections, supporting up to 10,000 connection. This 10,000 connection limit is most useful for serverless applications and application-side connection pools that have many open connections, but infrequent and/or short transactions.
- **Use direct (unpooled) connections if you need persistent connections**: If your application is focused mainly on tasks like migrations or administrative operations that require stable and long-lived connections, use an unpooled connection.

<Admonition type="note">
The use of connection pooling is not a magic bullet. PgBouncer has a `default_pool_size` of 64, meaning it can handle only 64 direct connections to the database at any one time. When your application connects to PgBouncer, it joins a large pool, but only 64 connections are processed at a time. Long operations can cause these connections to time out or close before tasks are completed.
</Admonition>

For more information on these choices, see:

- [Neon Serverless Driver](/docs/serverless/serverless-driver)
- [Connection pooling](/docs/connect/connection-pooling)

## Common Pitfalls

Here are some key points to help you navigate potential issues.
| Issue                | Description                                                                                                                                                                                                                                                     |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Double Pooling       | Avoid using client-side pooling if you're using PgBouncer on the Neon side. Just let Neon handle the pooling to prevent retaining unused connections on the client side. If you must use client-side pooling, make sure it releases connections back to the pool early enough to avoid conflicts with PgBouncer. |
| Understanding Limits | Don't confuse `max_connections` with `default_pool_size`.<br /><br />`max_connections` is the maximum number of concurrent connections allowed by PostgreSQL and is determined by your compute size.<br /><br />`default_pool_size` is the maximum number of connections PgBouncer will pool per user/database pair, which is set to 64 by default.<br /><br />Simply increasing your compute to get more `max_connections` may not improve performance if the bottleneck is actually on your `default_pool_size`. To increase your `default_pool_size`, contact support. |

## Connection types for typical applications

- **E-commerce Platforms:** High concurrency and rapid read/write operations. Use pooled connections for handling high traffic and direct connections for inventory updates.
- **Content Management Systems (CMS):** Frequent read operations and moderate write operations. Use direct connections for content updates and pooled connections for concurrent reads.
- **Financial Applications:** High concurrency and secure transactions. Use direct connections for stability and security, and pooled connections for high-frequency reads.
- **Analytics and Reporting Tools:** Long-running queries and high data throughput. Use direct connections for report generation and pooled connections for frequent data access.
- **Serverless Applications:** Rapid scaling and short-lived connections. Use the serverless driver with HTTP for one-shot queries and WebSocket for persistent transactions.

## Configuration Examples

**Direct connections**:

1. Install the Postgres client library (e.g., pg for Node.js).

    ```bash
    npm install pg dotenv
    ```

1. Set up the connection string in your application configuration.

    ```javascript
    const { Client } = require('pg');
    const client = new Client({
    connectionString: process.env.DATABASE_URL,
    });
    client.connect();
    ```

1.  Use the client for database operations.

    ```javascript
    client.query('SELECT * FROM users', (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    client.end();
    });
    ```

**Pooled Connections**:

1. You don't need install PgBouncer; just use the `-pooler` suffix with your connection string.
1. Modify the connection string to use this pooled endpoint.

    ```javascript
    const { Pool } = require('pg');
    const pool = new Pool({
    connectionString: process.env.DATABASE_URL_POOLER,
    });
    ```

1. Use the pool for database operations.

    ``` javascript
    pool.query('SELECT * FROM users', (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    pool.end();
    });
    ```

**Serverless Driver**:

1. Install the serverless driver.

    ```bash
    npm install @neondatabase/serverless
    ```

1. Configure the connection for HTTP or WebSocket.

    ```javascript
    const { Client } = require('@neondatabase/serverless');
    const client = new Client({
    connectionString: process.env.DATABASE_URL,
    });
    client.connect();
    ```

1. Use the client for database operations.

    ```javascript
    client.query('SELECT * FROM users', (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    client.end();
    });
    ```

## Monitoring

- **Use pg_stat_statements**: Use the `pg_stat_statements` extension to track information like execution counts and slow queries to help understand your query performance.

    See [pg_stats_statements](docs/extensions/pg_stat_statement) for more information, in particular the [Monitor slow queries](/docs/extensions/pg_stat_statements#monitor-slow-queries) section.

- **Monitoring Dashboard**: Use the [Monitoring Dashboard](docs/introduction/monitoring-page) in the Neon Console to monitor connection metrics, compute usage, and database health.

- **External tools**: Use external tools like PgHero and pgAdmin to monitor your database. See [Monitoring Neon with external tools](docs/introduction/monitor-external-tools) for information about setting up and using these tools.

## Table summarizing your options

Here is a table summarizing the options we've walked through on this page:

| Feature                    | Direct Connections                             | Pooled Connections                            | Serverless Driver (HTTP)                   | Serverless Driver (WebSocket)              |
|----------------------------|------------------------------------------------|-----------------------------------------------|--------------------------------------------|--------------------------------------------|
| **Use Case**               | Migrations, admin tasks requiring stable connections | High number of concurrent connections, efficient resource management | One-shot queries, short-lived operations   | Transactions requiring persistent connections |
| **Connection Management**  | Persistent connections                         | Pooled per transaction                        | Rapid open/close connections               | Rapid open/close connections               |
| **Scalability**            | Limited by `max_connections` tied to [compute size](/docs/manage/endpoints#how-to-size-your-compute)                 | Default pool size of 64 connections per user/database, can be increased with support | Automatically scales                       | Automatically scales                       |                      |
| **Performance**            | Low overhead                                   | Efficient for stable, high-concurrency workloads | Optimized for serverless                   | Optimized for serverless                   |
