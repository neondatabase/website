---
title: Move Fast and “Branch” Things
description: Neon is the most productive way for builders to use Postgres.
excerpt: >-
  Neon simplifies the use of scalable Postgres, changing how you handle your
  database infrastructure from development through production. This is a
  fundamental shift in how to leverage your Postgres infrastructure. Instead of
  spending time on Infrastructure as code (IaC) and cloud-...
date: '2024-04-15T16:38:10'
updatedOn: '2024-04-16T13:47:05'
category: community
categories:
  - community
authors:
  - stephen-siegert
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/move-fast-and-branch-things/cover.png
  alt: null
isFeatured: false
seo:
  title: Move Fast and “Branch” Things - Neon
  description: Neon is the most productive way for builders to use Postgres.
  keywords: []
  noindex: false
  ogTitle: Move Fast and “Branch” Things - Neon
  ogDescription: >-
    Neon simplifies the use of scalable Postgres, changing how you handle your
    database infrastructure from development through production. This is a
    fundamental shift in how to leverage your Postgres infrastructure. Instead
    of spending time on Infrastructure as code (IaC) and cloud-specific
    configuration tasks in services like Amazon RDS or Google Cloud SQL, with
    Neon you […]
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/move-fast-and-branch-things/social.png
source:
  wpId: 5684
  wpSlug: move-fast-and-branch-things
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/move-fast-and-branch-things/image-28-1024x576-4f1aa171.png)

Neon simplifies the use of [scalable Postgres](https://neon.tech/blog/neon-ga), changing how you handle your database infrastructure from development through production. This is a fundamental shift in how to leverage your Postgres infrastructure. Instead of spending time on Infrastructure as code (IaC) and cloud-specific configuration tasks in services like Amazon RDS or Google Cloud SQL, with Neon you can increase developer velocity and focus on building for your customer.

When making architecture decisions for any app, it is always important to consider the constraints of your system and under what circumstances those constraints and requirements apply, both during periods of low request traffic and during high-traffic bursts. Neon maintains Postgres compatibility while enhancing the developer experience with database branching, autoscaling, and serverless scale to zero – enabling _you_ to launch and scale your projects quickly.

Neon is the most productive way for builders to use Postgres.

## Minimizing Total Cost of Ownership (TCO) in Database Infrastructure

A traditional vendor database setup requires a complex architecture involving virtual private clouds (VPCs), subnet configurations, and manual replication configurations across availability zones. Another aspect of this setup is managing access, typically done through a bastion host or a jump box, which serves as a gateway for updates or connections to the data source.

Implementing features like High Availability (HA) and autoscaling in these environments further complicates the architecture. For example, this is a subset of considerations to take into account when provisioning an RDS instance in AWS:

- **Complex Setup and Maintenance**: Configuring an instance requires attention to numerous settings, making the setup and ongoing maintenance a complex task.
- **Scaling Challenges**: Properly scaling an instance to match fluctuating applications requires understanding of workload patterns, optimized instance types, and auto-scaling policies.
- **High Availability**: Ensuring continuous availability requires additional setup and planning.
- **Cost Management**: Deciding instance types, storage, and backup options to balance performance and total expense.
- **Security Management and Networking**: Correctly configuring VPCs, security groups, and Identity and Access Management (IAM) roles.
- **Backup and Recovery**: Configuring and managing backups.

Additionally, these architectures lack the advantages of a truly serverless architecture that can scale to zero, increasing cost, complexity, and resource demands. This complexity results in a significant investment of time, both initially and for ongoing maintenance, introducing a steep learning curve.

All of this is needed _before_ even using the database.

These factors combined contribute to a higher total cost of ownership, especially when considering how such an architecture integrates with the broader ecosystem of your application.

### Want scale to zero serverless?

Neon is [scale-to-zero Postgres](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero). No changes are needed. Your compute scales down (to idle) when not in use and scales up in capacity to handle increased requests and manage capacity. This also results in cost savings for production-like environments. Your environments can be exact copies of each other in `dev`/`test`/`prod` but _not incur additional costs_ when not in use or receiving traffic. Additional services, proxies, or cloud event logging aren’t needed. Enough said.

True serverless architecture can significantly transform the way a managed Postgres platform is utilized. This transition can improve developer productivity by allowing them to concentrate on creating value, while also enhancing the scalability and availability of applications. This leads to quicker development cycles and increased reliability of the applications.

### Need connection pooling?

Without Neon that is a separate configuration, piece of infrastructure to manage, and service fee. With Neon, it’s included. [Neon supports connection pooling using PgBouncer](https://neon.tech/blog/pgbouncer-the-one-with-prepared-statements#what-is-pgbouncer), which allows your database on Neon to support up to 10,000 concurrent connections.

### Want your database to autoscale?

Neon dynamically adjusts the amount of compute resources allocated to a Neon compute endpoint in response to the current load, eliminating the need for manual intervention. This is autoscaling-on-the-fly.

Without Neon, you’re faced with either managing the autoscaling yourself by monitoring and adjusting instance types and policies with RDS, or settling for [increased cold starts and lack of scale to zero with Aurora](https://neon.tech/blog/aurora-serverless-v1-to-neon) (20-60s on Aurora V1). Even with Aurora V2 and RDS, you’ll likely need to use connection pooling (above). This means you might have to set up Amazon RDS Proxy or run PgBouncer on a separate Amazon Elastic Compute Cloud (Amazon EC2) instance to manage your database connections.

## Move fast and “branch” things

Neon’s database branching enables you to clone databases in **~1 second**. Until you’ve experienced Neon Postgres Branching – you don’t know what you’re missing. A branch is a [copy-on-write](https://neon.tech/docs/reference/glossary#copy-on-write) clone of your data, making it possible to perform operations on branches independently without impacting the original data. This is a different way to think about the database. Instead of just a piece of infrastructure – Neon is like Git for Postgres. With that in mind, you start to envision different ways to use the database to accelerate your workflow, not just ways to manage the database.

Interacting with your Postgres database in a similar way to using git unlocks workflows for teams, feature dev, and test environments have for a long time been an operational burden – and has been a task reserved for DevOps teams.

It’s possible to create a Postgres database branch with **one** CLI command:

```bash
neonctl branches create --name <branch-name>
```

_This is not possible with other Postgres vendors_.

In seconds, you can branch your entire database as shown in the video below:

<video autoPlay muted controls width="1920" height="1080">
<source src="https://cdn.neonapi.io/public/videos/pages/blog/move-fast-and-branch-things/create-branch-8ddab1bd.mp4" />
</video>

Neon’s [separation of storage and compute](https://neon.tech/blog/architecture-decisions-in-neon) makes this possible – allowing for flexible and independent scaling of each. For comparison, to isolate development/test/production database environments in a traditional cloud environment, each of these environments would require the provisioning of a separate database cluster or database within a cluster for isolation. It’s not possible to branch your Postgres database in this manner with other vendors.

To isolate a new Postgres database in Amazon RDS or Aurora Postgres, the only option is to create a new instance or replicate an existing one. This task, while ultimately not providing the equivalent outcome, is significantly more complex and time-consuming. Creating a new RDS Postgres instance takes **~5 minutes**. This also does not account for the role and policy IAM updates, new infra, and additional storage costs for the copy.

Neon branching empowers developers to take a more iterative and experimental development approach, allowing for rapid prototyping and testing without risk to the production environment, accelerating development feedback loops and innovation.

Branching is easy, cost-effective, and fast.

<YoutubeIframe embedId="j4Vak4J10KU" isDocPost={false} />

Neon branches create an entire copy of your Postgres Cluster. Branches can then be used to isolate tests, analyses, and new feature launches without compromising the integrity of the main branch. Because of this, it’s even easier to perform data recovery or roll back to a previous version of the database. By restoring a specific branch, developers can recover data efficiently, a task that is more time-consuming with traditional vendor solutions. This adds an extra layer of security and flexibility, enabling teams to manage their data with greater agility and minimizes the potential for data loss.

Neon branches collapse the timeline from hours, days, or weeks into seconds.

## Developer Workflow Integration

With just a connection string, Neon enables developers to take full advantage of Postgres. This puts the database in the hands of the developer without sacrificing the scalability, reliability, and performance of a production-grade developer experience. Your existing Postgres workflow and toolset works with Neon since Neon is Postgres. This includes Integrated Development Environments (IDEs) and framework integrations like Django, Rails, Node.js, etc. These will all work without the use of cloud vendor-specific SDKs (and dependencies).

Additionally, developers can manage and connect to Neon using open-source tools: the [Neon CLI](https://neon.tech/docs/reference/neon-cli) for direct command-line interaction, the [Neon API](https://neon.tech/docs/reference/api-reference) for programmatic access and integration, and the [Neon Serverless Driver](https://github.com/neondatabase/serverless), which works within serverless architectures and runtimes.

### Neon Command Line Interface (CLI)

The integration of the Neon CLI with development tools and CI/CD pipelines enhances developer workflows, reducing the friction associated with database-related operations like creating projects, new databases, and branches. Once you have your connection string, you can manage your entire Neon database. This makes it possible to quickly set up [deployment pipelines such as GitHub Actions,](https://neon.tech/docs/guides/branching-github-actions) GitLab CI/CD, or Vercel Preview Environments. These operations and pipelines can also be treated as code and live alongside your applications as they evolve and mature.

This integration translates to quicker deployments, easier rollback processes, and a more robust deployment experience, all contributing to increased developer velocity. Or, these operations can be made using the Neon API across different languages and frameworks.

Below is a video to demonstrate how to restore a Neon Postgres database in just a few seconds:

<YoutubeIframe embedId="ZnxLCOkb_R0" start={1} isDocPost={false} />

### Connect from Serverless Environments

The Neon Serverless Driver for JavaScript and TypeScript is a [low-latency Postgres driver for JavaScript and TypeScript](https://neon.tech/blog/http-vs-websockets-for-postgres-queries-at-the-edge) that allows you to query data from serverless and edge environments over HTTP or WebSockets where direct access to TCP is restricted.

This can be used in [serverless environments like AWS Lambda](https://neon.tech/blog/serverless-api-using-aws-lambda-cdk-and-neon), Cloudflare Workers, and Vercel Edge functions. With a few lines of code, you can connect to and query your database the same way that you would in a backend persistent server instance.

```typescript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
...

const [post] = await sql`SELECT * FROM posts WHERE id = ${postId}`
```

This keeps the programming model consistent – developers can use Neon the same way that they would normally use Postgres but with an enhanced and flexible experience.

## Postgres as a Developer Tool

With the movement away from Postgres as just a piece of infrastructure, developers can (and should) view Neon Postgres as an instrumental tool to enhance the scalability and functionality of their applications and workloads. Two examples are in Generative AI and Software as a Service (SaaS) applications.

### Leveraging AI in your application

Use Neon Postgres with the [pgvector extension](https://neon.tech/blog/pgvector-30x-faster-index-build-for-your-vector-embeddings) as the way to store vector embeddings and enhance your models using Retrieval Augmented Generation (RAG) with vector search.

Neon can scale up on-demand to build your index and scale back down to save on cost. This on-demand scaling can lead to cost savings compared to traditional, always-on database instances that are overprovisioned to accommodate peak usage periods.

### Building SaaS platforms

The streamlined experience of using Neon to use Postgres makes it even more possible to build Software as a service (SaaS) platforms that have requirements to [rapidly provision Postgres](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases) and even isolate those instances across tenants using database branching. With traditional cloud vendors, this is costly and operationally intense – in terms of provisioning time, maintenance, and cost.

Neon helps to unblock these use cases and empower SaaS builders to take full advantage of Postgres on a per customer or tenant basis. Effectively allowing SaaS businesses to provide their Platform as a Service (PaaS).

## Conclusion

Neon abstracts away the complexities traditionally associated with database management—such as infrastructure setup, connection pooling, and autoscaling—Neon allows developers and builders to concentrate on what they do best: building innovative and scalable web applications…fast.

To get started with Serverless Postgres, sign up and [try Neon for free](https://console.neon.tech/signup). Follow us on [Twitter/X](https://twitter.com/neondatabase), join us on [Discord](https://neon.tech/discord), and let us know how we can help you build the next generation of applications.
