---
title: Billing overview
enableTableOfContents: true
subtitle: The basics about how billing works in Neon
---

Just as we separate storage from compute in our architecture, we separate storage from compute when calculating your bill. The largest part of your bill typically comes from compute costs &#8212; the size of your compute and level of activity. Storage costs make up the next largest part of your bill. More minimally, the amount of data that you transfer out of Neon also adds to your cost, though typically this accounts for just a small percentage cost per month.

## Compute costs
With key features like [autoscaling](), [autosuspend](), minimum and max [compute sizes]() all enabled, you can get a sense of how your compute costs might accrue in the following graph.

![Compute metrics graph](/docs/introduction/compute-metrics2.png)

## Storage costs

Neon storage uses copy-on-write branching to keep storage size as small as possible. This can make it hard to visualize "how big is my database", since branches with a shared history don't immediately add to storage costs. Storage size is a combination of your data plus the change history that is used to enable features like [x](), [y](), and [z]().

Storage costs are based on the size of your project and how long it is stored.

![Storage calculation](/docs/introduction/storage_calc.png)

## Data transfer costs

