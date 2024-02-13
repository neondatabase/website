---
title: Billing metrics
enableTableOfContents: true
updatedOn: '2024-01-23T17:45:24.327Z'
---

Neon [Free Tier](/docs/introduction/plans#free-tier), [Launch](/docs/introduction/plans##launch), and [Scale](/docs/introduction/plans##scale) plans each come with allowances of **Compute**, **Storage**, **Projects**, and **Branches**, as outlined in the following table:

|            | Free Tier                                                    | Launch          | Scale             |
|------------|--------------------------------------------------------------|-----------------|-------------------|
| Compute    | 750 _Active Compute Time_ hours/month for the primary branch compute, 20 _Active Compute Time_ hours/month for branch computes. | 1200 compute hours/month | 3000 compute hours/month  |
| Storage    | 512 MiB                                                      | 50 MiB          | 500 MiB           |
| Projects   | 1                                                            | 10              | 50                |
| Branches   | 10                                                           | 100 soft/500 max       | 100 soft/500 max |

Launch and Scale plans have a soft limit 100 branches that can be raised to 500 for no extra fee. If you require more than 100 branches, please contact [Neon Support](/docs/introduction/support).

## Extra usage

The [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans permit extra usage, as outlined below:

|                | Launch   | Scale    |
|----------------|----------|----------|
| Extra Compute  | &check;  | &check;  |
| Extra Storage  |          | &check;  |
| Extra Projects |          | &check;  |

- Extra compute usage is charged per compute hour and is billed automatically. 
- Extra storage is allocated and billed for automatically in increments of 10 GiB.
- Extra projects are allocated and billed for automatically in increments of 10.

Prices for extra usage Compute, Storage, and Project usage are found on our [pricing](https://neon.tech/pricing) page.

## Storage

_Storage_ is the total volume of data and history stored in your Neon project, measured in gibibytes (GiB). It includes the following:

- **Current data size**

  The size of all databases in your Neon projects. You can think of this as a _snapshot_ of your data at a point in time.

- **History**

  Neon retains a history of changes for all branches to support _point-in-time restore_.

  - _Point-in-time restore_ is the ability to restore data to an earlier point in time. Neon retains a history of changes in the form of WAL records. You can configure the history retention period. See [Point-in-time restore](/docs/introduction/point-in-time-restore). WAL records that age out of the history retention period are evicted from storage and no longer count toward project storage.
  - A _database branch_ is a virtual snapshot of your data at the point of branch creation combined with WAL records that capture the branch's data change history from that point forward.
    When a branch is first created, it adds no storage. No data changes have been introduced yet, and the branch's virtual snapshot still exists in the parent branch's _history_, which means that it shares this data in common with the parent branch. A branch begins adding to storage when data changes are introduced or when the branch's virtual snapshot falls out of the parent branch's _history_, in which case the branch's data is no longer shared in common. In other words, branches add storage when you modify data or allow the branch to age out of the parent branch's _history_.

    Database branches can also share a _history_. For example, two branches created from the same parent at or around the same time share a _history_, which avoids additional storage. The same is true for a branch created from another branch. Wherever possible, Neon minimizes storage through shared history. Additionally, to keep storage to a minimum, Neon takes a new branch snapshot if the amount of data changes grows to the point that a new snapshot consumes less storage than retained WAL records.

The cost calculation for _Project storage_ is as follows:

```text
Project storage (GiB) * (seconds stored / 3600) * price per hour
```

The **Storage** is calculated in gibibytes (GiB), otherwise known as binary gigabytes. One gibibyte equals 2<sup>30</sup> or 1,073,741,824 bytes.

## Compute

_Compute_ is the amount of compute resources used per hour. It is calculated by multiplying compute size by _Active time_ hours. Neon measures compute size at regular intervals and averages those values to calculate _Compute time_.

_Active time_ is the total amount of time that your computes have been active within a given billing period, measured in hours. This includes all computes in your Neon project but excludes time when computes are in an `Idle` state due to [auto-suspension](/docs/reference/glossary#auto-suspend-compute) (scale-to-zero). _Active time_ is not a billed metric. It is a factor of the _Compute time_ metric.

Compute size is measured in _Compute Units (CUs)_. One CU has 1 vCPU and 4 GB of RAM. A Neon compute can have anywhere from .25 to 7 CUs, as outlined below:

| Compute Units | vCPU | RAM    |
|:--------------|:-----|:-------|
| .25           | .25  | 1 GB   |
| .5            | .5   | 2 GB   |
| 1             | 1    | 4 GB   |
| 2             | 2    | 8 GB   |
| 3             | 3    | 12 GB  |
| 4             | 4    | 16 GB  |
| 5             | 5    | 20 GB  |
| 6             | 6    | 24 GB  |
| 7             | 7    | 28 GB  |

A connection from a client or application activates a compute. Activity on the connection keeps the compute in an `Active` state. A defined period of inactivity (5 minutes by default) places the compute into an `Idle` state.

Factors that affect _Compute time_ include:

- The number of active computes
- The size of each compute
- The _Autosuspend_ feature, which suspends a compute after 5 minutes of inactivity. [Neon Pro Plan](/docs/introduction/pro-plan) users can configure the autosuspend timeout or disable autosuspend entirely.
- The _Autoscaling_ feature, which allows you to set a minimum and maximum compute size. Compute size automatically scales up and down between these boundaries based on workload.

<Admonition type="note">
Neon uses a small amount of _Compute time_, included in your billed amount, to perform a periodic check to ensure that your computes can start and read and write data. See [Availability Checker](/docs/reference/glossary#availability-checker) for more information.
</Admonition>

The _Compute time_ cost calculation is as follows:

```text
Compute time cost = Compute size * Active time * price per hour
```

### Compute time cost estimates

For an idea of _Compute time_ cost per month based on compute size and usage, refer to the following table. Compute size is measured in Compute Units (CUs).

| Compute Units      | 730 hrs/mth (all hours) | 173 hrs/mth (working hours) | 87 hrs/mth (half of working hours) |
| :----------------- | :---------------------- | :-------------------------- | :--------------------------------- |
| 0.25               | $18.62                  | $4.41                       | $2.22                              |
| 0.5                | $37.23                  | $8.82                       | $4.44                              |
| 1                  | $74.46                  | $17.65                      | $8.87                              |

<Admonition type="note">
The prices in the table above are based on US East (Ohio) _Compute time_ rates.
</Admonition>

- Public-facing applications are assumed to be active for all hours in a month (730 hrs/mth).
- Internal applications with consistent usage are assumed to be active during working hours (173 hrs/mth).
- Internal applications with moderate usage are assumed to be active half of working hours (87 hrs/mth).

### Estimate your compute time cost

To estimate your own monthly _Compute time_ cost:

1. Determine the compute size you require, in Compute Units (CUs).
1. Estimate the amount of _Active time_ per month for your compute(s).
1. Find the _Compute-time_ price for your region.
1. Input the values into the _Compute time_ cost formula:

   ```text
   Compute time cost = Compute size * Active time * Compute-time price
   ```

   For example, this is the calculation for the smallest compute offered by Neon (.25 CUs), 730 hours, and a _Compute time_ price of $0.102:

   ```text
   .25 * 730 * 0.102 = $18.62
   ```

## Additional metrics

Neon also tracks the following the following usage metrics, which are not billed for: 

- **Written data**: The volume of data written from compute to storage.
- **Data transfer**: The volume of data transferred out of Neon.

## Written data

_Written data_ measures the total volume of data written from compute to storage within a given billing period, measured in gigibytes (GiB). Writing data from compute to storage ensures the durability and integrity of your data, as it reflects the data changes made by your computes.

The cost calculation for _Written data_ is as follows:

```text
Written data (GiB) * price per GiB
```

**Written data** is calculated in gibibytes (GiB), otherwise known as binary gigabytes. One gibibyte equals 2<sup>30</sup> or 1,073,741,824 bytes.

## Data transfer

_Data transfer_ measures the total volume of data transferred out of Neon (known as "egress") during a given billing period, measured in gigibytes (GiB). It includes data sent from your Neon project to external destinations. If your data transfer is high, contact [Sales](https://neon.tech/contact-sales) for custom solutions to minimize data transfer costs.

The cost calculation for _Data transfer_ is as follows:

```text
Data transfer (GiB) * price per GiB
```

**Data transfer** is calculated in gibibytes (GiB), otherwise known as binary gigabytes. One gibibyte equals 2<sup>30</sup> or 1,073,741,824 bytes.

