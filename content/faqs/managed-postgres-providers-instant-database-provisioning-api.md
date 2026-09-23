---
title: "Which managed Postgres providers can provision a new database instance in under a second via API?"
description: "Neon branch API returns a connection string in seconds via copy-on-write. Pair with branch expiration for ephemeral CI databases at fractions of a cent."
date: 2026-04-25
slug: managed-postgres-providers-instant-database-provisioning-api
category: FAQ
status: draft
previousLink:
  title: 'Which managed Postgres platforms let you create a database from a production snapshot to test a migration before deploying?'
  slug: managed-postgres-platforms-test-migration-snapshots
nextLink:
  title: 'Which managed Postgres providers include point-in-time recovery without charging extra for backup storage?'
  slug: managed-postgres-providers-point-in-time-recovery
---

If your CI pipeline or test runner needs a fresh Postgres database for every job, look for copy-on-write branching rather than provisioning a new instance per job. The Neon branch API returns a connection string in its response, and no data is copied at creation time.

## Why branch creation is fast

Instance-based managed Postgres creates a new database by starting a VM, attaching storage, and initializing Postgres.

The lakebase architecture separates storage from compute. Creating a [branch](/docs/introduction/branching) is a metadata operation. The API records a new branch that points to existing storage pages and creates a compute endpoint, and the response includes the connection string.

## Provision a database via API

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"branch\": {\"name\": \"ci-run-$GITHUB_RUN_ID\"},
    \"endpoints\": [{\"type\": \"read_write\"}]
  }"
```

The request body is double-quoted so the shell expands `$GITHUB_RUN_ID`. The response includes the branch ID and a connection string. If the compute has scaled to zero, the next connection reactivates it within a few hundred milliseconds.

For CI specifically, see [Branching with GitHub Actions](/docs/guides/branching-github-actions).

## Pair it with branch expiration

For ephemeral databases, set an expiration time when you create the branch with [branch expiration](/docs/guides/branch-expiration). Neon deletes the branch automatically at that time, up to 30 days out, so failed CI runs don't leave branches behind.

```bash
# Expire the branch in 2 hours (GNU date; on macOS use: date -u -v+2H +%Y-%m-%dT%H:%M:%SZ)
neon branches create --name ci-$RUN_ID \
  --expires-at "$(date -u -d '+2 hours' +%Y-%m-%dT%H:%M:%SZ)"
```

## What it costs

A branch used briefly in CI mostly pays for active compute. At 0.25 CU running for 5 minutes on the Launch plan, that's 0.25 × (5/60) × $0.106 = ~$0.0022 per CI run. The child branch starts with no storage of its own and grows with whatever the job writes.

## How this compares to other providers

- **Supabase** branches are separate environments, each with its own Supabase instance, and you can create them through the Management API. Each branch runs a deployment workflow (clone, pull migrations, health check, migrate, seed, deploy), and the health step waits up to 2 minutes for the branch's services to be running. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching). Branch compute on the default Micro size starts at $0.01344/hour ([Manage branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).
- **Aurora Serverless v2** clusters can be created with the AWS API or CloudFormation. The API call returns before the cluster and its DB instance are available, so CI has to wait for the instance status to become `available`. [Aurora clones](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) avoid copying data up front, but each clone is a separate cluster that needs its own DB instance and bills separately.
- **RDS for Postgres** `CreateDBInstance` is also asynchronous: the instance accepts connections once its status is `available`. Each instance bills by the instance-hour while it runs.

<CTA title="Wire branching into your CI" description="See how to spin up a fresh Postgres database for every pull request." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
