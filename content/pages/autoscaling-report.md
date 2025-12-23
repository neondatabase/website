---
title: 'Compute Autoscaling Report'
subtitle: A deep-dive into the usage patterns and numbers behind Neon Autoscaling.
updatedOn: '2025-06-17T09:00:00.000Z'
---

Up to ten times per second, we check the CPU, Memory, and Local file cache (LFC) utilization of every database running on Neon. If resource utilization is approaching the upper limit we give the database more resources, if utilization is low we reduce resources (and charge less.) This is **compute autoscaling.**


By regularly adjusting compute to suit the demands of each workload, Autoscaling saved Neon customers a total of $82 million in 2025. By scaling up quickly when a database receives an anomalous spike in load, Autoscaling has prevented 1.75 million performance degradations or outages.

<div className="not-prose my-12 grid gap-6 grid-cols-2">
  <div className="p-8 rounded-lg border border-gray-new-20 bg-gray-new-10">
    <div className="uppercase text-gray-new-60 text-sm">NEON Autoscaling in 2025</div>
    <div className="text-5xl font-bold tracking-tight text-black-new dark:text-white sm:text-6xl">
      $82M
    </div>
    <div className="mt-4 text-lg text-gray-new-40 dark:text-gray-new-60">
      Compute costs saved.
    </div>
    <a className="text-sm mt-2" href="#methodology">Methodology</a>
  </div>
  <div className="p-8 rounded-lg border border-gray-new-20 bg-gray-new-10">
    <div className="text-5xl font-bold tracking-tight text-black-new dark:text-white sm:text-6xl">
      1.75M
    </div>
    <div className="mt-4 text-lg text-gray-new-40 dark:text-gray-new-60">
      Performance degradations and outages prevented.
    </div>
    <a className="text-sm mt-2" href="#methodology">Methodology</a>
  </div>
</div>

How do we arrive at those numbers? This report explains by first describing the three patterns of autoscaling usage on Neon, and then walking through the methodology for how we compute the equivalent cost and performance degradations running the same workloads on a provisioned platform.

## Terminology

- **Autoscaling** - the automated adjustment of **compute resources** to fit the needs of current load. Neon also autoscales **storage**, but this report focuses only on the compute side.
- **Provisioned Database** - a database that does not have compute autoscaling, where the user must select the CPU, RAM, (and storage) configuration upon creation.
- **Compute Unit (CU)** - used in autoscaling systems to refer to an allocation of compute. In Neon 1CU = 1vCPU, 4GB RAM.
- **CU-hour** - a consumption unit corresponding to one hour of 1 CU. Autoscaling systems charge a rate per CU-hour, and a CU-hour can be consumed flexibly, e.g. running at 4CU for 15 minutes or 0.25 CU for 4 hrs.

## Autoscaling Usage Patterns

We see three distinct patterns of autoscaling usage on our platform.

<span class="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 1</span>

### Predictable Fluctuation

Most high-throughput databases have a predictable periodic pattern of load, especially at 24-hour and 7-day intervals. 

<AutoscalingChart title="Fig. 1: One week of Autoscaling on a Database with Predictable Fluctuation" datasetKey="predictable_fluctuation" autoscalingOnly={true} showStats={false} />

Figure 1 is the exact autoscaling record of a Neon database that fits the Predictable Fluctuation pattern. In the week of autoscaling we see three patterns:

1. **Intra-day**: Within 24hr period, load reaches a mid-day peak and a nightly trough
2. **Weekend**: On the weekend, load is noticeably less.
3. **Daily spike**: A scheduled task causes a spike at the same time most days.

#### Running the same workload on a provisioned instance

> _What if you took this exact workload and ran it on a provisioned database like RDS?_

Unless you're prepared to deal with daily outages and performance degradations, on a provisioned instance you'd need to allocate enough resources to be safely above peak load. AWS rightsizing recommendations default to recommending 25% above peak load. _You can change the over-provision approach in the dropdown to the right if you want._

<AutoscalingChart title="Fig. 1a: Predictable Fluctuation. Autoscaling vs Provisioned (RDS)" datasetKey="predictable_fluctuation" width="window" autoscalingRate={0.222} />

<Admonition title="How to read this report" type="info">
You can think of the orange area as all the wasted compute. This is CPU and RAM that would need to be allocated in the provisioned database but will never actually be used.

![Wasted compute](/autoscaling/wasted-compute.png)

You can 
</Admonition>

When you size your instance to be 25% larger than peak load _(the default in AWS RDS rightsizing recommendations[1])_ a provisioned instance like `RDS uses 7.4x more compute`. Translating that to costs, we're using the $0.222 per CU-hour rate from the Neon Scale plan (our most comprehensive plan recommended for businesses) and a conservative $0.085 per CU-hour rate for provisioned instances like RDS. This nets out at `2.8x lower cost on Neon` thanks to autoscaling.

#### Checking the math with actual RDS instances

This exact database uses $217.14 worth of compute per month on Neon. The closest m-series latest-generation RDS instances that fit the provisioned specs necessary to run this workload are [`db.m8g.2xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 8 CPU and 32GB RAM at $0.672/hour costing $504/month, but that's barely clearing peak load. The next step up is [`db.m8g.4xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 16 CPU and 64GB RAM at $1.344/hour costing $1008/month.

This highlights another weak point of provisioned databases. **You can't buy exactly the compute you need.** There is no 10CPU 40GB RAM RDS instance, so you are forced to "round up" significantly to the next largest instance.

#### Predictable Fluctuation savings across the Platform

The 7.4x compute savings and 2.8x cost savings hold consistent across all predictable fluctuation workloads on the entire Neon platform, contributing a significant amount to the $82 million in overall savings for Neon customers in 2025.

---

<span class="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 2</span>

### Burst Capacity

For a second category of databases, the autoscaling graph looks like the one below.

<AutoscalingChart title="Fig. 2: One week of Autoscaling on a Database with Burst workload" datasetKey="anomalous_spikes" autoscalingOnly={true} showStats={false} />

In figure 2 we see that only every once in a while, with no perceptible pattern, something causes a spike in load to the database, triggering autoscaling to allocate a short burst of increased CPU and memory. 

**When a smaller database has burst capacity autoscaling pattern** like the one above, spending most of its time at 0.25 vCPU and 1GB RAM, we can infer that even this minimum set of resources is sufficient to run most of the database load.

**Larger databases show burst capacity autoscaling pattern, too.** Meaning that the operator has intentionally set a higher minimum CU size, typically to guarantee a baseline performance at all times.

#### Running the same workload on a provisioned instance

> _How would you size this burst capacity workload on a provisioned platform like RDS?_

Their automated rightsizing tool would add 25% to the momentary peaks. Depending on how critical the workload is and what happens when resources are maxed out on a fixed-resource database, _(do things just get slower? does the database OOM?)_ we think many users would choose to underprovision this kind of burst-y workload on RDS. 

Here's what the cost and usage of the burst capacity workload looks like if you were to underprovision it by 25% on RDS:

<AutoscalingChart title="Fig. 2a: Burst Capacity. Autoscaling vs Provisioned (RDS)" datasetKey="anomalous_spikes" width="window" autoscalingRate={0.106} overprovision={-25} />

Even when under-provisioned by 25%, autoscaling uses 3x less compute and 2.4x less cost than a provisioned platform.
That equates to $27 monthly savings for this exact database: The workload costs $19.11 on Neon and $45.90 on a provisioned platform like RDS.
We arrived at these costs by using the Neon Launch plan rates of $0.106 per CU-hour since this is a smaller database, and an equivalent provisioned rate of $0.085.
Because we have under-provisioned by 25% in this model, we can expect the provisioned database to experience ~4 performance degradations or outages every month.

#### Checking the math with actual RDS instances

Since this specific workload is on the small size, we would 

#### Burst Capacity savings across the Platform

For every database on Neon with autoscaling behavior categorized as burst capacity, we modeled the savings and quantity of performance degradations or outages by taking the same approach as above: under-provision 25% below peak load, compare the costs using the Launch plan rates and a rate of $0.085 per CU-hour for provisioned. We counted a performance degradation or outage for provisioned every time one of these databases autoscaled above the provisioned capacity.

**RESULTS**

---

<span class="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 3</span>

### Scale to Zero

In Neon, compute can be configured to shut down entirely when there are no active connections, and turn back on in 350ms when needed. We see the capability at work in the last pattern of autoscaling, where databases mostly oscillate between their minimum configured size and zero.

<AutoscalingChart title="Fig. 3: One week of Autoscaling on a Database with Scale-to-Zero workload" datasetKey="scale_to_zero" autoscalingOnly={true} showStats={false} />

This pattern shows up mostly in non-production databases: Dev and staging DB's that shut down outside work hours. But also prototypes, side-projects, early MVPs, etc... It takes a surprising amount of action to keep a database working 24/7.


<AutoscalingChart title="Fig. 3a: Scale-to-Zero workload. Neon vs Provisioned" datasetKey="scale_to_zero" width="window" autoscalingRate={0.106} overprovision={-25} />

## Methodology

### Finding an approximate Compute CU-hour rate for RDS

To find the approximate CU-hour rate to use from RDS