---
title: Our DX Principles
subtitle: 'Neon adapts to your workflow, not the other way around.'
summary: >-
  Covers the core principles of Neon's developer experience, focusing on
  invisible infrastructure, instant deployments, modern workflows, and a
  composable stack to enhance database management and adaptability.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/dev-experience
updatedOn: '2026-02-06T22:07:32.887Z'
---

Our developer experience is anchored by four core pillars:

1. **Invisible infra** - compute and storage adapt to your workload in real-time
2. **No waiting** - deployment of new instances, restores, and rebuilds from past states are instant
3. **Branching-first, API-first, and AI-first workflows** - databases behave like any other modern tool
4. **A composable stack** - based on strong primitives with optional building blocks

## Invisible infra

### Autoscaling compute

Traditional OLTP databases force you to provision compute upfront—i.e., choose an instance size, plan for peak traffic, and manually adjust capacity over time. This adds overhead and leads to either overpaying for idle resources or underprovisioning and risk performance degradation.

You can build your database branching workflows using the [Neon CLI](/docs/reference/neon-cli), [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api), or [GitHub Actions](/docs/guides/branching-github-actions). For example, this example shows how to create a development branch from `main` with a simple CLI command:

**How it works**

Neon runs a continuous autoscaling loop that continuously monitors three core database / compute metrics. The platform then makes its autoscaling decision, adjusting resources in near real time. The three core metrics are:

Also, with Neon, you can easily keep your development branches up-to-date by resetting your schema and data to the latest from `main` with a simple command.

Rather than relying on fixed intervals or manual triggers, Neon's autoscaling algorithm continuously evaluates these three workload signals, adjusting compute up or down based on the live measurements - while always staying within the minimum and maximum limits you configure.

- CPU load and overall memory usage are checked every 5 seconds
- Local File Cache working set size is evaluated every 20 seconds
- Memory usage inside Postgres itself is monitored every 100 milliseconds

**What this means for DX**

You don’t need to pick instance sizes when creating a Neon branch: only your max/min autoscaling limits. You also don’t have to monitor load capacity to tune capacity or to schedule resizes. Autoscaling happens continuously and transparently as your application runs.

### Scale to zero

When a database is not actively handling queries, Neon [automatically scales compute all the way down to zero](https://neon.com/docs/introduction/scale-to-zero). Unused databases consume no compute resources, eliminating the cost of always-on instances that sit unused for large portions of the day. This happens by default after 5 minutes of inactivity, and when it’s time to restart, cold starts take less than 1 second, with less than 500 milliseconds being typical.

**What this means for DX**

Scale to zero is a foundational capability for the Neon experience, allowing us to offer:

- **A free plan developers can actually use**. Neon can offer a generous free tier without subsidizing large amounts of idle infrastructure, something made possible by it's architecture and scale-to-zero capabilities. [We want every Postgres developer building on Neon](https://neon.com/blog/why-so-many-projects-in-the-neon-free-plan), and this starts with hosting their side projects and experiments.

- **Many short-lived, non-production environments**. Scale to zero makes it practical to run [large numbers of ephemeral databases](https://neon.com/use-cases/dev-test) for previews, CI runs, experiments, and testing. Teams can create and discard environments freely, without cost pressure forcing them to share databases or cut corners.

- **A foundation for platforms and AI agents operating at scale**. Full-stack apps can provision and manage thousands of isolated Neon projects programmatically, fully integrating the process within their own product experience, for example to power their own free plans. Without scale-to-zero, this would imply massive infrastructure costs upfront.

### On-demand storage

In traditional Postgres setups, storage is something you plan upfront: you estimate how much data you’ll need, provision disk accordingly, and revisit that decision as your application grows. Getting this wrong leads to wasted capacity and full-disk errors. Neon removes this friction by making storage fully on demand.

Neon’s storage is [built on object storage](https://neon.com/docs/introduction/architecture-overview), deacoupled from compute. It is reliable by design and it expands automatically as data is written, as scaling storage does not require resizing compute resources or causing downtime. You can start with a small database and grow it continuously, without ever revisiting storage sizing decisions.

**What this means for DX**

Neon developers don’t estimate disk sizes or plan storage migrations. Databases grow naturally with the application, without operational intervention or downtime.

## No waiting

### New deployments are fast

With Neon, deploying a new database instance is a fast operation that takes less than a second. Creating a new project or branch does not involve provisioning a new virtual machine, eliminating minutes of provisioning time.

**What this means for DX**

Not only does this provide a better overall user experience - it also makes Neon a natural fit for platforms that need to provision databases programmatically for their users, such as open-source frameworks, developer platforms with their own free plans, or agent-driven systems. Instance creation becomes fast enough to sit directly on the user path.

### A record of all past states, instantly accessible

Storage in Neon is also [history-preserving](https://neon.com/blog/get-page-at-lsn) by design. As data changes over time, Neon efficiently retains past versions of your database state as part of normal operation, making operations that are painfully slow in traditional Postgres (like restores) trivial on Neon.

**Instant restores**

Neon’s [Instant Restore](https://neon.com/docs/introduction/branch-restore#how-instant-restore-works) allows you to restore your database to a precise point in time in a few clicks or a single API call. Restore operations are near-instant because Neon doesn’t copy data or rebuild the database, it simply re-anchors the database state to a known point in its history.

**Snapshots as checkpoints**

In addition to continuous history, Neon exposes [snapshots](https://neon.com/docs/guides/backup-restore), explicit checkpoints that capture your database state at a moment in time. Snapshots are useful when you want long-lived restore points independent of the [restore window](https://neon.com/docs/introduction/restore-window), a known rollback point before a risky change, or versioned checkpoints for environments or [agent workflows](https://neon.com/docs/ai/ai-database-versioning).

**What this means for DX**

When your database keeps a complete, accessible record of its past, developers can work with a fundamentally different mindset: mistakes are reversible. They iterate more confidently, knowing that mistakes can be undone quickly and precisely.

## Workflows

### Branching-first

Modern software development is built around iteration, but most database setups are still built around a single mutable state. Neon takes a different approach: instead of treating a database as a static resource that must be copied over and over, Neon treats the database as a versioned system using short-lived [branches](https://neon.com/docs/introduction/branching).

**Always lightweight**

Whether your database is 1 GB or 1 TB, creating a branch takes seconds. Branches use a copy-on-write model, so they're instant to create regardless of database size.

**Designed to be discarded**

Neon branching is optimized for short-lived environments or for environments that get to be refreshed often. To support this, Neon provides [branch expiration](https://neon.com/docs/guides/branch-expiration): you can configure branches to automatically expire and be deleted after a set period of time. Neon also allows developers to [reset a branch](https://neon.com/docs/guides/reset-from-parent) to the latest state of its parent instantly, with one click or API call, whenever they need a new starting point.

**What this means for DX**

Teams deploy hundreds of branches as temporary, task-specific environments, substituting additional, long-lived database instances. Some [common patterns](https://neon.com/branching) include:

- **Branch per developer**. Each engineer works against their own isolated database environment (branch), avoiding conflicts when making schema or data changes.
- **Branch per experiment or feature**. Short-lived branches are used to explore changes, run migrations, or validate ideas, then deleted once the work is done.
- **Branch per pull request**. A new branch is created automatically for every PR, powering preview deployments with production-like data.
- **Branch per CI run**. Test suites run against a fresh database branch, ensuring clean state and reproducible results for every pipeline run.

### API-first

Neon is built with an API-first mindset. Every core operation is exposed programmatically, so developers can manage your database environments the same way you manage the rest of their infrastructure.

**Proven at scale**

Neon powers [platforms](https://neon.com/platforms) where thousands of databases are provisioned, scaled, and deleted automatically every day. This includes developer platforms embedding Postgres into their product experience, as well as [AI agents](https://neon.com/use-cases/ai-agents) that provision databases dynamically while building and running applications on behalf of users.

The [Neon API](https://api-docs.neon.tech/reference/getting-started-with-neon-api) has been shaped by real-world requirements, and it’s able to

- Manage hundreds of thousands of projects
- Automate database lifecycles with minimal human intervention
- Enforce usage limits and cost controls programmatically, including maximum compute uptime per billing cycle, autoscaling limits, monthly data written limits, storage limits per branch, and more

**CLI and native integrations**

For local development and CI pipelines, the [Neon CLI](/docs/reference/neon-cli) provides a simple scripting interface that builds directly on the same API. Neon also provides native integrations for common workflows:

- GitHub Actions for CI-driven branching and cleanup
- Vercel for automatic database branches per preview deployment
- Neon Data API for querying your database over HTTP

**What this means for DX**

Database workflows stop being special-case operations: teams can create, update, and destroy database environments as part of their deployment pipelines.

### AI-first

AI has changed how developers write code, manage infrastructure, and ship applications, so databases need to fit naturally into these workflows.

**Using Neon with AI IDEs and assistants**

Neon integrates directly with AI IDEs and coding assistants through its [MCP](https://neon.com/docs/ai/neon-mcp-server) and [AI rules](https://neon.com/docs/ai/ai-rules). This allows tools like Cursor, Claude, and other MCP-compatible environments to understand and interact with your Neon project in a structured and safe way.

**A Postgres layer for agents**

Neon is also ready to be used as the database layer for [full-stack codegen platforms](https://neon.com/use-cases/ai-agents), or systems where AI agents provision, manage, and operate infrastructure autonomously. Neon’s serverless architecture, instant provisioning, and API-first design make it a natural fit for these platforms. AI agents can create thousands of databases programmatically, manage them over their lifecycle, and clean them up automatically, all while staying cost-efficient.

**What this means for DX**

Developers can safely delegate database-related tasks to AI assistants in their IDEs, while platforms and agents can provision and manage databases autonomously.

## Composable stack

Modern application stacks are increasingly modular. Developers mix and match databases, frameworks, hosting platforms, authentication providers, and AI tools based on their needs and expect each component to integrate cleanly without imposing rigid boundaries. Neon is built around this principle of composability - nothing in Neon requires you to adopt a specific framework or vendor-specific workflow. At its core, Neon is Postgres: you can connect with any driver, ORM, or tool in the ecosystem, deploy it anywhere, and integrate it into existing stacks without changing how you build.

At the same time, Neon provides optional building blocks that make common patterns easier, without locking you in — like authentication. [Neon Auth](https://neon.com/docs/auth/overview) provides authentication primitives that live directly alongside your data in Postgres. Users, sessions, organizations, and permissions are stored in your database and follow the same lifecycle as the rest of your application state. Because Neon Auth is integrated into the platform,

- Auth data branches with your database, making it easy to test real authentication flows in preview and development environments
- Auth state is versioned and reversible, benefiting from the same restore and snapshot capabilities
- Auth integrates naturally with database-level concepts like joins, constraints, and row-level security

**What this means for DX**

Developers stay in control of their stack. You can adopt Neon incrementally, use only the primitives you need, and integrate optional building blocks like Auth without committing to a rigid platform model, keeping architectures flexible.

## Build without friction

Neon is designed to remove friction from database workflows without constraining how you build. Our users tell us the best thing about Neon is that building feels intuitive, and that they forget the database is even there. That’s exactly the goal. When the database stops getting in the way, teams can move faster, experiment safely, and focus on shipping.
