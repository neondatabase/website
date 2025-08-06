---
title: Neon plans
subtitle: Learn about Neon’s pricing plans, including what’s included in each plan, usage-based pricing, and frequently asked 
enableTableOfContents: true
isDraft: false
redirectFrom:
  - /docs/introduction/billing#neon-plans
  - /docs/introduction/billing-calculators
  - /docs/introduction/billing-rates
  - /docs/introduction/free-tier
  - /docs/introduction/pro-plan
  - /docs/introduction/custom-plan
  - /docs/reference/technical-preview-free-tier
  - /docs/reference/pricing-estimation-guide
  - /docs/reference/billing-sample
updatedOn: '2025-05-30T16:54:40.485Z'
---

Neon offers three plans to support you at every stage—from your first prototype to production at scale.
Start for free, then pay only for what you use as your needs grow.

---

## Plan overview

| Plan      | **Free**            | **Launch**                 | **Enterprise**             |
|-----------|---------------------|----------------------------|----------------------------|
| **Price** | $0/month            | $5/month minimum           | $5/month minimum           |
| **Who it's for** | Prototypes and side projects | Startups and growing teams | Production-grade companies |
| **Projects** | 10                | 100                        | 1,000                      |
| **Branches included** | 10/project | 10/project | 25/project |
| **Extra branches** | — | $0.002/branch-hour | $0.002/branch-hour |
| **Compute** | 50 CU-hours | Pay-as-you-go @ $0.14/CU-hour | Pay-as-you-go @ $0.26/CU-hour |
| **Autoscaling** | Up to 2 CU (2 vCPU / 8 GB RAM) | Up to 16 CU (16 vCPU / 64 GB RAM) | Up to 56 CU (56 vCPU / 224 GB RAM) |
| **Scale to zero** | Auto (after 5 min) | Auto (after 5 min, can be disabled) | Configurable (5 seconds -> always on) |
| **Storage** | 1 GB/project *(root: 0.5 GB, child branch: 0.5 GB)* | Pay-as-you-go @ $0.35 per GB-month | Pay-as-you-go @ $0.35 per GB-month |
| **Data transfer (egress)** | 5 GB included | 100 GB included, then $0.10/GB | 100 GB included, then $0.10/GB |
| **Console UI monitoring** | 1 day | 3 days | 14 days |
| **Metrics/logs export (Datadog, OTel)** | — | — | Included |
| **Restore window** | 6 hours, up to 1 GB-month | Up to 7 days | Up to 30 days |
| **Instant restore** | — | $0.20/GB-month | $0.20/GB-month |
| **Private networking transfer (additional cost)** | — | — | $0.01/GB |
| **Support** | Community | Billing support | Production support |
| **Compliance & features** | — | SOC 2 / ISO / GDPR, HIPAA (extra), IP Allow, Private Networking | All included |

## Frequently asked questions

Got questions about Neon pricing? You’ll find answers to the most common ones below.  
Still need help? Join us on our [Discord server](https://discord.gg/92vNTzKDGp) or [contact our sales team](https://neon.tech/contact-sales).

### What is a project?

A project in Neon is the top-level container for your database environment. Each project includes your primary database, its branches, and compute resources. You can think of it like a GitHub repo—one project, many branches. [Learn more about Neon’s object hierarchy](#).

---

### What is a CU?

A CU (short for Compute Unit) is Neon's way of representing instance size. It defines how much CPU and memory your database uses at any moment.  
**1 CU = 1 vCPU + 4 GB RAM**

---

### How is compute usage measured in Neon?

Neon is a serverless database, so you're billed based on actual usage. Your monthly compute usage depends on how long your compute runs and at what size.

We measure compute usage in **CU-hours**:

CU-hour = CU size × number of hours it runs

- Example 1: A .25 CU compute running for 4 hours = 1 CU-hour.
- Example 2: A 2 CU compute running for 3 hours = 6 CU-hours.

**On the Free plan, you get 50 CU-hours per month** — this lets you run a 0.25 CU compute for 200 hours per month. Together with scale-to-zero, this is sufficient for most prototypes and side-projects. If you need more compute hours, consider upgrading to the Launch plan, starting at $5/month with usage-based pricing.

---

### What is scale-to-zero and what are the differences per plan?

The scale-to-zero feature suspends a compute after a period of inactivity, which minimizes costs for databases that aren’t always active, such as development or test environment databases — and even production databases that aren't used 24/7.

- **Free plan**: Computes scale to zero after 5 minutes of inactivity – **cannot be disabled**
- **Launch plan**: Computes scale to zero after 5 minutes of inactivity — **can be disabled for an always-on compute**
- **Enterprise**: Configurable — **can be disabled, scale-to-zero threshold can be increased or decreased**

Learn more about our [scale-to-zero](/docs/introduction/scale-to-zero) feature.

---

### How is storage usage billed in Neon?

Storage is billed based on actual usage, not allocated capacity. We measure usage in **GB-months**:

1 GB-month = 1 GB stored for 1 full month

Storage is metered hourly and summed over the month, so you only pay for what you actually use—not for the peak size of your database.

---

### What happens with branches and storage?

Each project starts with a **root branch** (your main database). You can create **child branches**, which are isolated copies of your database—ideal for testing, previews, or development.

Neon uses a **copy-on-write** model, so:

- Child branches don’t increase your storage bill unless they diverge from the root.
- Only the differences (deltas) from the root are counted.

At the end of the month:

Total GB-month = Root branch size + deltas from all child branches

[Learn more about Neon’s branching model](#).

---

### How are instant restores billed?

Instant restores (also called **Point-in-Time Recovery**, or PITR) are billed based on **how much data changes** in your primary branch—not how often you restore.

- **Free plan**: Includes up to 6 hours of restore history or 1 GB of changes, whichever comes first. Apps with frequent writes may get less than 6 hours.
- **Launch plan**: Choose any restore window from 0 to 7 days. Billed at **$0.20 per GB-month** based on the amount of changed data. Setting it to 0 disables instant restore and adds no cost.
- **Enterprise plan**: Supports restore windows up to 30 days. Same $0.20 per GB-month rate applies.

[Read the docs for more on instant restore](/docs/introduction/branch-restore).

---

### How does billing for additional branches work?

Each plan includes a set number of **simultaneous branches** per project. For example, the Launch plan includes 10.

You can create and delete as many branches as you like during the month. You’ll only be billed if the number of **active branches at the same time** exceeds your included quota.

We meter excess usage using **branch-hours**:

1 additional branch × 1 hour = 1 branch-hour

**Example:** If your plan includes 10 branches and you briefly run 2 extra branches for 5 hours each, that’s 10 branch-hours.  
Billed at **$0.002 per branch-hour**, this would add **$0.02** to your bill.

---

### How can I control my costs?

Neon lets you control compute costs by setting a **maximum autoscaling limit** per branch. This acts as a cost ceiling—your database won’t scale beyond the limit, even if traffic spikes.

**Example:** If you set a limit of 1 CU, your compute usage will never exceed 1 CU-hour per hour.

[Learn how to configure autoscaling limits](/docs/guides/autoscaling-guide).

---

### Which level of support do I get with Neon?

We offer different support levels based on your pricing plan.

---

### Do you offer credits for startups?

Yes! Early-stage startups that have received venture funding can apply to our **Startup Program**.  
[Learn more and apply here](https://neon.com/startups).

---

## Example usage scenarios

### What would I get for $25/month in the Launch plan?

**Scenario A: Compute-heavy**

- 10 GB database
- ~154 CU-hours (≈ 1 CU for 7 hrs/day, Mon–Fri)
- **Total: $25/month**

**Scenario B: Storage-heavy**

- 25 GB database
- ~116 CU-hours (≈ 1 CU for 5 hrs/day, Mon–Fri)
- **Total: $25/month**

**Scenario C: Branch-heavy**

- 10 included + 5 extra branches  
- 5 GB shared storage
- ~115 CU-hours (≈ 0.25 CU for 1.5 hrs/day per branch, Mon–Fri)
- **Total: $25/month**

<NeedHelp/>
