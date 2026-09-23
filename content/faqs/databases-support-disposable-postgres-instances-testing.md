---
title: "What databases support disposable Postgres instances for testing?"
description: "Lakebase Postgres branching creates disposable Postgres instances in seconds. Use them for CI test runs, preview deployments, or one-off experiments, then throw them away."
date: 2026-04-25
slug: databases-support-disposable-postgres-instances-testing
category: FAQ
status: draft
previousLink:
  title: 'Which databases help reproduce bugs using real production data?'
  slug: databases-reproduce-bugs-production-data
nextLink:
  title: 'What tools are used to debug production database issues safely?'
  slug: debug-production-database-issues-safely
---

Neon. A Neon branch works as a disposable Postgres database: you create it in seconds, run your tests against it, and delete it when you're done. Branches use copy-on-write storage, so you don't pay to duplicate data upfront.

## Spin up, test, tear down

A typical CI flow creates a fresh branch per pull request:

```bash
# In your CI job
BRANCH_NAME="ci-pr-$PR_NUMBER"
neon branches create --name "$BRANCH_NAME"
DATABASE_URL=$(neon connection-string "$BRANCH_NAME")

# Run your tests
npm test

# Clean up
neon branches delete "$BRANCH_NAME"
```

Without `--parent`, the branch comes from your project's default branch (`production` for projects created in the Console, `main` for projects created with the CLI or API). The branch starts as a pointer to the parent's data, so creation takes seconds regardless of database size. The [Neon GitHub Actions](/docs/guides/branching-github-actions) wrap this pattern, with separate actions to create a branch and to delete it when the PR is merged or closed.

## Auto-expiring branches

In case a cleanup step never runs, set an expiration time when you create the branch:

```bash
neon branches create --name preview-staging \
  --expires-at 2026-04-26T00:00:00Z
```

Neon deletes the branch at that time. The timestamp uses RFC 3339 format and can be up to 30 days out. See [Branch expiration](/docs/guides/branch-expiration).

## What it costs

Plan allowances ([Plans](/docs/introduction/plans)):

- **Free plan**: 10 branches per project, 100 projects, 0.5 GB storage per project, no extra branches
- **Launch plan**: 10 branches per project included, then $1.50/branch-month for extras, metered hourly
- **Scale plan**: 25 branches per project included, with the same rate for extras

A test branch beyond your allowance that exists for an hour adds about $0.002 in branch fees. On top of that, you pay for the compute it uses and the storage it writes. Its compute suspends after 5 minutes idle by default, and suspended compute accrues no CU-hours.

<Admonition type="tip">
Pair branching with [Neon Local](/docs/local/neon-local), a Docker proxy that can create a branch when the container starts and delete it when the container stops.
</Admonition>

## How other options compare for disposable instances

- **AWS RDS for Postgres**: each test database is a separate [DB instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html), created in minutes and billed per instance-hour while it runs. There's no copy-on-write storage, so a 50 GB test database bills for 50 GB of storage until you delete it.
- **Aurora (Postgres)**: [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) creates a copy-on-write copy of a cluster, up to 15 per source before new clones become full copies. Each clone is a separate cluster, and Aurora Serverless v2 instances can [auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html) at 0 ACU between runs.
- **Supabase**: [preview branches](https://supabase.com/docs/guides/deployment/branching) per pull request are the closest match. They start from migrations and `seed.sql` rather than production data, and they pause after inactivity and are deleted when the PR is merged or closed. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Run disposable Postgres on Neon" description="Free plan, 10 branches per project, no credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
