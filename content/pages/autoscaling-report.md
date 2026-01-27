---
title: 'Compute Autoscaling Report'
subtitle: A deep-dive into the numbers behind Neon Autoscaling in 2025.
updatedOn: '2025-06-17T09:00:00.000Z'
---

### Summary

- Neon customers <span className="bg-green-45/20 text-green-45 p-1">saved $74.3 million</span> in 2025 using Autoscaling.
- Production databases use <span className="bg-green-45/20 text-green-45 p-1">4.6x less compute</span> on Neon by scaling up and down to match workload.
- Autoscaling <span className="bg-green-45/20 text-green-45 p-1">prevented 51 million performance degradation</span> incidents in 2025.
- Running scale-to-zero workloads on <span className="bg-secondary-1/20 text-secondary-1 p-1">provisioned costs 14.6x more</span> than on Neon.

We arrive at these numbers by comparing the amount of compute used on Neon to the amount of compute it would take to run the same workloads on a provisioned (non-autoscaling) platform like RDS.

<Admonition>
This report focuses on **compute** autoscaling only.
**Storage** also autoscales seamlessly on Neon.
(Customers are only charged for the exact storage they use.)
</Admonition>

## About Autoscaling

The amount of CPU, memory and local disk needed to run any database changes constantly over time.
For example, here's the aggregate compute utilization over a 24-hour period for an average database:

<AutoscalingChart title="Compute Usage of a Database over 24hrs" datasetKey="actual_compute_1d" autoscalingOnly={true} showStats={false} compact={true}/>

In the chart above, a CU is an index of CPU, memory, and local file cache (LFC) utilization.
1 CU ≈ 1 CPU, 4GB RAM.

<blockquote className="text-xl">
<p><em>How much compute should you buy to run this database?</em></p>
</blockquote>

A **provisioned** database platform (RDS for example) is one where databases run on instances with a fixed amount of CPU, memory, and sometimes even disk.
Sizing a workload in provisioned platforms presents a challenge because nobody knows how much compute their database will use in the future.

Since we are only looking at past usage in this report, we can model the instance size any database needs using Amazon's database rightsizing algorithm which defaults to recommending "P99.5 utilization + 20%" when it comes to CPU and memory:

<AutoscalingChart title="Provisioned: P99.5 + 20% (AWS Recommended)" datasetKey="actual_compute_1d" showStats={false} compact={true} showOverprovisionSelector={false}/>

In the chart above, the <span className="p-1" style={{"background-color":"rgb(255 166 76 / 0.2)", "color":"rgb(255 166 76)"}}>orange is wasted compute.</span>
It's cloud compute that we paid for, but it delivered zero value.
It just sat there idle.

Even when we over-provision, we see some <span className="bg-secondary-1/20 text-secondary-1 p-1">performance degradations in red</span>. This is because AWS rightsizing algorithm over-provisions 20% above **the P99.5%** value of resource utilization. So the most extreme 0.5% resource peaks may still exhaust the available resources.

To save money, we could under-provision _(i.e.: buy a smaller instance)_:

<AutoscalingChart title="Provisioned: Under-provision " datasetKey="actual_compute_1d" showStats={false} compact={true} overprovision={-20} showOverprovisionSelector={false}/>

But now we see <span className="bg-secondary-1/20 text-secondary-1 p-1">incidents in red</span> where the database needs more compute than what is available.
At these points we might experience degraded performance, even total failure.

Autoscaling removes the sizing decision from the customer.
It uses an algorithm to buy and allocate the right amount of compute at each point in time to optimally run the database workload.

<AutoscalingChart title="Autoscaling: Compute allocated automatically to match workload" datasetKeys={['actual_compute_1d', 'autoscaling_1d']} showStats={false} compact={true} autoscalingOnly={true}/>

Two improvements are clear in the chart above:

1. **Less wasted compute** - The area in green (compute that was bought but not used) is minimal.
2. **Less resource exhaustion** - There are no points where the workload needed more compute than what was available.

Throughout the rest of this report, we focus on the difference between the amount of compute (and costs) used in an autoscaling vs provisioned database platform running the same workloads.

## Production Autoscaling

Most production databases have a predictable periodic pattern of load, especially at 24-hour and 7-day intervals.
Here is the autoscaling history of a Neon database that illustrates it well:

<AutoscalingChart title="One week of Autoscaling on a Production Database" datasetKey="predictable_fluctuation" autoscalingOnly={true} showStats={false} compact={true}/>

Three patterns are visible:

1. **Intra-day**: Within a 24hr period, load hits a mid-day peak and a nightly trough.
2. **Weekend**: On the weekend, load is noticeably lower.
3. **Daily spike**: A scheduled task causes a spike at the same time most days.

### Production Statistics

When we take every production database on Neon and run the AWS RDS rightsizing algorithm on each one using their autoscaling history from 2025, we can calculate the equivalent compute usage and cost.

#### Compute
Across the entire Neon platform in 2025, the average production database used <span className="bg-green-45/20 text-green-45 p-1">4.6x less compute</span> than if sized at 20% above P99.5 load on a provisioned platform like RDS.

<AutoscalingViz />

#### Cost
When we factor in the cost of each database _(which varies depending on if the account is on the Scale or Launch plan)_ and compare it with a conservative `$0.132/CU-hour` equivalent for large provisioned databases, that equates to compute for production databases see <span className="bg-green-45/20 text-green-45 p-1">2x lower costs on Neon</span> on average.

### Production Example

Here is a detailed price comparison for a real Neon customer with a production workload.
If it were running on a provisioned instance, this database would need enough CPU and Memory allocated to always be safely above peak load.
AWS rightsizing recommendations default to recommending "P99.5 + 20%".

<AutoscalingChart title="Production. Autoscaling vs Provisioned (RDS)" datasetKey="predictable_fluctuation" width="window" autoscalingRate={0.222} />

The results: <span className="bg-secondary-1/20 text-secondary-1 p-1">Provisioned uses 3.5x more compute</span> to serve the same workload, because much of the time only a fraction of allocated resources are being used. Translating that to costs, this workload incurs <span className="bg-green-45/20 text-green-45 p-1">2.1x lower cost on Neon</span> thanks to autoscaling. We're using the `$0.222/CU-hour` rate from the Neon Scale plan _recommended for businesses_ and a conservative `$0.132/CU-hour` rate for provisioned instances like RDS.

#### Checking the math with actual RDS instances

The compute for this exact database costs <span className="bg-green-45/20 text-green-45 p-1">$217/month</span> on Neon.
The closest m-series latest-generation RDS instances that fit the provisioned specs necessary to run this workload are [`db.m8g.2xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 8 CPU and 32GB RAM at `$0.672/hour` costing <span className="bg-secondary-1/20 text-secondary-1 p-1">$504/month</span> which is slightly higher than our $456/month estimate.

This highlights another weak point of provisioned databases. **You can't buy exactly the compute you need.** There is no 4.8CPU 19GB RAM RDS instance, so you are forced to "round up" to the next largest instance.


---

## Scale to Zero

In one of the features unique to Neon, compute can be configured to shut down entirely when there are no active connections and turn back on in [350ms](https://neon-latency-benchmarks.vercel.app/) when needed.
Many small databases have an autoscaling history that looks like the one below, oscillating between a minimum configured size and zero: 

<AutoscalingChart title="Fig. 3: One week of Autoscaling on a Database with Scale-to-Zero workload" datasetKey="scale_to_zero" autoscalingOnly={true} showStats={false} compact={true} />

This pattern shows up mostly in **non-production databases**: Dev and staging DB's that shut down outside work hours. But also prototypes, side-projects, early MVPs, etc... It takes a surprising amount of action to keep a database working 24/7.

### Scale to Zero Statistics

Tallying up all the compute used by databases on the Neon platform in 2025 that scaled to zero, and comparing that with the compute required to run the same databases continually on a provisioned platform like RDS, we find that provisioned would use <span className="bg-secondary-1/20 text-secondary-1 p-1">33.2x more compute.</span>

When we factor in costs using the rates of each database on Neon ($0.222 or $0.106 per CU-hour depending on the plan) and a conservative $0.065 per CU-hour equivalent on RDS, we find that <span className="bg-green-45/20 text-green-45 p-1">scale-to-zero reduces costs by 10x.</span>
The savings numbers from scale to zero are dramatic enough to make it clear that this feature is changing customer behavior.
Scale to zero changes the equation on what types of database usage patterns are economically viable.

### Scale to Zero Example

Here is an actual autoscaling history from a scale-to-zero database on Neon:

<AutoscalingChart title="Fig. 3a: Scale-to-Zero workload. Neon vs Provisioned" datasetKey="scale_to_zero" width="window" autoscalingRate={0.106} overprovision={0} compact={true} fixedRate={0.065}  />

Because of how often this database goes idle and scales to zero, this exact workload only uses 25 CU-hours/month on Neon.
(Because it is running at 0.25 CU when it's on, that means it's active for 100 hours per month.)
That drives the cost down to <span className="bg-green-45/20 text-green-45 p-1">$2.68/month</span>.

Provisioned platforms cannot scale to zero, so your best option for this workload is to buy the smallest instance that fits the workload (zero over-provisioning).
Using that approach, running a similar workload on RDS would use <span className="bg-secondary-1/20 text-secondary-1 p-1">7.1x more compute</span> and <span className="bg-secondary-1/20 text-secondary-1 p-1">cost 4.4x more</span>.

## Methodology

### Conservative Estimates

We've been careful to make these numbers as conservative as possible. For example:

1. We ignore the fact that Neon comes with durability and high availability built-in, while provisioned platforms require you to triple your compute footprint to get durability.
2. We compute the size of provisioned instance needed per database each month. That assumes on a provisioned platform the operator would be resizing the database monthly for maximum efficiency.
3. When a Neon database scales to zero and never comes back on, we immediately stop tallying up equivalent provisioned costs. In reality many idle databases on provisioned platforms are forgotten about until an invoice or audit exposes them and someone manually terminates them.

### Classifying workloads

- **Production:** Any database with an average CU-hour rate greater than or equal to 1.
- **Scale to Zero:** Any database that is running less than 95% of time.

### Sizing workloads

We use P99.5 + 20% as the default over-provisioning setting https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html

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
