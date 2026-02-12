---
title: 'Compute Autoscaling Report'
subtitle: A deep-dive into the numbers behind Neon Autoscaling.
updatedOn: '2025-06-17T09:00:00.000Z'
---

### Summary

- Production databases on Neon use <span className="bg-green-45/20 text-green-45 p-1">2.4x less compute</span> and <span className="bg-green-45/20 text-green-45 p-1">50% less cost</span> than if it were running on a provisioned platform.
- Putting the same Neon production workloads on a provisioned platform would result in <span className="bg-secondary-1/20 text-secondary-1 p-1">55 performance degradations</span> per db per month because even provisioning at P99.5 + 20% doesn't account for the most extreme load spikes.
- Read replicas on Neon use <span className="bg-green-45/20 text-green-45 p-1">4x less compute</span> than if they were running on a provisioned platform because of how well autoscaling aligns with their use cases.
- Running the same small scale-to-zero workloads on <span className="bg-secondary-1/20 text-secondary-1 p-1">provisioned would cost 7.5x more</span> than Neon.

We arrive at these numbers by comparing the amount of compute used on Neon to the amount of compute it would take to run the same workloads on a provisioned (non-autoscaling) platform like RDS or Heroku. These numbers are using Dec, 2025 data.

<Admonition>
This report focuses on **compute** autoscaling only.
**Storage** also autoscales seamlessly on Neon.
(Customers are only charged for the exact storage they use.)
</Admonition>

## About Autoscaling

The amount of CPU, memory and local disk needed to run any database changes constantly over time.
For example, here is the compute utilization of a typical database over a 24-hour period:

<AutoscalingChart title="Compute Usage of a Database over 24hrs" datasetKey="actual_compute_1d" autoscalingOnly={true} showStats={false} compact={true}/>

In the chart, a CU is an index of CPU, memory, and local file cache (LFC) utilization.
1 CU ≈ 1 CPU, 4GB RAM.

<blockquote className="text-xl">
<p><em>How much compute should you buy to run this database?</em></p>
</blockquote>

In an autoscaling platform compute is allocated automatically, while in a provisioned (non-autoscaling) platform the user must decide how much compute to buy.

A provisioned platform is one where databases run on instances with a fixed amount of CPU, memory, and sometimes even disk.
To help provisioned database users make informed compute size decisions, AWS has an [RDS Rightsizing](https://aws.amazon.com/blogs/aws-cloud-financial-management/new-rightsizing-recommendations-for-amazon-rds-mysql-and-rds-postgresql-in-aws-compute-optimizer/) tool that works by finding the P99.5 CPU and memory utilization over a lookback window and adding 20%.

Here's what P99.5 + 20% looks like for our example database:

<AutoscalingChart title="Provisioned: P99.5 + 20% (AWS Recommended)" datasetKey="actual_compute_1d" showStats={false} compact={true} showOverprovisionSelector={false}/>

You can think of <span className="p-1" style={{"background-color":"rgb(255 166 76 / 0.2)", "color":"rgb(255 166 76)"}}>orange as wasted compute.</span>
It's cloud compute that we paid for, but it delivered zero value.
It just sat there idle.

Even when we over-provision, we see two <span className="bg-secondary-1/20 text-secondary-1 p-1">performance degradations in red</span>. This is because AWS rightsizing algorithm over-provisions 20% above **the P99.5%** value of resource utilization. So the most extreme 0.5% resource peaks may still exhaust the available resources.

To save money, we could also under-provision _(i.e.: buy a smaller instance)_:

<AutoscalingChart title="Provisioned: Under-provision " datasetKey="actual_compute_1d" showStats={false} compact={true} overprovision={-20} showOverprovisionSelector={false}/>

But now we see even more <span className="bg-secondary-1/20 text-secondary-1 p-1">incidents in red</span> where the database needs more compute than what is available.
At these points we might experience degraded performance, even total failure.

Autoscaling removes the sizing decision from the customer.
It uses an algorithm to buy and allocate the right amount of compute at each point in time to optimally run the database workload.

<AutoscalingChart title="Autoscaling: Compute allocated automatically to match workload" datasetKeys={['actual_compute_1d', 'autoscaling_1d']} showStats={false} compact={true} autoscalingOnly={true}/>

As you can see, with autoscaling we have:

1. **Less wasted compute** - The area in green (compute that was bought but not used) is minimal.
2. **Little or no resource exhaustion** - There are no points where the workload needed more compute than what was available.

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

When we take every production database on Neon and run the AWS RDS rightsizing algorithm on each one using their autoscaling history from December 2025, we can calculate the equivalent compute usage and cost.
For this report, a database is classified as production if it is running at greater than 1CU on average.

#### Compute

Across the entire Neon platform in December 2025, the average production database used <span className="bg-green-45/20 text-green-45 p-1">2.4x less compute</span> than if sized at 20% above P99.5 load on a provisioned platform like RDS.

<AutoscalingViz />

#### Cost

When we factor in the cost of each production database _(which varies depending on if the account is on the Scale or Launch plan)_ and compare it with a conservative `$0.1/CU-hour` equivalent for provisioned databases, that equates to <span className="bg-green-45/20 text-green-45 p-1">50% lower compute costs on Neon</span> on average.

<Admonition title="Why is cost savings less than compute savings?" type="info">
  Provisioned platforms run Postgres for you on a Virtual Machine (VM) managed by the provider. So the cost of compute in provisioned closely tracks commodity VM prices. 
  
  Autoscaling platforms run a distributed system that automatically handles high availability and keeps warm pools of capacity ready for databases that are autoscaling up. This requires additional compute and puts a small price premium on the base CU-hour rate for autoscaling relative to provisioned.
  
  See [methodology](#methodology) for our exact approach and rationale for estimating cost.
</Admonition>

#### Performance Degradations

Database compute loads can be spiky. Operations like index creates, schema changes and migrations, bulk exports, and even just user load patterns can cause spikes in memory and CPU in particular. When we follow the AWS rightsizing algorithm and provision at P99.5 + 20%, the top 0.5% of loads are often spiky enough to exceed that 20% buffer.

When we counted up the number of times each production database on Neon autoscaled up beyond the provisioned P99.5 + 20% equivalent, we found that <span className="bg-secondary-1/20 text-secondary-1 p-1">the average production database would experience 55 incidents per month</span> where compute resources would be exhausted if it were running on a provisioned platform.

Autoscaling helps turn load spikes that would cause late-night on-call pages and customer-facing issues on a provisioned platform into a few extra pennies in cost on Neon.

#### Autoscaling Events per Database

The average production database running on Neon adjusts its compute size 11,354 times per month. To understand how it works, the documentation on [Neon Autoscaling algorithm](https://neon.com/docs/guides/autoscaling-algorithm) is the best place to start.

### Production Example

Here is a detailed price comparison for a real Neon customer with a production workload.

<AutoscalingChart title="Production. Autoscaling vs Provisioned (RDS)" datasetKey="predictable_fluctuation" width="window" autoscalingRate={0.222} />

The results: <span className="bg-secondary-1/20 text-secondary-1 p-1">Provisioned uses 3.5x more compute</span> to serve the same workload, because much of the time only a fraction of allocated resources are being used. Translating that to costs, this workload incurs <span className="bg-green-45/20 text-green-45 p-1">2.1x lower cost on Neon</span> thanks to autoscaling. We're using the `$0.222/CU-hour` rate from the Neon Scale plan _recommended for businesses_ and a conservative `$0.1/CU-hour` rate for provisioned instances like RDS.

Not only is autoscaling cheaper and more efficient, but this exact workload running on a provisioned platform at exactly the AWS-recommended P99.5 + 20% compute utilization would experience <span className="bg-secondary-1/20 text-secondary-1 p-1">~73 performance degradations per month</span> as a result of exhausting the allocated resources.

#### Checking the math with actual RDS instances

The compute for this exact database costs <span className="bg-green-45/20 text-green-45 p-1">$217/month</span> on Neon.
The closest m-series latest-generation RDS instances that fit the provisioned specs necessary to run this workload are [`db.m8g.2xlarge`](https://instances.vantage.sh/aws/rds/db.m8g.4xlarge) with 8 CPU and 32GB RAM at `$0.672/hour` costing <span className="bg-secondary-1/20 text-secondary-1 p-1">$504/month</span> which is even more expensive than our $456/month estimate.

This highlights another weak point of provisioned databases. **You can't buy exactly the compute you need.** There is no 4.8CPU 19GB RAM RDS instance, so you are forced to "round up" to the next largest instance.

---

## Read Replicas

[Neon read-replicas](/docs/introduction/read-replicas) are different than those in provisioned platforms because they don't replicate or duplicate data. They read from the same storage as the primary compute. This has a few benefits:

<svg viewBox="0 0 900 320" style={{width: '100%', maxWidth: '56rem', margin: '2rem auto'}} xmlns="http://www.w3.org/2000/svg">
<text x="180" y="35" textAnchor="middle" fill="#73bf69" fontFamily="monospace" fontSize="16px" fontWeight="500">NEON</text>
<rect x="60" y="60" width="110" height="70" fill="#73bf69" fillOpacity="0.2" stroke="#73bf69" strokeWidth="2" rx="4"/>
<text x="115" y="90" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Primary</text>
<text x="115" y="108" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Compute</text>
<rect x="190" y="60" width="110" height="70" fill="#73bf69" fillOpacity="0.2" stroke="#73bf69" strokeWidth="2" rx="4"/>
<text x="245" y="90" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Read Replica</text>
<text x="245" y="108" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Compute</text>
<path d="M 115 130 L 115 165" stroke="#73bf69" strokeWidth="2" markerEnd="url(#arrowgreen)"/>
<path d="M 245 130 L 245 165" stroke="#73bf69" strokeWidth="2" markerEnd="url(#arrowgreen)"/>
<rect x="60" y="165" width="240" height="95" fill="#73bf69" fillOpacity="0.3" stroke="#73bf69" strokeWidth="2" rx="4"/>
<text x="180" y="208" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="15px" fontWeight="500">Shared Storage</text>
<text x="180" y="230" textAnchor="middle" fill="#b0b0b0" fontFamily="monospace" fontSize="13px">(Single copy of data)</text>
<line x1="420" y1="45" x2="420" y2="270" stroke="#3d3d3d" strokeWidth="1" strokeDasharray="4,4"/>
<text x="660" y="35" textAnchor="middle" fill="#e8912d" fontFamily="monospace" fontSize="16px" fontWeight="500">PROVISIONED</text>
<rect x="520" y="60" width="130" height="165" fill="#e8912d" fillOpacity="0.1" stroke="#e8912d" strokeWidth="2" rx="4"/>
<text x="585" y="90" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px" fontWeight="500">Primary Instance</text>
<rect x="540" y="105" width="90" height="50" fill="#e8912d" fillOpacity="0.2" stroke="#e8912d" strokeWidth="1" rx="2"/>
<text x="585" y="135" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Compute</text>
<rect x="540" y="165" width="90" height="50" fill="#e8912d" fillOpacity="0.3" stroke="#e8912d" strokeWidth="1" rx="2"/>
<text x="585" y="195" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Storage</text>
<rect x="690" y="60" width="130" height="165" fill="#e8912d" fillOpacity="0.1" stroke="#e8912d" strokeWidth="2" rx="4"/>
<text x="755" y="90" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px" fontWeight="500">Read Replica</text>
<rect x="710" y="105" width="90" height="50" fill="#e8912d" fillOpacity="0.2" stroke="#e8912d" strokeWidth="1" rx="2"/>
<text x="755" y="135" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Compute</text>
<rect x="710" y="165" width="90" height="50" fill="#e8912d" fillOpacity="0.3" stroke="#e8912d" strokeWidth="1" rx="2"/>
<text x="755" y="195" textAnchor="middle" fill="#e5e5e5" fontFamily="monospace" fontSize="13px">Storage</text>
<path d="M 650 130 L 690 130" stroke="#e8912d" strokeWidth="2" markerEnd="url(#arroworange)"/>
<text x="670" y="120" textAnchor="middle" fill="#b0b0b0" fontFamily="monospace" fontSize="11px">replication</text>
<defs>
<marker id="arrowgreen" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
<path d="M0,0 L0,6 L9,3 z" fill="#73bf69"/>
</marker>
<marker id="arroworange" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
<path d="M0,0 L0,6 L9,3 z" fill="#e8912d"/>
</marker>
</defs>
</svg>

| Feature             | Neon                                                     | Provisioned                                                   |
| ------------------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| **Storage costs**   | No increase when adding replicas                         | Adding a replica doubles storage costs                        |
| **Compute scaling** | Each replica independently autoscales and scales to zero | Replicas typically sized similarly to primary to avoid issues |
| **Creation time**   | Seconds, regardless of database size                     | Hours for large databases                                     |

This makes read replicas on Neon particularly valuable not just for horizontally scaling reads, but also for offloading ad-hoc or analytical queries and anything else that you may not want to impact primary performance.

### Read Replica Statistics

When we apply the same comparison logic as we did with production databases above, we find that read replicas on Neon are <span className="bg-green-45/20 text-green-45 p-1">4x more efficient</span> than if they were running on a provisioned platform, and <span className="bg-green-45/20 text-green-45 p-1">78% lower cost.</span>

<AutoscalingViz multiplier={4} provisionedTotal={160} autoscalingTotal={40} label="read replica" />

Read replicas are more compute-efficient than standard production databases because of the different ways they are used: The compute efficiency of a read replica that is only used to scale out reads is fairly similar to the 2.4x stat we saw in the standard production category. But many read replicas on Neon have particularly spiky loads, leading us to infer that they are likely used for things like analytics, ad-hoc analysis, and batch work. The spikier the workload, the more pronounced the compute savings relative to a provisioned platform.

This efficiency even accounts for cases where read replicas are created and destroyed on-demand in Neon. If a replica only exists for one day, we only compare it to one day of provisioned cost.

---

## Scale to Zero

In one of the features unique to Neon, compute can be configured to shut down entirely when there are no active connections and turn back on in [350ms](https://neon-latency-benchmarks.vercel.app/) when needed.
Many small databases have an autoscaling history that looks like the one below, oscillating between a minimum configured size and zero:

<AutoscalingChart title="Fig. 3: One week of Autoscaling on a Database with Scale-to-Zero workload" datasetKey="scale_to_zero" autoscalingOnly={true} showStats={false} compact={true} />

This pattern shows up mostly in **non-production databases**: Dev and staging DB's that shut down outside work hours. But also prototypes, side-projects, early MVPs, etc... It takes a surprising amount of action to keep a database working 24/7.

### Scale to Zero Statistics

If we tally up the compute used by small non-production databases that scale to zero on Neon and compare it with the compute required to run the same databases continually on a provisioned platform like RDS, we find that the savings are even more extreme than production databases.

#### Compute

A provisioned platform that cannot scale to zero would use <span className="bg-secondary-1/20 text-secondary-1 p-1">13.7x more compute</span> to run the same small database workloads as Neon.
This is using the same P99.5 + 20% methodology as before.

<AutoscalingViz multiplier={13.7} provisionedTotal={140} autoscalingTotal={10} label="scale-to-zero database" />

#### Costs

When we factor in costs using the rates of each database on Neon ($0.222 or $0.106 per CU-hour depending on the plan) and a conservative $0.065 per CU-hour equivalent on RDS, we find that <span className="bg-green-45/20 text-green-45 p-1">scale-to-zero reduces costs by 7.5x.</span>
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

#### Checking the math with actual RDS instances

The smallest instance we can buy on RDS is the [`db.t4g.micro`](https://instances.vantage.sh/aws/rds/db.t4g.micro?currency=USD) which runs `$11.68` per month.

## Methodology

### Conservative Estimates

We've been careful to make these numbers as conservative as possible. For example:

1. We ignore the fact that Neon comes with storage durability and high availability built-in, while provisioned platforms require you to triple your compute footprint to get durability.
2. We compute the size of provisioned instance needed per database each month. That assumes on a provisioned platform the operator would be resizing the database monthly for maximum efficiency.
3. When a Neon database scales to zero and never comes back on, we immediately stop tallying up equivalent provisioned costs. In reality many idle databases on provisioned platforms are forgotten about until an invoice or audit exposes them and someone manually terminates them.

### Classifying workloads

- **Production:** Any database with an average CU-hour rate greater than or equal to 1.
- **Scale to Zero/Non-Production:** Any database with an average CU-hour rate less than 1 that is running less than 95% of time.

We've excluded all databases on the Neon Free Plan from this analysis.

### Sizing workloads

We use P99.5 + 20% as the default over-provisioning setting following the default logic of [AWS RDS rightsizing tool](https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html). To compute the P99.5 + 20% for each database we:

1. Start with the dataset of that endpoint's autoscaling history for the month
2. Discard the 0.5% of time where the database was scaled largest.
3. Find the maximum remaining size.
4. Add 20% to it.

So if a database spent 1% of time scaled up to 8CU, the P99.5 would be 8CU and the P99.5 + 20% would be 9.6CU. If a database spent only 0.25% of time scaled up to 8CU the P99.5 would be lower.

### Provisioned costs

- **Small Databases** - We used a `$0.065` per CU-hour equivalent rate based on the equivalent hourly cost of small provisioned databases across RDS, Google Cloud SQL, Heroku, DigitalOcean and PlanetScale.
- **Large Databases** - We used a `$0.1` per CU-hour equivalent rate by starting with an equivalent hourly cost of larger production-grade instances on provisioned database platforms like RDS, Google Cloud SQL, Heroku, DigitalOcean and Aiven.

### Counting Incidents

To get a count of performance degradation incidents, we:

1. Calculate the P99.5 + 20% "provisioned equivalent" size of each Neon database for each month
2. Count the number of distinct time periods where the autoscaling history showed the database scaling up to larger than the P99.5 + 20% size.

This means if a database spent 1 minute above the P99.5 + 20% threshold, it would count as one incident, and if it scaled above and below the threshold for 5 seconds at a time in three separate occasions it would count as three incidents.

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
