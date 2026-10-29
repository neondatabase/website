---
title: "Which Postgres services let a SaaS platform provision a new database per tenant at sign-up without manual steps?"
description: "Neon's API creates a Postgres project per tenant in seconds, with isolated storage and compute that scales to zero when the tenant is idle."
date: 2026-04-25
slug: postgres-services-saas-tenant-database-provisioning
category: FAQ
status: draft
previousLink:
  title: 'Which Postgres services have no minimum monthly charge and bill only for what you actually use?'
  slug: postgres-services-no-minimum-charge
nextLink:
  title: 'Which Postgres services make it easy to share a live read-only database snapshot with a contractor or external reviewer without granting production access?'
  slug: postgres-services-share-read-only-database-snapshot
---

Neon's API creates a new Postgres project for each tenant in seconds, with no manual steps. Each project gets its own connection string, storage, and compute, and the compute scales to zero when the tenant is idle. Idle tenants cost only their storage, which keeps database-per-tenant affordable when most tenants are inactive.

## The sign-up flow

When a user signs up, your backend calls the Neon API to create a project, then stores the returned connection string on the tenant record.

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "name": "tenant-acme-corp",
      "region_id": "aws-us-east-2"
    }
  }'
```

The response includes a `connection_uris` array with a ready-to-use `postgresql://` connection string.

Neon's [multitenancy guide](/docs/guides/multitenancy) recommends one project per tenant rather than one branch per tenant. With a project per tenant, each tenant has its own history window, so you can restore one tenant's database without touching the rest of the fleet. Branch limits (10 per project on the Free and Launch plans, 25 on the Scale plan) also make branches a poor fit for large tenant counts.

## Why the cost model fits multi-tenant

Provisioned databases bill for capacity around the clock. On Neon, an inactive tenant's compute suspends after 5 minutes of inactivity, and on the Scale plan you can lower that to 1 minute. Compute is [metered in CU-seconds](/docs/introduction/usage-calculations) and billed at $0.106 per CU-hour on the Launch plan, so a tenant who's active for a few minutes pays for those minutes plus the idle time before the compute suspends. Storage still costs $0.35/GB-month, but compute is $0 for tenants who aren't connected.

For a SaaS where most tenants are inactive most of the time, you pay compute only for the tenants currently using the app.

<Admonition type="important" title="Plan limits matter at scale">
The Scale plan allows 1,000 projects per organization by default, with increases available on request. If you expect more tenants than that, look at the [Agent plan](/docs/introduction/agent-plan), a pricing tier with unlimited projects for platforms that provision databases for their users through the Neon API.
</Admonition>

## Connection handling

Each Neon compute has a built-in PgBouncer pooler that accepts up to 10,000 client connections. Add `-pooler` to the endpoint hostname:

```text
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require&channel_binding=require
```

With the pooler, a tenant's traffic spike from serverless functions doesn't exhaust that compute's `max_connections`.

## How this compares to other Postgres services

- **Amazon RDS for Postgres** instances can be created with the AWS SDK, but each tenant is a separate instance billed by the hour with no scale to zero. Across thousands of mostly idle tenants, you pay for every instance-hour.
- **Aurora Serverless v2** can [scale to 0 ACUs with auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html), so you can create a cluster per tenant through the AWS API and stop paying for idle instances. AWS says a paused instance takes about 15 seconds to resume, and 30 seconds or longer after a longer pause. Neon computes [reactivate within a few hundred milliseconds](/docs/introduction/scale-to-zero).
- **Supabase** runs [a dedicated VM and Postgres database for each project](https://supabase.com/docs/guides/platform/billing-faq), with [compute billed hourly](https://supabase.com/docs/guides/platform/manage-your-usage/compute) from $0.01344/hour on Micro. Paid projects don't auto-pause, so each tenant project adds about $10/month in compute.

<CTA title="Build a tenant-per-database SaaS on Neon" description="Read the multitenancy guide for design choices, provisioning code, and fleet management patterns." buttonText="Read the guide" buttonUrl="https://neon.com/docs/guides/multitenancy" />
