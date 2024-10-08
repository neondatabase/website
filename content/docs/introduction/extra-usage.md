---
title: Extra usage
enableTableOfContents: true
subtitle: Learn how extra usage works in Neon's pricing plans
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-10-07T18:18:31.787Z'
---

Neon plans are structured around **Allowances** and **Extra usage**. Allowances are included in your plan. With Neon's paid plans, you can purchase extra usage in set increments for when you need to go over your allowance.

## Plan fees and allowances

This table provides an overview of plan fees with allowances for storage, compute, and projects:

| Plan       | Monthly Fee | Storage Allowance | Compute Allowance                                                                                                                                        | Project Allowance |
| ---------- | ----------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Free Plan  | $0          | 0.5 GiB           | 191.9 compute hours/month&#8212;enough to run a primary 0.25 CU compute 24/7; up to 5 of those compute hours can be used for non-default branch computes | 10 projects       |
| Launch     | $19         | 10 GiB            | 300 compute hours per month                                                                                                                              | 100 projects      |
| Scale      | $69         | 50 GiB            | 750 compute hours per month                                                                                                                              | 1000 projects     |
| Business   | $700        | 500 GiB           | 1000 compute hours per month                                                                                                                             | 5000 projects     |
| Enterprise | Custom      | Custom            | Custom                                                                                                                                                   | Custom            |

The [Enterprise](/docs/introduction/plans#enterprise) plan is fully customizable with respect to allowances. Please contact [Sales](/contact-sales) for more information.

<Admonition type="tip" title="What are active hours and compute hours?">

- An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted. In the table above, _active hours_ are based on a 0.25 vCPU compute size.
- A **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour.
- **Compute hours formula**

  ```
  compute hours = compute size * active hours
  ```

</Admonition>

## Extra usage

The [Launch](/docs/introduction/plans#launch), [Scale](/docs/introduction/plans#scale), and [Business](/docs/introduction/plans#business) plans permit extra usage beyond the allowances included with the monthly fee. The extra usage types that are available differ by plan.

### Launch plan

The Launch plan supports extra **Storage** and **Compute** usage. If you need more than 100 projects, you'll need to move up to the Scale or Business plan.

- **Extra Storage**: If you exceed 10 GiB, extra storage is allocated in units of 2 GiB at $3.50 per unit.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16/compute hour.

| Resource      | Unit         | Price          |
| ------------- | ------------ | -------------- |
| Extra Storage | 2 GiB        | $3.50 per unit |
| Extra Compute | Compute hour | $0.16          |

### Scale plan

The Scale plans supports extra **Storage**, **Compute**, and **Project** usage.

- **Extra Storage**: If you exceed 50 GiB on Scale, extra storage is allocated in units of 10 GiB at $15 per unit.
- **Extra Compute**: If you exceed 750 compute hours on Scale, extra compute is billed at $0.16/compute hour.
- **Extra Projects**: If you exceed 1000 projects on Scale, extra projects are allocated in units of 500 projects at $50 per unit.

| Resource       | Unit         | Price           |
| -------------- | ------------ | --------------- |
| Extra Storage  | 10 GiB       | $15.00 per unit |
| Extra Compute  | Compute hour | $0.16           |
| Extra Projects | 500          | $50.00 per unit |

### Business plan

Both the Scale and Business plans supports extra **Storage**, **Compute**, and **Project** usage.

- **Extra Storage**: If you exceed 500 GiB on Business, extra storage is allocated in units of 10 GiB at $5 per unit.
- **Extra Compute**: If you exceed 1000 compute hours on Business, extra compute is billed at $0.16/compute hour.
- **Extra Projects**: If you exceed 5000 projects on Business, extra projects are allocated in units of 5000 projects at $50 per unit.

| Resource       | Unit         | Price           |
| -------------- | ------------ | --------------- |
| Extra Storage  | 10 GiB       | $5.00 per unit  |
| Extra Compute  | Compute hour | $0.16           |
| Extra Projects | 5000         | $50.00 per unit |

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is allocated by default. If you use more storage, compute, or projects than your monthly allowance provides, the extra usage is automatically allocated and charged to your monthly bill.

**Storage**

For example, the Launch plan includes an allowance of 10 GiB in the plan's monthly fee. If you exceed 10 GiB of storage at any point during the month, you are automatically allocated an extra storage unit of 2 GiB at $3.50 per unit. If you exceed 12 GiB, you are allocated 2 units of 2 GiB (an extra $7), and so on. It works the same way on the Scale and Business plans, but with 10 GiB units of storage at $15 per unit for Scale and $5.00 per unit for Business. However, the extra charge is prorated from the date the extra usage was allocated, meaning that you are not billed the full amount if extra storage units were allocated partway through the month.

<Admonition type="note">
In the context of billing, allocation of extra storage refers to an increase in the storage allowance rather than physical storage allocation.
</Admonition>

**Projects**

Billing for extra projects, which are available with the [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans, works in the same way as storage. Extra projects are allocated in units of 500 on Scale and 5000 on Business. For example, the Scale plan has an allowance of 1000 projects. If you use more than 1000 projects, you are automatically allocated an extra unit of 500 projects at $50 per unit. For example, if you use 1001 projects, you are allocated 1 unit of 500 projects (an extra $50). If you use 1501 projects, you are allocated 2 units of 500 projects (an extra $100), and so on. The extra charge is prorated from the date the extra usage was allocated, meaning that you are not billed the full amount if extra project units are allocated partway through the month.

<Admonition type="note" title="How extra storage and project charges are prorated">
The proration formula for calculating the cost of extra storage or projects allocated during a monthly billing period is:

```plaintext
Cost = Units x (Unit Price/Days in Month) x Days Left in Month
```

Where:

- **Cost** is the amount charged for an extra unit of storage or projects
- **Units** is the number of units purchased
- **Unit Price** is the cost per unit
- **Days** is the total number of days in the month
- **Days Left in Month** is the number of days remaining in the month after going over your limit

Once an extra unit of storage or projects is allocated, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of storage or projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on current usage.
</Admonition>

**Compute**

Extra compute usage is available with the [Launch](/docs/introduction/plans#launch), [Scale](/docs/introduction/plans#scale), and [Business](/docs/introduction/plans#business) plans and is billed by _compute hour_ at $0.16 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the billing period, you are billed an extra $16 (100 x $0.16). Since extra compute usage is per hour, prorated billing does not apply.

## Extra usage examples

The following examples illustrate how extra storage is allocated and billed in Neon. The same method applies to extra project usage. The examples are based on the Scale plan, which comes with a 50 GiB storage allowance. The Launch plan has a different storage allowance (10 GiB) and cost per extra storage unit ($3.50 per 2 GiB), but the examples still apply.

### Example 1: Steady extra storage usage

This example illustrates how a steady amount of extra storage is billed.

**Plan**: Scale
**Period:** June 1st – June 30th  
**Usage:** Steady at 55 GiB throughout the month

| Item          | Details                                                                |
| ------------- | ---------------------------------------------------------------------- |
| Plan Fee      | 1 month = $69                                                          |
| Extra Storage | 10 GiB extra storage unit at $15/month from June 1st – June 30th = $15 |
| **Total**     | $84                                                                    |

### Example 2: Storage exceeds the limit at the start of the month

This example illustrates how extra storage is billed from the date the extra storage is allocated until the end of the month, not just for the days the storage limit was exceeded.

**Plan**: Scale
**Period:** June 1st – June 15th  
**Usage:** 55 GiB  
**Change:** On June 16th, usage decreased to 45 GiB until the end of the month

| Item          | Details                                                                |
| ------------- | ---------------------------------------------------------------------- |
| Plan Fee      | 1 month = $69                                                          |
| Extra Storage | 10 GiB extra storage unit at $15/month from June 1st – June 30th = $15 |
| **Total**     | $84                                                                    |

<Admonition type="note">
If usage remained at 45 GiB through to the end of July, no extra storage would be needed, and July's total would be $69 for the Scale plan.
</Admonition>

### Example 3: Storage spikes briefly at the end of the month

This example illustrates a prorated charge for extra storage that was allocated toward the end of the billing period. The charge is prorated from the date the extra storage usage was allocated.

**Plan**: Scale
**Period:**

- **June 1st – June 27th:** Usage up to 49 GiB
- **June 28th:** Usage increased to 55 GiB
- **June 29th:** Usage decreased back to 45 GiB and remained so until the end of the month

| Item          | Details                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------ |
| Plan Fee      | 1 month = $69                                                                              |
| Extra Storage | 10 GiB extra storage unit at $15/month prorated for 3 days (June 28th – June 30th) = $1.50 |
| **Total**     | $70.50                                                                                     |

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
