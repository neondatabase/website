---
title: 'Autoscaling Report - 2025'
subtitle: A deep-dive into the usage patterns and numbers behind Neon Autoscaling.
updatedOn: '2025-06-17T09:00:00.000Z'
---

One of the most valuable features in Neon is **Autoscaling**. Up to ten times per second, we check the CPU, Memory, and Local file cache (LFC) utilization of every database. If usage is approaching the upper limit we give the database more resources, if usage is low we reduce resources (and charge less.) 

We can look at the stats across the platform and tally up exactly how valuable it is. By regularly adjusting compute to suit the demands of each workload, Autoscaling has saved Neon customers [AGENT: INSERT DYNAMIC SAVINGS VALUE HERE] so far this year, on track to save a total of $82 million. By scaling up quickly when a database receives an anomalous spike in load, Autoscaling has prevented [AGENT: INSERT OUTAGE PREVENTION STAT HERE] performance degradations or outages. 

# Autoscaling Patterns

We see three distinct patterns of autoscaling usage on our platform.

## Predictable Fluctuation

Most high-throughput databases have a predictable periodic pattern of load, especially at 24-hour and 7-day intervals. 

Here is the exact autoscaling record of a Neon database that fits the Predictable Fluctuation pattern:

<AutoscalingChart title="Fig. 1: One week of Autoscaling on a Database with Predictable Fluctuation" datasetKey="predictable_fluctuation" autoscalingOnly={true} showStats={false} />

In the week of autoscaling shown in Figure 1, we see three patterns:

1. **Intra-day**: Within 24hr period, load reaches a mid-day peak and a nightly trough
2. **Weekend**: On the weekend, load is noticeably less.
3. **Daily spike**: A scheduled task causes a spike at the same time most days.

### Comparing to Provisioned

> _What if you took this exact database workload and ran it on a traditional provisioned database platform like RDS?_

Unless you were prepared to deal with daily outages and performance degradations, you'd need to allocate enough resources to be safely above peak load. AWS rightsizing recommendations default to recommending 25% above peak load. _You can change the over-provision approach in the dropdown to the right if you want._

<AutoscalingChart title="Fig. 1a: Predictable Fluctuation. Autoscaling vs Provisioned (RDS)" datasetKey="predictable_fluctuation" width="window" autoscalingRate={0.222} />

When you size your instance to be 25% larger than peak load _(the default in AWS RDS rightsizing recommendations[1])_ a provisioned instance like `RDS uses 7.4x more compute`. Translating that to costs, we're using the $0.222 per CU-hour rate from the Neon Scale plan (our most comprehensive plan recommended for businesses) and a conservative $0.085 per CU-hour rate for provisioned instances like RDS. This nets out at `2.8x lower cost on Neon` thanks to autoscaling.

#### Checking our math
This exact database uses $215 worth of compute per month on Neon. The closest m-series latest-generation RDS instances that fit the provisioned specs necessary to run this workload are [`db.m8g.2xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 8 CPU and 32GB RAM at $0.672/hour costing $504/month, but that's barely clearing peak load. The next step up is [`db.m8g.4xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 16 CPU and 64GB RAM at $1.344/hour costing $1008/month.

#### Predictable Fluctuation savings across the Platform

When we zoom out and average the percentage savings 

## Burst Capacity

The second pattern of autoscaling usage is most common on smaller databases. Postgres is performant enough to handle many workloads without needing more than the minimum resources. For these workloads, the autoscaling graph looks like the one below.

<AutoscalingChart title="Fig. 2: Burst Capacity workload, 1 wk" datasetKey="anomalous_spikes" autoscalingOnly={true} showStats={false} />

In figure 2 we see that only every once in a while, with no perceptible pattern, something causes a spike in load to the database, triggering autoscaling to allocate a short burst of increased CPU and memory.

### Comparing to Provisioned

How would you size this burst capacity workload on a provisioned resource platform like RDS? Their automated rightsizing tool would add 25% to the momentary peaks. Depending on how critical the workload is and what happens when resources are maxed out on a fixed-resource database, _(do things just get slower? does the database OOM?)_ we think many users would choose to underprovision this kind of burst-y workload on RDS. 

Here's what the cost and usage of the burst capacity workload looks like if you were to underprovision it by 25% on RDS:

<AutoscalingChart title="Fig. 2a: Burst Capacity. Autoscaling vs Provisioned (RDS)" datasetKey="anomalous_spikes" width="window" autoscalingRate={0.106} overprovision={-25} />

## Scale to Zero

In Neon, compute can be configured to shut down entirely when there are no active connections, and turn back on in 350ms when needed. We see the capability at work in the last pattern of autoscaling, where databases mostly oscillate between their minimum configured size and zero.

<AutoscalingChart title="Fig. 3: Scale to Zero workload, 1 wk" datasetKey="anomalous_spikes" autoscalingOnly={true} showStats={false} />

This pattern shows up mostly in non-production databases: Dev and staging DB's that shut down outside work hours. But also prototypes, side-projects, early MVPs, etc... It takes a surprising amount of action to keep a database working 24/7.


## Methodology

### Finding an approximate Compute CU-hour rate for RDS

To find the approximate CU-hour rate to use from RDS