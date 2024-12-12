---
title: Neon for SaaS apps
subtitle: Build SaaS apps faster on Neon with autoscaling, database branching, and the serverless operating model
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

Teams are accelerating development workflows and reducing operational overhead with Neon’s database branching, autoscaling, and serverless operating model. Learn how you can do the same.

## Summary

There are three key features that are helping teams develop SaaS applications faster and more efficiently with Postgres on Neon:

<DefinitionList bulletType="check">
Database Branching
: Create isolated environments with production-like copies of your data and schema for testing, development, and CI/CD workflows.

Autoscaling
: CPU, memory, and storage automatically scale up or down to match your workload. Avoid paying for unused resources.

Neon's Serverless Operating Model
: Skip managing `pg_hba.conf` files or SSH access. Neon simplifies operational tasks with an intuitive UI and API.
</DefinitionList>

## Key features

---

### Database branching

![Database Branching](/use-cases/branching.jpg?branching)

A branch in Neon is a copy-on-write clone of your database, including both schema and data. Branches function like Git branches, enabling development, testing, and preview environments.

- **Instant branch creation**: Independent of database size, with no duplicated storage.
- **Cost-efficient branches**: One customer with a team of five developers handles all dev, test, and preview work through branches, spending ~$150/month.
- **Idle branch computes scale to zero**: Further reducing costs.

How branches boost development velocity:

<DefinitionList bulletType="check">
Onboard faster and keep in sync
: You can give each developer their own branch for local development. Developers can use [branch reset](/docs/introduction/point-in-time-restore) to instantly restore and sync with the latest changes.

Accelerate feature development and code reviews
: Automate branch creation for each Git branch or pull request. Use tools like GitHub Actions or Neon's integrations:
: - [Neon GitHub Integration](/docs/guides/neon-github-integration): Easily create a branch for every PR.
: - [Neon Vercel Integration](/docs/guides/vercel): Create and integrate a branch into every Vercel preview deployment.

Enhance testing and CI/CD
: Run test suites on exact copies of your production database using branches. Save time with instant branch creation, shaving minutes off every test run.
</DefinitionList>

---

### Autoscaling

![Neon Autoscaling](/use-cases/autoscaling.jpg)

Neon's autoscaling dynamically adjusts compute resources based on current load, removing the need for manual intervention.

For teams building SaaS on Neon, autoscaling offers several benefits:

<DefinitionList bulletType="check">
Performance and cost-efficiency
: Get performance without over-provisioning. On average, [60% of database costs come from unused resources.](https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20)

No manual resizing
: Unlike other platforms that limit resizing, require downtime, or only allow scaling up, Neon automates scaling both up and down instantly.

Minimized outage risk
: Setting a high autoscaling limit helps prevent database downtime during unexpected traffic surges.
</DefinitionList>


---

### Serverless operating model

Neon abstracts away the concept of servers so that customers can focus on building their SaaS application, not managing their database:

- **No server management**: You don’t need to provision, maintain, administer servers.
- **Managed infrastructure**: Neon handles all underlying infrastructure, including security patches, load balancing, and capacity planning.
- **Built-in availability and fault tolerance**: Neon is designed to minimize customer-facing impact in event of hardware failure.
- **Focus on business logic**: You can concentrate on writing code for your application's core functionality rather than dealing with infrastructure concerns.

---

## Database-per-user architectures

If your SaaS project could benefit from multitenancy, Neon makes it simple to create a dedicated database for each user:

- **No pre-provisioning**: In Neon, there’s no need to provision infrastructure in advance. You can scale your architecture progressively, from a few tenants to thousands, without breaking the bank.
- **Cost efficiency**: You only pay for the Neon instances that are actively running. Thanks to scale-to-zero, creating instances doesn’t incur compute costs unless they’re actually in use.
- **Instant deployment**: Neon databases are created in milliseconds via APIs. An API call can spin up a new project whenever your end-user needs a database, without slowing things down.

[More info on Database per Tenant](/docs/use-cases/database-per-user)

## Table stakes

Differentiated features are great, but what about the basics... Does Neon meet the requirements for your use case?

### Compatibility

---

<DefinitionList bulletType="check">
It's Just Postgres
: Deploy Postgres 14, 15, 16, and 17 on Neon. There is no lock-in, no proprietary syntax to learn.

Integrates with any language/framework
: Anything that has a Postgres driver or integration works with Neon.

70+ Postgres extensions
: `pgvector`, `postGIS`, `timescaledb` and [many other popular Postgres extensions](/docs/extensions/pg-extensions) are supported on Neon

Logical Replication
: Inbound (Neon as subscriber) and outbound (Neon as publisher) logical replication are supported.

Serverless (HTTP) Driver
: Unlock access from serverless environments like AWS Lambda and Cloudflare Workers with the [Neon serverless driver](/docs/serverless/serverless-driver). It uses an HTTP API to query from edge/serverless with lower latency.
</DefinitionList>

### Performance and scale

---

- **Similar Latency Characteristics to RDS Postgres**

  Prisma recently published <a href="https://benchmarks.prisma.io/?dbprovider=pg-rds" target="_blank">performance benchmarks</a> showing similar latency between AWS RDS and Neon.

- **Self-Serve Autoscaling from zero to 10 CU**

  Configure Neon to autoscale up to 10 CPU, 40GB RAM. [Contact our team](/contact-sales) to unlock larger computes.

- **Storage up to 2TB**

  Storage scales seamlessly based on usage. [Contact our team](/contact-sales) for custom rates on 2tb+ storage.

- **Instant Read Replicas**
  Read replicas on Neon are faster to create, and only add compute (not storage) making them a cost efficient means of separating workloads.

### Security and compliance

---

<DefinitionList >

IP Allow List
: Scale and Business Plan accounts can lock down database access to specific IP addresses or ranges.

SOC 2 Type 2 Compliant
: Neon has been SOC 2 Type 2 Compliant since Dec 2, 2023. View full compliance details in the [Trust Center](https://trust.neon.tech/).

HIPAA compliance in-progress
: Neon is actively pursuing attaining HIPAA compliance. [Contact our team](/contact-sales) to get notified of updates.

</DefinitionList>

### Cost

---

<DefinitionList bulletType="check">
Usage-Based Billing
: Paid plans start at $19 for an allotment of Compute and Storage resources, and scale up predictably as your workload grows.

Pay via AWS Marketplace
: If your business is already active on AWS, you may be able to save hassle and budgets by [paying for Neon via AWS Marketplace](https://neon.tech/docs/introduction/billing-aws-marketplace).

Pay via Azure Marketplace
: If your business runs on Azure, Neon is available as a [native Azure integration](/docs/introduction/billing-azure-marketplace), with billing through Azure.

</DefinitionList>

<CTA title="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
