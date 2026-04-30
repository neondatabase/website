---
title: 'Using Hyperdrive with Neon and Cloudflare Workers: FAQ'
description: Understanding how Cloudflare’s Hyperdrive can boost your performance
excerpt: >-
  We often recommend Hyperdrive to Neon users building on Cloudflare Workers,
  particularly for global applications looking to reduce latency. But we
  frequently receive questions about this tool and how it works with Neon—so
  let’s cover the most common ones in this blog post. What i...
date: '2024-12-26T17:30:52'
updatedOn: '2025-02-27T02:06:25'
category: community
categories:
  - community
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/hyperdrive-neon-faq/cover.jpg
  alt: null
isFeatured: false
seo:
  title: 'Using Hyperdrive with Neon and Cloudflare Workers: FAQ - Neon'
  description: >-
    Understand how Cloudflare's Hyperdrive can enhance the performance of your
    Neon databases, especially when used with Cloudflare Workers.
  keywords: []
  noindex: false
  ogTitle: 'Using Hyperdrive with Neon and Cloudflare Workers: FAQ - Neon'
  ogDescription: >-
    Understand how Cloudflare's Hyperdrive can enhance the performance of your
    Neon databases, especially when used with Cloudflare Workers.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/hyperdrive-neon-faq/social.jpg
source:
  wpId: 8043
  wpSlug: hyperdrive-neon-faq
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/hyperdrive-neon-faq/neon-hiperdrive-1-1024x576-8152acb4.jpg)

We often recommend [Hyperdrive](https://developers.cloudflare.com/hyperdrive/) to Neon users building on Cloudflare Workers, particularly for global applications looking to reduce latency. But we frequently receive questions about this tool and how it works with Neon—so let’s cover the most common ones in this blog post.

<Admonition type="info" title="About Neon">
[Neon](https://neon.tech/home) is a serverless Postgres database that works great for building serverless apps on Cloudflare. Our [Free plan](https://console.neon.tech/signup) lets you get started without a credit card.
</Admonition>

## What is Hyperdrive?

Serverless environments are inherently stateless: they cannot maintain persistent database connections across requests, which means that each function invocation must establish a new connection to the database. If not addressed properly, this can cause you high connection overhead and scalability challenges, since Postgres can get quite resource-intensive per connection.

[Hyperdrive](https://developers.cloudflare.com/hyperdrive/) is a tool built to solve these problems. It’s a globally distributed connection pooler and caching service built by Cloudflare to optimize database performance for serverless environments built on [Cloudflare Workers](https://workers.cloudflare.com/). Generally speaking, Hyperdrive addresses three things:

1. Pooling connections so Workers can reuse them
2. Caching reads at the edge to avoid redundant queries
3. Optimizing routing for write queries via Cloudflare’s network

Let’s break them down.

### Pooling connections

First, Hyperdrive is a connection pooler. It maintains a network of regional connection pools across Cloudflare’s global infrastructure, which hold persistent, ready-to-use connections to your database. When a Cloudflare Worker makes a request to Hyperdrive, it borrows a connection from the closest pool, avoiding the overhead of repeatedly establishing new connections.

### Read query caching

Second, Hyperdrive also automatically caches the results of popular read queries, reducing the need to hit the database for every request. Cached queries are stored at Hyperdrive’s edge, close to where the Worker runs. If a query result is already cached, Hyperdrive serves the result immediately from its cache, without making a call to the database.

### Routing optimization

Third—and this one is particularly interesting—Hyperdrive reduces the number of network round-trips required for a write request from a Cloudflare Worker to reach the database. This might require a more detailed explanation to get it right — [we already covered it in this blog post](https://neon.tech/blog/quicker-serverless-postgres).

The basic idea is this: When a database client (e.g. Cloudflare Worker) connects to a Postgres database, the connection process involves several sequential steps, each requiring a network round-trip between the client and the database server:

1. TCP connection setup → First round trip
2. TLS handshake → 1-2 round trips (depending on the TLS version)
3. Postgres Authentication → 2-3 round-trips, depending on the mechanism:
   - First, the client sends an SSLRequest (a check to see if the server supports TLS)
   - Then, the client identifies itself
   - Finally, the server and client perform a challenge-response process for authentication
4. Query execution → One more round-trip

This adds up to about 6 round trips (sometimes more), with each round trip incurring latency proportional to the geographical distance between the client and the database server.

Traditional connection poolers like PgBouncer reduce the overhead of establishing connections on the database server side, but they don’t eliminate the round trips required for the client to connect to the pooler itself. If the client is geographically distant (e.g., a Worker in Europe connecting to a PgBouncer instance in us-east-1), it still needs to do multiple network round-trips just to establish the connection to the pooler.

<figure>
<img src="https://cdn.neonapi.io/public/images/pages/blog/hyperdrive-neon-faq/screenshot-2024-12-26-at-92313percente2percent80percentafam-1024x586-33a398b3.png" alt="Image" />
<figcaption>Source: Cloudflare</figcaption>
</figure>

Instead, Hyperdrive maintains persistent pools of database connections distributed across Cloudflare’s global network of data centers. When a Cloudflare Worker connects to Hyperdrive, it communicates with the nearest Hyperdrive node, not the database directly. This has two key effects:

1. The Worker avoids the need to establish a new TCP connection, perform a TLS handshake, and re-authenticate with the database
2. Hyperdrive handles these steps internally, keeping connections pre-warmed and ready to use between the Hyperdrive node and the database

Because the Worker is communicating with a pre-connected Hyperdrive node, the number of network round-trips is reduced to just one—and that one may not even need to go as far as the database if the queried results are cached at the Hyperdrive level.

## Should I use Hyperdrive with Neon?

Yes! **You should certainly consider combining Hyperdrive and Neon when building serverless applications with Cloudflare Workers.** Hyperdrive is particularly beneficial if:

- You’re looking to minimize latency for Workers by reducing connection overhead
- You’re handling globally distributed read queries that would otherwise require long-distance database calls
- You have a global application and need to optimize write performance

When testing the performance of a global SELECT query in our testing suite with and without Hyperdrive, we saw ~**9x faster queries** with Hyperdrive.

![Image](https://cdn.neonapi.io/public/images/pages/blog/hyperdrive-neon-faq/screenshot-2024-12-26-at-91141percente2percent80percentafam-1024x380-2c2f4eab.png)

To demonstrate how to integrate Neon with Cloudflare’s Hyperdrive in a Cloudflare Workers environment, we put together this repo example:

[https://github.com/neondatabase/examples/tree/main/with-hyperdrive](https://github.com/neondatabase/examples/tree/main/with-hyperdrive)

You can also follow [this guide](https://neon.tech/docs/guides/cloudflare-hyperdrive) in docs.

## How does Hyperdrive overlap with Neon’s pooler?

Hyperdrive and Neon’s connection pooler both manage database connections:

- [Neon’s pooler](https://neon.tech/docs/connect/connection-pooling) (built on PgBouncer) reduces the number of connections to the Postgres database on Neon’s servers but does not influence connection setup latency.
- Hyperdrive reduces latency by keeping global connection pools distributed across Cloudflare’s network, allowing Cloudflare Workers to connect to the nearest pool with minimal overhead.

## So, should I use Hyperdrive together with Neon’s pooling?

Actually, we don’t recommend it. Since Hyperdrive maintains its own global pool of database connections, which your application reuses for queries, this makes Neon’s pooling unnecessary.

## Should I combine Hyperdrive and the Neon serverless driver?

No, this isn’t possible. You should use Hyperdrive directly with standard Postgres drivers, like `node-postgres` or `Postgres.js`.

Hyperdrive relies on TCP connections between the client and the database, while the [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) is instead uses WebSockets or HTTP, which means it can be used in environments where TCP is not available. Also Hyperdrive already provides its own optimized connection pooling and caching — so you wouldn’t see much benefit from the serverless driver anyways.

## Getting started

[Follow this guide](https://neon.tech/docs/guides/cloudflare-hyperdrive#setting-up-your-cloudflare-workers-application) for instructions on how to connect Hyperdrive to Neon. If you don’t have a Neon account yet, create a free one [here](https://console.neon.tech/signup).
