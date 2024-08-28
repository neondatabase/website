---
title: 'Database per Tenant on Postgres'
subtitle: Scale to zero and instant provisioning via a comprehensive management API make DB-per-user architectures easy and cost-efficient on Neon.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

<UseCaseContext />

## Summary

Three features make database-per-user architectures on Neon possible to the extent that today, companies are able to manage fleets of hundreds of thousands of databases with a single engineer.

<DefinitionList>
Management API
: Use the API to provision new databases of any size, in any region, set up usage quotes, even pass through costs to end-users with detailed per-database metrics. [Neon API Reference](https://api-docs.neon.tech/reference/getting-started-with-neon-api)

Instant Provisioning
: P99 database provisioning time is less than 1 second.

Scale to Zero
: Idle databases scale compute to zero automatically, and instantly come back online when needed. This means you're not paying a fixed cost for every database you onboard.
</DefinitionList>

**The result:** Small teams can build flexible database-per-tenant architectures on Neon without operational burden or infra cost overhead.

<Testimonial
text="We’ve been able to automate virtually all database management tasks via the Neon API. We manage +300,000 projects with minimal engineering overhead"
author={{
  name: 'Himanshu Bandoth',
  company: 'Software Engineer at Retool',
}}
/>

## Why database-per-user?

One of the first design decisions you’ll face when building an application with Postgres is how to organize your multitenancy. For certain use cases, adopting a database-per-user approach is the most beneficial. Consider the following scenarios:

- **Offering a managed database to end users**: If you’re building a developer platform, low-code/no-code platform, or backend-as-a-service, you may want to provide each end user with a dedicated database, complete with a unique URL. This ensures that users have their own isolated database environment.
- **Meeting strict data privacy requirements**: If you’re operating a B2B SaaS platform with customers in regulated industries, they may require maximum data isolation at the instance level. A database-per-user approach allows you to meet these stringent data privacy demands by offering each customer their own isolated database.
- **Complying with regional data regulations**: In cases where data regulations require customer data to be stored within specific regions, creating separate databases in each region provides a straightforward path to compliance.

## Scaling database-per-user architectures in AWS RDS is not a good idea

Scaling database per tenant architectures in managed Postgres solutions (e.g. Amazon RDS) is hard. If you fit thousands of databases inside a single RDS instance, this instance becomes a single point of failure, and it gets slow and hard to maintain. If you try to manage thousands of small instances in AWS, you start needing a dedicated DevOps team to handle the logistics. Plus, costs skyrocket.

<Testimonial
text="Our customers require their data to live in an isolated database, but implementing this in RDS was cumbersome and expensive"
author={{
  name: 'Joey Teunissen',
  company: 'CTO at Opusflow',
}}
/>

## Why Neon is different

Neon is Postgres with serverless architecture. With rapid provisioning, scale-to-zero, and robust API support, you can scale database-per-user architectures without management overhead or big budgets. Just create one project per customer via the Neon API.

- **There’s no need to provision infrastructure in advance.** You can scale your architecture progressively, from a few tenants to hundreds of thousands, without breaking the bank.
- **Databases are ready in milliseconds via APIs.** An API call can create a project every time your end user needs a database, without causing delays.
- **You only pay for the instances that are running.** Thanks to scale-to-zero, creating instances doesn’t incur compute costs unless they’re actually in use.

## Neon for B2B SaaS: Data isolation with easy scalability

If you’re building a B2B SaaS platform, a database-per-tenant design can simplify your architecture while preserving scalability. With Neon, you can offer complete data privacy by [placing each tenant on its own project](https://neon.tech/docs/manage/overview), ensuring instance-level isolation. This approach also makes it easy to comply with data regulations across different regions, as projects can be created in specific locations to meet local requirements.

Additionally, each tenant can be scaled independently, optimizing both performance and costs while reducing operational risk. In the event of an issue, you can [run point-in-time recovery (PITR) for a specific tenant without impacting the entire fleet](https://neon.tech/docs/guides/branch-restore).

## Neon for dev platforms: Join Vercel, Replit, Koyeb, and others

If you’re building a developer platform, [you can start offering Neon databases to your users](https://neon.tech/partners) via our Partnership plans. Neon is a cost-effective solution to power hobby plans / free tiers, also supporting your Enterprise customers by scaling seamlessly with their usage. Companies like [Vercel](https://neon.tech/blog/neon-postgres-on-vercel), [Replit](https://neon.tech/blog/neon-replit-integration), and [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview) are already using Neon to offer Postgres to their end-users.

<Testimonial
text="Neon's serverless philosophy is aligned with our vision (no infrastructure to manage, no servers to provision, no database cluster to maintain) making them the obvious partner to power our serverless Postgres offering"
author={{
  name: 'Édouard Bonlieu',
  company: 'co-founder and CPO at Koyeb',
}}
/>

<div align="center">
[Estimate your costs: Compare vs RDS →](https://neon.tech/cost-fleets)
</div>

## Table Stakes

Differentiated features are great, but what about the basics... Does Neon meet the requirements for your use case?

### Compatibility

---

<DefinitionList bulletType="check">
It's Just Postgres
: Deploy Postgres 14, 15, 16 on Neon. There is no lock-in, no proprietary syntax to learn.

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

- **Self-Serve Autoscaling from zero to 10 CU**

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

<CTA text="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
