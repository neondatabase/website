---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2025-07-30T09:58:22.803Z'
---

This page describes the usage metrics for Neon plans. These metrics determine what’s included in your monthly plan and what's billed for based on usage.

## Projects

Each plan includes a certain number of **projects**.

Projects are containers for your database environments. Each project includes your primary database, its branches, and compute resources. You can think a project as being similar to a GitHub repo - one project, many branches. Learn more about [Neon’s object hierarchy](https://neon.com/docs/manage/overview).

> We often recommend a project per app or a project per customer to isloate data and resources.

## Compute

Your monthly compute usage depends on how long your compute runs and at what size.

- Compute usage is measured in **CU-hours** (Compute Unit hours).
- One CU represents 1 vCPU and 4 GB of RAM.
- Compute sizes all the way up to 56 CU are supported.
- RAM scales with compute size at a 1:4 ratio — for every 1 vCPU in a Compute Unit, you get 4 GB of RAM.

```
| Compute Unit | vCPU | RAM    |
| ------------ | ---- | ------ |
| .25          | .25  | 1 GB   |
| .5           | .5   | 2 GB   |
| 1            | 1    | 4 GB   |
| 2            | 2    | 8 GB   |
| 3            | 3    | 12 GB  |
up to ...
| 56           | 56   | 224 GB |
```

Your compute usage is calculated as your compute size multipled by how long your compute runs:

```text
CU size × number of hours running = CU-hours
```

Here are a few examples that illustrate compute-hour usage calculations:

- A .25 CU compute running for 4 hours = 1 CU-hour
- A 2 CU compute running for 3 hours = 6 CU-hours
- An 8 CU compute running for 2 hours = 16 CU-hours

> By default, each Neon branch is created with a read-write compute. Creating a read replica adds a read-only compute to a branch. All of the computes across all of your Neon projects count toward your account's compute usage.

<Admonition type="tip" title="Free plan Compute Hours">
On the Free plan, you get 50 CU-hours per month — this lets you run a 0.25 CU compute for 200 hours per month. Comsbined with [scale-to-zero](/docs/introduction/scale-to-zero), which helps minimize compute usage, this is sufficient for most prototypes and side-projects. If you need more compute hours, you can upgrade to the **Launch** plan, starting at $5/month with usage-based pricing. See [Neon plans](/docs/introduction/plans).
</Admonition>

### Compute hour usage with autoscaling

Autoscaling adjusts the compute size based on demand within the your defined minimum and maximum compute size thresholds. To estimate compute hour usage with autoscaling, the best approach is to estimate an **average compute size** and modify the compute hours formula as follows:

```text
compute hours = average CU size * number of hours running
```

To estimate an average compute size, start with a minimum compute size that can hold your data or working set (see [How to size your compute](/docs/manage/endpoints#how-to-size-your-compute)). Pick a maximum compute size that can handle your peak loads. Try estimating an average compute size between those thresholds based on your workload profile for a typical day.

### Compute hour usage with scale to zero

Scale to zero places your compute into an idle state when it's not being used, which helps minimize compute hour usage. When enabled, computes are suspended after 5 minutes of inactivity. On Neon's paid plans, you can disable scale to zero. See [Scale to Zero](/docs/introduction/scale-to-zero).

## Storage

Storage is measured in **GB-months**, based on actual usage rather than allocated capacity.  
Storage is metered hourly and summed over the month.

1 GB-month = 1 GB stored for 1 full month

Here are a couple of examples that illustrate how how storage usage is calculated:

- 10 GB of data stored for a full month is 10 GB-months
- 100 GB of data stored for half a month is 50 GB-months

Storage is your [logical data size](/docs/reference/glossary#logical-data-size), which is the size of your databases, including all tables, indexes, views, and stored procedures.

## Instant restore

Instant restore change history is measured in **GB-months of change history** retained for a branch.  
The change history is record of data-modifying changes, such as inserts, updates, and deletes, that support point-in-time restore. The cost is based on the amount of data change captured, not how often restores are performed.

Two factors affect the size of you instant restore change history:

- **Volume of data modifications:** Each write operation (insert, update, or delete) generates records in your change history.
- **Your restore window:** If your restore window is set to 7 days, you will accumulate a 7-day history of changes. If your restore window is 30 days, you will accumulate a larger 30-day history of changes.

## Extra branches

**Extra branch usage is measured in branch-months**, prorated to the hour. This counts the number of non-root branches that exceed your plan’s hourly allowance.

On paid plans, you can create and delete branches as needed. You’re only billed when the number of **concurrent branches** in a given hour exceeds your plan’s limit.

Example: The Launch plan includes 10 branches. If you have 12 non-root branches for 5 hours, that’s 2 extra branches × 5 hours = 10 hours of extra branches, billed at the hourly prorated branch-month rate.

**How it's measured:**  
Each hour, Neon counts the number of non-root branches in your project. A branch is counted for the full hour, even if it exists for only a few minutes.

If this count exceeds your plan’s limit — 10 for Launch, 25 for Enterprise — the extra branches are billed at **$1.50 per branch-month**, prorated to the hour.  
Invoices reflect the monthly rate with prorated hourly usage.

**Example (Launch plan — 10 branch/hour limit):**

- At 14:00, there are 13 non-root branches. That’s 3 over the limit.  
  → 3 extra branches billed for that hour at the prorated portion of $1.50/branch-month.
- At 15:00, the count drops to 9.  
  → **No overage** billed for that hour.
- At the end of the month, all hourly overages are summed and shown on the invoice using the $1.50/branch/month rate.

## Private transfer

Measured in **GB transferred** over private networking features such as AWS PrivateLink, which is supported by Neon's [Private Networking](https://neon.com/docs/guides/neon-private-networking) feature.

Billed separately from public (egress) data transfer. Available on Enterprise plans.

## Public transfer

Also called **egress**, measured in **GB transferred** from Neon to the public internet.  
Each plan includes a data transfer allowance. Extra usage is billed per GB.

---

<NeedHelp/>
