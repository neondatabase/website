---
title: Using Neon’s Scale to Zero with Long-Running Applications
description: >-
  Learn how to use Neon's serverless Postgres with your long-running
  applications.
excerpt: >-
  We’re Neon, a cloud-native serverless Postgres solution. With Neon, your
  Postgres databases and environments are just one click away. You can still
  benefit from serverless Postgres if your application isn’t serverless. Try
  using Neon’s serverless Postgres with your long-running a...
date: '2024-01-24T23:27:01'
updatedOn: '2025-04-08T23:14:08'
category: community
categories:
  - community
authors:
  - evan-shortiss
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-neons-auto-suspend-with-long-running-applications/cover.jpg
  alt: >-
    Learn how to use Neon's serverless Postgres with your long-running
    applications.
isFeatured: false
seo:
  title: Using Neon's Scale to Zero with Long-Running Applications - Neon
  description: >-
    Learn how to use Neon's serverless Postgres with your long-running
    applications.
  keywords: []
  noindex: false
  ogTitle: Using Neon's Scale to Zero with Long-Running Applications - Neon
  ogDescription: >-
    We’re Neon, a cloud-native serverless Postgres solution. With Neon, your
    Postgres databases and environments are just one click away. You can still
    benefit from serverless Postgres if your application isn’t serverless. Try
    using Neon’s serverless Postgres with your long-running applications today.
    We refer to Neon as serverless Postgres because it can scale your database
    to […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/using-neons-auto-suspend-with-long-running-applications/social.jpg
source:
  wpId: 4355
  wpSlug: using-neons-auto-suspend-with-long-running-applications
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-neons-auto-suspend-with-long-running-applications/neon-long-running-applications-1-1024x576-c22c08e8.jpg)

**We’re Neon, a cloud-native serverless Postgres solution. With Neon, your Postgres databases and environments are just one click away. You can still benefit from serverless Postgres if your application isn’t serverless. [Try using Neon’s serverless Postgres](https://console.neon.tech) with your long-running applications today.**

We refer to Neon as serverless Postgres because it can [scale your database to zero](https://neon.tech/docs/guides/auto-suspend-guide) when it’s not actively serving queries and [autoscale](https://neon.tech/docs/introduction/autoscaling) when it is. Neon’s serverless Postgres pairs perfectly with applications deployed in serverless environments such as Cloudflare Workers or Vercel, thanks to our [serverless driver](https://github.com/neondatabase/serverless/) and support for [SQL over HTTP](https://github.com/neondatabase/neon/tree/main/proxy#sql-over-http). Your database should be able to scale to zero when it’s not processing queries – just like your serverless applications. This can result in savings not just for production workloads but also for development and staging environments.

If you have a traditional long-running application, sometimes called “serverfull”, and you’re interested in trying Neon, you’ll be glad to know that Neon is compatible with those applications too. After all, Neon is just Postgres. These application servers, usually running MVC-type frameworks like Ruby on Rails and Django, can take advantage of Neon’s scale-to-zero to reduce database costs and utilization during off-peak times, just like serverless applications. In the case of a long-running application, scale to zero will inevitably sever any connections between your application and the database. When your application attempts to reconnect and issue new queries, Neon will restart your Postgres database to serve them.

This post will illustrate configuring your Postgres driver to handle scale to zero using [node-postgres](https://node-postgres.com/), how to improve performance using client-side pooling, and how to put it all together in an application that uses [HTMX](https://htmx.org/), [Fastify](https://fastify.dev/), and [Drizzle ORM](https://orm.drizzle.team/). Not a Node.js developer? Don’t stop reading! The concepts discussed in this post apply to other Postgres drivers and runtimes.

## Understanding Neon’s Scale to Zero Feature

How does scale to zero work anyway? Let’s look into it so you can better configure your applications and environments to handle scale to zero gracefully. Doing so will enable you to take advantage of cost savings and make your application more resilient to connection errors.

As the name suggests, Neon’s scale to zero feature will suspend database instances if no activity has been detected within the [configured scale to zero window](https://neon.tech/docs/guides/auto-suspend-guide#configure-autosuspend-for-a-compute-endpoint) for a given compute. Scale to zero works even if clients are connected to the database, but only under certain circumstances. Since Neon is open-source, you can see exactly how this feature works by looking at files such as [compute_tools/src/monitor.rs](https://github.com/neondatabase/neon/blob/main/compute_tools/src/monitor.rs) in the [neondatabase/neon](https://github.com/neondatabase/neon) repository on GitHub.

At the time of writing, scale to zero is triggered when the following conditions are true:

1. No activity has been detected in a time period larger than the scale to zero window.
2. No [WAL senders](https://neon.tech/docs/guides/logical-replication-concepts#wal-senders) are active. In other words, you’re not using Logical Replication.
3. [Autovacuum](https://www.postgresql.org/docs/current/routine-vacuuming.html#AUTOVACUUM) is not currently running.

You can test the impact of scale to zero on a long-lived application that lacks error handling and reconnect logic using the following code.

```javascript
// filename: http-server.pg-client.ts

import { createServer } from 'http'
import { Client } from 'pg'

let client

async function getVersion () {
  if (!client) {
    client = new Client({  connectionString: process.env.DATABASE_URL })
    await client.connect()
  }

  return (await client.query('SELECT version()')).rows[0].version;
}

createServer(async function (req, res) {
  const version = await getVersion()

  res.write(version)
  res.end()
}).listen(8080)
```

This Node.js application will work fine so long as it receives consistent traffic. The consistent traffic would prevent Neon’s scale to zero from being triggered for the database specified by `DATABASE_URL`. If scale to zero were to suspend the database, this program would exit due to an unhandled [client error event](https://node-postgres.com/apis/client#error). Better handling of the connection lifecycle is necessary to make this application more resilient.

## Managing Connections with Client-Side Pooling

The prior example’s `getVersion()` code could be modified to open and close a database connection for each query. This would address the concerns around connection loss but could also introduce the following issues:

1. Add tens or hundreds of milliseconds of latency overhead per request.
2. Exhaust Postgres’ [connection limits](https://neon.tech/docs/connect/connection-pooling#default-connection-limits).

Neon’s [pooler endpoint](https://neon.tech/docs/connect/connection-pooling#enable-connection-pooling) (based on [PgBouncer](https://www.pgbouncer.org/)) and our serverless driver can provide a workaround for these issues and are especially important for serverless application architectures where many instances of your application will open connections to the database. However, you may want to continue using your existing database driver with Neon, or the [limitations of PgBouncer](https://neon.tech/docs/connect/connection-pooling#connection-pooling-notes-and-limitations) might pose a problem for your long-running application.

Using a client-side connection pool with your existing Postgres driver can:

1. Control the number of open connections by reusing existing connections.
2. Avoid the latency overhead of opening and closing connections for each query.
3. Manage connection lifecycle on your behalf and gracefully handle Neon’s scale to zero.

Switching to a client-side pool is often a trivial code change, as shown by the following code sample.

```javascript
// filename: http-server.pg-pool.ts

import { createServer } from 'http'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  idleTimeoutMillis: 60 * 1000,
  max: 20
})

// Log connection loss errors, but do not terminate the program. The pool will create
// new connections that will start the Neon postgres compute to run future queries
// if the compute endpoiint is idle
pool.on('error', (err) => {
  console.log(`pg:pool error ${err.message}. open connections ${pool.totalCount}`)
})

createServer(async function (req, res) {
 // The pool will run this query once a connection is available
  const version = (await pool.query('SELECT version()')).rows[0].version

  res.write(version)
  res.end()
}).listen(8080)
```

The connection pool requires minimal code to handle the loss of connectivity with a Neon Postgres compute that has scale to zero enabled. When your application needs to run queries at some point in the future, the pool will establish one or more new connections with your database, causing it to start up.

Moreover, reusing connections in the pool can significantly boost your application’s throughput. Performing a benchmark using [Apache Bench](https://httpd.apache.org/docs/2.4/programs/ab.html) reveals the following performance metrics in favor of the codebase that uses a connection pool:

|          | Total Time (100 requests) | Average Latency | P99 Response Time | Req/Sec |
| -------- | ------------------------- | --------------- | ----------------- | ------- |
| Pooled   | 0.27 seconds              | 46ms            | 56ms              | 370     |
| Unpooled | 3.786 seconds             | 678ms           | 764ms             | 26.4    |

You can test it yourself using the following command to issue 100 requests with a concurrency of 20 at the application:

```bash
ab -n 100 -c 20 'https://127.0.0.1:8080/'
```

_Note: Results will depend on hardware resources, connection quality, pool size, proximity to your Neon Postgres database region, assigned Neon compute resources, and other factors._

## Real-World Example with HTMX, Fastify, and Drizzle

Putting these pieces together, let’s look at how this knowledge can be applied to an application built using HTMX, Fastify, and Drizzle ORM. The source code for the application is available in [evanshortiss/neon-and-long-running-apps](https://github.com/evanshortiss/neon-and-long-running-servers) on GitHub.

The application includes code that gracefully handles Neon’s scale to zero. This ensures that it reconnects to the Neon Postgres database when new requests come in but tolerates losing connectivity to the database during periods of inactivity.

The primary endpoint for this application uses the following code to fetch elements of the periodic table from the database and render them as an HTML page:

```javascript
server.get('/', async (req, reply) => {
  const db = await req.drizzle()
  const elements = await db.select().from(Elements)

  return reply.view('/views/index', { elements });
});
```

The code defines an index (`GET /`) HTTP endpoint on the Fastify server that:

1. Invokes a [custom Fastify plugin](https://github.com/evanshortiss/neon-and-long-running-apps/blob/main/src/plugins/drizzzle.ts) (`req.drizzle()`) to obtain a Drizzle instance.
2. Uses the Drizzle instance to query the database for all elements.
3. Renders and returns an HTML page containing the elements to a client.

[HTMX’s `hx-delete`](https://htmx.org/attributes/hx-delete/) enables user interaction to delete database elements and dynamically update the page’s HTML in response.

![Image](https://cdn.neonapi.io/public/images/pages/blog/using-neons-auto-suspend-with-long-running-applications/screenshot-2024-01-19-at-123521-1024x624-af8b8a08.png)

When benchmarked using the same Apache Bench command as before, hosting a single instance of this Node.js application on a lightweight dual-core VM produces the following results in favor of connection pooling.

|          | Total Time (100 requests) | Average Latency | P99 Response Time | Req/Sec |
| -------- | ------------------------- | --------------- | ----------------- | ------- |
| Pooled   | 0.304 seconds             | 52ms            | 60ms              | 329     |
| Unpooled | 3.76 seconds              | 672ms           | 755ms             | 26.6    |

_Note: The Node.js application was hosted in SFO. The Neon Postgres database was hosted in the US-West region and had 1 shared vCPU and 1 GB of RAM._ _The_ _`pg.Pool` size was set to 20_.

## Conclusion

Neon’s serverless Postgres can be used with both traditional long-running applications and serverless architectures. If you have long-running applications implementing robust connection handling, you can use Neon’s scale to zero feature to reduce your database bill, especially for non-production environments. [Sign up to try Neon](https://console.neon.tech/signup) with your existing applications, and join us on [Discord](https://neon.tech/discord) to share your experiences, suggestions, and challenges with us.
