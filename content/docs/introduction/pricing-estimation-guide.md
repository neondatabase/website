---
title: Pricing estimation guide
enableTableOfContents: true
subtitle: Estimate your monthly bill with Neon Postgres
redirectFrom:
  - /docs/introduction/how-billing-works#neon-pricing-estimation-guide
---

You can use this guide to estimate your monthly bill with Neon based on your selected plan and estimated usage.

1. [Select your plan and note the monthly fee](#step-1-select-a-plan-and-note-the-monthly-fee)
2. [Estimate your usage]()
3. [Calculate extra usage fees (if applicable)]()
4. [Total monthly estimate]()

### Step 1: Select a plan and note the monthly fee

First, select a plan that best fits your requirements. Look closely at monthly fees, plan allowances, and the features that come with each plan. You can refer to our [Plans](/docs/introduction/plans) page for that information or the Neon [Pricing](https://neon.tech/pricing), which provides a detailed plan comparison.

This table provides an overview of plan fees with allowances for storage, compute, and projects:

| Plan       | Monthly Fee       | Storage Allowance | Compute Allowance | Project Allowance     |
|------------|-------------------|-------------------|-------------------|-----------------------|
| Free Tier  | $0                | 0.5 GiB           | Always-available primary branch compute, 5 compute hours (20 _active hours_)/month on branch computes                 | 1 project             |
| Launch     | $19               | 10 GiB            | 300 compute hours (1,200 _active hours_)/month for all computes in all projects         | 10 projects           |
| Scale      | $69               | 50 GiB            | 750 compute hours (3,000 _active hours_)/month for all computes in all projects         | 50 projects           |
| Enterprise | Custom (Contact Sales) | Custom        | Custom            | Custom               |

### Step 2: Estimate your usage

Estimate your monthly usage to see if any "extra usage" is required beyond the storage, compute, or project allowances included in your plan.

- **Storage (GiB)**: How much storage do you expect to use?  Storage includes the size of your data and change history. For more information, see [Storage](/docs/introduction/usage-metrics#storage).
- **Compute (Hours)**: How many compute hours will you require? A compute hour is 1 active hour on a compute with 1 vCPU. Neon supports compute sizes ranging from .25 vCPU to 8 vCPU. See [Compute](/docs/introduction/usage-metrics#compute) for a compute hour formula you can use to estimate your compute hour usage.
- **Projects**: How many projects do you need? Neon recommends a project per application or client.

### Step 3: Calculate extra usage fees

Based on your usage estimates, calculate the fees for extra storage units, compute hours, and project units.

<Admonition type="important">
Extra usage fees are prorated for the month, meaning that you are not billed the full amount if you purchase units of extra storage or projects partway through the month. However, once you purchase an extra unit of storage or projects, you are billed for that extra unit through to the end of the month. If you reduce your storage or number of projects so that you no longer require extra units, the extra usage charge is removed at the beginning of the next month when your bill resets based on current usage. For a fuller explanation with examples, see [Extra usage](/docs/introduction/billing/extra-usage).
</Admonition>

#### For the Launch plan:

The Launch plan supports extra **Storage** and **Compute**. If you need extra projects, you'll need to move up to the Scale plan.

- **Extra Storage**: If you exceed 10 GiB, extra storage is billed in units of 2 GiB at $3.5 per unit.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16/hour.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 2 GiB        | $3.50     |
| Extra Compute  | Compute hour | $0.16     |


#### For the Scale plan:

The Scale plan supports extra **Storage**, **Compute**, and **Projects**.

- **Extra Storage**: If you exceed 50 GiB, extra storage is billed in increments of 10 GiB at $15 per increment.
- **Extra Compute**: If you exceed 750 compute hours, extra compute is billed at $0.16/hour.
- **Extra Projects**: If you exceed 50 projects, extra projects are billed in units of 10 projects at $50 per unit.

| Resource | Unit         | Price     |
|----------|--------------|-----------|
| Extra Storage  | 10 GiB        | $15.00     |
| Extra Compute  | Compute hour | $0.16     |
| Extra Projects  | 10 | $50.00     |

### Step 4: Total monthly estimate

Add up the base monthly fee and any extra usage fees to estimate your total monthly bill.

```
Total Monthly Estimate = Monthly Base Fee + Extra Storage Fee + Extra Compute Fee + Extra Project Fee
```

**Launch plan example**:

- Base fee: $19
- Storage usage: 14 GiB (4 GiB over the allowance)
- Compute usage: 350 hours (50 hours over the allowance)
- Extra storage fee: 2 * $3.5 = $7
- Extra compute fee: 50 hours * $0.16 = $8

_Total estimate_: $19 + $7 + $8 = $34 per month

**Scale plan example**:

- Base fee: $69
- Storage usage: 60 GiB (10 GiB over the allowance)
- Compute usage: 800 hours (50 hours over the allowance)
- Project usage: 55 projects (5 projects over the allowance)
- Extra storage fee: 1 * $15 = $15
- Extra compute fee: 50 * $0.16 = $8
- Extra project fee: 1 * $50 = $50

_Total estimate_: $69 + $15 + $8 + $50 = $142 per month

<Admonition type="note" title="Notes">
For Enterprise plan users, please contact our [Sales](/contact-sales) team for an estimate based on your custom needs.
</Admonition>