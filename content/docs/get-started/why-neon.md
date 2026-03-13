---
title: Why Neon?
subtitle: 'Serverless Postgres, by Databricks'
summary: >-
  Covers the features and architecture of Neon, a fully managed, serverless
  Postgres solution designed for scalable application development, emphasizing
  its unique separation of storage and compute for enhanced performance and
  reliability.
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
  - /docs/introduction/about
  - /docs/get-started-with-neon/why-neon
updatedOn: '2026-02-15T20:51:54.114Z'
---

## Our mission

**Neon is the Postgres layer for the internet: a fully managed, serverless, open-source Postgres designed to help developers build scalable, dependable applications faster than ever.**

We aim to deliver Postgres as a cloud service that feels effortless, from your first side project to millions of users in production. We believe Postgres should be as universal and accessible as object storage, something every developer can rely on without thinking about infrastructure.

Neon is built on a distributed, cloud-native architecture that separates storage and compute, giving Postgres the scale, reliability, and efficiency modern applications require. This foundation unlocks the features developers expect today (autoscaling, scale-to-zero, instant branching, instant restores, usage-based pricing, and much more) without changing the Postgres you already know.

<Admonition type="tip" title="A Databricks company">
  In May 2025, Neon joined Databricks to shape the future of Postgres and AI-native development. Our mission stayed the same, but we’re now backed by the performance, security, and global scale of the Databricks Data Intelligence Platform. Neon’s architectural foundation also powers [Lakebase](https://www.databricks.com/product/lakebase); learn more in the [Neon and Lakebase](#neon-and-lakebase) section.
</Admonition>

## What makes Neon different

### Serverless Postgres, built from first principles

Neon isn’t “Postgres-like”: it is Postgres, with full compatibility across ORMs, extensions, and frameworks. But Neon’s defining characteristic lies in its architecture, which translates into serverless behavior that isn’t layered on but foundational to the system.

Traditional Postgres providers scale by moving VMs up and down, placing instances behind proxies, or by manual tuning. Neon does none of that. Instead, Neon is serverless, which to us means:

- Storage and compute are fully separated
- Compute is stateless and ephemeral
- Storage is distributed, durable, and versioned
- Scaling involves starting more compute, not moving a monolithic instance

### Developer-first features that fit modern workflows

Neon’s architecture lets us design a database platform that behaves the way developers expect modern tools to behave: instant, intuitive, cost-efficient, and safe to experiment with. This modernizes workflows that, in many managed Postgres services, still feel decades old.

- **Scale-to-zero.** Inactive databases shut down automatically to save costs. Ideal for side projects, development environments, and agent-generated apps.
- **Autoscaling.** For your production database, Neon resizes your compute up and down automatically based on traffic. Your performance stays steady without capacity planning.
- **Branching.** In Neon, you can clone your entire database (data and schema) instantly to create dev environments, run migrations safely, automate previews, enable safe staging workflows, and build versioning and checkpoints for agents.
- **Instant restores.** You can also go back to any point in time in seconds, no matter how large your database, or instantly revert to a previously-saved snapshot.
- **Usage-based pricing.** In Neon, you pay only for what you use, without provisioning storage or compute in advance and without being forced into expensive add-ons.
- **A Free Plan developers can actually use.** Our unique architecture makes it incredibly efficient to run a large Free Plan with many projects per account and enough resources to build real apps.

## Who uses Neon and why

### Developers: From side projects to live apps

Independent developers want to build without friction. They don’t want to create accounts, configure VMs, or invest large sums just to test an idea. They want something that feels modern, straightforward, and aligned with today’s frameworks.

**Why they build on Neon**

- They get a Postgres connection string immediately: no setup
- The Free Plan is generous enough to build real apps
- They can work on multiple projects at once
- Neon integrates easily with Next.js, Remix, Vercel, Prisma, Drizzle, and the broader ecosystem
- Branching, previews, and instant restores let them experiment quickly
- The experience feels lightweight, fast, and developer-first, not enterprise-heavy

  <Admonition type="tip" title="Useful links to get started">
    Check out our [framework guides](/docs/get-started/frameworks), [templates](https://neon.com/templates), [code examples](https://github.com/neondatabase/examples), and join our [community Discord](https://discord.gg/92vNTzKDGp).
  </Admonition>

### Startups: From dev to scale

Startups want to ship product fast and avoid cloud infrastructure complexity. They need their Postgres to be reliable, scalable, and invisible, something they never have to think about unless something goes wrong.

**Why they build on Neon**

- Its serverless architecture removes most management
- Autoscaling handles unpredictable traffic without overprovisioning or planning compute sizes
- Branching speeds up building - teams can ship safely and quickly
- Neon's straightforward and feature-complete [API](/docs/reference/api-reference)
- Usage-based pricing means no upfront commitments
- Neon delivers on reliability, performance, and compliance

<Admonition type="tip" title="Keep reading">
  Check out our [success stories](https://neon.com/case-studies), [use cases](https://neon.com/use-cases/serverless-apps), and the [Startup Program](https://neon.com/startups). 
</Admonition>

### Agents & codegen: From prompt to app

Full-stack codegen platforms need to spin up thousands of independent applications instantly, each with its own backend. They need a database that can support a fleet of thousands of mostly inactive databases every day without breaking performance or blowing up costs.

**Why they build on Neon**

- Neon is already tested at scale, powering platforms like Replit
- They can deploy a Postgres backend instantly and transparently, without signup from the end-user
- Thousands of short-lived, low-usage databases can be deployed programmatically
- Scale-to-zero makes per-app databases economically viable, even at scale
- Branching allows for agent-friendly workflows: versioning, snapshots, rollbacks, checkpoints
- Neon Auth + Data API form a backend layer that works directly with the database

<Admonition type="tip" title="Join the Agent Program">
  Building a full-stack agent that needs databases? Apply to our [Agent Program](https://neon.com/programs/agents#agent-plan-pricing) and get access to special pricing, resource limits, and features.
</Admonition>

## The architecture that makes it possible: how Neon works

The benefits developers experience with Neon (instant branching, autoscaling, scale-to-zero, and fast recovery) are not product features layered on top of Postgres. They fall out naturally from Neon’s architecture.

At the highest level, Neon is built on a simple but powerful idea: Postgres on the object store.

Traditional Postgres systems are designed around local or attached disks. That design couples durability, storage capacity, and compute into a single machine. Neon breaks that coupling by moving durability and history into cloud object storage. Once storage lives in the object store, the rest of the system can be rethought.

### Object store first

Neon treats the object store as the system of record. WAL, page versions, and database history are persisted directly to durable object storage rather than tied to a specific server or disk. The consequences:

- Durability no longer depends on a single machine
- Storage scales independently and effectively without limits
- Recovery becomes a metadata operation, not a data copy
- History is retained natively, not reconstructed from backups

### Separation of storage and compute

With durability and history centralized in storage, compute can be fully decoupled. Data lives in a distributed, durable storage layer. Computes are lightweight and ephemeral processes that attach to that data when needed. This separation is the foundation of everything Neon can do:

- Start and stop compute in seconds
- Scale compute independently of storage
- Attach multiple computes to the same data
- Recover from failures instantly
- Enable true pay-only-for-what-you-use pricing

### A versioned storage engine (copy-on-write)

Separation alone is not enough. Neon’s most distinctive capabilities come from its versioned storage engine, which preserves the full history of the database. Every WAL record and every page version is retained in a single, unified system. As a result:

- Entire databases can be branched instantly
- Any past state can be restored without copying data
- Point-in-time recovery is intrinsic, not an add-on
- Development, staging, previews, and rollbacks become cheap and safe

### Stateless, ephemeral compute

The final piece follows naturally from the others. Computes in Neon do not store data. They attach to the storage layer at a specific point in history, execute queries, and disappear when no longer needed. They can be created, resized, or destroyed at any time without risking data loss. This is what allows Neon to:

- Autoscale without downtime
- Scale to zero when idle
- Handle fleets of thousands of short-lived databases
- Support agent-driven and highly dynamic workloads

<Admonition type="tip" title="Neon vs Lakebase">
  For a full breakdown of both products — including when to choose each — see [Neon vs Lakebase](/docs/introduction/neon-and-lakebase).
</Admonition>

<CTA title="Contact us" description="Neon and Lakebase represent two paths built on the same architectural foundation. Explore your options and get help deciding which service is the best fit." buttonText="Reach out" buttonUrl="https://www.databricks.com/company/contact" />
