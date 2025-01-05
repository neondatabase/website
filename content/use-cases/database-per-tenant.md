---
title: 'Database per tenant at scale'
subtitle: Manage thousands of Postgres databases with minimal effort and costs.
enableTableOfContents: true
updatedOn: '2025-01-01T09:00:00.000Z'
image: '/images/social-previews/use-cases/db-per-tenant.jpg'
---

<Video
sources={[
{
src: "/videos/pages/doc/db-per-user.mp4",
type: "video/mp4",
},
{
src: "/videos/pages/doc/db-per-user.webm",
type: "video/webm",
}
]}
width={768}
height={432}
/>

A multi-tenant architecture enables multiple user groups (tenants) to share one application while keeping their data and access separate.

![Multi-tenant app](/use-cases/multitenant-application.jpg)

This architecture is typically implemented in one of two ways:

1. A single Postgres instance is shared by all tenants and foreign key constraints are used to enforce data isolation (e.g. having a `tenant_id`/`organization_id` column). This approach is the simplest and is recommended for most use cases.
2. Separate databases or schemas are used to enforce data isolation within a single Postgres instance.

This guide focuses on the _second_ approach - managing separate databases per tenant. We'll examine why you might need this strategy and discuss its potential challenges. More importantly, we'll introduce a streamlined architecture that leverages Neon to provision individual Postgres instances for each tenant, rather than managing multiple databases within a single Postgres instance.

<Admonition type="note">
A Postgres instance acts as a container that can hold many databases (each database is created with the `CREATE DATABASE <database_name>` command). When we mention "Postgres instance" in this guide, we're referring to this top-level container.
</Admonition>

## Why you might need separate databases per tenant

When tenants require stricter data isolation or if the platform you're building needs to support database provisioning, you might need to implement a database per tenant architecture. Some examples include:

- E-commerce platforms needing per-store databases
- AI agent platforms with individual agent memory/context stores ([Replit Agent](https://neon.tech/use-cases/ai-agents))
- Developer tools featuring built-in database provisioning ([Retool](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases))
- CMSs providing dedicated databases per website
- SaaS platforms with strict data isolation and compliance requirements
- CRM platforms with customer-specific databases
- Knowledge bases offering separate org-level document storage
- ERP platforms maintaining company-specific databases ([OpusFlow](https://neon.tech/blog/how-opusflow-achieves-tenant-isolation-in-postgres-without-managing-servers))

One approach is to deploy a large Postgres instance containing many databases.

![Multi-tenant Postgres instance for all tenants](/use-cases/multitenant-single-postgres-instance.jpg)

You'll maintain a mapping of tenant IDs to database names and build custom tooling for database management:

- Provisioning
- Backup/restore strategy
- Connection management/routing
- Resource monitoring
- User permissions and access controls

If you have data residency requirements, you'll likely need to duplicate your setup in more than one region. You'll notice that while this architecture is possible, it introduces a series of challenges once your tenant's usage grows.

## Challenges when doing a database per tenant in a shared Postgres instance

When you're managing multiple databases within a single Postgres instance, you'll encounter several challenges:

1. To maintain performance, you must overprovision resources, keeping utilization below 80% to accommodate customer growth. This also doesn't take into account the actual database usage patterns, so you're likely paying for more resources than you need.
2. Resource-intensive queries from one tenant can impact others sharing the instance.
3. In the event of technical issues, all tenants are impacted.
4. Scaling becomes complex, as upgrading to a larger instance requires manual tenant migration.

You'll notice that a lot of the issues arise from the fact that you're sharing a single Postgres instance across tenants who likely have different resource requirements.

Ideally, you'd have a dedicated Postgres instance for each tenant.

![Postgres instance per tenant](/use-cases/multitenant-postgres-instance-per-tenant.jpg)

This would allow each tenant's resources to scale independently and avoids problems where one tenant can impact the other. However, this approach typically introduces its own set of challenges around cost, operational complexity, and resource overhead.

Fortunately, Neon makes it possible to get all of the benefits of doing a Postgres instance per tenant architecture without the drawbacks.

<Testimonial
text="Our customers require their data to live in an isolated database, but implementing this in RDS was cumbersome and expensive"
author={{
  name: 'Joey Teunissen',
  company: 'CTO at Opusflow',
}}
/>

## How Neon enables a Postgres instance per tenant architecture

Neon offers fully managed Postgres with a serverless architecture built for performance, reliability, manageability, and cost efficiency. It supports features like instant provisioning, [autoscaling](/docs/get-started-with-neon/production-readiness#autoscaling), [scale to zero](/docs/get-started-with-neon/production-readiness#scale-to-zero), instant point-in-time restore, automatic storage archiving and more, making it ideal for managing thousands of Postgres instances.

### 1-second provisioning

A Postgres instance on Neon provisions in a second. You can try out how fast it is by clicking the button below, which will provision a real Postgres instance.

<DeployPostgres />

You'll notice that the instance provisioned in under a second (this excludes network latency and round-trip time). This means you can create a new Postgres instance for each tenant on-demand, without worrying about resource overhead or impacting the user experience.

### Autoscaling & scale-to-zero

Neon automatically scales compute resources up and down based on demand. You can set a minimum and a maximum compute size and resources will be dynamically allocated. No need to worry about overprovisioning or manual resizing.

When there are no incoming queries, Postgres on Neon can automatically scale to zero and suspend compute resources. This significantly reduces your compute costs, since you pay only for active time instead of 24/7 compute usage. Once your instance is queried again compute resources are ready in about ~500ms.

![Compute metrics graph](/docs/introduction/compute-usage-graph.jpg)

<Admonition type="note">
By default, Neon suspends compute resources after 5 minutes of inactivity. You can adjust this setting (or disable it completely) based on your application's requirements. Check out the [suspend compute](/docs/introduction/suspend-compute) documentation for more information.
</Admonition>

### Custom storage layer

Neon implements its own custom storage layer, which makes it possible to support features such as:

- Database branching:
- Instant point-in-time recovery:
- Automatic storage-level archiving:

While database branching is typically used as part of the software development lifecycle to provide a database for every environment (e.g. staging, testing, development, etc.), it's important to understand this feature since it's the foundation for instant point-in-time recovery and storage-level archiving.

#### Database branching and instant point-in-time recovery

Neon makes it possible to create copies of your data, known as branches. When a Postgres instance on Neon is provisioned, a root branch called `main` is created along with it.

![development environment branch](/docs/introduction/branching_dev_env.png)

Each branch has three key elements:

- A primary compute for read-write operations
- A default role
- A default database

To access a branch's database (where data will be stored), you must connect through that branch's compute. In the context of Neon, a compute runs Postgres.

```text
Postgres instance on Neon
    |
    └── Branch(es)
        |
        └── R/W compute
        |
        └── Role(s)
        |
        └── Database(s)
```

Neon retains a history of all changes made to your branch's database over time (writes, updates, deletes, etc.), allowing you to create a branch from a current or past state. Creating a branch is a near-instant operation, regardless of the size of your database. This is because a branch is a copy-on-write clone of your data.

This eliminates the need for complex backup and restore strategies and allows you to restore any of your tenant's data to a previous state when needed. Check out the [history retention](/docs/introduction/branching#history-retention) documentation for more information about configuring your history retention window.

#### Automatic storage-level archiving

Neon automatically archives branches that are older than 14 days and have not been accessed for the past 24 hours. These branches are [charged at a reduced per-GB rate](/pricing#storage-pricing), which minimizes storage costs.

Connecting to an archived branch, querying it, or performing some other action that accesses will automaticaly trigger the unarchive process. Branches with large amounts of data may experience slightly slower connection and query times while a branch is being unarchived.

## High-level implementation overview

For an in-depth overview of how to implement a Postgres instance per tenant architecture, check out the [integration guide](/docs/guides/implementing-a-postgres-instance-per-tenant-architecture).

### Managing Postgres instances

In Neon, a Postgres instance is referred to as a "Project". A Project contains many branches, each of which has its own compute and storage resources. A Neon Project also defines the region where project resources reside. You can create a new Project for each tenant, allowing you to manage thousands of Postgres instances with minimal effort.

```text
Account/Organization
    |
    └── Project(s)
        |
        └── Branch(es)
            |
            └── R/W compute
            |
            └── Read replica(s)
            |
            └── Role(s)
            |
            └── Database(s)
```

Each Project has a unique ID, which is used to identify the project in the [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api). You will need to map this ID to your tenant's ID in your database.

There are [several SDKs available for use with Neon](https://api-docs.neon.tech/reference/getting-started-with-neon-api), all of which are wrappers around the Neon API, providing methods to programmatically manage Neon projects, branches, databases, endpoints, roles, and more.

We recommend creating a dedicated Neon account for managing your tenants' projects. For staging and development environments, you can create a separate Neon account. This ensures that your production data is isolated from your development and staging environments.

<Testimonial
text="We’ve been able to automate virtually all database management tasks via the Neon API. We manage +300,000 projects with minimal engineering overhead"
author={{
  name: 'Himanshu Bandoth',
  company: 'Software Engineer at Retool',
}}
/>

### Billing and monitoring APIs

The Neon API lets you configure limits and monitor usage, enabling billing features, such as:

- **Usage limits**: Define limits on consumption metrics like **storage**, **compute time**, and **data transfer**.
- **Pricing Plans**: Create different pricing plans for your platform or service. For example, you can set limits on consumption metrics to define your own Free, Pro, and Enterprise plans:

  - **storage**: Define maximum allowed storage for each plan.
  - **compute time**: Cap CPU usage based on the plan your customers choose.
  - **data transfer**: Set limits for data transfer (egress) on each usage plan.

<Admonition type="tip" title="partner example">
For an example of how a Neon partner defined usage limits based on _database instance types_, see [Koyeb Database Instance Types](https://www.koyeb.com/docs/databases#database-instance-types). You will see limits defined on compute size, compute time, stored data, written data, and egress.
</Admonition>

As your users upgrade or change their plans, you can dynamically modify their limits using the Neon API. This allows for real-time updates without affecting database uptime or user experience.

To learn more about setting limits, see [Configure consumption limits](#/docs/guides/partner-consumption-limits).

Neon also provides a range of consumption APIs, which let you query a range of account and project-level metrics to monitor usage. Here are the different endpoints to retrieve these metrics, depending on how you want them aggregated or broken down:

| Endpoint                                                                                                 | Description                                                                                                              | Plan Availability            |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| [Account-level cumulative metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperaccount) | Aggregates all metrics from all projects in an account into a single cumulative number for each metric                   | Scale and Business plan only |
| [Granular project-level metrics](https://api-docs.neon.tech/reference/getconsumptionhistoryperproject)   | Provides detailed metrics for each project in an account at a specified granularity level (e.g., hourly, daily, monthly) | Scale and Business plan only |
| [Single project metrics](https://api-docs.neon.tech/reference/getproject)                                | Retrieves detailed metrics and quota information for a specific project                                                  | All plans                    |

For example, you can:

- Query the total usage across all projects, providing a comprehensive view of usage for the billing period or a specific time range spanning multiple billing periods.
- Get daily, hourly, or monthly metrics across a selected time period, broken out for each individual project.
- Get usage metrics for individual projects.

To learn how, see [Querying consumption metrics with the API](/docs/guides/partner-consumption-metrics).

<Testimonial
text="Neon's serverless philosophy is aligned with our vision (no infrastructure to manage, no servers to provision, no database cluster to maintain) making them the obvious partner to power our serverless Postgres offering"
author={{
  name: 'Édouard Bonlieu',
  company: 'co-founder and CPO at Koyeb',
}}
/>

## How much does it cost?

<PostgresForPlatformsCalculator />

## How it all works under the hood

In contrast to traditional Postgres architectures where compute (CPU and RAM) and storage (disk) are on the same server, Neon's architecture decouples compute from storage.

The database computation processes (queries, transactions, etc.) are handled by one set of resources (compute), while the data itself is stored on a separate set of resources (storage). In Neon, Postgres runs on a compute, and data (except for what's cached in memory) resides on Neon's storage layer.

This architecture enables Neon to offer features that are simply not possible with traditional Postgres architectures.

![Neon architecture diagram](/docs/introduction/neon_architecture_5.jpg)

You can learn more about Neon's architecture in the [Neon Architecture](/docs/introduction/architecture) overview.

## Conclusion

Managing separate databases per tenant within a Postgres instance can be complex and costly, especially as your tenant base grows. Neon simplifies this process by enabling you to provision individual Postgres instances for each tenant, without the overhead of managing multiple databases within a single Postgres instance.

Each Postgres instance on Neon supports the following features:

- Instant provisioning
- Autoscaling
- Scale-to-zero
- Instant point-in-time recovery
- Automatic storage archiving

This architecture allows you to manage thousands of Postgres instances with minimal effort and costs, making it ideal for SaaS platforms, developer tools, and other applications requiring strict data isolation and compliance.

If you're interested in learning more about how Neon can help you manage thousands of Postgres databases, feel free to reach out on the Neon Discord or share your email below.

<SubscriptionForm title="Need to provision thousands of databases? Let’s talk!" description="We’re working closely with design partners to make Neon even better for agents, in exchange for discounts and other services. Let’s work together and make your AI project a success." />
