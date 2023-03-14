---
title: Billing
enableTableOfContents: true
isDraft: true
---

Neon offers the following plans: **Free Tier**, **Pro**, **Enterprise**, and **Platform Partnership**. The Pro plan is _usage-based_, ensuring you never over-provision and only pay for what you use. The **Enterprise** and **Platform Partnership** plans are custom volume-based plans that offer potential discounts. You can find out more about our [plans](#neon-plans) below.

## Neon billing metrics

Neon's charges for usage based on the following metrics:

- **Compute time**: The amount time that Neon compute resources are active.
- **Project storage**: The size of the data and history stored for your project.
- **Written data**: The amount of data written from compute to storage.
- **Data transfer**: The amount of data transferred out of Neon.

See [Billing metrics explained](#billing-metrics-explained) for a detailed description of each metric and how Neon calculates costs.

## Neon plans

|                          | Free Tier                         | Pro (usage-based)             | Custom - Enterprise or Platform Partnership (volume-based)|
|:-------------------------|:----------------------------------|:-----------------|:--------------------------|
|**Best for**              | Prototyping and personal projects       | Small-to-medium sized teams, setups with 1 to 3 active databases  | Medium-to-large sized teams, Database fleets, Resale |
|**Projects**              | 1                                 | 20               | Unlimited                 |
|**Compute active time per month** | 100 hours                 | Unlimited        | Unlimited                 |
|**Compute size**          | Up to 1 vCPU with 1 GB RAM   | Up to 7 vCPUs, each with 4 GB RAM     | Custom           |
|**Storage**               | 3 GB per branch                   | 200 GB        | Unlimited                 |
|**Dedicated resources**   | -                            | -           | &check;                   |
|**Project sharing**       | -                            | &check;          | &check;                   |
|**Auto-suspend compute**  | &check;                           | &check;          | &check;                   |
|**Configurable auto-suspend compute (coming soon)**  | -                           | &check;          | &check;                   |
|**Autoscaling (coming soon)**     | -                            | &check;          | &check;                   |
|**Payment**               | Free                              | Credit Card, Pay As You Go with monthly invoicing | Prepaid, Custom Contract, Volume Discounts |
|**Support**               | Community, support tickets                 | Community, support tickets, video chat          | Community, support tickets, video chat, resale customer support                   |

<Admonition type="info">
The limits described above are plan defaults. If you would like to adjust the limits to tailor a plan to your specific requirements, please contact [sales@neon.tech](mailto:sales@neon.tech).
</Admonition>


## Account billing page

Each Neon account has a billing page, where you can:

- View your current billing total for the month-to-date, including a cost breakdown by [billing metric](#neon-billing-metrics).
- Update your payment details
- Download your latest invoices

To access your billing page:

1. Navigate to the Neon Console.
1. Select **Billing** from the sidebar.

## Neon invoices

A Neon invoice includes an **Amount due** for billing period and the cost broken down by [billing metric](#neon-billing-metrics).

### Download invoices

You can download invoices from the **Billing** page.

1. Navigate to the **Billing** page in the Neon Console. 
1. Under **Latest invoices**, locate the invoice you want to download and click the PDF download icon.

## Cancel a subscription

To cancel your subscription to a Neon paid plan:

1. Navigate to the **Billing** page in the Neon Console.
1. Click **Cancel subscription**.
1. Enter your cancellation request and click **Submit**.

This action initiates the cancellation. If your data exceeds [Free Tier](/docs/introduction/technical-preview-free-tier) storage limits, you will be contacted by the Neon Support team with a request to reduce your storage before the paid plan is canceled and Free Tier limits are applied.

## Billing metrics explained

This section provides a detailed explanation of Neon's billing metrics and how they are calculated. Billing in Neon is account-based. For the billing rate for each metric, see [Billing rates](#billing-rates).

<Admonition type="note">
The **Project storage**, **Written data**, and **Data transfer** billing metrics are calculated in gibibytes (GiB), otherwise known as binary gigabytes. One gibibyte equals 2<sup>30</sup> or 1,073,741,824 bytes.
</Admonition>

### Compute time

The _Compute time_ metric counts _Compute Unit (CU)_ active time. A CU has 1 vCPU and 4 GB of RAM. In Neon, a [compute endpoint](/docs/reference/glossary/#compute-endpoint) can have anywhere from .25 CUs to 7 CUs. The number of CUs determines the processing capacity of your Neon database. A connection from a client or application activates a compute endpoint and its CUs. Activity on the connection keeps the compute endpoint and its CUs in an active state. A defined period of inactivity places the compute endpoint and its CUs into an idle state.

Factors that affect the amount of compute time include:

- The number of active compute endpoints
- The number of CUs per compute endpoint
- Neon's _Auto-suspend compute_ feature, which suspends a compute endpoint (and its CUs) after a period of inactivity. The current default is five minutes.
- Neon's _Configurable auto-suspend compute_ feature, which allows you to configure the timeout period for the  _Auto-suspend compute_ feature (_coming soon_).
- Neon's _Always-on_ compute feature, which keeps an endpoint active indefinitely to avoid the few seconds of connection latency when waking an idle compute (_coming soon_).
- Neon's _autoscaling_ feature, which allows you to set a minimum and maximum number of CUs for each compute endpoint. The number of active CUs scale up and down based on workload (_coming soon_).


The cost calculation for _Compute time_ is as follows:

```text
compute units * active time (hours) * price per hour
```

### Project storage

The _Project storage_ metric counts the amount of data stored in all of your Neon projects. Project storage includes:

- **Logical data size**

  The size of all databases in your Neon projects. You can think of this as a _snapshot_ of your data at a point in time.

- **Retained Write-Ahead Log (WAL) records**

  Neon retains Write-Ahead Log (WAL) records to support _point-in-time restore_ and _database branching_.
  - _Point-in-time restore_ is the ability to restore data to a past point in time. Neon stores seven days of data history in the form of WAL records for a Neon project. WAL records that fall out of this seven-day window are evicted from storage and no longer counted toward project storage.
  - A _database branch_ is a snapshot of your data (including _data history_) at the point of branch creation combined with WAL records that capture data changes from that point forward.
    When a branch is first created, it adds no storage. No data changes have been introduced yet, and the branch's snapshot data still exists in the parent branch's _data history_, which means that it shares the data in common with the parent branch. A branch only begins adding to storage when data changes are introduced or when the branch starting point falls out of the parent branch's _data history_, in which case the branch's data is no longer shared in common. In other words, branches add storage when you modify data and allow the branch to age out of the parent branch's _data history_.

    Database branches can also share a _data history_. For example, two branches created from the same parent at or around the same time will share a _data history_, which avoids additional storage. The same is true for a branch created from another branch. Wherever possible, Neon minimizes storage through shared data history. Additionally, to keep storage to a minimum, Neon will take a new branch snapshot if the amount data changes stored as WAL grows to the point that a new snapshot would consume less storage.

The cost calculation for _Project storage_ is as follows:

```text
project storage (GiB) * (seconds stored / 3600) * price per hour
```

### Written data

The _Written data_ metric counts the amount of data changes written to the Write-Ahead Log (WAL) to ensure durability of your data.

The cost calculation for _Written data_ is as follows:

```text
written data (GiB) * price per GiB
```

### Data transfer

The _Data transfer_ metric counts the amount of data transferred out of Neon (egress). Neon charges for each GiB of data transfer at the egress cost set by the cloud provider. Contact [sales@neon.tech](mailto:sales@neon.tech) for custom solutions to minimize data transfer costs.

The cost calculation for _Data transfer_ is as follows:

```text
data transfer (GiB) * price per GiB
```

## Billing rates

| Cloud provider | Region      | Billing metric | Price | Unit |
|:---------------|:-----------|:--------------|:------|:-----|
| AWS            | US East (Ohio)     | Data storage  | $0.00016 | GiB/Hour |
| AWS            | US East (Ohio)     | Compute time  | $0.10200 | Compute/Hour |
| AWS            | US East (Ohio)  | Written data  | $0.09600 | GiB |
| AWS            | US East (Ohio)| Data transfer  | $0.09000 | GiB |
|                |             |                |       |      |
| AWS            | US West (Oregon)| Data storage | $0.00016 | GiB/Hour |
| AWS            | US West (Oregon)     | Compute time  | $0.10200 | Compute/Hour |
| AWS            | US West (Oregon)     | Written data  | $0.09600 | GiB |
| AWS            | US West (Oregon)  | Data transfer  | $0.09000 | GiB |
|                |             |                |       |      |
| AWS            | Europe (Frankfurt)| Data storage  | $0.00018 | GiB/Hour |
| AWS            | Europe (Frankfurt)| Compute time| $0.10200 | Compute/Hour |
| AWS            | Europe (Frankfurt)     | Written data    | $0.096000 | GiB |
| AWS            | Europe (Frankfurt)     | Data transfer    | $0.09000 | GiB |
|                |             |                |       |      |
| AWS            | Asia Pacific (Singapore)  | Data storage    | $0.00018 | GiB/Hour |
| AWS            | Asia Pacific (Singapore)| Compute time    | $0.10200 | Compute/Hour |
| AWS            | Asia Pacific (Singapore)| Written data  | $0.09600 | GiB |
| AWS            | Asia Pacific (Singapore)| Data transfer  | $0.09000 | GiB |

## Support

Support channels for the Neon Free Tier and paid plans are outlined below.

| Support channels                           | Free Tier           | Pro           | Custom         |
| :----------------------------------------- | :------------------:| :-----------: | :------------: |
| [Neon Community Forum](https://community.neon.tech/) | &check;   | &check;       | &check;        |
| Ability to submit support tickets          | &check;             | &check;       | &check;        |
| Video chat                                 | -                   | &check;       | &check;        |
| Resale customer support                    | -                   | -             | &check;        |

<Admonition type="note">
Pro plan users that submit support tickets through Neon's console can expect an initial response time of 2 business days, from 6am to 6pm Pacific Standard Time (UTC -8), Monday through Friday, excluding public holidays in the United States.

Free tier users are not guaranteed a specific response time. For custom solutions, please contact [sales@neon.tech](mailto:sales@neon.tech).  
</Admonition>
