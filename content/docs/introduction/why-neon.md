---
title: Why Neon?
subtitle: Neon is Serverless Postgres built for the cloud
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
  - /docs/introduction/about
updatedOn: '2024-01-26T16:30:34.542Z'
---

Looking back at Neon's debut blog post, [SELECT ’Hello, World’](https://neon.tech/blog/hello-world), the fundamental reasons for **Why Neon** remain the same:

- **To build the best Postgres experience in the cloud**. This is still our core mission today. It was clear to us then, as it is now, that database workloads are shifting into the cloud &#8212; and no one wants to manage a database themselves.
- **In an ever-changing technology stack, we believe Postgres is here to stay**. Just like the Linux operating system or Git version control, we believe Postgres is the default choice for a relational database system. That’s why all of the major platforms like AWS, Azure, Google Cloud, Digital Ocean, and many newcomers to this space offer Postgres as a service.
- **An idea that a modern Postgres cloud service can be designed differently**. We call this approach _separation of storage and compute_, which lets us architect the service around performance, reliability, manageability, and cost-efficiency.
- **The belief that our architecture can provide a better Developer Experience (DevX)**. Features such as autoscaling, branching, time travel, and instant databases, backups, and restore improve the developer experience by allowing quick environment setup, efficient developer workflows, and immediate database availability.

These are Neon's reasons, but given the many _database-as-a-service_ options available today, let's take a look at the reasons why **you** should choose Neon:

## Neon is Postgres

**Postgres is the world's most popular open-source database.** 

From its beginning as a [DARPA-sponsored project at Berkley](https://www.postgresql.org/docs/current/history.html), Postgres has fostered an ever-growing community and is a preferred database among developers because of its performance, reliability, extensibility, and support for features like ACID transactions, advanced SQL, and NoSQL/JSON. Neon supports all of the latest Postgres versions and numerous [Postgres extensions](/docs/extensions/extensions-intro). 

**If your application runs on Postgres, it runs on Neon**. If it doesn't run on Postgres, [sign up](https://console.neon.tech/signup) for a Free Tier account, join our [Discord server](https://discord.gg/92vNTzKDGp), and start the journey with us.

## Neon is serverless 

**A serverless architecture built for performance, reliability, manageability, and cost efficiency**

Neon's [architecture](/docs/introduction/architecture-overview) separates compute from storage, which enables serverless features like [Autoscaling](#autoscaling), [Autosuspend](#scale-to-zero), and [Bottomless Storage](#bottomless-storage). 

Separating compute from storage refers to an architecture where the database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). This design contrasts with traditional architectures where compute and storage are tightly coupled on the same server. In Neon, Postgres runs on a compute, and data (except for what's cached in memory) resides on Neon's storage layer.

Separation of compute and storage enables scalability as these resources can be scaled independently. You can adjust for processing power or storage capacity as needed without affecting the other. This approach is also cost-efficient. The ability to scale resources independently means you can benefit from the lower cost of storage compared to compute or avoid paying for additional storage when you only require extra processing power. Decoupling compute and storage also improves availability and durability, as data remains accessible and safe even if a compute instance fails.

### Autoscaling

**Automatically scale to meet demand.**

Neon's autoscaling feature automatically and transparently scales up compute resources on demand in response to your application workload and scales down during periods of inactivity. What does this mean for you?
- **You are always ready for an increased load**. Enable autoscaling and stop worrying about occasional traffic spikes.   
- **You can stop paying for compute resources that you only use sometimes**. You no longer have to run a maximum potential load configuration at all times.
- **No more manual scaling disruptions**. With autoscaling, you can focus more on your application and less on managing infrastructure. 

To learn more, see our [Autoscaling](/docs/introduction/autoscaling-guide) guide.

### Scale to zero

**Stop paying for idle databases.**

Neon's _Autosuspend_ feature automatically transitions a Neon compute instance (where Postgres runs) to an idle state when it is not being used, effectively scaling it to zero to minimize compute usage and costs. 

**Why do you need a database that scales to zero?** Combined with Neon's branching capability, scale to zero allows you to instantly spin up databases for development, experimentation, or testing without the typical costs associated with "always-running" databases with relatively little usage. This approach is ideal for various scenarios:

- **Non-production databases**: Development, staging, and testing environments benefit as developers can work on multiple instances without cost concerns since these databases only use resources when active.
- **Internal apps**: These apps often experience downtime during off-hours or holidays. Scale to zero ensures their supporting databases pause during inactivity, cutting costs without affecting usage during active periods.
- **Small projects**: Implementing scale to zero for these projects' databases enhances cost efficiency without significantly impacting user experience.

  Learn more about [why you want a database that scales to zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero).

### Bottomless storage

**Any data size; any growth trajectory.**

Neon's storage system was purpose-built for the cloud to provide virtually unlimited storage with high availability and durability guarantees. Neon stores every transaction in multiple copies across availability zones and S3. Efficiency and performance are achieved through a multi-tier architecture designed to balance latency, throughput, and cost considerations.

Neon storage is architected to integrate storage, backups, and archiving into one system to reduce operational headaches and administrative overhead associated with checkpoints, data backups, and restore.

Neon uses cloud-based object storage solutions, like S3, to relocate less frequently accessed data to the most cost-efficient storage option. For your most frequently accessed data, which requires rapid access and high throughput, Neon uses locally attached SSDs to ensure high performance and low latency. 

The entire Neon storage framework is developed in Rust for maximum performance and usability. Read about [how we scale an open source, multi-tenant storage engine for Postgres written in Rust](https://neon.tech/blog/how-we-scale-an-open-source-multi-tenant-storage-engine-for-postgres-written-rust), or [take a deep dive into the Neon storage engine](https://neon.tech/blog/get-page-at-lsn) with Neon Co-Founder, Heikki Linnakangas.

## Neon is fully managed

**Leave the database administrative, maintenance, and scaling burdens to us.**

Being a fully managed service means that Neon provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on developing applications and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, maintenance, and ensuring availability, enabling developers to manage their data without worrying about the underlying infrastructure.

## Developer velocity with database branching workflows

**Branch your data like code for local and preview development workflows.**

Neon's branching feature lets you branch your data like you branch code. Neon branches are full database copies, including both schema and data. You can instantly create database branches for integration with your development workflows.

![Branching workflows](/docs/introduction/branching_workflow.jpg)

You can build your database branching workflows using the Neon CLI, Neon API, or GitHub Actions. For example, this example shows how to create a development branch from `main` with a simple CLI command:

```bash
neonctl branches create --name dev/alex
```

Neon's copy-on-write technique makes branching instantaneous and cost-efficient. Whether your database is 1 GiB or 1 TiB, [it only takes seconds to create a branch](https://neon.tech/blog/how-to-copy-large-postgres-databases-in-seconds), and Neon's branches are full database copies, not partial or schema-only.     

Also, with Neon, you can easily keep your development branches up-to-date by resetting your schema and data to the latest from `main` with a simple command. 

```bash
neonctl branches reset dev/alex --parent
```

No more time-consuming restore operations when you need a fresh database copy.

You can use branching with deployment platforms such as Vercel to create a database branch for each preview deployment. If you'd rather not build your own branching workflow, you can use the [Neon Vercel integration](https://vercel.com/integrations/neon) to set one up in just a few clicks.

To learn more, read [Database Branching Workflows](https://neon.tech/flow), and the [Database branching workflow guide for developers](https://neon.tech/blog/database-branching-workflows-a-guide-for-developers).

<Admonition type="tip" title="Compare Database Branches with Schema Diff">
Neon's Schema Diff tool lets you compare the schemas for two selected branches in a side-by-side view. For more, see [Schema Diff](/docs/guides/schema-diff).
</Admonition>

## Instant database recovery

**Instant Point-in-Time Restore with Time Travel Assist**

We've all heard about multi-hour outages and data losses due to errant queries or problematic migrations. Neon's [Point-in-Time Restore](/docs/guides/branch-restore) feature allows you to instantly restore your data to a point in time before the issue occurred. With Neon, you can perform a restore operation in a few clicks, letting you get back online in the time it takes to choose a restore point, which can be a date and time or a Log Sequence Number (LSN).

To help you find the correct restore point, Neon provides a [Time Travel Assist](/docs/guides/time-travel-assist) feature that lets you connect to any selected time or LSN within your database history and run queries. Time Travel Assist is designed to work in tandem with Neon's restore capability to facilitate precise and informed restore operations.

## Database DevOps with Neon's CLI, API, and GitHub Actions

**Neon is built for DevOps. Use our CLI, API, or GitHub Actions to build your CI/CD pipelines.**

-  **Neon CLI**

    With the [Neon CLI](/docs/reference/neon-cli), you can integrate Neon with development tools and CI/CD pipelines to enhance your development workflows, reducing the friction associated with database-related operations like creating projects, databases, and branches. Once you have your connection string, you can manage your entire Neon database from the command line. This makes it possible to quickly set up deployment pipelines using GitHub Actions, GitLab CI/CD, or Vercel Preview Environments. These operations and pipelines can also be treated as code and live alongside your applications as they evolve and mature.

    ```bash
    neonctl branches create --name dev/alex
    ```

- **Neon API**

    The [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) is a REST API that enables you to manage your Neon projects programmatically. It provides resource-oriented URLs, accepts request bodies, returns JSON responses, and uses standard HTTP response codes. This API allows for a wide range of operations, enabling automation management of various aspects of Neon, including projects, branches, computes, databases, and roles. Like the Neon CLI, you can use the Neon API for seamless integration of Neon's capabilities into automated workflows, CI/CD pipelines, and developer tools. Give it a try using our [interactive Neon API reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api).

    ```bash
    curl --request POST \
        --url https://console.neon.tech/api/v2/projects/ancient-rice-43775340/branches \
        --header 'accept: application/json' \
        --header 'authorization: Bearer $NEON_API_KEY' \
        --header 'content-type: application/json' \
        --data '
    {
      "branch": {
        "name": "dev/alex"
      },
      "endpoints": [
        {
          "type": "read_write"
        }
      ]
    }
    '
    ```

- **GitHub Actions**

    Neon provides the GitHub Actions for working with database branches, which you can add to your CI workflows. To learn more, see [Automate branching with GitHub Actions](/docs/guides/branching-github-actions).

    ```yaml
    name: Create Neon Branch with GitHub Actions Demo
    run-name: Create a Neon Branch 🚀
    jobs:
      Create-Neon-Branch:
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: rapid-haze-373089
          # optional (defaults to your primary branch)
          parent: dev
          # optional (defaults to neondb)
          database: my-database
          branch_name: from_action_reusable
          username: db_user_for_url
          api_key: ${{ secrets.NEON_API_KEY }}
        id: create-branch
      - run: echo db_url ${{ steps.create-branch.outputs.db_url }}
      - run: echo host ${{ steps.create-branch.outputs.host }}
      - run: echo branch_id ${{ steps.create-branch.outputs.branch_id }}
    ```

## Support for thousands of connections

**Add support for thousands of concurrent connections with a pooled connection string.**

Neon's [connection pooling](/docs/connect/connection-pooling) feature supports up to 10,000 concurrent connections. Connection pooling works by caching and reusing database connections, which helps to significantly optimize resource usage and enhance performance. It reduces the overhead associated with establishing new connections and closing old ones, allowing applications to handle a higher volume of requests more efficiently. Neon uses [PgBouncer](https://www.pgbouncer.org/) to support connection pooling. Enabling connection pooling is easy. Just grab a pooled connection string from the console:

```bash
postgres://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname
```

## Low-latency connections

**Connect from Edge and serverless environments.**

The [Neon serverless driver](https://neon.tech/docs/serverless/serverless-driver), which currently has over [100K weekly downloads](https://www.npmjs.com/package/@neondatabase/serverless), is a low-latency Postgres driver designed for JavaScript and TypeScript applications. It enables you to query data from edge and serverless environments like **Vercel Edge Functions** or **Cloudflare Workers** over HTTP or WebSockets instead of TCP. This capability is particularly useful for achieving reduced query latencies, with the potential to achieve [sub-10ms Postgres query times](https://neon.tech/blog/sub-10ms-postgres-queries-for-vercel-edge-functions) when querying from Edge or serverless functions. But don't take our word for it. Try it for yourself with Vercel's [Functions + Database Latency app](https://db-latency.vercel.app/). This graph shows latencies for Neon's serverless driver:

![Vercel's Functions Database Latency app](/docs/introduction/latency_distribution_graph.png)

## Postgres extension support

**No database is more extensible than Postgres.**

Postgres extensions are add-ons that enhance the functionality of Postgres, letting you tailor your Postgres database to your specific requirements. They offer features ranging from advanced indexing and data types to geospatial capabilities and analytics, allowing you to significantly expand the native capabilities of Postgres. Some of the more popular Postgres extensions include:

- **PostGIS**: Adds support for geographic objects, turning PostgreSQL into a spatial database.
- **pg_stat_statements**: Tracks execution statistics of all SQL queries for performance tuning.
- **pg_partman**: Simplifies partition management, making it easier to maintain time-based or serial-based table partitions.
- **pg_trgm**: Provides fast similarity search using trigrams, ideal for full-text search.
- **hstore**: Implements key-value pairs for semi-structured data storage.
- **plpgsql**: Enables procedural language functions with PL/pgSQL scripting.
- **pgcrypto**: Offers cryptographic functions, including data encryption and decryption.
- **pgvector**: Brings vector similarity search to Postgres for building AI applications.

These are just a few of the extensions supported by Neon. Explore all supported extensions [here](/docs/extensions/extensions-intro).

Extensions can be installed with a simple `CREATE EXTENSION` command from Neon's [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or any SQL client; for example:

```sql
CREATE EXTENSION pgcrypto;
```

## Build your AI applications with Postgres

**Why pay for a specialized vector database service when you can just use Postgres?**

Neon supports the [pgvector](/docs/extensions/pgvector) Postgres extension for storing and retrieving vector embeddings within your Postgres database. This feature is essential for building next-generation AI applications, enabling operations like fast and accurate similarity search, information retrieval, and recommendation systems directly in Postgres. Why pay for or add the complexity of a specialized vector database service when you have leading-egde capabilities in Postgres? Neon's own **Ask Neon AI** chat, built in collaboration with [InKeep](https://inkeep.com/), uses Neon with [pgvector](/docs/extensions/pgvector). For more, see [Powering next gen AI apps with Postgres](https://neon.tech/ai).

## Change Data Capture (CDC) with Logical Replication

**Stream your data to external data platforms and services.**

Neon's Logical Replication feature enables replicating data from your Neon database to external destinations, allowing for Change Data Capture (CDC) and real-time analytics. Stream your data to data warehouses, analytical database services, messaging platforms, event-streaming platforms, external Postgres databases, and more. To learn more, see [Get started with logical replication](/docs/guides/logical-replication-guide).

## Scale with Instant Read Replicas

**Add read-only computes to achieve instant scale.**

Neon supports Instant Read Replicas that let you instantly scale your application by offloading read-only workloads to independent read-only compute instances that access the same data as your read-write compute.

Create a read replica with the Neon CLI:

```bash
neonctl branches create --name my_read_replica_branch --type read_only
```

To learn more, see [Read replicas](/docs/introduction/read-replicas).

## More Neon features

For an overview of all the features that Neon supports, including security features, visit [Detailed Plan Comparison](https://neon.tech/pricing#plans) on the [Neon Pricing](https://neon.tech/pricing) page.

## Neon is open source

**Neon is developed under an Apache 2.0 license**

Neon is not the first to offer separation of storage and compute for Postgres. AWS Aurora is probably the most famous example; however, it is proprietary and tied to AWS’s internal infrastructure.

We believe we have an opportunity to define the standard for cloud Postgres. We carefully designed our storage, focusing on cloud independence, performance, manageability, DevX, and cost. We chose the most permissive open-source license, Apache 2.0, and invited the world to participate. You can already build and run your own self-hosted instance of Neon. Check out our [neon GitHub repository](https://github.com/neondatabase) and the [#self-hosted](https://discord.com/channels/1176467419317940276/1184894814769127464) channel on our Discord server.

## Neon doesn't lock you in

**As a true Postgres platform, there's no lock-in with Neon.**

Building on Neon is building on Postgres. If you are already running Postgres, getting started is easy. [Import your data](https://neon.tech/docs/import/import-intro) and [connect](https://neon.tech/docs/connect/connect-intro). Migrating from other databases like MySQL or MongoDB is just as easy. 

If you need to move data, you won't have to tear apart your application to remove proprietary application layers. Neon is pro-ecosystem and pro-integration. We encourage you to build with the frameworks, platforms, and services that best fit your requirements. Neon works to enable that. Check out our ever-expanding [Framework, language, and platform guides](/docs/guides/guides-intro).

## Who should use Neon?

**You. And we're ready to help you get started.** 

Neon is designed for a wide range of users, from individual developers to enterprises, seeking modern, serverless Postgres capabilities. It caters to those who need a fully managed, scalable, and cost-effective database solution. Key users include:

- **Individual developers** looking for a fast and easy way to set up a Postgres database without the hassle of installation or configuration. Neon's Free Tier makes it easy to get started. [Free Tier](/docs/introduction/plans#free-tier) users get access to all regions and features like connection pooling, project sharing, and branching. When you are ready to scale, you can easily upgrade your account to a paid plan for more computing power, storage, and advanced features.
  
  <Admonition type="tip" title="Neon's Free Tier is here to stay">
  Neon's Free Tier is a fundamental part of our commitment to users. Our architecture, which separates storage and compute, enables a sustainable Free Tier. You can build your personal project or PoC with confidence, knowing that our Free Tier is here to stay. [Learn more about our Free Tier from Neon's CEO](https://twitter.com/nikitabase/status/1758639571414446415).
  </Admonition>
- **Teams and organizations** that aim to enhance their development workflows with the ability to create database branches for testing new features or updates, mirroring the branching process used in code version control.
- **Enterprises** requiring scalable, high-performance database solutions with advanced features like autoscaling, autosuspend, point-in-time restore, and logical replication. Enterprises can benefit from custom pricing, higher resource allowances, and enterprise-level support to meet their specific requirements.

In summary, Neon is built for anyone who requires a Postgres database and wants to benefit from the scalability, ease of use, cost savings, and advanced DevX capabilities provided by Neon's serverless architecture.

## Neon makes it easy to get started with Postgres

**Set up your Postgres database in seconds.**

1. [Log in](https://console.neon.tech/signup) with an email address, Google, or GitHub account.
2. Provide a project name and database name, and select a region.
3. Click **Create Project**.

Neon's architecture allows us to spin up a Postgres database almost instantly and provide you with a database URL, which you can plug into your application or database client.

```sql
postgres://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

Additionally, after signing up, we land you on your project dashboard, where you'll find connection snippets for various frameworks, languages, and platforms.

![Next.js connection snippet from the Connection details widget on the Neon Dashboard](/docs/introduction/connection_snippet.png)

If you are not quite ready to hook up an application, you can explore Neon from the console. Create the `playing_with_neon` table using the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), run some queries, or create a database branch. 

Initially, you'll be signed up for Neon's [Free Tier](/docs/introduction/plans#free-tier), but you can easily upgrade to one of our [paid plans](/docs/introduction/plans) when you're ready.

<CTA title="Are you ready?" description="After signing up, remeber to join our active Discord community, where you'll find Neon users and team members ready to help." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
