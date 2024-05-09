---
title: Why Neon?
subtitle: Neon is serverless Postgres optimized for developer experience, velocity, and scalability
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
updatedOn: '2024-01-26T16:30:34.542Z'
---

## Neon is Postgres

Postgres is the world's most popular open-source database. From its beginning as a [DARPA-sponsored project at Berkley](https://www.postgresql.org/docs/current/history.html), Postgres has fostered an ever-growing community and is a preferred choice among developers because of its performance, reliability, extensibility, and support for features like ACID transactions, advanced SQL, and NoSQL/JSON. Neon supports all of the latest Postgres versions and numerous [Postgres extensions](/docs/extensions/extensions-intro). 

**If your application runs on Postgres, it runs on Neon**. If it doesn't run on Postgres, [sign up](https://console.neon.tech/signup) for a Free Tier account, join our [Discord server](https://discord.gg/92vNTzKDGp), and start the journey with us.

## Neon is serverless

Neon's architecture separates compute from storage, which enables serverless features like [Autoscaling](#autoscaling), [Autosuspend](#scale-to-zero), and [Bottomless Storage](#bottomless-storage). 

Separating compute from storage refers to an architecture where the database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). This design contrasts with traditional architectures where compute and storage are tightly coupled on the same server. In Neon, Postgres runs on a compute, and data, except for what's cached in memory, resides on Neon's storage layer.

Separation of compute and storage enables scalability as these resources can be scaled independently. You can adjust for processing power or storage capacity as needed without affecting the other. This approach is also cost-efficient. The ability to scale resources independently means you can benefit from the lower cost of storage compared to compute or avoid paying for additional storage when you only require extra processing power. Decoupling compute and storage also improves availability and durability, as data remains accessible and safe even if a compute instance fails.

- **Autoscaling**

  Neon's autoscaling capability automatically and transparently scales up compute resources on demand, in response to your application workload, and scales down during periods of inactivity. This ensures that you are maximizing your compute allowances while minimizing extra usage. Neon’s serverless approach removes the need for manual scaling, allowing you to focus more on your application and less on managing infrastructure. To learn more, see our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

- **Scale to zero**

  Neon's _Autosuspend_ feature automatically transitions a Neon compute instance (where Postgres runs) to an idle state, effectively scaling it to zero, after a period of inactivity to minimize compute costs. 

  _Why do you need a database that scales to zero?_ Combined with Neon's branching capability, scale to zero allows you to instantly spin up databases for development, experimentation, or testing without the typical costs associated with "always-running" databases with relatively little usage. This approach is ideal for various scenarios:

  - _Non-production databases_: Development, staging, and testing environments benefit as developers can work on multiple instances without cost concerns, since these databases only use resources when active.
  - _Internal apps_: These apps often experience downtime during off-hours or holidays. Scale to zero ensures their supporting databases pause during inactivity, cutting costs without affecting usage during active periods.
  - _Small projects_: Implementing scale to zero for these projects' databases enhances cost efficiency without significantly impacting user experience.

  Learn more: [Why you want a database that scales to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero)

- **Bottomless storage**

  Neon's storage system was purpose-built for the cloud to provide virtually unlimited storage with high availability and durability guarantees. Neon stores every transaction in multiple copies across availability zones and S3. Efficiency and performance are achieved through a multi-tier architecture designed to balance latency, throughput, and cost considerations.

  Neon storage is architected to integrate storage, backups, and archiving into one system to reduce operational headaches and administrative overhead associated with checkpoints, data backups, and restore.

  Neon uses cloud-based object storage solutions, like S3, for relocating less frequently accessed data to the most cost-efficient storage option. For your most frequently accessed data, which requires rapid access and high throughput, Neon uses locally attached SSDs to ensure high performance and low latency. 

  The entire Neon storage framework is developed in Rust for maximum performance and usability.

## Neon is fully managed

Being a fully managed service means that Neon provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on developing applications and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, maintenance, and ensuring availability, enabling developers to manage their data without worrying about the underlying infrastructure.

## Neon supports thousands of connections

Neon's [connection pooling](/docs/connect/connection-pooling) feature supports up to 10,000 concurrent connections. Connection pooling works by caching and reusing database connections, which helps to significantly optimize resource usage and enhance performance. It reduces the overhead associated with establishing new connections and closing old ones, allowing applications to handle a higher volume of requests more efficiently. Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling.

## Neon supports edge and serverless environments

The [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) is a low-latency Postgres driver designed for JavaScript and TypeScript applications. It enables you to query data from edge and serverless environments over HTTP or WebSockets instead of TCP. This capability is particularly useful for achieving reduced query latencies, with the potential to achieve sub-10ms Postgres query times when querying from Edge or serverless functions.

## Developer velocity with database branching workflows

Neon's branching feature lets you branch your data the same way you branch your code. You can instantly create full database copies for integration with your development workflows.

![Branching workflows](/docs/introduction/branching_workflow.jpg)

You can build your own workflow using the Neon CLI, Neon API, or GitHub Actions.

Create a development branch from `main`:

```bash
neonctl branches create --name dev/alex
```

Keep your development branch up-to-date by resetting your schema and data to the latest from `main`.

```bash
neonctl branches reset dev/daniel --parent
```

Branching can be used with deployment platforms such as Vercel to create a database branch for each preview deployment. If you'd rather not build your own workflow, use the [Neon Vercel integration](https://vercel.com/integrations/neon) to set one up in just a few clicks.

To learn more, read [Database Branching Workflows](https://neon.tech/flow), and the [Database branching workflow guide for developers](https://neon.tech/blog/database-branching-workflows-a-guide-for-developers).

**Schema Diff**

Neon's Schema Diff tool lets you compare the schemas for two selected branches in a side-by-side view. For more, see [Schema Diff](/docs/guides/schema-diff).

## Instant database recovery with time travel

Neon's [Point-in-Time Restore](/docs/guides/branch-restore) feature allows you to restore data to a state that existed at an earlier time. This feature is crucial for scenarios like data recovery, where you might need to revert to a database state before an accidental deletion or any unwanted modifications occurred. It also facilitates testing and development workflows by allowing you to explore different scenarios or debug issues using historical data without affecting your current database state.

Neon's [Time Travel Assist](/docs/guides/time-travel-assist) feature enables you to connect to any selected point in time within your history retention window and run queries against that connection. This allows you to query into the past, which is particularly useful for troubleshooting data history or ensuring you've identified the correct restore point before performing a branch restore. Time Travel Assist is designed to work in tandem with the restore operation, facilitating a more precise and informed restoration process.

### Vector search

Neon supports the use of the [pgvector](/docs/extensions/pgvector) Postgres extension, which enables storing and retrieving vector embeddings within your Postgres database. Neon's vector search capability allows for efficient and accurate similarity searches within a Postgres database, leveraging vector indexes for high-dimensional data. This feature is essential for building next-generation AI applications, enabling operations like fast and accurate similarity search, information retrieval, and recommendation systems directly in Postgres.

## Database automation for your CI/CD pipelines

Neon is built for automation. Use our CLI, API, or GitHub Actions to build your CI/CI pipelines.

-  **Neon CLI**

    With the Neon CLI, you can integrate Neon with development tools and CI/CD pipelines to enhance your development workflows, reducing the friction associated with database-related operations like creating projects, databases, and branches. Once you have your connection string, you can manage your entire Neon database from the command line. This makes it possible to quickly set up deployment pipelines using GitHub Actions, GitLab CI/CD, or Vercel Preview Environments. These operations and pipelines can also be treated as code and live alongside your applications as they evolve and mature.

- **Neon API**

    The Neon API is a REST API that enables you to manage your Neon projects programmatically. It provides resource-oriented URLs, accepts request bodies, returns JSON responses, and uses standard HTTP response codes. This API allows for a wide range of operations, enabling automation management of various aspects of Neon, including projects, branches, computes, databases, and roles. Like the Neon CLI, you can use the Neon API for seamless integration of Neon's capabilities into automated workflows, CI/CD pipelines, and developer tools.

- **GitHub Actions**

    Neon provides the GitHub Actions for working with database branches, which you can add to your CI workflows. To learn more, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

## Change Data Capture (CDC) and real-time analytics

Neon's Logical Replication feature enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

## Scale automatically and instantly

In addition to Neon's Autoscaling capability that automatically scales compute capacity on demand, Neon supports Read Replicas that let you instantly scale your application by offloading read-only workloads to independent read-only compute instances. To learn more, see [Read replicas](/docs/introduction/read-replicas).

Create a read replica with the Neon CLI:

```bash
neonctl branches create --name my_read_replica_branch --type read_only
```

## Who should use Neon?

Neon is designed for a wide range of users, from individual developers to enterprises, seeking a modern, serverless Postgres experience. It caters to those who need a fully managed, scalable, and cost-effective database solution. Key users include:

- **Individual developers** looking for a fast and easy way to set up, manage, and scale Postgres databases without the hassle of server management. Neon's Free Tier makes it easy to get started. Free Tier users get access to features like project sharing and branching, and when you are ready to scale, you can easily upgrade your account to a paid plan for more computing power and storage. Its instant branching feature and serverless architecture make it ideal for development, testing, and staging environments.
- **Teams and organizations** that aim to enhance their development workflows with the ability to create database branches for testing new features or updates, mirroring the branching process used in code version control.
- **Enterprises** requiring scalable, high-performance database solutions with advanced features like autoscaling, autosuspend, point-in-time restore, and logical replication. Enterprises can benefit from custom pricing, higher resource allowances, and enterprise-level support to meet their specific requirements.

In summary, Neon is built for anyone who requires a Postgres database and wants to benefit from the scalability, ease of use, and cost savings provided by a serverless architecture.

<Admonition type="tip" title="Neon's Free Tier is here to stay">
Neon's Free Tier is a fundamental part of our commitment to users. Our architecture, which separates storage and compute, enables a sustainable Free Tier. You can build your personal project or PoC with confidence, knowing that our Free Tier is here to stay. [Read what our CEO has to say about Neon's Free Tier](https://twitter.com/nikitabase/status/1758639571414446415).
</Admonition>
