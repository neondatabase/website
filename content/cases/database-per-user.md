---
title: 'One Postgres database per user'
subtitle: Neon allows you to manage thousands of Postgres databases without management or cost overhead. Provision databases in milliseconds and manage them effortlessly via APIs.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

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

<Testimonial
text="We’ve been able to automate virtually all database management tasks via the Neon API. We manage +300,000 projects with minimal engineering overhead"
author={{
  name: 'Himanshu Bandoth',
  company: 'Software Engineer at Retool',
}}
/>

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

## Additional Resources

- [Serverless Postgres Public Preview](https://www.koyeb.com/blog/serverless-postgres-public-preview)
- [Neon for platforms](https://neon.tech/cost-fleets)
- [Scalable Database-per-Tenant in Postgres - Neon Tech Talk](https://www.youtube.com/watch?v=R0-o4TDcb84)
- [Why You Want a Database That Scales to Zero](https://neon.tech/blog/why-you-want-a-database-that-scales-to-zero)
- [Create Up to 1000 Neon Projects Without Extra Cost](https://neon.tech/blog/create-up-to-1000-neon-projects-without-extra-cost)
- [From Days to Minutes: How Neo.Tax Accelerated Their Development Lifecycle](https://neon.tech/blog/from-days-to-minutes-how-neo-tax-accelerated-their-development-lifecycle)
- [How Cedalio Uses Neon for an Efficient Development Workflow](https://neon.tech/blog/how-cedalio-uses-neon-for-an-efficient-development-workflow)
- [Move Fast and Branch Things](https://neon.tech/blog/move-fast-and-branch-things)
- [Point-in-Time Recovery in Postgres](https://neon.tech/blog/point-in-time-recovery-in-postgres)
- [Scaling Database-per-Tenant Architectures: Comparing Costs in RDS and Neon](https://medium.com/@carlotasotos/scaling-database-per-tenant-architectures-comparing-costs-in-rds-and-neon-abc8c55210e5)

<CTA text="Have any questions or need more&nbsp;information?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
