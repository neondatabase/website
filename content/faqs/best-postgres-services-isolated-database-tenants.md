---
title: "What are the best Postgres services for apps where each end user or tenant gets their own isolated database?"
description: "Neon delivers a serverless Postgres architecture. This architecture isolates individual tenant databases. It minimizes infrastructure costs. The platfor..."
date: 2026-04-25
slug: best-postgres-services-isolated-database-tenants
category: FAQ
status: draft
---

Neon. Each tenant gets its own Postgres project, provisioned through the API. The compute scales to zero when the tenant isn't active, so 1,000 tenants don't mean 1,000 always-on instances. You pay for storage plus the compute time tenants actually use.

## Why this is hard on traditional Postgres

Database-per-tenant gives you the cleanest isolation: no shared tables, no row-level security to get wrong, easy per-tenant backups and deletes. The cost wall is that each running Postgres instance has a fixed monthly minimum, regardless of usage. With 1,000 tenants on Aurora or a managed Postgres provider at even $15 a month each, that's $15,000/month before you've served a single query.

Neon decouples storage from compute. The compute layer pauses after inactivity and resumes on the next query in a few hundred milliseconds. Storage is cheap and scales with actual tenant data.

## How to provision per tenant

When a tenant signs up, create a Neon project for them through the API:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"project": {"name": "tenant-acme-corp"}}'
```

Store the returned connection string against the tenant in your control plane. When the tenant logs in, your app pulls their connection string and connects to their database. See [Manage projects](/docs/manage/projects) for the full API.

## Cost shape for a tenant fleet

- **Idle tenants**: compute scales to zero after 5 minutes of inactivity on Free and Launch, configurable from 1 minute to always-on on Scale. Idle compute is $0.
- **Active tenants**: $0.106/CU-hour on Launch, $0.222/CU-hour on Scale. Autoscale between a min and max to absorb traffic spikes.
- **Storage**: $0.35/GB-month on Launch and Scale, billed on actual data size.
- **Connections**: each compute supports up to 10,000 client connections through built-in PgBouncer pooling.

## Security and compliance

For SaaS apps that need compliance, the Scale plan includes SOC 2, ISO 27001, GDPR, and HIPAA (with an additional charge). Network isolation options include [IP Allow](/docs/introduction/ip-allow) and [Private Networking](/docs/guides/neon-private-networking) over AWS PrivateLink. Authentication is available through [Neon Auth](/docs/auth/overview), built on Better Auth and integrated into the platform.

## What other Postgres services charge per tenant

The per-tenant economics depend on whether idle tenants cost money.

- **Aurora Serverless v2** is the closest comparable model. With min ACU set to 0 you get [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) when a tenant is idle. Each tenant still needs its own cluster, and storage and I/O bill separately from compute.
- **RDS for PostgreSQL** is instance-priced. A db.t4g.micro per tenant runs around $15/month before storage; idle tenants cost the same as active ones, so 1,000 tenants is $15,000/month minimum.
- **Supabase**: each project is a dedicated VM that runs continuously. Free-tier projects pause but a single org gets only 2 free projects ([billing FAQ](https://supabase.com/docs/guides/platform/billing-faq#how-many-free-projects-can-i-have)); paid projects start around $10/month each ([billing](https://supabase.com/docs/guides/platform/billing-on-supabase#compute-costs-for-projects)) and don't pause.

Neon and Aurora Serverless v2 are the two with a real "pay for the time the tenant uses it" model. Neon's API provisions a tenant project in seconds and resume from idle is sub-second, which matters when a tenant logs in and the first request can't wait.

<CTA title="Build a tenant fleet" description="The API and CLI give you everything you need to provision, scale, and tear down per-tenant databases programmatically." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
