---
title: 'Postgres for SaaS'
subtitle: Teams build SaaS faster on Neon with autoscaling, database branching and the serverless operating model.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
image: '/images/social-previews/use-cases/postgres-for-saas.jpg'
---

<UseCaseContext />

## Summary

Three features make Postgres on Neon a solid foundation for teams building SaaS applications:

<DefinitionList bulletType="check">
Database Branching
: Create isolated environments with production-like copies of your data and schema for testing, development, and CI/CD workflows.

Autoscaling
: CPU, Memory, and Storage scale up and down to match your workload. No more paying for resources you dont need.

Serverless Operating Model
: Never touch a `pg_hba.conf`, or SSH into anywhere. In Neon, operational work is either abstracted away or presented in an intuitive UI + API.
</DefinitionList>

**The result:**
Teams ship faster, more efficiently, with less risk of outage during times that matter most.

<Testimonial
text="In GCP, we had to constantly think about provisioning new instances and migrating data, which added operational overhead. With Neon, we can start small and scale up. We don’t have to think about some level of operational stuff. That’s awesome."
author={{
  name: 'Paul Dlug',
  company: 'CTO of Comigo.ai',
}}
/>

## Key Features

---

### Database Branching

![Database Branching](/use-cases/branching.jpg)

A branch in Neon is a copy-on-write clone of your database. Branches include both schema and data. Teams use them like git branches, for development, testing, and preview environments.

- **Branch Creation is instant** - Independent of DB size. Storage is not duplicated for each branch.
- **Branches are cost-efficient** - One customer has a team of five developers running all dev/test/preview work through branches and pays ~$150/month.
- **Branch compute can scale to zero when idle** - to further reduce cost.

How branches can be used to increase development velocity:
<DefinitionList bulletType="check">
Onboard Faster, Keep Collaboration in Sync
: Give each developer on your team their own branch for local development. They can use [branch reset](/docs/introduction/point-in-time-restore) to instantly restore and catch up with the latest changes.

Faster feature Development and code review
: Use automation to give each git branch or Pull Request a corresponding database branch. This can be done with automation tools like GitHub Actions, or more easily as part of an integration:
: - [Neon GitHub integration](/docs/guides/neon-github-integration) - An easier way to create a branch for every PR.
: - [Neon Vercel Integration](/docs/guides/vercel) - Create and integrate a branch into every Vercel Preview deployment.

Better Testing and CI/CD
: Deploy confidently by using branches to run your test suite on an exact copy of your production database. Shave minutes off every test run with instant branch creation.

</DefinitionList>

---

### Autoscaling

![Neon Autoscaling](/use-cases/autoscaling.jpg)

Neon's Autoscaling feature dynamically adjusts the amount of compute resources allocated to a Neon compute in response to the current load, eliminating the need for manual intervention.

For team's building SaaS on Neon, autoscaling has a few benefits:

<DefinitionList bulletType="check">
Performance and Cost-Efficiency
: Get performance without over-provisioning. In a typical compute bill, [60% of costs go towards unused resources.](https://medium.com/@carlotasotos/database-economics-an-amazon-rds-reflection-5d7a35638b20)

No manual resizes
: Other platforms let you size up but not down, require downtime for resizes, or limit the frequency of resizes. On Neon everything is automated and instant.

Reduce chance of database outages
: Setting a high autoscaling limit reduces the chance of having your database go down from an unexpected surge of activity.
</DefinitionList>

---

### Serverless Operating Model

Neon abstracts away the concept of servers so that customers can focus on building their SaaS application, not managing their database:

- No server management: You don’t need to provision, maintain, administer servers.
- Managed infrastructure: Neon handles all underlying infrastructure, including security patches, load balancing, and capacity planning.
- Built-in availability and fault tolerance: Neon is designed to minimize customer-facing impact in event of hardware failure.
- Focus on business logic: You can concentrate on writing code for your application's core functionality rather than dealing with infrastructure concerns.

---

## Database-per-Tenant Architectures

If your SaaS project could benefit from multitenancy, Neon makes it simple to create a dedicated database for each user:

- **No pre-provisioning**: In Neon, there’s no need to provision infrastructure in advance. You can scale your architecture progressively, from a few tenants to thousands, without breaking the bank.
- **Cost efficiency**: You only pay for the Neon instances that are actively running. Thanks to scale-to-zero, creating instances doesn’t incur compute costs unless they’re actually in use.
- **Instant deployment**: Neon databases are created in milliseconds via APIs. An API call can spin up a new project whenever your end-user needs a database, without slowing things down.

[More info on Database per Tenant](/use-cases/database-per-tenant)

<Testimonial
text="The ability to spawn databases that can scale down to zero is incredibly helpful and a model fits well with our one database per customer architecture"
author={{
  name: 'Guido Marucci',
  company: 'co-founder at Cedalio',
}}
/>

## Table Stakes

Differentiated features are great, but what about the basics... Does Neon meet the requirements for your use case?

### Compatibility

---

<DefinitionList bulletType="check">
It's Just Postgres
: Deploy Postgres 14, 15, 16, and 17 on Neon. There is no lock-in and no proprietary syntax to learn.

Integrates with any language/framework
: Anything that has a Postgres driver or integration works with Neon.

70+ Postgres extensions
: `pgvector`, `postGIS`, `timescaledb` and [66 other extensions](/docs/extensions/pg-extensions) are supported on Neon

Logical Replication
: Inbound (Neon as subscriber) and outbound (Neon as publisher) logical replication supported.

Serverless (HTTP) Driver
: Unlock access from serverless environments like AWS Lambda and Cloudflare Workers with the Neon serverless driver. It uses an HTTP API to query from edge/serverless with lower latency.
</DefinitionList>

### Performance and Scale

---

- **Similar Latency Characteristics to RDS Postgres**

  Prisma recently published <a href="https://benchmarks.prisma.io/?dbprovider=pg-rds" target="_blank">performance benchmarks</a> showing similar latency between AWS RDS and Neon.

- **Self-Serve Autoscaling from zero to 16 CU**

  Configure Neon to autoscale up to 10 CPU, 40GB RAM. [Contact our team](/contact-sales) to unlock larger computes.

- **Storage up to 2TB**

  Storage scales seamlessly based on usage. [Contact our team](/contact-sales) for custom rates on 2tb+ storage.

- **Instant Read Replicas**
  Read replicas on Neon are faster to create, and only add compute (not storage) making them a cost efficient means of separating workloads.

### Security and Compliance

---

<DefinitionList >

IP Allow List
: Scale Plan accounts can lock down database access to specific IP addresses or ranges.

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
: If your business is already active on AWS, you may be able to save hassle and budgets by paying for Neon via AWS Marketplace.

</DefinitionList>

<CTA title="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
