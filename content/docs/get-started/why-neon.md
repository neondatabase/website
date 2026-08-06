---
title: Why Neon?
subtitle: 'The backend for apps and agents, by Databricks'
summary: >-
  Neon is a complete set of cloud backend primitives built around Lakebase
  Postgres, for developers, startups, and agent platforms, from Databricks.
  Lakebase Postgres runs on the lakebase architecture, making instant branching,
  autoscaling, scale-to-zero, and point-in-time restore intrinsic rather than
  add-ons. Neon also includes Managed Better Auth, Object Storage, Functions,
  and AI Gateway.
  This page documents Lakebase Postgres managed by Neon (Neon's standalone
  serverless Postgres platform). If you are working with Lakebase Postgres managed by Databricks — the
  Postgres offering integrated into the Databricks platform — use the Databricks
  documentation instead: https://docs.databricks.com/aws/en/oltp/projects/.
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
  - /docs/introduction/about
  - /docs/get-started-with-neon/why-neon
updatedOn: '2026-08-06T18:56:08.972Z'
---

## Our mission

**Neon is a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks. Neon includes Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and AI Gateway. Every service is agent-ready: instant, branchable, and serverless, designed to help developers build scalable applications faster than ever.**

Neon started with a mission: to deliver Postgres as a cloud service that gets out of developers' way, from their first side project to millions of users in production. Postgres should be as universal and accessible as object storage, something every developer can rely on without thinking about infrastructure.

That idea became what is now Lakebase Postgres, built on the lakebase architecture: a distributed, cloud-native design that separates storage and compute, giving Postgres the scale, reliability, and efficiency modern applications require. This foundation unlocks the features that agents, and the developers behind them, expect today: autoscaling, scale-to-zero, instant branching, instant restores, and usage-based pricing, without changing the Postgres you already know.

<Admonition type="tip" title="Neon, now a part of Databricks">
  In May 2025, Neon joined Databricks to shape the future of Postgres and AI-native development. Our mission stayed the same. Lakebase Postgres is also available on Databricks, as [Lakebase](https://www.databricks.com/product/lakebase). Learn more in [Neon and Lakebase](/docs/introduction/neon-and-lakebase).
</Admonition>

## What makes Neon different

### Postgres from first principles

Lakebase Postgres isn’t “Postgres-like”: it is Postgres, with full compatibility across ORMs, extensions, and frameworks. But its defining characteristic is the lakebase architecture, which translates into serverless behavior that isn’t layered on but foundational to the system.

Traditional Postgres providers scale by moving VMs up and down, placing instances behind proxies, or by manual tuning. Lakebase Postgres does none of that. Instead, it is serverless, which to us means:

- Storage and compute are fully separated
- Compute is stateless and ephemeral
- Storage is distributed, durable, and versioned
- Scaling involves starting more compute, not moving a monolithic instance

### Developer-first features that fit modern workflows

The lakebase architecture lets Postgres behave the way developers expect modern infrastructure to behave: instant, intuitive, cost-efficient, and safe to experiment with. This modernizes workflows that, in other managed Postgres services, still feel decades old.

- **Scale-to-zero.** Inactive databases shut down automatically to save costs. Ideal for side projects, development environments, and agent-generated apps.
- **Autoscaling.** For your production database, Lakebase Postgres resizes your compute up and down automatically based on traffic. Your performance stays steady without capacity planning.
- **Branching.** You can clone your entire database (data and schema) instantly to create dev environments, run migrations safely, automate previews, enable safe staging workflows, and build versioning and checkpoints for agents.
- **Instant restores.** You can also go back to any point in time in seconds, no matter how large your database, or instantly revert to a previously-saved snapshot.
- **Usage-based pricing.** On Neon, you pay only for what you use, without provisioning storage or compute in advance and without being forced into expensive add-ons.
- **A Free Plan developers can actually use.** The lakebase architecture makes it efficient for Neon to run a large Free Plan with many projects per account and enough resources to build real apps.

## Who uses Neon and why

### Developers and their agents: From side projects to live apps

Independent developers want to build without friction. They don’t want to create accounts, configure VMs, or invest large sums just to test an idea. Increasingly, they want their agent to handle the infrastructure directly.

**Why they build on Neon**

- Neon is agent-first: agents are a first-class interface
- The Free Plan is generous enough to build real apps, not just to test things out
- A Postgres connection string is available immediately, with no wait for provisioning
- Branching, previews, and instant restores let agents experiment quickly
- Neon integrates easily with Next.js, Remix, Vercel, Prisma, Drizzle, and the broader ecosystem
- The experience feels lightweight and fast, not enterprise-heavy

### Startups: From dev to scale

Startups want to ship product fast and avoid cloud infrastructure complexity. They need their Postgres to be reliable, scalable, and invisible, something they never have to think about unless something goes wrong. They also need their coding agent to handle it reliably.

**Why they build on Neon**

- The lakebase architecture removes most database administration, and agents can handle the tasks that remain
- Autoscaling takes care of unpredictable traffic without overprovisioning or planning compute sizes
- Branching speeds up building: entire dev backend environments get deployed instantly with minimal costs
- Neon's straightforward and feature-complete [API](/docs/reference/api)
- Usage-based pricing means no waste, no upfront commitments
- Neon delivers on reliability, performance, and compliance, backed by Databricks

### App generation platforms: From prompt to app

Full-stack codegen platforms spin up thousands of independent applications instantly, each with its own backend. They need a backend that can support a fleet of thousands of mostly inactive apps every day without breaking performance or blowing up costs.

**Why they build on Neon**

- Neon is already tested at scale, powering platforms like Replit
- They can deploy a backend instantly and transparently on behalf of the end-user, including Lakebase Postgres, Managed Better Auth, Object Storage, Functions, and AI Gateway
- Agents and APIs create and delete thousands of short-lived, low-usage databases
- Scale-to-zero makes this setup economically viable at scale
- Branching makes it simple to build versioning, rollbacks, and checkpoints

<Admonition type="tip" title="Join the Agent Program">
  Building a full-stack agent that deploys backends? Apply to our [Agent Program](https://neon.com/programs/agents#agent-plan-pricing) and get access to special pricing, resource limits, features, and support from the team.
</Admonition>

## The architecture that makes it possible: lakebase architecture

The benefits developers experience with Neon (instant branching, autoscaling, scale-to-zero, and fast recovery) are not product features layered on top of Postgres. They fall out naturally from the lakebase architecture.

At the highest level, the lakebase architecture is built on a simple but powerful idea: Postgres on the object store.

Traditional Postgres systems are designed around local or attached disks. That design couples durability, storage capacity, and compute into a single machine. The lakebase architecture breaks that coupling by moving durability and history into cloud object storage. Once storage lives in the object store, the rest of the system can be rethought.

### Object store first

Lakebase Postgres treats the object store as the system of record. WAL, page versions, and database history are persisted directly to durable object storage rather than tied to a specific server or disk. The consequences:

- Durability no longer depends on a single machine
- Storage scales independently and effectively without limits
- Recovery becomes a metadata operation, not a data copy
- History is retained natively, not reconstructed from backups

### Separation of storage and compute

With durability and history centralized in storage, compute can be fully decoupled. Data lives in a distributed, durable storage layer. Computes are lightweight and ephemeral processes that attach to that data when needed. This separation is the foundation of everything Lakebase Postgres can do:

- Start and stop compute in seconds
- Scale compute independently of storage
- Attach multiple computes to the same data
- Recover from failures instantly
- Enable true pay-only-for-what-you-use pricing

### A versioned storage engine (copy-on-write)

Separation alone is not enough. The most distinctive capabilities of Lakebase Postgres come from its versioned storage engine, which preserves the full history of the database. Every WAL record and every page version is retained in a single system. As a result:

- Entire databases can be branched instantly
- Any past state can be restored without copying data
- Point-in-time recovery is intrinsic, not an add-on
- Development, staging, previews, and rollbacks become cheap and safe

### Stateless, ephemeral compute

The final piece follows naturally from the others. Computes in Lakebase Postgres do not store data. They attach to the storage layer at a specific point in history, execute queries, and disappear when no longer needed. They can be created, resized, or destroyed at any time without risking data loss. This is what allows Lakebase Postgres to:

- Autoscale without downtime
- Scale to zero when idle
- Handle fleets of thousands of short-lived databases
- Support agent-driven and highly dynamic workloads

<Admonition type="tip" title="Neon and Lakebase">
  Lakebase Postgres is available via Neon and via Databricks. For what's the same in both places and when to choose each, see [Neon and Lakebase](/docs/introduction/neon-and-lakebase).
</Admonition>

<CTA title="Contact us" description="Lakebase Postgres via Neon and via Databricks are two access paths to the same database product. Explore your options and get help deciding which fits your workload." buttonText="Reach out" buttonUrl="https://www.databricks.com/company/contact" />
