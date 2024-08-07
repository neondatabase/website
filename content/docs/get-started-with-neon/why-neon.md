---
title: Why Neon?
subtitle: Neon is Serverless Postgres built for the cloud
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
  - /docs/introduction/about
updatedOn: '2024-08-06T15:23:10.946Z'
---

Looking back at Neon's debut blog post, [SELECT ’Hello, World’](https://neon.tech/blog/hello-world), the fundamental reasons for **Why Neon** remain the same:

- **To build the best Postgres experience in the cloud**

  This is still our core mission today. It was clear to us then, as it is now, that database workloads are shifting into the cloud &#8212; and no one wants to manage a database themselves.

- **In an ever-changing technology stack, we believe Postgres is here to stay**

  Just like the Linux operating system or Git version control, we believe Postgres is the default choice for a relational database system. That’s why all of the major platforms like AWS, Azure, Google Cloud, Digital Ocean, and many newcomers to this space offer Postgres as a service.

- **An idea that a modern Postgres cloud service can be designed differently**

  We call this approach _separation of storage and compute_, which lets us architect the service around performance, reliability, manageability, and cost-efficiency.

- **The belief that our architecture can provide a better Developer Experience (DevX)**

  Features such as autoscaling, branching, time travel, and instant databases, backups, and restore improve the developer experience by allowing quick environment setup, efficient developer workflows, and immediate database availability.

These are Neon's reasons, but given the many _database-as-a-service_ options available today, let's take a look at the reasons why **you** should choose Neon:

## Neon is Postgres

**Postgres is the world's most popular open-source database.**

From its beginning as a [DARPA-sponsored project at Berkeley](https://www.postgresql.org/docs/current/history.html), Postgres has fostered an ever-growing community and is a preferred database among developers because of its performance, reliability, extensibility, and support for features like ACID transactions, advanced SQL, and NoSQL/JSON. Neon supports all of the latest Postgres versions and numerous [Postgres extensions](/docs/extensions/extensions-intro).

**If your application runs on Postgres, it runs on Neon**. If it doesn't run on Postgres, [sign up](https://console.neon.tech/signup) for a Free Plan account, join our [Discord server](https://discord.gg/92vNTzKDGp), and start the journey with us.

## Neon is serverless

**A serverless architecture built for performance, reliability, manageability, and cost efficiency**

Neon's [architecture](/docs/introduction/architecture-overview) separates compute from storage, which enables serverless features like [Autoscaling](/docs/get-started-with-neon/production-readiness#autoscaling) and [Autosuspend](/docs/get-started-with-neon/production-readiness##scale-to-zero).

Separating compute from storage refers to an architecture where the database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). This design contrasts with traditional architectures where compute and storage are tightly coupled on the same server. In Neon, Postgres runs on a compute, and data (except for what's cached in memory) resides on Neon's storage layer.

Separation of compute and storage enables scalability as these resources can be scaled independently. You can adjust for processing power or storage capacity as needed without affecting the other. This approach is also cost-efficient. The ability to scale resources independently means you can benefit from the lower cost of storage compared to compute or avoid paying for additional storage when you only require extra processing power. Decoupling compute and storage also improves availability and durability, as data remains accessible and safe even if a compute fails.

## Neon is fully managed

**Leave the database administrative, maintenance, and scaling burdens to us.**

Being a fully managed service means that Neon provides high availability without requiring users to handle administrative, maintenance, or scaling burdens associated with managing a database system. This approach allows developers to focus more on developing applications and less on the operational aspects of database management. Neon takes care of the complexities of scaling, backups, maintenance, and ensuring availability, enabling developers to manage their data without worrying about the underlying infrastructure.

## Neon is open source

**Neon is developed under an Apache 2.0 license.**

Neon is not the first to offer separation of storage and compute for Postgres. AWS Aurora is probably the most famous example; however, it is proprietary and tied to AWS’s internal infrastructure.

We believe we have an opportunity to define the standard for cloud Postgres. We carefully designed our storage, focusing on cloud independence, performance, manageability, DevX, and cost. We chose the most permissive open-source license, Apache 2.0, and invited the world to participate. You can already build and run your own self-hosted instance of Neon. Check out our [neon GitHub repository](https://github.com/neondatabase) and the [#self-hosted](https://discord.com/channels/1176467419317940276/1184894814769127464) channel on our Discord server.

## Neon doesn't lock you in

**As a true Postgres platform, there's no lock-in with Neon.**

Building on Neon is building on Postgres. If you are already running Postgres, getting started is easy. [Import your data](https://neon.tech/docs/import/import-intro) and [connect](https://neon.tech/docs/connect/connect-intro). Migrating from other databases like MySQL or MongoDB is just as easy.

If you need to move data, you won't have to tear apart your application to remove proprietary application layers. Neon is pro-ecosystem and pro-integration. We encourage you to build with the frameworks, platforms, and services that best fit your requirements. Neon works to enable that. Check out our ever-expanding collection of [framework](/docs/get-started-with-neon/frameworks), [language](/docs/get-started-with-neon/languages), and [integration](/docs/guides/integrations) guides.

## Who should use Neon?

**You. And we're ready to help you get started.**

Neon is designed for a wide range of users, from individual developers to enterprises, seeking modern, serverless Postgres capabilities. It caters to those who need a fully managed, scalable, and cost-effective database solution. Key users include:

- **Individual developers** looking for a fast and easy way to set up a Postgres database without the hassle of installation or configuration. Neon's Free Plan makes it easy to get started. [Free Plan](/docs/introduction/plans#free-plan) users get access to all regions and features like connection pooling, project sharing, and branching. When you are ready to scale, you can easily upgrade your account to a paid plan for more computing power, storage, and advanced features.

  <Admonition type="tip" title="Neon's Free Plan is here to stay">
  Neon's Free Plan is a fundamental part of our commitment to users. Our architecture, which separates storage and compute, enables a sustainable Free Plan. You can build your personal project or PoC with confidence, knowing that our Free Plan is here to stay. [Learn more about our Free Plan from Neon's CEO](https://twitter.com/nikitabase/status/1758639571414446415).
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
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname
```

Additionally, after signing up, we land you on your project dashboard, where you'll find connection snippets for various frameworks, languages, and platforms.

![Next.js connection snippet from the Connection details widget on the Neon Dashboard](/docs/get-started-with-neon/connection_snippet.png)

If you are not quite ready to hook up an application, you can explore Neon from the console. Create the `playing_with_neon` table using the Neon [SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor), run some queries, or create a database branch.

Initially, you'll be signed up for Neon's [Free Plan](/docs/introduction/plans#free-plan), but you can easily upgrade to one of our [paid plans](/docs/introduction/plans) when you're ready.

<CTA title="Are you ready?" description="After signing up, remember to join our active Discord community, where you'll find Neon users and team members ready to help." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
