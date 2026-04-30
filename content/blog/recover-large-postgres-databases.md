---
title: What it Takes to Recover a 100 TB Postgres Database in AWS RDS
description: Exploring the challenges of large-scale Postgres recovery
excerpt: >-
  Imagine your AWS RDS Postgres database scales to 100 TB. Now, sh*t disaster
  happens—your production instance experiences a critical failure. How would RDS
  handle different failure modes? And how long would it take to restore full
  production capability? Production failure modes Pr...
date: '2025-02-04T01:22:52'
updatedOn: '2025-03-12T18:49:35'
category: workflows
categories:
  - workflows
authors:
  - carlota-soto
cover:
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recover-large-postgres-databases/cover.jpg
  alt: null
isFeatured: false
seo:
  title: What it Takes to Recover a 100 TB Postgres Database in AWS RDS - Neon
  description: >-
    An analysis of how to handle Postgres failures in AWS RDS, highlighting the
    benefits of Neon’s architecture with instant PITR and built-in HA.
  keywords: []
  noindex: false
  ogTitle: What it Takes to Recover a 100 TB Postgres Database in AWS RDS - Neon
  ogDescription: >-
    An analysis of how to handle Postgres failures in AWS RDS, highlighting the
    benefits of Neon’s architecture with instant PITR and built-in HA.
  image: >-
    https://cdn.neonapi.io/public/images/pages/blog/recover-large-postgres-databases/social.jpg
source:
  wpId: 8356
  wpSlug: recover-large-postgres-databases
  exportedAt: '2026-03-20T13:31:00.745Z'
---

![Image](https://cdn.neonapi.io/public/images/pages/blog/recover-large-postgres-databases/neon-recover-database-1024x576-3e0145c4.jpg)

**Imagine your AWS RDS Postgres database scales to 100 TB.**

Now, sh\*t disaster happens—your production instance experiences a critical failure. How would RDS handle different failure modes? And how long would it take to restore full production capability?

## Production failure modes

Production teams commonly encounter two major failure modes that require different recovery strategies:

1. **Failure mode: Logical errors.**
   - **What happens?** Application or user-induced failures (e.g. accidental table drops, schema modifications, incorrect bulk updates) result in data corruption or loss.
   - **How to recover?** By having a robust point-in-time recovery (PITR) method.
2. **Failure mode: Infrastructure or AZ failures.**
   - **What happens?** The primary database instance becomes unreachable due to hardware failures, network issues, or a full Availability Zone (AZ) outage.
   - **How to recover?** By ensuring high availability (HA) through redundancy or built-in resiliency.

<Admonition type="note">
While outside the scope of this discussion, regional failures—where an entire AWS region experiences an outage—are rare but possible. Mitigating this requires a cross-region failover strategy, often using RDS cross-region replicas, particularly for global deployments that require high availability.
</Admonition>

## Recovery mechanisms in AWS RDS

AWS RDS provides two primary mechanisms for failure recovery, each addressing a specific failure type:

1. **Snapshot-based backup and recovery (with WAL replay): For PITR.**
   - **How it works:** The database is restored from a previous snapshot (stored in Amazon S3), and WAL (Write-Ahead Log) segments are **r** eplayed sequentially to bring the database to the desired recovery point.
   - **Limitation:** This process is slow at large scales—restoring a 100 TB snapshot and replaying WAL can take hours (details in the next section).
2. **Multi-AZ standbys: For high availability.**
   - **How it works:** AWS RDS maintains a synchronous standby replica in another AZ; If the primary instance fails, the standby is automatically promoted to primary.
   - **Limitation:** Multi-AZ is ineffective for PITR—if data corruption occurs on the primary, it is immediately replicated to the standby. Replication also may encounter issues when instances are large.

<Admonition type="note">
RDS also provides additional, use-case-specific recovery options. Read replicas can be promoted to a standalone database in case of failure, though this is a manual process, and cross-region replicas offer disaster recovery capabilities across AWS regions.
</Admonition>

## Limitations of snapshot-based backup and recovery in AWS RDS for large databases

<Admonition type="important" title="TL;DR">
**This method protects against logical errors but it gets very slow at scale. Restoring a 100 TB database can take hours.**
</Admonition>

AWS RDS relies on automated snapshots stored in Amazon S3 to provide point-in-time recovery (PITR). If your database becomes corrupted or needs to be restored to an earlier state, the backup and recovery process would look like this:

1. **Restore from a snapshot**. AWS provisions a new database instance and copies data from a previous snapshot stored in S3.
2. **Replay WAL (Write-Ahead Logs)**. Once the snapshot is restored, WAL segments are applied sequentially to recover changes that occurred between the snapshot time and the desired recovery point.

For scale databases, **this is a lengthy process:**

- Copying a multi-TB snapshot to a new RDS instance can take up to hours (depending on network speed and system load).
- If the snapshot is 24 hours old, the database must then replay an entire day’s worth of transactions (potentially millions or billions of row modifications).

## Limitations of AWS RDS Multi-AZ for large databases

<Admonition type="important" title="TL;DR">
**Multi-AZ deployments reduce recovery time objectives (RTO) for hardware or AZ failures, but they don’t solve PITR. At the 100 TB scale, teams must also monitor replication lag on their standbys.**
</Admonition>

When Multi-AZ mode is enabled in AWS RDS,

- A standby instance is automatically provisioned in another Availability Zone (AZ).
- Writes to the primary are replicated to the standby in near real-time.
- If the primary instance fails, AWS automatically promotes the standby to take over as the new primary.

This architecture provides high availability for infrastructure failures via instance redundancy (i.e. ensuring an alternate instance is ready to take over). This is not a method for PITR. Additionally, Multi-AZ introduces challenges at 100 TB scale that teams must actively monitor, most frequently **replication lag**.

While Multi-AZ is advertised as synchronous, AWS may downgrade replication to asynchronous in certain conditions—for example, in high write throughput scenarios. Fully synchronous replication can slow down database performance, so to maintain system responsiveness, AWS may allow the primary to commit transactions before they reach the standby.

Why this matters:

- If replication lag is present, the standby may be minutes behind the primary. This means that after a failover, your application may temporarily serve outdated data.
- AWS RDS does not always surface clear alerts when it temporarily degrades replication mode, leading to a false sense of security.

Lastly, it’s worth mentioning that enabling **Multi-AZ doubles your production RDS costs** because AWS provisions a full-size replica of the production database. Teams pay for two identical instances (primary + standby), even though the standby is idle most of the time.

## Recap: AWS RDS recovery mechanisms

| Recovery route          | **Protection against AZ failures**<br />**(High Availability)** | **Protection against logical errors** **(PITR)** |
| ----------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| Snapshot + WAL replay   | ❌ No                                                           | ✅ Yes, but slow                                 |
| <br />Multi-AZ standbys | ✅ Yes, but risk of replication lag                             | ❌ No                                            |

## The advantages of Neon’s approach: A Postgres architecture with built-in protection

[Neon](https://neon.tech/home) **is a managed Postgres service that takes a fundamentally different approach to high availability (HA) and point-in-time recovery (PITR).** It’s a great alternative to alleviate the shortcomings of RDS’s capabilities for large databases.

Instead of relying on full-size replicas for HA or multi-hour WAL replays for PITR, Neon [separates storage and compute](https://neon.tech/docs/introduction/serverless) and uses an [innovative log-structured storage system.](https://neon.tech/blog/what-you-get-when-you-think-of-postgres-storage-as-a-transaction-journal) This architecture enables:

- **Instant point-in-time recovery (PITR)** without snapshot restores or WAL replays.
- **Built-in high availability** without the need for dedicated standby instances.

## Neon’s instant point-in-time recovery

<Admonition type="important" title="TL;DR">
**Neon’s PITR is instant, even for 100 TB databases. Teams can instantly create a Neon branch from any past state, query historical data before committing to a rollback, and diagnose issues without restoring from snapshots or replaying WAL.**
</Admonition>

Neon offers a much faster alternative than the traditional “backup and restore” for PITR. The technique that Neon uses is made possible by its storage engine modeled as a key-value store, which records all database changes—very different from AWS RDS’s storage. Neon’s storage

- Automatically processes WAL logs, reorganizes them, and writes them to layer files for efficient access;
- Versions all modifications in real-time, keeping historical states available;
- Automatically distributes records across multiple availability zones, ensuring redundancy at the storage layer.

**Because Neon never modifies old data, every historical state is instantly accessible (up to a configurable retention limit).** This allows teams to create an isolated [database branch](https://neon.tech/docs/introduction/branching) from any past timestamp, with its own dedicated Postgres URL and its own isolated compute resources, acting as a perfect copy of the production instance at that point in time.

#### How PITR works in Neon

1. **Instantly create a branch at any point in time.** No need to manually restore from a snapshot or replay WAL.
2. **Spin up a temporary compute node.** Attach a compute instance to the branch, with your desired CPU/memory or [autoscaling limits](https://neon.tech/docs/guides/autoscaling-guide).
3. **Recover your data.** You can do a full rollback (swap the production endpoint to this new branch, reverting the database entirely) or a partial recovery (copy specific tables or rows back to the production database).

#### Benefits of Neon’s approach vs AWS RDS for large databases

- **Fastest possible PITR**. Since the old state already exists in Neon’s storage, there’s no need to copy or replay data.
- **Safer recovery.** Teams can verify data before committing to a full rollback via [time-travel queries](https://neon.tech/docs/guides/time-travel-assist).

## Neon’s multi-AZ availability

<Admonition type="important" title="TL;DR">
**Neon provides Multi-AZ redundancy without requiring dedicated standby instances.**
</Admonition>

Neon eliminates the need for full-size replicas by ensuring high availability at the storage layer instead of relying on traditional replication.

- **Storage-level redundancy.** On the storage side, all data is backed by cloud object storage for long-term durability, and [Pageserver and Safekeepers](https://neon.tech/docs/introduction/high-availability) are distributed across [Availability Zones](https://en.wikipedia.org/wiki/Availability_zone) for redundancy.
- **Compute resiliency.** Compute nodes (where Postgres runs) are ephemeral and stateless in Neon. If Postgres crashes or there’s an AZ failure, Neon’s control plane automatically spins up a new node in another AZ, keeping your application continuously connected.

#### Benefits of Neon’s approach vs AWS RDS for large databases

- **Multi-AZ redundancy without doubling costs**. Neon avoids the overhead of a full-size standby by ensuring availability at the storage and compute layers.
- **No replication lag risks**. In this system, there’s no risk of stale data due to lagged replication.

## Recap: The value of Neon for large databases

| Recovery route        | Value for teams                                                                                                                                                                                                                                                                 | Business value                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Instant PITR**      | **Peace of mind**. Teams have a reliable safety net, protecting them against accidental errors or corruption.<br /><br />**Fast issue resolution**. Errors affecting production data are corrected in seconds or minutes instead of hours.                                      | **Minimize customer impact**. Rapidly reversing data issues preserves customer trust and revenue.<br /><br />**Preserve trust**. By preventing prolonged downtime, you reduce churn and safeguard customer satisfaction.                                                           |
| <br />**Built-in HA** | **No heavy lifting for high availability**. Neon’s architecture handles redundancy automatically; no manual monitoring of standbys.<br /><br />**Smaller operational footprint**. No engineering effort is needed to maintain replicas, freeing teams to focus on other things. | **Reduced infrastructure costs**. Eliminates the overhead of running full-size standby instances—particularly critical at 100 TB scale.<br /><br />**Less risk.** Built-in multi-AZ redundancy minimizes single points of failure, reducing the likelihood of prolonged downtimes. |

## Using AWS RDS? Explore Neon

[Sign up for Neon today and get $100 in credits](https://fyi.neon.tech/credits). Take advantage of this offer to upgrade to the Scale plan, load dummy data, and test restores. Once you’re ready to set up a proper PoC, [contact us](https://neon.tech/contact-sales)—our team of Postgres experts will help you get started and assist with your evaluation.
