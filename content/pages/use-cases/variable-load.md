---
title: Variable Load
subtitle: Optimize performance and cost by automatically scaling compute
enableTableOfContents: true
updatedOn: '2026-02-13T00:00:00.000Z'
---

## Your traffic isn’t flat, your compute shouldn’t be either

Most production workloads aren’t steady: they vary hour by hour, they drop at night, they dip on weekends; they spike further during migrations, bulk exports, product launches. The typical compute usage pattern of a production database looks like this:

![Typical load pattern of a production database over one week](/use-cases/variable-load/typical-weekly-load-pattern.png)

![Typical load pattern of a production database over 24 hours](/use-cases/variable-load/typical-daily-load-pattern.png)

**There’s nothing fixed about this compute usage, yet most managed Postgres platforms still run on fixed-size instances.** You’re forced to choose how much CPU and memory to buy up front and live with that decision.

That creates a structural tradeoff:

- Overprovision to stay safe → waste money most of the time
- Underprovision to save cost → risk performance degradation during spikes

Neon removes that tradeoff. **Instead of locking your database into a fixed capacity, Neon automatically adjusts compute in real time to match your workload.** Neon’s automatic sizing happens following an elaborate autoscaling algorithm that looks at multiple performance metrics and adjusts in near real-time. You don’t size instances, you don’t resize them later, you don’t guess \- the platform does it for you.

Want to know how? Keep reading.

<QuoteBlock quote="Instead of having to overprovision our servers to handle peak loads, which leads to inefficiencies and higher costs, Neon's autoscaling handles it. We get more performance when we need it." author="julian-benegas" role="CEO of BaseHub" />

## Real workloads don’t respect static limits

Provisioned database platforms run on fixed-size instances: you choose the amount of CPU / memory up front, and that instance runs continuously at that size. But database workloads change constantly \- so to help engineers choose a size, **AWS provides a “rightsizing” recommendation: provision at P99.5 resource utilization \+ 20% buffer.**

In practice, this means:

- Look at your historical peak usage
- Ignore the top 0.5% of load
- Add 20% on top of that
- Pay for that instance size

This method creates two structural inefficiencies:

1. **Most of the time, your database runs far below the capacity you’re paying for**
2. **The most extreme spikes still exceed that 20% buffer**

<Admonition type="info">
Our platform data shows that, even when sized at P99.5 + 20%, the average production workload would exceed its provisioned capacity around 55 times per month.
</Admonition>

![Recommended provisioned capacity vs true compute usage over 24 hours](/use-cases/variable-load/recommended-capacity-vs-true-usage.png)

To try to solve this loose-loose situation, you have two options:

- **Option A: Overprovision \- or buying larger instances than you think you need**

This solves the potential performance degradation problem, but you end up with:

- Large areas of idle compute
- Paying for capacity that delivers zero value
- Higher steady-state infrastructure costs

<QuoteBlock quote="We had to overprovision Aurora to handle our spiky traffic, and even then, the writer database would get overwhelmed. We provision 10x more than we need on average to keep things running smoothly." author="jonathan-reyes" role="Principal Engineer at Dispatch" />

![Overprovisioned compute versus usage over 24 hours](/use-cases/variable-load/overprovisioned-compute-pattern.png)

<Admonition type="important">
Our platform data shows that the average production database would use 2.4x less compute under autoscaling than the equivalent P99.5 + 20% provisioned capacity. This difference is compute that would be paid for, but not used.
</Admonition>

**Option B: Underprovision \- or buying smaller instances than you think you need**

This reduces costs, but:

- Your CPU and memory get maxed out
- You risk increasingly degraded performance or even outages

![Underprovisioned compute versus usage over 24 hours](/use-cases/variable-load/underprovisioned-compute-pattern.png)

<QuoteBlock quote="[When we were using Heroku] we either had too many or too few resources allocated to our database, and adjustments typically were a big project with downtime." author="ben-halpern" role="DEV Co-Founder" />

## Compute should adapt to your workload, not the other way around

**Provisioned databases require regularly making decisions on capacity tradeoffs. Neon removes that entire category of work.**

Instead of choosing a fixed instance size, **Neon comes with autoscaling: it automatically allocates compute based on real-time workload demand.** CPU, memory, and local file cache (LFC) are adjusted dynamically between a configured minimum and maximum. Compute simply follows your load in near real-time.

![Neon autoscaling dynamically matches compute to workload](/use-cases/variable-load/neon-autoscaling-compute-allocation.png)

<Admonition type="important">
Our platform data shows that, when comparing production databases autoscaling in Neon to a provisioned model sized at P99.5 + 20%, 2.4x less compute is used, compute costs are around 50% lower on average, and around 55 resource exhaustion incidents per database per month are avoided.
</Admonition>

<QuoteBlock quote="Scaling quickly used to be a challenge, but Neon gives us Postgres in a fully serverless setup. We don't have to worry about provisioning or scaling, it just works." author="james-ross" role="Co-founder and CTO at Nodecraft" />

## Autoscaling decisions that optimize Postgres performance

**Neon’s autoscaling isn’t a simple “CPU goes up → add more CPU” loop.** Neon’s algorithm continuously evaluates multiple signals from the database and its underlying compute components to determine the optimal compute size at any moment.

Neon’s autoscaling algorithm is built around three core metrics:

- **CPU load** \- sampled every 5 seconds, retrieving 1-minute averages
- **Memory usage** \- the platform inspects Postgres-specific memory usage every 100 ms; every 5 seconds, the platform collects overall memory metrics from the underlying VM
- **Local File Cache (LFC) working set size** \- every 20 seconds, the platform evaluates the working set size across multiple rolling windows (1-min, 2-min \- up to 60 min). This is one of the most sophisticated datapoints collected by the Neon algorithm: at all times, it keeps the subset of data that is actively being accessed in memory to optimize performance.

The platform’s algorithm has goals for each of these metrics, and it sizes compute accordingly to meet these goals \- always bounded by your configured min and max autoscaling limits:

- **“Keep the 1-minute average CPU load ≤ 90% of available CPU”**
- **“Keep overall memory usage ≤ 75% of total RAM”**
- **“Ensure the working set fits within 75% of RAM allocated to the Local File Cache”**

<Admonition type="note">
The average production database on Neon adjusts its compute size 11,000+ times per month. This demonstrates fine-grained scaling at runtime.
</Admonition>

## Non-production databases still cost money, but far less with scale-to-zero

Autoscaling solves the “how much compute should I buy?” problem. Scale-to-zero solves a different one: **Why are you paying for a database that isn’t being used?**

Your database setup isn’t just production \- it includes development, testing, and staging environments too. These non-production databases don’t run continuously. But on provisioned platforms, even the smallest instance runs 24/7. You pay whether it’s active or not.

**On Neon, compute doesn’t just autoscale \- it can shut down entirely when there are no active connections and resume in \~350ms.** Non-production environments consume zero compute while idle and spin back up instantly when needed, without wasting mindspace on manually pausing/resuming and also without wasting costs

<Admonition type="tip">
Our platform data shows that non-production workloads that scale to zero use 13.7x less compute than their provisioned equivalent and cost 7.5x less.
</Admonition>

## Extra perks

When compute scales dynamically and can drop to zero, features built on top of it inherit those efficiencies. For example: read replicas and connection pooling become lighter, cheaper, and more responsive than their equivalents in provisioned infrastructure.

### Read replicas don’t duplicate waste

In provisioned platforms, each read replica runs its own compute instance, maintains its own memory allocation, and consumes steady-state capacity whether it’s actively serving traffic or not. This pretty much duplicates costs.

Neon’s read replicas work differently. **Replicas share the same storage layer as the primary, autoscale independently, and scale to zero when inactive \- they’re significantly more efficient.** You can freely use them for analytics workloads, business dashboards, heavy read queries, or read-only access. They’re also instantly available as soon as they’re deployed.

<Admonition type="tip">
Our platform data shows that Neon read replicas use 4x less compute than their provisioned equivalent and cost around 78% less.
</Admonition>

<QuoteBlock quote="One of the big selling points of Neon was creating read replicas in seconds that scale to zero. We frequently spin up dev servers and sandbox environments, so providing easy, read-only access to the team while keeping maintenance low was a big win for us." author="jeremy-berman" role="CTO at BeatGig" />

### Connection pooling scales with your workload

Traffic spikes don’t just increase CPU and memory pressure, they also increase connection pressure. Provisioned Postgres instances have hard limits on `max_connections` \- exceed them, and new connections are rejected. Even adding a proxy like RDS Proxy introduces queueing, latency, and operational complexity.

In Neon, connection pooling is built directly into every Neon endpoint. By simply using the pooled connection string (adding `-pooler`), connections are routed through PgBouncer in transaction pooling mode, which gives you up to 10,000 concurrent client connections.

Pooling and autoscaling work together in Neon. As connection pressure increases memory and CPU usage, Neon’s autoscaling algorithm reacts, increasing compute resources instead of failing requests. Requests are queued instead of rejected, and connections are reused aggressively.

<QuoteBlock quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS." author="cody-jenkins" role="Head of Engineering at Invenco" />

## Get Started

If you’re building a startup with unpredictable growth, make your database the most adaptive part of your stack. Try Neon.

When you’re focused on scaling your startup, you shouldn’t spend time in capacity planning just to run Postgres. With Neon,

- You don’t guess how much compute to buy
- You don’t pay for idle environments
- You don’t spend time resizing
- You get performance headroom during spikes
- While getting lower average compute costs

<QuoteBlock quote="There's zero reason to use RDS in 2025. Neon is the most disruptive Postgres database platform out there, and every startup should be using it." author="jorge-ferreiro" role="Founder of SMASHSEND" />

To get started,

- Read the full [Autoscaling Report](https://neon.com/autoscaling-report)
- Explore [Neon’s pricing](https://neon.com/pricing)
- Learn about [security and compliance](https://neon.com/security)
- Check out our [Startup Program](https://neon.com/startups)
- [Sing up](https://console.neon.tech/signup) to Neon and start building
