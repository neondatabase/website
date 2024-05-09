---
title: What is Neon?
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
updatedOn: '2024-01-26T16:30:34.542Z'
---

**Neon is serverless Postgres optimized for developer experience, velocity, and scalability - and we offer a generous Free Tier that's not going away.**

## Neon is Postgres

Postgres is the world's most popular open-source database that developers have come to know and trust. From its beginning as a [DARPA-sponsored project at Berkley](https://www.postgresql.org/docs/current/history.html), Postgres has fostered an ever-growing community and is a preferred choice among developers because of its performance, reliability, and support for features like ACID transactions, advanced SQL, logical replication, and NoSQL/JSON support. Postgres is also known for its extensibility. No other database offers anything that compares to the Postgres extension ecosystem. Neon supports all of the latest Postgres versions and a large number of those [extensions](/docs/extensions/extensions-intro). 

**If your application runs on Postgres, it runs on Neon**. If it doesn't run on Postgres, [sign up](https://console.neon.tech/signup) for a Free Tier account, join our [Discord server](https://discord.gg/92vNTzKDGp), and start the journey today.

## We don't lock you in

As a true Postgres platform, there's no lock-in with Neon. **Building on Neon is building on Postgres**. If you are already running Postgres, getting started is easy. [Import your data](https://neon.tech/docs/import/import-intro) and [connect](https://neon.tech/docs/connect/connect-intro). Migrating from other databases is almost as easy. 

If you decide that Neon is not right for you, you won't have to tear apart your application to remove proprietary application layers. Neon is pro-ecosystem and pro-integration. We encourage you to build with the frameworks, platforms, and services that best fit your requirements. Neon works to enable that. Check out our [Framework, language, and platform guides](/docs/guides/guides-intro).

## Who should use Neon?

Neon is designed for a wide range of users, from individual developers to enterprises, seeking a modern, serverless Postgres experience. It caters to those who need a fully managed, scalable, and cost-effective database solution. Key users include:

- **Individual developers** looking for a fast and easy way to set up, manage, and scale Postgres databases without the hassle of server management. Neon's Free Tier makes it easy to get started. Free Tier users get access to features like project sharing and branching, and when you are ready to scale, you can easily upgrade your account to a paid plan for more computing power and storage. Its instant branching feature and serverless architecture make it ideal for development, testing, and staging environments.
- **Teams and organizations** that aim to enhance their development workflows with the ability to create database branches for testing new features or updates, mirroring the branching process used in code version control.
- **Enterprises** requiring scalable, high-performance database solutions with advanced features like autoscaling, autosuspend, point-in-time restore, and logical replication. Enterprises can benefit from custom pricing, higher resource allowances, and enterprise-level support to meet their specific requirements.

Neon's compatibility with serverless platforms like Cloudflare Workers and Netlify Functions further extends its utility to developers and organizations leveraging serverless architectures for building global, high-performance applications.

In summary, Neon is built for anyone who requires a Postgres database and wants to benefit from the scalability, ease of use, and cost savings provided by a serverless architecture.

## Neon's Free Tier is here to stay

Neon's Free Tier is a fundamental part of our commitment to users. Our architecture, which separates storage and compute, forms the backbone of Neon's sustainable approach. With Neon, you can build your personal project or PoC with confidence, knowing that our Free Tier is here to stay. [Read what our CEO has to say about Neon's Free Tier](https://twitter.com/nikitabase/status/1758639571414446415).

## Features

If you need a performant and dependable Postgres database and nothing more, Neon provides that, but in addition to being a true Postgres platform, Neon offers features and capabilities that allow you to build faster, with greater flexibility and cost efficiency:

- [Neon is serverless](#neon-is-serverless)
- [Neon is fully managed](#neon-is-fully-managed)
- [Branching](#branching)
- [Support for thousands of connections](#support-for-thousands-of-connections)
- [Vector search](#vector-search)
- [Point-in-Time Restore](#point-in-time-restore)
- [Time Travel](#time-travel)
- [Schema Diff](#schema-diff)
- [Neon CLI](#neon-cli)
- [Neon API](#neon-api)
- [Logical replication](#logical-replication)
- [Read replicas](#read-replicas)
- [Region availability](#region-availability)
- [Tenant isolation](#tenant-isolation)
- [Postgres extensions](#postgres-extensions)
- [Custom extensions](#custom-extensions)
- [IP Allow](#ip-allow)
- [Protected branches](#protected-branches)
- [Time Travel Assist](#time-travel-assist)
- [Web console](#web-console)
- [Neon CLI](#neon-cli)
- [Neon API](#neon-api)
- [Project sharing](#project-sharing)
- [Data access](#data-access)
- [Neon is open source](#neon-is-open-source)

### Neon is serverless

Neon's architecture separates compute from storage, which enables serverless features like [Autoscaling](#autoscaling), [Autosuspend](#autosuspend-scale-to-zero), and [bottomless storage](#bottomless-storage). Neon also supports a popular low-latency [Postgres serverless driver](#the-neon-serverless-driver) for use in edge and serverless environments.

#### What does it mean to separate compute from storage?

Separating compute from storage refers to an architecture where the database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). This design contrasts with traditional architectures where compute and storage are tightly coupled on the same server. In Neon, Postgres runs on a compute, and data, except for what's cached in memory, resides on Neon's storage layer.

Separation of compute and storage enables scalability as these resources can be scaled independently. You can adjust for processing power or storage capacity as needed without affecting the other. This approach is also cost-efficient. The ability to scale resources independently means you can benefit from the lower cost of storage compared to compute or avoid paying for additional storage when you only require extra processing power. Decoupling compute and storage also improves availability and durability, as data remains accessible and safe even if a compute instance fails.

#### Autoscaling

Neon's autoscaling capability automatically and transparently scales up compute resources on demand, in response to your application workload, and scales down during periods of inactivity. This ensures that you are maximizing your compute allowances while minimizing extra usage. Neon’s serverless approach removes the need for manual scaling, allowing you to focus more on your application and less on managing infrastructure. To learn more, see our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

#### Autosuspend (Scale to Zero)

Neon's Autosuspend feature automatically transitions a Neon compute instance (where Postgres runs) to an idle state, effectively scaling it to zero, after a period of inactivity to minimize compute costs. 

On the Free Tier, computes are suspended after 5 minutes of inactivity, but this setting is configurable on Neon's [Launch](/docs/introduction/plans#launch) and [Scale](/docs/introduction/plans#scale) plans. For example, you can configure a longer timeout period to keep your compute active longer (or indefinitely) or decrease the timeout for stricter usage management. 

_How long does it take to start an idle compute?_ This is what we call a [cold start](https://neon.tech/blog/cold-starts-just-got-hot#background-whats-a-cold-start-and-why-does-it-matter). Neon cold starts are fast, generally a few hundred milliseconds less — mostly unnoticeable. Unlike other database SaaS vendors, Neon does not put your database to sleep. There are no repeated communications about sleepy databases or long wake-up periods. Neon is built to start fast, no matter longer how long it's been since your database was last active.

_Why do you need a database that scales to zero?_ Combined with Neon's branching capability, scale to zero allows you to instantly spin up databases for development, experimentation, or testing without the typical costs associated with "always-running" databases with relatively little usage. This approach is ideal for various scenarios:

- _Non-production databases_: Development, staging, and testing environments benefit as developers can work on multiple instances without cost concerns, since these databases only use resources when active.
- _Internal apps_: Tailored for specific team needs, these apps often experience downtime during off-hours or holidays. Scale to zero ensures their supporting databases pause during inactivity, cutting costs without affecting usage during active periods.
- _Small projects_: Implementing scale to zero for these projects' databases enhances cost efficiency without significantly impacting user experience.

Learn more about how Neon makes cold starts fast and the advantages of a database that scales to zero:

- [Cold starts just got hot](https://neon.tech/blog/cold-starts-just-got-hot#background-whats-a-cold-start-and-why-does-it-matter)
- [Why you want a database that scales to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero)

#### Bottomless storage

Neon's storage system was purpose-built for the cloud to provide virtually unlimited storage with high availability and durability guarantees. Neon stores every transaction in multiple copies across availability zones and S3. Efficiency and performance are achieved through a multi-tier architecture designed to balance latency, throughput, and cost considerations.

Neon storage is architected to integrate storage, backups, and archiving into one system to reduce operational headaches and administrative overhead associated with checkpoints, data backups, and restore.

Neon uses cloud-based object storage solutions, like S3, for relocating less frequently accessed data to the most cost-efficient storage option. For your most frequently accessed data, which requires rapid access and high throughput, Neon uses locally attached SSDs to ensure high performance and low latency. 

The entire Neon storage framework is developed in Rust for maximum performance and usability.

#### The Neon serverless driver

The [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver) is a low-latency Postgres driver designed for JavaScript and TypeScript applications. It enables you to query data from serverless and edge environments over HTTP or WebSockets instead of TCP. This capability is particularly useful for achieving reduced query latencies, with the potential to achieve sub-10ms Postgres query times when querying from Edge or serverless functions.

### Neon is fully managed

Being a fully managed service means that Neon provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on developing applications and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, and ensuring availability, making it easier for users to manage their data without worrying about the underlying infrastructure.

### Branching

Neon's branching feature lets you instantly branch your data the same way you branch your code. You can instantly create full database copies for development, testing, or any other purpose. You can easily automate database branching using the Neon API, CLI, or GitHub Actions, enabling you to add database branching to your CI/CD pipeline. Branching can be used with deployment platforms such as Vercel to create a database branch for each preview deployment. To learn more, see [Get started with branching](/docs/guides/branching-intro).

### Support for thousands of connections

Neon's [connection pooling](/docs/connect/connection-pooling) feature supports up to 10,000 concurrent connections. Connection pooling works by caching and reusing database connections, which helps to significantly optimize resource usage and enhance performance. It reduces the overhead associated with establishing new connections and closing old ones, allowing applications to handle a higher volume of requests more efficiently. Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling.

### Vector search

Neon supports the use of the [pgvector](/docs/extensions/pgvector) Postgres extension, which enables storing and retrieving vector embeddings within your Postgres database. Neon's vector search capability allows for efficient and accurate similarity searches within a Postgres database, leveraging vector indexes for high-dimensional data. This feature is essential for building next-generation AI applications, enabling operations like fast and accurate similarity search, information retrieval, and recommendation systems directly in Postgres.

### Point-in-Time Restore

Neon's [Point-in-Time Restore](/docs/guides/branch-restore) feature allows you to restore data to a state that existed at an earlier time. This feature is crucial for scenarios like data recovery, where you might need to revert to a database state before an accidental deletion or any unwanted modifications occurred. It also facilitates testing and development workflows by allowing you to explore different scenarios or debug issues using historical data without affecting your current database state.

### Time Travel

Neon's [Time Travel Assist](/docs/guides/time-travel-assist) feature enables you to connect to any selected point in time within your history retention window and run queries against that connection. This allows you to query into the past, which is particularly useful for troubleshooting data history or ensuring you've identified the correct restore point before performing a branch restore. Time Travel Assist is designed to work in tandem with the restore operation, facilitating a more precise and informed restoration process.

### Schema Diff

Neon's Schema Diff tool lets you compare an SQL script of the schemas for two selected branches in a side-by-side view (or line-by-line on mobile devices). For more, see [Schema Diff](/docs/guides/schema-diff).

### Neon CLI

With the Neon CLI, you can integrate Neon with development tools and CI/CD pipelines to enhance your development workflows, reducing the friction associated with database-related operations like creating projects, databases, and branches. Once you have your connection string, you can manage your entire Neon database. This makes it possible to quickly set up deployment pipelines such as GitHub Actions, GitLab CI/CD, or Vercel Preview Environments. These operations and pipelines can also be treated as code and live alongside your applications as they evolve and mature.

Neon CLI integration translates to quicker deployments, easier rollback processes, and a more robust deployment experience, all contributing to increased developer velocity.

### Neon API

The Neon API is a REST API that enables you to manage your Neon projects programmatically. It provides resource-oriented URLs, accepts request bodies, returns JSON responses, and uses standard HTTP response codes. This API allows for a wide range of operations, enabling automation management of various aspects of Neon, including projects, branches, compute endpoints, databases, roles, and other resources.

Like the Neon CLI, you can the Neon API for seamless integration of Neon's capabilities into automated workflows, CI/CD pipelines, and developer tools. This can significantly enhance productivity, enabling you to automate repetitive tasks, manage resources more efficiently, and integrate database operations directly into your development processes.

### Logical replication

Logical replication enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

### Read replicas

Neon read replicas let you instantly scale your application by offloading read-only workloads to independent read-only compute instances. To learn more, see [Read replicas](/docs/introduction/read-replicas).

### Region availability

Neon supports project deployment in several regions. All Neon users have access to all regions. To learn more, see [Regions](/docs/introduction/regions).

### Tenant isolation

The Neon Enterprise plan offers tenant isolation, letting you segregate your data resources from other tenants. If you are interested in this feature, please contact [Sales](https://neon.tech/contact-sales).

### Postgres extensions

Neon supports a large number of open-source Postgres extensions letting you extend the capabilities of Postgres. See [Supported extensions](/docs/extensions/extensions-intro).

### Custom extensions

Neon supports custom-built Postgres extensions for exclusive use with your Neon account. See [Custom-built extensions](/docs/extensions/pg-extensions#custom-built-extensions).

### IP Allow

Neon's _IP Allow_ feature ensures that only trusted IP addresses can connect to the project where your database resides, preventing unauthorized access and helping maintain overall data security. You can limit access to individual IP addresses, IP ranges, or IP addresses and ranges defined with [CIDR notation](/docs/reference/glossary#cidr-notation). To learn more, see [Configure IP Allow](/docs/manage/projects#configure-ip-allow).

### Protected branches

The protected branches feature allows you to designate any branch as a "protected branch". A protected status limits access to the branch based on IP addresses. Only IPs listed in your project’s IP allowlist can access this branch. Typically, the protected branch status is given to a branch or branches that hold production data or sensitive data. For more, see [Protected branches](/docs/guides/protected-branches).

### Time Travel Assist

Neon's Time Travel Assist feature lets you connect to any selected point in time within your history retention window and run queries against that connection, allowing you to query into the past. See [Time Travel Assist](/docs/guides/branch-restore#time-travel-assist).

### Web console

Neon provides an easy-to-use web console that allows you to manage your Neon projects and Postgres databases from your browser.

### The Neon CLI

The Neon CLI is a command-line interface that lets you manage Neon directly from the terminal. See [The Neon CLI](/docs/reference/neon-cli).

### The Neon API

The Neon API is a RESTful API that lets you manage Neon programmatically. See [Get started with the Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

#### Project sharing

All Neon plans support sharing your Neon project with other Neon users, giving them access to your Neon project from all supported interfaces, including the Neon Console, Neon API, and Neon CLI. To learn more, refer to our [Project sharing](/docs/guides/project-sharing-guide) guide.

### Data access

Neon supports the following data access methods:

- The Postgres wire protocol using any Postgres client, ORM, framework, or BI tool that supports it.
- SQL over HTTP or WebSockets, which especially is useful when connecting from Edge or serverless environments where TCP is not supported.

### Neon is open source

You can find [neondatabase](https://github.com/neondatabase/neon) on GitHub. We develop in public under the Apache 2.0 license. For an overview of Neon's architecture, refer to Neon's [architecture documentation](/docs/introduction/architecture-overview).
