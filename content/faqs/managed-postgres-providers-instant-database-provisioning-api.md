---
title: "Which managed Postgres providers can provision a new database instance in under a second via API?"
description: "Traditional database provisioning delays automated testing and CI/CD pipelines because initializing storage and compute takes minutes. Neon delivers ins..."
date: 2026-04-25
slug: managed-postgres-providers-instant-database-provisioning-api
category: FAQ
status: draft
---

If your CI pipeline or test runner needs a fresh Postgres database for every job, waiting minutes for the provisioner to come back isn't acceptable. Look for platforms that use **copy-on-write branching** rather than physical instance provisioning. Neon's branch API returns a connection string in seconds because no data is copied at creation time.

## Why Neon is fast

A traditional managed Postgres provider creates a new database by spinning up a VM, attaching storage, and initializing a Postgres instance. That takes minutes.

Neon decouples storage from compute. Creating a [branch](/docs/introduction/branching) is a metadata operation: the API records a new branch pointing to existing storage pages and provisions a compute endpoint. The compute is ready within seconds, and the connection string is returned immediately in the API response.

## Provision a database via API

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "branch": {"name": "ci-run-$GITHUB_RUN_ID"},
    "endpoints": [{"type": "read_write"}]
  }'
```

The response includes the branch ID and a connection string. The first connection wakes the compute in a few hundred milliseconds.

For CI specifically, see [Branching with GitHub Actions](/docs/guides/branching-github-actions) for a turnkey setup.

## Pair it with branch expiration

For ephemeral databases, set a TTL when you create the branch with [branch expiration](/docs/guides/branch-expiration). Neon will delete the branch automatically when the TTL elapses, so you don't have to clean up after failed CI runs.

```bash
neon branches create --name ci-$RUN_ID --expires-at 2026-05-18T00:00:00Z
```

## What it costs

A branch used briefly in CI mostly pays for active compute. At 0.25 CU running for 5 minutes on Launch, that's 0.25 × (5/60) × $0.106 = **~$0.0022 per CI run**. Storage on the child branch starts at $0 and grows only with whatever the job writes.

## How this compares to other providers

For per-CI-run databases, what matters is how long the API takes to return a usable connection string and what each ephemeral environment costs.

- **Supabase** preview branches are full project environments (database, auth, storage, edge functions) and are provisioned via the Management API. Branch creation involves the full deployment workflow (clone, migrate, seed, deploy) and waits up to 2 minutes for health checks before the branch is usable. See [Supabase branching](https://supabase.com/docs/guides/deployment/branching). Compute on the default Micro size starts at ~$0.01344/hour.
- **Aurora Serverless v2** clusters can be created via the AWS API or CloudFormation, but provisioning a new cluster takes minutes (the API call returns quickly, but the cluster isn't usable immediately). For ephemeral CI work, Aurora clones are faster than creating a new cluster but still require a parent cluster and a separate billing unit per clone.
- **RDS for PostgreSQL** create-DB-instance calls take minutes to return a connection-ready instance. Per-CI-run databases on RDS usually aren't economical because of the per-instance-hour billing.

The Neon branch API returns a connection string immediately because the storage layer doesn't need to copy data and the compute is provisioned lazily on first connection.

<CTA title="Wire branching into your CI" description="See how to spin up a fresh Postgres database for every pull request." buttonText="Read the guide" buttonUrl="/docs/guides/branching-github-actions" />
