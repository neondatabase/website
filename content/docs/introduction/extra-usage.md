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
| Free Tier  | $0                | 0.5 GiB           | Always-available primary branch compute, 5 compute hours for branch computes                 | 1 project             |
| Launch     | $19               | 10 GiB            | 300 compute hours         | 10 projects           |
| Scale      | $69               | 50 GiB            | 750 compute hours         | 50 projects           |
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

- **Extra Storage**: If you exceed 10 GiB, extra storage is billed in units of 2 GiB at $3.5 per unit.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16/hour.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 2 GiB        | $3.50     |
| Extra Compute  | Compute hour | $0.16     |


### Scale plan

The Scale plan supports extra **Storage**, **Compute**, and **Project** usage.

- **Extra Storage**: If you exceed 50 GiB, extra storage is billed in increments of 10 GiB at $15 per increment.
- **Extra Compute**: If you exceed 750 compute hours, extra compute is billed at $0.16/hour.
- **Extra Projects**: If you exceed 50 projects, extra projects are billed in units of 10 projects at $50 per unit.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 10 GiB        | $15.00     |
| Extra Compute  | Compute hour | $0.16     |
| Extra Projects  | 10 | $50.00     |

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is available by default. If you use more storage, compute, or projects than your monthly allowance provides, the extra usage is automatically added to your monthly bill, prorated for the month.

For example, the Launch plan includes an allowance of 10 GiB in the plan's monthly fee. If you exceed 10 GiB of storage at any point during the month, you are automatically billed for an extra storage unit of 2 GiB at $3.50 per unit. If you exceed 12 GiB, you are billed for 2 units of 2 GiB (an extra $7), and so on. It works the same way on the Scale plan, but with 10 GiB units of storage at $15 per unit. However, the extra storage charge is prorated for the month, meaning that you are not billed the full amount if you purchase units of extra storage or projects partway through the month.

Extra project, which is available with the [Scale](/docs/introduction/plans##scale) plan, works in the same way. Extra projects are billed in units of 10. For example, the Scale plan has an allowance of 50 projects. If you use more than 50 projects, you are automatically billed for an extra package of 10 projects at $50 per package. For example, if you use 51 projects, you are billed for 1 package of 10 projects (an extra $50). If you use 61 projects, you are billed for 2 packages of 10 projects (an extra $100), and so on. Charges for extra project units are also prorated for the month.

<Admonition type="note" title="How extra storage and project charges are prorated">
The proration formula for calculating the cost of extra storage purchased during a monthly billing period is:

```plaintext
Cost = Units x (Unit Price/Days in Month) x Days Left in Month
```
​
Where:

- **Cost** is the amount charged for an extra unit of storage or projects. 
- **Units** is the number of units purchased.
- **Unit Price** is the cost per storage unit.
- **Days** is the total number of days in the month.
- **Days Left in Month** is the number of days remaining in the month after going over the storage limit.

Once you purchase an extra unit of storage or projects, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of storage or projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on your current usage.
</Admonition>

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans. Extra compute usage is billed by _compute hour_ at $0.16 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the billing period, you are billed an extra $16 (100 x $0.16). Since extra compute usae is per hour, the prorartion does not apply as it does for extra storage or projects.

## Extra usage examples



