---
title: What is Neon?
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
updatedOn: '2024-01-26T16:30:34.542Z'
---

**Neon is serverless Postgres optimized for developer experience, velocity, and scalability - and we offer a generous Free Tier that's not going away.**

## Neon is Postgres

**Neon is Postgres**, the world's most popular open-source database that developers have come to know and trust. From its beginning as a [DARPA-sponsored project at Berkley](https://www.postgresql.org/docs/current/history.html), Postgres has fostered an ever-growing community and is a preferred choice among developers because of its performance, reliability, and support for features like ACID transactions, advanced SQL, logical replication, and NoSQL/JSON support. Postgres is also known for its extensibility. No other database offers anything that compares to the Postgres extension ecosystem. Neon supports all of the latest Postgres versions and a large number of those [Postgres extensions](/docs/extensions/extensions-intro). **If your application runs on Postgres, it runs on Neon**. If it doesn't run on Postgres, [sign up](https://console.neon.tech/signup) for a Free Tier account, join our [Discord server](https://discord.gg/92vNTzKDGp), and start the journey today. 

As a true Postgres platform, there's no lock-in with Neon. **Building on Neon is building on Postgres**. If you are already running Postgres, getting started is easy. [Import your data](https://neon.tech/docs/import/import-intro) and [connect](https://neon.tech/docs/connect/connect-intro). Migrating from other databases is almost as easy. If you decide that Neon is not right for you, you won't have to tear apart your application to remove proprietary application layers. Neon is pro-ecosystem and pro-integration. We encourage you to build with the frameworks, platforms, and services that best fit your requirements. Neon works to enable that. Check out our [Framework, language, and platform guides](/docs/guides/guides-intro).

If you just need a Postgres database and nothing more, Neon provides that, but in addition to being a true Postgres platform, Neon offers features and capabilities that allow you to build faster, with greater flexibility and cost efficiency:

- [Neon is serverless](#neon-is-serverless)
- [Neon is fully managed](#neon-is-fully-managed)
- [Branch your data like you branch your code](#branch-your-data-like-you-branch-your-code)
- [Instant provisiioning]()
- [Point-in-time Restore](#point-in-time-restore)
- [Support for thousands of connections](#connection-pooling)
- [Time Travel](#time-travel-assist)
- [Vector search](#vector)
- [Logical Replication]()
- [Instant Read Replicas](#tbd)
- [Database automation and workflows](#tbd)

### Neon is serverless

Neon's architecture separates compute from storage, which enables serverless features like [Autoscaling](#autoscaling), [Autosuspend](#autosuspend-scale-to-zero), and [bottomless storage](#bottomless-storage). Neon also supports a popular low-latency [Postgres serverless driver](#the-neon-serverless-driver) for use in edge and serverless environments.

#### What does it mean to separate compute from storage?

Separating compute from storage refers to an architecture where the database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). This design contrasts with traditional architectures where compute and storage are tightly coupled on the same server. In Neon, Postgres runs on a compute, and data, except for what's cached in memory, resides on Neon's storage layer.

Separation of compute and storage enables scalability as these resources can be scaled independently. You can adjust for processing power or storage capacity as needed without affecting the other. This approach is also cost-efficient. The ability to scale resources independently means you can benefit from the lower cost of storage compared to compute or avoid paying for additional storage when you only require extra processing power. Decoupling compute and storage also improves availability and durability, as data remains accessible and safe even if a compute instance fails.

#### Autoscaling

Neon's autoscaling capability automatically and transparently scales up compute resources on demand, in response to your application workload, and scales down during periods of inactivity. This ensures that you are maximizing your compute allowances while minimizing extra usage. Neon’s serverless approach removes the need for manual scaling, allowing you to focus more on your application and less on managing infrastructure.

#### Scale to Zero

Neon's Autosuspend feature automatically transitions a Neon compute instance (where Postgres runs) to an idle state, effectively scaling it to zero, after a period of inactivity to minimize usage costs. 

On the Free Tier, computes are suspended after 5 minutes of inactivity, but this setting is configurable on Neon's [Launch](/docs/introduction/plans#launch) and [Scale](/docs/introduction/plans#scale) plans. For example, you can configure a longer timeout period to keep your compute active longer (or indefinitely) or decrease the timeout for stricter usage management. 

_How long does it take to start an idle compute?_ This is what we call a [cold start](https://neon.tech/blog/cold-starts-just-got-hot#background-whats-a-cold-start-and-why-does-it-matter). Neon cold starts are fast, generally 500 milliseconds less — mostly inperceptable. Unlike other database SaaS vendors, Neon does not put your database to sleep. There are no repeated communications about sleepy databases or long wake-up periods. Neon is built to start fast, no matter longer how long it's been since your database was last active.

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

## Neon is fully managed

Neon being a fully managed service means that it provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on productivity and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, and ensuring availability, making it easier for users to manage their Postgres databases without worrying about the underlying infrastructure.

## Branch your data like code

Neon's instant branching feature allows you to instantly create a copy of your data, similar to how you would branch your code. This feature relies on a copy-on-write technique, making the branching process both instantaneous and cost-effective. The instant branching capability seamlessly integrates into your CI/CD pipeline through the Neon API, enhancing development workflows by enabling you to deploy development, testing, and staging environments with up-to-date copies of your production data. Developers can create individual branches for experimentation and modification, and branches can also be spun up for each preview of pull requests to facilitate reviews and testing. This feature is particularly beneficial for testing new features with real data, running simulations, performing scenario analysis, and answering "What if" questions using production-like data without the hassle of database dumps creation and restoration

## Support for thousands of connections

The connection pooling feature in Neon supports up to 10,000 concurrent connections. Connection pooling works by caching and reusing database connections, which helps to significantly optimize resource usage and enhance performance. It reduces the overhead associated with establishing new connections and closing old ones, allowing applications to handle a higher volume of requests more efficiently.

## Vector search

Neon supports the use of the pgvector Postgres extension, which enables storing and retrieving vector embeddings within your Postgres database. Neon's vector search capability allows for efficient and accurate similarity searches within a Postgres database, leveraging vector indexes for high-dimensional data. This feature is essential for building next-generation AI applications, enabling operations like fast and accurate similarity search, information retrieval, and recommendation systems directly in Postgres.

## Point-in-Time Restore

Neon's Point-in-Time Restore feature allows you to restore data to a state that existed at an earlier specific time. This is made possible by retaining a history of changes in the form of Write-Ahead-Log (WAL) records. This feature is crucial for scenarios like data recovery, where you might need to revert to a database state before an accidental deletion or any unwanted modifications occurred. It also facilitates testing and development workflows by allowing you to explore different scenarios or debug issues using historical data without affecting your current database state.

## Time Travel Assist

Neon's Time Travel Assist feature enables you to connect to any selected point in time within your history retention window and run queries against that connection. This allows you to query into the past, which is particularly useful for troubleshooting data history or ensuring you've identified the correct restore point before performing a branch restore. Time Travel Assist is designed to work in tandem with the restore operation, facilitating a more precise and informed restoration process.

## Neon CLI

The Neon CLI (Command Line Interface) is a powerful tool that allows developers to manage Neon resources directly from the terminal. It serves as a command-line interface for interacting with Neon, enabling a wide range of operations without the need for a graphical interface. This makes it highly useful for integrating into automated scripts, developer workflows, and CI/CD pipelines, enhancing productivity and enabling more efficient management of projects, branches, databases, and roles, among other resources.

## Neon API

The Neon API is a REST API that enables you to manage your Neon projects programmatically. It provides resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs. This API allows for a wide range of operations, enabling developers to automate the management of various aspects of their Neon resources, including projects, branches, compute endpoints, databases, and roles.

The use of the Neon API is highly beneficial because it allows for seamless integration of Neon's capabilities into automated workflows, CI/CD pipelines, and developer tools. This can significantly enhance productivity, enabling teams to automate repetitive tasks, manage resources more efficiently, and integrate database operations directly into their development processes. Furthermore, the ability to manage Neon programmatically supports a more agile development environment, facilitating faster iterations and more robust testing scenarios.

## SDKs

## Terraform providers

## Data access

- Via the Postgres wire protocol, using any Postgres client, ORM, or BI tool.
Via SQL over HTTP, which especially is useful when calling Neon from serverless functions, because it doesn't require persistent connections.
Via the Neon API, which is a RESTful API that provides a higher-level abstraction over the database, and provides access to data platform functionality like full-text search, aggregations, and file attachments.
SDKs support all three methods above, so it easy to switch between them depending on the use case. The SDKs are available for multiple programming languages, including TypeScript, JavaScript, Python, and Go and are continuously tested with the Neon service.

Neon's serverless architecture can help you streamline your workflows by eliminating the need for managing database servers and scaling infrastructure manually. This means you or your developers can focus more on creating applications without worrying about backend constraints. 


Neon enhances velocity by automatically scaling resources to match demand, ensuring that applications remain performant under varying loads. Moreover, its optimization for developer experience includes intuitive tooling and seamless integration with existing development environments, making it easier to implement advanced database functionalities. With Neon, scalability is no longer a challenge but an inherent feature, supporting the growth of applications from startup to enterprise scale effortlessly.

## Neon is open source

You can find [neondatabase](https://github.com/neondatabase/neon) on GitHub. We develop in public under the Apache 2.0 license. For an overview of Neon's architecture, refer to Neon's [architecture documentation](/docs/introduction/architecture-overview).

## Who should use Neon?

Neon is designed for a wide range of users, from individual developers to enterprises, seeking a modern, serverless Postgres experience. It caters to those who need a fully managed, scalable, and cost-effective database solution. Key users include:

- Individual developers looking for a fast and easy way to set up, manage, and scale Postgres databases without the hassle of server management. Neon's Free Tier makes it easy to get started. Free Tier users get access to features like project sharing and branching, and when you are ready to scale, you can easily upgrade your account to a paid plan for more computing power and storage. 
]
Its instant branching feature and serverless architecture make it ideal for development, testing, and staging environments.

- Teams and Organizations that aim to enhance their development workflows with the ability to create database branches for testing new features or updates, mirroring the branching process used in code version control.

- Enterprises requiring scalable, high-performance database solutions with advanced features like autoscaling, autosuspend, point-in-time restore, and logical replication. Enterprises can benefit from custom pricing, higher resource allowances, and enterprise-level support to meet their specific requirements.

Neon's compatibility with serverless platforms like Cloudflare Workers and Netlify Functions further extends its utility to developers and organizations leveraging serverless architectures for building global, high-performance applications.

In summary, Neon is built for anyone who requires a Postgres database and wishes to benefit from the scalability, ease of use, and cost savings provided by a serverless architecture.

## Why the Neon Free Tier is here to stay



## Built for developer productivity

Neon allows you to create a branch of your Postgres database. It's easy to create branches for development, test, and staging environments.

Branching is instant and has close to zero overhead, as it is implemented using the "copy-on-write" technique in Neon storage.
In fact, branches are so cheap that you can create a branch for every code deployment in your CI/CD pipeline. To learn more about our branching feature, see [Branching](/docs/introduction/branching).




## Compatibility

Neon compute is the latest version of Postgres. It is 100% compatible with any application that uses the official release of Postgres. Currently, we support [Postgres 14](https://www.postgresql.org/docs/14/release-14.html), [Postgres 15](https://www.postgresql.org/docs/15/release-15.html), and [Postgres 16](https://www.postgresql.org/docs/16/release-16.html) (the default). For details refer to the [Postgres compatibility](/docs/reference/compatibility) page.
