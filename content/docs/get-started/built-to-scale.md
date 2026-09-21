---
title: Built to scale
subtitle: Neon supports you from prototype to scale-up
summary: >-
  Neon fits every growth stage without requiring an architecture change: a free
  plan for side projects, autoscaling and copy-on-write branching for startup
  teams, and API-driven fleet management for scale-ups.
enableTableOfContents: true
redirectFrom:
  - /docs/get-started-with-neon/production-readiness
  - /docs/get-started/production-readiness
updatedOn: '2026-09-15T18:26:27.284Z'
---

Neon fits into every stage of growth, from the first side project to operating large fleets of production backends, without forcing you to rethink your architecture along the way.

## Stage 1: Side projects

**A full backend on the Free plan**

When you’re looking for a free plan to start building, what you want is simplicity and enough room to work. Neon’s Free plan abstracts most backend configuration, delivers real-world performance, and gives you branching and autoscaling. And you get more than a database: alongside Lakebase Postgres, you can deploy Managed Better Auth, Object Storage for your files, and Functions, all on the same plan.

- A [Free plan with real resources](/docs/introduction/plans): up to 100 projects, each project with its own 100 CU-hours of database compute (autoscaling between 0.25 and 2 CU), 0.5 GB of database storage, and 5 GB of egress, enough to build and test real applications
- Plus the rest of the backend: [Managed Better Auth](/docs/auth/overview) (up to 60,000 MAU), [Object Storage](/docs/storage/overview) (5 GB per project), and [Functions](/docs/compute/functions/overview) (1 million invocations per month)
- [Scale to zero](/docs/introduction/scale-to-zero) means idle projects don’t eat into your compute allowance: only active time counts
- [Instant branching](/docs/introduction/branching) gives each experiment its own copy of the whole backend, data and buckets included, so you can try changes without risk
- It’s real Postgres: it works with [any framework, ORM, or tool that speaks Postgres](/docs/get-started/frameworks), plus a [broad catalog of extensions](/docs/extensions/pg-extensions)

## Stage 2: Startups

**Build and iterate fast**

As a project becomes a product, small teams need to ship quickly and support real users. Neon allows these teams to build fast via coding agents without compromising on scalability or reliability, backed by Lakebase Postgres and the rest of the Neon backend:

<CTA title="Production checklist" description="Before launching your product, go through this checklist to make sure your database has the right configuration to support your end users." buttonText="View checklist" buttonUrl="/docs/get-started/production-checklist" />

- [Autoscaling](/docs/introduction/autoscaling) adapts automatically to unpredictable workloads: you don’t have to plan capacity in advance
- [Branching](https://neon.com/branching) lets you spin up development, preview, and test environments instantly, matching the latest production state, without manual work
- [Out-of-the-box integrations](/docs/guides/integrations) with platforms like Vercel further simplify previews and deployments
- [API-first workflows](/docs/reference/api) make it easy to automate almost all database operations
- AI-coding support via [MCP](/docs/ai/neon-mcp-server) and [Agent Skills](/docs/ai/agent-skills) allows tools like Cursor and Claude to fully interact with Neon
- [Instant restores](/docs/guides/backup-restore) lower the stakes for mistakes and accidents
- [Built-in connection pooling](/docs/connect/connection-pooling) takes care of growing connections in your serverless apps
- You get access to [compliance and security features](/blog/why-we-no-longer-lock-premium-features) without enterprise-only contracts
- The rest of the backend grows on the same project: [Managed Better Auth](/docs/auth/overview), [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview), and the [Data API](/docs/data-api/overview), added as you need them

## Stage 3: Scale-ups and large fleets

**Operations at scale**

At this stage, teams need performance, reliability, isolation, and automation without ballooning costs or operational complexity. The lakebase architecture is built to address their different requirements directly.

### Operational efficiency

- [On-demand storage](https://neon.com/storage#unique-benefits-derived-from-neons-implementation) grows as data demands it, without planning for capacity in advance and without the risk of full-disk errors
- [Built-in high availability](/docs/introduction/high-availability) is provided by default through storage redundancy, with data replicated across availability zones and cloud object storage
- [Backup and restore via snapshots](/docs/guides/backup-restore) allows you to recover multi-terabyte databases in seconds, without full data copies
- You can use [time travel and snapshot inspections](/blog/three-ways-to-use-your-snapshots) to review past database states for auditing, debugging, and incident analysis
- By [creating environments as copy-on-write branches](/blog/how-mindvalley-minimizes-time-to-launch-with-neon-branches), you avoid the management work and costs associated with running separate instances for development, staging, testing, or recovery
- [Programmatic lifecycle management](/blog/how-dispatch-speeds-up-development-with-neon-while-keeping-workloads-on-aurora) lets you create, reset, and delete large numbers of environments without eating up engineering time
- The rest of the backend scales the same way: Object Storage, Functions, and Managed Better Auth provision, branch, and scale with your project, so there's no separate system to operate at fleet size

### Multi-tenancy

- A [database-per-tenant setup](https://neon.com/use-cases/database-per-tenant) gives each customer a dedicated Neon project, providing strong isolation, eliminating noisy neighbors, and ensuring consistent performance
- [API-first tenant management](/blog/provision-postgres-neon-api) enables programmatic provisioning, configuration, scaling, recovery, and deletion of tenant databases, making it practical for small teams to manage thousands of tenants

### Fleet management for platforms and agents

- Instant, API-driven provisioning lets you deploy a full Neon backend, Lakebase Postgres plus the primitives you need, as part of your [platform](/docs/guides/embedded-postgres) or [agent](/docs/guides/ai-agent-integration)
- The fully embedded experience keeps Neon invisible to your end users, with no third-party logins or external configuration required as part of your product workflow
- [Scale to zero](/docs/introduction/scale-to-zero) keeps unit costs low when large numbers of generated apps are never used or only accessed sporadically
- A mature API exposes [fleet management and cost-control capabilities](/docs/guides/consumption-limits) including quotas, usage limits, and lifecycle operations
- You can build versioning, checkpoints, rollbacks, and time-travel workflows with minimal engineering effort via [snapshots](/blog/promoting-postgres-changes-safely-production)
- Backend primitives such as [Managed Better Auth](/docs/auth/overview), [Object Storage](/docs/storage/overview), [Functions](/docs/compute/functions/overview), the PostgREST-compatible [Data API](/docs/data-api/overview), and the [AI Gateway](/docs/ai-gateway/overview) let you hook up full-stack applications by default

<CTA title="Agent Plan" description="If you’re building a full-stack agent platform, apply to our Agent Plan for special pricing, resource limits, and assistance." buttonText="Check it out" buttonUrl="/programs/agents" />
