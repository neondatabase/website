---
title: Neon for variable traffic
subtitle: Optimize for performance during traffic peaks without over-provisioning with Neon Autoscaling
enableTableOfContents: true
updatedOn: '2024-09-08T12:44:00.894Z'
---

No real-world database has constant demand. To some extent, all modern applications experience variable traffic patterns; for some applications, demand is clearly variable. For example:

- A productivity application might have increased demand during working hours as teams collaborate and complete tasks.
- An AI analytics startup could face heavy processing loads during off-peak hours when batch data jobs are run.
- A gaming platform might experience surges in user activity during evenings when players are most active.
- Online shops might see spikes when certain sales are run… and so on.

Variable load patterns are common, but traditional managed databases require provisioning a fixed amount of CPU and memory. To avoid degraded performance or even outages, it is standard practice to provision for peak traffic, which means paying for peak capacity 24/7 — even though it's needed only a fraction of the time.

## Pay only for what you use with Neon

Neon solves this inefficiency via a serverless architecture. By [natively separating storage and compute](https://neon.tech/blog/architecture-decisions-in-neon), Neon implements two features that allow you to pay only for the compute you use without investing any manual work: [Autoscaling](https://neon.tech/blog/scaling-serverless-postgres) and [Scale to Zero](https://neon.tech/docs/introduction/auto-suspend).

- Neon adjusts CPU and memory up and down automatically.
- Costs are controlled by setting a [max autoscaling limit](https://neon.tech/docs/introduction/autoscaling).
- You get a performance boost when you need it.
- No manual resizes or downtimes. Neon scales up and down smoothly and immediately.
- Non-prod databases scale to zero when inactive. Instead of paying for compute 24/7, you reduce the costs of your supporting databases to a minimum.
- Transparency with open-source architecture. [Explore our code in GitHub](https://github.com/neondatabase/neon).

---

## Why Neon vs Aurora Serverless

The Neon architecture is inspired by Amazon Aurora, but with some key differences:

- Neon compute costs are **up to 80% cheaper** vs Aurora Serverless v2.
- Neon provisions instances in < 1 s, compared to Aurora's up to 20 min.
- Neon uses transparent compute units, vs the ACU abstraction in Aurora Serverless.
- Neon supports [database branching](/docs/introduction/branching) with data and schema via copy-on-write, improving development workflows.
- Neon's [read replicas](/docs/introduction/read-replicas) don't require storage redundancy, differently than Aurora's.
- [Connection pooling](/docs/connect/connection-pooling) is built-in in Neon, vs Aurora's RDS Proxy.
