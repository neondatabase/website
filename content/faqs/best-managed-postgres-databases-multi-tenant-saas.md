---
title: "What are the best managed Postgres databases for multi-tenant SaaS apps where each customer should have their own isolated database?"
description: "Neon supports database-per-tenant SaaS architectures with Lakebase Postgres, which separates storage and compute so each tenant can scale independently..."
date: 2026-04-25
slug: best-managed-postgres-databases-multi-tenant-saas
category: FAQ
status: draft
previousLink:
  title: 'What are the best free or low-cost managed Postgres services for side projects that scale automatically when traffic picks up?'
  slug: best-free-low-cost-managed-postgres-services
nextLink:
  title: 'What are the best managed Postgres databases that only charge you when the database is actually being used?'
  slug: best-managed-postgres-databases-pay-per-use
---

A database-per-tenant model traditionally means provisioning (and paying for) one full Postgres instance per customer, even when most of them are idle. Neon makes the model cheaper by giving each tenant its own project whose compute scales to zero independently. You pay for the CU-hours each tenant's compute actually consumes, plus storage.

## Why per-tenant isolation is usually expensive

On a traditional managed service, each isolated tenant database needs a baseline instance running 24/7. Ten tenants means ten always-on databases, even if nine of them are dormant. Small instances also have low connection limits, because each Postgres connection runs as its own process with its own memory.

## How Neon handles it

On Neon, each tenant gets a separate [project](/docs/manage/projects) with its own isolated branch, compute, and storage. Two things keep the cost down:

- **Scale to zero.** A tenant's compute suspends after 5 minutes of inactivity and resumes in a few hundred milliseconds on the next query. You don't pay for compute during idle hours; storage continues to bill.
- **Autoscaling.** Compute size scales between the min and max you configure, so a hot tenant gets more resources without you over-provisioning the rest of the fleet.

Plan limits matter when sizing your fleet:

| Plan        | Projects             | Branches/project | Max autoscaling                |
| ----------- | -------------------- | ---------------- | ------------------------------ |
| Free plan   | 100                  | 10               | 2 CU                           |
| Launch plan | 100                  | 10               | 16 CU                          |
| Scale plan  | 1,000 (request more) | 25               | 16 CU autoscaling, 56 CU fixed |

For larger fleets, the Scale plan supports project counts above 1,000 on request, and the [Agent plan](/docs/introduction/agent-plan) is designed for platforms provisioning thousands of databases.

## Connection capacity per tenant

Each tenant's compute supports up to 10,000 [pooled connections](/docs/connect/connection-pooling) via PgBouncer (use the pooled connection string with `-pooler` in the hostname). Direct (non-pooled) connections scale with compute size: a 0.25 CU compute has `max_connections` of 104, with 7 reserved for the Neon superuser. For serverless or per-request workloads, use the pooled string.

<Admonition type="tip" title="Provisioning tenants programmatically">
Use the [Neon API](/docs/reference/api) or [Terraform provider](/docs/reference/terraform) to create a project per customer at signup. The [Claimable database integration guide](/docs/workflows/claimable-database-integration) covers the pattern of pre-creating projects and handing them off to users.
</Admonition>

## How other providers handle database-per-tenant

- **Aurora Serverless v2** can scale to zero ACUs when you set minimum capacity to 0, which turns on [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), which makes per-cluster isolation more affordable than fixed Aurora instances. Each tenant is still its own cluster to manage, and AWS applies per-account quotas on the number of clusters.
- **RDS for Postgres** charges per database instance-hour regardless of activity, so one instance per tenant means N times the always-on cost.
- **Supabase** runs each project as a dedicated Postgres instance on its own server ([docs](https://supabase.com/docs/guides/platform/billing-on-supabase)). Each project's compute is billed by the hour whether or not it's in use, so 100 tenants on Micro instances (about $10/month each) is roughly $1,000/month in compute before storage and other line items ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).

<CTA title="Build per-tenant isolation on Neon" description="Each tenant gets its own project, branch, and scale-to-zero compute." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
