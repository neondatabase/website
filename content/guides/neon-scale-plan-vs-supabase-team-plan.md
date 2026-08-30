---
title: Neon Scale Plan vs Supabase Team Plan - Aug 2026
subtitle: Compare the production plans for scaling a business on larger workloads
author: neon-team
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
---

<Admonition type="note">
Pricing and feature claims in this guide were verified against the live Neon and Supabase documentation on August 13, 2026, and the headline plan and pricing figures were re-checked on August 21, 2026. Confirm the [Neon pricing](/pricing) and [Supabase pricing](https://supabase.com/pricing) pages before making a decision.
</Admonition>

This comparison is for established production workloads: higher capacity, read scaling, recovery guarantees, compliance controls, and support commitments across the whole backend, services included. For the service-by-service comparison, start with [Neon vs Supabase](/guides/neon-vs-supabase).

The plans at this stage are Neon's Scale plan and Supabase's Team plan, and the structural differences compound with scale. Team starts at $599/month before any compute; Scale has no monthly minimum ([source](/docs/introduction/plans), [Supabase pricing](https://supabase.com/pricing)). Capacity works differently: Neon autoscales in place, and fleet data shows production databases using 2.4x less compute under autoscaling than the same workloads provisioned at P99.5 + 20% ([autoscaling report](/autoscaling-report)), while a Supabase instance is provisioned for peak and resized by hand with brief downtime ([source](https://supabase.com/docs/guides/platform/compute-and-disk#compute-upgrades)). Read replicas share the primary's storage on Neon and bill only their compute hours; each Supabase replica bills a full instance plus a disk 1.25x the primary's ([source](/docs/introduction/read-replicas), [Supabase replicas](https://supabase.com/docs/guides/platform/manage-your-usage/read-replicas)). Instant restore reaches any point up to 30 days back on Scale; Team includes daily backups, with point-in-time recovery a $100 per month per 7 days add-on ([source](/docs/introduction/branch-restore), [Supabase pricing](https://supabase.com/pricing)). An uptime SLA is included on Scale; Supabase's pricing page lists SLAs under Enterprise only ([source](/docs/introduction/plans#support), [Supabase pricing](https://supabase.com/pricing)). The Team plan's strongest remaining argument is its wired-in suite, Realtime, Cron, and Queues, if your architecture depends on them.

At this level the headline price matters less than how capacity growth, replicas, recovery windows, audits, and the service bill behave, so this guide compares those mechanics directly and closes with how to model a representative month.

## Production plan comparison

| Dimension        | Neon Scale plan                                                                                          | Supabase Team plan                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Base price       | No monthly minimum; pay for usage                                                                        | $599 per month, plus hourly per-project compute (with a $10 monthly credit)                                         |
| Database compute | Lakebase Postgres: $0.222 per CU-hour; autoscaling up to 16 CU, or fixed sizes up to 56 CU (≈224 GB RAM) | Traditional Postgres: per-project instances from Micro through 16XL (64 cores, 256 GB RAM); custom sizes above that |
| Database storage | $0.35 per GB-month; no fixed per-branch size limit (adjustable project quota)                            | 8 GB disk included per project, then $0.125 per GB; disks up to 60 TB                                               |
| Auth             | Managed Better Auth, up to 1M MAU, increases on request                                                  | 100,000 MAU included, then $0.00325 per MAU                                                                         |
| Data API         | PostgREST-compatible REST API                                                                            | REST plus GraphQL                                                                                                   |
| Functions        | Included, with usage limits                                                                              | 2M Edge Function invocations included, then $2 per million                                                          |
| File storage     | Object Storage included, with usage limits                                                               | 100 GB included, then $0.0213 per GB                                                                                |
| Realtime         | Not offered as a managed service                                                                         | Managed Broadcast, Presence, and Postgres Changes                                                                   |
| Jobs and cron    | `pg_cron` available; only runs with active compute; managed jobs planned                                 | Managed Cron and Queues, built on `pg_cron` and `pgmq`                                                              |
| AI Gateway       | Models from multiple providers via one credential; inference free during beta, then provider list prices | Not currently offered                                                                                               |
| Projects         | 1,000, increases on request; idle projects consume no compute                                            | First project included; additional projects from $10/month each, billed as hourly compute                           |
| Scale-to-zero    | Configurable from 1 minute to always-on                                                                  | Not applicable; instances run continuously                                                                          |
| Recovery         | Instant restore with a history window up to 30 days; scheduled snapshots                                 | Daily backups retained 14 days; point-in-time recovery add-on at $100 per month per 7 days                          |
| Compliance       | SOC 2, SOC 3, ISO 27001, ISO 27701, GDPR, CCPA; HIPAA at additional charge                               | SOC 2 and ISO 27001; HIPAA as a paid add-on                                                                         |
| Uptime SLA       | Included                                                                                                 | Not included (Enterprise plan only)                                                                                 |
| Support          | Standard included; Business and Production tiers available                                               | Priority email support and SLAs                                                                                     |

Sources: [Neon plans](/docs/introduction/plans); [Supabase pricing](https://supabase.com/pricing), [compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk).

## Serverless vs fixed capacity

The core difference at this stage is how capacity works.

The Neon Scale plan is serverless. Lakebase Postgres autoscales up to 16 CU (≈64 GB RAM) or runs fixed computes up to 56 CU (≈224 GB RAM), with scale-to-zero configurable from 1 minute to always-on ([source](/docs/introduction/plans#autoscaling)). Scaling happens in place, without a restart ([source](/docs/introduction/autoscaling)). Pooled connections reach 10,000 per compute through PgBouncer ([source](/docs/connect/connection-pooling)). Auth, Functions, Object Storage, and AI Gateway are built on the same base.

The Supabase Team plan is fixed capacity. Each project runs a traditional Postgres instance you size yourself, up to a 16XL with 64 cores and 256 GB RAM, custom sizes above that, with its service suite (Auth, Storage, Realtime, Edge Functions, Cron, Queues) wired to the project ([source](https://supabase.com/docs/guides/platform/compute-and-disk)). Disk IOPS and throughput are provisioned independently, and instances 4XL and above are built for sustained high disk performance. Changing size is manual, with usually under two minutes of downtime ([source](https://supabase.com/docs/guides/platform/compute-and-disk#compute-upgrades)).

There are two constraints from Supabase's instance model. Connections: limits scale with instance size, from 60 direct and 200 pooler clients on Micro to 500 and 12,000 on 16XL, so you may end up resizing for connections rather than CPU ([source](https://supabase.com/docs/guides/platform/compute-and-disk#limits-and-constraints)). Disk: it only grows, you can increase size but not decrease it, and at most four disk changes are allowed in a rolling 24-hour window ([source](https://supabase.com/docs/guides/platform/compute-and-disk)). On Neon, the pooled connection limit doesn't depend on compute size, and there's no disk to manage; storage bills on data plus retained history ([source](/docs/introduction/plans#storage)).

In short: on Neon, capacity adjusts on its own within a range; on Supabase, capacity is a decision you revisit as load grows, with a maintenance window per change. Neon's fleet data quantifies the difference: production databases use 2.4x less compute under autoscaling than the same workloads provisioned at P99.5 + 20%, and the average workload would exceed even that provisioned capacity about 55 times a month ([autoscaling report](/autoscaling-report)).

## Read scaling

The two replica models cost and operate differently.

<InlineSvg src="/docs/guides/neon-vs-supabase-read-replicas.svg" title="Neon read replicas are extra computes reading from the same shared storage as the primary, while Supabase read replicas are separate database instances with their own replicated disk" />

[Neon read replicas](/docs/introduction/read-replicas) are additional computes that read from the same durable storage as the primary. No data is copied, so creating one takes a few seconds and adds no storage cost; you pay only its CU-hours. Each replica sizes and autoscales independently of the primary and can suspend when idle, so a reporting replica that runs one hour a day bills for one hour a day.

[Supabase read replicas](https://supabase.com/docs/guides/platform/read-replicas) are separate databases kept in sync by physical replication. Each replica runs on the same compute size as the primary and carries a disk 1.25x the primary's size, and you're billed for both; compute credits don't apply ([source](https://supabase.com/docs/guides/platform/manage-your-usage/read-replicas)). A Large primary with two replicas therefore bills three Large instances plus replica disks, and replicas follow the primary's size when you resize.

## Recovery

The Neon Scale plan supports [instant restore](/docs/introduction/branch-restore) to any point in a history window up to 30 days ($0.20 per GB-month of retained change history), and you can branch from a past point in time to inspect data before committing to a restore. Scheduled [snapshots](/docs/introduction/plans#snapshots) ($0.09/GB-month) cover longer-term backups.

The Supabase Team plan includes daily backups retained for 14 days, with point-in-time recovery as an add-on at $100 per month per 7 days of retention ([source](https://supabase.com/pricing)). Without the add-on, recovery granularity is the daily backup.

Be specific when you compare: "any point in the last 30 days" and "each of the last 14 days, or any point with the PITR add-on" are different guarantees at different prices. Recovery also covers more than the database: on Neon, storage namespaces and auth data belong to the branch; on Supabase, Storage objects and Auth data are separate project resources. Rehearse restoring the whole backend: database, files, and auth data.

## Compliance, access controls, and support

The Neon Scale plan's certifications cover SOC 2, SOC 3, ISO 27001, ISO 27701, GDPR, and CCPA, with [HIPAA](/docs/security/hipaa) at additional charge. Access controls include IP Allow and [Private Networking](/docs/guides/neon-private-networking) over AWS PrivateLink, and metrics and Postgres logs export to Datadog or any OTel-compatible platform ([source](/docs/introduction/plans#compliance-and-security)). An uptime SLA is included; support is Standard by default with Business and Production tiers above it ([source](/docs/introduction/plans#support)).

The Supabase Team plan includes SOC 2 and ISO 27001, HIPAA as a paid add-on, SSO for the dashboard, and priority email support with SLAs; its pricing page lists the uptime SLA under Enterprise ([source](https://supabase.com/pricing)). Network restrictions and log drains are available on the platform side ([source](https://supabase.com/docs/guides/platform/network-restrictions)). PrivateLink for private VPC connectivity is available on Team and Enterprise ([source](https://supabase.com/docs/guides/platform/privatelink)). Note what Supabase's Pro-to-Team step buys: certifications, dashboard SSO, longer backup retention, and support, not capacity. Headline quotas like the 100,000 included MAU stay the same, so the move is usually triggered by a customer security review rather than by load ([source](https://supabase.com/pricing)).

If an audit is on your calendar, ask both vendors for current certification reports; pricing pages summarize, and auditors want the reports themselves.

## Fleets and tenant isolation

Businesses at this stage often isolate customers into separate backends. The Neon Scale plan allows 1,000 projects (more on request), and idle projects consume no compute, so a long tail of quiet tenants costs storage only ([source](/docs/introduction/plans#projects)). Each tenant backend can have its own branches, auth, and storage namespace. On Supabase, each tenant project is a continuously billed instance ([source](https://supabase.com/docs/guides/platform/manage-your-usage/compute)); that works for tens of active tenants but adds up fast for a long tail. If backend-per-tenant is your architecture, model this line item first; it will likely dominate the comparison.

## Modeling a month

Before committing, price one realistic month end to end on Neon and on Supabase:

1. Primary database compute at your actual duty cycle, not peak capacity for 730 hours unless you truly run there.
2. Replica compute, using the replica rules above.
3. Storage and disk, including replica disks on Supabase and change-history retention on Neon.
4. Auth at your real MAU. Beyond 100,000 MAU, Supabase bills $0.00325 per MAU; Neon includes up to 1M with increases on request.
5. Service usage: Realtime messages and peak concurrent connections, function invocations, and file storage on Supabase's meters; on Neon, Functions and Object Storage are included with usage limits, so check your volumes against the current limits.
6. Network transfer at your egress volume (Neon includes 500 GB per project, then $0.10/GB; Supabase pools 250 GB across the organization, then $0.09/GB). For private networking, Neon meters transfer at $0.01/GB; Supabase's PrivateLink has no published rate, so private egress appears to bill at the standard $0.09/GB (confirm with Supabase).
7. Recovery add-ons, branches, support tiers, and compliance line items your contracts require.

Two worked months below, using the representative workloads from the [Neon pricing FAQ](/pricing#workload-cost-estimates) and Supabase's [compute price list](https://supabase.com/docs/guides/platform/compute-and-disk), priced August 13, 2026. Beyond the production database, each adds what a business actually runs: point-in-time recovery, three non-production environments (dev, staging, test), egress, and function usage, with the assumption stated in each row. A Neon CU is ≈1 vCPU and 4 GB RAM; a fixed instance doesn't resize with load, so it's provisioned once at the size that clears the workload's peak with headroom. Replicas, auth MAU, and Realtime usage from the checklist apply on top of both.

**High Load: sustained production traffic.** 3,000 CU-hours, 100 GB of data, scaling between 3 and 7 CU.

| Line item              | Neon Scale plan                                                 | Supabase Team plan                                 |
| ---------------------- | --------------------------------------------------------------- | -------------------------------------------------- |
| Base fee               | $0                                                              | $599 (includes a $10 compute credit)               |
| Production database    | $666 (3,000 CU-hours at $0.222)                                 | $410 (2XL ≈ 8 CU, clears the 7 CU peak, all month) |
| Database storage       | $35 (100 GB at $0.35/GB-month)                                  | $11.50 (92 GB beyond the included disk)            |
| Point-in-time recovery | $10 (7-day instant restore history, ~50 GB of changes retained) | $100 (PITR add-on, 7-day retention)                |
| Dev, staging, test     | ~$15 (3 branches, scale to zero, ~60 CU-hours plus divergence)  | ~$30 (3 Micro instances, running continuously)     |
| Egress (300 GB)        | $0 (500 GB included)                                            | $4.50 (50 GB over the included 250 GB)             |
| Functions (5M calls)   | $0 (included, with usage limits)                                | $6 (3M over the included 2M)                       |
| **Total**              | **~$725/month**                                                 | **~$1,150/month**                                  |

![The High Load workload over a month, scaling between 3 and 7 CU with sustained traffic](/images/pricing/3000-CU-Hours.webp)

![The same workload on a fixed Supabase 2XL instance, with 8 CU of capacity billed for all 730 hours](/images/pricing/3000-CU-Hours-supabase.webp)

**XL Load: large-scale production.** 6,000 CU-hours, 1,000 GB of data, scaling between 6 and 14 CU.

| Line item              | Neon Scale plan                                                  | Supabase Team plan                                   |
| ---------------------- | ---------------------------------------------------------------- | ---------------------------------------------------- |
| Base fee               | $0                                                               | $599 (includes a $10 compute credit)                 |
| Production database    | $1,332 (6,000 CU-hours at $0.222)                                | $960 (4XL ≈ 16 CU, clears the 14 CU peak, all month) |
| Database storage       | $350 (1 TB at $0.35/GB-month)                                    | $124 (992 GB beyond the included disk)               |
| Point-in-time recovery | $40 (7-day instant restore history, ~200 GB of changes retained) | $100 (PITR add-on, 7-day retention)                  |
| Dev, staging, test     | ~$40 (3 branches, scale to zero, ~150 CU-hours plus divergence)  | ~$45 (3 Small instances, running continuously)       |
| Egress (800 GB)        | $30 (300 GB over the included 500 GB)                            | $49.50 (550 GB over the included 250 GB)             |
| Functions (5M calls)   | $0 (included, with usage limits)                                 | $6 (3M over the included 2M)                         |
| **Total**              | **~$1,790/month**                                                | **~$1,875/month**                                    |

![The XL Load workload over a month, scaling between 6 and 14 CU](/images/pricing/6000-CU-Hours.webp)

![The same workload on a fixed Supabase 4XL instance, with 16 CU of capacity billed for all 730 hours](/images/pricing/6000-CU-Hours-supabase.webp)

The database lines are close at the XL scale; the gap comes from everything around production. On Neon, quiet nights bill at their actual size, non-production branches bill only when they run, and instant restore bills for the history it keeps. The fixed model bills full capacity and flat add-ons around the clock.

<Callout title="How to choose">
**Pick Neon** when elastic compute, shared-storage read replicas, backend-per-tenant fleets, or branch-based environments are central to your architecture, when your MAU count is large, or when your audit list matches its certifications. **Pick Supabase** when you're committed to the instance-per-project model and its wired-in suite, especially Realtime, Cron, and Queues, and provisioned capacity you resize by hand fits how you operate.
</Callout>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Platform comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-vs-supabase-free-plan" title="Prototyping and vibe coding" description="Compare Neon Free and Supabase Free" icon="code">Stage 1: Prototyping</a>
<a href="/guides/neon-launch-plan-vs-supabase-pro-plan" title="MVP and startup" description="Compare the Neon Launch and Supabase Pro plans" icon="wallet">Stage 2: MVP and startup</a>
</DetailIconCards>

<NeedHelp/>
