---
title: Choosing your driver connection type
subtitle: Rules of thumb for choosing the right driver and connection type for your application
enableTableOfContents: true
---

When setting up your application’s connection to your Neon Postgres database, you need to make two main choices:

- **Postgres driver type**: Serverless driver vs. TCP-based driver
- **Connection type**: pooled vs. direct

This flowchart will guide you through these selections.

## Choosing your connection type: flowchart

![choose your connection type](/docs/connect/choose_connection.png)

## Choosing your connection type: drivers and pooling

### Step 1: Choose your Postgres driver

Your first choice is which driver to use:

- **Serverless**

  If working in a serverless environment and connecting from a JavaScript and TypeScript application, we recommend using the [Neon Serverless Driver](/docs/serverless/serverless-driver). It handles dynamic workloads with high variability in traffic &#8212; for example, Vercel Edge Functions or Cloudflare Workers.

- **TCP-based driver**

  If you're not connecting from a JavaScript or TypeScript application or you are not developing a serverless application, use a traditional TCP-based Postgres driver. For example, if you’re using Node.js with a framework like Next.js, you can add the `pg` client to your dependencies, which serves as the Postgres driver for TCP connections.

#### HTTP or WebSockets

If you are using the serverless driver, you also need to choose whether to query over HTTP or WebSockets:

- **HTTP**

  Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions, also referred to as "one-shot queries". Issuing [multiple queries](/docs/serverless/serverless-driver#issue-multiple-queries-with-the-transaction-function) via a single, non-interactive transaction is also supported. See [Use the driver over HTTP](/docs/serverless/serverless-driver#use-the-driver-over-http).

- **WebSockets**

  If you require session or interactive transaction support or compatibility with [node-postgres](https://node-postgres.com/) (the popular **npm** `pg` package), use WebSockets. See [Use the driver over WebSockets](/docs/serverless/serverless-driver#use-the-driver-over-websockets).

<Admonition type="note">
We are working on automatic switching between HTTP and WebSocket to as needed. Check our [roadmap](/docs/introduction/roadmap) to see what's coming soon and our Friday [Changelog](/docs/changelog) for the features-of-the-week.
</Admonition>

### Step 2: Next, choose your connection type: direct or pooled

You then need to decide whether to use direct connections or pooled connections using PgBouncer:

- **In general, use pooled connections whenever you can**

  Pooled connections can efficiently manage high numbers of concurrent connections, supporting up to 10,000 concurrent connections. This 10,000 connection limit is most useful for serverless applications and application-side connection pools that have many open connections, but infrequent and/or short transactions.

- **Use direct (unpooled) connections if you need persistent connections**

  If your application is focused mainly on tasks like migrations or administrative operations that require stable and long-lived connections, use an unpooled connection.

<Admonition type="note">
Connection pooling is not a magic bullet. PgBouncer can manage 10,000 concurrent connections from your application to PgBouncer, but PgBouncer's default_pool_size setting is set to 64 by default, which means connections from PgBouncer to Postgres are limited to 64 for each user-database pair. For example, Postgres user `alex` can hold up to 64 connections to a single database at one time.
</Admonition>

For more information on these choices, see:

- [Neon Serverless Driver](/docs/serverless/serverless-driver)
- [Connection pooling](/docs/connect/connection-pooling)

## Common Pitfalls

Here are some key points to help you navigate potential issues.
| Issue | Description |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Double pooling | Avoid using client-side pooling if you're using a pooled Neon connection (supported by PgBouncer). Just let Neon handle the pooling to prevent retaining unused connections on the client side. If you must use client-side pooling, make sure connections are released back to the client-side pool early enough to avoid conflicts with PgBouncer. |
| Understanding limits | Don't confuse `max_connections` with `default_pool_size`.<br /><br />`max_connections` is the maximum number of concurrent connections allowed by Postgres and is determined by your [Neon compute size](/docs/connect/connection-pooling#connection-limits-without-connection-pooling).<br /><br />`default_pool_size` is the maximum number of connections PgBouncer supports per user/database pair, which is set to 64 by default.<br /><br />Simply increasing your compute to get more `max_connections` may not improve performance if the bottleneck is actually on your `default_pool_size`. To increase your `default_pool_size`, contact [Support](/docs/introduction/support). |
| Use request handlers | In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections can't outlive a single request. That means Pool or Client objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them. See [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client) for details.|

## Configuration Examples

Let's say you're working on a Next.js application. We'll walk you through how you might configure your app using the drivers and connection types detailed on this page.

### Setting Up Your Driver

<Tabs labels={["Serverless HTTP", "Serverless WebSocket", "TCP"]}>

<TabItem>

1. **Install the serverless driver:**

   ```bash
   npm install @neondatabase/serverless
   ```

2. **Configure the connection for HTTP:**

   ```javascript
   const { Client } = require('@neondatabase/serverless');
   const client = new Client({
     connectionString: process.env.DATABASE_URL,
   });
   client.connect();
   ```

</TabItem>

<TabItem>

**Install the serverless driver:**

```bash
npm install @neondatabase/serverless
```

**Configure the connection for WebSocket:**

```javascript
const { Client } = require('@neondatabase/serverless');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
```

</TabItem>

<TabItem>

**Install the Postgres client library:**

```bash
npm install pg dotenv
```

**Set up the connection string in your application configuration:**

```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();
```

</TabItem>

</Tabs>

## Setting Up Direct or Pooled Connections

Now, let's set up your connection. With Next.js, you are likely to use pooled connections, but we'll explain how you can configure either one. The key difference is in the connection string you use in your `.env` file.

### Connection string

You can get your connection string from the Neon console or via CLI. For example, to get a pooled connection string via CLI:

```bash shouldWrap
neonctl connection-string --pooled true [branch_name]

postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Environment variables

If using environment variables, create an `.env` file in the root of your project, defining your `DATATABASE_URL` to use either your direct or pooled connection string. And then use the variable in your application.

<Tabs labels={["Pooled Connection", "Direct Connection"]}>

<TabItem label="Pooled Connection">

**.env file**

Create an `.env` file in the root of your project with the following content for a pooled connection:

```bash
DATABASE_URL=your_pooled_connection_string
```

**Using the variable**

```javascript
require('dotenv').config();
const { Pool } = require('pg');

// Use Pool for Pooled Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  pool.end();
});
```

</TabItem>

<TabItem label="Direct Connection">

**.env file**

```bash
DATABASE_URL=your_direct_connection_string
```

**Using the variable**

```javascript
require('dotenv').config();
const { Client } = require('pg');

// Use Client for Direct Connection
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

client.query('SELECT * FROM users', (err, res) => {
  if (err) throw err;
  console.log(res.rows);
  client.end();
});
```

</TabItem>

</Tabs>

## Table summarizing your options

Here is a table summarizing the options we've walked through on this page:

| Feature                   | Direct Connections                                                                                   | Pooled Connections                                                                   | Serverless Driver (HTTP)                 | Serverless Driver (WebSocket)                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------- | --- |
| **Use Case**              | Migrations, admin tasks requiring stable connections                                                 | High number of concurrent connections, efficient resource management                 | One-shot queries, short-lived operations | Transactions requiring persistent connections |
| **Connection Management** | Persistent connections                                                                               | Pooled per transaction                                                               | Rapid open/close connections             | Rapid open/close connections                  |
| **Scalability**           | Limited by `max_connections` tied to [compute size](/docs/manage/endpoints#how-to-size-your-compute) | Default pool size of 64 connections per user/database, can be increased with support | Automatically scales                     | Automatically scales                          |     |
| **Performance**           | Low overhead                                                                                         | Efficient for stable, high-concurrency workloads                                     | Optimized for serverless                 | Optimized for serverless                      |
