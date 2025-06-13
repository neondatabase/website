---
title: 'Neon Storage: Bottomless, Branchable'
subtitle: The foundation for scalable, copy-on-write Postgres with usage-based pricing and zero storage management.
updatedOn: '2025-06-04T09:00:00.000Z'
---

Neon implements a unique storage layer for Postgres that eliminates capacity planning and enables new workflows. Built on a copy-on-write engine backed by bottomless cloud storage, Neon’s architecture removes the constraints of traditional serverful setups, which require pre-provisioned storage volumes and limit scalability. At the same time, it lays the foundation for core Neon features like [instant branching](/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) and [point-in-time restores](/blog/recover-large-postgres-databases#neons-instant-point-in-time-recovery).

## Storage constraints in serverful Postgres architectures

Most managed Postgres databases follow a version of the architectural pattern laid out by Amazon RDS: under the hood, Postgres runs in a VM that includes a storage volume like EBS. This experience is very rigid, and makes it so even when using a “managed” cloud Postgres, teams still encounter significant storage babysitting events and other inefficiencies.

The most common examples:

- **Manual provisioning & rigid scaling.** Classic setups require teams to pre-allocate disk storage and expand it manually. Scaling capacity is inflexible, at most one expansion every few hours, and often you can't reduce volume size. This guesswork often leads to over-provisioning and emergency resizes to avoid full disks.
- **Slow cloning and recovery.** This architecture also implies that making a copy of a large database or restoring from backup is a time-consuming ordeal. Snapshot-based backups in most cloud databases involve copying the entire dataset from cloud storage and replaying logs, meaning that restoring a multi-terabyte instance can take hours. This delays testing and recovery, impacting development agility and uptime.
- **Low resource efficiency.** In traditional plans you pay for capacity whether you use it or not. An RDS instance’s storage and compute are allocated up-front (and billed 24/7), so idle resources and empty disk space burn a hole in your budget. Maintaining standby replicas or separate dev/test instances compounds the cost, even if they’re mostly idle.

## How Neon reimagines Postgres storage

Neon’s architecture separates storage from compute, implementing a multi-tenant cloud service where each layer can scale independently. The Pageserver (running on SSDs) and Safekeepers (which replicate Postgres’ write-ahead log) form a distributed storage system, with durable object storage (e.g., S3) as the ultimate source of truth. This design decouples performance-critical caching and log replication from long-term storage, enabling both dynamic scaling and built-in fault tolerance.

![Neon storage architecture](/pages/storage/schema.jpg)

Unlike traditional serverful setups, where compute and storage are tightly coupled inside a VM, Neon keeps storage completely independent. A Postgres instance can be paused, scaled, or replicated without moving data. Stateless compute nodes simply reconnect to the storage layer on demand.

Because the storage engine ingests and tracks all changes via PostgreSQL’s WAL, it maintains a complete, append-only history of the database. This log-structured design lays the groundwork for advanced features like branching, time travel, and instant recovery, without relying on bulky snapshots or manual intervention.

## Unique benefits derived from Neon’s implementation

### Copy-on-write design.

[Neon’s storage engine never overwrites data in place](/blog/get-page-at-lsn) – it writes new copies of pages when changes occur. When you create a new branch (a copy of the database), Neon doesn’t duplicate the whole dataset. Instead, it references the existing data pages and only writes new pages for data that is modified.This copy-on-write approach avoids expensive full-copy operations. As a result, features like branching, snapshots, and backups no longer require bulk data dumps or lengthy restores.

### Bottomless capacity, no provisioning.

Neon’s bottomless storage design means you never worry about disk size. The system automatically grows and shrinks with your data, leveraging cloud object storage in the background. There’s no need to predict or allocate storage up front – Neon will seamlessly offload cold data to object storage (e.g. S3) and pull it back when needed using its engine. You won’t run out of space and you won’t spend time managing volumes.

### Built-in caching for performance.

A concern with decoupling storage is performance, so [Neon’s architecture includes intelligent caching](/blog/architecture-decisions-in-neon). The Pageserver acts as a high-speed cache on SSDs for recently used data, serving pages to the Postgres compute with minimal latency. In essence, Neon keeps hot data in a cache tier (and in memory) close to the compute, while cold data resides in S3. This means you enjoy the performance of local SSD on your active working set, even as your total data size scales far beyond what SSDs alone could hold.

### Pay only for actual usage.

Neon charges based on the data you actually store, not on a pre-set capacity. This usage-based pricing model means you’re billed for GB-months of storage consumed (and compute time used), rather than for idle headroom. You don’t pay for 500 GB “just in case” when you’re only using 100 GB, a stark contrast to allocation-based plans. This on-demand efficiency can translate into substantially lower costs as you scale, when disks become larger (and more empty) as data gets purged regularly.

### Branching and instant restores.

With a complete WAL history at its core, Neon enables powerful workflows like branching databases and point-in-time recovery with minimal effort. You can spin up a new logical copy of your database in seconds, without copying data, even for datasets with many TBs. Under the hood, Neon simply forks the page history via copy-on-write. Similarly, you can instantly rewind or **restore** a database to an earlier snapshot in time. The ability to clone or rollback a TB-sized Postgres in moments opens up development and disaster recovery capabilities [previously not feasible on managed Postgres](/blog/postgres-snapshots-neon-vs-rds).

### Always durable and multi-AZ resilient.

Neon’s storage layer was [built for high availability](/blog/our-approach-to-high-availability). Every piece of data is redundantly stored across availability zones and in cloud storage. Incoming WAL records are replicated to multiple Safekeepers (each in a different AZ) for durability, then routinely uploaded to the object store (which offers 11 nines of durability). Your data is safe from single-AZ outages or disk failures by default.

## Operational simplicity through architectural change

Neon’s storage engine fundamentally changes what you can expect from Postgres in the cloud. You no longer have to over-provision or constantly manage your database storage. Instead, it expands as needed, stays highly available, and only charges you for actual utilization.
This architecture also delivers a better developer experience. Need a fresh database branch for a feature test? It’s a click away. Hit a new growth milestone? Neon transparently handles it with no performance hit, no emergency migrations. Our goal with this design is to offer a truly cloud-native infrastructure layer for Postgres, finally abstracting the storage details and letting you scale with confidence.

<CTA title="Try Neon" description="Get started in seconds via our <a href='https://console.neon.tech/signup'>Free Plan</a>. If you have questions, <a href='/contact-sales'>reach out to us</a>." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" />
