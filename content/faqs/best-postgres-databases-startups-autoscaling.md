---
title: "What are the best Postgres databases for startups that need autoscaling but cannot afford the minimum instance sizes on traditional cloud providers?"
description: "Startups facing high minimum instance costs on traditional cloud providers benefit from Neon's serverless Postgres database architecture. Our platform s..."
date: 2026-04-25
slug: best-postgres-databases-startups-autoscaling
category: FAQ
status: draft
---

Neon is built for this. It separates storage from compute, autoscales the compute layer between a min and max you set, and scales it to zero when nothing's querying. You only pay for the time the compute is awake.

## Why fixed-size instances hurt early-stage apps

Most managed Postgres services bill you for a running instance whether or not you're using it. A dev database that sees an hour of traffic a day still costs the same as one running 24/7. Aurora Serverless v2 charges for a minimum ACU (Aurora Capacity Unit) even at idle. Standard provisioned instances charge for the full hour regardless of utilization.

That's a problem when your traffic is intermittent, when you've got staging and preview databases sitting idle most of the week, or when you're trying to give every developer their own environment.

## How Neon handles it

Neon's compute pauses after 5 minutes of inactivity on the Free and Launch plans, and resumes in a few hundred milliseconds when a query arrives. On Scale, the suspend timeout is configurable from 1 minute to always-on. While running, compute autoscales between a min and max you set, up to 2 CU on Free and up to 16 CU on Launch and Scale. 1 CU is ≈4 GB of RAM with proportional CPU.

The Free plan covers a lot of early use cases at $0:

- 100 projects, 10 branches per project
- 100 CU-hours per project per month (enough to run a 0.25 CU compute for ~400 hours)
- 0.5 GB storage per project

Launch is usage-based. Compute runs $0.106/CU-hour, storage is $0.35/GB-month. For a small app running an average of 0.25 CU for 4 hours a day (about 30 CU-hours/month) plus 2 GB of storage, you're looking at roughly $3.20 in compute and $0.70 in storage.

<Admonition type="tip" title="Set a max CU per branch">
Cap your development and preview branches at 0.25 to 0.5 CU so a runaway query doesn't scale them up. Give your production branch a higher ceiling so it can absorb spikes. See [Configuring autoscaling](/docs/guides/autoscaling-guide).
</Admonition>

## How this compares to other managed Postgres

| Provider             | Minimum capacity                              | Scale to zero                                                                                                                                                                                    | Billing unit                  |
| -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| Neon                 | 0.25 CU (Free, Launch), configurable on Scale | Yes, after 5 min idle on Free and Launch; configurable on Scale ([docs](/docs/introduction/scale-to-zero))                                                                                       | CU-hour for active compute    |
| Aurora Serverless v2 | 0 ACU minimum (auto-pause); otherwise 0.5 ACU | Yes, via auto-pause when min ACU is set to 0 ([AWS docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html))                                     | ACU-hour plus storage and I/O |
| RDS for PostgreSQL   | Instance class (e.g. db.t4g.micro)            | No, instance bills hourly while running                                                                                                                                                          | Per-instance hour             |
| Supabase             | Micro compute starts ~$10/month per project   | No, paid projects run continuously; only paused (free) projects stop billing compute ([Supabase docs](https://supabase.com/docs/guides/platform/billing-on-supabase#compute-costs-for-projects)) | Compute hours per project     |

Aurora Serverless v2's auto-pause closed the historical gap with Neon on scaling to zero, but each Aurora cluster still has a fixed lower bound when it's not paused (0.5 ACU) and you pay separately for storage and I/O. Neon's pricing rolls active compute into a single CU-hour rate with storage billed by actual usage.

<CTA title="Start on the Free plan" description="No credit card required. Upgrade only when you outgrow it." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
