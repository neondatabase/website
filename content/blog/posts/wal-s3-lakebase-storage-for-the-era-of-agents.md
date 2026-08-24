---
title: 'WAL + S3: Lakebase storage for the era of agents'
description: >-
  How treating WAL as the source of truth changes the way you work with Postgres
  (a deep dive)
excerpt: >-
  Agents treat code as lightweight: branch it, deploy it, throw it away. The
  infrastructure under that code should work the same way. Working with an OLTP
  database is traditionally heavy and full of friction, but very little of that
  is a Postgres problem.
date: '2026-08-24T12:00:00'
updatedOn: '2026-08-24T12:40:00'
category: engineering
categories:
  - engineering
  - product
authors:
  - carlota-soto
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: 'WAL + S3: Lakebase storage for the era of agents - Neon'
  description: >-
    How treating WAL as the source of truth changes the way you work with
    Postgres (a deep dive)
  keywords: []
  noindex: false
  ogTitle: 'WAL + S3: Lakebase storage for the era of agents - Neon'
  ogDescription: >-
    How treating WAL as the source of truth changes the way you work with
    Postgres (a deep dive)
  image: null
---

Working with an OLTP database is traditionally heavy and full of friction, but very little of that is a Postgres problem. Most of it is a storage problem: deployments, copies, restores, and replicas all mean moving large volumes of data around, and that is slow and expensive.

The polar opposite is object storage. S3 is cheap, performant, almost invisible to operate. That is why the storage question keeps returning - can object storage sit underneath Postgres and make it lighter to work with?

This question is what started Neon. The answer depends less on S3 itself and more on where do you place the source of truth.

## Two ways to think about a database

The usual mental model for OLTP is data-centric. Data is organized into tables with rows and columns, each representing an entity. Storage is the place where the current state lives, and the database's job is to store and retrieve it. This model has produced excellent software.

But there is a second model: transaction-centric. Here the database is a journal of transactions. Each entry is an operation, and storage is a timeline of those operations rather than a snapshot of the present. The current state is one thing you can derive from the timeline.

For years the data-centric model was the only one that mattered in practice, because the operations people asked of a database were reads and writes against the present. That has changed. The operations that agent workloads ask for are almost all operations on history:

- Give me an isolated copy of production to work in
- Put it back the way it was before my last three statements
- Show me what this table looked like before the migration
- Run twenty of these at once, and delete nineteen of them in an hour

These are all queries about the timeline. A database that only stores the present has to fake them with copies and backups, which is why they are slow and expensive everywhere else.

The thing is, Postgres already contains this timeline: it is called the write-ahead log.

## The writing in the WAL

Postgres’ WAL records every modification before it reaches the data files. It originally existed so Postgres could recover: if the server died between the log write and the data file write, a WAL replay closed the gap.

But WAL contents are interesting far beyond recovery. Take a table and an insert:

```
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255),
  email VARCHAR(255)
);
INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
```

Before that change reaches the users table on disk, Postgres appends it to the WAL.

```
rmgr: Transaction  lsn: 0/03000020  desc: BEGIN
rmgr: Heap         lsn: 0/03000040  desc: INSERT, blkref #0: rel 1664/0/2600 blk 5
rmgr: Btree        lsn: 0/03000080  desc: INSERT_LEAF, blkref #0: rel 1664/0/2602 blk 4
rmgr: Transaction  lsn: 0/030000A0  desc: COMMIT 2024-04-20 10:00:00.123456 EST
```

These are four records, and one transaction. Note how each has an LSN (log sequence number), a monotonically increasing identifier.

The heap and btree lines also name the exact page that changed. The log does not say "a row was added" - it says which page, in which relation, at which point in the timeline.

Read this as a recovery mechanism and it is a list of work to redo after a crash. But if you read it as a transaction journal, it is something else - a complete, ordered, byte-level account of every page the database has ever changed, with a unique name on every entry.

That name, the LSN, is the part that matters most. It means the timeline is already addressable. Nothing needs to be added to Postgres to make "the database as of a point in time" a well-defined thing. It only needs a storage layer that keeps the log around and can answer questions against it.

## Making the log the source of truth

In a conventional Postgres deployment, the WAL is a means to an end. Storage is a disk attached to the machine running Postgres, and everything about the database's identity is tied to that machine.

Now, let’s invert it. Make the log the database, and the data files a derived, cached representation of it. Then you can keep the full timeline, and you no longer have to move data to copy or rewind the database. History becomes addressable, so a database “copy” becomes a pointer instead of a second set of files. This makes deployments, restores, and replicas cheap enough to treat like code.

That’s what we did in [Lakebase Postgres](https://neon.com/docs/postgres/overview). We split the system into two layers:

### The compute layer

Compute in Lakebase Postgres runs standard Postgres: it parses SQL, plans and executes queries, enforces MVCC, manages locks and indexes. Nothing in the query engine is rewritten - what changes vs traditional Postgres is what the compute node is responsible for: it exists to execute work, not to preserve data. It has RAM for shared buffers and local NVMe as a page cache, and it can start, stop, scale, or die at any moment without putting durability at risk.

### The storage layer

The storage layer owns correctness, durability, and history. It outlives any individual compute node, and it is built from three components with distinct jobs:

- Safekeepers - to replicate the WAL. When the compute node generates WAL records, it streams them to several safekeepers, and a transaction is committed once a quorum acknowledges the record through [a Paxos-based protocol](https://neon.com/blog/paxos). Durability is a property of replication and consensus rather than of one machine's fsync.
- Pageservers - to turns WAL into pages. Another component called the Pageserver combines base pages with committed WAL records to materialize the version of a page that a given query needs, and it persists those materialized versions into object storage asynchronously.
- Object storage - where the immutable history is stored. S3 stores materialized page versions and historical states, kept as an append-only record rather than a mutable filesystem.

Let's take a look in more detail. 

## How requests move through storage

### The write path

A commit in this system looks like this:

1. Postgres applies changes in memory. Buffers are updated, indexes are modified, WAL records are generated exactly as usual.
2. Instead of flushing WAL to a local filesystem, the compute node streams it over the network to the safekeepers.
3. The transaction is committed once a quorum of safekeepers has acknowledged the record. That is the point where the client hears success.
4. Page materialization happens afterward, in the storage layer, off the transaction's critical path. A commit never waits for pages to be written or uploaded.

### The read path

Reads are a central operation in this architecture. When the compute node asks storage for a page, the request carries a page identifier and an LSN, and storage returns that page as it existed at that LSN. That call is `GetPage@LSN`. Serving it fast is the key.

When Postgres needs a page, it tries local first:

1. First hits RAM, as in any Postgres
2. If it cannot be served with RAM, then comes the local NVMe cache - still fast, still local
3. If there's a local miss, the request crosses the network into the pageserver. The pageserver then checks whether it already has that page version materialized. If not, it finds the most recent image of the page at or before the requested LSN, collects the WAL records on top of it, replays them, and returns the reconstructed page. The returned page is then cached in RAM and on NVMe, so the next read of it is local again.

A primary node asks for the latest version of every page, so in steady state it behaves like any Postgres reading from a warm cache. But nothing in the protocol requires "latest." Ask for a page at an LSN from four hours ago and you get that page from four hours ago.

The crucial consequence is that the distinction between live data and historical backups disappears. There is one storage system. Old page versions are not a separate artifact kept somewhere else in a different format; they are the same immutable files, still addressable.

### Non-overwriting

In other words, the pageserver never updates a file in place. Files are created, merged, and deleted, but never modified. This is a perfect fit for object storage, which does not offer random updates, and that makes history cheap enough to keep.

In this design, "data" is actually organized into two kinds of layer files:

- An image layer holds a snapshot of every key in a key range at one LSN
- A delta layer holds all the changes in a key and LSN range. Incoming WAL is written out as delta layers.

Image layers are produced in the background, for two reasons: they shorten the replay chain a read has to walk, and they make old deltas collectable. Without them, reconstructing a page could require walking back arbitrarily far.

So GetPage@LSN becomes a search: 
1. start at the requested key and LSN
2. walk down through the layers collecting WAL records for that page
3. and stop at the first image of it
  
## Finding the right layer, quickly

The search described above sounds simple, but it is not. It is worth spending some time on, since it determines whether the whole design is viable.

A read names a key and an LSN. The storage system has to find the nearest layer that covers that key at or before that LSN. That is a geometric problem, and it is not obvious how to solve it across tens of millions of layers. A linear scan is far too slow, and the obvious spatial structures do not fit: R-trees answer containment queries rather than "the first layer below this point," and segment trees scale with the size of the coordinate space rather than with the number of layers.

We tried several approaches. What ended up working was to solve the easy problem first, then make the data structure remember its own past.

### Step one: solve it for a single LSN

For one fixed LSN, we work out which layer answers each key. That answer only changes at a handful of points across the key space, so we record those points and store them in a binary search tree. That tree is the layer coverage for that LSN, and it answers any read at that LSN with a single lookup.

This works, but only for one LSN. Coverage changes every time a layer is added, and there are millions of LSNs, so we cannot build and keep a separate tree for each one.

### Step two: make the tree persistent

Persistent as in, “keep the old versions available”. We build the coverage incrementally, inserting layers in LSN order from the bottom up. Inserting one layer only touches the nodes along a single path from the root downward. Instead of overwriting those nodes, the system copies them and leaves the originals untouched. The new copies point at the old, unchanged subtrees on either side.

Two things follow from that:

- The insert costs a handful of new nodes rather than a whole new tree, because everything off the path is shared
- The old root still describes the tree exactly as it was before the insert, so it remains a valid coverage for the earlier LSN.

We do that for every layer, in order, and we end up with a single structure that contains every intermediate root, each one the coverage at a different LSN. We get all of those trees for close to the price of one.

A historical read then costs the same as a current one: the system picks the root for the LSN you want, and does the same single lookup.

That is the trick, in summary:

- Latest-only reads are one tree lookup
- Historical reads use an older root, so they cost the same
- Building those roots stays cheap as layers accumulate, so a long history does not make lookups slower

## Where object storage actually sits

This is where the current argument about Postgres and object storage tends to go wrong, in both directions.

The classic argument against building OLTP on object storage looks like this:

- Postgres processes many small, latency-sensitive I/Os,
- but object storage is built for larger requests at higher latency, and a read from it can take hundreds of milliseconds,
- therefore if you put S3 in front of query execution, the result is a slow database.

In on itself, that is not a controversial claim. What the argument gets wrong is the assumption that a database built on object storage must be reading from object storage to answer queries.

In the architecture we’re proposing, it never does:

- Queries do not read object storage. The compute node reads RAM, then local NVMe, then the pageserver. Object storage is read only inside the pageserver, only when reconstructing a page version it does not have, and never by Postgres directly.
- Commits do not write object storage. A commit is acknowledged when a quorum of safekeepers has the WAL record, materializing pages and uploading them happens afterward.

<Admonition type="note" title="A new kind of database">
A Postgres built this way sits far enough from the traditional architecture that it needs its own product category. That’s what we’ve called a [lakebase](https://www.databricks.com/blog/what-is-a-lakebase): an OLTP database where compute and storage are decoupled, and the durable source of truth is built on object storage.

Consistently with this category, we’re calling our database [Lakebase Postgres](https://neon.com/docs/postgres/overview).
</Admonition>

## What the lakebase brings to Postgres

When you design Postgres as a lakebase, the transaction history is addressable by LSN, and copies are references rather than data. That makes it possible to build features that give Postgres the lightweight workflow we were looking for at the start of this post, which is an absolute requirement for agents.

### Branching

First, Postgres can [branch](https://neon.com/docs/introduction/branching) now. Creating a branch does not copy pages, it creates a pointer to a specific LSN, and the branch begins diverging from there with copy-on-write semantics.

Writes to the branch are stored as deltas against the parent, so a branch of a 2 TB database is created in seconds and costs nothing until it changes something. The parent sees no additional load, which is why this is safe to do against production.

This is what an agent needs to work safely. It can take a branch per task, run the migration it just wrote against real data at real volume, and inspect the result before anything touches the parent. Twenty agents can do that at once, each isolated from the others and from production.

<Admonition type="note" title="Extending branching to the backend">
On Neon, branching now extends past the database: Object Storage buckets, Functions, Managed Better Auth state, and AI Gateway configuration branch alongside it, so a branch is an isolated copy of the backend rather than just the Postgres tables.
</Admonition>

### Instant restore

Point-in-time recovery is branching with a different intent. Restoring means pointing at an earlier LSN and resuming from there, so it does not involve copying data back into place and its cost does not scale with database size. How far back you can go is a [retention setting](https://neon.com/docs/introduction/history-window).

This is what makes an agent's mistakes cheap. When an agent runs the wrong statement, the answer is not a restore window and a recovery plan, it is pointing the branch back at the LSN from before it ran. Undo costs the same on a 2 TB database as on an empty one, so an agent can retry instead of escalating to a human.

### Time travel queries

Because the pageserver can reconstruct any page at any LSN inside the history window, you can query a past state directly instead of restoring it first.

The practical use is diffing: what did this table look like before the migration, and what does it look like now. It is also how you confirm you picked the right timestamp before committing to a restore.

### Read replicas without replicas

A read-only compute node is not a copy of the data. It requests pages from the same storage layer as the primary, so adding one does not mean provisioning a dataset and waiting for it to catch up. Spinning one up is a metadata operation.

### Scale to zero

Since durable state lives outside compute, an idle compute node can be shut down entirely rather than left running to protect data. Computes [suspend](https://neon.com/docs/introduction/scale-to-zero) after 5 minutes of inactivity and reactivate within a few hundred milliseconds on the next query. For a fleet of per-session or per-branch databases, most of which are idle most of the time, this is the difference between a viable cost model and an unviable one. Note that compute stops billing while suspended; storage continues to be billed, because the history is still there.

An agent session that works for four minutes and goes quiet stops drawing compute cost five minutes later, with nobody having to tear it down. That is what makes a database per agent, or per session, or per branch, affordable enough to be the default.

## One copy for transactions and analytics

There is another consequence of putting operational data in object storage, and it is the reason the lakebase category is called what it is.

Once the durable record of a transactional database lives in commodity object storage, it stops being locked inside one engine's private format on one engine's disks. Other engines can read it. That is the basis for what we call [LTAP, for Lake Transactional/Analytical Processing](https://www.databricks.com/blog/lakebase-ltap-rethinking-database-storage): instead of two copies of the data in two formats kept in sync by a pipeline, there is one durable copy in open columnar formats that both the transactional and analytical sides read.

The mechanism follows from the read path already described. As the pageserver materializes pages into object storage, it transcodes them from Postgres row format into columnar form, preserving the exact Postgres representation of every value. An analytical query asks Postgres for the current LSN, which is a cheap metadata lookup, reads the great majority of the data from object storage as of that LSN, and fetches only the most recent unmaterialized changes from the pageserver. Postgres serves none of the analytical read traffic beyond returning that one number, so a large analytical query does not compete with transactions for the same CPU.

The distinction from CDC and mirroring is that there is nothing to opt into. There is no list of replicated tables, because there is no replication. A table that exists is already in the lake, which also means the two views cannot drift apart.

## Wrap up

We started this post with a question: could object storage sit underneath Postgres and make it lighter to work with?

The answer is yes. Object storage can sit underneath Postgres and change how you interact with it, but not just because S3 is fast or cheap to run. The picture requires more engineering than that. RAM and local NVMe are still needed to serve queries fast enough, and a commit still lands on replicated WAL rather than in a bucket.

That WAL piece is the key. Object storage adds a cheap and scalable way to store all history, but making  the WAL the source of truth is what makes that history addressable - and this is what changes how you interact with Postgres and the features you can build on top of it.

## Run it

Lakebase Postgres runs in two places, on the same infrastructure and with the same core feature set. What differs is what surrounds it:

- On [Neon](https://neon.com/), it anchors a complete set of cloud backend primitives for developers, startups, and agent platforms: Lakebase Postgres alongside Object Storage, Functions, Managed Better Auth, and an AI Gateway.
- On [Databricks](https://www.databricks.com/product/lakebase), it is Lakebase, integrated with the rest of the Data Intelligence Platform: Unity Catalog governance, lakehouse analytics, notebooks, and AI workflows.

Ask your agent to deploy either of those, and put the lakebase architecture to the test.
