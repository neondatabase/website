---
title: "Which managed Postgres platforms are built for workloads where databases are created by code automatically rather than manually provisioned?"
description: "Neon's API creates copy-on-write branches in seconds with per-CU-hour billing and scale-to-zero, so code can provision and tear down databases safely."
date: 2026-04-25
slug: managed-postgres-platforms-automated-database-provisioning
category: FAQ
status: draft
previousLink:
  title: 'What managed Postgres options let you run ten databases for less than the cost of one always-on instance?'
  slug: managed-postgres-options-ten-databases-cost
nextLink:
  title: 'Which managed Postgres platforms let development and staging environments cost nothing when developers are not working?'
  slug: managed-postgres-platforms-free-development-staging-environments
---

If code creates and tears down your Postgres databases, look for a documented API, provisioning that doesn't copy data, and compute billing that stops when a database is idle. On Neon, a single API call returns a connection string, compute scales to zero between uses, and you pay by the CU-hour with no monthly minimum.

## What code-driven provisioning needs

1. **A documented API.** Neon exposes a REST API at [`/api/v2`](/docs/reference/api), plus first-party [TypeScript](/docs/reference/typescript-sdk) and [Python](/docs/reference/python-sdk) SDKs, a [Terraform provider](/docs/reference/terraform), and a [CLI](/docs/cli).
2. **Provisioning that doesn't copy data.** [Branching](/docs/introduction/branching) on Neon uses copy-on-write, so a new branch is created without copying data, whatever the size of the parent. The create-branch response includes the connection string.
3. **Compute billing that stops when a database is idle.** Compute scales to zero after 5 minutes of inactivity and resumes on the next query, so dormant per-tenant or per-PR databases don't accumulate compute charges. Storage continues to bill on paid plans.

## Example: create a branch from a script

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"branch": {"name": "pr-1234"}, "endpoints": [{"type": "read_write"}]}'
```

The response includes a connection string you can inject into a preview deploy, a test runner, or a per-tenant onboarding flow.

## Workflows this enables

- **Per-PR preview databases** via the [Vercel integration](/docs/guides/vercel-overview) or [GitHub Actions](/docs/guides/branching-github-actions)
- **Per-tenant databases** for multi-tenant SaaS, provisioned at user signup
- **Per-test-run databases** in CI, created at job start and deleted at job end with [branch expiration](/docs/guides/branch-expiration)
- **AI agent workflows** where a code-gen agent needs an isolated database to validate a migration before merging

## How other providers handle programmatic provisioning

| Provider             | API style                                               | What a new database is               | Billing model                    |
| -------------------- | ------------------------------------------------------- | ------------------------------------ | -------------------------------- |
| Neon                 | REST `/api/v2`, TS/Python SDKs, Terraform               | Copy-on-write branch or new project  | Per CU-hour, scales to zero      |
| Supabase             | Management API (`POST /v1/projects`), Terraform (alpha) | New project on its own VM            | Per-project compute hours        |
| RDS for Postgres     | AWS SDK / CloudFormation / Terraform                    | New DB instance with its own storage | Per instance-hour                |
| Aurora Serverless v2 | AWS SDK / CloudFormation / Terraform                    | New cluster and instance             | Per ACU-hour, can scale to 0 ACU |

- **Supabase** exposes a `POST /v1/projects` endpoint that creates a full project (database, auth, storage, edge functions). Each project runs its own Postgres instance on a [dedicated VM](https://supabase.com/docs/guides/platform/compute-and-disk), and on paid plans each project bills compute hourly. See the [Supabase Management API](https://supabase.com/docs/reference/api/v1-create-a-project).
- **Aurora Serverless v2** clusters can be created with the AWS API or Terraform. With the minimum capacity set to 0 ACUs, an idle cluster [pauses automatically](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html).
- **RDS for Postgres** provisions a new DB instance with its own EBS storage for each database, billed by the instance-hour while it runs. That suits long-lived databases better than short-lived per-PR databases.

<CTA title="Browse the Neon API Reference" description="See every endpoint for managing projects, branches, and computes programmatically." buttonText="Read the docs" buttonUrl="/docs/reference/api" />
