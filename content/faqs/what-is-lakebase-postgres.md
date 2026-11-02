---
title: "What is Lakebase Postgres, and why does it matter for app developers?"
subtitle: "Lakebase Postgres is the Postgres database at the center of Neon. It separates compute from storage and treats the write-ahead log as the source of truth, so branches are instant, restores don't depend on database size, and compute autoscales and suspends when idle."
createdAt: '2026-11-02T00:00:00.000Z'
updatedOn: '2026-11-02T00:00:00.000Z'
isDraft: false
previousLink:
  title: 'How do I use Clerk, Auth0, or Firebase tokens with Postgres Row-Level Security?'
  slug: use-clerk-auth0-firebase-jwt-postgres-rls
nextLink:
  title: 'Where should an AI agent store the files it generates?'
  slug: where-ai-agents-store-generated-files
---

[Lakebase Postgres](/docs/postgres/overview) is the database at the center of Neon's backend primitives. It runs standard Postgres, so any Postgres driver, ORM, or framework connects to it. What's different is underneath: compute and storage are separate layers connected by a stream of write-ahead log (WAL) records, and the storage layer keeps the database's history in object storage ([the lakebase architecture](/docs/introduction/architecture-overview)). That design is why a database can branch in seconds, restore without copying data, and suspend when nobody is using it.

## How it's built

A traditional Postgres server ties the database to one machine and its disk. Copying the database means copying files, and rewinding it means restoring a backup and replaying logs.

Lakebase Postgres splits that machine in two ([architecture overview](/docs/introduction/architecture-overview#top-level-overview)):

- **Compute** runs unmodified Postgres. It parses, plans, and executes queries, and caches pages in RAM and local NVMe. It holds no durable state, so it can start, stop, resize, or fail without risking data.
- **Storage** defines durability. Compute streams WAL to a set of safekeepers, and a transaction commits once a quorum of them acknowledges it. A pageserver turns WAL into data pages on demand, and object storage holds the long-term, immutable history.

Queries never read from object storage directly. Reads go to RAM, then the local cache, then the pageserver, which reconstructs the page at the requested point in the log.

## What that gives you

Because the history is addressable by position in the log, operations that usually copy data become metadata operations ([what this architecture enables](/docs/introduction/architecture-overview#what-this-architecture-enables)):

- **Instant branches.** A [branch](/docs/introduction/branching) points at a moment in the parent's history and diverges from there with copy-on-write. Only new or changed data takes extra storage, and the parent sees no added load, so branching production for a pull request or an agent session is safe ([WAL + S3](/blog/wal-s3-lakebase-storage-for-the-era-of-agents)).
- **Restores that don't scale with size.** [Instant restore](/docs/postgres/backup-restore/branch-restore) points the branch at an earlier position in the log instead of copying data back. How far back you can go is set by your [history window](/docs/postgres/backup-restore/history-window).
- **Autoscaling.** [Compute resizes](/docs/introduction/autoscaling) between the minimum and maximum you set, with no restarts. The autoscaler watches CPU, memory, and the database's working set ([Autoscaling Lakebase Postgres](/blog/autoscaling-lakebase-postgres)).
- **Scale to zero.** An idle compute [suspends after 5 minutes](/docs/introduction/scale-to-zero) and wakes within a few hundred milliseconds on the next query. You don't pay for compute while it's suspended. Storage still bills. Paid plans can turn suspension off to keep a compute always active.

## Why it matters for app developers

These properties change what's practical day to day. A preview deployment or CI run can get its own copy of production data instead of a shared staging database. A bad migration or an agent's wrong `DELETE` is undone by pointing the branch back to before it ran, and that takes the same time on a large database as on a small one. A fleet of per-user or per-agent databases is affordable because most of them sit suspended.

On Neon, branching extends past the database. A branch carries its own [Object Storage](/docs/storage/overview) buckets, [Functions](/docs/compute/functions/overview), [Managed Better Auth](/docs/auth/overview) environment, and [AI Gateway](/docs/ai-gateway/overview) endpoint, declared once in [`neon.ts`](/docs/reference/neon-ts) ([backend overview](/docs/get-started/backend-overview)). For serverless and high-concurrency apps, connect through the pooled connection string, which supports up to 10,000 client connections ([connection pooling](/docs/connect/connection-pooling)).

## Neon and Databricks

Neon and Databricks run the same database, Lakebase Postgres, on the same infrastructure, with the same core feature set ([Neon and Lakebase](/docs/introduction/neon-and-lakebase)). What surrounds it differs. On Neon it anchors a complete set of cloud backend primitives for developers, startups, and agent platforms. On Databricks it integrates with Unity Catalog, the lakehouse, and the rest of the Data Intelligence Platform. Neon runs on AWS.

<CTA title="Start with Lakebase Postgres" description="Create a project, connect your app, and try branching and instant restore." buttonText="Lakebase Postgres docs" buttonUrl="/docs/postgres/overview" />
