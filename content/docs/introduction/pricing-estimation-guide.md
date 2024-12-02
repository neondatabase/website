---
title: Pricing estimation guide
enableTableOfContents: true
subtitle: Estimate your monthly bill with Neon
redirectFrom:
  - /docs/introduction/how-billing-works#neon-pricing-estimation-guide
updatedOn: '2024-12-01T21:48:07.696Z'
---

You can use this guide to estimate your monthly bill with Neon based on your selected plan and estimated usage.

1. [Select your plan and note the monthly fee](#step-1-select-a-plan-and-note-the-monthly-fee)
2. [Estimate your usage](#step-2-estimate-your-usage)
3. [Calculate extra usage fees (if applicable)](#step-3-calculate-extra-usage-fees)
4. [Total monthly estimate](#step-4-total-monthly-estimate)

## Step 1: Select a plan and note the monthly fee

First, select a plan that best fits your requirements. Look closely at monthly fees, plan allowances, and the features that come with each plan. You can refer to our [Plans](/docs/introduction/plans) page or the Neon [Pricing](https://neon.tech/pricing) page, which provides fees and a detailed plan comparison.

This table provides an overview of plan fees with allowances for storage, archive storage, compute, and projects:

| Plan       | Monthly Fee | Storage      | Archive Storage         | Compute                      | Projects      |
| :--------- | :---------- | :----------- | :---------------------- | :--------------------------- | :------------ |
| Free Plan  | $0          | 0.5 GB-month | Included in **Storage** | 191.9 compute hours          | 10 projects   |
| Launch     | $19         | 10 GB-month  | 50 GB-month             | 300 compute hours per month  | 100 projects  |
| Scale      | $69         | 50 GB-month  | 250 GB-month            | 750 compute hours per month  | 1000 projects |
| Business   | $700        | 500 GB-month | 2500 GB-month           | 1000 compute hours per month | 5000 projects |
| Enterprise | Custom      | Custom       | Custom                  | Custom                       | Custom        |

<Admonition type="note" title="Notes">
For the Enterprise plan, please contact our [Sales](/contact-sales) team for an estimate based on your custom needs.
</Admonition>

## Step 2: Estimate your usage

Estimate your monthly usage to see if any "extra usage" is required beyond the storage, compute, or project allowances included in your plan.

- **Storage (GB-month)**: How much storage do you expect to use? This includes:
  - The logical data size of your data
  - The size of your history, determined by your [history retention](/docs/introduction/point-in-time-restore#history-retention) setting in Neon and the volume of insert, update, and delete operations written to your history. See [Storage](/docs/introduction/usage-metrics#storage).
- **Archive Storage (GB-month)**: How much archive storage do you expect to use?
  - Branches **older than 14 days** and **not accessed for the past 24 hours** are moved to cost-efficient archive storage automatically. For more, see [Branch archiving](/docs/guides/branch-archiving).
  - This will only apply if you have branches that are not accessed regularly.
- **Compute (Hours)**: How many compute hours will you require? A compute hour is 1 active hour on a compute with 1 vCPU. Neon supports compute sizes ranging from .25 vCPU to 10 vCPU. See [Compute](/docs/introduction/usage-metrics#compute) for a compute hour formula you can use to estimate your compute usage.
- **Projects**: How many projects do you need? Neon recommends a project per application. Most users do no exceed Neon's project allowances.

## Step 3: Calculate extra usage fees

Based on your usage estimates, calculate the fees for storage, archive storage, compute hours, and projects.

<Admonition type="important" title="extra project usage">
**On paid plans, extra project usage is allocated and billed automatically when you exceed plan allowances** 
- However, the extra usage fee for projects is prorated for the month from the date of purchase, meaning that you are not billed the full amount if extra project units are allocated partway through the month. 
- Once an extra unit of projects is allocated, you are billed for that extra unit for the remainder of the month. If you reduce your usage during that month and no longer require extra units of projects, the extra usage charge is dropped at the beginning of the next month when your bill resets based on current usage. For more, see [Extra usage](/docs/introduction/extra-usage).
</Admonition>

### For the Launch plan:

The Launch plan supports extra **Storage**, **Archive Storage**, and **Compute**. If you need extra projects, you'll need to move up to the Scale or Business plan.

- **Extra Storage**: If you exceed 10 GB, extra storage is $1.75 per GB-month.
- **Extra Archive Storage**: If you exceed x GB, extra storage is $0.10 per GB-month.
- **Extra Compute**: If you exceed 300 compute hours, extra compute is billed at $0.16 per compute hour.

| Resource              | Unit         | Price |
| --------------------- | ------------ | ----- |
| Extra Storage         | GB-month     | $1.75 |
| Extra Archive Storage | GB-month     | $0.10 |
| Extra Compute         | Compute hour | $0.16 |

### For the Scale plan:

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

### For the Business plan:

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

## Step 4: Total monthly estimate

Add up your plan's monthly fee and extra usage fees to estimate your total monthly bill.

```plaintext shouldWrap
Total Estimate = Plan Fee + Extra Storage Fee + Extra Archive Storage Fee + Extra Compute Fee + Extra Project Fee
```

### Launch plan example

| Item                  | Details                               |
| :-------------------- | :------------------------------------ |
| Plan Fee              | $19                                   |
| Storage Usage         | 14 GB (4 GB over, $7 extra)           |
| Archive Storage Usage | 40 GB (within the plan allowance, $0) |
| Compute Usage         | 350 hours (50 hours over, $8 extra)   |
| **Total Estimate**    | $34 per month                         |

### Scale plan example

| Item                  | Details                                        |
| :-------------------- | :--------------------------------------------- |
| Plan Fee              | $69                                            |
| Storage Usage         | 60 GB (10 GB over, $15 extra)                  |
| Archive Storage Usage | 100 GB (50 GB over, $5 extra)                  |
| Compute Usage         | 800 hours (50 hours over, $8 extra)            |
| Project Usage         | 1005 projects (5 over, $50 extra for 500 pack) |
| **Total Estimate**    | $147 per month                                 |

### Business plan example

| Item                  | Details                                           |
| :-------------------- | :------------------------------------------------ |
| Plan Fee              | $700                                              |
| Storage Usage         | 510 GB (20 GB over, $15 extra)                    |
| Archive Storage Usage | 300 GB (within the plan allowance, $0)            |
| Compute Usage         | 1,150 hours (150 hours over, $24 extra)           |
| Project Usage         | 5108 projects (108 over, $50 extra for 5000 pack) |
| **Total Estimate**    | $789 per month                                    |

For more examples, see [Extra usage](/docs/introduction/extra-usage).

## Feedback

We’re always looking for ways to improve our pricing model to make it as developer-friendly as possible. If you have feedback for us, let us know via the [Feedback](https://console.neon.tech/app/projects?modal=feedback) form in the Neon Console or our [feedback channel](https://discord.com/channels/1176467419317940276/1176788564890112042) on Discord. We read and consider every submission.

<NeedHelp/>
