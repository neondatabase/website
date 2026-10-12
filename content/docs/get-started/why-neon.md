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
enableTableOfContents: true
redirectFrom:
  - /docs/cloud/about
  - /docs/introduction/about
  - /docs/get-started-with-neon/why-neon
updatedOn: '2026-09-15T18:26:27.284Z'
---

## Our mission

**Neon is a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks. Neon includes Lakebase Postgres, Managed Better Auth, Object Storage, Functions, the Data API, and AI Gateway. Every service is agent-ready: instant, branchable, and serverless, designed to help developers build scalable applications faster than ever.**

Neon started with a mission: to deliver Postgres as a cloud service that gets out of developers' way, from their first side project to millions of users in production. Postgres should be as universal and accessible as object storage, something every developer can rely on without thinking about infrastructure.

That idea became what is now Lakebase Postgres, built on the lakebase architecture: a distributed, cloud-native design that separates storage and compute, giving Postgres the scale, reliability, and efficiency modern applications require. This foundation unlocks the features that agents, and the developers behind them, expect today: autoscaling, scale-to-zero, instant branching, instant restores, and usage-based pricing, without changing the Postgres you already know.

Neon has since grown beyond the database into a complete backend, so a single account provisions everything an app or agent needs, not just a place to store data.

<Admonition type="tip" title="Neon, now a part of Databricks">
  In May 2025, Neon joined Databricks to shape the future of Postgres and AI-native development. Our mission stayed the same. Lakebase Postgres is also available on Databricks, as [Lakebase](https://www.databricks.com/product/lakebase). Learn more in [Neon and Lakebase](/docs/introduction/neon-and-lakebase).
</Admonition>

## What makes Neon different

### Real Postgres, serverless by architecture

At the center of Neon is Lakebase Postgres. It isn’t “Postgres-like”: it is Postgres, with full compatibility across ORMs, extensions, and frameworks. What sets it apart is the [lakebase architecture](/docs/introduction/architecture-overview), which separates storage from compute so serverless behavior is foundational, not layered on. Instead of sizing instances or tuning by hand, you get a database that behaves the way developers expect modern infrastructure to:

- **Scale-to-zero.** Inactive databases shut down automatically to save costs. Ideal for side projects, development environments, and agent-generated apps.
- **Autoscaling.** For production, Lakebase Postgres resizes compute up and down automatically based on traffic, so performance stays steady without capacity planning.
- **Branching.** Clone your entire database (data and schema) instantly to create dev environments, run migrations safely, automate previews, and build versioning and checkpoints for agents.
- **Instant restores.** Go back to any point in time in seconds, no matter how large your database, or instantly revert to a saved snapshot.
- **Usage-based pricing.** Pay only for what you use, without provisioning storage or compute in advance and without expensive add-ons.
- **A Free plan developers can actually use.** The lakebase architecture makes it efficient for Neon to run a large Free plan with many projects per account and enough resources to build real apps.

### A complete backend, not just a database

Most apps and agents need more than a database. Neon gives you the rest of a modern backend as first-class primitives, each built to branch, scale, and provision the same way Lakebase Postgres does:

- **[Managed Better Auth](/docs/auth/overview)** for authentication and identity, backed by Postgres
- **[Object Storage](/docs/storage/overview)** for S3-compatible files and blobs that branch alongside your data
- **[Functions](/docs/compute/functions/overview)** for long-running compute next to your database
- **[Data API](/docs/data-api/overview)** for instant HTTP access to your data
- **[AI Gateway](/docs/ai-gateway/overview)** for model access across providers with a single credential

You adopt only the primitives you need and keep the rest of your stack (frameworks, hosts, ORMs, AI tools) unchanged. This is what lets a platform or agent deploy a full backend, not just a database, in a single step.

### Agent-ready by default

Every core operation is available as an API, so the whole backend is operable by software, not only by a human in a console. Agents provision, branch, query, and tear down backends through the [Neon API](/docs/reference/api), [SDKs](/docs/reference/sdk), [CLI](/docs/cli), and [MCP server](/docs/ai/neon-mcp-server) the same way they manage code, and the serverless architecture keeps that automation fast and cheap even across thousands of short-lived environments. An agent can even [provision a database before the user has an account](/docs/reference/claimable-neon) and hand back a claim link so a human can take ownership later.

## Who uses Neon and why

### Developers and their agents: From side projects to live apps

Independent developers want to build without friction. They don’t want to create accounts, configure VMs, or invest large sums just to test an idea. Increasingly, they want their agent to handle the infrastructure directly.

**Why they build on Neon**

- Neon is agent-first: agents are a first-class interface
- The Free plan is generous enough to build real apps, not just to test things out
- A Postgres connection string is available immediately, with no wait for provisioning
- Branching, previews, and instant restores let agents experiment quickly
- Neon integrates easily with Next.js, Remix, Vercel, Prisma, Drizzle, and the broader ecosystem
- Managed Better Auth, Object Storage, and Functions are one call away when the project needs more than a database, with no new provider to sign up for
- The experience feels lightweight and fast, not enterprise-heavy

### Startups: From dev to scale

Startups want to ship product fast and avoid cloud infrastructure complexity. They need their backend to be reliable, scalable, and invisible, something they never have to think about unless something goes wrong. They also need their coding agent to handle it reliably.

**Why they build on Neon**

- The lakebase architecture removes most database administration, and agents can handle the tasks that remain
- Autoscaling takes care of unpredictable traffic without overprovisioning or planning compute sizes
- Branching speeds up building: entire dev backend environments get deployed instantly with minimal costs
- Neon's straightforward and feature-complete [API](/docs/reference/api)
- Usage-based pricing means no waste, no upfront commitments
- Managed Better Auth, Object Storage, the Data API, and Functions are built in, so the team ships features without stitching together separate services
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

## How it works: the lakebase architecture

The serverless behaviors (instant branching, autoscaling, scale-to-zero, and fast recovery) aren't features layered on Postgres. They fall out of one idea: Postgres on the object store. Durability and history live in cloud object storage instead of on a single machine's disk, so compute becomes stateless and ephemeral, storage scales on its own, and past states are retained natively rather than rebuilt from backups. For the full design, including the safekeeper, pageserver, and read and write paths, see the [architecture overview](/docs/introduction/architecture-overview).

<Admonition type="note" title="Not the same as Neon Object Storage">
The object store described here is the internal storage layer that Lakebase Postgres is built on: where your database's data and history live. It is separate from [Object Storage](/docs/storage/overview), the S3-compatible primitive you use directly to store application files and blobs. Both draw on the same object-store foundation, which is why a bucket branches alongside your database, but you interact with them at different layers.
</Admonition>

The rest of Neon's primitives are designed to carry these same properties. Object Storage buckets, Functions, Managed Better Auth, and the Data API all provision instantly, branch with your project, and scale on demand, so the whole backend behaves the way Lakebase Postgres does, not just the database at its center.

<Admonition type="tip" title="Neon and Lakebase">
  Lakebase Postgres is available via Neon and via Databricks. For what's the same in both places and when to choose each, see [Neon and Lakebase](/docs/introduction/neon-and-lakebase).
</Admonition>

<CTA title="Contact us" description="Lakebase Postgres via Neon and via Databricks are two access paths to the same database product. Explore your options and get help deciding which fits your workload." buttonText="Reach out" buttonUrl="https://www.databricks.com/company/contact" />
