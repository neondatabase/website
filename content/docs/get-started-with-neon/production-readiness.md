---
title: Production readiness with Neon
subtitle: Neon features for real-world workloads
enableTableOfContents: true
updatedOn: '2024-10-09T10:24:30.493Z'
---

Learn how autoscaling, autosuspend, Neon's storage architecture, change data capture, read replicas, and support for thousands of connections can improve performance, reliability, and efficiency for your production environments.

## Autoscaling

**Automatically scale to meet demand.**

Neon's autoscaling feature automatically and transparently scales up compute resources on demand in response to your application workload and scales down during periods of inactivity. What does this mean for you?

- **You are always ready for an increased load**. Enable autoscaling and stop worrying about occasional traffic spikes.
- **You can stop paying for compute resources that you only use sometimes**. You no longer have to run a maximum potential load configuration at all times.
- **No more manual scaling disruptions**. With autoscaling, you can focus more on your application and less on managing infrastructure.

To learn more, see our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

## Autosuspend

**Stop paying for idle databases.**

Neon's _Autosuspend_ feature automatically transitions a Neon compute (where Postgres runs) to an idle state when it is not being used, effectively scaling it to zero to minimize compute usage and costs.

**Why do you need a database that scales to zero?** Combined with Neon's branching capability, autosuspend allows you to instantly spin up databases for development, experimentation, or testing without the typical costs associated with "always-running" databases with relatively little usage. This approach is ideal for various scenarios:

- **Non-production databases**: Development, staging, and testing environments benefit as developers can work on multiple instances without cost concerns since these databases only use resources when active.
- **Internal apps**: These apps often experience downtime during off-hours or holidays. Autosuspend ensures their supporting databases pause during inactivity, cutting costs without affecting usage during active periods.
- **Small projects**: Implementing autosuspend for these projects' databases enhances cost efficiency without significantly impacting user experience.

Learn more about [why you want a database that scales to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero).

## A storage architecture built for the cloud

**Efficient, performant, reliable storage**

Neon's storage was built for high availability and durability. Every transaction is stored in multiple copies across availability zones and S3. Efficiency and performance are achieved through a multi-tier architecture designed to balance latency, throughput, and cost considerations.

Neon storage is architected to integrate storage, backups, and archiving into one system to reduce operational headaches and administrative overhead associated with checkpoints, data backups, and restore.

Neon uses cloud-based object storage solutions, like S3, to relocate less frequently accessed data to the most cost-efficient storage option. For your most frequently accessed data, which requires rapid access and high throughput, Neon uses locally attached SSDs to ensure high performance and low latency.

The entire Neon storage framework is developed in Rust for maximum performance and usability. Read about [how we scale an open source, multi-tenant storage engine for Postgres written in Rust](https://neon.tech/blog/how-we-scale-an-open-source-multi-tenant-storage-engine-for-postgres-written-rust), or [take a deep dive into the Neon storage engine](https://neon.tech/blog/get-page-at-lsn) with Neon Co-Founder, Heikki Linnakangas.

## Change Data Capture (CDC) with Logical Replication

**Stream your data to external data platforms and services.**

Neon's Logical Replication feature enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

## Scale with read replicas

**Add read replicas to achieve instant scale.**

Neon supports read replicas that let you instantly scale your application by offloading read-only workloads from your primary read-write compute.

Create a read replica with the Neon CLI:

```bash
neon branches create --name my_read_replica_branch --type read_only
```

To learn more, see [Read replicas](/docs/introduction/read-replicas).

## Support for thousands of connections

**Add support for thousands of concurrent connections with a pooled connection string.**

Neon's [connection pooling](/docs/connect/connection-pooling) feature supports up to 10,000 concurrent connections. Connection pooling works by caching and reusing database connections, which helps to significantly optimize resource usage and enhance performance. It reduces the overhead associated with establishing new connections and closing old ones, allowing applications to handle a higher volume of requests more efficiently. Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling. Enabling connection pooling is easy. Just grab a pooled connection string from the console:

```bash
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

## More Neon features

For an overview of all the features that Neon supports, including security features, visit [Detailed Plan Comparison](https://neon.tech/pricing#plans) on the [Neon Pricing](https://neon.tech/pricing) page.
