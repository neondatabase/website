---
title: 'One Postgres database per user'
subtitle: Neon allows you to manage thousands of Postgres databases without management or cost overhead. Provision databases in milliseconds and manage them effortlessly via APIs.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

<UseCaseContext />

## Summary

Database-per-user architectures were once associated with high costs and operational overhead. But today, companies like Retool use Neon to manage fleets of hundreds of thousands of databases with part of a single engineer's time. How? In short:

<DefinitionList>
Management API
: Create isolated environments with production-like copies of your data and schema for testing, development, and CI/CD workflows.

Instant Provisioning
: CPU, Memory, and Storage scale up and down to match your workload. No more paying for resources you dont need. Less stress about outages caused by hitting fixed resource limits.

Scale to Zero
: Never touch a `pg_hba.conf`, nowhere to SSH into, no manual configuration of retention policies. In Neon, operational work is either abstracted away or presented in an intuitive UI + API.
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

## Earning your trust

We know that your database is the most critical part of your stack. We also know that anyone can say _“We take uptime/data retention/security seriously”_ — instead of doing that, here’s a list of verifiable facts about Neon’s approach.

- **Uptime.** Neon operates databases by running a distributed system on high-reliability cloud providers, who guarantee instance SLAs of 99.99% ([AWS](https://aws.amazon.com/compute/sla/)) and 99.9% ([Azure](https://azure.microsoft.com/files/Features/Reliability/AzureResiliencyInfographic.pdf)).
- **Data-loss prevention.** Neon keeps 6 copies of your dataset: three copies across three availability zones, two in S3, and one in compute. Neon also retains every change to the database within your set retention window.
- **Security.** [Neon is SOC2 Type 2 compliant](https://neon.tech/docs/security/security-overview#soc-2-compliance), and [all inbound/outbound database connections must use SSL/TLS](https://neon.tech/docs/security/security-overview#data-at-rest-encryption).
- **Continuity of service.** Neon is not going anywhere: [we’ve raised $130.6mm in funding](https://techcrunch.com/2024/08/07/database-startup-neon-nabs-a-microsoft-investment/), we have [thousands of customers](https://neon.tech/case-studies), and [our tech is open source using the Apache 2.0 license](https://github.com/neondatabase/neon/blob/main/LICENSE).

<CTA text="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
