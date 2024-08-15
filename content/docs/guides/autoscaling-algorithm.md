---
title: Understanding Neon’s autoscaling algorithm
subtitle: Learn how the algorithm dynamically adjusts compute resources to match your workload
enableTableOfContents: true
---

The key concept behind autoscaling is that compute resizing happens _automatically_ — once you set up your minimum and maximum [compute sizes](), there’s no action required on your part other than [monitoring]() your usage metrics to see if adjustments are needed.

That said, it can be helpful to understand how the algorithm optimizes your database on two key fronts: **performance** and **cost**. In a nutshell, your compute **scales up** to enhance performance and **scales down** to reduce your usage costs, all automatically, and based on our algorithm.

## Key metrics behind autoscaling

Neon's autoscaling algorithm continuously monitors three key metrics: your average CPU load, your memory usage, and the activity of your Local File Cache (LFC). We scale your compute &#8212; the virtual machine that powers your datababase &#8212; according to the demand expressed by these metrics.

![autoscaling algorithm](/docs/guides/autoscaling_algorithm.png)

## How often are the metrics polled

There are two components involved in tracking these metrics: the [autoscaler-agent]() and the [vm-monitor](). 

- Every **5 seconds**, the **autoscaler-agent** checks the latest load metrics from the VM.
- Every **20 seconds,** it checks the LFC metrics.
- Every **100 milliseconds**, the **vm-monitor** checks memory usage from Postgres.

- the autoscaler-vm fetches working set size every 20 seconds, over a variety of windows: 1 min, 2 min, up to 60 minutes

## Key metrics that influence scaling

To calculate the ideal size for your workload, the algorithm sets three "goals", and increases scale to meet those goals:

- CPU goal
- memory goal
- LFC goal

## Practical tips for managing autoscaling

## Common pitfalls

