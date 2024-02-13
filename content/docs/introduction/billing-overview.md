---
title: Billing overview
enableTableOfContents: true
subtitle: The basics about how billing works in Neon
updatedOn: '2024-01-23T17:45:24.326Z'
---

Each of Neon's plans comes with allowances of **Compute**, **Storage**, **Projects**, and **Branches**, as outlined in the following table:

|            | Free Tier                                                    | Launch          | Scale             |
|------------|--------------------------------------------------------------|-----------------|-------------------|
| Compute    | 750 _Active Compute Time_ hours/month for the primary branch compute, 20 _Active Compute Time_ hours/month for branch computes. | 1200 compute hours/month | 3000 compute hours/month  |
| Storage    | 512 MiB                                                      | 50 MiB          | 500 MiB           |
| Projects   | 1                                                            | 10              | 50                |
| Branches   | 10                                                           | 100 soft/500 max       | 100 soft/500 max |

## Compute

With key features like [autoscaling](/docs/guides/autoscaling-guide), [autosuspend](/docs/guides/auto-suspend-guide), minimum and max [compute sizes](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) enabled, you can get a sense of how your compute usage might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

You can see how compute size scales between your minimum and maximum CPU settings, increasing and decreasing compute usage: compute size never rises above your max level, and it never drops below your minimum setting. With autosuspend, no compute time at all accrues during inactive periods. For projects with inconsistent demand, this can save significant compute usage.

For a more detailed breakdown of compute cost metrics, see [compute time](/docs/introduction/billing#compute-time).

## Storage

Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage costs. Storage size is a combination of your total data plus the shared change history that is used to enable branching-related features like [point-in-time restore](/docs/introduction/point-in-time-restore), [query testing](/docs/guides/branching-test-queries), and [reset from parent](/docs/manage/branches#reset-a-branch-from-parent).

Storage costs are based on the size of your project and how long it is stored.

![Storage calculation](/docs/introduction/storage_calc.jpg)

For a detailed explanation about storage costs, see [Project storage](/docs/introduction/billing#project-storage).

## Data write and transfer

The amount of data that you write to storage or transfer out of Neon (for example, to serve data requests from an external application, stream data to another service, or set up an offline database backup) is not billed. 

![Data write and transfer](/docs/introduction/neon_boundary.jpg)

For more detail on these metrics, see [Written data](/docs/introduction/billing#written-data) and [Data transfer](/docs/introduction/billing#data-transfer).
