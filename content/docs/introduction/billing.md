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

For more information about our **Pro** and **Enterprise** plans, please reach out to [sales@neon.tech](mailto:support@neon.tech). Our [Pricing](https://neon.tech/pricing) page provides additional information about our plans and a calculator that you can use to estimate costs and determine the which plan is right for you.

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

A Neon invoice includes the total cost for the billing period and a line item for each of Neon's [billing metrics](#neon-billing-metrics). Each line item is per account, broken out by Neon project. Each line item includes a per-unit cost calculation and a total line item cost. You can expand a line item to view a chart that shows your daily usage.

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

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Cost calculation: `data written (GiB) * price per GiB`

### Data transfer

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Cost calculation: `data written (GiB) * price per GiB`

### Compute time

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Cost calculation: `number of CPU cores * (seconds active) / 60) * cost per hour`

### Data storage

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Cost calculation: `stored data (GiB) * (seconds stored / 60) * cost per hour`

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
