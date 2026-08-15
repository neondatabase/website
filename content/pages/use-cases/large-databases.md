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

![A production branch diverging after a failure, with a restored production branch created from the healthy point in history](/use-cases/large-databases/restore-branch-diagram.png)

<Admonition type="note" title="Summary">
On a conventional Postgres instance, compute and storage live on the same machine. Past a few hundred gigabytes, that design starts to tax every operational task: restores take hours, replicas duplicate storage, and realistic staging or development environments become too expensive to keep around.

Lakebase Postgres separates those layers. Storage is versioned and shared. Compute is disposable. That single change makes restore, branching, and read replicas cheap enough to treat as ordinary tools rather than rare DBA events.

- **Instant restore** - Branch from any point in the [history window](/docs/introduction/history-window). Restore time does not grow with database size
- **Realistic environments** - Staging and development start from production state in seconds, without copying terabytes
- **Lightweight replicas** - Read replicas are compute only. They share storage with the primary and scale independently
- **Programmatic** - The same operations are available through the API, the CLI, and agents. Nobody has to babysit a dump and restore

The recovery numbers on this page come from the [Impact of Postgres restores survey](/restores-survey), where we asked 50 developers managing 1TB+ production databases about failures, downtime, and business impact.
</Admonition>

## Large databases turn every ops task into a project

Legacy OLTP Postgres is a monolith. The Postgres process and its disk live together, so the only way to get a second environment is to stand up a second machine with a full copy of the data on it. That works when the database is small. At multi-TB scale, the copy becomes the product.

Restores take hours because snapshot plus WAL replay has to rebuild the whole volume. Replicas are expensive because each one carries its own storage. Keeping staging in sync with production is a standing project. Realistic development environments get skipped, because nobody wants to pay for another full-size instance that sits idle overnight.

Those are scalability problems. They also show up as developer experience problems. Teams stop testing migrations against real data. They share staging and coordinate over Slack. They treat restore drills as something to schedule rather than something to run. The same architecture that makes [branching workflows](/use-cases/branching-workflows) and [autoscaling](/use-cases/bursty-workloads) hard on a conventional instance is the one that makes large databases operationally heavy.

<div style={{ margin: '2.5rem 0', borderLeft: '3px solid #00E599', borderRadius: '0.25rem', background: 'rgba(0, 229, 153, 0.07)', padding: '1.75rem 2rem' }}>
  <p style={{ margin: 0, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6 }}>The short version</p>
  <p style={{ margin: '0.75rem 0 0', fontSize: '1.5rem', lineHeight: 1.35, fontWeight: 500 }}>A multi-TB Postgres shouldn't make every restore, replica, and staging environment a multi-hour project. Size should not be the thing that decides how fast you can move.</p>
</div>

## Your DB *will* break - and legacy infra sets your team for failure 

Large Postgres failures are not rare. In the [restores survey](/restores-survey), **59% of companies managing 1TB+ databases** reported a critical production failure in the past 12 months: hardware failure, an accidental table drop, corruption, or something adjacent.

The downtime that followed is what turns an incident into a business problem:

- **30% of teams** spent 3+ hours recovering, and some pushed past half a day. Only **21%** recovered in under an hour
- **40%** reported significant business interruption. Only **8%** said the incident caused little stress
- **52%** saw negative customer feedback. **48%** got a spike in support cases. **26%** dealt with SLA breaches and penalties
- **72%** felt only somewhat confident in their ability to recover quickly. Just **21%** felt very confident

Those numbers track with what people wrote in when we asked for the stories behind them. An admin typo that dropped a table and took two hours to undo. A brownout that corrupted a local hot backup and cost a week of recovery. A performance degradation that kept critical apps slow for 16 to 20 hours while the team rebuilt from backups. Failovers that stalled because HA standbys were lagging.

Snapshot plus WAL replay gets slower as the database grows. High availability standbys help with infrastructure failure, but they don't help when someone drops a table, when data is corrupted, or when the standby itself is behind. **68% of teams** put faster point-in-time recovery on their wishlist.

## The lakebase architecture turns restores into a metadata operation

None of the patterns below are possible on a conventional Postgres instance, and the reason is architectural. In a standard setup, compute and storage are glued together. Moving to a different size, a different environment, or a different point in time means moving the data.

Lakebase Postgres splits those halves apart. Compute is a stateless Postgres process where queries run. Storage is a separate, distributed engine that keeps data on shared object storage and writes copy-on-write, versioned by WAL. Every change creates a new version instead of overwriting the old one.

![Lakebase architecture with ephemeral compute on the left reading and writing to durable shared storage on the right](/use-cases/large-databases/lakebase-architecture.jpg)

Once storage is shared and versioned, starting a new compute against an existing version of the data is cheap. A branch is a pointer. A restore is a branch from a past version. A read replica is another compute pointed at the same storage. Database size stops deciding how long any of those operations take.

<Admonition type="info" title="Go deeper on the architecture">
- [Architecture overview](/docs/introduction/architecture-overview) - how compute, storage, and the WAL fit together
- [Instantly copy TB-size datasets: the magic of copy-on-write](/blog/instantly-copy-tb-size-datasets-the-magic-of-copy-on-write) - why branch and restore time don't grow with size
- [Recover large Postgres databases](/blog/recover-large-postgres-databases) - how instant PITR compares to snapshot plus WAL replay
</Admonition>

## Restore Postgres in seconds, even at multi-TB scale

Instant restore is the same branching primitive pointed backwards. Lakebase Postgres retains history for each branch within its [history window](/docs/introduction/history-window). You pick a timestamp, create a branch from that moment, and get the exact schema and data as of then, without rolling production back and without replaying WAL.

![Restore from history panel with a source branch, a point-in-time picker, and a Restore button](/use-cases/large-databases/restore-from-history.jpg)

That covers the recovery paths teams need after something goes wrong:

- **Recover lost data** - Branch from just before a table was dropped, pull the rows you need, and copy them back into production
- **Undo a bad migration** - Branch from before the migration ran, inspect or re-run it in isolation, and leave production serving traffic
- **Audit a past state** - Inspect a historical point for an incident review while the live branch keeps going

The restore itself is instantaneous. The UI says so because the architecture makes it true: nothing is being copied.

![One-step restore confirmation stating that the restore operation occurs instantly and that a backup branch is created](/use-cases/large-databases/one-step-restore.jpg)

Compare that to the survey baseline, where nearly a third of teams were still waiting three hours later. Size stops being the variable that decides how long you're down.

## Staging and development always look like production - without maintenance work

The same pointer model is what makes realistic non-production environments affordable at multi-TB scale. A staging branch starts from production state in seconds. A developer branch does the same. Neither one duplicates the storage of the parent. Idle compute [scales to zero](/docs/introduction/scale-to-zero), so forgotten environments stop accumulating cost.

That is the opposite of the conventional pattern, where a realistic staging database means another full-size instance, another backup schedule, and another sync job that always drifts. Past a few hundred gigabytes, most teams stop trying. On Neon, the environment is cheap enough to create, use, and delete as part of the workflow, including from CI and from agents.

For the full set of patterns (one branch per developer, per pull request, per preview, per test run), see [Branching workflows on Neon](/use-cases/branching-workflows).

## Deploy read replicas without copying data

On a provisioned platform, a read replica usually means a second machine with a second copy of the storage. At multi-TB scale that doubles the storage bill, and creation time grows with the size of the dataset.

On Neon, a [read replica](/docs/introduction/read-replicas) is another compute pointed at the same storage as the primary. It doesn't replicate or duplicate data. Creation takes seconds regardless of database size. Each replica autoscales on its own, and idle replicas can scale to zero.

![A Neon project with a primary compute and read replicas, all reading from a single shared storage layer](/use-cases/large-databases/read-replicas.png)

That makes replicas useful for more than horizontal read scale-out. Offload analytics, ad-hoc queries, and reporting onto a replica without touching primary performance, and without paying for another multi-TB volume to host them.

## Ops that used to need a DBA can now run from an API call

Once restore, branching, and replicas are cheap and fast, they stop being special procedures and start being things you can automate. Every operation is available through the [Neon API](/docs/reference/api) and the CLI:

- Create a branch from a timestamp when a deploy goes wrong
- Spin up a staging branch for a preview environment, then delete it when the pull request closes
- Stand up a read replica for a reporting job and tear it down when the job finishes
- Let an agent open a branch, run a migration against real data, and throw the branch away

None of that requires someone to provision storage, wait on a restore, or keep a standby warm. The operational surface area of a large database shrinks to the same tools a small database already uses.

## Your costs shrink too 

The lakebase architecture also changes the bill. On a conventional platform, every environment and every replica multiplies storage. Teams running multi-region production plus development often end up paying for the same terabytes several times over. Storage volumes that grow usually can't shrink, so even when cold data moves out, the volume (and the invoice) stay large. Snapshots become the only realistic backup strategy at that size, and they are both expensive and slow to restore from.

traconiq hit that spiral with a multi-TB telemetry workload on RDS, then moved it to Neon.

<QuoteBlock quote="Our workload ingests hundreds of data points per second and our RDS costs were increasing, especially since we had multiple regions and environments. With Neon, we found a way to scale our setup more efficiently, using branching instead of duplicating instances and autoscaling to match our actual load." author="thorsten-riess" role="Software Architect at traconiq" link="/blog/why-traconiq-migrated-from-aws-rds-to-neon" />

On Neon, production, development, and extra read capacity share one copy of the data. Branches and replicas add compute, not storage. Idle compute scales to zero. Storage bills for what you're actually storing, and restore no longer depends on maintaining expensive snapshots as the only escape hatch.

<QuoteBlock quote="In RDS, there’s no realistic backup strategy at that scale besides snapshots. But they’re expensive, and restoring still takes a long time" author="thorsten-riess" role="Software Architect at traconiq" link="/blog/why-traconiq-migrated-from-aws-rds-to-neon" />

The full write-up is in [Why traconiq migrated their multi-TB telemetry dataset to Neon](/blog/why-traconiq-migrated-from-aws-rds-to-neon).

<CTA title="Restore without waiting on size" description="Create a project, load a database, and restore to a point in history in seconds. No credit card required." buttonText="Get started" buttonUrl="https://console.neon.tech/signup" secondaryButtonText="Read the restores survey" secondaryButtonUrl="/restores-survey" />
