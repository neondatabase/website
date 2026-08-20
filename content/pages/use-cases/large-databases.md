---
title: 'Postgres for Large Databases'
subtitle: Restore instantly, deploy lightweight replicas, and test on environments that always match production - even as your Postgres grows to TBs 
summary: >-
  Why conventional Postgres becomes operationally heavy as it grows into the
  multi-TB range, how Lakebase architecture makes restore, branching, and
  replicas independent of data size, and what that means for cost and recovery
  confidence on large production databases.
enableTableOfContents: true
updatedOn: '2026-08-15T23:20:00.000Z'
image: '/images/social-previews/use-cases/large-databases.jpg'
---

![A production branch diverging after a failure, with a restored production branch created from the healthy point in history](/use-cases/large-databases/restore-branch-diagram.svg 'square priority')

<Admonition type="note" title="Summary">
On a conventional Postgres instance, compute and storage live on the same machine. Past a few hundred gigabytes, this monolithic design starts to hurt operations: restores take hours, replicas duplicate storage, and it becomes too painful to keep staging and development environments in sync with production.

Lakebase Postgres runs on a different architecture, where storage is versioned and shared and compute is disposable. This makes running restores, keeping up to date environments, and replicating instances lightweight metadata operations rather than serious DBA events.

- **Instant restores** - Branch from any point in the [history window](/docs/introduction/history-window). Restore time does not grow with database size
- **Realistic environments** - Staging and development start from production state in seconds, without copying terabytes
- **Lightweight replicas** - Read replicas are compute only. They share storage with the primary and scale independently
- **Programmatic** - The same operations are available through the API, the CLI, and agents. Nobody has to babysit a dump and restore

The recovery numbers on this page come from the [Impact of Postgres restores survey](/restores-survey), where we asked 50 developers managing 1TB+ production databases about failures, downtime, and business impact.
</Admonition>

## Large databases turn every ops task into a project

Legacy OLTP Postgres is a monolith. The Postgres process and its disk live together, so the only way to get a second environment is to stand up a second machine with a full copy of the data on it. That works when the database is small; at multi-TB scale, it becomes a big project. 

Restores take hours because snapshot plus WAL replay has to rebuild the whole volume, replicas are expensive because each one carries its own storage. Keeping staging in sync with production gets more and more painful.

<div style={{ margin: '2.5rem 0', borderLeft: '3px solid #00E599', borderRadius: '0.25rem', background: 'rgba(0, 229, 153, 0.07)', padding: '1.75rem 2rem' }}>
  <p style={{ margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>In short</p>
  <p style={{ margin: '0.75rem 0 0', fontSize: '1.5rem', lineHeight: 1.35, fontWeight: 500 }}>A multi-TB Postgres shouldn't turn every restore, replica, and staging environment a big DBA event.</p>
</div>

## Your DB will break. Legacy infra sets your team for failure 

Failures on large Postgres databases are not rare events, and recovery is rarely quick.

<StatBlock value="59%">
of companies experienced a critical production failure in the past 12 months. Including hardware failures, accidental table drop, or data corruption.
</StatBlock>

<StatBlock value="30%">
of teams had 3+ hours of downtime – and some pushed past half a day. Only 21% recovered in less than 60 minutes.
</StatBlock>

_Source: [Impact of Postgres restores survey](/restores-survey), based on 50 developers running 1TB+ Postgres in production._

The cost of those hours lands well outside the incident channel:

- **40%** reported significant business interruption. Only **8%** said the incident caused little stress
- **52%** saw negative customer feedback. **48%** got a spike in support cases. **26%** dealt with SLA breaches and penalties
- **72%** felt only somewhat confident in their ability to recover quickly. Just **21%** felt very confident

Snapshot plus WAL replay gets slower as the database grows. High availability standbys help with infrastructure failure, but they don't help when someone drops a table, when data is corrupted, or when the standby itself is behind. **68% of teams** put faster point-in-time recovery on their wishlist.

## How the Lakebase architecture simplifies Postgres operations

Recovery and replication stops being a big problem once compute and storage stop living on the same machine. On a conventional Postgres instance, those two layers are glued together - moving to a different size, a different environment, or a different point in time means moving the data (many TBs when the database is large).

Lakebase Postgres, built on the [lakebase architecture](https://neon.com/docs/introduction/architecture-overview), works differently - it splits the monolith apart. Compute is a stateless Postgres process where queries run; storage is a separate, distributed engine that keeps data on shared object storage and writes copy-on-write, versioned by WAL. Every change creates a new page version that can be referenced, instead of overwriting the old one.

![Lakebase architecture with ephemeral compute on the left reading and writing to durable shared storage on the right](/use-cases/large-databases/lakebase-architecture.jpg)

Since storage is shared and versioned, starting a new compute against an existing version of the data is a trivial operation. Database size stops deciding how long an operation takes - it is not a factor. 

- A **restore** is now a branch from a past version of storage
- A **staging or development environment** is now a branch from the current version
- A **read replica** is simply another compute pointed at the same storage
- All of it is available through an **API**, so agents and pipelines can do the work a DBA used to do by hand

<Admonition type="info" title="Go deeper on the architecture">
- [Architecture overview](/docs/introduction/architecture-overview) - how compute, storage, and the WAL fit together
- [Instantly copy TB-size datasets: the magic of copy-on-write](/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) - why branch and restore time don't grow with size
- [Recover large Postgres databases](/blog/recover-large-postgres-databases) - how instant PITR compares to snapshot plus WAL replay
</Admonition>

## Restore Postgres in seconds, even at multi-TB scale

Lakebase Postgres retains history for each branch within its [history window](/docs/introduction/history-window). You pick a timestamp, create a branch from that moment, and get the exact schema and data as of then, without rolling production back and without replaying WAL.

![Restore from history panel with a source branch, a point-in-time picker, and a Restore button](/use-cases/large-databases/restore-from-history.jpg)

That covers the recovery paths teams need after something goes wrong:

- **Recover lost data** - Branch from just before a table was dropped, pull the rows you need, and copy them back into production
- **Undo a bad migration** - Branch from before the migration ran, inspect or re-run it in isolation, and leave production serving traffic
- **Audit a past state** - Inspect a historical point for an incident review while the live branch keeps going

The restore itself is instantaneous. The UI says so because the architecture makes it true: nothing is being copied.

![One-step restore confirmation stating that the restore operation occurs instantly and that a backup branch is created](/use-cases/large-databases/one-step-restore.jpg)

## Staging and development always look like production - without maintenance work

The same property that makes restore cheap also makes realistic non-production environments affordable at multi-TB scale. A staging branch starts from production state in seconds. A developer branch does the same. Neither one duplicates the storage of the parent. Idle compute [scales to zero](/docs/introduction/scale-to-zero), so forgotten environments stop accumulating cost.

That is the opposite of the conventional pattern, where a realistic staging database means another full-size instance, another backup schedule, and another sync job that always drifts. Past a few hundred gigabytes, most teams stop trying. On Neon, the environment is cheap enough to create, use, and delete as part of the workflow, including from CI and from agents.

For the full set of patterns (one branch per developer, per pull request, per preview, per test run), see [Branching workflows on Neon](/use-cases/branching-workflows).

## Deploy read replicas without copying data

Shared storage is also why replicas stay light. On a provisioned platform, a read replica usually means a second machine with a second copy of the storage. At multi-TB scale that doubles the storage bill, and creation time grows with the size of the dataset.

On Neon, a [read replica](/docs/introduction/read-replicas) is another compute pointed at the same storage as the primary. It doesn't replicate or duplicate data. Creation takes seconds regardless of database size. Each replica autoscales on its own, and idle replicas can scale to zero.

![A Neon project with a primary compute and read replicas, all reading from a single shared storage layer](/use-cases/large-databases/read-replicas.png)

That makes replicas useful for more than horizontal read scale-out. Offload analytics, ad-hoc queries, and reporting onto a replica without touching primary performance, and without paying for another multi-TB volume to host them.

## Ops that used to need a DBA are now an API call

Because restore, branching, and replicas are cheap and fast, they stop being special procedures and start being things you can automate. Every operation is available through the [Neon API](/docs/reference/api) and the CLI:

- Create a branch from a timestamp when a deploy goes wrong
- Spin up a staging branch for a preview environment, then delete it when the pull request closes
- Stand up a read replica for a reporting job and tear it down when the job finishes
- Let an agent open a branch, run a migration against real data, and throw the branch away

None of that requires someone to provision storage, wait on a restore, or keep a standby warm. The operational surface area of a large database shrinks to the same tools a small database already uses.

## Your costs shrink too 

The Lakebase architecture also changes the bill. On a conventional platform, every environment and every replica multiplies storage. Teams running multi-region production plus development often end up paying for the same terabytes several times over. Storage volumes that grow usually can't shrink, so even when cold data moves out, the volume (and the invoice) stay large. Snapshots become the only realistic backup strategy at that size, and they are both expensive and slow to restore from.

<QuoteBlock quote="Our workload ingests hundreds of data points per second and our RDS costs were increasing, especially since we had multiple regions and environments. With Neon, we found a way to scale our setup more efficiently, using branching instead of duplicating instances and autoscaling to match our actual load." author="thorsten-riess" role="Software Architect at traconiq" link="/blog/why-traconiq-migrated-from-aws-rds-to-neon" />

On Neon, production, development, and extra read capacity share one copy of the data. Branches and replicas add compute, not storage. Idle compute scales to zero. Storage bills for what you're actually storing, and restore no longer depends on maintaining expensive snapshots as the only escape hatch.

<QuoteBlock quote="In RDS, there’s no realistic backup strategy at that scale besides snapshots. But they’re expensive, and restoring still takes a long time" author="thorsten-riess" role="Software Architect at traconiq" link="/blog/why-traconiq-migrated-from-aws-rds-to-neon" />

<CTA title="Restore without waiting on size" description="Create a project, load a database, and restore to a point in history in seconds. No credit card required." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" secondaryButtonText="Read the restores survey" secondaryButtonUrl="/restores-survey" />
