---
title: 'Database Per User at Scale'
subtitle: Manage thousands of Postgres databases with minimal effort and costs.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
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

<Admonition type="note" title="TL;DR">
Companies are managing fleets of thousands of Neon databases with very small teams and budgets. This is why:

1. **API-first**: Devs can provision databases, set usage quotas, and manage costs with ease through Neon's API.
2. **Instant provisioning**: Databases are ready in under a second.
3. **Autoscaling w/ scale-to-zero**: Neon databases pause automatically to eliminate fixed costs, and CPU/memory scale up and down automatically per-customer.

In Neon, **1 tenant = 1 project**. Our $69 /month pricing plan includes 1,000 projects — [sign up](https://console.neon.tech/signup) and [follow this guide](https://neon.tech/docs/use-cases/database-per-user) to get started.
</Admonition>

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

## Scaling database-per-user architectures in AWS is not a good idea

Scaling database per tenant architectures in managed Postgres solutions (e.g. Amazon RDS) is hard. If you fit thousands of databases inside a single RDS instance, this instance becomes a single point of failure, and it gets slow and hard to maintain. If you try to manage thousands of small instances in AWS, you start needing a dedicated DevOps team to handle the logistics. Plus, costs skyrocket.

<Testimonial
text="Our customers require their data to live in an isolated database, but implementing this in RDS was cumbersome and expensive"
author={{
  name: 'Joey Teunissen',
  company: 'CTO at Opusflow',
}}
/>

## Database-per-user in Neon

Neon is Postgres with serverless architecture. With rapid provisioning, scale-to-zero, and robust API support, you can scale database-per-user architectures without management overhead or big budgets. Just create **one project per customer** via the Neon API.

![Database-per-user](/use-cases/database-per-user.jpg)

### One project per customer

A Neon project is the logical equivalent of an "instance" but without the management heaviness:

- By creating one project per customer, each customer's data will be completely isolated.
- You'll be able to run independent PITRs without affecting your entire fleet.
- You can create different projects in different regions to match your customers' locations.

Management is simplified vs other Postgres services because,

- There’s no need to provision infrastructure in advance.
- You can scale your architecture progressively, from a few tenants to hundreds of thousands, without breaking the bank — our pricing plans include a generous number of projects within the monthly fee.
- New projects are ready in milliseconds, and you can manage everything programmatically via the API.
- You only pay for the projects that are active thanks to scale-to-zero.

<Admonition type="note" title="Tip">
You can also migrate schemas across thousands of projects [automatically.](https://neon.tech/blog/migrating-schemas)
</Admonition>

### A dedicated project for dev/test

To take advantage of [database branching workflows for dev/test](https://neon.tech/use-cases/dev-test) whithin a project-per-tenant design, create a **separate Neon project as your single non-prod environment**. The methodology:

- Load your testing data to the main branch. This main branch acts as the primary source for all dev/test environments (they can be hundreds).
- To instantly create ephemeral environments, derive child branches from the main branch. These branches are fully isolated resource-wise and already include an up-to-date copy of the testing dataset. They can then be synced with the main branch with just one click.
- Once the work is complete, ephemeral dev/test environments (child branches) can be deleted automatically via your CI/CD.

![A dedicated project for dev/test](/use-cases/dev-test.jpg)

<Admonition type="note" title="Tip">
Check the [Database Per User Guide](https://neon.tech/use-cases/database-per-tenant) in our documentation for step by step instructions on how to set this up. 
</Admonition>

## Neon for B2B SaaS: Data isolation with easy scalability

If you’re building a B2B SaaS platform, a database-per-tenant design can simplify your architecture while preserving scalability. With Neon, when you place its tenant on its own project, you offer complete data privacy to your customers via instance-level isolation. This approach also makes it easy to comply with data regulations across different regions, as projects can be created in specific locations to meet local requirements.

Each tenant can be scaled independently, optimizing both performance and costs while reducing operational risk. And in the event of an issue or a customer request, you can [run point-in-time recovery (PITR) instantaneously for a specific tenant, without impacting the rest of the fleet](https://neon.tech/docs/guides/branch-restore).

## Neon for dev platforms: Join Vercel, Replit, Koyeb, and others

If you’re instead building a developer platform including a backend, or an [AI Agent](https://neon.tech/use-cases/ai-agents), you can start offering Neon databases to your users by becoming a [Partner](https://neon.tech/partners). Neon is a cost-effective solution that can support your hobby plan and Enterprise customers at the same time. Companies like [Vercel](https://neon.tech/blog/neon-postgres-on-vercel), [Replit](https://neon.tech/blog/neon-replit-integration), and [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview) are already using Neon to offer Postgres to their end-users.

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

---

<Admonition type="note" title="Get $100 in credits">
Neon offers a Free Plan, and we’ll discount up to $100 off your first invoice when you upgrade. Claim the offer by signing up through [this link](https://fyi.neon.tech/credits).
</Admonition>

---

<CTA title="Have questions?" buttonText="Reach out to us" buttonUrl="/contact-sales" />
