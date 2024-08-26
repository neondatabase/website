---
title: Pricing estimation guide
enableTableOfContents: true
subtitle: Estimate your monthly bill with Neon
redirectFrom:
  - /docs/introduction/how-billing-works#neon-pricing-estimation-guide
updatedOn: '2024-08-06T15:23:10.954Z'
---

You can use this guide to estimate your monthly bill with Neon based on your selected plan and estimated usage.

1. [Select your plan and note the monthly fee](#step-1-select-a-plan-and-note-the-monthly-fee)
2. [Estimate your usage](#step-2-estimate-your-usage)
3. [Calculate extra usage fees (if applicable)](#step-3-calculate-extra-usage-fees)
4. [Total monthly estimate](#step-4-total-monthly-estimate)

## Step 1: Select a plan and note the monthly fee

First, select a plan that best fits your requirements. Look closely at monthly fees, plan allowances, and the features that come with each plan. You can refer to our [Plans](/docs/introduction/plans) page or the Neon [Pricing](https://neon.tech/pricing) page, which provides fees and a detailed plan comparison.

This table provides an overview of plan fees with allowances for storage, compute, and projects:

| Plan       | Monthly Fee | Storage Allowance | Compute Allowance                                                            | Project Allowance |
| ---------- | ----------- | ----------------- | ---------------------------------------------------------------------------- | ----------------- |
| Free Plan  | $0          | 0.5 GiB           | Always-available default branch compute, 5 compute hours for branch computes | 1 project         |
| Launch     | $19         | 10 GiB            | 300 compute hours                                                            | 10 projects       |
| Scale      | $69         | 50 GiB            | 750 compute hours                                                            | 50 projects       |
| Enterprise | Custom      | Custom            | Custom                                                                       | Custom            |

<Admonition type="note" title="Notes">
For the Enterprise plan, please contact our [Sales](/contact-sales) team for an estimate based on your custom needs.
</Admonition>

## Step 2: Estimate your usage

Estimate your monthly usage to see if any "extra usage" is required beyond the storage, compute, or project allowances included in your plan.

- **Storage (GiB)**: How much storage do you expect to use? Storage includes the size of your data and change history. For more information, see [Storage](/docs/introduction/usage-metrics#storage).
- **Compute (Hours)**: How many compute hours will you require? A compute hour is 1 active hour on a compute with 1 vCPU. Neon supports compute sizes ranging from .25 vCPU to 10 vCPU. See [Compute](/docs/introduction/usage-metrics#compute) for a compute hour formula you can use to estimate your compute usage.
- **Projects**: How many projects do you need? Neon recommends a project per application.

## Step 3: Calculate extra usage fees

Based on your usage estimates, calculate the fees for extra storage units, compute hours, and project units.

<Admonition type="important">
**On paid plans, extra usage is allocated and billed automatically when you exceed plan allowances** 
- However, extra usage fees for storage and projects are prorated for the month from the date of purchase, meaning that you are not billed the full amount if extra units of storage or projects are allocated partway through the month. 
- Once an extra unit of storage or projects is allocated, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of storage or projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on current usage. For more, see [Extra usage](/docs/introduction/billing/extra-usage).
</Admonition>

### For the Launch plan:

The Launch plan supports extra **Storage** and **Compute**. If you need extra projects, you'll need to move up to the Scale or Business plan.

- **Extra Storage**: If you exceed 10 GiB, extra storage is allocated in units of 2 GiB at $3.50 per unit.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16/hour.

| Resource      | Unit         | Price |
| ------------- | ------------ | ----- |
| Extra Storage | 2 GiB        | $3.50 |
| Extra Compute | Compute hour | $0.16 |

### For the Scale plan:

The Scale plan supports extra **Storage**, **Compute**, and **Projects**.

- **Extra Storage**: If you exceed 50 GiB, extra storage is allocated in increments of 10 GiB at $15 per increment.
- **Extra Compute**: If you exceed 750 compute hours, extra compute is billed at $0.16/hour.
- **Extra Projects**: If you exceed 50 projects, extra projects are allocated in units of 10 projects at $50 per unit.

| Resource       | Unit         | Price  |
| -------------- | ------------ | ------ |
| Extra Storage  | 10 GiB       | $15.00 |
| Extra Compute  | Compute hour | $0.16  |
| Extra Projects | 10           | $50.00 |

## Step 4: Total monthly estimate

Add up your plan's monthly fee and extra usage fees to estimate your total monthly bill.

```plaintext
Total Estimate = Plan Fee + Extra Storage Fee + Extra Compute Fee + Extra Project Fee
```

### Launch plan example

| Item               | Details                             |
| ------------------ | ----------------------------------- |
| Plan Fee           | $19                                 |
| Storage Usage      | 14 GiB (4 GiB over, $7 extra)       |
| Compute Usage      | 350 hours (50 hours over, $8 extra) |
| **Total Estimate** | $34 per month                       |

### Scale plan example

| Item               | Details                             |
| ------------------ | ----------------------------------- |
| Plan Fee           | $69                                 |
| Storage Usage      | 60 GiB (10 GiB over, $15 extra)     |
| Compute Usage      | 800 hours (50 hours over, $8 extra) |
| Project Usage      | 55 projects (5 over, $50 extra)     |
| **Total Estimate** | $142 per month                      |

For examples illustrating extra usage incurred mid-month, usage fluctuations during the billing period, and prorated charges, see [Extra usage](/docs/introduction/extra-usage).

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
