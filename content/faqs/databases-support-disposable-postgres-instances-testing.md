---
title: "What databases support disposable Postgres instances for testing?"
description: "Neon's branching creates disposable Postgres instances in seconds. Use them for CI test runs, preview deployments, or one-off experiments, then throw them away."
date: 2026-04-25
slug: databases-support-disposable-postgres-instances-testing
category: FAQ
status: draft
---

Neon's branches are well suited for disposable Postgres environments. You create a branch in seconds, run your tests against it, and delete it when you're done. Because branches use copy-on-write storage, you don't pay to duplicate data upfront.

## Spin up, test, tear down

A typical CI flow creates a fresh branch per pull request:

```bash
# In your CI job
BRANCH_NAME="ci-pr-$PR_NUMBER"
neon branches create --name "$BRANCH_NAME" --parent main
DATABASE_URL=$(neon connection-string "$BRANCH_NAME")

# Run your tests
npm test

# Clean up
neon branches delete "$BRANCH_NAME"
```

The branch starts as a pointer to the parent's data, so creation takes seconds regardless of database size. The Neon [GitHub Action](https://neon.com/docs/guides/branching-github-actions) wraps this pattern and handles cleanup for you.

## Auto-expiring branches

If you forget to delete a branch, you can set a TTL at creation time:

```bash
neon branches create --name preview-staging \
  --parent main \
  --expires-at 2026-04-26T00:00:00Z
```

The branch is deleted automatically at the expiration time. See [Branch expiration](https://neon.com/docs/guides/branch-expiration).

## What it costs

Plan allowances:

- **Free**: 10 branches per project, 100 projects, 0.5 GB storage per project
- **Launch**: 10 branches included, $1.50/branch-month for extras (prorated hourly)
- **Scale**: 25 branches included, same overage rate

A short-lived test branch that exists for an hour costs about $0.002 in branch fees, plus compute (suspended after 5 minutes of idle on Free and Launch) and any storage written during the test.

<Admonition type="tip">
Pair branching with [Neon Local](https://neon.com/docs/local/neon-local) to run integration tests against a real Neon branch from a Docker container.
</Admonition>

## How other options compare for disposable instances

- **AWS RDS for PostgreSQL**: each test database is a separate [DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html), provisioned in minutes and billed per instance-hour while it exists. No copy-on-write storage, so seeding a 50 GB test database means paying for 50 GB of EBS until you delete it.
- **Aurora Serverless v2**: starts faster than RDS and can scale to zero ACUs once provisioned, but creation is still cluster-level. Setting up one per PR is heavier than a Neon branch.
- **Supabase**: [preview branches](https://supabase.com/docs/guides/deployment/branching) per pull request are the closest analog. They don't carry data from your main project, so disposable test data has to come from a `seed.sql` file or your own migration scripts.

Neon's branch model fits the disposable-instance pattern because creation is fast, the test environment carries real data shapes from production, and an unused branch stops billing compute once it scales to zero (storage for the branch's writes continues to bill).

<CTA title="Run disposable Postgres on Neon" description="Free plan, 10 branches per project, no credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
