---
title: Usage metrics
enableTableOfContents: true
redirectFrom:
  - /docs/introduction/billing
updatedOn: '2024-02-21T13:29:41.905Z'
---

As described in [How billing works](/docs/introduction/how-billing-works), each of Neon's plans includes [Storage](#storage), [Compute](#compute), and [Project](#projects) usage allowances. The [Launch](/docs/introduction/plans##launch) permits extra compute usage. The [Scale](/docs/introduction/plans##scale) plans permits extra compute, storage, and project usage.

This topic describes Storage, Compute, and Project usage metrics in more detail so that you can better manage your plan allowances and extra usage. 

## Storage

The following table outlines data storage allowances for each Neon plan.

| Plan       | Storage    |
|------------|------------|
| Free Tier  | 512 MiB    |
| Launch     | 10 GiB     |
| Scale      | 50 GiB     |
| Enterprise | Larger sizes |

Extra storage is available with the [Scale](/docs/introduction/plans##scale) plan. Extra storage is billed for in units of 10 GiB. For example, the Scale plan has an allowance of 50 GiB included in the plan's monthly fee. If you go over 50 GiB of storage, you are automatically billed for extra storage in increments of 10 GiB for the price stated on our [pricing](https://neon.tech/pricing) page. For example, as soon as you go over your allowance, say by 1 GiB, you are billed for one 10 GiB unit of storage. If you go over by more than 10 GiB, you will be billed for two 10 GiB units of storage, and so on.

### What is "storage" in Neon? 

Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage. Storage size is a combination of your total data plus the shared change history that is used to enable branching-related features like [point-in-time restore](/docs/introduction/point-in-time-restore), [query testing](/docs/guides/branching-test-queries), and [reset from parent](/docs/manage/branches#reset-a-branch-from-parent).

### How is storage usage measured?

Storage usage is based on the amount of data stored in your project (or projects) and how long it is stored.

![Storage calculation](/docs/introduction/storage_calc.png)

### Storage details

_Storage_ is the total volume of data and history stored in Neon, measured in gibibytes (GiB). It includes the following:

- **Current data size**

  The size of all databases in your Neon projects. You can think of this as a _snapshot_ of your data at a point in time.

- **History**

  Neon retains a history of changes for all branches to support _point-in-time restore_.

  - _Point-in-time restore_ is the ability to restore data to an earlier point in time. Neon retains a history of changes in the form of WAL records. You can configure the history retention period. See [Point-in-time restore](/docs/introduction/point-in-time-restore). WAL records that age out of the history retention period are evicted from storage and no longer count toward storage.
  - A _database branch_ is a virtual snapshot of your data at the point of branch creation combined with WAL records that capture the branch's data change history from that point forward.
    When a branch is first created, it adds no storage. No data changes have been introduced yet, and the branch's virtual snapshot still exists in the parent branch's _history_, which means that it shares this data in common with the parent branch. A branch begins adding to storage when data changes are introduced or when the branch's virtual snapshot falls out of the parent branch's _history_, in which case the branch's data is no longer shared in common. In other words, branches add storage when you modify data or allow the branch to age out of the parent branch's _history_.

    Database branches can also share a _history_. For example, two branches created from the same parent at or around the same time share a _history_, which avoids additional storage. The same is true for a branch created from another branch. Wherever possible, Neon minimizes storage through shared history. Additionally, to keep storage to a minimum, Neon takes a new branch snapshot if the amount of data changes grows to the point that a new snapshot consumes less storage than retained WAL records.

The usage calculation for _Storage_ is as follows:

```text
storage (GiB) * (seconds stored / 3600)
```

The **Storage** is calculated in gibibytes (GiB), otherwise known as binary gigabytes. One gibibyte equals 2<sup>30</sup> or 1,073,741,824 bytes.

## Compute

The following table outlines compute allowances for each Neon plan.

| Plan       | Compute                                                                                                              |
|------------|----------------------------------------------------------------------------------------------------------------------|
| Free Tier  | Always-available primary branch compute, 20 _active hours_/month (5 compute hours) on branch computes           |
| Launch     | Up to 1,200 _active hours_/month (300 compute hours)                                                                                             |
| Scale      | Up to 3,000 _active hours_/month (750 compute hours)                                                                                             |
| Enterprise | Custom                                                                                                            |

Extra compute usage is available with the [Launch](/docs/introduction/plans##launch) and [Scale](/docs/introduction/plans##scale) plans. Extra compute usage is billed for by compute hour. For example, the Launch plan has an allowance of 300 compute hours included in the plan's monthly fee. If you use additional compute hours, you are billed for those at the compute-hour price stated on our [pricing](https://neon.tech/pricing) page.

### What are active hours?

**Active hours** measures the amount of time a compute is active, rather than idle when suspended due to inactivity. The time that your compute is idle is not counted toward compute usage.

### What is a compute hour?

A **compute hour** is 1 hour is equal to one _active hour_ for a compute with 1 vCPU. If you have a compute with .25 vCPU, as you would on the Neon Free Tier, it would require 4 _active hours_ to use 1 compute hour. On the other hand, if you have a compute with 4 vCPU, it would only take 15 minutes to use 1 compute hour.

### How Neon compute features affect usage

Compute-hour usage in Neon is affected by [autosuspend](/docs/guides/auto-suspend-guide), [autoscaling](/docs/guides/autoscaling-guide), and your minimum and maximum [compute size](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) configuration. With these features enabled, you can get a sense of how your compute usage might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

You can see how compute size scales between your minimum and maximum CPU settings, increasing and decreasing compute usage: compute size never rises above your max level, and it never drops below your minimum setting. With autosuspend, no compute time at all accrues during inactive periods. For projects with inconsistent demand, this can save significant compute usage.

### Compute usage details

Compute hour usage is calculated by multiplying compute size by _active hours_. Neon measures compute size at regular intervals and averages those values to calculate your compute hour usage.

_Active hours_ is the amount of time that your computes have been active. This includes all computes in your Neon project but excludes time when computes are in an `Idle` state due to [auto-suspension](/docs/reference/glossary#auto-suspend-compute) (scale-to-zero).

Compute size in Neon is measured in _Compute Units (CUs)_. One CU has 1 vCPU and 4 GB of RAM. A Neon compute can have anywhere from .25 to 7 CUs, as outlined below:

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

Factors that affect _active hours_ include:

- The number of active computes
- The size of each compute
- The _Autosuspend_ feature, which suspends a compute after 5 minutes of inactivity by default. Users on paid plans can configure the autosuspend timeout or disable it entirely.
- The _Autoscaling_ feature, which allows you to set a minimum and maximum compute size. Compute size automatically scales up and down between these boundaries based on workload.

<Admonition type="note">
Neon uses a small amount of compute time, included in your billed compute hours, to perform a periodic check to ensure that your computes can start and read and write data. See [Availability Checker](/docs/reference/glossary#availability-checker) for more information.
</Admonition>

The compute hour usage calculation is as follows:

```text
compute hour usage = compute size * active hours
```

### Estimate your compute hour usage

To estimate what your compute hour usage might be per month:

1. Determine the compute size you require, in Compute Units (CUs).
1. Estimate the amount of _active hours_ per month for your compute(s).
1. Input the values into the compute hours formula:

   ```text
   compute hours = compute size * active hours
   ```

   For example, this is a calculation for a 2 vCPU compute that is active for all hours in a month (approx. 730 hours):

   ```text
   2 * 730 = 1460 compute hours
   ```

   This calculation is useful when trying to select the right Neon plan or when estimating the extra compute usage you might need.

## Projects

In Neon, everything starts with a project. A project is a container for your branches, databases, roles, and other resources and settings. A project also defines the region your data and resources reside in. We typically recommend creating a project for each application or each client. In addition to organizing objects, projects are a way to track storage and compute usage by application or client.

The following table outlines project allowances for each Neon plan.

| Plan       | Projects |
|------------|----------|
| Free Tier  | 1        |
| Launch     | 10       |
| Scale      | 50       |
| Enterprise | Unlimited |

- When you reach your limit on the [Free Tier](/docs/introduction/plans#free-tier) or [Launch](/docs/introduction/plans#launch) plan, you cannot create additional projects. Instead, you can upgrade to the [Launch](/docs/introduction/plans#launch) or [Scale](/docs/introduction/plans#scale) plan, which offer allowances of 10 and 50 projects, respectively.
- Extra projects are available with the [Scale](/docs/introduction/plans#scale) plan in increments of 10. If you use more than 50 projects, you are automatically billed for an extra package of 10 projects for the price stated on our [pricing](https://neon.tech/pricing) page. For example, if you use 51 projects, you are billed for a package of 10 projects. If you use 61 projects, you are billed for two packages of 10 projects, and so on.

<NeedHelp/>   
