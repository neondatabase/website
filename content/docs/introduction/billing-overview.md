---
title: Billing overview
enableTableOfContents: true
subtitle: The basics about how billing works in Neon
updatedOn: '2024-01-03T21:00:38.275Z'
---

The largest part of your bill typically comes from compute costs &#8212; the size of your compute plus your level of activity. Storage costs make up the next largest part of your bill. The amount of data that you write, either to storage within Neon or data egress outside of Neon, also adds to your cost, though typically a small percentage per month.

## Compute costs
With key features like [autoscaling](/docs/guides/autoscaling-guide), [autosuspend](/docs/guides/auto-suspend-guide), minimum and max [compute sizes](/docs/manage/endpoints#compute-size-and-autoscaling-configuration) enabled, you can get a sense of how your compute costs might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

You can see how the compute time that you get billed for scales between your minimum and maximum CPU settings: compute time never rises above your max level, and it never drops below your minimum setting. With autosuspend, you are not charged at all during inactive periods. For projects with inconsistent demand, this can save significant compute costs.

For a more detailed breakdown of compute cost metrics, see [compute time](docs/introduction/billing#compute-time).

## Storage costs

Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage costs. Storage size is a combination of your total data plus the shared change history that is used to enable branching-related features like [point-in-time restore](/docs/introduction/point-in-time-restore), [query testing](/docs/guides/branching-test-queries), and [reset from parent](docs/manage/branches#reset-a-branch-from-parent).

Storage costs are based on the size of your project and how long it is stored.

![Storage calculation](/docs/introduction/storage_calc.jpg)

For a detailed explanation about storage costs, see [Project storage](/docs/introduction/billing#project-storage).

## Data write and transfer costs

The amount of data that you write to storage or transfer out of Neon (for example, to serve data requests from an external application, stream data to another service, or set up an offline database backup) also contributes to your costs. In typical projects, these costs add up to less than 5% per month.

![Data write and transfer](/docs/introduction/neon_boundary.jpg)

For more detail on these metrics, see [Written data](docs/introduction/billing#written-data) and [Data transfer](/docs/introduction/billing#data-transfer).
