---
title: The Neon Developer Experience
subtitle: Build and iterate faster
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/dev-experience
updatedOn: '2025-12-22T13:54:25.159Z'
---

Neon is Postgres re-designed for how developers work today. You don’t size infrastructure upfront, babysit databases, manage capacity, or copy data between environments - Neon adapts automatically so you can focus on building and shipping. This developer experience is built around three core pillars:
- **Invisible infra** — compute and storage adapt to your workload in real-time
- **No waiting** - deployment of new instances, restores, and rebuilds from past states are instant 
- **Branching-first, API-first, and AI-first workflows** - databases behave like any other modern tool
- **A composable stack** — based on strong primitives with optional building blocks, no lock-in

## Invisible infra

### Dynamic compute by default

Traditional OLTP databases force you to provision compute upfront - i.e. choose an instance size, plan for peak traffic, and manually adjust capacity over time. This adds overhead and leads to either overpaying for idle resources or underprovisioning and risk performance degradation. Neon removes this tradeoff by making compute fully dynamic, responsive to your load in real-time. 

#### Autoscaling with your workload

Neon [automatically scales](https://neon.com/docs/introduction/autoscaling) database compute up and down based on real demand. When your application needs more resources due to traffic spikes, background jobs, or heavy queries, Neon increases available compute, and as demand drops, compute scales back down.

**How it works**

Neon runs a continuous autoscaling loop that continuously monitors three core database / compute metrics. The platform then makes its autoscaling decision, adjusting resources in near real time. The three core metrics are: 

- **CPU load**: Neon tracks the 1-minute CPU load average and aims to keep it below ~90% of available CPU capacity. If the database becomes CPU-bound, compute is scaled up to restore headroom.
- **Memory usage**: Overall memory consumption is monitored to keep usage below ~75% of allocated RAM. If memory pressure increases, Neon scales compute to provide additional RAM.
- **Local File Cache (LFC) working set**: Neon [continuously estimates your database’s active working set](https://neon.com/blog/dynamically-estimating-and-scaling-postgres-working-set-size) (the data accessed most frequently) and scales compute so this working set fits in memory, keeping hot data cached locally for fast access.

Rather than relying on fixed intervals or manual triggers, Neon's autoscaling algorithm continuously evaluates these three workload signals, adjusting compute up or down based on the live measurements - while always staying within the minimum and maximum limits you configure. 

- CPU load and overall memory usage are checked every 5 seconds
- Local File Cache working set size is evaluated every 20 seconds
- Memory usage inside Postgres itself is monitored every 100 milliseconds

**What this means for DX** 

You don’t need to pick instance sizes when creating a Neon branch: only your max/min autoscaling limits. You also don’t have to monitor load capacity to tune capacity or to schedule resizes. Autoscaling happens continuously and transparently as your application runs. 

#### Scale to zero

When a database is not actively handling queries, Neon [automatically scales compute all the way down to zero](https://neon.com/docs/introduction/scale-to-zero). Unused databases consume no compute resources, eliminating the cost of always-on instances that sit unused for large portions of the day. This happens by default after 5 minutes of inactivity, and when it’s time to restart, cold starts take less than 1 second, with less than 500 milliseconds being typical. 

This is especially valuable in non-production environments, where databases are often created for short periods of time and accessed intermittently. Development, testing, and preview environments may sit idle for hours (or days) between uses; traditional OLTP databases still incur full compute costs during that time unless you manually pause them - not on Neon. 

**What this means for DX** 

Scale to zero is a foundational capability for the Neon experience, allowing us to offer:

- **A free plan developers can actually use**. Neon can offer a generous free tier without subsidizing large amounts of idle infrastructure, something made possible by it's architecture and scale-to-zero capabilities. [We want every Postgres developer building on Neon](https://neon.com/blog/why-so-many-projects-in-the-neon-free-plan), and this starts with hosting their side projects and experiments.

- **Many short-lived, non-production environments**. Scale to zero makes it practical to run [large numbers of ephemeral databases](https://neon.com/use-cases/dev-test) for previews, CI runs, experiments, and testing. Teams can create and discard environments freely, without cost pressure forcing them to share databases or cut corners.

- **A foundation for platforms and AI agents operating at scale**. Full-stack apps can provision and manage thousands of isolated Neon projects programmatically, fully integrating the process within their own product experience, for example to power their own free plans. Without scale-to-zero, this would imply massive infrastructure costs upfront. 

### On-demand storage 

In traditional Postgres setups, storage is something you plan upfront: you estimate how much data you’ll need, provision disk accordingly, and revisit that decision as your application grows. Getting this wrong leads to wasted capacity, full-disk errors, and painfully slow data-copying operations whenever data needs to be replicated into a new instance (for example, during restores). Neon removes this friction by making storage fully on demand, built on object storage, and designed to preserve history.

**Invisible scaling**

Neon’s storage is [built on object storage](https://neon.com/docs/introduction/architecture-overview), deacoupled from compute. It is reliable by design and it expands automatically as data is written, as scaling storage does not require resizing compute resources or causing downtime. You can start with a small database and grow it continuously, without ever revisiting storage sizing decisions.

**What this means for DX**
Neon developers don’t estimate disk sizes or plan storage migrations. Databases grow naturally with the application, without operational intervention or downtime.

## No waiting

### New deployments are fast

With Neon, deploying a new database instance is a fast, lightweight operation. Creating a new project or branch does not involve provisioning a new virtual machine, eliminating minutes of provisioning time.

**What this means for DX**

Not only does this provide a better overall user experience - it also makes Neon a natural fit for platforms that need to provision databases programmatically for their users, such as open-source frameworks, developer platforms with their own free plans, or agent-driven systems. Instance creation becomes fast enough to sit directly on the user path.

### A record of all past states, instantly accessible 

**Instant restores**
Neon’s [Instant Restore](https://neon.com/docs/introduction/branch-restore#how-instant-restore-works) allows you to restore your database to a precise point in time in a single API call. Restore operations are near-instant because Neon doesn’t copy data or rebuild the database, it simply re-anchors the database state to a known point in its history.

**Snapshots as checkpoints**
In addition to continuous history, Neon exposes [snapshots](https://neon.com/docs/guides/backup-restore), explicit checkpoints that capture your database state at a moment in time. Snapshots are useful when you want long-lived restore points independent of the [restore window](https://neon.com/docs/introduction/restore-window), a known rollback point before a risky change, or versioned checkpoints for environments or [agent workflows](https://neon.com/docs/ai/ai-database-versioning).

**What this means for DX**
When your database keeps a complete, accessible record of its past, developers can work with a fundamentally different mindset: mistakes are reversible. They iterate more confidently, knowing that mistakes can be undone quickly and precisely. 

## Branching-first workflows 
Modern software development is built around iteration, but most database setups are still built around a single mutable state. Neon takes a different approach: instead of treating a database as a static resource that must be copied over and over, Neon treats the database as a versioned system using short-lived [branches](https://neon.com/docs/introduction/branching) as environments. 

**Fast and lightweight** 
Neon branches are near instant to deploy because they share underlying data until changes are made. Whether your database is 1 GB or 1 TB, creating a branch takes seconds. Because branches use a copy-on-write model, they also don’t duplicate storage by default - they stay very cost-efficient until you actually change data, especially if they’re short-lived.

**Designed to be discarded**
Neon branching is optimized for short-lived environments, or environments that get to be refreshed often. To support this, Neon provides [branch expiration](https://neon.com/docs/guides/branch-expiration): you can configure branches to automatically expire and be deleted after a set period of time, ensuring temporary environments don’t linger out of your [restore window](https://neon.com/docs/introduction/restore-window) to keep storage costs to a minimum. 

**One-click update** 
Some branches don’t need to be discharged but refreshed often - for example, staging environments.  Neon also allows developers to [reset a branch](https://neon.com/docs/guides/reset-from-parent) to the latest state of its parent instantly, with one API call, whenever they need a new starting point.

**What this means for DX**
Because branches are fast to create and inexpensive to keep, teams use them as temporary, task-specific environments rather than long-lived databases. Some [common patterns](https://neon.com/branching) include:

- **Branch per developer**. Each engineer works against their own isolated database environment (branch), avoiding conflicts when making schema or data changes.
- **Branch per experiment or feature**. Short-lived branches are used to explore changes, run migrations, or validate ideas, then deleted once the work is done.
- **Branch per pull request**. A new branch is created automatically for every PR, powering preview deployments with production-like data.
- **Branch per CI run**. Test suites run against a fresh database branch, ensuring clean state and reproducible results for every pipeline run.

