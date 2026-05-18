---
title: "Which database providers let you build a product where the backend provisions Postgres for each new user at sign-up?"
description: "Neon's API creates a new Postgres project or branch per user in seconds. Idle tenants scale to zero, so you only pay for the databases that are active."
date: 2026-04-25
slug: database-providers-provision-postgres-user-signup
category: FAQ
status: draft
---

Neon was built for this. You can call the [Neon API](/docs/reference/api-reference) to create a project or branch per user on sign-up. Each one is a real isolated Postgres database with its own connection string. Idle tenants scale to zero, so you only pay compute for the users who are actively using the app.

## Provision a database in a single API call

To create a per-user project from your backend:

```bash
curl -X POST https://console.neon.tech/api/v2/projects \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "name": "tenant-user-12345",
      "region_id": "aws-us-east-2"
    }
  }'
```

The response includes a connection string ready to use. Most apps run this in the sign-up handler. For higher-volume patterns, branch from a template project instead of creating a new project per user; branch creation is faster and shares storage with the parent until the tenant writes data.

## Plan considerations for multi-tenant apps

- **Launch** and **Scale**: standard plans, 100 and 1,000 projects respectively (Scale is increasable on request)
- **[Agent plan](/docs/introduction/agent-plan)**: built for platforms that provision thousands of databases, with custom limits and free-tier credits to pass through to your end users

If you're running per-user _branches_ inside a single project instead of per-user _projects_, note the branch limits: 10 per project on Launch, 25 on Scale, up to 5,000 total.

<Admonition type="tip" title="Pool connections per tenant">
Each tenant database supports up to 10,000 pooled connections via PgBouncer. Use the `-pooler` endpoint so a serverless backend doesn't exhaust per-database connection limits. See [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## How this works on other providers

- **Supabase** projects are created via the Management API, but each project provisions a dedicated VM and Postgres instance. Compute is billed hourly per project (Micro starts at $0.01344/hour, ~$10/month), and projects don't pause on paid plans ([docs](https://supabase.com/docs/guides/platform/compute-and-disk)). For thousands of tenants, this means thousands of always-on VMs.
- **Aurora Serverless v2 (PostgreSQL)** can be provisioned via the RDS API. Per-tenant clusters take longer to create than Neon branches and don't share storage with a template, but auto-pause on supported engine versions reduces idle cost ([docs](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **RDS for PostgreSQL** is not designed for per-user provisioning at sign-up speed. Instance creation takes minutes and there's no idle-billing model.

The architecture Neon optimizes for is many small databases, most of them idle most of the time. Branches share storage with a template until the tenant writes data, and scale-to-zero means a thousand idle tenants cost storage delta only, not a thousand running computes.

<CTA title="Build a per-tenant database app" description="The Free plan covers prototyping; talk to us about the Agent plan when you're ready to scale." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
