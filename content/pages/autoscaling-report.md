---
title: 'Compute Autoscaling Report'
subtitle: A deep-dive into the numbers behind Neon Autoscaling in 2025.
updatedOn: '2025-06-17T09:00:00.000Z'
---

### Summary

- Neon customers <span className="bg-green-45/20 text-green-45 p-1">saved $46.5 million</span> in 2025 using Autoscaling.
- Standard Production databases use <span className="bg-green-45/20 text-green-45 p-1">4.6x less compute</span> on Neon by scaling up and down to match workload.
- Autoscaling <span className="bg-green-45/20 text-green-45 p-1">prevented 9.2 million incidents</span> on burst-capacity workloads in 2025.
- Running scale-to-zero workloads on <span className="bg-secondary-1/20 text-secondary-1 p-1">provisioned costs 10x more</span> than on Neon.

This report explains how we get these numbers by looking at the difference between compute used on Neon vs compute required to run each Neon database on a provisioned (non-autoscaling) database platform.

<Admonition>
This report focuses on **compute** autoscaling only.
**Storage** also autoscales seamlessly on Neon.
(Customers are only charged for the exact storage they use.)
</Admonition>

## About Autoscaling

Every database needs a varying amount of CPU, memory and local disk over time as it's workload evolves.
What we see below is a simplified database compute unit (CU) metric charted over 24hrs.

<AutoscalingChart title="Compute Usage of a Database over 24hrs" datasetKey="actual_compute_1d" autoscalingOnly={true} showStats={false} compact={true}/>

A CU is an index of CPU, memory, and local file cache (LFC).
1 CU = 1 CPU, 4GB RAM.

<blockquote className="text-xl">
<p><em>How much compute do you need to buy to run this database?</em></p>
</blockquote>

A **provisioned** database platform (RDS for example) is one where databases run on instances with a fixed amount of CPU, memory, and sometimes even disk.
Sizing a workload presents a challenge because nobody knows how much compute a database will use in the future.

But in this report we are looking at historic usage, so we can model the instance size any database needs using Amazon's database rightsizing algorithm which defaults to recommending "peak utilization + 20%" when it comes to CPU and memory:

<AutoscalingChart title="Provisioned: Over-provisioned by 20% (AWS Recommended)" datasetKey="actual_compute_1d" showStats={false} compact={true} showOverprovisionSelector={false}/>

In the chart above, the <span className="p-1" style={{"background-color":"rgb(255 166 76 / 0.2)", "color":"rgb(255 166 76)"}}>orange is wasted compute.</span>
It's cloud compute that we paid for, but it delivered zero value.
It just sat there idle.

To save money, we could under-provision _(i.e.: buy a smaller instance)_:

<AutoscalingChart title="Provisioned: Under-provisioned by 50%" datasetKey="actual_compute_1d" showStats={false} compact={true} overprovision={-50} showOverprovisionSelector={false}/>

But now we see <span className="bg-secondary-1/20 text-secondary-1 p-1">incidents in red</span> where the database needs more compute than what is available.
At these points we might experience degraded performance, even total failure.

Autoscaling removes the sizing decision from the customer.
It uses an algorithm to buy and allocate the right amount of compute at each point in time to optimally run the database workload.

<AutoscalingChart title="Autoscaling: Compute allocated automatically to match workload" datasetKeys={['actual_compute_1d', 'autoscaling_1d']} showStats={false} compact={true} autoscalingOnly={true}/>

Two improvements are clear in the chart above:

1. **Less wasted compute** - The area in green (compute that was bought but not used) is minimal.
2. **Less resource exhaustion** - There are no points where the workload needed more compute than what was available.

Throughout the rest of this report, we focus on the difference between the amount of compute (and costs) used in an autoscaling vs provisioned database platform running the same workloads.

## Autoscaling Usage Patterns

We see three distinct patterns of autoscaling usage on Neon: [Standard Production](#standard-production), [Burst Capacity](#burst-capacity), and [Scale to Zero](#scale-to-zero).
For each, we take a different approach to rightsizing the workload on a provisioned platform.

---

<span className="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 1</span>

### Standard Production

Most production databases have a predictable periodic pattern of load, especially at 24-hour and 7-day intervals.

<AutoscalingChart title="One week of Autoscaling on a Standard Production Database" datasetKey="predictable_fluctuation" autoscalingOnly={true} showStats={false} compact={true}/>

The chart above is the autoscaling record of a Neon database that exemplifies the standard production pattern. In a week of autoscaling we see three patterns:

1. **Intra-day**: Within a 24hr period, load hits a mid-day peak and a nightly trough.
2. **Weekend**: On the weekend, load is noticeably lower.
3. **Daily spike**: A scheduled task causes a spike at the same time most days.

#### Running the same workload on a provisioned instance

> _What if you took this exact workload and ran it on a provisioned database like RDS?_

On a provisioned instance, you need to allocate enough resources to be safely above peak load.
AWS rightsizing recommendations default to recommending "peak + 20%".

<AutoscalingChart title="Standard Production. Autoscaling vs Provisioned (RDS)" datasetKey="predictable_fluctuation" width="window" autoscalingRate={0.222} />

The results: <span className="bg-secondary-1/20 text-secondary-1 p-1">Provisioned uses 7.1x more compute</span> to serve the same workload, because much of the time only a fraction of allocated resources are being used. Translating that to costs, this workload incurs <span className="bg-green-45/20 text-green-45 p-1">2.7x lower cost on Neon</span> thanks to autoscaling. We're using the `$0.222/CU-hour` rate from the Neon Scale plan _recommended for businesses_ and a conservative `$0.085/CU-hour` rate for provisioned instances like RDS.

#### Checking the math with actual RDS instances

The compute for this exact database costs <span className="bg-green-45/20 text-green-45 p-1">$217/month</span> on Neon. The closest m-series latest-generation RDS instances that fit the provisioned specs necessary to run this workload are [`db.m8g.2xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 8 CPU and 32GB RAM at `$0.672/hour` costing <span className="bg-secondary-1/20 text-secondary-1 p-1">$504/month</span>, but that's barely clearing peak load. The next step up is [`db.m8g.4xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 16 CPU and 64GB RAM at `$1.344/hour` costing <span className="bg-secondary-1/20 text-secondary-1 p-1">$1008/month</span>.

The math checks out. Our estimated cost of $587 is on the low side of the range between the two available RDS instances.

This highlights another weak point of provisioned databases. **You can't buy exactly the compute you need.** There is no 10CPU 40GB RAM RDS instance, so you are forced to "round up" significantly to the next largest instance.

<div className="relative rounded-[1px] border-l-4 bg-gray-new-98 px-6 py-4 dark:bg-gray-new-8 border-[#2982FF] dark:border-[#4C97FF]" style={{"margin-left":"-2rem"}}>
<span className="relative w-fit font-semibold tracking-extra-tight text-[#2982FF] text-xl">Platform-wide Data for Standard Production Workloads</span>

Across the entire Neon platform in 2025, the average standard production database used <span className="bg-green-45/20 text-green-45 p-1">4.6x less compute</span> than if sized at 20% above peak load on a provisioned platform like RDS.

When we factor in the cost of each database _(which varies depending on if the account is on the Scale or Launch plan)_ and compare it with a conservative `$0.085/CU-hour` equivalent for RDS, that equates to compute for production databases see <span className="bg-green-45/20 text-green-45 p-1">82% lower costs on Neon</span> on average.

</div>

<span className="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 2</span>

### Burst Capacity

For a second category of databases, the autoscaling graph looks like the one below.

<AutoscalingChart title="One week of Autoscaling on a Database with Burst workload" datasetKey="anomalous_spikes" autoscalingOnly={true} showStats={false}  compact={true}/>

In the chart above, we see that only every once in a while, with no pattern, something causes a spike in load to the database, triggering autoscaling to allocate a short burst of increased CPU and memory.

**For smaller databases**, _like the one above_, this means even the minimum set of resources is sufficient to run most of the database load.
<AutoscalingChart title="Small Database Burst Capacity Pattern" datasetKeys={["burst_1d_small_actual", "burst_1d_small"]} autoscalingOnly={true} showStats={false} compact={true}/>

**For larger databases** it means that the operator has intentionally set a higher minimum CU size, typically to guarantee a baseline performance at all times.
<AutoscalingChart title="Large Database Burst Capacity Pattern" datasetKeys={["actual_compute_1d", "autoscaling_high_min_1d"]} autoscalingOnly={true} showStats={false} compact={true}/>

#### What causes load spikes?

Anecdotally, we see such spikes as a result of index or vacuum operations, database migrations, and batch imports/exports. All of these can cause a momentary spike in resource consumption. Autoscaling turns what could have been an outage or performance degradation into a few extra pennies of cost.

#### Running burst capacity workloads on a provisioned instance

> _How would you size a burst capacity workload on a provisioned platform like RDS?_

Depending on how critical the workload is, we think many users would choose to ignore the typical rightsizing recommendations and underprovision this kind of burst-y workload on RDS. Particularly on the small end of the scale.

Here's what the cost and usage of the burst capacity workload looks like if you were to underprovision it by 25% on RDS:

<AutoscalingChart title="Burst Capacity. Autoscaling vs Provisioned (RDS)" datasetKey="anomalous_spikes" width="window" autoscalingRate={0.106} overprovision={-25} fixedRate={0.065} />

Even when under-provisioned by 25%, autoscaling uses 3x less compute and half the cost than a provisioned platform.
That equates to $16 monthly savings for this exact database: The workload costs <span className="bg-green-45/20 text-green-45 p-1">$19.11 on Neon</span> and <span className="bg-secondary-1/20 text-secondary-1 p-1">$35.10 on a provisioned platform</span> like RDS.

We arrived at these costs by using the Neon Launch plan rates of `$0.106/CU-hour` since this is a smaller database, and an equivalent provisioned rate of `$0.065/CU-hour`.
Because we have under-provisioned by 25% in this model, we can expect the provisioned database to experience ~4 performance degradations or outages every month.

#### Checking the math with actual RDS instances

There is no RDS instance that has 3GB RAM. We have to choose between:

- **Under-provision by 50%.** Spend $23.36/month on the [`db.t4g.small`](https://instances.vantage.sh/aws/rds/db.t4g.small?currency=USD&duration=monthly) with 2GB RAM and deal with ~9 performance degradations or outages/month.
- **Provision at peak** and spend $46.80/month on the [`db.t4g.medium`](https://instances.vantage.sh/aws/rds/db.t4g.medium?currency=USD&duration=monthly) with 4GB RAM

The math checks out, our estimated provisioned cost of $37.44 is right between the two closest options on RDS.

<div className="relative rounded-[1px] border-l-4 bg-gray-new-98 px-6 py-4 dark:bg-gray-new-8 border-[#2982FF] dark:border-[#4C97FF]" style={{"margin-left":"-2rem"}}>
<span className="relative w-fit font-semibold tracking-extra-tight text-[#2982FF] text-xl">Platform-wide data for Burst-capacity workloads</span>

For every database on Neon with autoscaling behavior categorized as burst capacity, we modeled the savings and quantity of performance degradations or outages by taking the following approach:

- **For small databases** - Provision at their steady-state size on Neon _(i.e. 0.25 CU in the example above)_ and tally up the number of spikes as "incidents" - these are the points where the operator would experience performance degradations or outages on the provisioned platform.
- **For large databases** - Follow AWS recommendations of provisioning at peak load + 20%

</div>

---

<span className="not-prose relative top-6 -mb-6 text-sm font-semibold uppercase leading-none -tracking-extra-tight sm:text-[10px] text-blue-80">Pattern 3</span>

### Scale to Zero

In Neon, compute can be configured to shut down entirely when there are no active connections, and turn back on in 350ms when needed. We see the capability at work in the last pattern of autoscaling, where databases mostly oscillate between their minimum configured size and zero.

<AutoscalingChart title="Fig. 3: One week of Autoscaling on a Database with Scale-to-Zero workload" datasetKey="scale_to_zero" autoscalingOnly={true} showStats={false} compact={true} />

This pattern shows up mostly in non-production databases: Dev and staging DB's that shut down outside work hours. But also prototypes, side-projects, early MVPs, etc... It takes a surprising amount of action to keep a database working 24/7.

<AutoscalingChart title="Fig. 3a: Scale-to-Zero workload. Neon vs Provisioned" datasetKey="scale_to_zero" width="window" autoscalingRate={0.106} overprovision={0} compact={true} fixedRate={0.065}  />

Because of how often this database goes idle and scales to zero, this exact workload only uses 25 CU-hours/month on Neon.
(Because it is running at 0.25 CU when it's on, that means it's active for 100 hours per month.)
That drives the cost down to <span className="bg-green-45/20 text-green-45 p-1">$2.68/month</span>.

Provisioned platforms cannot scale to zero, so your best option for this workload is to buy the smallest instance that fits the workload (zero over-provisioning).
Using that approach, running a similar workload on RDS would use <span className="bg-secondary-1/20 text-secondary-1 p-1">7.1x more compute</span> and <span className="bg-secondary-1/20 text-secondary-1 p-1">cost 4.4x more</span>.

<div className="relative rounded-[1px] border-l-4 bg-gray-new-98 px-6 py-4 dark:bg-gray-new-8 border-[#2982FF] dark:border-[#4C97FF]" style={{"margin-left":"-2rem"}}>
<span className="relative w-fit font-semibold tracking-extra-tight text-[#2982FF] text-xl">Platform-wide data for Scale-to-zero workloads</span>

Tallying up all the compute used by databases on the Neon platform in 2025 that scaled to zero, and comparing that with the compute required to run the same databases continually on a provisioned platform like RDS, we find that provisioned would use <span className="bg-secondary-1/20 text-secondary-1 p-1">33.2x more compute.</span>

When we factor in costs using the rates of each database on Neon ($0.222 or $0.106 per CU-hour depending on the plan) and a conservative $0.065 per CU-hour equivalent on RDS, we find that <span className="bg-green-45/20 text-green-45 p-1">scale-to-zero reduces costs by 10x.</span>
The savings numbers from scale to zero are dramatic enough to make it clear that this feature is changing customer behavior.
Scale to zero changes the equation on what types of database usage patterns are economically viable.

</div>

## Methodology

### Conservative Estimates

We've been careful to make these numbers as conservative as possible. For example:

1. We ignore the fact that provisioned platforms add costs by forcing buyers to "round up", by only offering certain sizes (e.g. you can't buy an RDS instance with 5 CPU and 20 GB RAM.)
2. We ignore the fact that Neon comes with durability built-in, while provisioned platforms require you to triple your compute footprint to get durability.
3. We compute the size of provisioned instance needed per database each month. That assumes on a provisioned platform the operator would be resizing the database monthly for maximum efficiency.
4. When a Neon database scales to zero and doesn't come back on, we

### Classifying workloads

- **Standard Production:** Any database that is active more than 95% of time and spends more than 5% of time above it's minimum configured compute size.
- **Burst Capacity:** Any database that is running more than 95% of time and spends less than 5% of time above it's minimum configured compute size.
- **Scale to Zero:** Any database that is running less than 95% of time.

### Sizing workloads

We use peak + 20% as the default over-provisioning setting https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html

- **Standard Production** -
  - **Compute:** We look at the largest autoscaling size each database hits each month, add 20% (as prescribed by AWS Rightsizing recommendations) and assume that is the provisioned size for that database for that month. We only compute this for days the database exists. _If the database is deleted halfway through the month, we only tally up provisioned compute for half the month as well._
  - **Cost:** For Neon costs, we use the rate corresponding to that specific database ($0.106/CU-hour for databases on Launch plans and $0.222 for databases on Scale plans) and for provisioned costs we use a very conservative $0.085/CU-hour equivalent that we reached by looking at the average cost per 1CPU/4GB RAM for RDS instances.

- **Burst Capacity:**
- **Compute:** For instances that spend most of their time at the minimum size available on Neon (0.25 CU) we assume the customer wouldn't provision for peak load and just
- **Cost:** For Neon costs, we use the rate corresponding to that specific database ($0.106/CU-hour for databases on Launch plans and $0.222 for databases on Scale plans) and for provisioned costs we use a very conservative $0.085/CU-hour equivalent that we reached by looking at the average cost per 1CPU/4GB RAM for RDS instances.

### Provisioned costs

To find the approximate CU-hour rate to use from RDS

### Counting Incidents

## Terminology

<DefinitionList>
Autoscaling
: The automated adjustment of **compute resources** to fit the needs of current load. Neon also autoscales **storage**, but this report focuses only on the compute side.

Provisioned Database
: A database that does not have compute autoscaling, where the user must select the CPU, RAM, (and storage) configuration upon creation.

Compute Unit (CU)
: Used in autoscaling systems to refer to an allocation of compute. In Neon, 1CU = 1vCPU, 4GB RAM.

CU-hour
: A consumption unit corresponding to one hour of 1 CU. Autoscaling systems charge a rate per CU-hour, and a CU-hour can be consumed flexibly, e.g. running at 4CU for 15 minutes or 0.25 CU for 4 hrs.

</DefinitionList>
