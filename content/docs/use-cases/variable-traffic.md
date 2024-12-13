---
title: Neon for variable traffic
subtitle: Optimize for performance during traffic peaks without over-provisioning with
  Neon Autoscaling
enableTableOfContents: true
updatedOn: '2024-12-12T19:49:26.800Z'
---

Variable traffic patterns are common, but traditional managed databases require provisioning a fixed amount of CPU and memory. It is common practice to provision for peak traffic, which means paying for peak capacity 24/7 — even though it's needed only a fraction of the time.

**Serverless databases like Neon allow teams to lower their costs by scaling up/down automatically in response to load, and scaling down to zero when the database is inactive**. This autoscaling pattern also reduces manual work for developers, who don't have to worry about resizing instances. [Read a case study](https://neon.tech/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand).

## How it works: A closer look

Two key features are behind Neon's efficiency for variable traffic patterns: [Autoscaling](https://neon.tech/blog/scaling-serverless-postgres) and [Scale to Zero](https://neon.tech/docs/introduction/auto-suspend).

![Compute metrics graph](/docs/introduction/compute-usage-graph.jpg)

For production databases that stay on 24/7:

- Via autoscaling, Neon adjusts CPU/memory up and down automatically. This scaling is very responsive and it happens nearly instantly. [Read about our autoscaling algorithm](https://neon.tech/docs/guides/autoscaling-algorithm).
- Costs are controlled by setting a [max autoscaling limit](https://neon.tech/docs/introduction/autoscaling). Your database will never autoscale above this limit.
- No manual resizes or downtimes. You will get a performance boost when you need it, and once traffic slows down, Neon will scale you back down without downtime.

For databases that are only used a few hours per day, for example, dev/test databases:

- Your databases will automatically scale to zero when inactive. Instead of paying for compute 24/7, you reduce the costs of your supporting databases to a minimum, without manual work.
- Once you query them again, Neon databases reactivate in less than a second (a few hundred ms on average).

---

## Comparisons with Aurora Serverless v2

If you're looking for a Postgres database with autoscaling, likely you've also come across Aurora Serverless v2. Check out these links to learn about how Aurora Serverless v2 compares to Neon:

- [FAQ with common questions](https://neon.tech/aurora)
- [Deeper dive into how both scaling engines compare](https://neon.tech/blog/postgres-autoscaling-aurora-serverless-v2-vs-neon)
- [Case study of a migration from Aurora Serverless to Neon](https://neon.tech/blog/why-invenco-migrated-from-aurora-serverless-v2-to-neon)
