---
title: Extra usage
enableTableOfContents: true
subtitle: Learn how extra usage works in Neon's pricing plans
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-02-22T14:29:54.384Z'
---

Neon plans are structured around **Allowances** and **Extra usage**. Allowances are included in your plan. With Neon's paid plans, extra usage is available for a fee.

## Plan fees and allowances

This table provides an overview of plan fees with allowances for storage, compute, and projects:

| Plan       | Monthly Fee       | Storage Allowance | Compute Allowance | Project Allowance     |
|------------|-------------------|-------------------|-------------------|-----------------------|
| Free Tier  | $0                | 0.5 GiB           | Always-available primary branch compute, 5 compute hours (20 _active hours_)/month on branch computes                 | 1 project             |
| Launch     | $19               | 10 GiB            | 300 compute hours (1,200 _active hours_)/month        | 10 projects           |
| Scale      | $69               | 50 GiB            | 750 compute hours (3,000 _active hours_)/month         | 50 projects           |
| Enterprise | Custom | Custom        | Custom            | Custom               |

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

The [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans permit extra usage beyond the allowances included with the monthly fee. The extra usage types that are available differ by plan.

### Launch plan

The Launch plan supports extra **Storage** and **Compute** usage. If you need extra projects, you'll need to move up to the Scale plan.

- **Extra Storage**: If you exceed 10 GiB, extra storage is billed for in units of 2 GiB at $3.5 per unit.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16/compute hour.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 2 GiB        | $3.50 per unit      |
| Extra Compute  | Compute hour | $0.16     |


### Scale plan

The Scale plan supports extra **Storage**, **Compute**, and **Project** usage.

- **Extra Storage**: If you exceed 50 GiB, extra storage is billed for in units of 10 GiB at $15 per unit.
- **Extra Compute**: If you exceed 750 compute hours, extra compute is billed at $0.16/compute hour.
- **Extra Projects**: If you exceed 50 projects, extra projects are billed for in units of 10 projects at $50 per unit.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 10 GiB        | $15.00 per unit     |
| Extra Compute  | Compute hour | $0.16     |
| Extra Projects  | 10 | $50.00 per unit    |

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is available by default. If you use more storage, compute, or projects than your monthly allowance provides, the extra usage is automatically added to your monthly bill, prorated from the date the extra usage was incurred.

**Storage**

For example, the Launch plan includes an allowance of 10 GiB in the plan's monthly fee. If you exceed 10 GiB of storage at any point during the month, you are automatically billed for an extra storage unit of 2 GiB at $3.50 per unit. If you exceed 12 GiB, you are billed for 2 units of 2 GiB (an extra $7), and so on. It works the same way on the Scale plan, but with 10 GiB units of storage at $15 per unit. However, the extra storage charge is prorated from the date the extra usage was incurred, meaning that you are not billed the full amount if you purchase units of extra storage or projects partway through the month.

**Projects**

Billing for extra projects, which are available with the [Scale](/docs/introduction/plans##scale) plan, works in the same way as storage. Extra projects are billed for in units of 10. For example, the Scale plan has an allowance of 50 projects. If you use more than 50 projects, you are automatically billed for an extra unit of 10 projects at $50 per unit. For example, if you use 51 projects, you are billed for 1 unit of 10 projects (an extra $50). If you use 61 projects, you are billed for 2 units of 10 projects (an extra $100), and so on. Charges for extra project units are also prorated from the date the extra usage was incurred.

<Admonition type="note" title="How extra storage and project charges are prorated">
The proration formula for calculating the cost of extra storage or projects purchased during a monthly billing period is:

```plaintext
Cost = Units x (Unit Price/Days in Month) x Days Left in Month
```
​
Where:

- **Cost** is the amount charged for an extra unit of storage or projects
- **Units** is the number of units purchased
- **Unit Price** is the cost per storage unit
- **Days** is the total number of days in the month
- **Days Left in Month** is the number of days remaining in the month after going over the storage limit

Once you purchase an extra unit of storage or projects, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of storage or projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on current usage.
</Admonition>

**Compute**

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans, and is billed by _compute hour_ at $0.16 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the billing period, you are billed an extra $16 (100 x $0.16). Since extra compute usage is per hour, proration does not apply.

## Extra usage examples

The following examples illustrate how extra storage usage is billed in Neon. The same approach applies to extra project usage. The examples are based on the Scale plan, which comes with a 50 GiB storage allowance. The Launch plan has a different storage allowance (10 GiB) and cost per extra storage unit ($3.50 per 2 GiB), but the same methodology applies.

### Example 1: Steady extra storage usage

This example illustrates how steady extra storage usage is billed.

**Period:** June 1st – June 30th  
**Usage:** Steady at 55 GiB throughout the month

| Item          | Details                            |
|---------------|------------------------------------|
| Plan Fee      | 1 month = $69                                |
| Extra Storage | 10 GiB extra storage pack at $15/month from June 1st – June 30th = $15    |
| **Total**| $84                 |

### Example 2: Storage exceeds the limit at the start of the month

This example illustrates how extra storage is billed from the date the extra storage is allocated until the end of the month, not just for the days the storage limit was exceeded.

**Period:** June 1st – June 15th  
**Usage:** 55 GiB  
**Change:** On June 16th, usage decreased to 45 GiB until the end of the month

| Item          | Details                            |
|---------------|------------------------------------|
| Plan Fee      | 1 month = $69                                |
| Extra Storage | 10 GiB extra storage pack at $15/month from June 1st – June 30th = $15    |
| **Total**| $84                 |

<Admonition type="note">
If usage remained at 45 GiB through July, no extra storage would be needed, and July's total would be $69 for the Scale plan.
</Admonition> 

### Example 3: Storage exceeds and falls below the limit at the end of the month

This example illustrates a prorated charge for extra storage that was incurred toward the end of the billing period. The charge is prorated from the date the extra storage was allocated.

**Period:** 
- **June 1st – June 27th:** Usage up to 49 GiB
- **June 28th:** Usage increased to 55 GiB
- **June 29th:** Usage decreased back to 45 GiB and remained so until the end of the month

| Item          | Details                            |
|---------------|------------------------------------|
| Plan Fee      | 1 month = $69                                |
| Extra Storage | 10 GiB extra storage pack at $15/month prorated for 3 days (June 28th – June 30th) = $1.50    |
| **Total**| $70.50                 |

