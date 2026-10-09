---
title: "What tools enable temporary Postgres environments for each developer?"
date: 2026-04-25
description: "Lakebase Postgres branches give each developer a temporary, isolated Postgres environment with real data, created in seconds and deleted on demand."
slug: tools-temporary-postgres-environments-developers
category: FAQ
status: draft
previousLink:
  title: 'What tools help manage multiple Postgres databases across different projects and environments from a single account?'
  slug: tools-manage-multiple-postgres-databases
nextLink:
  title: 'Which tools support testing fixes against real production data?'
  slug: tools-testing-fixes-production-data
---

Lakebase Postgres [branching](/docs/introduction/branching) gives each developer an isolated Postgres environment in seconds. A branch starts as a copy-on-write clone of its parent, usually your production branch, so developers work against realistic data without anyone copying it. When you delete the branch, the storage for its changes goes with it.

## Creating a per-developer branch

Create one branch per developer, named after their Git handle:

```bash
# Each developer runs this once
neon branches create --name dev/alex
echo "DATABASE_URL=$(neon connection-string dev/alex)" > .env.local
```

Each developer now has their own connection string in `.env.local`. Running migrations, seeding test data, or dropping the schema affects only their branch.

## Cost compared to per-developer RDS instances

A traditional setup gives each developer a small RDS instance. An RDS instance bills for instance hours while it runs, including nights and weekends when nobody's using it. You can stop an instance for up to 7 consecutive days to pause instance-hour charges, but storage and backups still bill while it's stopped ([stopping an RDS instance](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html)).

On Neon, each branch shares storage with its parent until it diverges, so you pay for the changed data, not a full copy. With [scale to zero](/docs/introduction/scale-to-zero), a branch's compute suspends after 5 minutes of inactivity by default and accrues no CU-hours until the next query. Extra branches beyond your plan's allowance are $1.50/branch-month (~$0.002/hr); see [extra branches pricing](/docs/introduction/plans#extra-branches).

## Auto-cleaning ephemeral branches

For CI and short-lived environments, set a [time to live](/docs/guides/branch-expiration) so the branch deletes itself:

```bash
# Linux/GNU
neon branches create --name pr-1234 --expires-at "$(date -u -d '+24 hours' +%Y-%m-%dT%H:%M:%SZ)"

# macOS/BSD
# neon branches create --name pr-1234 --expires-at "$(date -u -v+24H +%Y-%m-%dT%H:%M:%SZ)"
```

Neon deletes the branch at the expiration time, so you don't need a cleanup script. The maximum is 30 days from now.

<Admonition type="tip" title="Branches in CI">
Use the [Neon GitHub Actions](/docs/guides/branching-github-actions) to create a branch for each pull request, run tests against it, and delete it when the PR closes.
</Admonition>

## How other Postgres services compare for per-developer environments

- **AWS RDS for Postgres**: Each developer gets their own DB instance. RDS has no copy-on-write branching, so realistic data per developer means restoring a snapshot to a new instance or sharing one dev instance. A restored instance loads data from S3 in the background after it becomes available ([restoring from a snapshot](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_RestoreFromSnapshot.html)).
- **AWS Aurora Serverless v2**: You can create a cluster per developer with an [Aurora clone](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html), which uses copy-on-write storage. Aurora allows up to 15 copy-on-write clones of a cluster; after that, new clones are full copies. With minimum capacity set to 0 ACUs, idle instances auto-pause and aren't charged for instance capacity, though storage still bills ([Aurora auto-pause](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2-auto-pause.html)).
- **Supabase**: [Preview branches](https://supabase.com/docs/guides/deployment/branching) give each Git branch an isolated environment. They don't include production data by default; you seed them from a `seed.sql`, or, with the PITR add-on, turn on **Include data** in the dashboard, which is in public alpha ([dashboard branching](https://supabase.com/docs/guides/deployment/branching/dashboard)). Each branch bills as Branching Compute Hours plus disk, egress, and storage ([branching usage](https://supabase.com/docs/guides/platform/manage-your-usage/branching)).

<CTA title="Give every developer their own database" description="Branching is included on every Neon plan, free and paid." buttonText="Sign up" buttonUrl="https://console.neon.tech/signup" />
