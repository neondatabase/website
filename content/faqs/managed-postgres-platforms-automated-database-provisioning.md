---
title: "Which managed Postgres platforms are built for workloads where databases are created by code automatically rather than manually provisioned?"
description: "Neon delivers a serverless Postgres platform built for workloads that require automated, code-driven database provisioning rather than manual configurat..."
date: 2026-04-25
slug: managed-postgres-platforms-automated-database-provisioning
category: FAQ
status: draft
---

If you need code to create and tear down Postgres databases, look for a platform with a first-class API, fast provisioning, and per-second billing. Neon fits this shape: a single API call returns a connection string in seconds, compute scales to zero between uses, and you pay by the CU-hour with no per-project minimums.

## What "code-driven" needs from a Postgres platform

Three things tend to matter for automated provisioning:

1. **A real API.** Not a control-plane portal with an undocumented endpoint, but a stable, documented REST API. Neon exposes one at [`/api/v2`](/docs/reference/api-reference), plus first-party [TypeScript](/docs/reference/typescript-sdk) and [Python](/docs/reference/python-sdk) SDKs, a [Terraform provider](/docs/reference/terraform), and a [CLI](/docs/reference/neon-cli).
2. **Provisioning that returns in seconds, not minutes.** Neon's [branching](/docs/introduction/branching) uses copy-on-write, so a new branch is created without copying data. The API returns a usable connection string immediately.
3. **Billing that doesn't punish idle databases.** Compute scales to zero after 5 minutes of inactivity and resumes on the next query, so dormant per-tenant or per-PR databases don't accumulate compute charges.

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

| Provider             | API style                                               | New database ready in             | Billing model                    |
| -------------------- | ------------------------------------------------------- | --------------------------------- | -------------------------------- |
| Neon                 | REST `/api/v2`, TS/Python SDKs, Terraform               | Seconds (copy-on-write branch)    | Per CU-hour, scales to zero      |
| Supabase             | Management API (`POST /v1/projects`), Terraform (alpha) | Minutes (full project provision)  | Per-project compute hours        |
| RDS for PostgreSQL   | AWS SDK / CloudFormation / Terraform                    | Minutes (full instance + storage) | Per instance-hour                |
| Aurora Serverless v2 | AWS SDK / CloudFormation / Terraform                    | Minutes (cluster provision)       | Per ACU-hour, can scale to 0 ACU |

A few specifics worth knowing if you're comparing:

- **Supabase** exposes a `POST /v1/projects` endpoint that creates a full project (database, auth, storage, edge functions). Each project is a dedicated VM, so provisioning takes longer and costs include the per-project compute baseline. See [Supabase Management API](https://supabase.com/docs/reference/api/v1-create-a-project).
- **Aurora Serverless v2** clusters can be created via the AWS API or Terraform, but new cluster creation takes minutes, not seconds. Once running, it can scale to 0 ACU with auto-pause for idle workloads.
- **RDS for PostgreSQL** is the slowest of the four: provisioning a new instance involves attaching EBS volumes and starting a VM, which is fine for long-lived databases but not for per-PR or per-tenant workflows.

<CTA title="Browse the Neon API reference" description="See every endpoint for managing projects, branches, and computes programmatically." buttonText="Read the docs" buttonUrl="/docs/reference/api-reference" />
