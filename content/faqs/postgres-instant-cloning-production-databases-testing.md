---
title: "Which Postgres platforms allow instant cloning of production databases for testing?"
description: "Neon clones production Postgres databases in seconds using copy-on-write branching. Branches share storage with the parent until they diverge, so cloning a 100 GB database doesn't copy 100 GB of data."
date: 2026-04-25
slug: postgres-instant-cloning-production-databases-testing
category: FAQ
status: draft
previousLink:
  title: 'What Postgres hosting options automatically pause the database when there are no active connections?'
  slug: postgres-hosting-options-auto-pause-database
nextLink:
  title: 'Which Postgres tools support instant rollback after a bad migration?'
  slug: postgres-instant-rollback-tools
---

Neon clones a Lakebase Postgres database in seconds by creating a [branch](/docs/introduction/branching). A branch is a writable copy of your data at a specific point in time, and no data is copied when you create it. Storage grows only as you write to the branch, so you pay for the changes, not a full duplicate.

## How branching works

Without copy-on-write storage, cloning a production database means running `pg_dump`, transferring the file, and restoring it onto another instance. The time grows with the size of the database, and the copy doubles your storage.

The lakebase architecture separates compute from a versioned storage layer. When you create a branch, Neon records a pointer to the parent's state. The branch gets its own compute and connection string but reads the same underlying data pages. Only the pages the branch writes are stored separately, and creating it [adds no load to the parent](/docs/introduction/branching). A child branch is billed for the smaller of its changes or your logical data size ([Neon plans](/docs/introduction/plans)).

## Creating a branch

<CodeTabs labels={["CLI", "API", "Console"]}>

```bash
neon branches create --name dev/feature-x
```

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"branch": {"name": "dev/feature-x", "parent_id": "br-parent-..."}, "endpoints": [{"type": "read_write"}]}'
```

```text
Console → Branches → Create branch → pick parent and point-in-time
```

</CodeTabs>

The CLI command branches from the project's default branch unless you pass `--parent`. In the API call, the `endpoints` array adds the compute you need to connect. To make test branches delete themselves, set an [expiration](/docs/guides/branch-expiration): the Console offers 1 hour, 1 day, or 7 days, and the CLI and API accept any timestamp up to 30 days out.

## Plan limits

- **Free plan**: 10 branches per project, 0.5 GB storage cap
- **Launch plan**: 10 branches included, extra at $1.50/branch-month (metered hourly), up to 5,000 per project
- **Scale plan**: 25 branches included, same overage rate, up to 5,000 per project

## How other Postgres options compare

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) also uses copy-on-write at the storage layer, so cloning a large database doesn't duplicate the data up front, and pages the clone shares with the source are charged to the source. Each clone is a separate DB cluster that needs at least one DB instance, which bills as compute. Clones stay in the source's AWS Region, and after 15 copy-on-write clones the next clone is a full copy.

- **Amazon RDS for Postgres.** No copy-on-write clone. The usual workflow is to restore a snapshot to a new DB instance, which gets its own full-size storage and bills at its instance class rate from the start.

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a separate instance per branch and runs your migrations on it. Preview branches from the GitHub integration start from migrations and `seed.sql` rather than production data. [Dashboard branches](https://supabase.com/docs/guides/deployment/branching/dashboard) (public alpha) have an **Include data** option that copies production data, and it requires the PITR add-on.

Neon branches include the parent's data by default. You can also create a [schema-only branch](/docs/guides/branching-schema-only) when you need the structure without production data.

Vendor details verified on 2026-09-23 against the linked pages.

<CTA title="Branch a database in seconds" description="The Free plan includes 10 branches per project." buttonText="Try it free" buttonUrl="https://console.neon.tech/signup" />
