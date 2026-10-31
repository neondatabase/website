# Neon Pricing Plans

> Neon is a complete set of cloud backend primitives built around Lakebase Postgres, for developers, startups, and agent platforms, from Databricks. Services include Lakebase Postgres, Managed Better Auth, a Data API, Functions, Object Storage, and an AI Gateway, on three plans: Free, Launch, and Scale. Lakebase Postgres on Neon includes autoscaling, instant restore, and scale-to-zero, and works with any language, framework, or ORM that supports Postgres. Storage is unlimited on paid plans and grows with your usage. Pay only for what you use on paid plans; no monthly minimum and no per-project fee. The Free plan includes 100 projects, which with usage-based paid plans suits a database per tenant or per agent (see [How much does a database per tenant or per agent cost?](#how-much-does-a-database-per-tenant-or-per-agent-cost-on-neon)). Typical spend is about $15/month on Launch for a small database and $701/month on Scale for a production workload (see [Typical monthly cost](#typical-monthly-cost)).

Last updated: 2026-10-31

## How billing works

Paid plans are pay-as-you-go: usage is metered hourly and billed at the end of the month, with no monthly minimum. Plans apply per **organization**, and one Neon account can belong to multiple orgs on different plans. The Free plan is permanent (not a trial); no credit card required.

| Unit              | Meaning                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| CU (Compute Unit) | ~4 GB RAM + CPU + SSD.                                                                                  |
| CU-hour           | `compute size × hours running`. 0.25 CU × 4 hours = 1 CU-hour. Suspended (scaled-to-zero) compute = $0. |
| GB-month          | Storage, metered hourly.                                                                                |
| branch-month      | Extra branch kept for one month. Prorated hourly.                                                       |

Compute suspends automatically after inactivity (**scale-to-zero**); no CU-hours accrue while suspended. Always enabled on Free (suspends after 5 min, cannot be turned off); can be disabled on Launch; fully configurable on Scale.

Invoices under $0.50 are not collected.

## Plans at a glance

| Feature                          | Free                                                   | Launch                                                | Scale                                                            |
| -------------------------------- | ------------------------------------------------------ | ----------------------------------------------------- | ---------------------------------------------------------------- |
| Price                            | $0/month                                               | Pay for what you use                                  | Pay for what you use                                             |
| Who it's for                     | Prototypes, side projects, and small teams             | Startups and growing teams                            | Production-grade workloads and larger companies                  |
| Organization members             | Unlimited                                              | Unlimited                                             | Unlimited                                                        |
| Projects                         | 100                                                    | 100                                                   | 1,000 (can be increased on request)                              |
| Branches per project             | 10                                                     | 10                                                    | 25                                                               |
| Extra branches                   | -                                                      | $1.50/branch-month (prorated hourly)                  | $1.50/branch-month (prorated hourly)                             |
| Compute                          | 100 CU-hours/project                                   | $0.106/CU-hour                                        | $0.222/CU-hour                                                   |
| Autoscaling                      | Up to 2 CU (8 GB RAM)                                  | Up to 16 CU (64 GB RAM)                               | Up to 16 CU autoscaling, or fixed sizes up to 56 CU (224 GB RAM) |
| Scale to zero                    | After 5 min                                            | After 5 min, can be disabled                          | Configurable (1 minute to always on)                             |
| Storage                          | 1 GB/project, 20 GB account total                    | $0.35/GB-month                                        | $0.35/GB-month                                                   |
| Instant restore                  | -                                                      | $0.20/GB-month                                        | $0.20/GB-month                                                   |
| History window                   | 6 hours (1 GB limit)                                   | Up to 7 days                                          | Up to 30 days                                                    |
| Snapshots (manual)               | 1                                                      | 100                                                   | 100                                                              |
| Snapshots (scheduled)            | -                                                      | Yes ($0.09/GB-month)                                  | Yes ($0.09/GB-month)                                             |
| Public network transfer (egress) | 5 GB per project included                              | 500 GB per project included, then $0.10/GB            | 500 GB per project included, then $0.10/GB                       |
| Private network transfer         | -                                                      | -                                                     | $0.01/GB                                                         |
| Auth (MAU)                       | Up to 60k MAU per project                              | Up to 1M MAU per project                              | Up to 1M MAU per project                                         |
| Object Storage                   | 5 GB per project included                              | $0.023/GB-month                                       | $0.023/GB-month                                                  |
| Functions                        | 10 active / 400 waiting Capacity-Hours, 1M invocations per project | Active $0.10, waiting $0.025 per Capacity-Hour; $0.60/M invocations | Active $0.12, waiting $0.03 per Capacity-Hour; $0.60/M invocations |
| AI Gateway                       | -                                                      | Prepaid credits (no markup) | Prepaid credits (no markup)            |
| Realtime (beta)                  | Free during beta                                       | Free during beta                                      | Free during beta                                                 |
| Monitoring retention             | 1 day                                                  | 3 days                                                | 14 days                                                          |
| Metrics/logs export              | -                                                      | -                                                     | Yes                                                              |
| Spending notifications           | -                                                      | Yes                                                   | Yes                                                              |
| Protected branches               | -                                                      | Yes                                                   | Yes                                                              |
| IP Allow rules                   | -                                                      | -                                                     | Yes                                                              |
| Private Networking               | -                                                      | -                                                     | Yes                                                              |
| HIPAA                            | -                                                      | -                                                     | Available                                                        |
| SOC 2                            | -                                                      | -                                                     | Available                                                        |
| Uptime SLA                       | -                                                      | -                                                     | Yes                                                              |
| Support                          | Community                                              | Billing support                                       | Standard, Business, or Production                                |

A "-" means the feature is not available on that plan.

All plans include: multi-AZ storage (high availability without standbys), autoscaling and scale to zero, database branching (auth, Object Storage, and Functions branch with the database), read replicas, connection pooling (up to 10,000 pooled connections per compute), Postgres extensions (pgvector, PostGIS, TimescaleDB, and more), Managed Better Auth, a Data API for querying over HTTP, Object Storage, Functions, Realtime (beta), and a full management API and CLI. Neon is ISO 27001 and 27701 certified, SOC 2 audited, and GDPR and CCPA compliant; HIPAA is available on Scale.

## Table clarifications

- **Branches** are capped at 5,000 per project on paid plans (10/25 included). Free is capped at 10 per project.
- **Instant restore** is charged only on root branches; child branches don't add to this charge.
- **Storage size** (Postgres storage) is unlimited on paid plans: there's no hard per-branch size limit and storage grows with your usage. Free is capped at 1 GB of Postgres storage per project and 20 GB total across all projects. This is separate from Object Storage, which has its own Free allowance.
- **Storage on child branches** uses copy-on-write: they start at $0 and grow with writes on that branch, capped at the branch's data size. Root branches are billed on their full data size.
- **Snapshots** are billed at $0.09/GB-month for both manual and scheduled storage. The table figures are per-project count limits, not free allowances. Scheduled snapshots don't count against the manual limit.
- **Read replicas** are separate computes and count toward CU-hours.
- **Auth (MAU)** can scale beyond 1M; contact Neon for higher limits.
- **Private Networking** ($0.01/GB on Scale) counts traffic in **both directions**.
- **HIPAA** is self-serve on Scale (BAA required), currently at no additional cost. See [HIPAA](https://neon.com/docs/security/hipaa.md) for details.
- **Object Storage** and **Functions**: Object Storage is $0.023/GB-month (stored volume only, no per-operation charge). Functions active compute is $0.10/Capacity-Hour (Launch) or $0.12/Capacity-Hour (Scale), waiting compute is $0.025/Capacity-Hour (Launch) or $0.03/Capacity-Hour (Scale), and invocations are $0.60/M on both plans. Object Storage egress counts toward the shared network transfer allowance.
- **Realtime** is in beta and free during the beta. Compute and egress it uses are billed as usual.
- **Free plan** for the backend services: 5 GB Object Storage per project and, for Functions, 10 active Capacity-Hours, 400 waiting Capacity-Hours, and 1M invocations per project per month.

See [Plans](https://neon.com/docs/introduction/plans.md) for full details.

## Typical monthly cost

Estimated monthly cost of representative database workloads: CU-hours × the plan's CU-hour rate, plus storage GB-months × $0.35. Covers Postgres compute and storage only; Object Storage, Functions, and AI Gateway are billed separately. The pricing page shows Intermittent load on Launch ($15/month) and High load on Scale ($701/month) by default.

| Workload          | Compute         | Storage | What it represents                                                       | Launch | Scale  |
| ----------------- | --------------- | ------- | ------------------------------------------------------------------------ | ------ | ------ |
| Intermittent load | 140 CU-hours    | 1 GB    | Small database that scales to zero when idle (0.25 to 2 CU when running) | $15    | $31    |
| Low load          | 190 CU-hours    | 5 GB    | Small always-on database (scale to zero disabled, mostly at 0.25 CU)     | $22    | $44    |
| Medium load       | 720 CU-hours    | 10 GB   | Constant-load app database scaling between 0.5 and 4 CU                  | $80    | $163   |
| High load         | 3,000 CU-hours  | 100 GB  | Production app with sustained traffic, scaling between 3 and 7 CU        | $353   | $701   |
| XL load           | 6,000 CU-hours  | 1 TB    | Large-scale production workload scaling between 6 and 14 CU              | Not listed | $1,682 |

Actual cost depends on how much your database autoscales, how long computes run before scaling to zero, your data size and number of branches, and your history window.

## Common questions

### How can I try Neon without signing up?

Use [Claimable Neon](https://neon.com/claimable-neon) for an instant project, with no signup and no card. Provision from that page or the [API](https://neon.com/docs/reference/claimable-neon.md). Claim it to a Neon account before expiration to keep it.

### What is a project?

Your top-level container: primary database, branches, compute. Like a Git repo, with one project and many branches. Projects belong to **organizations**, where plans and billing apply.

### How are extra branches billed?

Branches above your plan's allowance (10 included on Free/Launch, 25 on Scale) are billed at $1.50/branch-month, prorated hourly (~$0.002/hour). Example: 2 extra branches kept for 5 hours each = 10 branch-hours × $0.002 = $0.02.

### What happens when I hit Free plan limits?

The Free plan is permanent, not a trial, and doesn't require a credit card. Most limits are per project. Running out of CU-hours or egress (5 GB) suspends compute until the next billing period. Exceeding 1 GB of Postgres storage in a project, or 20 GB total across all your projects, blocks writes. Hitting 10 branches blocks branch creation. None of these limits delete your data. Upgrade to lift any limit immediately. If you'd rather not upgrade yet and need more room, [reach out to us](https://neon.com/contact-sales) about credits; we're happy to support developers and startups.

### Does Neon pause Free plan projects when they are inactive?

No. Neon doesn't pause Free projects for inactivity, and there's no restore step. When a database is idle, its compute scales to zero after 5 minutes and starts again on the next query, typically within a few hundred milliseconds. Your project, data, and connection string stay the same. Compute is suspended only if a project uses up its monthly 100 CU-hours or 5 GB of network transfer; it resumes at the start of the next billing period, or as soon as you upgrade. If you hit these limits and need more room, [reach out to us](https://neon.com/contact-sales) about credits; we're happy to support developers and startups.

### How much network transfer (egress) is included?

Public network transfer is counted per project, not per account: 5 GB per project per month on Free (across up to 100 projects), and 500 GB per project per month on Launch and Scale, then $0.10/GB. Each project's allowance is shared by Postgres, Object Storage, and Functions. Eligible startups can apply for up to $100k in credits through the [Startup Program](https://neon.com/startups).

### How do Neon costs scale as I add projects or traffic?

With usage, not with instance size or project count. There's no per-project or per-database fee: each project pays for the compute it actually runs (CU-hours) and the storage it holds. Idle databases scale to zero, so you don't pay for compute while they're suspended (storage is still billed), and autoscaling sizes compute to the load within the limits you set.

### How much does a database per tenant or per agent cost on Neon?

Neon's pricing is built for this pattern. Each tenant gets its own project (an isolated Postgres database with its own compute), and there's no per-project or per-database fee.

- **Free plan:** up to 100 projects at $0, each with its own 100 CU-hours and 1 GB of storage, enough to build and test a database-per-tenant app.
- **Launch and Scale:** pay only for the compute each tenant actually runs and the storage it holds. Idle tenant databases scale to zero, so inactive tenants don't add compute cost (storage is still billed). Launch includes 100 projects; Scale includes 1,000, with more on request.

Example: 100 tenant databases on Launch, each running at 0.25 CU for about an hour a day and storing 150 MB, use about 750 CU-hours and 15 GB of storage: roughly $85/month in total, or about $0.85 per tenant. Platforms that provision databases for their users at scale can apply to the [Agent Plan](https://neon.com/docs/introduction/agent-plan.md). Design guidance: [Multitenancy with Neon](https://neon.com/docs/guides/multitenancy.md).

### How are the backend services billed?

Object Storage, Functions, and AI Gateway are billed separately from Postgres compute, at the rates in the plan table; AI Gateway is available on Launch and Scale. Managed Better Auth, the Data API, and Realtime have no separate charge: Auth is included up to 60,000 MAU per project on Free and 1M on paid plans; the Data API is included on every plan; Realtime is free during the beta. Queries from the Data API and Realtime run on your database, so the compute (CU-hours) and network transfer they use are billed as usual.

### Can I set a spending limit?

Yes, in three ways. [Spending notifications](https://neon.com/docs/introduction/spending-notifications.md) (Launch and Scale) email your organization at 80% and 100% of a monthly dollar threshold; they alert but don't stop usage. Autoscaling limits cap each database's compute size, which puts a ceiling on compute spend. [Consumption limits](https://neon.com/docs/guides/consumption-limits.md), set per project with the Neon API, suspend compute when a project reaches a compute, storage, or data transfer quota.

### Do you offer credits or programs?

Early startups that have received venture funding can apply for up to $100k in credits through the [Startup Program](https://neon.com/startups). Platforms that provision databases for their users can apply to the [Agent Plan](https://neon.com/docs/introduction/agent-plan.md) (sponsored free-tier infrastructure and up to $25,000 in paid-tier credits). The [Open Source Program](https://neon.com/programs/open-source.md) offers monthly sponsorships for maintainers.

### How can I control my costs?

| Action                                                                                           | Effect                                  |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Cap autoscaling per compute                                                                      | Hard ceiling on compute spend           |
| Keep scale-to-zero on for non-prod                                                               | Idle compute = $0                       |
| Delete unused branches, or set TTL                                                               | Saves $1.50/branch-month each           |
| Shorten the history window                                                                         | Saves $0.20/GB-month on instant restore (History) storage |
| Org-level [spending notifications](https://neon.com/docs/introduction/spending-notifications.md) (Launch/Scale) | Email alerts at 80% and 100%            |

See [Cost optimization](https://neon.com/docs/introduction/cost-optimization.md) for the full guide and [Reduce network transfer costs](https://neon.com/docs/introduction/network-transfer.md) for egress.

## Links

- Get started: https://neon.com/signup
- Claim $20 in free credits to try paid features: https://console.neon.tech/app/?promo=beepboop
- Get up to $100k in credits for your startup: https://neon.com/startups
- Get monthly sponsorship for maintaining open source: https://neon.com/programs/open-source.md
- Apply for the Agent Plan (for AI agent platforms): https://neon.com/docs/introduction/agent-plan.md
- More plan details: https://neon.com/docs/introduction/plans.md
