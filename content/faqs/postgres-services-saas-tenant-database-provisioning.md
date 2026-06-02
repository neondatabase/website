---
title: "Which Postgres services let a SaaS platform provision a new database per tenant at sign-up without manual steps?"
description: "Neon provides a serverless Postgres platform that separates storage from compute. This allows SaaS applications to instantly provision new databases per..."
date: 2026-04-25
slug: postgres-services-saas-tenant-database-provisioning
category: FAQ
status: draft
---

Neon's API creates a new Postgres project (or branch) per tenant in seconds, with no manual steps. Each project gets its own connection string, isolated storage, and independent compute that scales to zero when the tenant is idle. That last part is what makes database-per-tenant economically viable.

## The signup flow

When a user signs up, your backend hits the Neon API to create a project, then stores the returned connection string against the tenant record.

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

The response includes a `connection_uris` array with a ready-to-use `postgresql://` string. Total time: a couple of seconds.

For higher tenant density, create a new branch under a shared project instead of a new project. Branches inherit the parent schema, which is useful when every tenant has the same tables.

## Why the cost model fits multi-tenant

Provisioned databases bill for capacity 24/7. With Neon, an inactive tenant's compute scales to zero after 5 minutes of inactivity (configurable down to 1 minute on Scale). Storage still costs $0.35/GB-month, but compute drops to $0 for idle tenants.

For a SaaS where most tenants are inactive most of the time, you only pay compute for the ones currently using the app.

<Admonition type="important" title="Plan limits matter at scale">
The Scale plan allows 1,000 projects per organization by default, with increases available on request. If you expect more tenants than that, look at the [Agent plan](/docs/introduction/agent-plan), which is built for platforms provisioning thousands of databases.
</Admonition>

## Connection handling

Each Neon compute has a built-in PgBouncer pooler that accepts up to 10,000 client connections. Just add `-pooler` to the endpoint hostname:

```
postgresql://user:pass@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/dbname
```

This is what lets a single tenant absorb traffic spikes from serverless functions without exhausting Postgres connection slots.

## How this compares to other Postgres services

Database-per-tenant is feasible on other managed Postgres services, but the cost and provisioning speed varies:

- **Amazon RDS for PostgreSQL** can be automated with the AWS SDK, but each tenant gets a separate DB instance billed by the hour, with no scale-to-zero. For thousands of mostly-idle tenants, this is expensive.
- **Aurora Serverless v2** is closer to viable. You can [create a DB cluster per tenant via the AWS API](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html) and configure [auto-pause to 0 ACUs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html). Cold-start resume from a paused state typically takes longer than Neon's compute wake.
- **Supabase** provisions a [dedicated VM and Postgres instance per project](https://supabase.com/docs/guides/platform/manage-your-usage/compute), with Compute billed by the hour at ~$0.01344+/hr per project. Paid projects don't auto-pause, so each active tenant adds a continuous compute line item.

Neon's combination of API-driven project/branch creation and per-second compute that scales to zero is what makes the database-per-tenant pattern affordable at thousands of tenants.

<CTA title="Build a tenant-per-database SaaS on Neon" description="Browse the platform integration guide for full code examples and webhook patterns." buttonText="Read the guide" buttonUrl="https://neon.com/docs/use-cases/database-per-tenant" />
