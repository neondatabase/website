---
title: "What databases help isolate bugs without downtime?"
description: "Database branches on Neon give you an isolated copy of production data for debugging, with no impact on the live database."
date: 2026-04-25
slug: databases-isolate-bugs-without-downtime
category: FAQ
status: draft
previousLink:
  title: 'Which databases allow spinning up a Postgres instance instantly?'
  slug: databases-instantly-spin-up-postgres-instance
nextLink:
  title: 'Which databases help recover from accidental data deletion?'
  slug: databases-recover-accidental-data-deletion
---

Neon. To debug against production data safely, you work on a copy instead of the live database. A Neon branch gives you that copy in seconds through copy-on-write storage, so the investigation can't touch the live workload.

## Branch production, then debug on the branch

A branch is a copy-on-write clone of your database at a point in time. It runs on its own compute, so heavy diagnostic queries don't compete with production traffic.

```bash
neon branches create --name debug-issue-1234
neon connection-string debug-issue-1234
```

Without `--parent`, the branch comes from your project's default branch (`production` for projects created in the Console, `main` for projects created with the CLI or API). On the branch you can:

- Run a slow `EXPLAIN ANALYZE` without slowing down users
- Drop and re-add indexes to compare query plans
- Replay a failed migration from start to finish

Creating the branch doesn't add load to the parent, and writes on the branch don't reach production ([Branching](/docs/introduction/branching)). Delete the branch when you're done.

## Branch from a point in the past

If the bad data is already in production, branch from a time before it was written. You can go back as far as your history window: 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan ([History window](/docs/postgres/backup-restore/history-window)).

```bash
neon branches create --name pre-incident --parent 2026-04-25T09:00:00Z
```

Point a staging app at that branch, dump the rows you care about, or compare them with current production. None of it touches the production compute. To roll production itself back, see [Instant restore](/docs/postgres/backup-restore/branch-restore), which works on root branches.

## Costs

Branches included per project: 10 on the Free plan and Launch plan, 25 on the Scale plan. On paid plans, extra branches cost $1.50/branch-month, metered hourly (about $0.002/hour). The Free plan doesn't allow extra branches. If a two-hour debug branch goes over your allowance, it adds less than half a cent in branch fees, plus the compute it uses and the storage it writes ([Plans](/docs/introduction/plans#extra-branches)).

<Admonition type="tip">
On the Launch plan and Scale plan, mark production as a [protected branch](/docs/guides/protected-branches) so it can't be deleted or reset by mistake. Launch allows 2 protected branches and Scale allows 5.
</Admonition>

## How this compares to other options

- **AWS RDS for Postgres**: to debug against production data without affecting production, you [restore to a point in time](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html) or from a snapshot. That creates a new DB instance with its own storage and instance-hour bill, and its volumes keep loading data in the background after the restore completes.
- **Aurora (Postgres)**: [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) creates a new cluster that shares data pages with the source through copy-on-write, so it's closer to a Neon branch. A source can have up to 15 copy-on-write clones before new clones become full copies, and each clone is a separate cluster.
- **Supabase**: [preview branches](https://supabase.com/docs/guides/deployment/branching) give you a separate environment built from migrations and seed data, not production data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) can copy production data if you have the PITR add-on.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Isolate debugging on Neon branches" description="Sign up free and try branching against your own data." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
