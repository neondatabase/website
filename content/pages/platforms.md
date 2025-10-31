---
title: 'Embedded Postgres for Platforms'
subtitle: Provision dedicated Postgres databases for your users — instantly, affordably, and at scale
updatedOn: '2025-06-17T09:00:00.000Z'
---

Neon makes it easy to embed Postgres into your platform with one-second provisioning, autoscaling, and scale-to-zero—so each user gets an isolated database without the overhead. Databases are provisioned via API and fully integrated into your product, with no Neon signup or setup required.

![Partners](/images/pages/platforms/partners.jpg)

<CTA title="" description="Our Solutions Engineers have helped platforms like yours embed Postgres at scale. Tell us about your use case—we’ll help you design the right approach." buttonText="Meet with us" buttonUrl="/contact-sales" />

## Uniquely built to scale Postgres fleets

Neon is the best Postgres provider for deploying one-database-per-user fleets at scale. **You don’t need a DevOps team to manage a large Neon fleet** – the Neon API lets you track usage, enforce limits, and scale programmatically. With pay-per-use pricing and automatic scale-to-zero, [you’ll spend a fraction of what you'd pay on AWS](/cost-fleets). What you get:

- Dedicated connection strings for every user or project - every user gets their own secure, isolated Postgres [project](/docs/manage/projects)
- High connection capacity - pooled endpoints support up to 10,000 connections
- Full Postgres compatibility - no proprietary query layer
- Custom branching and PITR - instant copies and rollbacks, no manual backups
- All of this is available across multiple regions, with autoscaling and high availability

<Testimonial
text="We’ve been able to automate virtually all database management tasks via the Neon API. We manage 300,000+ projects with minimal engineering overhead."
author={{
name: 'Himanshu Bandoth',
company: 'Software Engineer at Retool',
}}
/>

## With instant provisioning and scale-to-zero

[Neon databases provision in less than a second](https://github.com/neondatabase/instant-postgres?tab=readme-ov-file#instant-postgres) and automatically suspend when idle, with no compute cost until the next query. **You can offer every user their own Postgres database without incurring the cost of idle infrastructure.** This is what makes Neon ideal for platforms: dedicated Postgres per user, but with shared-infrastructure economics.

- Provisioning time: ~1 second
- Suspend latency: configurable (default is 5 min)
- Resume latency (cold start): ~500ms

![Architecture](/images/pages/platforms/architecture.jpg)

[Read about the benefits of database-per-user architectures for scalability](/docs/use-cases/database-per-user#database-per-user)

## API-first management

Neon’s API is purpose-built to help platforms manage large fleets of Postgres databases with minimal engineering effort. **We’ve continuously improved our API in collaboration with 20+ partners, each pushing the boundaries of scale and automation**. Via the Neon API, you can:

- Provision new databases instantly
- Set per-project resource limits to support free, pro, and enterprise plans
- Scale compute up or down per user or tier
- Automatically suspend inactive databases to reduce costs
- Monitor usage across thousands of projects
- Update quotas and configurations without downtime

…and more

<MegaLink tag="Case Study" title="Retool uses the Neon API to manage over 300,000 databases with just one engineer — handling everything from provisioning to quota enforcement." url="/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases" />

## Built-in quotas and billing controls

Neon allows you to easily **define usage limits per project to manage cost and enforce pricing tiers**. As users upgrade or change plans, you can dynamically update limits via API, without downtime or user impact.

- Set maximum allowed storage
- Cap CPU usage
- Limit egress by plan
- Track and cap monthly data written
- Customize suspend timeouts for different tiers

…and more

<MegaLink tag="Case Study" title="Koyeb’s Database Instance Types sets an example of how to use Neon’s quota controls to define compute, storage, write, and data transfer limits per plan." url="https://www.koyeb.com/docs/databases#database-instance-types" />

## Tracking usage at scale

Neon also provides rich consumption APIs for observability at scale:

| Endpoint                                             | Description                                                        | Availability                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- |
| Account-level cumulative metrics                     | Granular project-level metrics                                     | Single project metrics                                    |
| Aggregate metrics across all projects in the account | Usage metrics per project at hourly, daily, or monthly granularity | Detailed metrics and quota info for an individual project |
| Scale and Business plans                             | Scale and Business plans                                           | All plans                                                 |

You can use these to:

- Monitor total usage across all projects for a billing period
- Break down metrics by project or time range (hourly, daily, monthly)
- Power usage-based billing or internal dashboards

[Learn how to query consumption metrics via the API](/docs/guides/consumption-metrics)

<Testimonial
text="Neon’s serverless philosophy is aligned with our vision (no infrastructure to manage, no servers to provision, no database cluster to maintain) making them the obvious partner to power our serverless Postgres offering."
author={{
name: 'Edouard Bonlieu',
company: 'co-founder and CPO at Koyeb',
}}
/>

## Built for your platform, not ours

**We’re not trying to own your user experience — we’re here to power it.** You can integrate Neon invisibly behind the scenes, whether you want to use our [OAuth integration](/docs/guides/oauth-integration) or manage Neon projects directly via API. **You decide how the database shows up in your UI, we take care of the rest.**

<CTA title="Let us help you launch" description="We’re happy to support proof-of-concepts, provide technical guidance, and share best practices from other platforms." theme="column" buttonText="Talk to us" buttonUrl="/contact-sales" linkText="Explore the API" linkUrl="/docs/reference/api-reference" />
