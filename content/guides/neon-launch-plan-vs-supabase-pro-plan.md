---
title: Neon Launch Plan vs Supabase Pro Plan - Aug 2026
subtitle: Compare the entry-level paid plans for launching small production apps
author: neon-team
excludeFromBlog: true
enableTableOfContents: true
createdAt: '2026-07-15T00:00:00.000Z'
---

<Admonition type="note">
Pricing and feature claims in this guide were verified against the live Neon and Supabase documentation on August 13, 2026. Confirm the [Neon pricing](/pricing) and [Supabase pricing](https://supabase.com/pricing) pages before making a decision.
</Admonition>

This comparison is for a small team launching an MVP: real users signing in, uploading files, and hitting your API, with cost sensitivity and not much time for infrastructure work. For the service-by-service comparison, start with [Neon vs Supabase](/guides/neon-vs-supabase).

The entry-level paid plans are Neon's Launch plan and Supabase's Pro plan. They differ less in individual rates than in shape: Neon meters the backend with no monthly minimum, while Supabase Pro is a $25/month subscription that bundles service quotas plus hourly compute per project. This guide compares what each plan includes across the backend, works through what three common app shapes cost, and covers the production features a launch depends on.

## Paid entry plan comparison

| Dimension                 | Neon Launch plan                                                                                            | Supabase Pro plan                                                                                                                        |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Base price                | No monthly minimum; pay for usage                                                                           | $25 per month, including a $10 monthly compute credit                                                                                    |
| Projects                  | 100 included; idle projects consume no compute                                                              | First project included; additional projects from $10/month each, billed as hourly compute                                                |
| Database compute          | Lakebase Postgres: $0.106 per CU-hour; autoscaling up to 16 CU (≈64 GB RAM); scale-to-zero optional         | Traditional Postgres: fixed instance per project, from Micro (~$10/month, 1 GB RAM) through 16XL; resizing is manual with brief downtime |
| Database storage          | $0.35 per GB-month                                                                                          | 8 GB disk per project included, then $0.125 per GB                                                                                       |
| Auth                      | Managed Better Auth, up to 1M MAU included                                                                  | 100,000 MAU included, then $0.00325 per MAU                                                                                              |
| Data API                  | PostgREST-compatible REST API                                                                               | REST plus GraphQL                                                                                                                        |
| Functions                 | Included, with usage limits                                                                                 | 2M Edge Function invocations included, then $2 per million                                                                               |
| File storage              | Object Storage included, with usage limits                                                                  | 100 GB included, then $0.0213 per GB                                                                                                     |
| Realtime                  | Not offered as a managed service                                                                            | 5M messages and 500 concurrent connections included                                                                                      |
| Jobs and cron             | `pg_cron` available; only runs with active compute; managed jobs planned                                    | Managed Cron and Queues, built on `pg_cron` and `pgmq`                                                                                   |
| AI Gateway                | Models from multiple providers via one credential; inference free during beta, then provider list prices    | Not currently offered                                                                                                                    |
| Network transfer (egress) | 500 GB per project included, then $0.10/GB                                                                  | 250 GB pooled across the organization, then $0.09/GB                                                                                     |
| Branches                  | 10 included per project; each extra branch $1.50/branch-month (~$0.002/hr), plus compute only while it runs | None included; each branch runs as its own instance billed hourly, from $0.01344/hr (~$10/month) on Micro compute                        |
| Recovery                  | Instant restore up to 7 days ($0.20/GB-month of history); 100 manual snapshots                              | Daily backups retained 7 days; point-in-time recovery is an add-on at $100 per month per 7 days                                          |

Sources: [Neon plans](/docs/introduction/plans); [Supabase pricing](https://supabase.com/pricing), [compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute), [branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching).

## Cost scenarios

The database workloads below are the representative examples from the [Neon pricing FAQ](/pricing#workload-cost-estimates), priced on both sides on August 13, 2026: Neon at Launch plan rates, Supabase from its [compute price list](https://supabase.com/docs/guides/platform/compute-and-disk) plus the Pro base. The numbers cover database compute and storage; at these sizes, auth, files, and function usage sit inside both sides' included quotas unless noted. One translation matters: a Neon CU is ≈1 vCPU and 4 GB RAM and autoscales, while a Supabase instance is fixed. You don't resize a fixed instance with load; you provision one size, roughly 20% above what the workload demands, and keep it all month, so each scenario prices the size that clears the workload with headroom. That's the same provisioned baseline Neon's [autoscaling report](/autoscaling-report) measures against (P99.5 + 20%), where fleet data shows autoscaling using 2.4x less compute for the same workloads. Model your own workload before deciding; these examples show how the two billing shapes behave, not what your bill will be.

**Intermittent Load: a small database that doesn't run 24/7.** 140 CU-hours, 1 GB of data. Runs at 0.25 CU, scales to 2 CU when needed, scales to zero when idle.

- **Neon: about $15/month.** 140 CU-hours ($14.84) plus 1 GB of storage ($0.35).
- **Supabase: about $30/month.** A Small (2 GB ≈ 0.5 CU, ~$15) covers the 0.25 CU floor with headroom; the two brief 2 CU bursts in the month are capped. Base plus the $5 over the credit: about $30.

![The Intermittent Load workload over a month, autoscaling between 0.25 and 2 CU and scaling to zero when idle](/images/pricing/140-CU-Hours.webp)

![The same workload on a fixed Supabase Small instance, where the brief bursts above its 0.5 CU capacity are capped](/images/pricing/140-CU-Hours-supabase.webp)

The gap is what idle time costs: Neon bills the hours the database runs; a fixed instance bills the month.

**Low Load: a small database that runs 24/7.** 190 CU-hours, 5 GB of data. Scale-to-zero disabled, mostly at the 0.25 CU floor.

- **Neon: about $22/month.** 190 CU-hours ($20.14) plus 5 GB of storage ($1.75).
- **Supabase: about $30/month.** A Small (2 GB ≈ 0.5 CU, ~$15) runs ~20% above the 0.25 CU floor, with the occasional spike capped; 5 GB fits the included disk. Base plus the $5 over the credit: about $30.

![The Low Load workload over a month, always on at the 0.25 CU floor with occasional small peaks](/images/pricing/190-CU-Hours.webp)

![The same workload on a fixed Supabase Small instance, where the occasional demand spike above its 0.5 CU capacity is capped](/images/pricing/190-CU-Hours-supabase.webp)

For a small always-on database the prices are nearly the same. The difference at this size is behavior: autoscaling headroom against a fixed instance.

**Medium Load: a constant-load application database.** 720 CU-hours, 10 GB of data. Scales between 0.5 and 4 CU with load.

- **Neon: about $80/month.** 720 CU-hours ($76.32) plus 10 GB of storage ($3.50), peaks included.
- **Supabase: about $225/month.** An XL (16 GB ≈ 4 CU, ~$210) is the smallest size that clears the 4 CU peaks. With the base and credit: about $225.

![The Medium Load workload over a month, scaling between 0.5 and 4 CU with load](/images/pricing/720-CU-Hours.webp)

![The same workload on a fixed Supabase XL instance, with 4 CU of capacity billed for all 730 hours](/images/pricing/720-CU-Hours-supabase.webp)

Autoscaling pays near the average while still serving the peak; a fixed instance pays for peak capacity all month. And if this app also carries 150,000 MAU, auth adds $162.50 on Supabase (100,000 included, then $0.00325 per MAU) while staying inside Neon's 1M allowance ([MAU pricing](https://supabase.com/pricing)).

**A fleet of small backends.** Not in the pricing FAQ, but common at this stage: 10 low-traffic tenant or staging backends, each active an hour a day at 0.25 CU with 1 GB of data.

- **Neon: about $11.50/month total.** ~75 CU-hours ($7.95) plus 10 GB of storage ($3.50).
- **Supabase: about $115/month.** The subscription is per organization, but compute is per project, so each backend adds its own hourly instance: 10 always-running Micros (~$100), minus the $10 credit, plus the base ([source](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).

This split, flat subscription plus per-project compute, is the most common Supabase billing surprise, and it grows with every backend you add. For a full worked bill including recovery, non-production environments, egress, and functions, see [the scaling guide's cost model](/guides/neon-scale-plan-vs-supabase-team-plan#modeling-a-month).

**Network transfer (egress).** Neon includes 500 GB [per project](/docs/introduction/plans#public-network-transfer) and no base fee, then $0.10/GB. Supabase includes 250 GB [pooled across the organization](https://supabase.com/docs/guides/platform/manage-your-usage/egress) on top of the $25/month base, then $0.09/GB. For one project the two are equal near 5,250 GB/month ($475): below that Neon is cheaper (no base fee), above it Supabase is (a cent less per GB), and Neon's per-project allowance pushes the crossover higher as you add projects. Supabase's separate cached CDN egress rate ($0.03/GB) applies to object storage delivery, not database traffic.

The scenarios cut both ways. If your app uses Realtime or heavy function traffic, Supabase's included quotas replace a service you'd otherwise buy, which the Neon column can't show. Price your whole application, not just the database.

## Production readiness

**Recovery.** Neon includes [instant restore](/docs/introduction/branch-restore) to any point in a configurable window up to 7 days ($0.20 per GB-month of history), plus [snapshots](/docs/introduction/plans#snapshots) for scheduled backups. Supabase includes daily backups retained for 7 days, with point-in-time recovery an add-on at $100 per month per 7 days ([source](https://supabase.com/pricing)). If fine-grained recovery matters at your stage, price it in explicitly.

**Availability behaviors.** On Neon you can disable scale-to-zero so compute never suspends, and autoscaling absorbs spikes without a restart, with pooled connections up to 10,000 per compute ([source](/docs/introduction/autoscaling), [pooling](/docs/connect/connection-pooling)). On Supabase the instance is always on; absorbing growth means a manual resize with usually under two minutes of downtime, and connection headroom rises only when the instance does: a Micro allows 60 direct connections and 200 pooled clients, so a launch-day spike can hit the connection cap before it touches CPU ([source](https://supabase.com/docs/guides/platform/compute-and-disk)).

**Cost controls.** Supabase's spend cap stops overage charges for covered items: once a quota is exceeded, further usage of that item is disallowed until the next billing cycle. Compute, branching, read replicas, and point-in-time recovery sit outside the cap, so those lines still grow with use ([source](https://supabase.com/docs/guides/platform/cost-control)). Decide which failure you prefer at quota: a blocked service or a bigger bill. On Neon there are no quotas to hit; the equivalent control is configuring autoscaling and scale-to-zero limits so compute spend has a ceiling ([source](/docs/introduction/autoscaling)).

**Guardrails.** Neon includes [protected branches](/docs/guides/protected-branches) for production data. On Supabase, RLS is itself a launch guardrail: clients reach the database directly, so auth protects your data only when every exposed table has a correct RLS policy, and the production checklist requires RLS on all tables ([source](https://supabase.com/docs/guides/deployment/going-into-prod)). Neon's Data API applies the same Postgres roles and RLS model if you expose tables directly ([source](/docs/data-api/access-control)); auth alone runs through Better Auth sessions without RLS.

## Preview environments

Most launching teams want a full environment per pull request: database, auth, files, and functions together. On Neon, a branch clones the backend: data, auth users, storage namespace, and function deployments, copy-on-write, with 10 branches included and `neon deploy` applying your [`neon.ts`](/docs/reference/neon-ts) config per branch. Previews come up with production-shaped data in seconds ([source](/docs/introduction/branching)). On Supabase, a preview branch rebuilds the full service stack from migrations and seed files, billed per hour of branch compute; every PR exercises your migration history against a clean stack, and production data stays out of previews by default ([source](https://supabase.com/docs/guides/deployment/branching)). Both integrate with GitHub and Vercel preview flows.

<Callout title="How to choose">
**Pick Neon** when demand is idle or bursty, you run many backends (tenants, previews, staging), your user count could pass a 100,000-MAU quota, or you want the bill to track usage. **Pick Supabase** when you're building in the classic backendless pattern, the client on Supabase SDKs with access governed by RLS and Realtime in use, and you want one flat number.
</Callout>

## Continue the comparison

<DetailIconCards>
<a href="/guides/neon-vs-supabase" title="Platform comparison" description="Compare the two backends service by service" icon="database">Neon vs Supabase overview</a>
<a href="/guides/neon-vs-supabase-free-plan" title="Prototyping and vibe coding" description="Compare Neon Free and Supabase Free" icon="code">Stage 1: Prototyping</a>
<a href="/guides/neon-scale-plan-vs-supabase-team-plan" title="Scaling a business" description="Compare capacity, compliance, recovery, and read scaling" icon="scale-up">Stage 3: Scaling</a>
</DetailIconCards>

<NeedHelp/>
