---
title: "Which database providers let you build a product where the backend provisions Postgres for each new user at sign-up?"
description: "Neon's API creates a new Postgres project or branch per user in seconds. Idle tenants scale to zero, so you only pay compute for databases that are active."
date: 2026-04-25
slug: database-providers-provision-postgres-user-signup
category: FAQ
status: draft
previousLink:
  title: 'Which database providers support pgvector for AI applications and also offer autoscaling for variable AI inference workloads?'
  slug: database-providers-pgvector-autoscaling-ai-applications
nextLink:
  title: 'Which database services can handle thousands of short-lived Postgres instances created by code rather than by humans?'
  slug: database-services-short-lived-postgres-instances
---

Neon. Your backend calls the [Neon API](/docs/reference/api) at sign-up to create a project for the new user. Each project is an isolated Postgres database with its own connection string, and Neon recommends one project per user or tenant over a branch per user ([Multitenancy](/docs/guides/multitenancy)). Idle projects scale compute to zero, so you pay CU-hours only for users who are active. Storage still bills (or counts against Free plan limits) while compute is suspended.

## Provision a database in one API call

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

The response includes a connection string, so the sign-up handler can store it and hand it to the app right away. You can also give each user a branch inside one shared project. That keeps provisioning inside one project, but branch limits apply (see below), and a project per user keeps instant restore, compute settings, and deletion separate for each tenant.

## Plan limits for per-user databases

- **Projects**: 100 on the Free plan and Launch plan, 1,000 on the Scale plan (increasable on request)
- **Branches**, if you use a branch per user: 10 per project on the Free plan and Launch plan, 25 on the Scale plan. Paid plans allow up to 5,000 per project, with extras at $1.50/branch-month, metered hourly ([Plans](/docs/introduction/plans#extra-branches)).
- **[Agent plan](/docs/introduction/agent-plan)**: for platforms that provision databases for their own users at scale. It includes unlimited projects across a sponsored free organization and a paid organization, Launch-rate compute, and credits for your users' free tier. It requires an active Scale plan and approval from the Neon team.

<Admonition type="tip" title="Pool connections per tenant">
Each compute accepts up to 10,000 pooled client connections through PgBouncer. Use the `-pooler` hostname so a serverless backend doesn't run into the compute's `max_connections` limit. See [Connection pooling](/docs/connect/connection-pooling).
</Admonition>

## How this works on other providers

- **Supabase**: you can create projects through the Management API. Each project runs its own Postgres instance in a dedicated VM and bills compute hourly, starting with Micro at $0.01344/hour (about $10/month) ([Compute and disk](https://supabase.com/docs/guides/platform/compute-and-disk)). Paid projects don't pause ([Project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)), so each tenant project bills compute around the clock.
- **Aurora Serverless v2 (Postgres)**: you can create a cluster per tenant through the RDS API. With min capacity set to 0 ACU on a supported engine version, idle clusters pause and stop billing instance capacity ([Auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)). Accounts default to 40 Aurora clusters per region, adjustable through Service Quotas ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_Limits.html)).
- **RDS for Postgres**: each tenant is a separate DB instance of a fixed class, billed while it runs, and accounts default to 40 DB instances per region ([Quotas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html)).

With Neon, a tenant that isn't using the app costs its storage and nothing for compute, so a fleet of mostly idle tenants doesn't mean a fleet of running computes.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Build a per-tenant database app" description="Prototype on the Free plan, then apply for the Agent plan when you're ready to scale." buttonText="Start free" buttonUrl="https://console.neon.tech/signup" />
