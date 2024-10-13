---
title: Postgres for variable traffic
subtitle: Neon dynamically scales according to load. Get optimal performance during traffic peaks without overprovisioning.
enableTableOfContents: true
updatedOn: '2024-08-23T09:00:00.000Z'
---

No real-world database has constant demand. To some extent, all modern applications experience variable traffic patterns; for some applications, demand is clearly variable. For example:

- A productivity application might have increased demand during working hours as teams collaborate and complete tasks.
- An AI analytics startup could face heavy processing loads during off-peak hours when batch data jobs are run.
- A gaming platform might experience surges in user activity during evenings when players are most active.
- Online shops might see spikes when certain sales are run… And so on.

Variable load patterns are common, but traditional managed databases require provisioning a fixed amount of CPU and memory. To avoid degraded performance or even outages, it is standard practice to provision for peak traffic, which means paying for peak capacity 24/7 — even though it's needed only a fraction of the time.

## Pay only for what you use with Neon

Neon solves this inefficiency via a serverless architecture. By natively separating storage and compute, Neon implements two features that allow you to pay only for the compute you use without investing any manual work: autoscaling and scale to zero.

- **Neon autoscales** according to traffic, dynamically adjusting CPU and memory as needed.
- **Costs are controlled** by setting a max autoscaling limit, avoiding unexpected charges.
- **Fast performance in production without overpaying**. In a typical compute bill, 60% of costs go towards unused resources.
- **No manual resizes or downtimes**. Neon scales up and down smoothly and immediately.
- **Non-prod databases scale to zero** when inactive. Instead of paying for compute 24/7, you skim the costs of your supporting databases to a minimum.
- **Transparency with open-source architecture**. Explore our code on GitHub.

How much money are you wasting on unused compute?

Provisioning for peak load is highly inefficient cost-wise, especially considering that you will most likely be running not only one database instance but many.

---

## Why Neon vs Aurora Serverless

The Neon architecture is inspired by Amazon Aurora, but with some key differences:

- Neon compute costs are up to **75% cheaper vs Aurora Serverless v2**.
- Neon **scales to zero**, whereas Aurora Serverless does not.
- Neon provisions instances in **< 1 second**, compared to Aurora's up to 20 minutes.
- Neon uses **transparent compute units**, rather than the ACU abstraction in Aurora Serverless.
- Neon supports **database branching with data and schema** via copy-on-write, improving development workflows.
- Neon's **read replicas don't require storage redundancy**, unlike Aurora's.
- **Connection pooling is built-in** with Neon, versus Aurora's reliance on RDS Proxy.

You’ll need at least one production database, but also separate instances for development, testing, and staging. Your production database will run 24/7, but only run at peak capacity when you reach peak load. Your non-prod databases will only run a few hours per day. But for each one of these databases, you’ll be paying for peak compute, 100% of the time—even if you don’t use it.
