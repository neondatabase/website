---
title: Billing
enableTableOfContents: true
isDraft: true
---

## Overview

Neon offers the following plans: **Free Tier**, **Pro**, **Enterprise**, and **Platform Partnership**. The Pro plan is _usage-based_, ensuring you never over-provision and only pay for what you use. The **Enterprise** and **Platform Partnership** plans are volume based and offer potential volume-based discounts. You can find out more about our [plans](#neon-plans) below.

## Neon billing metrics

Neon's paid plans charge for usage based on the following metrics:

- **Compute time**: The amount of active compute time.
- **Project storage**: The amount of data stored in your Neon projects.
- **Written data**: The amount of data written for data changes.
- **Data transfer**: The amount of data transferred out of Neon.

See [Billing metrics explained](#billing-metrics-explained) for a detailed description of each metric and how Neon calculates costs.

## Neon plans

|                          | Free Tier                         | Pro (usage-based)| Enterprise (volume-based) |Platform Partnership (volume-based)|
|:-------------------------|:----------------------------------|:-----------------|:--------------------------|:----------------------|
|**Best for**              | Prototyping or personal use       | Business use, for setups with 1-3 active databases  | Database fleets  | database fleets or resale |
|**Projects**              | 1                                 | Unlimited        | Unlimited                 | Unlimited               |
|**Compute active time per month** | 100 hours                 | Unlimited        | Unlimited                 | Unlimited               |
|**CPU**                   | 1 shared CPU                      | Up to X CPUs     | Up to X CPUs              | Up to X CPUs            |
|**RAM**                   | 1 GB                              | Up to X GB       | Up to X GB                | Up to X GB              |
|**Storage**               | 3 GB per branch                   | Up to X GB       | Up to X GB                | Up to X GB              |
|**Dedicated resources**   | &#120;                            | &#120;           | &check;                   | &check;                 |
|**Auto-suspend compute**  | &check;                           | &check;          | &check;                   | &check;                 |
|**Always-on compute**     | &#120;                            | &check;          | &check;                   | &check;                 |
|**Project sharing**       | &#120;                            | &check;          | &check;                   | &check;                 |
|**Payment**               | Free                              | Credit Card, Pay As You Go with monthly invoicing | Prepaid, Custom Contract, Volume Discounts |Prepaid, Custom Contract, Wholesale Discounts|
|**Support**               | Community Support                 | Support          | Support                   |Support, Platform Support|

<Admonition type="info">
The limits described above are plan defaults. If you would like to adjust the limits to tailor a plan to your specific requirements, please contact [sales@neon.tech](mailto:sales@neon.tech).
</Admonition>

Our [Pricing](https://neon.tech/pricing) page provides additional information and a calculator you can use to estimate costs and determine which plan is right for you.

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

A Neon invoice includes the total cost for the billing period and the cost broken down by [billing metric](#neon-billing-metrics).

### Download invoices

You can download invoices from the **Billing** page.

1. Navigate to the **Billing** page in the Neon Console. The current invoice is displayed.
1. Download the invoice:
    1. To download the current invoice, click **Download PDF** from the top of the page.
    1. To download an invoice for a previous billing period, select the invoice from the **Latest invoices** list to open it, then click **Download PDF**.

## Cancel a subscription

To cancel your subscription to a Neon paid plan:

1. Navigate to the **Billing** page in the Neon Console.
1. Click **Cancel subscription**.
1. Enter your cancellation request and and click **Submit**.

This action initiates the cancellation. If your data exceeds  free-tier storage limits, you will be contacted by the Neon Support team with a request to reduce your storage before the paid plan is canceled and free-tier limits are applied.

## Billing metrics explained

This section provides a detailed explanation of Neon's billing metrics and how they are calculated. Billing in Neon is account-based. If you require a project-based cost breakdown, refer to your [billing invoice](#neon-invoices).

### Compute time

The _Compute time_ metric counts _Compute Unit (CU)_ active time, in hours. In Neon, a compute endpoint can have up to 8 CUs. A connection from a client or application activates a compute endpoint and its CUs. Activity on the connection keeps the compute endpoint and its CUs in an active state. A defined period of inactivity places the compute endpoint and its CUs into an idle state.

Factors that affect the amount of compute time include:

- The number of active compute endpoints
- The number of CUs per compute endpoint
- Neon's _auto-suspend compute_ feature, which suspends a compute endpoint (and its CUs) after a specified period of inactivity (5 minutes).
- Neon's _autoscaling_ feature, which allows you to set a minimum and maximum number of CUs for each compute endpoint. The number of active CUs scale up and down based on workload. _This feature is not yet available._
- Neon's _always-on_ compute feature, which keeps one endpoint active indefinitely to avoid connection latency due compute endpoint startup time. _This feature is not yet available._

The cost calculation for _Compute time_ is as follows:

```text
compute units * active time (hours) * cost per hour
```

### Project storage

The _Project storage_ metric counts the amount of data stored in all of your Neon projects. Project storage includes:

- **The logical data size of your data**

  This includes the size of all databases in your Neon projects, PostgreSQL SLRU (simple least-recently-used) caches, and a small amount of metadata. You can think of this as a _snapshot_ of your data at a point in time and similar to the data size that you would see in a standalone PostgreSQL installation.

- **Retained Write-Ahead Log (WAL)**

  The WAL is a record of data changes. Neon retains WAL to support _point-in-time restore_ and _database branches_.
  - The _point-in-time-recovery window_ is _retained data history_ in the form of WAL records. The default point-in-time-restore window is seven days, which means that Neon stores seven days of data history. Data (WAL) that falls out of this window is evicted from storage and no longer counted toward project storage. The following diagram shows the primary branch of a Neon project (`main`) depicted as a timeline and a snapshot of your data that sits at the beginning of the point-in-time-restore window.

      ```text
      main   ---------########>
                      ^        
                  snapshot

      Legend:

      ####### point-in-time-restore window, which is 
              retained data history in the form of WAL 
              records

      ------- data history (WAL) that has fallen out of the 
              point-in-time-restore window, and can no
              longer be accessed
      ```

  - A _database branch_ is a snapshot of your data (including the parent branch's retained history) at the point of branch creation combined with WAL records that capture data changes from that point forward.

      When a branch is first created, it adds no storage. No data changes have been introduced yet and the branch's snapshot data still exists in the parent branch's point-in-time restore window, which means that it shares this data in common with the parent branch.

      ```text
      main   ---------########>
                      ^      |
                   snapshot  |
                             |
      branch A               #>
                             ^
                          snapshot  
      ```

      A branch only begins adding to storage when a) data changes are introduced:

      ```text
      main   -------------#######>
                          ^   |
                   snapshot   |
                              |
      branch A                ####>
                              ^
                           snapshot  
      ```

      and b) when the branch snapshot falls out of the parent branch's point-in-time-restore window, in which case the branch snapshot data is no longer shared in common with the parent branch.

      ```text
      main   --------------------#######>
                              |  ^
                              |  snapshot
                              |
      branch A                ##########>
                              ^
                           snapshot
      ```  

      In other words, branches add storage when you modify data and when you allow the branch to age out of the parent branch's point-in-time-restore window.

      Database branches can also share data history. For example, two branches created from the same parent at or around the same time will share data history, which avoids additional storage. The same holds true for a branch created from another branch. Wherever possible, Neon minimizes the storage cost of branches through shared data history. If it helps keeps storage size to a minimum, Neon will also take a new a branch snapshot to reduce the amount data changes stored as WAL.

The cost calculation for _Project storage_ is as follows:

```text
project storage (GiB) * (seconds stored / 60) * cost per hour
```

### Written data

The _Written data_ metric counts the amount of data changes written to the Write-Ahead Log (WAL) to ensure durability of your data. Neon writes data changes to the WAL concurrently on multiple nodes to avoid compromising write speed.

The cost calculation for _Written data_ is as follows:

```text
written data (GiB) * price per GiB
```

### Data transfer

The _Data transfer_ metric counts the amount of data transferred out of Neon (egress). Neon charges for each GiB of data transfer at the cost set by the cloud provider (e.g., at the cost set by AWS). Neon does not apply a markup to the data transfer cost.

The cost calculation for _Data transfer_ is as follows:

```text
data transfer (GiB) * price per GiB
```
