---
title: Thousands of Neon projects now included in your pricing plan
description: Scaling database-per-user just got cheaper
excerpt: >-
  We just increased the number of projects included in all our paid plans:
  Launch, Scale, and Business. The latter—the Business plan—is a new plan
  tailored for production workloads, offering the best storage value, higher
  resources, migration assistance, and premium technical suppo...
date: '2024-10-01T15:57:49'
updatedOn: '2024-10-01T15:57:52'
category: company
categories:
  - company
authors:
  - mike-jerome
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/thousands-of-neon-projects-now-included-in-your-pricing-plan/cover.jpg
  alt: null
isFeatured: false
seo:
  title: Thousands of Neon projects now included in your pricing plan - Neon
  description: >-
    We increased the number of projects included in our paid plans up to
    thousands, making it affordable to scale database-per-user architectures.
  keywords: []
  noindex: false
  ogTitle: Thousands of Neon projects now included in your pricing plan - Neon
  ogDescription: >-
    We increased the number of projects included in our paid plans up to
    thousands, making it affordable to scale database-per-user architectures.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/thousands-of-neon-projects-now-included-in-your-pricing-plan/social.jpg
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/thousands-of-neon-projects-now-included-in-your-pricing-plan/neon-1000-projects-1-2-1-1024x576-ed02fb4b.jpg)

**We just increased the number of projects included in all our paid plans: Launch, Scale, and Business. The latter—the Business plan—is a new plan tailored for production workloads, offering the best storage value, higher resources, migration assistance, and premium technical support.** [Check out our pricing page](https://neon.tech/pricing).

**Summary of changes:**

- **`Launch Plan` goes from 10 projects to 100 projects**
- **`Scale Plan` goes from 50 projects to 1,000—plus you can buy extra 500 for $50/month**
- **We’re introducing the `Business Plan,` which includes 5,000 projects at no additional cost / where you can buy extra 5,000 projects for $50/month**

## The backstory

[Neon](https://neon.tech/home) is a serverless Postgres solution, making it a very versatile database for developers and teams who use Neon in various ways. Inside this broader group, there are a few _special_ use cases—special due to their requirements—where Neon uniquely shines:

**SaaS with database-per-user:** Neon makes it easy for small teams to manage isolated databases, e.g. for B2B AI platforms needing data isolation. Neon’s superior [API](https://neon.tech/docs/reference/api-reference) reduces management complexity compared to solutions like AWS RDS, while [autoscaling](https://neon.tech/docs/introduction/autoscaling) and [scale-to-zero](https://neon.tech/docs/introduction/auto-suspend) ensure cost-efficiency.

**Developer platforms:** This DB-per-user architecture scales extremely well in Neon—it can actually scale up to the hundreds of thousands of tenants, something that platforms like [Vercel](https://neon.tech/blog/neon-postgres-on-vercel), [Retool](https://neon.tech/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases), or [Koyeb](https://www.koyeb.com/blog/serverless-postgres-public-preview) are taking advantage of.

**AI Agents:** A use case related to the above is infra created by AI agents [. Neon’s serverless speed, efficiency, and accessibility makes it perfect for AI agents](https://www.linkedin.com/posts/nikitashamgunov_heres-the-story-on-how-we-accidentally-created-activity-7242909460304699393-6mr2?utm_source=share&utm_medium=member_desktop) wanting to deploy Postgres databases, as Replit is doing on their [Replit Agents](https://neon.tech/blog/building-a-news-app-with-replit-agent-a-step-by-step-guide).

## More projects, same price

All these use cases have something in common: they benefit from a database-per-tenant design where each tenant gets their own Postgres database with maximum isolation. In Neon, this design corresponds to one project per customer, meaning that to properly scale these use cases, developers need a large number of projects.

**To better support our users, we’ve decided to offer more projects across all our pricing tiers at the same monthly rate**. This change makes it easier and more affordable for everyone to scale their database architectures from a few users all the way to many thousands.

Here’s how our [pricing plans](https://neon.tech/pricing) look now:

- In the Launch Plan, you can now create up to 100 projects.
- In the Scale Plan, you can now create up to 1,000 projects at no additional cost. If you need more, you can buy an extra 500 projects for $50/month.
- In the Business Plan, you can create up to 5,000 projects at no additional cost. If you need more, you can buy an additional _5,000 projects_ for $50/month. (Yes, we’re going big.)

## A closer look at the Business Plan [NEW]

As part of this pricing plan’s expansion, we’ve also launched our Business plan, the most affordable and feature-complete option for teams with existing production workloads. This plan is designed to fit not only database-per-tenant architectures at scale but also other production use cases that highly benefit from Neon. Two examples:

**Applications with variable traffic:** Neon automatically scales your database resources up or down based on demand, [ensuring you never overprovision](https://neon.tech/variable-load). This dynamic scaling helps significantly reduce production costs, avoiding the expense of maintaining excess capacity during low-traffic periods.

**Dev/Test workflows:** With features like database branching (for both data and schema) and scale to zero, [Neon streamlines development workflows](https://neon.tech/dev-for-rds#?twin=true&twinWorkflowName=Create+Neon+Twin&twinSchedule=0+0+*+*+*&twinJob=default&twinSSLName=prod-us-east-1.pem&reverseTwin=false&reverseTwinWorkflowName=Run+Migrations&reverseTwinJob=sql&reverseTwinSubJob=null&pgVersion=16), helping teams ship faster while reducing costs compared to other databases. All branches share the same storage, allowing multiple “database copies” without extra storage fees, and databases automatically scale to zero when idle.

What’s included in the Business Plan:

- **500 GB of shared storage:** Neon’s unique architecture makes this 500 GB _stretch_. [All branches within a project share the same storage pool,](https://neon.tech/docs/introduction/branching) allowing you to create multiple database copies and read replicas without using additional storage.
- **More compute usage and priority support:** The Business plan comes with enough [compute hours](https://neon.tech/docs/introduction/usage-metrics#compute) to support production workloads that need to run 24/7 with high capacity. Priority technical support is included to help you resolve any issues quickly and keep your operations running smoothly.
- **Migration assistance:** We know migrations are a pain, so we help you move your existing databases to Neon with minimal downtime. While we’re working on the migration, we’ll waive all the migration-related fees.
- **Organization accounts:** The Business plan also comes with [organization accounts](https://neon.tech/docs/manage/organizations), allowing multiple users to collaborate on managing projects—perfect for larger teams working on shared database infrastructure.
- **Branch protection:** To protect your key databases in this team setting, [you can restrict which IPs have access to your production branches](https://neon.tech/docs/guides/protected-branches) and protect them against accidental deletions or modifications.
- **Instant PITR and time-travel queries (30 days):** The Business plan allows you to perform [instant point-in-time recovery (no matter how large your dataset](https://neon.tech/docs/guides/branch-restore)) and time-travel queries for up to 30 days back.
- **Compliance and security:** The Business plan comes with SOC 2 report and a [99.95% Service Level Agreement](https://neon.tech/neon-business-sla).

## From Free to Business: Start today

If this sounds intriguing and you’re not using Neon yet, [get started with our Free plan](https://console.neon.tech/signup) (no credit card required). It only takes a few seconds, and you’ll have a Postgres database ready to use right away. From there, it’s all up—you never know where a little prototype might take you!

_PS: For those of you thinking, “This all sounds great, but what about the Free plan—there’s only one project included,” stay tuned… We might have something for you…_
