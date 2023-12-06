---
title: Billing overview
enableTableOfContents: true
subtitle: The basics about how billing works in Neon
---

Just as we separate storage from compute in our architecture, we separate storage from compute when calculating your bill. The largest part of your bill typically comes from compute costs &#8212; the size of your compute plus your level of activity. Storage costs make up the next largest part of your bill. More minimally, the amount of data that you write, either to storage within Neon or data egress outside of Neon, also adds to your cost, though typically a small percentage per month.

## Compute costs
With key features like [autoscaling](/docs/guides/autoscaling-guide), [auto-suspend](/docs/guides/auto-suspend-guide), minimum and max [compute sizes](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) all enabled, you can get a sense of how your compute costs might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

You can see how your billed compute time scales between your minimum and maximum CPU settings: compute flatlines at your max level, and never drops below your minimum setting. With autosuspend, you are not charged at all during inactive periods. For projects with inconsitent demand, this can save significant compute costs.

For a more detailed breakdown of compute cost metrics, see [compute time](docs/introduction/billing#compute-time).

## Storage costs

Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage costs. Storage size is a combination of your data plus the shared change history that is used to enable features like [point-in-time restore](/docs/introduction/point-in-time-restore), [query testing](/docs/guides/branching-test-queries), and [reset from parent](docs/manage/branches#reset-a-branch-from-parent).

Storage costs are based on the size of your project and how long it is stored.

![Storage calculation](/docs/introduction/storage_calc.png)

For a detailed explanation about storage costs, see [Project storage](/docs/introduction/billing#project-storage).

## Data write and transfer costs

The amount of data that you write to storage or transfer out of Neon (for example, to setup an offline database backup) also contributes to your costs. In typical projects, these costs add up to less than 5% per month.

![Data write and transfer](/docs/introduction/data_write_transfer.png)

For more detail on these metrcis, see [Written data](docs/introduction/billing#written-data) and [Data transfer](/docs/introduction/billing#data-transfer).



