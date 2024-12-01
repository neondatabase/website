---
title: Extra usage
enableTableOfContents: true
subtitle: Learn how extra usage works in Neon's pricing plans
redirectFrom:
  - /docs/introduction/billing-overview
updatedOn: '2024-10-07T18:18:31.787Z'
---

Neon plans are structured around **Allowances** and **Extra usage**. Allowances are included in your plan. With Neon's paid plans, you are automatically billed for extra usage when you go over your monthly allowances.

## Plan fees and allowances

This table provides an overview of plan fees with allowances for storage, compute, and projects:

| Plan       | Monthly Fee | Storage Allowance | Archive Storage Allowance         | Compute Allowance                                                                                                                                        | Project Allowance |
| :--------- | :---------- | :---------------- | :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Free Plan  | $0          | 0.5 GB-month      | Included in **Storage Allowance** | 191.9 compute hours/month&#8212;enough to run a primary 0.25 CU compute 24/7; up to 5 of those compute hours can be used for non-default branch computes | 10 projects       |
| Launch     | $19         | 10 GB-month       | 50 GB-month                       | 300 compute hours per month                                                                                                                              | 100 projects      |
| Scale      | $69         | 50 GB-month       | 250 GB-month                      | 750 compute hours per month                                                                                                                              | 1000 projects     |
| Business   | $700        | 500 GB-month      | 2500 GB-month                     | 1000 compute hours per month                                                                                                                             | 5000 projects     |
| Enterprise | Custom      | Custom            | Custom                            | Custom                                                                                                                                                   | Custom            |

The [Enterprise](/docs/introduction/plans#enterprise) plan is fully customizable with respect to allowances. Please contact [Sales](/contact-sales) for more information.

<Admonition type="tip" title="What is a compute hour?">

- A **compute hour** is one _active hour_ for a compute with 1 vCPU. For a compute with .25 vCPU, it takes 4 _active hours_ to use 1 compute hour. On the other hand, if your compute has 4 vCPUs, it takes only 15 minutes to use 1 compute hour.
- An **active hour** is a measure of the amount of time a compute is active. The time your compute is idle when suspended due to inactivity is not counted.
- **Compute hours formula**

  ```
  compute hours = compute size * active hours
  ```

</Admonition>

## Extra usage

The [Launch](/docs/introduction/plans#launch), [Scale](/docs/introduction/plans#scale), and [Business](/docs/introduction/plans#business) plans permit extra usage beyond the allowances included with the monthly fee. The extra usage types that are available differ by plan.

### Launch plan

The Launch plan supports extra **Storage**, **Archive Storage**, and **Compute**. If you need extra projects, you'll need to move up to the Scale or Business plan.

- **Extra Storage**: If you exceed 10 GB, extra storage is $1.75 per GB-month.
- **Extra Archive Storage**: If you exceed x GB, extra storage is $0.10 per GB-month.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16 per compute hour.

| Resource              | Unit         | Price |
| :-------------------- | :----------- | :---- |
| Extra Storage         | GB-month     | $1.75 |
| Extra Archive Storage | GB-month     | $0.10 |
| Extra Compute         | Compute hour | $0.16 |

### Scale plan

The Scale plan supports extra **Storage**, **Archive Storage**, **Compute**, and **Projects**.

- **Extra Storage**: If you exceed 50 GB, extra storage is $1.50 per GB-month.
- **Extra Archive Storage**: If you exceed x GB, extra storage is $0.10 per GB-month.
- **Extra Compute**: If you exceed 750 compute hours, extra compute is billed at $0.16 per compute hour.
- **Extra Projects**: If you exceed 50 projects, extra projects are allocated in units of 500 projects at $50 per unit.

| Resource              | Unit         | Price  |
| :-------------------- | :----------- | :----- |
| Extra Storage         | GB-month     | $1.50  |
| Extra Archive Storage | GB-month     | $0.10  |
| Extra Compute         | Compute hour | $0.16  |
| Extra Projects        | 1000         | $50.00 |

### Business plan

The Business plan supports extra **Storage**, **Archive Storage**, **Compute**, and **Projects**.

- **Extra Storage**: If you exceed 500 GB, extra storage is $0.50 per GB-month.
- **Extra Archive Storage**: If you exceed x GB, extra storage is $0.10 per GB-month.
- **Extra Compute**: If you exceed 1,000 compute hours, extra compute is billed at $0.16 per compute hour.
- **Extra Projects**: If you exceed 5000 projects, extra projects are allocated in units of 5000 projects at $50 per unit.

| Resource              | Unit         | Price  |
| :-------------------- | :----------- | :----- |
| Extra Storage         | GB-month     | $0.50  |
| Extra Archive Storage | GB-month     | $0.10  |
| Extra Compute         | Compute hour | $0.16  |
| Extra Projects        | 5000         | $50.00 |

## How does extra usage work?

Taking advantage of extra usage requires no user action. Extra usage, if supported with your plan, is allocated and billed by default. If you use more storage, archive storage, compute, or projects than your monthly allowance provides, the extra usage is automatically allocated and charged to your monthly bill.

**Storage**

For example, the Launch plan includes a 10 GB-month storage allowance in the plan's monthly fee. If you exceed that allowance, you are automatically allocated extra storage at $1.75 per GB-month. It works the same way on the Scale and Business plans, but the per GB-month fee is less on the Scale and Business plans.

<Admonition type="note">
In the context of billing, allocation of extra storage refers to an increase in the storage allowance rather than physical storage allocation.
</Admonition>

**Projects**

On the [Scale](/docs/introduction/plans#scale) and [Business](/docs/introduction/plans#business) plans, extra projects are allocated in units of 1000 on Scale and 5000 on Business. For example, the Scale plan has an allowance of 1000 projects. If you use more than 1000 projects, you are automatically allocated an extra unit of 1000 projects at $50 per unit. For example, if you use 1001 projects, you are allocated 1 unit of 1000 projects (an extra $50). If you use 2001 projects, you are allocated 2 units of 1000 projects (an extra $100), and so on. The extra charge is prorated from the date the extra usage was allocated, meaning that you are not billed the full amount if extra project units are allocated partway through the month.

<Admonition type="note" title="How extra storage and project charges are prorated">
The proration formula for calculating the cost of extra projects allocated during a monthly billing period is:

```plaintext
Cost = Units x (Unit Price/Days in Month) x Days Left in Month
```

Where:

- **Cost** is the amount charged for an extra unit of projects
- **Units** is the number of units purchased
- **Unit Price** is the cost per unit
- **Days** is the total number of days in the month
- **Days Left in Month** is the number of days remaining in the month after going over your limit

Once an extra unit of projects is allocated, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on current usage.
</Admonition>

**Compute**

Extra compute usage is available with the [Launch](/docs/introduction/plans#launch), [Scale](/docs/introduction/plans#scale), and [Business](/docs/introduction/plans#business) plans and is billed by _compute hour_ at $0.16 per hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use 100 additional compute hours over the billing period, you are billed an extra $16 (100 x $0.16). Since extra compute usage is per hour, prorated billing does not apply.

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
