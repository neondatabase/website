---
title: Billing
enableTableOfContents: true
isDraft: true
---

## Overview

Neon offers offers the following plans: **Free Tier**, **Pro**, **Enterprise**, and **Platform Partnership**. The Pro plan is _usage-based_, which ensures that you never over-provision and only pay for what you use. The **Enterprise** and **Platform Partnership** plans are volume based and offer potential volume-based discounts. You can find more information about our [plans](#neon-plans) below.

## Neon billing metrics (Simplified version)

Neon's paid plans charge for usage based on the following metrics:

- **Reads**: The amount of data transferred out of Neon.
- **Writes**: The amount of data written for data changes.
- **Compute time**: The amount of active compute time.
- **Storage**: The amount of data stored in your Neon projects.

Usage costs are account based, but the Neon **Billing** page allows you to view usage by project. A Neon paid plan permit multiple Neon projects per account.

See [Billing metrics explained](#billing-metrics-explained) for a detailed description of each metric and how Neon calculates usage costs.

## Neon plans

|                          | Free Tier                         | Pro (usage based)| Enterprise (volume based) |Platform Partnership (volume based)|
|:-------------------------|:----------------------------------|:-----------------|:--------------------------|:----------------------|
|**Best for**              | Prototyping or personal use       | Business use, for setups with 1-3 active databases     | Database fleets           | database fleets or resale |
|**Projects**              | 1                                 | Unlimited        | Unlimited                 | Unlimited               |
|**Compute hours per month** | 100                             | Unlimited        | Unlimited                 | Unlimited               |
|**CPU**                   | 1 shared CPU                      | Up to X CPUs     | Up to X CPUs              | Up to X CPUs            |
|**RAM**                   | 1 GB                              | Up to X GB       | Up to X GB                | Up to X GB              |
|**Storage**               | 3 GB                              | Up to X GB       | Up to X GB                | Up to X GB              |
|**Dedicated resources**   | &#120;                            | &#120;           | &check;                   | &check;                 |
|**Auto-suspend compute**  | &check;                           | &check;          | &check;                   | &check;                 |
|**Always-on compute**     | &#120;                            | &check;          | &check;                   | &check;                 |
|**Project sharing**       | &#120;                            | &check;          | &check;                   | &check;                 |
|**Payment**               | Free                              | Credit Card, Pay As You Go with monthly invoicing | Prepaid, Custom Contract, Volume Discounts |Prepaid, Custom Contract, Wholesale Discounts|
|**Support**               | Community Support                 | Support          | Support                   |Support, Platform Support|

<Admonition type="info">
The limits described above are plan defaults. If you would like to adjust limits to tailor a plan to your specific requirements, please contact [support@neon.tech](mailto:support@neon.tech).
</Admonition>

For more information about our plans, please reach out to [support@neon.tech](mailto:support@neon.tech). Our [Pricing](https://neon.tech/pricing) page provides additional information and a calculator that you can use to estimate costs and determine which plan is right for you.

## Account billing page

Each Neon account has a billing page, where you can:

- View your current billing totals
- Start a paid subscription
- Update your payment details
- Download current and previous invoices

To access your billing page:

1. Navigate to the Neon Console.
1. Select **Billing** from the sidebar.

## Neon invoices

A Neon invoice includes the total cost for the billing period and a line item for each of Neon's [billing metrics](#neon-billing-metrics). Each line item is broken down by project and includes a per-unit cost calculation and a total cost. You can expand a line item to view daily usage chart.

The current invoice provides totals as of the current date.

### Download invoices

You can download invoices from the **Billing** page.

1. Navigate to the **Billing** page in the Neon Console. The current invoice is displayed.
1. Download the invoice:
    1. To download the current invoice, click **Download PDF** from the top of of the page.
    1. To download an invoice for a previous billing period, select the invoice from the **Latest invoices** list to open it, then click **Download PDF**.

## Cancel a subscription

To cancel your subscription to a Neon paid plan:

1. Navigate to the **Billing** page in the Neon Console.
1. Click **Cancel subscription**
1. In the **Cancel Subscription** dialog, enter your cancellation request, and click **Submit**.

This action initiates the cancellation. If your data exceeds  free-tier storage limits, you will be contacted by the Neon Support team with a request to reduce your storage before the paid plan is cancelled and free-tier limits are applied.

## Billing metrics explained

This section provides a detailed explanation of Neon's billing metrics, how they are calculated, and how you can manage associated costs.

### Writes

The **Writes** metric counts the amount of data changes written to the Write-Ahead Log (WAL) to ensure durability. Neon writes data changes to the WAL concurrently on multiple nodes to avoid compromising write speed.

The cost calculation for data changes written to the WAL is:

```text
written data (GiB) * price per GiB
```

### Reads

The **Reads** metric counts the amount of data transferred out of Neon (egress). Neon charges for each GiB of data transfer at the cost set by the cloud provider (e.g., at the cost set by AWS). Neon does not apply a margin to the data transfer cost.

The cost calculation for data transferred out of Neon is:

```text
data transferred (GiB) * price per GiB
```

### Compute time

The **Compute time** metric counts the amount of compute unit (CU) active time. The number of compute units depends on the number of compute endpoints you have and how many compute units per compute endpoint.  

The cost calculation for compute time is:

```text
compute units * active time (hours) * cost per hour
```

### Project storage

Project storage is the sum of the logical size of your data and the size of the Write-Ahead Log (WAL) for all of your Neon projects. The logical size is the sum of all database sizes in each Neon project. The size of the Write-Ahead Log (WAL) is dictated by factors described in the [Written data](#written-data) section above.

Project storage reflects the unique storage associated with a Neon project. Traditionally, database users are billed for logical data. However, to account for branching and Neon's PITR we came up with Project storage. This metric differs from logical storage by not duplicating storage that is shared between branches. This allows users to create many branches without increasing storage costs. i.e branch 20TB database so now you have 40TB of logical but only 20TB of Project storage since....

Cost calculation for compute time:

```text
stored data (GiB) * (seconds stored / 60) * cost per hour
```

## Billing terms and definitions

- Always-on compute: TBD
- Auto-suspend compute: TBD
- Auto-scaling: TBD
- Community support: TBD
- Compute time: TBD
- Compute endpoint: TBD
- Database branching: TBD
- Database fleets
- Data transfer: TBD
- Data storage: TBD
- Dedicated resources: TBD
- Enterprise plan: TBD
- Enterprise support: TBD
- Free Tier: TBD
- Paid plan: TBD
- Point-in-time restore window: TBD
- Pro plan: TBD
- Project sharing: TBD
- Resale: TBD
- Scale-to-zero: TBD
- Support: TBD
- Volume Discounts
- Wholesale Discounts
- Write-Ahead Log (WAL): TBD
- Written data: TBD
