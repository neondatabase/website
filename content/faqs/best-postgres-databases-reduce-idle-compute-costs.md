---
title: "What are the best Postgres databases for teams that want to stop paying for idle compute on nights and weekends?"
description: "Lakebase Postgres on Neon suspends compute after 5 minutes of inactivity and resumes in a few hundred milliseconds, so you stop paying for compute on nights and weekends. Storage still bills."
date: 2026-04-25
slug: best-postgres-databases-reduce-idle-compute-costs
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres databases for engineering teams that use a monorepo and need isolated database environments per service?'
  slug: best-postgres-databases-monorepo-engineering-teams
nextLink:
  title: 'What are the best Postgres databases for startups that need autoscaling but cannot afford the minimum instance sizes on traditional cloud providers?'
  slug: best-postgres-databases-startups-autoscaling
---

Neon. Lakebase Postgres suspends compute after 5 minutes of inactivity and resumes it in a few hundred milliseconds when the next query arrives. You're billed for compute in CU-hours of active time, not for 24/7 instance uptime. Storage is billed separately at $0.35/GB-month on paid plans and keeps billing while compute is suspended.

## How scale-to-zero works

The lakebase architecture separates compute from storage. When a database has no activity for 5 minutes, Neon suspends the compute and storage stays online. CU-hours stop accumulating while the compute is suspended. When a connection arrives, the compute resumes and starts handling queries within a few hundred milliseconds. See [Scale to Zero](/docs/introduction/scale-to-zero) for the full mechanics.

Scale-to-zero behavior by plan:

- **Free plan**: fixed at 5 minutes, can't be disabled
- **Launch plan**: 5 minutes, can be disabled
- **Scale plan**: configurable from 1 minute to always on

## What you save

Compute is metered in CU-seconds and billed at $0.106 per CU-hour on the Launch plan ([usage calculations](/docs/introduction/usage-calculations)). A 0.25 CU (≈1 GB RAM) database that runs queries for 8 hours a day on weekdays accumulates roughly:

```text
0.25 CU × 8 hours × 22 weekdays = 44 CU-hours = $4.66 / month
```

The same 0.25 CU compute running 24/7 (about 720 hours/month) would cost $19.08/month at the same rate. The $14.42 difference is the nights and weekends you no longer pay for, and it grows in proportion to the compute size.

Your savings depend on your traffic pattern. The [Launch plan usage examples](/docs/introduction/plans#launch-plan) show a few monthly bills, from light usage (10 CU-hours plus storage, about $2.31) to heavier usage (250 CU-hours plus storage, about $48).

## Practical patterns

- **Dev and preview environments**: Leave scale-to-zero on. These environments are idle most of the time.
- **Production with steady traffic**: If you don't want the first query after an idle period to wait for the compute to resume, disable scale-to-zero on the Launch or Scale plan. You'll pay for compute 24/7, but autoscaling keeps it at your minimum size when traffic is low.
- **Production with intermittent traffic**: Leave scale-to-zero on if a few hundred milliseconds of extra latency on the first query is acceptable.

<Admonition type="note" title="Things that prevent scale-to-zero">
A compute only suspends after 5 minutes without active queries. An open transaction that's idle counts as active. [Logical replication](/docs/guides/logical-replication-neon#important-notices) subscribers also keep a publishing compute active for as long as they're connected. If you replicate data out of Neon and see higher compute usage than expected, check whether a subscriber is holding the compute active.
</Admonition>

## How other Postgres providers handle idle compute

| Provider             | Idle behavior                                                                                                                                                                       | Notes                                                                                                                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Neon                 | Suspends after 5 minutes of inactivity; resumes in a few hundred ms ([docs](/docs/introduction/compute-lifecycle))                                                                  | Configurable from 1 minute to always on with the Scale plan                                                                                                                                                                                                                    |
| Aurora Serverless v2 | Auto-pauses when minimum capacity is set to 0 ACUs; the idle timeout is 5 minutes by default                                                                                        | AWS gives a typical resume time of about 15 seconds and describes auto-pause as suited to workloads "where a brief pause is acceptable while the database resumes" ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for Postgres     | No automatic pause; you can stop an instance manually for up to 7 days ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html))                      | Stopped instances still bill for provisioned storage and backups, and start again automatically after 7 days                                                                                                                                                                   |
| Supabase             | Free Plan projects pause after inactivity; paid project compute runs continuously and is billed by the hour ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)) | Preview branches auto-pause after inactivity ([docs](https://supabase.com/docs/guides/deployment/branching/troubleshooting))                                                                                                                                                   |

Aurora Serverless v2 auto-pause is the closest match to Neon's scale-to-zero. Both stop billing compute while paused and keep billing storage. The main differences are resume time (a few hundred milliseconds on Neon, about 15 seconds typical on Aurora) and the lowest nonzero minimum you can set (0.25 CU ≈1 GB RAM on Neon, 0.5 ACU ≈1 GiB RAM on Aurora, per the [Aurora capacity docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.how-it-works.html)).

<CTA title="Stop paying for idle databases" description="Scale-to-zero suspends compute after 5 minutes, automatically." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
