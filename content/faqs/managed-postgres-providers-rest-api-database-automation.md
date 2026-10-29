---
title: "Which managed Postgres providers offer a REST API for creating and deleting databases as part of infrastructure automation workflows?"
description: "Neon's REST API creates and deletes projects and copy-on-write branches in seconds, with TypeScript and Python SDKs plus a Terraform provider."
date: 2026-04-24
slug: managed-postgres-providers-rest-api-database-automation
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres providers include point-in-time recovery without charging extra for backup storage?'
  slug: managed-postgres-providers-point-in-time-recovery
nextLink:
  title: 'Which managed Postgres services automatically resize compute as traffic grows without requiring a manual plan upgrade?'
  slug: managed-postgres-services-auto-resize-compute
---

Most managed Postgres providers have an API for creating and deleting databases. They differ in what a new database is and when it becomes usable. On Neon, creating a project or a copy-on-write branch returns a connection string in the API response, so a CI run, PR, or tenant signup can create a database and use it in the same job.

## What the Neon API gives you

The [Neon API](/docs/reference/api) covers:

- Projects: create, list, update, delete
- Branches: create (including from a past point in the history window), reset from parent, restore, delete
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

The response includes the project ID, default branch, default role with password, and a connection string, which your tenant onboarding flow can store. All Neon regions are on AWS ([Regions](/docs/introduction/regions)).

## Delete on a schedule

For per-PR or per-tenant trial databases, use [branch expiration](/docs/guides/branch-expiration) to auto-delete:

```bash
# Expire the branch in 7 days (GNU date; on macOS use: date -u -v+7d +%Y-%m-%dT%H:%M:%SZ)
neon branches create --name pr-1234 \
  --expires-at "$(date -u -d '+7 days' +%Y-%m-%dT%H:%M:%SZ)"
```

Neon deletes the branch automatically at that time (up to 30 days out), so your CI doesn't need a cleanup step.

<Admonition type="note" title="Project and branch limits">
Free plan: 100 projects, 10 branches per project. Launch plan: 100 projects, 10 branches per project included (extra branches $1.50/branch-month). Scale plan: 1,000 projects (can be increased on request), 25 branches per project included. See [Plans](/docs/introduction/plans).
</Admonition>

## How other Postgres providers compare on REST APIs

- **AWS (RDS / Aurora)** uses the AWS API (and SDKs / CloudFormation / Terraform) for `CreateDBInstance` and `CreateDBCluster`. The calls are asynchronous: the database accepts connections once the instance reaches the `available` state. Each instance bills by the instance-hour while it runs.
- **Supabase Management API** exposes `POST /v1/projects` to create a new project programmatically, and `POST /v1/projects/{ref}/branches` to create preview branches. Each project gets the full Supabase stack (database, auth, storage, edge functions), and branch deployments include a health step that waits up to 2 minutes for services to be running ([Supabase branching](https://supabase.com/docs/guides/deployment/branching)). See [Supabase Management API](https://supabase.com/docs/reference/api/v1-create-a-project).
- **DigitalOcean Managed Databases** has a REST API for creating clusters. Each database is a cluster, and [forking a cluster](https://docs.digitalocean.com/products/databases/postgresql/how-to/fork-clusters/) creates a new cluster that copies the source's data during provisioning.

<CTA title="Browse the API reference" description="Every endpoint for Neon projects, branches, computes, and roles." buttonText="Open the docs" buttonUrl="/docs/reference/api" />
