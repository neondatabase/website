---
title: Neon Latency
subtitle: Learn how to measure Neon query performance, and make it go faster.
author: ruf-io
enableTableOfContents: true
createdAt: '2025-02-12T00:00:00.000Z'
updatedOn: '2025-02-12T00:00:00.000Z'
---

<Admonition title="Editor's Note:">

> “Each day on twitter there is one main character. The goal is to never be it”

On Monday, through a total fault of our own, **we were it.** A screenshot showing abysmal 800ms latency for database queries to Neon was the subject of a big roast on dev twitter.

**Neon does not have 800ms query latency.** Your latency on Neon can be as low as 4ms.

We’d like to clear the record by sharing information and code that you can use to judge for yourself what the real-world experience and latency of using Neon is like.
</Admonition>

We'll give you all the tools and information to evaluate Neon latency in two sections:

1. [What is the latency of Neon?](#what-is-the-latency-of-neon) _And how can you test it for yourself?_
2. [What do the terms Serverless, Cold Starts and Scale to Zero refer to on Neon?](#defining-terms)

## What is the latency of Neon?

Your real-world latency depends on three things:

1. **Connection Approach:** Long-lived connections or connection for every query?
2. **Client-DB Proximity:** How close is your application (the client) to the database?
3. **DB Processing Time:** How much time is the database spending answering each query?

You can visualize the way each factor contributes like this:

<LatencyParts />

**What about cold starts?** Databases on Neon can scale to zero when there are no active queries for a certain amount of time. We cover how these work below in [Cold Starts](#cold-starts).

\<aside\>Here’s a Neon Database for you to test this on: Click this button and we’ll create a database for you and give you the connection string, you can use it to test everything we’re about to go through.\</aside\>

### Establishing a connection

Before you get any data from the database, you need to connect to it. This process of establishing the network connection and verifying the credentials on both sides traditionally takes several back and forth trips between application and database.

![Nine round-trips to get a result on a standard TCP connection to Postgres](https://neon.tech/_next/image?url=https%3A%2F%2Fneondatabase.wpengine.com%2Fwp-content%2Fuploads%2F2023%2F08%2Fimage-5.png&w=3840&q=85&dpl=dpl_93LwG65BEFC73DGwgsAif219AFEd)

When you combine “multiple round trips” with any sort of network latency you get a compounding effect.

\[Interactive graphic showing compounding effect of increasing network latency\]

How often you must establish a database connection depends on how you build your app.

#### Long Running

Traditional serverful applications like Rails, Django, even Node.JS when it’s used as a long-running server (like Express) all follow a pattern of establishing one or more long-running connections when the service first starts and keeping them alive until the service is restarted. This makes the connection time a non-factor in the user-facing experience of your application.

\[Interactive Graphic\]

#### Short-Lived

Serverless functions may be executing independently in short-lived environments, it’s not feasible to have a long-running connection. This means every independent execution of a function must establish a connection to the database.

\[Interactive Graphic\]

**Tips for short-lived (serverless):**

1. Execute functions in a region that is the same or close to your database
2. Use an HTTP API \[Link to serverless driver\] \- establishing the HTTP connection is faster than establishing a TCP connection.
3. Execute multiple queries in a single function \- so that you only pay the connection tax once.

<Admonition type="tip" title="Reducing roundtrips with the Serverless Driver">
Neon's [serverless driver](/docs/serverless-driver) and proxy have been optimized to reduce the number of roundtrips to the absolute minimum: Four round-trips to get a result.
![Serverless driver round-trips](https://neon.tech/_next/image?url=https%3A%2F%2Fneondatabase.wpengine.com%2Fwp-content%2Fuploads%2F2023%2F08%2FDevDays-GM-Quicker-2.jpg&w=3840&q=85&dpl=dpl_93LwG65BEFC73DGwgsAif219AFEd)

To read more about how this works, see: [Quicker serverless Postgres connections](https://neon.tech/blog/quicker-serverless-postgres)
</Admonition>

### Putting app and database close together

Let’s go through the different scenarios here from lowest latency to highest:

1. **App and database on same VM** \- 1ms to connect and 1ms to query \[Not possible with Neon\] When you put your database and your app on the exact same machine, latency is measured in microseconds. \[Is there a way to give someone an environment that shows this? Maybe github codespace?\]
2. **App and database in same region (datacenter) connecting over private network \-** 1ms to connect, 1ms to query \[Not exactly possible on Neon, you can connect through PrivateLink but it doesnt save you any time\]
3. **App and database in same region (datacenter) connecting over public network** \- 3ms to connect, 1ms to query \- This is the fastest way to connect that is accessible to all Neon users. What you’re doing here is picking the same AWS or Azure region for your database and your application (be it serverless, like lambda functions on AWS, or serverful).
   1. You still use the publicly routable address of your database, but data is traveling 0 miles so it is very fast.
   2. This doesn’t mean your app has to be running on AWS directly, for example Vercel runs infra on AWS so picking the same Vercel and Neon region has the same effect.
4. **App and database in different region \-** Now we get into that compounding effect

### Minimizing time spent answering the query

## Definitions

### Serverless

### Scale to zero

When a Neon compute endpoint hasn't received any connections for a specified amount of time, it can [autosuspend](https://neon.tech/docs/introduction/auto-suspend).
This is useful for:

- **Resource Management** - Turning off unused databases is automatic.
- **Cost-Efficiency** - Never pay for compute that's not serving queries.

But scale to zero is only useful if compute can start up quickly again when it's needed. That's why [cold start](#cold-starts) times are so important.

#### Applications of scale to zero

Look at the cold start times documented above and decide: _In what scenarios is the occasional 500ms of additional latency acceptable?_

The answer depends on the specifics of your project.
Here are some example scenarios where scale to zero may be useful:

- **Non-Production Databases** - Development, preview, staging, test databases.
- **Internal Apps** - If the userbase for your app is a limited number of employees, the db is likely idle more than active.
- **Database-per-user Architectures** - Instead of having a single database for all users, if you have a separate database for each user, the activity level of any one database may be low enough that scale to zero results in significant cost reduction.
- **Small Projects** - For small projects, configuring the production database to scale to zero can make it more cost-efficient without major impact to UX.

### Cold Starts

A cold start in Neon begins when a database project with a suspended compute endpoint receives a connection.
Neon starts the database compute, processes the query, and serves the response.
The compute stays active as long as there are active connections.

Try running a query to get a visual of how it works:

<ColdStartsGraphic />
