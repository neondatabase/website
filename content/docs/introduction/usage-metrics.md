---
title: Usage metrics
enableTableOfContents: true
updatedOn: '2025-07-30T09:58:22.803Z'
---

This page describes the usage metrics for Neon plans. These metrics determine what’s included in your monthly plan allowances and what is billed as extra usage.

## Compute

Your monthly compute usage depends on how long your compute runs and at what size.

Measured in **CU-hours** (Compute Unit hours).  
One CU represents 1 vCPU and 4 GB of RAM. Compute sizes to 56 CU are supported.

Usage is calculated as:

```text
CU size × number of hours running = CU-hours
```

- Example 1: A .25 CU compute running for 4 hours = 1 CU-hour.
- Example 2: A 2 CU compute running for 3 hours = 6 CU-hours.
- Example 3: An 8 CU compute running for 2 hours = 16 CU-hours.

**On the Free plan, you get 50 CU-hours per month** — this lets you run a 0.25 CU compute for 200 hours per month. Together with scale-to-zero, this is sufficient for most prototypes and side-projects. If you need more compute hours, you can upgrade to the Launch plan, starting at $5/month with usage-based pricing.

## Storage

Measured in **GB-months**, based on actual usage rather than allocated capacity.  
Storage is metered hourly and summed over the month.

Only diverging data (deltas) on child branches contributes to additional storage usage.

## Instant restore

Measured in **GB-months of change history** retained for a branch.  
Instant restore stores historical changes to support point-in-time restores. The cost is based on the amount of data change captured, not how often restores are performed.

## Extra branches

Measured in **branch-hours**, which track usage of active branches that exceed the included branch count for your plan.

You can create and delete unlimited branches, but you'll be billed if the number of **concurrent active branches** exceeds your plan’s allowance.

Example: 2 extra branches active for 5 hours each = 10 branch-hours.

## Private transfer

Measured in **GB transferred** over private networking features such as AWS PrivateLink.  
Billed separately from public (egress) data transfer. Available on Enterprise plans.

## Public transfer

Also called **egress**, measured in **GB transferred** from Neon to the public internet.  
Each plan includes a data transfer allowance. Extra usage is billed per GB.

## Projects

Each plan includes a maximum number of **active projects**.  
Projects are containers for your database environments and resources. Additional projects cannot currently be added beyond the plan limits.

---

<NeedHelp/>
