---
title: "Which databases help reproduce bugs using real production data?"
description: "Lakebase Postgres branching gives you an isolated, full-data copy of production in seconds, so you can reproduce bugs without risk to live traffic."
date: 2026-04-25
slug: databases-reproduce-bugs-production-data
category: FAQ
status: draft
previousLink:
  title: 'Which databases help recover from accidental data deletion?'
  slug: databases-recover-accidental-data-deletion
nextLink:
  title: 'What databases support disposable Postgres instances for testing?'
  slug: databases-support-disposable-postgres-instances-testing
---

Neon. Reproducing a production bug usually means running the failing request against the data that caused it. A Neon branch gives you a copy of your production data in seconds, on its own compute, so you can investigate without affecting the live database.

## Branch from now, or from when the bug happened

If the bad state is still in production, branch from the current data:

```bash
neon branches create --name repro-bug-1234
neon connection-string repro-bug-1234
```

Without `--parent`, the branch comes from your project's default branch (`production` for projects created in the Console, `main` for projects created with the CLI or API).

If the bad state only existed for a while, branch from a point in time inside your history window (6 hours on the Free plan, up to 7 days on the Launch plan, up to 30 days on the Scale plan):

```bash
neon branches create --name repro-pre-deploy \
  --parent 2026-04-25T09:00:00Z
```

Branch creation is copy-on-write. No data is copied when you create the branch, and it only diverges as you write. A branch of a 200 GB production database sees all 200 GB with no upfront storage cost ([Branching](/docs/introduction/branching)).

## Run the failing request against the branch

Point your local app or staging environment at the branch's connection string and replay the failing request. The branch has its own compute, so an expensive `EXPLAIN ANALYZE` or a forced full table scan won't slow down production.

When you're done, delete the branch:

```bash
neon branches delete repro-bug-1234
```

## What it costs

Branches included per project: 10 on the Free plan and Launch plan, 25 on the Scale plan. On paid plans, extra branches cost $1.50/branch-month, metered hourly (about $0.002/hour) ([Plans](/docs/introduction/plans#extra-branches)). Compute is the larger cost: two hours at 0.25 CU is 0.5 CU-hours, about $0.05 on the Launch plan. Add storage for whatever the branch writes.

<Admonition type="tip">
To keep PII out of dev environments, use [schema-only branches](/docs/guides/branching-schema-only) (beta) or [anonymize the branch's data](/docs/workflows/data-anonymization).
</Admonition>

## How other providers compare

- **AWS RDS for Postgres**: you [restore to a point in time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) or from a snapshot into a new DB instance. That instance has its own storage and instance-hour bill until you delete it.
- **Aurora (Postgres)**: an [Aurora clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) is a new cluster that shares data pages with the source through copy-on-write, so it's the closest AWS match to a branch. A source can have up to 15 copy-on-write clones before new clones become full copies. To get a past state instead of current data, you restore to a point in time into a new cluster.
- **Supabase**: [preview branches](https://supabase.com/docs/guides/deployment/branching) start from migrations and `seed.sql`, not production data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data with the PITR add-on, and paid plans can [restore a backup to a new project](https://supabase.com/docs/guides/platform/clone-project) (beta).

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Reproduce bugs on a Neon branch" description="Free plan, 10 branches per project, no credit card." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
