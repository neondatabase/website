---
title: Built to scale
subtitle: Neon supports you from prototype to scale-up
summary: >-
  Neon's serverless Postgres platform scales across distinct growth stages,
  from a free plan with scale-to-zero compute, to a startup tier with
  autoscaling and copy-on-write branching, to fleet-scale with
  database-per-tenant isolation and API-driven provisioning. Read this page to
  match Neon features to your current growth stage before selecting a plan or
  designing a multi-tenant architecture.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/production-readiness
updatedOn: '2026-08-07T17:19:40.308Z'
---

Neon fits into every stage of growth, from the first side project to operating large fleets of production databases - without forcing you to rethink your database architecture along the way.

## Stage 1: Side projects

**Real hosted Postgres with zero costs**

When you’re looking for a free plan to run Postgres, what you want is simplicity and enough room to build. Neon’s Free plan abstracts most configuration work, delivers real-world performance, and gives you access to core Neon features like branching and autoscaling.

- You get a [Free Plan with real resources](/blog/why-so-many-projects-in-the-neon-free-plan), including up to 100 projects, computes with up to 2 CUs, and 0.5 GB of storage per project - enough to build and test real applications
- You get a Postgres connection string in a second so you can start building right away
- [Scale to zero](/docs/introduction/scale-to-zero) ensures idle databases don’t eat up your compute limits: only active time counts
- Standard Postgres compatibility means you can plug Neon into [any framework, ORM, or tool that speaks Postgres](/docs/get-started/frameworks)
- A [broad catalog of Postgres extensions](/docs/extensions/pg-extensions) unlocks a Postgres-for-everything workflow

## Stage 2: Startups

**Build and iterate fast**

As a project becomes a product, small teams need to ship quickly and support real users. Neon gives these teams a frictionless building experience without compromising on performance and reliability.

<CTA title="Production checklist" description="Before launching your product, go through this checklist to make sure your DB has the right configuration to support your end users." buttonText="View checklist" buttonUrl="/docs/get-started/production-checklist" />

- [Autoscaling](/docs/introduction/autoscaling) adapts automatically to unpredictable workloads: you don’t have to plan capacity in advance
- [Branching](https://neon.com/branching) lets you spin up development, preview, and test environments instantly, matching the latest production state, without manual work
- [Out-of-the-box integrations](/docs/guides/integrations) with platforms like Vercel further simplify previews and deployments
- [API-first workflows](/docs/reference/api) make it easy to automate almost all database operations
- AI-coding support via [MCP](/docs/ai/neon-mcp-server) and [Agent Skills](/docs/ai/agent-skills) allows tools like Cursor and Claude to fully interact with Neon
- [Instant restores](/docs/guides/backup-restore) lower the stakes for mistakes and accidents
- [Built-in connection pooling](/docs/connect/connection-pooling) takes care of growing connections in your serverless apps
- You get access to [compliance and security features](/blog/why-we-no-longer-lock-premium-features) without enterprise-only contracts

## Scale-ups and large fleets

**Frictionless operations at scale**

At this stage, teams need performance, reliability, isolation, and automation without ballooning costs or operational complexity. Neon’s architecture is built to address their different requirements directly.

### Operational efficiency

- [On-demand storage](https://neon.com/storage#unique-benefits-derived-from-neons-implementation) grows as data demands it, without planning for capacity in advance and without the risk of full-disk errors
- [Built-in high availability](/docs/introduction/high-availability) is provided by default through storage redundancy, with data replicated across availability zones and cloud object storage
- [Backup and restore via snapshots](/docs/guides/backup-restore) allows you to recover multi-terabyte databases in seconds, without full data copies
- You can use [time travel and snapshot inspections](/blog/three-ways-to-use-your-snapshots) to review past database states for auditing, debugging, and incident analysis
- By [creating environments as copy-on-write branches](/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches), you avoid the management work and costs associated with running separate instances for development, staging, testing, or recovery
- [Programmatic lifecycle management](/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora) lets you create, reset, and delete large numbers of environments without eating up engineering time

### Multi-tenancy

- Neon’s [database-per-tenant setup](https://neon.com/use-cases/database-per-tenant) gives each customer a dedicated Neon project, providing strong isolation, eliminating noisy neighbors, and ensuring consistent performance
- [API-first tenant management](/blog/provision-postgres-neon-api) enables programmatic provisioning, configuration, scaling, recovery, and deletion of tenant databases, making it practical for small teams to manage thousands of tenants

### Fleet management for platforms and agents

- Instant, API-driven database provisioning lets you deploy a full Neon backend as part of your [platform](/docs/guides/embedded-postgres) or [agent](/docs/guides/ai-agent-integration)
- The fully embedded database experience keeps Neon invisible to your end users, with no third-party logins or external configuration required as part of your product workflow
- [Scale to zero](/docs/introduction/scale-to-zero) keeps unit costs low when large numbers of generated apps are never used or only accessed sporadically
- A mature API exposes [fleet management and cost-control capabilities](/docs/guides/consumption-limits) including quotas, usage limits, and lifecycle operations
- You can build versioning, checkpoints, rollbacks, and time-travel workflows with minimal engineering effort via [snapshots](/blog/promoting-postgres-changes-safely-production)
- Built-in app platform services such as [Managed Better Auth](/docs/auth/overview) and our PostgREST-compatible [Data API](/docs/data-api/get-started) make it easy to hook full-stack applications out of the box

<CTA title="Agent Plan" description="If you’re building a full-stack agent platform, apply to our Agent Plan for special pricing, resource limits, and assistance. " buttonText="Check it out" buttonUrl="/programs/agents" />
