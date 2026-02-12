---
title: Neon architecture
subtitle: Serverless Postgres with decoupled compute and durable storage
summary: >-
  Covers the architecture of Neon, a serverless Postgres database that separates
  compute and storage layers, enabling independent scaling and optimized
  performance while ensuring data durability and history management.
redirectFrom:
  - /docs/storage-engine/architecture-overview
  - /docs/conceptual-guides/architecture-overview
  - /docs/guides/neon-features
updatedOn: '2026-02-06T22:07:33.082Z'
---

## Top level overview

Instead of running Postgres as a single stateful system tied to a VM and its filesystem, Neon is a serverless database that splits the system into two independent layers: compute and storage. These layers communicate over the network, with a stream of write-ahead log (WAL) records connecting them.

This separation is what allows Neon to behave like a serverless database. Compute can scale up, scale down, go idle, and be restarted instantly without risking data loss or requiring data movement.

- **Ephemeral compute layer**: optimized for latency and execution. This layer runs Postgres, executing queries and transactions using RAM and local NVMe for performance. Compute nodes do not own durable state and can be replaced freely.
- **Durable storage layer**: optimized for correctness, history, and scale. This layer defines durability by replicating WAL via quorum, materializes Postgres pages on demand, and stores long-term, immutable history in object storage.

Neon’s design intentionally keeps object storage off the critical path. Object storage provides durability and scale, but never sits in front of query execution. Latency-sensitive work stays close to compute, while durability and history are handled asynchronously and independently.

![Neon architecture overview](/docs/introduction/neon-architecture-overview.png)

## Compute layer

The compute layer is where Postgres actually runs. Each Neon compute node is a standard Postgres instance: it parses SQL, plans queries, executes transactions, enforces MVCC, and manages locks and indexes. From the perspective of the query engine, nothing about Postgres itself is rewritten or replaced.

What is different in Neon is what the compute node is responsible for. **It exists to execute work, not to preserve data.** A compute node can start, stop, scale, or fail at any time without putting durability at risk.

### Components

A Neon compute node has access to fast, local resources:

- RAM - used for shared_buffers, session state, and hot data
- Local NVMe - used as a performance cache for data pages

Pages cached in RAM or NVMe avoid network round-trips and keep most reads at memory or microsecond-level latencies.

### How compute fits into the system

When a query runs, the compute node behaves as you would expect:

- SQL is parsed and planned
- Pages are accessed through the buffer manager
- Changes are applied in memory

The Neon difference appears when the system crosses the boundary between execution and durability. **Instead of flushing WAL to a local filesystem, the compute node streams WAL to the storage layer.** A transaction is considered committed once that WAL has been acknowledged by a quorum of safekeepers (more on this later). The compute node does not wait for data pages to be written to disk or object storage.

For reads, **the compute node always prefers local access.** It first looks in memory, then in the local NVMe cache. Only when a page is missing locally does the compute node request it from the pageserver, which reconstructs the correct page version and returns it over the network. At no point does the compute node read directly from object storage.

## Storage layer

If the compute layer is responsible for execution, the storage layer is responsible for correctness, durability, and history. **This layer exists independently of any single compute node and continues to operate even when computes come and go.**

Rather than exposing a traditional filesystem, the Neon storage layer is built around three distinct components, each with a well-defined role:

- Safekeepers: define correctness by replicating WAL
- The pageserver: turns WAL into queryable data pages
- Object storage: holds long-term, immutable history

### Safekeepers: defining correctness via WAL quorum

Safekeepers are responsible for one thing: **durable replication of WAL**. When a compute node generates WAL records, it streams them to multiple safekeepers. A transaction is considered committed once a quorum of safekeepers has acknowledged the WAL record [via the Paxos protocol](https://neon.com/blog/paxos).

This is a fundamental difference from how traditional Postgres works:

- Correctness in Neon is enforced through replication and consensus
- Commit latency depends on network RTT, not disk fsync
- No single machine defines the durable state of the database

### Pageserver: WAL ⇄ pages

The pageserver sits between WAL and data [pages](https://neon.com/docs/reference/glossary#page). Its job is to **materialize page versions** by combining previously materialized base pages and committed WAL records. It is the system’s translation layer between the logical history of the database and the physical representation needed to run queries.

When a compute node needs a page at a specific [LSN (Log Sequence Number)](https://neon.com/docs/reference/glossary#lsn), it asks the pageserver. The pageserver checks whether it already has that version available. If not, it reconstructs the page by replaying WAL up to the requested LSN and returns the result. Materialized pages are later persisted into object storage asynchronously, building up the long-term history of the database.

Importantly, page materialization is not on the transaction’s critical path. Commits do not wait for pages to be written or uploaded.

### Object storage: long-term, immutable history

Object storage is where Neon keeps the **durable history** of the database. This layer stores materialized page versions, historical snapshots of data, and immutable representations of past states. It is not a query engine, and it is never accessed directly by the compute layer. It backs the pageserver, not Postgres.

This distinction is critical for performance. Object storage is optimal for durability, scale, and cost, not latency. Reads from object storage may take hundreds of milliseconds, but in Neon, those reads happen only inside the pageserver when reconstructing pages, and never on the hot query path.

## Write path: committing a transaction in Neon

![Write path in Neon](/docs/introduction/neon-write-path.png)

When a transaction executes on a compute node:

1. **Postgres applies changes in memory.** Rows are updated in shared buffers, indexes are modified, and WAL records are generated as usual.
2. **WAL is streamed to the safekeepers.** Instead of flushing WAL to a local filesystem, the compute node sends WAL records over the network to multiple safekeepers.
3. **Commit is defined by quorum.** A transaction is considered committed once a quorum of safekeepers has acknowledged the WAL record. At this point, the client receives success.
4. **Page materialization happens later.** Page reconstruction and persistence happen asynchronously in the storage layer.

## Read path: serving data without object-store latency

![Read path in Neon](/docs/introduction/neon-read-path.png)

The obvious concern with running a database on object storage is latency, but Neon’s architecture is designed specifically to avoid this. The most important thing to understand about reads in Neon is this: **queries do not read from object storage.** Object storage backs the system, but it is never on the hot query path.

### The preferred path: local first

When Postgres running on a compute node needs to read a page, it follows a preference order:

1. **RAM (shared buffers).** This is the fastest path, just like in traditional Postgres.
2. **Local NVMe cache.** If the page is not in memory, the compute node checks its local NVMe cache. Access here is still fast.

Only if the page is missing locally does the system involve the storage layer (next section).

### Cache miss: requesting a page from the pageserver

On a cache miss, the compute node requests the required page from the pageserver, specifying the page identifier and the logical point in time (LSN). The pageserver then:

1. Checks whether it already has the requested page version materialized
2. If not, loads a base page from object storage, replays WAL records up to the requested LSN and returns the reconstructed page to the compute node

Once returned, the page can be cached in RAM and NVMe, making subsequent reads fast. This reconstruction only happens if needed, and only for the pages actually accessed.

## Durability

Durability in Neon is not a single mechanism but a composition of responsibilities. No single component is responsible for everything, and no single machine defines the state of the database.

This layering is what allows Neon to tolerate failures intrinsically:

- If a compute node dies → queries stop, but data is safe. A new compute attaches immediately and continues from the same history.
- If a pageserver dies → no durable state is lost. Another pageserver can be deployed and it can reconstruct pages using WAL and object storage.
- If a safekeeper dies → another can be deployed, and WAL replication continues as long as quorum remains.
- Object storage is the last line of defense → it holds immutable page history and survives failures across entire failure domains.

## What this architecture enables

**This design turns traditionally heavy-weight database operations (which usually require copying large amounts of data) into simple metadata operations.** These include creating a new branch, restoring from a snapshot, spinning up a read replica, or attaching a new compute node. In Neon, these operations are fast because they operate on references to existing history, not on the data itself.

- **Serverless compute provisioning.** Because durable state lives outside the compute layer, compute endpoints can [automatically scale up and down according to load](https://neon.com/docs/introduction/autoscaling), or [scale to zero](https://neon.com/docs/introduction/scale-to-zero) entirely. When compute starts, it simply attaches to existing database history rather than reconstructing local state.
- **Copy-on-write branching.** When you create a [branch](https://neon.com/docs/introduction/branching) in Neon, the engine does not duplicate files or pages. Instead, the new branch points to an existing point in history and begins diverging from there using copy-on-write semantics. Only new or modified data consumes additional storage.
- **Instant restores.** Because the database’s history is preserved as immutable page versions in object storage, [restoring the database](https://neon.com/docs/introduction/branch-restore) does not involve copying data back into place. Compute can reattach to a past point in history, and execution can resume from the restored state. This process is fast and predictable, even for multi-terabyte databases.
- **A unified foundation for OLTP and OLAP.** Once transactional data lives in object storage, it is no longer isolated from analytical or AI workloads. The same underlying history that supports an OLTP engine (Neon) can also support OLAP engines and AI systems. This is the principle behind the [lakebase architecture](https://www.databricks.com/product/lakebase).

## In short

Neon is a serverless Postgres engine that treats:

- compute as ephemeral and replaceable;
- storage as durable, replicated, and shared;
- WAL as the source of truth;
- and object storage as the foundation.

The result is a database architecture that scales, recovers, and evolves without being constrained by a single machine or filesystem. For developers, this means faster iteration, safer workflows, and infrastructure that adapts automatically as applications grow from early prototypes to large-scale production systems. This design also enables advanced lakebase architectures that unify transactional and analytical data platforms.
