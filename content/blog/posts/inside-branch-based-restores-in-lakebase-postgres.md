---
title: Inside branch-based restores in Lakebase Postgres
description: How to make a past database state queryable without rebuilding it first
excerpt: >-
  Restores are broken in managed OLTP, and they have been broken for a long
  time. They are slow, and they get slower with scale. The databases that need
  recovery most, the large production ones, are the ones left waiting the
  longest.
date: '2026-09-28T12:00:00'
updatedOn: '2026-09-28T12:52:00.000Z'
category: product
categories:
  - product
authors:
  - carlota-soto
cover:
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/cover.jpg
  alt: Inside branch-based restores in Lakebase Postgres
isFeatured: false
seo:
  title: Inside branch-based restores in Lakebase Postgres - Neon
  description: How to make a past database state queryable without rebuilding it first
  keywords: []
  noindex: false
  ogTitle: Inside branch-based restores in Lakebase Postgres - Neon
  ogDescription: How to make a past database state queryable without rebuilding it first
  image: https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/social.jpg
---

<video autoPlay muted loop playsInline width="708" height="326" aria-label="Branch-based restores in Lakebase Postgres">
<source src="https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-clip-1.webm" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-clip-1.mp4" type="video/mp4" />
</video>

Restores are broken in managed OLTP, and they have been broken for a long time. They are slow, and they get slower with scale. The databases that need recovery most, the large production ones, are the ones left waiting the longest.

The usual ways around this are hard and expensive. Extra replicas, extra environments, a DBA on the restore - and even then, you are not fully protected. Failover to a healthy replica helps when a machine dies, but it does not help when the bad write is already on the standby. That still means a restore, and a restore still means hours of downtime or something very close to it.

This pain is tied to the architecture of traditional managed OLTP. Compute and storage ship as one machine, a restore starts with provisioning a new instance (you’re already waiting); snapshots live in object storage while Postgres runs on that volume, so the snapshot still has to be pulled onto disk (more waiting); WAL replay then has to close the gap from snapshot time to the exact recovery timestamp (even more waiting). None of that gets cheaper or faster as the database grows.

The lakebase architecture breaks the monolith and changes the restore mechanics. In the lakebase, compute and storage are decoupled, and database history is already stored in object storage in a way that’s instantly referenceable. In this architecture, a restore does not copy data into a new disk - it simply creates a branch at a timestamp. That is a metadata operation, not a multi-hour copy-and-replay job.

In practical terms: time to restore drops to seconds, even if the database is 100 TB, and it’s as simple that even an agent can do it.

![Branch-based restores in Lakebase Postgres](https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-image-1.jpg)

## The traditional restore path

Traditional Postgres point-in-time recovery is built from two ingredients: a base backup of the files, and archived WAL for everything after that backup. In managed Postgres, that backup is usually a snapshot sitting in object storage.

“Restoring from backup” to a particular moment in time T is actually a process that involves three parts:

1. Deploy a new instance
2. Restore the latest usable snapshot before T
3. Replay WAL from that snapshot up to T

### 1. Deploy a new instance

This involves shipping compute and a storage volumes (coupled) of at least the same as the primary. A small instance can come up in minutes, but large instance with large EBS volumes usually take longer - you’re probably already waiting before even starting the restore process.

### 2. Restore from the snapshot

RDS snapshots live in S3, so “restoring” means getting that snapshot out of object storage and onto Postgres’s disk.

That process is slow at large size, so RDS does not wait for it to be completed before making the restored instance `available`. For large volumes, this happens while most table and index pages are still in S3. But available ddoes not mean the working set is on the Postgres volume. If a query touches a block that is not local yet, the volume fetches it from S3 on the spot while the rest keeps hydrating in the background.

These types of queries come with a latency that’s fine for an internal checkup, but not for production. The restore is only done when the data you actually need lives on the volume, and that is not quick for a large database - we’re talking about hours. The larger the database, the more time this will take.

### 3. Replay WAL to T

The snapshot is only consistent as of snapshot time. To reach T, Postgres still has to replay the transaction logs archived after that snapshot. How long replay takes depends on how much happened between the snapshot and T. A snapshot from an hour ago will be much faster than a snapshot from last night, plus a heavy write day - that’ll be a lot of WAL to replay. This, once again, means a long wait (on top of the instance still hydrating from S3).

## What you are left with

Unless the database is small, PITR is almost always a multi-hour operation. You have to provision the monolith, pull a snapshot out of S3, replay WAL, and wait until enough of the volume is local to take traffic.

For that whole window you are in downtime, or something very close to it. A healthy HA replica can save you if the primary died and the replica still has good data, but it may not save you from PITR - e.g. dropped tables and bad writes might already be on the standby.

## Slow restores cause pains across the board

<video autoPlay muted loop playsInline width="708" height="305" aria-label="Database restore challenges">
<source src="https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-clip-2.webm?v=2" type="video/webm" />
<source src="https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-clip-2.mp4?v=2" type="video/mp4" />
</video>

To put some numbers to that pain: [we asked 50 developers running production Postgres](https://neon.com/restores-survey) about their experience with restores:

- 59% had a critical production failure in the past 12 months
- 30% were down for 3+ hours, some went past half a day
- only 21% recovered in under 60 minutes

If we zoom out to the potential business impact,

- 40% reported significant business interruption
- 52% saw negative customer feedback from the incident
- 72% felt only “somewhat confident” they could recover quickly if a failure happened again

## The alternative: branch-based restores

![The branch-based restore architecture](https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-image-2.jpg)

In the lakebase, a different architecture enables a different path for restores.

### Compute and storage as separate systems

Compute and durable storage are split apart and connected by the WAL:

- Compute runs Postgres - it runs SQL, plans queries, applies MVCC, manages locks, and generates WAL - all the regular Postgres tasks. What it does *not* do is own the durable copy of your data.
- Storage is what owns durability and history, and the job is divided in three parts executed by three distinct components:
  - Safekeepers receive WAL from compute. A transaction is durable once a quorum of safekeepers has acknowledged its WAL record
  - The pageserver turns WAL into the pages Postgres reads. It can reconstruct any page for a given key at a given LSN.
  - Object storage keeps the immutable, long-term history. Compute never reads it directly; the pageserver sits in between.
 
  ![Compute, safekeepers, pageserver, and object storage in Lakebase](https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-image-3.jpg)

[When a write comes in,](https://neon.com/blog/wal-s3-lakebase-storage-for-the-era-of-agents)

1. Postgres changes rows in memory and generates WAL
2. Compute streams that WAL to the safekeepers
3. A quorum acknowledges it, and the transaction is now durable
4. The pageserver later turns that WAL into page versions
5. Those versions land in object storage as immutable history

In this design, the write path takes an interesting shape. The architecture above separates committing a transaction from materializing pages, which in simpler terms means: old page versions are never overwritten. Your database's history piles up as a timeline you can point at, not a single copy you mutate.

### A restore in the lakebase = a branch at a point in time

In the traditional path, a restore mostly means rebuilding that past state into a separate instance. But in the lakebase, since there’s an immutable storage history to reference, that step is unnecessary, and is replaced by a different primitive: a branch.

Where traditional restores provision a new instance and copy data into it, a restore in the lakebase is **a branch at a point in history**. This new branch has its own independent compute, its own connection string, and it can be queried completely independently of production. It is not a replica of the original instance, but it can feel just like it.

It's probably already evident how to use this primitive for a restore:

- When something fails in the main branch,
- You pick a timestamp in the past;
- You can actually inspect that timestamp before committing to a restore, e.g. by running queries;
- Once you've validated it, the control plane maps that timestamp to the exact point in the storage's history (the right LSN), creates that branch, and attaches compute;
- The "restored database" is that new branch, which is available pretty much as soon as you press "deploy", independent of how much data is stored in the underlying database

Since this is the concept that matters, let's reiterate:

### The branch doesn't copy the database

This restore method completely eliminates data copies. The restored branch doesn’t need to copy data; it simply points at the image and delta layers that already exist up to that point in time.

- In a copy-and-replay system, a restore is a data-movement job. The database isn't “there” until the copy and the WAL replay are done.
- In the lakebase, the “database” is already there. A restore is metadata: a pointer to a point in history. All that's left is to expose that point as a branch, with its own compute.

![A restored branch references existing database history](https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-image-4.jpg)

### Restoring 100 TB is as fast as restoring 10 GB

The benefit is that scaling is not operationally scary anymore. If a restore is metadata work, how long it takes does not grow with the size of your data, and the mechanism stays the same.

Independent of how large your database is,

- Reaching an addressable past state is near-instant
- Validating that state takes only as long as the checks and the data you choose to read

A human or an agent can always reach a queryable past state right away after an incident, even on a huge Postgres database.

### Restores become something agents can build on

![Branch-based restores for agent workflows](https://cdn.neonapi.io/public/images/pages/blog/inside-branch-based-restores-in-lakebase-postgres/restores-image-5.jpg)

Restores in the lakebase are a simple operation: create a branch at a timestamp. The loop is short enough that agents can treat it as an ordinary tool call, not only to resolve incidents.

That is the piece [agent platforms](https://neon.com/use-cases/ai-agents) actually productize to build versioning or undo features. A typical loop looks like this:

1. The agent changes the app, which changes the database
2. The platform saves a checkpoint as a [snapshot](https://neon.com/docs/guides/backup-restore) of main. It stores the checkpoint ID next to the code version
3. The user hits undo, or picks an older version in the UI
4. The platform looks up that checkpoint and restores it onto the live branch
5. Schema and data are instantly back to the database version that matches the “old code”

Traditional PITR is too slow and too heavy to support live workflows, but a branch at a timestamp is fast and cheap enough to be part of the product.

## The lakebase architecture changes what recovery looks like

Traditional restores get slower and heavier as the database grows. Branch-based restores do not: history already lives outside compute, so a past point is something you can open as a branch, not something you rebuild. 10 GB or 100 TB, restores looks the same: pick a timestamp, create the branch, attach compute. Failures at scale are no longer scary.

But experiencing it is better than words. Ask your agent to deploy a Lakebase Postgres database, run a restore, and wonder how you’ve been living without this for so long.
