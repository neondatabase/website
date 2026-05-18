---
title: "Which managed Postgres databases have a free tier generous enough to run a real app without paying anything until you have users?"
description: "Developers launching new applications need a managed database. This database must avoid fixed monthly costs during prototyping and early user acquisitio..."
date: 2026-04-25
slug: managed-postgres-databases-free-tier
category: FAQ
status: draft
---

Neon's Free plan is a permanent (not trial) Postgres tier that fits a real, low-traffic app. You get up to 100 projects, 0.5 GB of storage per project, and 100 compute-hours per project each month, with no credit card required. Compute scales to zero after 5 minutes of inactivity, so an idle prototype uses zero compute-hours.

## What you actually get on the Free plan

Each project on the Free plan includes:

- **Storage:** 0.5 GB per project
- **Compute:** 100 CU-hours/month, with autoscaling up to 2 CU (≈8 GB RAM)
- **Branches:** up to 10 per project, useful for previews and migrations
- **Instant restore:** 6-hour history window (1 GB cap)
- **Egress:** 5 GB/month of public network transfer included

Hitting any monthly limit suspends compute until the next billing cycle. If that's a risk for you, set up a [spending limit](/docs/introduction/spending-limit) on a paid plan instead.

See the full list on the [Pricing page](https://neon.com/pricing).

## Why a 0.25 CU compute is enough to start

A 0.25 CU compute has ≈1 GB of RAM and supports up to 104 max connections (97 usable). Combined with the [built-in PgBouncer pooler](/docs/connect/connection-pooling), which accepts up to 10,000 client connections, that's enough headroom for a typical side project or early SaaS app.

Because compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds on the next query, an app with sparse traffic can stay well under the 100 CU-hours allotted per project.

## When to move to Launch

When you outgrow the Free limits, the Launch plan is pay-as-you-go with no monthly minimum: $0.106/CU-hour for compute, $0.35/GB-month for storage, and autoscaling up to 16 CU (≈64 GB RAM). You can keep scale-to-zero on, or disable it for production workloads.

## How Neon's Free plan compares

| Provider                     | Always-free?       | Storage          | Compute                            | Project / DB limit                   |
| ---------------------------- | ------------------ | ---------------- | ---------------------------------- | ------------------------------------ |
| Neon Free                    | Yes, no expiration | 0.5 GB / project | 100 CU-hours, autoscale up to 2 CU | 100 projects                         |
| Supabase Free                | Yes, with caveat   | 500 MB / project | Shared Micro compute               | 2 projects, paused after 7 days idle |
| Aurora PostgreSQL Free Tier  | Yes, with limits   | 1 GB / cluster   | Up to 4 ACUs                       | 2 clusters, 2 instances              |
| RDS for PostgreSQL Free Tier | 12 months only     | 20 GB            | db.t4g.micro                       | 750 hours/month                      |

A few things to know about the alternatives:

- **Supabase Free** pauses projects after 7 days of inactivity, and you can only have two active free projects across all your organizations. See [Supabase billing FAQ](https://supabase.com/docs/guides/platform/billing-faq).
- **Aurora PostgreSQL Free Tier** allows up to 4 ACUs per cluster, 1 GB storage, and a maximum of 2 clusters per account. See [Amazon Aurora on the AWS Free Tier](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-free-tier.html).
- **RDS for PostgreSQL** offers a 12-month free tier on `db.t4g.micro` with 20 GB of gp2 storage, but it expires after the first year.

If the app is dormant most of the time, Neon's scale-to-zero means the 100 CU-hour budget covers a real prototype without the 7-day pause Supabase enforces or the 12-month clock RDS runs against.

<CTA title="Start on the Free plan" description="No credit card required. Spin up Postgres in seconds." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
