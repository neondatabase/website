---
title: Billing
enableTableOfContents: true
isDraft: true
---

## Overview

Neon offers offers the following plans: **Free Tier**, **Pro**, **Enterprise**, and **Platform Partnership**. The Pro plan is _usage-based_, which ensures that you never over-provision and only pay for what you use. The **Enterprise** and **Platform Partnership** plans are volume based and offer potential volume-based discounts. You can find out more about our [plans](#neon-plans) below.

## Neon billing metrics

Neon's paid plans charge for usage based on the following metrics:

- **Reads**: The amount of data transferred out of Neon.
- **Writes**: The amount of data written for data changes.
- **Compute time**: The amount of active compute time.
- **Storage**: The amount of data stored in your Neon projects.

See [Billing metrics explained](#billing-metrics-explained) for a detailed information about each metric and how Neon calculates usage cost.

Usage costs are account based, but the Neon **Billing** page allows you to view usage by project.

## Neon plans

|                          | Free Tier                         | Pro (usage based)| Enterprise (volume based) |Platform Partnership (volume based)|
|:-------------------------|:----------------------------------|:-----------------|:--------------------------|:----------------------|
|**Best for**              | Prototyping or personal use       | Business use, for setups with 1-3 active databases     | Database fleets           | database fleets or resale |
|**Projects**              | 1                                 | Unlimited        | Unlimited                 | Unlimited               |
|**Compute active time per month** | 100                             | Unlimited        | Unlimited                 | Unlimited               |
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

For more information about our plans, please reach out to [support@neon.tech](mailto:support@neon.tech). Our [Pricing](https://neon.tech/pricing) page provides additional information and a calculator you can use to estimate costs and determine which plan is right for you.

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

A Neon invoice includes the total cost for the billing period and a line item for each of Neon's [billing metrics](#neon-billing-metrics). Each line item is broken down by project and includes a per-unit cost calculation and a total cost. You can expand a line item to view a daily usage chart.

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
1. Click **Cancel subscription**.
1. In the **Cancel Subscription** dialog, enter your cancellation request, and click **Submit**.

This action initiates the cancellation. If your data exceeds  free-tier storage limits, you will be contacted by the Neon Support team with a request to reduce your storage before the paid plan is cancelled and free-tier limits are applied.

## Billing metrics explained

This section provides a detailed explanation of Neon's billing metrics, how they are calculated, and how you can manage your costs.

### Writes

The _Writes_ metric counts the amount of data changes written to the Write-Ahead Log (WAL) to ensure durability of your data. Neon writes data changes to the WAL concurrently on multiple nodes to avoid compromising write speed.

The cost calculation for writes is:

```text
written data (GiB) * price per GiB
```

### Reads

The _Reads_ metric counts the amount of data transferred out of Neon (egress). Neon charges for each GiB of data transfer at the cost set by the cloud provider (e.g., at the cost set by AWS). Neon does not apply a markup to the data transfer cost.

The cost calculation for reads is:

```text
data transferred (GiB) * price per GiB
```

### Compute time

The _Compute time_ metric counts _Compute Unit (CU)_ active time, in hours. In Neon, a compute endpoint can have one or more CUs. A connection from a client or application activates a compute endpoint and its CUs. Activity on the connection keeps the compute endpoint and its CUs in an active state. A defined period of inactivity places the compute endpoint and its CUs into an idle state.

Factors that affect the amount of compute time include:

- The number of active compute endpoints
- The number of CUs per compute endpoint
- Neon's _auto-suspend compute_ feature, which suspends a compute endpoint (and its CUs) after a specified period of inactivity (5 minutes by default). You can increase or decrease the suspension threshold.
- Neon's _autoscaling_ feature, which allows you to set a minimum and maximum number of CUs for each compute endpoint. The number of active CUs scale up and down based on workload.
- Neon's _always-on_ compute feature, which keeps one endpoint active indefinitely to avoid connection latency due compute endpoint startup time.

The cost calculation for compute time is:

```text
compute units * active time (hours) * cost per hour
```

### Storage

The _Storage_ metric counts the amount of data stored in your Neon projects. Stored data is the sum of two values:

1. The logical size of of all databases in your Neon projects at a point in time (a snapshot), which includes PostgreSQL SLRU (simple least-recently-used) caches, and a small amount of metadata.
2. The size of retained Write-Ahead Log (WAL), which is a record of data changes. Two factors determine the size of retained WAL:
   - Your _point-in-time-recovery window_, which you can think of as retained history. Neon retains a data history in the form of WAL records. The default point-in-time-restore window is seven days, which means that Neon stores 7 days of data history. Data that falls out of this window can no longer be accessed an is evicted from storage.

       ```text
        main   ---------########>
                        ^        
                     snapshot

        Legend:

        ####### point-in-time-recovery window, which is 
                retained data history in the form of WAL 
                records

        ------- data history that has fallen out of the 
                point-in-time-recovery window, and can no
                longer be accessed
       ```

   - _Database branches_. A database branch is a snapshot of your data (including the parent branch's retained history) at the point of branch creation, plus WAL that records data changes from that point forward.

      When a branch is first created, it adds no storage. No data changes have been introduced yet and the branch's snapshot data still exists in the parent branch's point-in-time restore window, which means that it shares this data in common with the parent branch.

        ```text
        main   ---------########>
                        ^      |
                     snapshot  |
                               |
        branch A               >
                               ^
                            snapshot  
       ```

      A branch only begins adding to storage when a) data changes are introduced:

       ```text
        main   -------------#######>
                            ^  |
                     snapshot  |
                               |
        branch A               ####>
                               ^
                            snapshot  
       ```

      b) or when when the branch snapshot falls out of the parent branch's point-in-time-restore window, in which case the branch snapshot data is no longer shared in common with the parent branch.

       ```text
        main   -------------------#######>
                               |  ^
                               |  snapshot
                               |
        branch A               ##########>
                               ^
                            snapshot
       ```  

      In other words, branches add storage when you modify data and when you allow the branch to age out of the parent branch's point-in-time-restore window. It should also be noted that a database branch can share a data history with other branches. For example, two branches created from the same parent at or around around the same time will share data history, which avoids additional storage. The same holds true for a branch created from another branch. Wherever possible, Neon optimizes branch storage through shared data history.

The cost calculation for storage is:

```text
storage (GiB) * (seconds stored / 60) * cost per hour
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
