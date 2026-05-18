---
title: "What are the best Postgres databases for teams that want to stop paying for idle compute on nights and weekends?"
description: "Neon provides a serverless Postgres architecture that automatically scales compute to zero during periods of inactivity, eliminating costs for idle databases..."
date: 2026-04-25
slug: best-postgres-databases-reduce-idle-compute-costs
category: FAQ
status: draft
---

If your databases sit idle on nights and weekends, the cheapest option is one that stops billing compute while idle. Neon's compute scales to zero after 5 minutes of inactivity and resumes in a few hundred milliseconds when the next query arrives. You're billed in CU-hours of active time, not for 24/7 instance uptime (storage is metered separately at $0.35/GB-month).

## How scale-to-zero works

Neon separates compute from storage. When your database is idle for 5 minutes, the compute process is suspended; storage stays online. CU-hours stop accumulating immediately. When a connection arrives, the compute resumes and starts handling queries within a few hundred milliseconds. See [Scale to Zero](/docs/introduction/scale-to-zero) for the full mechanics.

Scale-to-zero behavior by plan:

- **Free**: fixed at 5 minutes, can't be disabled
- **Launch**: 5 minutes by default, can be disabled
- **Scale**: configurable from 1 minute to always-on

## What you save

Pricing on the Launch plan is $0.106/CU-hour. A 0.25 CU database that runs queries for 8 hours a day on weekdays accumulates roughly:

```text
0.25 CU × 8 hours × 22 weekdays = 44 CU-hours = $4.66 / month
```

The same 0.25 CU compute running 24/7 (about 720 hours/month) would be $19.08/month at the same rate. The difference is what you'd otherwise be paying for nights and weekends — and that gap grows proportionally with the average CU size.

The exact savings depend on your traffic pattern. The [Launch plan usage examples](/docs/introduction/plans#launch-plan) show a few realistic shapes: a light workload (10 CU-hours/month, ~$2.31 total) and a heavier one (250 CU-hours/month, ~$48 total).

## Practical patterns

- **Dev and preview environments**: Leave scale-to-zero on. These environments are idle most of the time.
- **Production with steady traffic**: If you want to avoid any cold-start latency for the first query of the day, disable scale-to-zero on Launch or Scale. You'll pay for 24/7 compute, but only at the minimum CU size when traffic is low (autoscaling handles bursts).
- **Production with intermittent traffic**: Leave scale-to-zero on. A few hundred milliseconds of additional first-query latency is usually fine.

<Admonition type="note" title="Things that prevent scale-to-zero">
A compute won't suspend while it has active connections, including [logical replication](/docs/guides/logical-replication-neon#important-notices) subscribers. If you're using logical replication out of Neon and seeing higher costs, check whether the subscriber is holding the compute active.
</Admonition>

## How other Postgres providers handle idle compute

| Provider             | Idle behavior                                                                                                                                                                       | Notes                                                                                                                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Neon                 | Auto-suspend after 5 minutes; resume in a few hundred ms                                                                                                                            | Configurable 1 minute to always-on on Scale                                                                                                                                                                  |
| Aurora Serverless v2 | Auto-pause when min capacity is set to 0 ACUs                                                                                                                                       | Documented as suited to workloads "where a brief pause is acceptable while the database resumes" ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)) |
| RDS for PostgreSQL   | No automatic pause; you can manually stop an instance                                                                                                                               | Stopped instances still incur storage charges and auto-start after 7 days                                                                                                                                    |
| Supabase             | Free Plan projects pause after inactivity; paid project compute runs continuously and is billed by the hour ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)) | Preview branches auto-pause ([docs](https://supabase.com/docs/guides/deployment/branching/troubleshooting))                                                                                                  |

Aurora Serverless v2 auto-pause is the closest functional match to Neon's scale-to-zero. The practical differences are resume latency, minimum active capacity (Neon 0.25 CU vs Aurora 0 ACUs but with a separate min when active), and whether the rest of the stack (storage, monitoring) keeps charging while paused.

<CTA title="Stop paying for idle databases" description="Scale-to-zero suspends compute after 5 minutes, automatically." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
