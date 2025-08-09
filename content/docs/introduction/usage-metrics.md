---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2025-07-30T09:58:22.803Z'
---

This page describes the usage metrics for Neon plans. These metrics determine what’s included in your monthly plan allowances and what is billed as extra usage.

## Projects

Each plan includes a maximum number of **projects**. Additional projects cannot currently be added beyond the plan limits.

Projects are containers for your database environments. Each project includes your primary database, its branches, and compute resources. You can think a project as being similar to a GitHub repo - one project, many branches. Learn more about [Neon’s object hierarchy](https://neon.com/docs/manage/overview).

## Compute

Your monthly compute usage depends on how long your compute runs and at what size.

Compute usage is measured in **CU-hours** (Compute Unit hours).  
One CU represents 1 vCPU and 4 GB of RAM. Compute sizes all the way up to 56 CU are supported. RAM scales with compute size at a 1:4 ratio — for every 1 vCPU in a Compute Unit, you get 4 GB of RAM.

| Compute Unit  | vCPU | RAM    |
| :------------ | :--- | :----- |
| .25           | .25  | 1 GB   |
| .5            | .5   | 2 GB   |
| 1             | 1    | 4 GB   |
| 2             | 2    | 8 GB   |
| 3             | 3    | 12 GB  |
...
| 56            | 56   | 224 GB |

Compute usage is calculated as:

```text
CU size × number of hours running = CU-hours
```

- Example 1: A .25 CU compute running for 4 hours = 1 CU-hour
- Example 2: A 2 CU compute running for 3 hours = 6 CU-hours
- Example 3: An 8 CU compute running for 2 hours = 16 CU-hours

<Admonition type="tip" title="Free Plan Compute Hours">
On the Free plan, you get 50 CU-hours per month — this lets you run a 0.25 CU compute for 200 hours per month. Comsbined with [scale-to-zero](/docs/introduction/scale-to-zero), which helps minimize compute usage, this is sufficient for most prototypes and side-projects. If you need more compute hours, you can upgrade to the Launch plan, starting at $5/month with usage-based pricing.
</Admonition>

## Storage

Storage is measured in **GB-months**, based on actual usage rather than allocated capacity.  
Storage is metered hourly and summed over the month.

1 GB-month = 1 GB stored for 1 full month

- Example 1: 10 GB of data stored for a full month is 10 GB-months
- Example 2: 100 GB of data stored for half a month is 50 GB—months

Storage is the [logical data size](https://neon.com/docs/reference/glossary#logical-data-size) in Postgres.

## Instant restore

Instant restore change history is measured in **GB-months of change history** retained for a branch.  
The change history is record of data-modifying changes, such as inserts, updates, and deletes, that support point-in-time restore. The cost is based on the amount of data change captured, not how often restores are performed.

Two factors affect the size of you instant restore change history:

- **Volume of data modifications:** Each write operation (insert, update, or delete) generates records in your change history.
- **Your restore window:** If your restore window is set to 7 days, you will accumulate a 7-day history of changes. If your restore window is 30 days, you will accumulate a larger 30-day history of changes.

## Extra branches

**Extra branch usage is measured in branch-hours**, which count the number of non-root branches that exceed your plan’s hourly allowance.

On paid plans, you can create and delete branches as needed. You’re only billed when the number of **concurrent branches** in a given hour exceeds your plan’s limit.

Example: The Launch plan includes 10 branches. If you have 12 non-root branches for 5 hours, that’s 2 extra branches × 5 hours = 10 branch-hours.

**How it's measured:**  
Each hour, Neon counts the number of non-root branches in your project. A branch is counted for the full hour, even if it exists for only a few minutes.

If this count exceeds your plan’s limit — 10 for Launch, 25 for Enterprise — the extra branches are billed at approximately $0.002 per branch-hour.  
For simplicity, invoices show this as **$1.50 per extra branch per month**, even though billing is based on actual hourly usage.

**Example (Launch plan — 10 branch/hour limit):**

- At 14:00, there are 13 non-root branches. That’s 3 over the limit.  
  → 3 × $0.002 = **$0.006** billed for that hour.
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
