---
title: Billing
enableTableOfContents: true
isDraft: true
---

## Overview

Neon offers offers three plans: **Free Tier**, **Pro**, and **Enterprise**. You can find details about our [plans](#neon-plans) below.

## Neon billing metrics

Neon's paid plans charge for usage based on the following metrics:

- **Written data (GiB)**: The amount of data in written to the Write-Ahead Log (WAL) to support your point-in-time restore window and database branches.
- **Data transfer (GiB)**: The amount of data transferred from Neon (out of AWS storage), charged for at cloud-provider cost.
- **Compute time (per hour)**: The amount of active compute time, dictated by the number of compute endpoints and your scale-to-zero and autoscaling settings.
- **Data storage (GiB)**: The amount of data stored in your Neon projects. Stored data includes the logical size of your data and the size of the the Write-Ahead Log (WAL).

For more information about Neon's billing metrics, see [Billing metrics explained](#billing-metrics-explained).

## Neon plans

|                          | Free Tier                         | Pro              | Enterprise                |
|:-------------------------|:----------------------------------|:-----------------|:--------------------------|
|**Best for**              | Prototyping or personal use       | Business use     | Database fleets and resale|
|**Projects**              | 1                                 | Unlimited        | Unlimited                 |
|**Compute hours per month** | 100                             | Unlimited        | Unlimited                 |
|**CPU**                   | 1 shared CPU                      | Up to X CPUs     | Up to X CPUs              |
|**RAM**                   | 1 GB                              | Up to X GB       | Up to X GB                |
|**Storage**               | 3 GB                              | Up to X GB       | Up to X GB                |
|**Dedicated resources**   | &#120;                            | &#120;           | &check;                   |
|**Auto-suspend compute**  | &check;                           | &check;          | &check;                   |
|**Always-on compute**     | &#120;                            | &check;          | &check;                   |
|**Project sharing**       | &#120;                            | &check;          | &check;                   |
|**Payment**               | Free                              | Credit Card, Pay As You Go with monthly invoicing | Prepaid, Custom Contracts, Volume Discounts |
|**Support**               | Community                         | Support          | Support, Platform Support |

For more information about our **Pro** and **Enterprise** plans, please reach out to [sales@neon.tech](mailto:support@neon.tech). Our [Pricing](https://neon.tech/pricing) page provides additional information about our plans and a calculator that you can use to estimate costs and determine which plan is right for you.

## Account billing page

Each Neon account has a billing page, where you can:

- View your current billing totals
- Start a paid subscription
- Update your payment details
- Download current and previous invoices

To access your billing page:

1. Navigate to the Neon Console
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

### Written data

**Written data** is the amount of data in written to the Write-Ahead Log (WAL), which is a journal that keeps track of the changes to your data. Neon uses the WAL to keep a database change history, allowing you to restore data to a previous point in time (referred to as _point-in-time restore_). By default, Neon keeps a point-in-time restore window of 7 days, allowing you to create a database branch with data as it existed up to 7 days in the past. The Write-Ahead Log (WAL) also supports database branches. Each branch is a copy of your data (a snapshot) which will have its own point-in-time restore window as the branch ages and you make changes to the branch's data. The WAL holds a record of data in a branch. Removing a branch allows its data to be garbage collected as it ages out of the parent branch's point-in-time restore window, assuming no other branches hold the same data. You can manage the amount of **Written data** by adjusting your point-in-time restore window and removing old branches.

Cost calculation for written data:

```text
data written (GiB) * price per GiB
```

### Data transfer

**Data transfer** is the amount of data transferred (egressed) from Neon (out of AWS storage). Neon charges for each GiB of data transfer at the cost set by AWS in the region your Neon project is hosted. If you have a significant amount of data transfer, please contact the Neon Sales team to discuss possible volume-based solutions to reduce data transfer costs.

Cost calculation for data transfer:

```text
data written (GiB) * price per GiB
```

### Compute time

Compute time depends on the the amount of time compute endpoints are active and the number of compute units. Your workload, _scale-to-zero_, and _always-on compute_ settings influence the amount of active compute time. Neon is able to scale a compute endpoint to zero after 5 minutes of inactivity. Enabling _always-on compute_, keeps a compute endpoint active at all times to avoid cold restarts and connection latency, but adds to active compute time. The number of compute endpoints and your _autoscaling_ settings determine the amount of compute units. With autoscaling, you can specify a minimum and maximum number of compute units (cores) for each compute endpoint. Neon automatically adjusts compute resources within the minimum and maximum boundaries as your workload fluctuates.

Cost calculation for compute time:

```text
number of CPU cores * (seconds active) / 60) * cost per hour
```

### Data storage

Data storage is the sum of the logical size of your data and the size of the Write-Ahead Log (WAL) for all of your Neon projects. The logical size is the sum of all database sizes in each Neon project. The size of the Write-Ahead Log (WAL) is dictated by factors ddescribed in the [Written data](#written-data) section above.

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
- Write-Ahead Log (WAL): TBD
- Written data: TBD
