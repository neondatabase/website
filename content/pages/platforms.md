---
title: 'Embedded Postgres for Platforms'
subtitle: Provision dedicated Postgres databases for your users, instantly, affordably, and at scale
summary: >-
  How platforms embed Lakebase Postgres for their users: one-second
  provisioning, scale-to-zero economics, API-first fleet management, claimable
  databases for frictionless onboarding, and the path from database fleets to
  full Neon backends.
enableTableOfContents: true
updatedOn: '2026-08-16T23:10:00.000Z'
image: '/images/social-previews/platforms.jpg'
---

![Databases deployed across a fleet, with active databases lit up in green and idle ones dimmed as they scale to zero](/images/pages/platforms/databases-deployed.svg 'square priority')

<Admonition type="note" title="Summary">
Neon is perfect for platforms that need to offer every user their own Postgres database. You provision via API, integrate the database into your product, and your users never have to create a Neon account unless you want them to.

- **Instant** - Databases provision in about a second and resume from scale-to-zero in around 500ms
- **Isolated** - Every user gets a dedicated Neon project with its own connection string
- **Practically free at idle** - Inactive databases suspend automatically, so you pay for what is used, not for what sits waiting
- **API-first** - Provision, set quotas, track usage, and transfer ownership programmatically across tens or hundreds of thousands of projects
- **Claimable when you need it** - Spin up a database with no signup, then let the user claim it into their own Neon account later

This page covers the embedded Postgres model for SaaS and developer platforms. If you are building an agent product that provisions Neon for end users, see also [Neon for AI Agent Platforms](/use-cases/ai-agents).
</Admonition>

## Built to scale Postgres fleets

Neon is the Postgres layer platforms use when every user, workspace, or generated app needs its own database. What you get:

- Dedicated connection strings for every user or project, each in its own secure, isolated Neon [project](/docs/manage/projects)
- High connection capacity, with pooled endpoints that support up to 10,000 connections
- Full Postgres compatibility, with no proprietary query layer
- Branching and instant restore for copies and rollbacks, without manual backups
- Multi-region placement, autoscaling, and high availability on the same model

With pay-per-use pricing and automatic scale-to-zero, [you spend a fraction of what you'd pay on AWS for the same fleet](/cost-fleets).

<QuoteBlock quote="We’ve been able to manage 300K+ Postgres databases via the Neon API. It saved us a tremendous amount of time and engineering effort." author="himanshu-bhandoh" role="Software Engineer at Retool" link="/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases" />

## Instant provisioning and scale-to-zero

Neon databases provision in less than a second and automatically suspend when idle, with no compute cost until the next query. That is what makes dedicated Postgres per user viable: isolation without the cost of idle infrastructure.

- Provisioning time: ~1 second
- Suspend latency: configurable (default is 5 minutes)
- Resume latency (cold start): ~500ms

[Read about the benefits of database-per-user architectures](/docs/use-cases/database-per-user#database-per-user)

<QuoteBlock quote="We were getting ready to hire dedicated engineers just to manage and scale Zite Database. With Neon, we didn’t need to do that. We were able to give every end user their own database, including on the free plan" author={{ name: 'Dominic Whyte', company: 'Co-founder at Zite' }} link="/blog/how-zite-provisions-isolated-postgres-databases-for-every-user" />

## API-first fleet management

Neon's API is built for platforms that manage large fleets of Postgres databases with minimal engineering effort. It has been shaped in collaboration with partners running at the edge of scale and automation. Via the Neon API, you can:

- Provision new databases instantly
- Set per-project resource limits to support free, pro, and enterprise plans
- Scale compute up or down per user or tier
- Automatically suspend inactive databases to reduce costs
- Monitor usage across thousands of projects
- Update quotas and configurations without downtime

<MegaLink tag="Case Study" title="Retool uses the Neon API to manage over 300,000 databases with just one engineer, handling everything from provisioning to quota enforcement." url="/blog/how-retool-uses-retool-and-the-neon-api-to-manage-300k-postgres-databases" />

## Built-in quotas and billing controls

Platforms that ship free, pro, and enterprise tiers need hard caps per user, not just observability. Neon exposes those caps on the project itself through the `quota` object on [Create project](/docs/reference/api/projects/create-project) and [Update project](/docs/reference/api/projects/update-project). Set them when you provision a tenant, then raise or lower them when the user changes plan, without downtime.

| Quota | Scope | What it caps |
| --- | --- | --- |
| `active_time_seconds` | Project, per billing period | How long computes can stay active, excluding idle scale-to-zero time |
| `compute_time_seconds` | Project, per billing period | CPU-seconds across all computes in the project, weighted by compute size |
| `written_data_bytes` | Project, per billing period | Total data written across all branches |
| `data_transfer_bytes` | Project, per billing period | Egress through the Neon proxy |
| `logical_size_bytes` | Branch, lifetime of the branch | Maximum size of any one branch. Only that branch's compute is suspended when hit |

You can also size each endpoint from the same API surface, as project defaults, on branch create, or when creating or updating an endpoint.

| Setting | What it controls |
| --- | --- |
| `autoscaling_limit_min_cu` | Minimum compute size when the endpoint wakes |
| `autoscaling_limit_max_cu` | Hard ceiling for autoscaling under load |
| `suspend_timeout_seconds` | How long an idle endpoint stays warm before scale-to-zero |

Together, quotas and endpoint settings let you encode your pricing tiers in API calls:

- Give free-tier users tight active-time, compute-time, write, and egress ceilings
- Raise the same fields when a user upgrades, or set a quota to `0` to remove the limit
- Force a suspend for abuse or unpaid accounts by dropping a quota to a near-zero threshold
- Pair monthly quotas with per-endpoint autoscaling and suspend timeouts so each tier gets a different compute envelope

[Configure consumption limits](/docs/guides/consumption-limits) covers setting quotas on create or update, querying current usage against them, and resetting a suspended project.

<MegaLink tag="Case Study" title="Koyeb’s Database Instance Types show how to use Neon’s quota controls to define compute, storage, write, and data transfer limits per plan." url="https://www.koyeb.com/docs/databases#database-instance-types" />

## Tracking usage at scale

Platforms that bill their own users, or that need to watch a large fleet, get invoice-aligned consumption data from the Neon API. The v2 consumption endpoints return the same line items Neon bills on, at hourly, daily, or monthly granularity, without waking suspended computes when you poll.

| Endpoint | Path | What it returns | Plan availability |
| --- | --- | --- | --- |
| Project metrics | `GET /consumption_history/v2/projects` | Usage-based metrics per project, cursor-paginated across the org | Launch, Scale, Agent, Enterprise |
| Branch metrics (beta) | `GET /consumption_history/v2/branches` | The same usage-based metrics broken down by branch across one or more projects | Launch, Scale, Agent, Enterprise |

Project metrics cover the full billing surface. Branch metrics omit snapshot storage and extra-branch counts, and are meant for attributing compute and storage to CI branches, previews, or development environments inside a project.

| Metric | What it measures | Useful for |
| --- | --- | --- |
| `compute_unit_seconds` | CPU time weighted by compute size | Passing through compute cost per user or project |
| `root_branch_bytes_month` | Storage on root branches | Primary database storage per tenant |
| `child_branch_bytes_month` | Delta storage on child branches | Preview, CI, and developer branch cost |
| `instant_restore_bytes_month` | Point-in-time history storage | History-window cost per project |
| `snapshot_storage_bytes_month` | Snapshot storage (project endpoint only) | Backup and snapshot line items |
| `public_network_transfer_bytes` | Egress over the public internet | Data-transfer quotas and billing |
| `private_network_transfer_bytes` | Egress over private networks | PrivateLink and similar paths |
| `extra_branches_month` | Child branches beyond plan allowance (project endpoint only) | Enforcing or billing for branch headroom |

You can use these to:

- Monitor total usage across all projects for a billing period, then page through the fleet with cursor-based pagination
- Filter to specific projects or branches when you only need a subset of the fleet
- Break metrics down by hour, day, or month (hourly for the last 7 days, daily for the last 60 days, monthly for the last year)
- Power usage-based billing, free-tier enforcement, and internal dashboards from the same numbers that appear on a Neon invoice
- Poll on your own schedule. Consumption data refreshes about every 15 minutes, and polling does not wake idle computes

[Learn how to query consumption metrics via the API](/docs/guides/consumption-metrics), including request parameters, pagination, and a worked usage-dashboard example.

## Claimable databases for frictionless onboarding

Not every platform wants users to sign up anywhere before they get a database. The [claimable database flow](/docs/guides/platform-integration-overview#claimable-database-flow) is the flavor of this use case for plugins, CLIs, and platforms that want instant Postgres with deferred ownership.

How it works: your users get a Neon connection string immediately, with no signup - if they do not claim it, the database expires after 72 hours. When they are ready, they claim ownership into their own Neon account, and the connection string stays valid.

That pattern fits:

- Framework plugins and CLI tools
- Demo environments and trial experiences
- Educational platforms handing out databases to students
- Development tools that need instant database access
- SaaS products that want deferred account creation

### Example: Netlify DB

Via [Netlify DB](/blog/netlify-db-powered-by-neon) developers and agents can provision a production-ready Postgres database from a Netlify project in one click or one CLI command, with no external signup. If they wish, they claim the database into a Neon account.

<video autoPlay playsInline muted loop width="704" height="400" style={{ marginLeft: 0, marginRight: 'auto', width: '100%', height: 'auto' }}>
  <source src="https://cdn.neonapi.io/public/videos/pages/blog/netlify-db-powered-by-neon/netlify-db-clip-449bd1a2.mp4" type="video/mp4" />
</video>

_Netlify DB provisioning a Postgres database from a Netlify project, powered by Neon's claimable database flow. [Read the launch post](/blog/netlify-db-powered-by-neon)._

<Admonition type="info" title="Implement claimable databases">
- [Platform integration overview: claimable database flow](/docs/guides/platform-integration-overview#claimable-database-flow) - when this path fits vs embedded Postgres, OAuth, or the Agent plan
- [Claimable database integration guide](/docs/workflows/claimable-database-integration) - create a project, issue a transfer request, and hand off ownership
- [Claimable Neon](/docs/reference/claimable-neon) - reference for the claimable Neon project flow
</Admonition>

<QuoteBlock quote="Our users were asking for preview environments that already had their data in place. Neon’s branching was exactly what we needed: it lets us copy databases very quickly so teams can validate changes end to end immediately" author={{ name: 'Marcus Kohlberg', company: 'Founder at Encore' }} link="/blog/where-agents-meet-infrastructure-encore-leap-and-neon" />

## From database fleets to full backends

Around each database, Neon also offers [Managed Better Auth](/docs/auth/overview), [Neon Object Storage](/docs/storage/overview), [Neon Functions](/docs/compute/functions/overview), the [Neon Data API](/docs/data-api/get-started), and the [Neon AI Gateway](/docs/ai-gateway/overview). Those primitives share the same branch and project boundaries as the database, so a fleet of user environments can grow from "a Postgres per user" into "a backend per user" without changing the provisioning model you already run.

You can adopt only the pieces each product needs. The fleet controls, quotas, and claim flows above keep applying either way.

## Built for your platform, not ours

We are not trying to own your user experience. We are here to power it. You can integrate Neon behind the scenes, whether you manage projects directly via API, use the [claimable database flow](/docs/guides/platform-integration-overview#claimable-database-flow), or connect existing Neon accounts through [OAuth](/docs/guides/oauth-integration). You decide how the database shows up in your UI. We take care of the rest.

<CTA title="Pick the integration path that fits" description="Our team can also help with a proof of concept." buttonText="Claimable database flow" buttonUrl="/docs/guides/platform-integration-overview#claimable-database-flow" secondaryButtonText="Talk to us" secondaryButtonUrl="/contact-sales" />
