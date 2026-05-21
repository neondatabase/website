---
title: The Noisy Neighbor Problem in Multitenant Architectures
description: And how you can solve it with Neon
excerpt: >-
  Reddit’s answer for solving noisy neighbors is simple: Have a talk with them,
  if you can stay calm, be as straight forward as possible. Don’t bend on your
  position. At least find out what the other neighbors think. Good advice, but
  it can be difficult to talk to CPUs; they tend n...
date: '2025-04-03T23:21:00'
updatedOn: '2025-04-09T23:26:21'
category: postgres
categories:
  - postgres
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/noisy-neighbor-multitenant/cover.jpg
  alt: null
isFeatured: false
seo:
  title: The Noisy Neighbor Problem in Multitenant Architectures - Neon
  description: >-
    Learn how Neon solves the noisy neighbor problem in multitenant SaaS
    architectures with serverless Postgres and true tenant isolation.
  keywords: []
  noindex: false
  ogTitle: The Noisy Neighbor Problem in Multitenant Architectures - Neon
  ogDescription: >-
    Learn how Neon solves the noisy neighbor problem in multitenant SaaS
    architectures with serverless Postgres and true tenant isolation.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/noisy-neighbor-multitenant/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/noisy-neighbor-multitenant/neon-noisy-notxt-1024x576-e200836c.jpg)

[Reddit’s answer](https://www.reddit.com/r/ask/comments/11pktig/noisy_neighbors_how_do_you_handle_them/) for solving noisy neighbors is simple:

<blockquote>
<p><em><br></br></em>Have a talk with them, if you can stay calm, be as straight forward as possible. Don’t bend on your position. At least find out what the other neighbors think.</p>
</blockquote>

Good advice, but it can be difficult to talk to CPUs; they tend not to like it when you interrupt them. Within cloud architecture and databases, in particular, the noisy neighbor problem goes beyond a bit of banging techno. 🙂

## What Are Noisy Neighbors?

Before answering the question of noise, let’s first think about ‘What are neighbors?’ in this context.

Say you are building an analytics platform that allows businesses to store and analyze their sales data. You deploy a single, large AWS RDS instance to hold all the data. This consolidated architecture reduces operational overhead and simplifies database management, but introduces a challenge: how do you store each customer’s data?

The answer is a multitenant architecture, in which each tenant is a distinct customer, organization, or application that shares your database system with other tenants. Each tenant has its own data and access patterns and is a _neighbor_ of the others.

The problem is that the single RDS instance has only a finite amount of resources–CPU, memory, and I/O. **These resources need to be shared among all tenants.** The _noisy neighbors_ are the tenants whose workloads consume disproportionate amounts of shared resources, degrading performance for other tenants sharing the same infrastructure.

Let’s say our analytics platform offers various subscription tiers (Basic, Premium, Enterprise) with different usage limits. When the end of the fiscal quarter arrives, enterprise customers run complex financial reports—joining multiple large tables, calculating aggregations across millions of rows, and generating forecasts. All the fun stuff.

This sudden spike in complex queries from just a few tenants can degrade the performance for all other businesses on the platform, including those simply trying to update inventory or process orders in real time.

It works something like this:

![Image](https://cdn.neonapi.io/public/images/pages/blog/noisy-neighbor-multitenant/screenshot-2025-04-03-at-80658percente2percent80percentafam-1024x370-ec64d071.png)

Tenant A has increasing resource usage that hits the bounds of what the system can handle. When the capacity is hit, Tenant B experiences failures even though they are well under the total system capacity.

It doesn’t have to be as dramatic as this. If you have several customers dependent on a small set of resources, no tenant needs to hog everything for the system to fail.

![Image](https://cdn.neonapi.io/public/images/pages/blog/noisy-neighbor-multitenant/screenshot-2025-04-03-at-81135percente2percent80percentafam-1024x798-36df5744.png)

The main point is that if you share resources across multiple tenants, any single tenant can monopolize the resources and shut down all other tenants.

## The Problems Caused by Noisy Neighbors in AWS RDS

This can be a massive problem for scaling teams. [OpusFlow](https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers) experienced this firsthand when trying to ensure data isolation for their European customers in RDS. They found that having multiple databases compete for resources in a single instance created problematic edge cases.

What might these edge cases be?

- **CPU utilization**: When one tenant runs complex queries with numerous joins, aggregations, or window functions, they can monopolize CPU cycles. In our analytics platform example, an enterprise tenant’s quarterly report involving complex calculations across years of data could spike CPU usage to near 100%, leaving other tenants’ queries waiting in the queue. Basic tier customers attempting simple lookups suddenly experience multi-second delays.
- **Memory consumption**: Postgres relies heavily on memory for query execution. Each tenant’s connections consume work_mem for sorting and hashing operations, while shared_buffers holds frequently accessed data pages. When one tenant’s operations consume excessive memory, Postgres may be forced to write temporary files to disk, dramatically slowing performance across the system. If several premium tenants simultaneously run memory-intensive operations (like large GROUP BY clauses), the database might exhaust its available RAM, forcing disk swapping that affects everyone.
- **Disk I/O bandwidth**: Perhaps the most common bottleneck in database systems. When one tenant performs heavy write operations or scans large tables without proper indexing, disk I/O queues grow, causing increased latency for all tenants. In cloud environments with network-attached storage (like AWS EBS), I/O contention becomes especially problematic. In our SaaS example, a tenant importing millions of records during business hours could saturate the I/O capacity, causing timeout errors for other tenants’ routine transactions.
- **Connection pooling**: Postgres allocates resources per connection. A tenant that creates numerous connections without proper pooling can exhaust the max_connections limit, preventing other tenants from establishing new connections entirely. A poorly designed client application from one tenant might open a new connection for each user session instead of using connection pooling, potentially preventing other tenants from connecting during peak hours.
- **Lock contention**: A tenant running long-running transactions can hold locks on database objects for extended periods, blocking other tenants’ operations that need access to the same objects. For instance, if a tenant’s batch update process acquires exclusive locks on shared tables or indexes, other tenants’ operations might be blocked, resulting in growing queue times and eventual timeouts.

Without proper isolation strategies, even a well-behaved tenant following its normal business processes can become an unintentional “noisy neighbor” during peak activity periods. The challenge for database architects is to design systems that can accommodate these varying workload patterns without allowing any single tenant to disrupt service quality for others.

[Or just use Neon.](https://neon.tech/use-cases/database-per-tenant)

## How to Deal With Noisy Neighbors (if You Stick to AWS RDS)

OK, so what does a system that “can accommodate these varying workload patterns without allowing any single tenant to disrupt service quality for others” look like in the context of AWS RDS?

The short answer is **isolation**. The degree and type of isolation you choose determines how effectively you can manage noisy neighbors. Let’s explore the options available to you in RDS, from least to most isolation:

### Resource governance in a shared model

If you’re committed to a shared schema model for cost efficiency, you can implement governance mechanisms that help limit the blast radius of any one tenant:

- **Query resource limits**: Use statement_timeout to cap how long queries can run, with different thresholds per tenant tier. For example, Enterprise customers get 60 seconds; Basic users get 15. This prevents long-running queries from clogging the system.
- **Connection pooling with tenant quotas**: Use PgBouncer in front of your RDS instance and cap concurrent connections per tenant. Enterprise might get 50, Premium 20, Basic 5—ensuring no one tenant floods the connection pool.
- **Workload segregation**: Run heavy operations (like report generation or bulk imports) during off-peak hours. Better yet, make them asynchronous, queuing tasks with tenant-aware fairness rules.
- **Application-level rate limiting**: Build tenant-aware rate limiting into your application layer. When a tenant exceeds their quota of expensive operations, queue the request or return a “retry later” message.

This approach works—but it puts you in constant firefighting mode. You’re watching dashboards, tuning timeouts, and writing more logic to protect the system from itself as you scale.

### Schema separation with resource allocation

The schema-per-tenant model offers better logical separation within a shared database, but all tenants still compete for the same underlying RDS resources. You can strengthen it by:

- **Resource quotas by schema**: While Postgres doesn’t natively support per-schema quotas, you can enforce storage size limits or query limits via extensions or external monitoring.
- **Tenant-based query planning**: Use background workers that execute one query per tenant in a round-robin fashion to distribute load fairly during busy periods.
- **Dynamic resource allocation**: Monitor tenant workloads and selectively throttle non-critical queries from tenants under heavy load, preserving baseline responsiveness for others.

This gives you a bit more control, but the effort grows as your customer base expands. You’re still enforcing fairness on a shared system.

### Complete isolation: The database-per-tenant approach (still on RDS)

The most effective solution to noisy neighbors in RDS is full database-per-tenant isolation, giving each customer their own PostgreSQL instance. This completely avoids resource contention between tenants.

But with RDS, this model has major drawbacks:

- **Cost inefficiency**: Every RDS instance incurs baseline charges—even when idle. Spinning up one per tenant doesn’t scale economically.
- **Operational complexity**: Managing hundreds or thousands of instances becomes overwhelming. Provisioning, monitoring, patching, backups—it’s a lot.
- **Resource waste**: Many tenant databases sit idle most of the time, wasting provisioned compute and storage.
- **Maintenance burden**: Schema changes, Postgres upgrades, and patch rollouts must be applied to each instance—multiplying your DevOps surface area.

Because of these challenges, many teams default back to shared infrastructure—noisy neighbors and all.

## How Neon Solves The Noisy Neighbor Problem

Neon flips the model. It gives you database-per-tenant isolation without the RDS-level cost or operational burden. Here’s how:

### Project-per-tenant isolation

With Neon, you create a [separate project for each tenant](https://neon.tech/docs/use-cases/database-per-user#setting-up-neon-for-database-per-user), which maps to a logically isolated Postgres environment. Each project has its own compute and endpoint, so tenant workloads never bleed into each other.

### Decoupled compute and storage

Neon [separates storage from compute](https://neon.tech/docs/introduction/architecture-overview):

- Storage is shared across all tenants, efficiently managed in the background.
- Compute is isolated—each tenant gets its own autoscaling compute node that can grow or shrink based on their workload.

This means a heavy reporting workload from Tenant A has zero impact on Tenant B.

### True pay-per-use economics

Because compute and storage are decoupled:

- Compute can [scale to zero](https://neon.tech/docs/introduction/scale-to-zero) when idle—ideal for long-tail tenants or bursty workloads.
- You only pay for what you use. A database that gets queried once a day costs a fraction of what it would on RDS.
- There’s [no overprovisioning](https://neon.tech/use-cases/serverless-apps)—Neon automatically scales up under load, then scales back down.

This makes the database-per-tenant model financially viable, even for low-tier plans.

### Autoscaling compute

When a tenant runs a complex job (like a big monthly report), Neon [automatically scales compute capacity up to meet demand](https://neon.tech/docs/introduction/autoscaling). When the job finishes, compute scales down. This happens independently for each tenant, eliminating contention and ensuring snappy performance.

## The End of Noisy Neighbors?

A properly implemented serverless, disaggregated database architecture structurally eliminates the noisy neighbor problem. Tenant A’s end-of-quarter reporting frenzy can trigger automatic scaling of their compute resources without affecting Tenant B’s experience in any way.

The architecture inherently enforces tenant resource boundaries while maintaining the flexibility to allow tenants to consume what they need, when they need it. This aligns perfectly with the SaaS business model—tenants who need more resources pay proportionally more without subsidizing or being penalized by the usage patterns of others.

For SaaS providers building multitenant applications today, this architectural approach represents perhaps the most elegant solution to the age-old noisy neighbor problem. No more complex throttling mechanisms, no more midnight alerts when one tenant’s runaway query brings down the system, and no more compromising on tenant isolation for the sake of operational efficiency.

Now you can finally have that straightforward talk with your CPU neighbors—and they’ll actually listen.

---

_If you haven’t tried Neon yet, [create an account](https://console.neon.tech/signup)—it only takes a few seconds, no credit card required—and get started with our Free Plan._
