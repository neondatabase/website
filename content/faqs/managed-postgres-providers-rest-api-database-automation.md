---
title: "Which managed Postgres providers offer a REST API for creating and deleting databases as part of infrastructure automation workflows?"
description: "Providers like DigitalOcean and WAYSCloud deliver REST APIs for creating and deleting database clusters to support infrastructure automation. Neon provi..."
date: 2026-04-24
slug: managed-postgres-providers-rest-api-database-automation
category: FAQ
status: draft
---

Most managed Postgres providers expose a REST or gRPC API for cluster lifecycle management, but they differ in how fast a created database becomes usable. Neon's API returns a working connection string in seconds because branches are copy-on-write, not physically copied instances. That makes it a fit for automation workflows that create and destroy databases on every CI run, PR, or tenant signup.

## What the Neon API gives you

The [Neon API](/docs/reference/api-reference) covers:

- Projects: create, list, update, delete
- Branches: create from any point in time, reset from parent, restore, delete
- Computes: create, resize, suspend, delete
- Databases and roles: create, drop, rotate passwords

There are first-party SDKs for [TypeScript](/docs/reference/typescript-sdk) and [Python](/docs/reference/python-sdk), plus a [Terraform provider](/docs/reference/terraform) if you'd rather declare Neon resources as code.

## Create a database programmatically

```bash
curl -X POST "https://console.neon.tech/api/v2/projects" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "project": {
      "name": "tenant-acme",
      "region_id": "aws-us-east-2"
    }
  }'
```

The response includes the project ID, default branch, default role with password, and a connection string. You can pipe that straight into your tenant onboarding flow or a Terraform plan.

## Delete on a schedule

For per-PR or per-tenant trial databases, use [branch expiration](/docs/guides/branch-expiration) to auto-delete:

```bash
neon branches create --name pr-1234 --expires-at 2026-05-24T00:00:00Z
```

Neon deletes the branch automatically at the timestamp, so your CI doesn't need a cleanup step.

<Admonition type="note" title="Hard limits to plan around">
Free plan: 100 projects, 10 branches per project. Launch: 100 projects, 10 branches included (more at $1.50/branch-month). Scale: 1,000 projects (raisable on request), 25 branches included.
</Admonition>

## How other Postgres providers compare on REST APIs

Most managed Postgres providers expose a REST API for cluster lifecycle, but they differ in granularity and provisioning latency.

- **AWS (RDS / Aurora)** uses the AWS API (and SDKs / CloudFormation / Terraform) for `CreateDBInstance` and `CreateDBCluster`. The API call returns quickly but the database isn't usable until the instance reaches `available` state, which takes minutes. Per-PR or per-CI workflows aren't a great fit because billing is per instance-hour.
- **Supabase Management API** exposes `POST /v1/projects` to create a new project programmatically, and `POST /v1/projects/{ref}/branches` to create preview branches. Project creation includes the full Supabase stack (database, auth, storage, edge functions) and the deploy workflow waits for health checks. See [Supabase Management API](https://supabase.com/docs/reference/api/v1-create-a-project).
- **DigitalOcean Managed Databases** has a REST API for creating clusters, but provisioning is also per-cluster (minutes) and there's no copy-on-write branching primitive.

Neon's distinction is that the `POST /branches` endpoint returns a working connection string in seconds because branches are a metadata pointer to existing storage, not a physical clone. That's what makes per-PR, per-CI, and per-tenant flows practical.

<CTA title="Browse the API reference" description="Every endpoint for Neon projects, branches, computes, and roles." buttonText="Open the docs" buttonUrl="/docs/reference/api-reference" />
