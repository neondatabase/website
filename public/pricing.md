# Neon Pricing Plans

> Serverless Postgres with three plans: Free, Launch, and Scale. Pay only for what you use on paid plans; no monthly minimum.

## How billing works

Paid plans are pay-as-you-go: usage is metered hourly and billed at the end of the month, with no monthly minimum. Plans apply per **organization**, and one Neon account can belong to multiple orgs on different plans. The Free plan is permanent (not a trial); no credit card required.

| Unit              | Meaning                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| CU (Compute Unit) | ~4 GB RAM + CPU + SSD.                                                                                  |
| CU-hour           | `compute size × hours running`. 0.25 CU × 4 hours = 1 CU-hour. Suspended (scaled-to-zero) compute = $0. |
| GB-month          | Storage, metered hourly.                                                                                |
| branch-month      | Extra branch kept for one month. Prorated hourly.                                                       |

Compute suspends automatically after inactivity (**scale-to-zero**); no CU-hours accrue while suspended. Always on for Free; configurable on Launch and Scale.

Invoices under $0.50 are not collected.

## Plans at a glance

| Feature                          | Free                                       | Launch                               | Scale                                                            |
| -------------------------------- | ------------------------------------------ | ------------------------------------ | ---------------------------------------------------------------- |
| Price                            | $0/month                                   | Pay for what you use                 | Pay for what you use                                             |
| Who it's for                     | Prototypes, side projects, and small teams | Startups and growing teams           | Production-grade workloads and larger companies                  |
| Organization members             | Unlimited                                  | Unlimited                            | Unlimited                                                        |
| Projects                         | 100                                        | 100                                  | 1,000 (can be increased on request)                              |
| Branches per project             | 10                                         | 10                                   | 25                                                               |
| Extra branches                   | -                                          | $1.50/branch-month (prorated hourly) | $1.50/branch-month (prorated hourly)                             |
| Compute                          | 100 CU-hours/project                       | $0.106/CU-hour                       | $0.222/CU-hour                                                   |
| Autoscaling                      | Up to 2 CU (8 GB RAM)                      | Up to 16 CU (64 GB RAM)              | Up to 16 CU autoscaling, or fixed sizes up to 56 CU (224 GB RAM) |
| Scale to zero                    | After 5 min                                | After 5 min, can be disabled         | Configurable (1 minute to always on)                             |
| Storage                          | 0.5 GB/project                             | $0.35/GB-month                       | $0.35/GB-month                                                   |
| Instant restore                  | -                                          | $0.20/GB-month                       | $0.20/GB-month                                                   |
| Restore window                   | 6 hours (1 GB limit)                       | Up to 7 days                         | Up to 30 days                                                    |
| Snapshots (manual)               | 1                                          | 10                                   | 10                                                               |
| Snapshots (scheduled)            | -                                          | Yes                                  | Yes                                                              |
| Public network transfer (egress) | 5 GB included                              | 100 GB included, then $0.10/GB       | 100 GB included, then $0.10/GB                                   |
| Private network transfer         | -                                          | -                                    | $0.01/GB                                                         |
| Auth (MAU)                       | Up to 60k MAU                              | Up to 1M MAU                         | Up to 1M MAU                                                     |
| Monitoring retention             | 1 day                                      | 3 days                               | 14 days                                                          |
| Metrics/logs export              | -                                          | -                                    | Yes                                                              |
| Set spending limits              | -                                          | Yes                                  | Yes                                                              |
| Protected branches               | -                                          | Yes                                  | Yes                                                              |
| IP Allow rules                   | -                                          | -                                    | Yes                                                              |
| Private Networking               | -                                          | -                                    | Yes                                                              |
| HIPAA                            | -                                          | -                                    | Available                                                        |
| SOC 2                            | -                                          | -                                    | Available                                                        |
| Uptime SLA                       | -                                          | -                                    | Yes                                                              |
| Support                          | Community                                  | Billing support                      | Standard, Business, or Production                                |

A "-" means the feature is not available on that plan.

All plans include: multi-AZ storage, autoscaling, database branching, read replicas, connection pooling, Postgres extensions (pgvector, PostGIS, TimescaleDB, and more), full management API and CLI, and a Data API for querying over HTTP.

## Table clarifications

- **Branches** are capped at 5,000 per project on paid plans (10/25 included). Free is capped at 10 per project.
- **Instant restore** is charged only on root branches; child branches don't add to this charge.
- **Storage on child branches** uses copy-on-write: they start at $0 and grow with writes on that branch, capped at the branch's data size. Root branches are billed on their full data size.
- **Snapshots** are billed at $0.09/GB-month for both manual and scheduled storage. The table figures are per-project count limits, not free allowances. Scheduled snapshots don't count against the manual limit.
- **Read replicas** are separate computes and count toward CU-hours.
- **Auth (MAU)** can scale beyond 1M; contact Neon for higher limits.
- **Private Networking** ($0.01/GB on Scale) counts traffic in **both directions**.
- **HIPAA** is self-serve on Scale (BAA required), currently at no additional cost. See [HIPAA](https://neon.com/docs/security/hipaa.md) for details.

See [Plans](https://neon.com/docs/introduction/plans.md) for full details.

## Common questions

### How can I try Neon without signing up?

Use [Claimable Postgres](https://neon.new/) for an instant database, with no signup and no card. Run `npx neon-new --yes` (or the [API](https://neon.com/docs/reference/claimable-postgres.md)) to provision Postgres that lasts 72 hours. Claim it to a Neon account before expiration to keep it.

### What is a project?

Your top-level container: primary database, branches, compute. Like a Git repo, with one project and many branches. Projects belong to **organizations**, where plans and billing apply.

### How are extra branches billed?

Branches above your plan's allowance (10 included on Free/Launch, 25 on Scale) are billed at $1.50/branch-month, prorated hourly (~$0.002/hour). Example: 2 extra branches kept for 5 hours each = 10 branch-hours × $0.002 = $0.02.

### What happens when I hit Free plan limits?

Hitting any Free monthly limit (100 CU-hours, 0.5 GB storage, 5 GB egress) suspends compute until the next billing month. Upgrade to Launch or Scale to resume immediately.

### How can I control my costs?

| Action                                                                                           | Effect                                  |
| ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| Cap autoscaling per compute                                                                      | Hard ceiling on compute spend           |
| Keep scale-to-zero on for non-prod                                                               | Idle compute = $0                       |
| Delete unused branches, or set TTL                                                               | Saves $1.50/branch-month each           |
| Shorten the restore window                                                                       | Saves $0.20/GB-month on restore storage |
| Org-level [spending limits](https://neon.com/docs/introduction/spending-limit.md) (Launch/Scale) | Email alerts at 80% and 100%            |

See [Cost optimization](https://neon.com/docs/introduction/cost-optimization.md) for the full guide and [Reduce network transfer costs](https://neon.com/docs/introduction/network-transfer.md) for egress.

## Links

- Get started: https://neon.com/signup
- Full plan details: https://neon.com/docs/introduction/plans.md
- Open Source Program: https://neon.com/programs/open-source.md
- Agent Plan (for AI agent platforms): https://neon.com/docs/introduction/agent-plan.md
- Startup credits: https://neon.com/startups
