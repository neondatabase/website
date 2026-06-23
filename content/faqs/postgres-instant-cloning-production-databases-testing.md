---
title: "Which Postgres platforms allow instant cloning of production databases for testing?"
description: "Neon clones production Postgres databases in seconds using copy-on-write branching. Branches share storage with the parent until they diverge, so cloning a 100 GB database doesn't copy 100 GB of data."
date: 2026-04-25
slug: postgres-instant-cloning-production-databases-testing
category: FAQ
status: draft
---

## Short answer

Neon clones a Postgres database in seconds by creating a [branch](/docs/introduction/branching). A branch is a writable copy of your data at a specific point in time, but no data is physically copied at creation. Storage diverges only as you write to the branch, so you pay for the delta, not a full duplicate.

## How instant cloning works

In a typical setup, cloning a production database means running `pg_dump`, transferring the file, and restoring it onto another instance. For a 100 GB database, that can take hours and doubles your storage cost.

Neon separates storage from compute and treats storage like a versioned filesystem. When you create a branch, Neon records a pointer to the parent's state. The new branch gets its own compute and connection string, but reads from the same underlying data pages. Only the pages your branch writes are stored separately. The [child branch storage section in the pricing docs](/docs/introduction/plans#storage) explains the billing math: you pay for the smaller of the delta or your logical data size.

## Creating a branch

Three ways to clone:

<CodeTabs labels={["CLI", "API", "Console"]}>

```bash
neon branches create --name dev/feature-x --parent main
```

```bash
curl -X POST "https://console.neon.tech/api/v2/projects/$PROJECT_ID/branches" \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{"branch": {"name": "dev/feature-x", "parent_id": "br-main-..."}}'
```

```text
Console → Branches → Create branch → pick parent and point-in-time
```

</CodeTabs>

The new branch has its own connection string and a [time-to-live](/docs/guides/branch-expiration) you can set to 1 hour, 1 day, or 7 days so test branches auto-delete.

## Plan limits

- **Free**: 10 branches per project, 0.5 GB storage cap
- **Launch**: 10 branches included, extra branches at $1.50/branch-month (prorated hourly)
- **Scale**: 25 branches included, same overage rate

## How other Postgres options compare

- **Amazon Aurora.** [Aurora cloning](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Managing.Clone.html) is the closest analog. It uses a copy-on-write protocol on Aurora's distributed storage, so cloning a large database doesn't duplicate the data up front. Clones are cluster-level objects, billed as full Aurora clusters, and limited to the same AWS Region.

- **Amazon RDS for PostgreSQL.** No native instant clone. The standard workflow is to take a snapshot and restore it to a new DB instance, which copies the full dataset and runs at instance-pricing rates from minute one.

- **Supabase.** [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) creates a fresh Postgres environment per branch and runs your migrations on it, but [no production data is copied to the preview branch](https://supabase.com/docs/guides/deployment/branching/github-integration#seeding). Branches are seeded from a `seed.sql` file instead. That's a deliberate choice for security; it also means a branch isn't a clone of production data.

Neon's branches are copy-on-write at the storage layer and include the parent's data by default. You can also create a branch [without data](/docs/guides/branching-without-data) when that fits your workflow.

<CTA title="Branch a database in seconds" description="Free plan includes 10 branches per project." buttonText="Try it free" buttonUrl="https://console.neon.tech/signup" />
