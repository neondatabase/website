---
title: "What are the best Postgres services for apps where each end user or tenant gets their own isolated database?"
description: "Give each tenant its own Neon project through the API. Lakebase Postgres compute scales to zero when a tenant is idle, so idle tenants don't bill for compute."
date: 2026-04-25
slug: best-postgres-services-isolated-database-tenants
category: FAQ
status: draft
previousLink:
  title: 'What are the best Postgres services for running integration tests against production-like data in a CI environment without extra cost?'
  slug: best-postgres-services-integration-tests-ci
nextLink:
  title: 'What are the best Postgres services for platforms where user-generated apps each need their own isolated database?'
  slug: best-postgres-services-isolated-databases
---

Neon. Each tenant gets its own Postgres project, created through the API. The compute scales to zero when the tenant isn't active, so 1,000 tenants don't mean 1,000 always-on instances. You pay for storage plus the compute time tenants actually use.

## Why this is hard on traditional Postgres

Database-per-tenant gives you the cleanest isolation: no shared tables, no row-level security policies to get wrong, and simple per-tenant backups and deletes. The problem is cost. A provisioned instance bills every hour it runs, whether the tenant is active or not. An RDS for Postgres db.t4g.micro is $0.016/hour on demand in US East (N. Virginia), about $12 a month, so 1,000 tenants cost roughly $11,700/month in instance hours before storage or a single query.

The lakebase architecture separates storage from compute. A tenant's compute suspends after inactivity and resumes on the next query in a few hundred milliseconds. Storage bills at $0.35/GB-month on paid plans and grows with each tenant's actual data.

## How to provision per tenant

When a tenant signs up, create a Neon project for them through the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "tenant-acme-corp"}}'
```

Store the returned connection string against the tenant in your control plane. When the tenant logs in, your app looks up their connection string and connects to their database. See [Manage projects](/docs/manage/projects) for the full API.

Project limits set how many tenants fit in one organization: 100 projects on the Launch plan and 1,000 on the Scale plan, which can be raised on request ([Plans](/docs/introduction/plans#projects)). Platforms that create databases for their own users at larger scale can apply for the [Agent Plan](/docs/introduction/agent-plan), which has no fixed project cap.

## Cost shape for a tenant fleet

- **Idle tenants**: compute suspends after 5 minutes of inactivity. The Scale plan lets you set the timeout from 1 minute to always on. A suspended compute doesn't bill; the tenant's storage does.
- **Active tenants**: $0.106/CU-hour on the Launch plan, $0.222/CU-hour on the Scale plan. Compute autoscales between a minimum and maximum you set to absorb traffic spikes.
- **Storage**: $0.35/GB-month on the Launch and Scale plans, billed on actual data size.
- **Connections**: each compute accepts up to 10,000 pooled client connections through built-in PgBouncer.

## Security and compliance

For SaaS apps with compliance requirements, the Scale plan includes SOC 2, ISO 27001, GDPR, and HIPAA support ([Compliance](/docs/security/compliance)). Network isolation options include [IP Allow](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking) over AWS PrivateLink, also on the Scale plan. For authentication, [Managed Better Auth](/docs/auth/overview) is built on Better Auth and stores its data in each database's `neon_auth` schema, so auth data stays isolated per tenant too.

## What other Postgres services charge per tenant

The per-tenant cost depends on whether idle tenants bill for compute.

- **Aurora Serverless v2** is the closest model. With minimum capacity set to 0 ACUs, a tenant's cluster [auto-pauses](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when idle and doesn't bill instance capacity while paused. Each tenant still needs its own cluster, storage bills separately, and AWS gives a typical resume time of about 15 seconds.
- **RDS for Postgres** is priced per instance-hour. Idle tenants cost the same as active ones, so the db.t4g.micro example above works out to about $11,700/month for 1,000 tenants.
- **Supabase** gives each project a dedicated Postgres instance on its own server ([billing](https://supabase.com/docs/guides/platform/billing-on-supabase#compute-costs-for-projects)). Free Plan projects pause after inactivity, but you get 2 active free projects ([billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have)). Paid projects don't pause. The Pro plan is $25/month with $10 of compute credits that cover one Micro project, and each additional Micro project adds about $10/month ([compute usage](https://supabase.com/docs/guides/platform/manage-your-usage/compute)).

Neon and Aurora Serverless v2 are the two that bill tenants only for the compute time they use. On Neon, a tenant project is created in seconds and resumes from idle in a few hundred milliseconds, so a tenant's first request after logging in doesn't wait long.

<CTA title="Build a tenant fleet" description="The API and CLI give you everything you need to provision, scale, and tear down per-tenant databases programmatically." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
