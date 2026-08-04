---
title: Our DX Principles
subtitle: 'Neon adapts to your workflow, not the other way around.'
summary: >-
  Lakebase Postgres replaces traditional Postgres ops with continuous
  autoscaling, copy-on-write branching, sub-second provisioning, and on-demand
  storage. Read this page to understand why Neon behaves differently from
  fixed-instance Postgres and which lakebase architecture decisions drive
  scale-to-zero, instant restore, and branch-per-PR workflows. It also covers
  agents-first workflows (API, MCP, and agent platforms), a composable backend
  of open primitives around Lakebase Postgres, and CLI and GitHub Actions
  support for database lifecycle automation.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/dev-experience
updatedOn: '2026-07-15T00:08:00.682Z'
---

The developer experience across Neon is rooted in the lakebase architecture and anchored around four core pillars:

1. **Invisible infra** - compute and storage adapt to your workload in real-time
2. **No waiting** - deployment of new instances, restores, and rebuilds from past states are instant
3. **Branching-first and agents-first workflows** - databases and backends behave like any other modern, automatable tool
4. **Composable and open** - a full backend of open primitives around Lakebase Postgres, not a locked-in all-in-one

## Invisible infra

### Autoscaling compute

Traditional OLTP databases force you to provision compute upfront (i.e., choose an instance size), plan for peak traffic, and manually adjust capacity over time. This adds overhead and leads to either overpaying for idle resources or underprovisioning and risk performance degradation.

**How it works**

Lakebase Postgres runs an autoscaling loop that continuously monitors three core database / compute metrics, then adjusts resources in near real time. The three core metrics are:

- CPU load and overall memory usage are checked every 5 seconds
- Local File Cache working set size is evaluated every 20 seconds
- Memory usage inside Postgres itself is monitored every 100 milliseconds

Rather than relying on fixed intervals or manual triggers, the autoscaling algorithm continuously evaluates these three workload signals, adjusting compute up or down based on the live measurements - while always staying within the minimum and maximum limits you configure.

**What this means for DX**

You don’t need to pick instance sizes when creating a Neon branch: only your max/min autoscaling limits. You also don’t have to monitor load capacity to tune capacity or to schedule resizes. Autoscaling happens continuously and transparently as your application runs.

### Scale to zero

When a database is not actively handling queries, Lakebase Postgres [automatically scales compute all the way down to zero](https://neon.com/docs/introduction/scale-to-zero). Unused databases consume no compute resources, eliminating the cost of always-on instances that sit unused for large portions of the day. This happens by default after 5 minutes of inactivity, and when it’s time to restart, cold starts take less than 1 second, with less than 500 milliseconds being typical.

For production workloads where cold starts are not acceptable, paid plan users can disable scale to zero to keep their compute always active. See [Scale to zero](/docs/introduction/scale-to-zero).

**What this means for DX**

Scale to zero is a foundational capability for the Neon experience, allowing us to offer:

- **A free plan developers can actually use**. Neon can offer a generous free plan without subsidizing large amounts of idle infrastructure, something made possible by the lakebase architecture and scale-to-zero capabilities. [We want every Postgres developer building on Neon](https://neon.com/blog/why-so-many-projects-in-the-neon-free-plan), and this starts with hosting their side projects and experiments.

- **Many short-lived, non-production environments**. Scale to zero makes it practical to run [large numbers of ephemeral databases](https://neon.com/use-cases/dev-test) for previews, CI runs, experiments, and testing. Teams can create and discard environments freely, without cost pressure forcing them to share databases or cut corners.

- **A foundation for platforms and AI agents operating at scale**. Full-stack apps can provision and manage thousands of isolated Neon projects programmatically, fully integrating the process within their own product experience, for example to power their own free plans. Without scale-to-zero, this would imply massive infrastructure costs upfront.

### On-demand storage

In traditional Postgres setups, storage is something you plan upfront: you estimate how much data you’ll need, provision disk accordingly, and revisit that decision as your application grows. Getting this wrong leads to wasted capacity and full-disk errors. Lakebase Postgres removes this friction by making storage fully on demand.

Lakebase Postgres storage is [built on object storage](https://neon.com/docs/introduction/architecture-overview), decoupled from compute. It is reliable by design and it expands automatically as data is written, as scaling storage does not require resizing compute resources or causing downtime. You can start with a small database and grow it continuously, without ever revisiting storage sizing decisions.

**What this means for DX**

Neon developers don’t estimate disk sizes or plan storage migrations. Databases grow naturally with the application, without operational intervention or downtime.

## No waiting

### New deployments are fast

With Neon, deploying backends is a fast operation that takes less than a second. Creating a new project or branch does not involve provisioning a new virtual machine, eliminating minutes of provisioning time.

**What this means for DX**

This speed adapts the experience of deploying backends to the agent era. It also makes Neon a natural fit for platforms that themselves provision backends programmatically for their users, such as app generation platforms or developer platforms with their own free plans. Instance creation becomes fast enough to sit directly on the user path.

### A record of all past states, instantly accessible

Storage in Lakebase Postgres is also [history-preserving](https://neon.com/blog/get-page-at-lsn) by design. As data changes over time, past versions of your database state are retained efficiently as part of normal operation, making operations that are painfully slow in traditional backends (like restores) trivial on Neon.

**Instant restores**

In Lakebase Postgres, [Instant Restore](https://neon.com/docs/introduction/branch-restore#how-instant-restore-works) allows you to restore your database to a precise point in time in a few clicks or a single API call. Restore operations are near-instant because Lakebase Postgres doesn’t copy data or rebuild the database, it simply re-anchors the database state to a known point in its history.

**Snapshots as checkpoints**

In addition to continuous history, Lakebase Postgres exposes [snapshots](https://neon.com/docs/guides/backup-restore), explicit checkpoints that capture your database state at a moment in time. Snapshots are useful when you want long-lived restore points independent of the [history window](https://neon.com/docs/introduction/history-window), a known rollback point before a risky change, or versioned checkpoints for environments or [agent workflows](https://neon.com/docs/ai/ai-database-versioning).

**What this means for DX**

When your database keeps a complete, accessible record of its past, developers can work with a fundamentally different mindset: mistakes are reversible. They iterate more confidently, knowing that mistakes can be undone quickly and precisely.

## Workflows

### Branching-first

Modern software development is built around iteration, but most database setups are still built around a single mutable state. Neon takes a different approach: instead of treating a database as a static resource that must be copied over and over, Lakebase Postgres treats the database as a versioned system using short-lived [branches](https://neon.com/docs/introduction/branching).

**Always lightweight**

Whether your database is 1 GB or 1 TB, creating a branch takes seconds. Branches use a copy-on-write model, so they're instant to create regardless of database size. [Object Storage](/docs/storage/overview) buckets branch the same way: a new branch inherits its parent's buckets and the objects in them at the moment of forking, with nothing copied upfront.

**Designed to be discarded**

Branching is optimized for short-lived environments or for environments that get to be refreshed often. To support this, Lakebase Postgres provides [branch expiration](https://neon.com/docs/guides/branch-expiration): you can configure branches to automatically expire and be deleted after a set period of time. You can also [reset a branch](https://neon.com/docs/guides/reset-from-parent) to the latest state of its parent instantly, with one click or API call, whenever you need a new starting point.

You can build your branching workflows using the [Neon CLI](/docs/cli), [Neon API](/docs/reference/api), or [GitHub Actions](/docs/guides/branching-github-actions). You can also keep your development branches up-to-date by resetting your schema and data to the latest from `main` with a simple command.

**What this means for DX**

Teams deploy hundreds of branches as temporary, task-specific environments, substituting heavy and expensive dev instances. Some [common patterns](https://neon.com/branching) include:

- **Branch per developer**. Each engineer works against their own isolated backend environment (a branch), avoiding conflicts when making schema or data changes.
- **Branch per experiment or feature**. Short-lived branches are used to explore changes, run migrations, or validate ideas, then deleted once the work is done.
- **Branch per pull request**. A new branch is created automatically for every PR, powering preview deployments with production-like data.
- **Branch per CI run**. Test suites run against a fresh database branch, ensuring clean state and reproducible results for every pipeline run.

### Agents-first

On Neon, agents are first-class: the same lakebase architecture that makes Lakebase Postgres instant, branchable, and serverless also makes the full backend operable by software, not only by humans in a console. Agents, coding assistants, and [codegen platforms](https://neon.com/use-cases/ai-agents) can provision, branch, query, and tear down backends the way they already manage code and deploys.

That depends on the architecture and the API working together.

**Lakebase architecture**

The lakebase architecture removes the friction that usually blocks automation:

- Projects and branches come up in under a second
- Scale to zero keeps fleets of mostly idle databases economical
- Copy-on-write branching gives agents isolated environments, versioning, checkpoints, and rollbacks without copying data
- History makes mistakes reversible

Those properties let an agent spin up hundreds of short-lived backends without blowing up cost or waiting on infrastructure.

**Full API readiness**

Every core operation in Neon is available programmatically:

- The [Neon API](/docs/reference/api) is shaped by real-world agent and platform workloads: create and manage hundreds of thousands of projects, automate lifecycles with minimal human intervention, and enforce usage limits and cost controls (compute uptime, autoscaling bounds, data written, storage per branch, and more)
- The [Neon CLI](/docs/cli), GitHub Actions, Vercel preview branching, MCP, and Agent Skills all sit on that same surface, so humans and agents share one control plane

**How agents use Neon**

- **In the IDE.** [MCP](https://neon.com/docs/ai/neon-mcp-server) and [Agent Skills](https://neon.com/docs/ai/agent-skills) let tools like Cursor and Claude understand and operate a Neon project in a structured, safe way.
- **As the backend for agent platforms.** [Full-stack codegen and agent platforms](https://neon.com/platforms) embed Lakebase Postgres (and the rest of the Neon primitives) so each generated app gets its own backend, provisioned and cleaned up automatically.
- **In your own pipelines.** Scripts and agents call the same API humans use in CI: create a branch, run migrations, take a snapshot, delete when done.

**What this means for DX**

Backend workflows stop being the exception you still have to manage manually. Developers can delegate them to coding agents, and agent platforms can treat Neon as infrastructure they drive end to end - with the lakebase architecture keeping that automation fast and affordable.

## Composable and open

Neon is a complete set of cloud backend primitives built around Lakebase Postgres: Managed Better Auth, Object Storage, Functions, Data API, and AI Gateway. It gives you a full backend for apps and agents as open, composable pieces on open standards, rather than an all-in-one where every layer is proprietary and inseparable.

At the center is [Lakebase Postgres](/docs/get-started/why-neon). Around it, optional primitives cover the rest of a modern backend:

- [Managed Better Auth](/docs/auth/overview) for authentication and identity in Postgres
- [Object Storage](/docs/storage/overview) for S3-compatible files and blobs
- [Functions](/docs/compute/functions/overview) for long-running compute next to your data
- [Data API](/docs/data-api/overview) for HTTP access to your database
- [AI Gateway](/docs/ai-gateway/overview) for model access with one credential

You can adopt only what you need, swap pieces for your own providers, and keep the rest of your stack (frameworks, hosts, ORMs, AI tools) unchanged. Nothing requires a Neon-only workflow.

What ties the stack together is the [lakebase architecture](/docs/introduction/architecture-overview). Every service is designed to carry the same properties developers get from Lakebase Postgres: instant provisioning, branching, scale to zero, and serverless operation. The backend stays agent-ready and environment-friendly end to end.

**What this means for DX**

You get a backend that is complete when you want it to be, and modular when you don’t. Start with Lakebase Postgres alone, add primitives as you need them, and keep architectures flexible instead of committing to a locked-in stack.

## Build without friction

Neon is designed to remove friction from database workflows without constraining how you build. Our users tell us the best thing about Neon is that building feels intuitive, and that they forget the backend is even there. That’s exactly the goal. When the backend stops getting in the way, teams can move faster, experiment safely, and focus on shipping.
