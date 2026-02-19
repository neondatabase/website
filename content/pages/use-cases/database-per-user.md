---
title: Database per User
subtitle: Provision isolated Postgres at massive scale
summary: Covers how to embed one isolated Postgres database per end user with Neon, using API-first provisioning, independent scaling, and project-level quotas for sustainable platform growth.
enableTableOfContents: true
updatedOn: '2026-02-13T00:00:00.000Z'
---

## Your users need a database

Many platforms need persistent data to fully shine, but still force their users to go elsewhere to deploy a database.

If that is you, we do not blame you. You probably do not want to get into the business of hosting Postgres on top of building and scaling your existing product.

**Here is the good news: with Neon, you can have it both ways.**

Traditionally, provisioning thousands of Postgres databases means:

- Managing large fleets of instances
- Paying for idle capacity
- Building internal control planes
- Hiring infrastructure engineers just to keep up

Neon changes the economics and the operational burden. **Because Neon is built on a [unique serverless Postgres architecture](https://neon.com/docs/introduction/architecture-overview), those constraints disappear.** You can embed real Postgres directly into your platform and deploy thousands of Postgres databases for your users, without hiring extra engineers to manage your fleet.

## Importantly: your users need their own isolated database

You may agree that your end-user experience would be better if users could store their data directly inside your platform, but still think that giving them space on a shared table in a single large Postgres instance (RDS or elsewhere) might be good enough.

At platform scale, this becomes complicated quickly.

### Why shared databases break at scale

**Data isolation requires active enforcement**

If you follow a shared-database model, data isolation will not be automatic. It has to be enforced everywhere, all the time. Every query must be tenant-aware, every migration must remain compatible across all tenants, and every code path must ensure filters are applied correctly.

**Schema evolution gets harder over time**

With one shared database, you only get one schema. Per-user customizations are harder. So are gradual rollouts, because every migration affects every tenant at once. Your blast radius grows as your platform grows.

**Noisy neighbors**

In a shared setup, heavy workloads compete for the same compute and memory resources. If one customer runs hot, everyone can feel it.

**Billing and quotas become major engineering projects**

In shared systems, enforcing per-user limits by pricing tier is non-trivial. You need custom metering, limits, and guardrails across shared resources.

### One isolated database per user solves this

The cleaner architecture is simple: **give each end user their own isolated Postgres database with dedicated resources.**

This model solves the core issues:

- Isolation is guaranteed by design
- Schema changes can be tested and rolled out safely
- No noisy neighbors
- Compute scales independently per user
- Billing limits can be enforced at the infrastructure level
- Performance issues are contained to a single tenant

The natural follow-up question is: _Do I need to run and manage thousands of RDS instances?_

No. That is exactly what Neon removes.

## Neon makes database-per-user simple and sustainable

[Neon](https://neon.com/) is not a traditional managed Postgres service. Its [architecture](https://neon.com/docs/introduction/architecture-overview) separates storage and compute, bringing a truly [serverless experience](https://neon.com/docs/get-started/dev-experience) to Postgres. You can deploy thousands of databases programmatically as if they were another resource in your platform.

### API-first control, built for platforms

The first key characteristic is straightforward: Neon is designed to be managed programmatically. **Provisioning a new Postgres database is one API call.**

From your backend, you can:

- Provision new Postgres databases
- Set compute and storage limits per user
- Adjust quotas as users upgrade plans
- Suspend inactive databases automatically
- Monitor usage across thousands of projects
- Enforce limits without downtime

<QuoteBlock quote="We've been able to manage 300k+ Postgres databases via the Neon API. It saved us a tremendous amount of time and engineering effort" author="himanshu-bhandoh" role="Software Engineer at Retool" />

### Serverless economics: the key enabler

Neon databases:

- Provision in approximately 1 second
- Scale to zero when inactive
- Resume in approximately 350 ms

This changes the economics of large fleets. Most end users are not active 24/7, and you should not pay continuously for inactive capacity.

On Neon, idle databases consume zero compute, making one-database-per-user economically sustainable even with many rarely active users.

<QuoteBlock quote="We were getting ready to hire dedicated engineers just to manage and scale Zite Database. With Neon, we didn't need to do that. We were able to give every end user their own database, including on the free plan" author="dominic-whyte" role="Co-founder at Zite" />

### Independent scaling per user

In Neon's model, **each database scales independently.** If one customer has heavy usage, their compute [autoscales](https://neon.com/docs/introduction/autoscaling) without affecting anyone else.

Isolation is built in technically and economically. You pay only for the compute each customer needs at that moment.

### Neon stays invisible to your users

**Neon does not need to surface in your product.** You can provision databases via API and manage credentials internally, without asking users to create Neon accounts.

From your users' perspective, the database feels fully native to your product: your onboarding, your UI, and your billing.

| Use case                         | API endpoint                                                | What it enables                                                   |
| -------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------- |
| Provision a new user database    | POST /api/v2/projects                                       | Instantly create a new Postgres project per user (about 1 second) |
| Configure compute scaling        | default_endpoint_settings.autoscaling_limit_min_cu / max_cu | Define min/max compute per pricing tier                           |
| Configure suspend behavior       | suspend_timeout_seconds                                     | Control how aggressively inactive databases scale to zero         |
| Set consumption limits           | project.settings.quota                                      | Enforce compute, storage, write, and data transfer caps           |
| Monitor fleet usage              | GET /api/v2/consumption_history/projects                    | Track usage per project for billing dashboards                    |
| Adjust limits dynamically        | PATCH /api/v2/projects/\{id\}                               | Upgrade/downgrade users without downtime                          |
| Create branches programmatically | POST /api/v2/projects/\{id\}/branches                       | Enable per-user dev environments or safe migrations               |

_Sample API operations platforms use to implement database-per-user workflows with Neon._

### Your users get real Postgres

Every user gets full Postgres, not a limited tenant shim: full SQL, extensions, indexing, and migration workflows.

Each user database scales with user growth, without forcing you to re-architect or migrate to a different backend model.

## Quotas and billing tiers become straightforward

With Neon's [project-per-user model](https://neon.com/docs/guides/embedded-postgres#the-project-per-user-model):

- Each user gets their own [Neon project](https://neon.com/docs/manage/projects)
- Limits, scaling behavior, and usage tracking happen per project
- Pricing tiers map directly to infrastructure configuration

Because quotas are enforced at the project level, your pricing plans become API-configured infrastructure definitions.

| User-facing plan limit     | Free _example_ | Pro _example_ | Enterprise _example_ | Configured in Neon via                                                                |
| -------------------------- | -------------- | ------------- | -------------------- | ------------------------------------------------------------------------------------- |
| Compute (min/max CU)       | 0.25 / 0.25    | 0.25 / 2      | 1 / 8                | default_endpoint_settings.autoscaling_limit_min_cu / max_cu (Create or PATCH project) |
| Active time (compute time) | 100 hrs/month  | 750 hrs/month | Unlimited            | project.settings.quota.compute_time_seconds                                           |
| Storage                    | 512 MB         | 10 GB         | 100 GB+              | project.settings.quota.logical_size_bytes                                             |
| Data transfer              | 5 GB           | 50 GB         | Custom               | project.settings.quota.data_transfer_bytes                                            |
| Written data               | 1 GB           | 50 GB         | Custom               | project.settings.quota.written_data_bytes                                             |
| Suspend timeout            | 5 min          | 10 min        | Custom               | default_endpoint_settings.suspend_timeout_seconds                                     |

_Example of pricing plans you can implement by configuring Neon quotas._

All values can be set at project creation (`POST /api/v2/projects`) or updated dynamically (`PATCH /api/v2/projects/\{id\}`).

## Usage tracking at scale

Neon provides per-project consumption metrics, including:

- `active_time_seconds`
- `compute_time_seconds`
- `written_data_bytes`
- `data_transfer_bytes`
- `synthetic_storage_size_bytes`

Reading consumption metrics does not wake suspended computes. Metrics are available at hourly, daily, or monthly granularity and update roughly every 15 minutes.

## Offer real Postgres to your users without running Postgres yourself

**If your platform depends on persistent data but still sends users elsewhere for databases, you are leaving product value on the table. Capture it with Neon.** You run your platform, Neon runs the database layer.

To get started, [follow our step-by-step guide](https://neon.com/docs/guides/embedded-postgres).
