---
title: A Deep Dive into PolyScale’s Architecture
description: An in-depth walkthrough of the “magic” behind PolyScale
excerpt: >-
  We are very excited about the new PolyScale integration with Neon. Neon’s
  serverless Postgres separates storage and compute to offer autoscaling,
  branching, and bottomless storage, while PolyScale is a fully autonomous
  database cache, which makes the two services a match made in...
date: '2023-12-18T18:01:46'
updatedOn: '2024-03-27T11:29:27'
category: community
categories:
  - community
authors:
  - sam-aybar
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/title-a-deep-dive-into-polyscales-architecture/cover.jpg
  alt: null
isFeatured: false
seo:
  title: A Deep Dive into PolyScale’s Architecture - Neon
  description: An in-depth walkthrough of the “magic” behind PolyScale
  keywords: []
  noindex: false
  ogTitle: A Deep Dive into PolyScale’s Architecture - Neon
  ogDescription: >-
    We are very excited about the new PolyScale integration with Neon. Neon’s
    serverless Postgres separates storage and compute to offer autoscaling,
    branching, and bottomless storage, while PolyScale is a fully autonomous
    database cache, which makes the two services a match made in heaven. With
    the PolyScale integration, Neon users can add automated caching to allow […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/title-a-deep-dive-into-polyscales-architecture/social.jpg
---

<img alt="Post image" width="1024" height="576" src="https://cdn.neonapi.io/public/images/pages/blog/title-a-deep-dive-into-polyscales-architecture/neon-polyscale-architecture-1024x576-7dfbf3fe.jpg" />

We are very excited about the new [PolyScale integration with Neon](https://neon.tech/blog/neon-polyscale-integration). Neon’s serverless Postgres separates storage and compute to offer autoscaling, branching, and bottomless storage, while PolyScale is a fully autonomous database cache, which makes the two services a match made in heaven.

With the PolyScale integration, Neon users can add automated caching to allow global low-latency access to their database, while reducing load on their database without needing to write any code.

If you have slow queries with your database, if your database is seeing too much load, or if you’d like to access your database from multiple locations without the complexity of adding a read replica, it’s time for you to explore how easy it is to add automated caching with PolyScale. With PolyScale, you don’t need to update your application; you simply replace your existing database connection string with a PolyScale connection string and you are done!

If you’d like to learn more about how to connect PolyScale to Neon, you can see Neon’s recent [announcement blog post](https://neon.tech/blog/neon-polyscale-integration). In this post, we will cover:

1. How PolyScale’s caching algorithms work
2. How to Use PolyScale’s Performance test to see the performance benefits of PolyScale

## A technical explanation of How PolyScale works

To integrate PolyScale, it is as simple as replacing your Neon connection string with a PolyScale connection string. With this environment variable change, you are able to send all reads and writes via the nearest PolyScale Point of Presence (PoP) to your database, and PolyScale will automatically cache whichever queries are cacheable, intelligently set the Time-to-Live (TTL) for the cache, and parse writes to globally invalidate any cached data that is impacted by the write.

But what is PolyScale doing behind the connection string? This section will provide an in-depth walkthrough of the “magic” PolyScale does so you don’t need to spend your time rewriting your application, identifying slow queries and determining optimal cache TTLs.

### Getting Connected

PolyScale is a sidecar that sits between your application and your database. PolyScale proxies all the traffic to your database and uses algorithms (as further described below) to determine what to cache and how long to cache it for. When you use the PolyScale connection string, your request is routed to the closest PolyScale PoP, based on the geographic distance between your application’s IP address location and PolyScale’s edge network.

<img alt="Post image" width="975" height="512" src="https://lh7-us.googleusercontent.com/Bqh-4NYvGWB9hv7FECDUmDaC1nfJSWu5tNlt9-4XXIHtUfdskOCY1IlxOOiZEDmmkTFtIZP3KtGKye-AWM0R0cyt9MXre-hyj5keUwJYDVI20DWG4WkdeU1fAdzZY0okYnqlhu_Y9ix9Mxu6HcE3Jl8" />

Use of PolyScale begins by creating a cache. A cache is simply defined by a database host and a port. In the case of Neon, if you use the integration, these are automatically passed to PolyScale via an API when the PolyScale integration is enabled. Alternatively, you can manually create a cache for a Neon database (for example a branch) or any other Postgres, MySQL, MariaDB, MS SQL or MongoDB database in the PolyScale UI. Notably, creating a cache does not require providing your username and password since PolyScale does not need them for caching (unless you are using the PolyScale pooling for Postgres feature). In fact, PolyScale never sees your password at all — it is passed, encrypted, to your origin database, which handles the authentication.

In order for PolyScale to be able to access your database, you need to ensure that your database is accessible from PolyScale’s global edge network (see [https://docs.polyscale.ai/edge-network-and-security](https://docs.polyscale.ai/edge-network-and-security) for details). Neon databases are open to all addresses by default, so no action is necessary here.

The hostname and port are associated with a `Cache Id`, which will be used as part of the PolyScale connection string. In the Neon integration tab, the full PolyScale connection string is provided. It looks a lot like your default Neon connection string, but instead of pointing to your Neon host, you point to `neon.psedge.global`, and you then identify your specific `Cache ID` with the `application_name` parameter.

When PolyScale receives your connection attempt, we match your Cache ID to the host and port of your origin database. We pass along your connection attempt to your Neon instance (the username and password are encrypted and PolyScale has no access to the password), which handles authentication.

Subsequent database queries are then parsed by PolyScale’s proxy. With the parse, PolyScale’s proxy identifies whether the query is a read or a write. From the parse, PolyScale may be able to identify which tables, columns and rows are involved in the query and can use the information for automated invalidation.

### How Caching Works

PolyScale operates by caching query results. PolyScale creates a lookup table in which SQL queries are matched to result sets. If a query result is cached, PolyScale is able to execute sub-millisecond, independent of the complexity of the query or the location of the origin database. As a result, PolyScale can effectively provide Neon users global access to their database with decidedly lower average latency.

When you begin running queries with your new cache, PolyScale will analyze every read query it sees to determine what should be cached and for how long. The time to first hit is determined by multiple attributes of the particular query being processed: the arrival rate, the change rate of the query result, the number of related queries seen, among other things. If the cache is automatically managed (default behavior) and the query being processed is new i.e. it has never been seen and no related queries have been seen by PolyScale previously, a cache hit will occur on or about the 3rd query. This will be reduced to as low as the 2nd query if the query being processed is similar to a previously processed query i.e. the same query structure with different parameters. (We call this a “query template”.)

PolyScale’s machine learning algorithms identify caching opportunities by recognizing and remembering patterns in query traffic. The algorithms run continuously in the background and update on every query, rapidly adapting to changes in traffic as they arise. At any moment, the most up-to-date optimal cache configurations are applied. The algorithms manage caching at a scale far beyond the abilities of a human. In general, for a given query, the TTL will lengthen as PolyScale sees consistency in the query response; conversely, in the event PolyScale gets a response without having seeing an invalidating write, PolyScale will shorten the subsequent TTL for that query (potentially resulting in not caching specific queries if they have unexplained changes in responses).

New queries from existing query templates will benefit from the TTL information PolyScale has derived for the other queries from that template, allowing PolyScale to more efficiently arrive at optimal TTLs for these new queries.

### How invalidation works

Smart Invalidation is PolyScale’s automated cache invalidation system. It is designed to provide 100% accurate, global eventual consistency for cached data. At a high level, Smart Invalidation automatically detects and calculates when cached data may be stale and removes it from the cache.

Assuming that your write queries are being run through PolyScale, we are able to identify when those writes invalidate reads that have been cached. When PolyScale sees a write, it immediately sends a global invalidation message to all PolyScale PoPs, ensuring that stale data is not served from any cached data. (Note that data is only cached if a request has been seen from that location.)

Smart Invalidation leverages a multi-layer approach. The first layer involves parsing the SQL queries at a row level. It analyzes which rows are read (in the case of read queries) and which rows are written to (in the case of write queries). This analysis is performed on fully anonymized representations of the queries to maintain data security and privacy. From these query details, targeted invalidations of cached data are performed.

The analysis performed by the first layer can sometimes be overwhelmed by complex queries. That is where the second layer of invalidation comes into play. When a query is deemed too complex to determine what specific cached data may have become invalidated, a fallback to a simple but effective table level invalidation occurs. In this case, all cached data coming from any affected tables is invalidated. This layer of invalidation errs on the side of caution, typically overreaching, but ensuring stale cache data is not served.

The first two layers of invalidation are very effective, however, they can be thwarted in some circumstances. For example, out of band data changes not visible to PolyScale, or tightly coupled (in time) reads and writes. To address this, a third layer of invalidation exists within the cache automation itself. The automated caching layer monitors for and detects unexplained data changes. If these events are detected, it disables caching on the relevant queries. This provides an empirical safety net on the predictive actions of the first two layers.

Smart Invalidation has several, out of the box advantages:

Performance – Smart Invalidation operates in real-time and invalidates the cache as soon as a change/mutation query is detected. This can quite often mean that the region where a change has been detected invalidates the cache, even before the change query has executed on the origin database.

Highly scalable – unlike other caching systems that require access to the Write Ahead Log (WAL) or similar, PolyScale inspects the wire protocol traffic to invalidate and hence an unlimited number of cache regions (PoP’s) can be supported without degradation to the origin database.

100% automatic – no code or configuration is required to be developed

Global eventual consistency – Smart Invalidation is designed to provide 100% accurate, global eventual consistency for cached data.

While PolyScale’s automated settings will serve most use cases, PolyScale also offers the option to manually set TTLs for queries touching selected tables and/or specific query templates. In addition, you have the option to turn off Smart Invalidation if your use case wants to maximize serving data from cache (at the expense of

In short, PolyScale gives you the power to cache your entire application in minutes using our automated settings, while also offering the flexibility to address specific use cases using manual settings. When combined with Neon, you are able to maximize the capability of your Neon database, minimizing the load on the database and providing low latency access to cached queries globally.

## How to use the PolyScale performance test

PolyScale provides a performance test that demonstrates how it can provide low latency access to your database from any location around the globe. The test is available on the Connect tab in your PolyScale dashboard. You can also watch [this video](https://www.youtube.com/watch?v=TkTE-guUBFg) to see how it works.

With the PolyScale performance test, you can choose any of [PolyScale’s locations around the globe](https://docs.polyscale.ai/edge-network-and-security) and then compare response times directly to your database versus using PolyScale caching for any query of your choosing

For example, if you have a Neon Database hosted in Ohio (us-east-2) and your application is also running in us-east-2, you may have queries that are slow because they take a lot of processing time in the database, but they won’t be slow because of geographic latency. However, if you want to add a second instance of your database to serve customers in Europe running in Frankfurt (eu-central-1), you will introduce latency for every query from that instance, associated with the distance between Frankfurt and Ohio.

If your queries are cacheable, you can minimize this problem. By adding PolyScale to your application, regardless of where your queries come from, they will be routed to the nearest PolyScale PoP, and cached queries will all return within milliseconds, regardless of how complex the queries might be.

You can test this for yourself with PolyScale’s performance test.

1. Go to the Connect Tab on PolyScale
2. (Optional) Under the **Test Utilities** section, you can run a **Network Test**, which will ensure that your database is accessible from all PolyScale’s PoP locations. If you are using Neon, by default your database is accessible so you need not run a test to ensure your database is accessible.
3. Select the **Performance Test** sub-tab to run the test
   - Fill in your Neon database username, password, and database name, and then choose a query to run against your database.
   - If you just want to see the geographic latency benefits, you can run a trivial query like the default `SELECT 1` query that is already filled in. If you’d also like to see the impact of the time savings on your database itself, you can choose a more intensive query.
   - Choose your Source Region. For the example above, if you want to see the benefits of connecting to your Neon database in us-east-2 location, choose PolyScale’s AWS eu-central-1 location
   - Click **Execute 10 Queries**

<img alt="Post image" width="975" height="512" src="https://lh7-us.googleusercontent.com/vGUE5TlAmFWxqysMtOYLrWgUgbvPawmf4mlQPuHgC2uGFE38VL4m38wBKv06QYYJeTWxrMC_k5EXZ5om4NABZqWCYNxHYxuUnfG6dWIoQt9sUMogmG3L3JUxpYNcgzsWVT_nagRmEk9tyzlao2N2vSk" />

4. PolyScale will now run a series of queries directly to your database to establish a baseline “direct-to-database” response time, followed by queries via PolyScale. The PolyScale queries will include 5 queries to ensure your data is being cached, followed by 10 queries to show cache response times. You can see below that PolyScale queries respond to the test application within 1ms versus 90ms directly to the database.

<img alt="Post image" width="975" height="512" src="https://lh7-us.googleusercontent.com/0CtzRc-BrHPIe6nER3frh5xza1yiUJlSC21cjMqPG9wqpN9T3Y1xo6-BlzRFf7iMvgGnibpOT5UwsXG9KzUJiw0hw_VDxjaABbLLhq6qGHwW8Y0tFDsqbqBrGWbEEtBB1FK7Ibw5UGgTyHNd8ZVSaPw" />

5. You can now rerun your queries from any other location globally to see the benefits of adding PolyScale to your infrastructure. Below, you can see an example of queries run from Australia, showing an improvement of 198ms direct vs 1ms via PolyScale.

<img alt="Post image" width="975" height="512" src="https://lh7-us.googleusercontent.com/0mzhdVW7Yb46-z4v6l8-U9eySdjoHUk1PjNRm1ilFuzmnmgz9YjwO-zSKSkQvYWCHS34y6PsFkuEBFPZycyai4H83SfSp-i001snDa15YYr96gWa1bltGyHxca-m2dLt7eXi3ymzFS0ijCBBnVdUdwo" />

6. You can also run more complex queries via PolyScale – below is an example of a “slow” query running against a Neon database in the same location (USA Columbus us-east-2) vs. PolyScale. You can see 515ms response times direct to the database return from PolyScale in 1ms.

<img alt="Post image" width="975" height="512" src="https://lh7-us.googleusercontent.com/4QTl6KWDlByTcpg6JNlvI_u8Kf3iqqONPZzBNzcXKxqaxDfeXV95Hg8-PX9ztK2H5lftSk2aRnTq4lmZhSZQp8WKo_K6TCzCgXT_BLIddhIUpiQULecjD1zEEJDOJjSWujjMGWCs52_D9SV9_igntxs" />

In short, with PolyScale’s performance test, you can see exactly how much performance benefit you can get for your queries by simply changing your connection string to a PolyScale connection string. By implementing PolyScale, not only have you reduced your latency, you also have reduced the load on your database.

## Summary

PolyScale brings automated caching to your Neon database. With the Neon-PolyScale integration, you are able to set up caching for all queries to your database in a few clicks and with a simple change to your database connection string. PolyScale’s algorithms determine what to cache and for how long, minimizing load on your Neon database while providing sub-millisecond responses for cached queries around the globe.

With PolyScale’s in-built performance test, you can see exactly how much latency reduction you can get from anywhere in the world when you add PolyScale to your Neon project. Check it out today!
