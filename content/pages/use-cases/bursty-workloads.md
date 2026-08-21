---
title: 'Postgres for Bursty Workloads'
subtitle: Traffic moves constantly - your instance size should too. Lakebase Postgres allocates compute as load changes and bills only what you consume.
summary: >-
  Why provisioning a fixed instance for peak traffic wastes compute and still
  causes performance degradations, how autoscaling on Lakebase Postgres allocates
  CPU and memory as load changes, and what the numbers look like across every
  production database on Neon.
enableTableOfContents: true
updatedOn: '2026-08-15T15:45:00.000Z'
image: '/images/social-previews/use-cases/bursty-workloads.jpg'
---

![Neon autoscaling allocating compute above a spiky database load curve, with a panel reporting that resources were adjusted by four compute units](/use-cases/bursty-workloads/autoscaling-hero.svg 'priority')

<Admonition type="note" title="Summary">
Every database's demand for CPU and memory changes constantly. On a provisioned platform you buy one instance size and live with it, so you either pay for peak capacity around the clock or run out of headroom when traffic spikes. Lakebase Postgres (Neon's database) separates compute from storage, which lets it resize compute in seconds while queries keep running.

- **Automatic** - The platform allocates compute to fit current load. There is no instance size to pick and no resize to schedule
- **Responsive** - The average production database on Neon adjusts its size about once every 81 seconds
- **Down to zero** - Idle compute suspends entirely and comes back in around 350ms
- **Consumption-based** - You're billed for the compute you actually used, not the ceiling you provisioned for

The numbers on this page come from the [Neon compute autoscaling report](/autoscaling-report), which compares every production database on Neon against what the same workloads would cost on a provisioned platform.
</Admonition>

## Buying for peak means paying for peak

Database load is never flat. A typical production database peaks mid-day and drops overnight, drops further on weekends, and spikes whenever a migration, bulk export, or index build runs.

A provisioned database can't follow any of that. You pick a CPU and memory configuration when you create the instance, and that allocation is yours until someone changes it. So the sizing decision comes down to guessing the largest load you'll see and paying for it 24 hours a day.

AWS at least gives you a formula. Its [RDS rightsizing tool](https://aws.amazon.com/blogs/aws-cloud-financial-management/new-rightsizing-recommendations-for-amazon-rds-mysql-and-rds-postgresql-in-aws-compute-optimizer/) takes the P99.5 of CPU and memory utilization over a lookback window and adds 20%. Follow it and most of what you bought sits idle most of the time.

![One week of a production workload where autoscaling tracks the load curve while the provisioned allocation stays flat above it, with spikes that still exceed the provisioned ceiling](/use-cases/bursty-workloads/autoscaling-vs-provisioned.svg)

The orange area is compute that was paid for and delivered nothing. The red spikes are worse: they're the moments the workload needed more than the instance had, even at the size AWS recommends. Provisioning at P99.5 + 20% is provisioning below the top 0.5% of your load, and load spikes are frequently larger than a 20% buffer.

<QuoteBlock quote="We had to overprovision Aurora to handle our spiky traffic, and even then, the writer database would get overwhelmed. We provision 10x more than we need on average to keep things running smoothly" author="jonathan-reyes" role="Principal Engineer at Dispatch" link="/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora" />

There's a second problem hiding in the sizing decision: you can't buy exactly what you need. If your workload calls for 4.8 CPUs and 19 GB of RAM, no such instance exists, so you round up to the next one and pay for the gap.

## Resizing by hand doesn't fit how software runs now

The provisioned model assumes someone is watching. Traffic grows, an alert fires, an engineer sizes up the instance, and the workload takes a maintenance window or a failover to get there. Traffic falls back and, in practice, nobody sizes it down again.

That loop was always slow. It's harder to justify now that a single agent-driven feature can multiply query volume overnight, that a product can get posted somewhere and go from hundreds of requests to hundreds of thousands in an afternoon, and that most teams don't have anyone whose job is to watch database metrics.

What matters to you is narrower than a sizing strategy: queries stay fast when load arrives, and you stop paying when the need is no longer there.

<QuoteBlock quote="Our database traffic peaks at nights and on weekends when thousands of our members are attending experiences. Building on a database that preemptively autoscales allows us to regularly handle these traffic spikes." author={{ name: 'Lex Nasser', company: 'Founding Engineer at 222' }} link="/blog/how-222-uses-neon-to-handle-their-frequent-spikes-in-demand" />

## How autoscaling works on Lakebase Postgres

In a conventional Postgres setup, the process and its disk live on the same machine. Changing CPU or memory means moving to a different machine, which is why resizing is disruptive and why nobody does it often.

Lakebase Postgres, the Neon database built on the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview), splits those halves apart. Compute is a stateless Postgres process; storage is a separate distributed engine backed by object storage, and it holds your data independently of any compute. Because the compute doesn't own the data, it can be resized without moving anything. 

Neon runs an autoscaling algorithm that watches CPU, memory, and cache pressure and adjusts the compute size within the range you set, in both directions, while connections stay open:

![A day of database compute usage with the autoscaling allocation tracking each spike in demand closely](/use-cases/bursty-workloads/autoscaling-matches-workload.svg)

The green is the compute Neon allocated. The blue is what the workload used. Allocation tracks the shape of the load instead of drawing a flat line above it, which is what removes both the waste and the ceiling at the same time.

When the load goes away completely, compute can suspend. [Scale to zero](/docs/introduction/scale-to-zero) shuts the compute down after a period with no active connections and restarts it in around 350ms on the next one, which is what makes idle databases nearly free rather than a line item.

<div style={{ margin: '2.5rem 0', borderLeft: '3px solid #00E599', borderRadius: '0.25rem', background: 'rgba(0, 229, 153, 0.07)', padding: '1.75rem 2rem' }}>
  <p style={{ margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>In short</p>
  <p style={{ margin: '0.75rem 0 0', fontSize: '1.5rem', lineHeight: 1.35, fontWeight: 500 }}>Allocating fixed compute to infra feels outdated in 2026. Autoscaling breaks this old pattern with a smoother (and less wasteful) workflow.</p>
</div>

<Admonition type="info" title="Go deeper">
- [Autoscaling](/docs/introduction/autoscaling) - how to configure minimum and maximum compute for a branch
- [The autoscaling algorithm](/docs/guides/autoscaling-algorithm) - what Neon measures and how it decides to scale
- [Architecture overview](/docs/introduction/architecture-overview) - how separating compute from storage makes resizing cheap
</Admonition>

## What it adds up to

Neon ran the AWS rightsizing algorithm against the autoscaling history of every production database on the platform to work out what the same workloads would have cost on a provisioned instance. Across the platform, the average production database used 2.4x less compute than its provisioned equivalent.

<AutoscalingViz />

Factoring in the price of each plan against a conservative price estimation for provisioned databases, that works out to roughly 50% lower compute cost. The gap widens for workloads at the extremes:

- **55 degradations per month avoided** - The number of times the average production database scaled above what a P99.5 + 20% instance would have had available. On a provisioned platform each one is a slow query, a timeout, or a page
- **4x less compute on read replicas** - Neon read replicas run their own compute against the same storage, so each one autoscales independently and costs 78% less than a provisioned replica
- **7.5x cheaper for idle databases** - Small workloads that scale to zero would use 13.7x more compute if they had to run around the clock

A single real customer workload makes it concrete. A production database costing $217.16 per month on Neon needed a `db.m8g.2xlarge` to cover its peaks on RDS, at $504 per month, and would still have hit around 73 performance degradations a month at the AWS-recommended size.

<Admonition type="info" title="Read the full analysis">
The [compute autoscaling report](/autoscaling-report) covers the methodology behind these numbers, including how instance sizes and incidents were calculated, the per-workload examples, and the deliberately conservative assumptions used throughout.
</Admonition>

<QuoteBlock quote="Our workload ingests hundreds of data points per second and our RDS costs were increasing. With Neon, we found a way to scale our setup more efficiently" author="thorsten-riess" role="Software Architect at traconiq" link="/blog/why-traconiq-migrated-from-aws-rds-to-neon" />

## Where autoscaling helps most

Autoscaling helps every workload, but the savings scale with how uneven the load is. The teams that see the biggest difference tend to have one of these patterns:

- **Agent and LLM traffic** - Usage arrives in bursts that follow user sessions rather than a daily curve, and volume can change by an order of magnitude between weeks
- **Consumer apps with sharp peaks** - Evenings, weekends, launches, and campaigns concentrate most of the week's traffic into a few hours
- **Scheduled and batch work** - Nightly ETL, exports, index builds, and migrations need far more compute than the steady state, for a short time
- **Analytics and ad-hoc queries** - Run them on a [read replica](/docs/introduction/read-replicas) that scales up for the query and back down after, without touching primary performance
- **Development and staging** - Databases that only need to be awake during work hours, and cost close to nothing the rest of the time

<QuoteBlock quote="Neon’s serverless model is a perfect fit for us. Some of our AI voice agents handle thousands of calls in an instant, and then traffic drops off just as fast. With Neon, we don’t have to think about scaling—it just happens" author="tejas-siripurapu" role="Founding Engineer at Vapi.ai" link="/blog/vapi-voice-agents-neon" />

<QuoteBlock quote="Neon worked out of the box, handling hundreds of Lambdas without any of the connection issues we saw in Aurora Serverless v2. On top of that, Neon costs us 1/6 of what we were paying with AWS" author="cody-jenkins" role="Head of Engineering at Invenco" link="/blog/why-invenco-migrated-from-aurora-serverless-v2-to-neon" />

## Deploy serverless backends

Database compute is where the waste is most visible, but it isn't the only place a fixed allocation shows up. The rest of the Neon backend is built on the same model, so the parts of your application around the database don't reintroduce the problem.

Storage grows and shrinks with your data and bills for what you're actually storing, with no volume to size in advance. [Neon Functions](/docs/compute/functions/overview) run your handlers on demand next to the database. [Neon Object Storage](/docs/storage/overview) charges for the objects you keep. [Managed Better Auth](/docs/auth/overview) and the [Neon AI Gateway](/docs/ai-gateway/overview) come with the same consumption model.

The point is the same one autoscaling makes about compute. You describe what your application needs, and the platform decides how much of it to run at any given moment.

<QuoteBlock quote="Moving from legacy infrastructure to a fully serverless stack has been a huge upgrade. We wanted our backend to be as hands-off as possible. Now we get all the power of Postgres, without having to think about it" author="james-ross" role="Co-founder and CTO at Nodecraft" link="/blog/nodecraft-cloudflare-neon" />

<CTA title="Stop sizing instances" description="Create a project, set a minimum and a maximum, and let the platform handle everything in between. No credit card required." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" secondaryButtonText="Read the autoscaling report" secondaryButtonUrl="/autoscaling-report" />
