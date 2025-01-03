---
title: Choosing your driver and connection type
subtitle: How to select the right driver and connection type for your application
enableTableOfContents: true
updatedOn: '2024-10-23T14:34:44.510Z'
---

When setting up your application’s connection to your Neon Postgres database, you need to make two main choices:

- **The right driver for your deployment** &#8212; Neon Serverless driver or a TCP-based driver
- **The right connection type for your traffic** &#8212; pooled connections or direct connections

This flowchart will guide you through these selections.

## Choosing your connection type: flowchart

![choose your connection type](/docs/connect/choose_connection.png)

## Choosing your connection type: drivers and pooling

### Your first choice is which driver to use

- **Serverless**

  If working in a serverless environment and connecting from a JavaScript or TypeScript application, we recommend using the [Neon Serverless Driver](/docs/serverless/serverless-driver). It handles dynamic workloads with high variability in traffic &#8212; for example, Vercel Edge Functions or Cloudflare Workers.

- **TCP-based driver**

  If you're not connecting from a JavaScript or TypeScript application or you are not developing a serverless application, use a traditional TCP-based Postgres driver. For example, if you’re using Node.js with a framework like Next.js, you can add the `pg` client to your dependencies, which serves as the Postgres driver for TCP connections.

#### HTTP or WebSockets

If you are using the serverless driver, you also need to choose whether to query over HTTP or WebSockets:

- **HTTP**

  Querying over an HTTP [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) request is faster for single, non-interactive transactions, also referred to as "one-shot queries". Issuing [multiple queries](/docs/serverless/serverless-driver#issue-multiple-queries-with-the-transaction-function) via a single, non-interactive transaction is also supported. See [Use the driver over HTTP](/docs/serverless/serverless-driver#use-the-driver-over-http).

- **WebSockets**

  If you require session or interactive transaction support or compatibility with [node-postgres](https://node-postgres.com/) (the popular **npm** `pg` package), use WebSockets. See [Use the driver over WebSockets](/docs/serverless/serverless-driver#use-the-driver-over-websockets).

<Admonition type="note">
We are working on automatic switching between HTTP and WebSocket as needed. Check our [roadmap](/docs/introduction/roadmap) to see what's coming soon and our Friday [Changelog](/docs/changelog) for the features-of-the-week.
</Admonition>

### Next, choose your connection type: direct or pooled

You then need to decide whether to use direct connections or pooled connections (using PgBouncer for Neon-side pooling):

- **In general, use pooled connections whenever you can**

  Pooled connections can efficiently manage high numbers of concurrent client connections, up to 10,000. This 10K ceiling works best for serverless applications and Neon-side connection pools that have many open connections, but infrequent and/or short transactions.

- **Use direct (unpooled) connections if you need persistent connections**

  If your application is focused mainly on tasks like migrations or administrative operations that require stable and long-lived connections, use an unpooled connection.

<Admonition type="note">
Connection pooling is not a magic bullet. PgBouncer can keep many application connections open (up to 10,000) concurrently, but only a limited number of these can be actively querying the Postgres server at any given time. For example, 64 active backend connections (transactions between PgBouncer and Postgres) per user-database pair, as determined by the PgBouncer's `default_pool_size` setting, mean that Postgres user `alex` can hold up to 64 connections to a single database at one time.
</Admonition>

For more information on these choices, see:

- [Neon Serverless Driver](/docs/serverless/serverless-driver)
- [Connection pooling](/docs/connect/connection-pooling)

## Common Pitfalls

Here are some key points to help you navigate potential issues.
| Issue | Description |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Double pooling | **Neon-side pooling** uses PgBouncer to manage connections between your application and Postgres.<br /><br /> **Client-side pooling** occurs within the client library before connections are passed to PgBouncer.<br /><br />If you're using a pooled Neon connection (supported by PgBouncer), it's best to avoid client-side pooling. Let Neon handle the pooling to prevent retaining unused connections on the client side. If you must use client-side pooling, make sure that connections are released back to the pool promptly to avoid conflicts with PgBouncer. |
| Understanding limits | Don't confuse `max_connections` with `default_pool_size`.<br /><br />`max_connections` is the maximum number of concurrent connections allowed by Postgres, determined by your [Neon compute size](/docs/connect/connection-pooling#connection-limits-without-connection-pooling).<br /><br />`default_pool_size` is the maximum number of backend connections or transactions that PgBouncer supports per user/database pair, also determined by compute size <br /><br />Simply increasing your compute to get more `max_connections` may not improve performance if the bottleneck is actually on your `default_pool_size`. To increase your `default_pool_size`, contact [Support](/docs/introduction/support). |
| Use request handlers | In serverless environments such as Vercel Edge Functions or Cloudflare Workers, WebSocket connections can't outlive a single request. That means Pool or Client objects must be connected, used and closed within a single request handler. Don't create them outside a request handler; don't create them in one handler and try to reuse them in another; and to avoid exhausting available connections, don't forget to close them. See [Pool and Client](https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client) for details.|

## Configuration

### Installing the Neon Serverless Driver

You can install the driver with your preferred JavaScript package manager. For example:

```bash
npm install @neondatabase/serverless
```

Find details on configuring the Neon Serverless Driver for querying over HTTP or WebSockets here:

- [Use the driver over HTTP](/docs/serverless/serverless-driver#use-the-driver-over-http)
- [Use the driver over WebSockets](/docs/serverless/serverless-driver#use-the-driver-over-websockets)

### Installing traditional TCP-based drivers

You can use standard Postgres client libraries or drivers. Neon is fully compatible with Postgres, so any application or utility that works with Postgres should work with Neon. Consult the integration guide for your particular language or framework for the right client for your needs:

- [Framework Quickstarts](/docs/get-started-with-neon/frameworks)
- [Language Quickstarts](/docs/get-started-with-neon/languages)

### Configuring the connection

Setting up a direct or pooled connection is usually a matter of choosing the appropriate connection string and adding it to your application's `.env` file.

You can get your connection string from the [Neon Console](/docs/connect/connect-from-any-app) or via CLI.

For example, to get a pooled connection string via CLI:

```bash shouldWrap
neonctl connection-string --pooled true [branch_name]

postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

Notice the `-pooler` in the connection string — that's what differentiates a direct connection string from a pooled one.

Here's an example of getting a direct connection string from the Neon CLI:

```bash shouldWrap
neonctl connection-string [branch_name]

postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

For more details, see [How to use connection pooling](/docs/connect/connection-pooling#how-to-use-connection-pooling).

## Table summarizing your options

Here is a table summarizing the options we've walked through on this page:

|                 | Direct Connections                                                                                   | Pooled Connections                                                                                                                                                                                                                                                                                                                                | Serverless Driver (HTTP)                 | Serverless Driver (WebSocket)                 |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------- |
| **Use Case**    | Migrations, admin tasks requiring stable connections                                                 | High number of concurrent client connections, efficient resource management                                                                                                                                                                                                                                                                       | One-shot queries, short-lived operations | Transactions requiring persistent connections |
| **Scalability** | Limited by `max_connections` tied to [compute size](/docs/manage/endpoints#how-to-size-your-compute) | Up to 10,000 application connections (between your application and PgBouncer); however, only [`default_pool_size`](/docs/connect/connection-pooling#neon-pgbouncer-configuration-settings) backend connections (active transactions between PgBouncer and Postgres) are allowed per user/database pair. This limit can be increased upon request. | Automatically scales                     | Automatically scales                          |
| **Performance** | Low overhead                                                                                         | Efficient for stable, high-concurrency workloads                                                                                                                                                                                                                                                                                                  | Optimized for serverless                 | Optimized for serverless                      |
