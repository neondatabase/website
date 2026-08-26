---
title: Introducing Neon Labs
description: A space for Postgres tooling
excerpt: >-
  Today we're launching Neon Labs, a home for experimental tools built around
  Lakebase Postgres. We want Neon Labs to be a playground for ideas that could
  help the broader Postgres community.
date: '2026-08-26T12:00:00'
updatedOn: '2026-08-26T16:59:00'
category: product
categories:
  - product
  - postgres
authors:
  - savannah-longoria
cover:
  image: null
  alt: null
isFeatured: false
seo:
  title: Introducing Neon Labs - Neon
  description: A space for Postgres tooling
  keywords: []
  noindex: false
  ogTitle: Introducing Neon Labs - Neon
  ogDescription: A space for Postgres tooling
  image: null
---

Today we're launching [Neon Labs](https://labs.neon.com), a home for experimental tools built around Lakebase Postgres. We want Neon Labs to be a playground for ideas that could help the broader Postgres community; it gives us a space to publish early tools, [share the code,](https://github.com/neondatabase/neon-upgrade-advisor ) and learn from how developers use them. Overtime, some experiments may grow into supported features, while others may remain prototypes or lead to better approaches elsewhere.

This first release includes two tools: a Postgres Upgrade Assessment, which reports what will break when you move to a new Postgres major version, and a Migration Assistant, which recommends a migration method and walks you through it. To try them, sign in at [labs.neon.com](https://labs.neon.com/) with your Neon account, pick a source project and a target Postgres version, and run the assessment.

<Admonition type="note" title="These tools are still in the experimental phase">
We do not recommend using the migration tools for production workloads yet. Try them first with a development or test project, or clone the repository and run it locally.
</Admonition>

## What's in Labs today

### Postgres Upgrade Assessment

You would use this before you start a major-version upgrade: the tool reads your live Neon project and tells you what will actually break if you move to a newer Postgres version, then recommends a migration method.

#### How it works

Select a source project and a target Postgres version. The assessment connects to the source database and runs read-only queries against pg_catalog and information_schema. It does not modify your schema, data, configuration, or project.

Results are checked against version-specific upgrade rules, so you get findings for your database, not a generic checklist. Each item is a blocker, a warning, or already clear, with what was detected.

#### What it does

- Flags unsupported extensions, custom collations, public-schema permissions, expression-index functions, event triggers, prepared transactions, and tables that could block logical replication
- Marks a change as clear when it doesn’t apply to your schema, so you don’t have to rule it out yourself
- Lets you copy the findings as a prompt for a coding agent, so it can apply remediations in your repo. The assessment can’t see that code
- Includes a searchable extension-compatibility reference for Postgres 14 through 18, covering around 110 extensions, with per-version availability split into supported, under review, and not supported. Postgres 19 is coming soon

### Migration Assistant

The assessment tells you what to fix; the Migration Assistant recommends a migration method based on database size and downtime requirements.

The methods considered are three:

- [Import Data Assistant](https://neon.com/docs/import/import-data-assistant) for databases under 10 GB. This hands off to Neon's managed import in the console. No CLI, and a brief write pause during the import.
- [pg_dump](https://neon.com/docs/import/migrate-from-postgres)[and](https://neon.com/docs/import/migrate-from-postgres) [pg_restore](https://neon.com/docs/import/migrate-from-postgres) for databases between 10 GB and 200 GB, with a planned maintenance window. The assistant generates the pipeline with the right flags, over an unpooled connection, one database at a time, since Neon doesn't support pg_dumpall.
- [Logical replication](https://neon.com/docs/guides/logical-replication-guide) for larger databases that require minimal downtime.

This last path (logical replication) is the path with the most moving parts and more prone to errors, and the one the assistant automates most:

Logical replication does not copy DDL or sequence state. The assistant copies the initial schema before replication, creates the publication and subscription, and enables logical replication on the source if it isn't on yet, which restarts the compute.

From there, it tracks table synchronization and measures lag between the source WAL position and the replication slot's confirmed position. It also checks whether the slot is actually active, so an orphaned subscription doesn't read as healthy.

Before cutover, it checks subscription state and flags row-count differences and sequence drift. Where sequences have drifted, the cutover step can reset target sequences past the highest replicated ID, which is the duplicate-key failure from earlier, prevented. It also runs ANALYZE on the target while it's still idle, so the planner has statistics before production traffic arrives instead of after. If you need to back out, there's a rollback, and a teardown that shows you the exact publications, subscriptions, and slots it's about to remove and makes you confirm them.

A safe cutover still requires you to pause writes to the source, confirm that replication has caught up, and update your application's connection string. Neon Labs does not pause application traffic or change application configuration for you.

<Admonition type="note" title="When to use the Migration Assistant">
We've tested this Labs workflow with databases in the 1–2 TB range. We do not recommend it for production workloads yet. For production upgrades, follow the existing Postgres upgrade paths. This limitation applies to the experimental Labs tool, not Lakebase Postgres logical replication.
</Admonition>

## Why we built this: Major Postgres upgrades are still hard (but worth it)

It’s soon gonna be time for upgrading: Postgres 19 is around the corner, [and Postgres 14 reaches the end of community support on November.](https://www.postgresql.org/support/versioning/) A lot of teams are about to be two or three majors behind, looking at an upgrade they've been deferring.

But as it is widely known by now, upgrading major Postgres versions is far from trivial. A major-version upgrade involves more than choosing a target version. You need to check your schema against Postgres release changes, confirm extension support, account for database size and downtime, and choose a migration method.

On Neon, a project is pinned to the major version it was created with, and pg_upgrade isn't supported yet. A [major upgrade](https://www.postgresql.org/support/versioning/) means creating a new project on the target version and migrating your data into it. That's a real migration, with all of the failure modes a real migration has. To make matters worse, the information you’d have to consult to make sure nothing will break often lives across release notes, system catalogs, extension references, and migration guides.

<Admonition type="note" title="We’re working on it">
We always get requests for a feature that makes upgrades smooth and instant, in place, with no new project and no migration. We agree. We'd love to offer this. We keep conceptualizing it, and it isn't easy. We can't wait to ship something like this in the future.
</Admonition>

Through the years, we've helped a lot of customers through major migrations in production, and we’ve learned quite a bit about the things that tend to break. A few examples:

- Logical replication copies rows, not sequence values. Target sequences stay near 1 while replicated IDs already sit at the source max. First insert after cutover hits a duplicate key; every write after that fails until you bump the sequences.
- Neither path carries pg_statistic. The planner treats tables as tiny, picks sequential scans and nested loops, and pins CPU. Scaling compute runs the same bad plan in more workers. Autovacuum often doesn’t save you: autoanalyze waits on tuple churn, so a freshly loaded read-mostly table can stay slow.
- Tables without a primary key or replica identity replicate inserts, then fail on updates and deletes. A subscription can look enabled while the slot is inactive, so new writes stop arriving. Prepared transactions block the migration. Event triggers re-fire when the target replays DDL.
- An unsupported extension stops the restore. Postgres 15 revoked CREATE on public from PUBLIC. Postgres 17 blocks unsafe search_path during ANALYZE / REINDEX / CREATE INDEX. Postgres 18 made generated columns VIRTUAL by default. Easy to fix once you know they apply. Expensive to find during cutover.

These tools we’re launching make this whole process easier.

## How we built Neon Labs

Neon Labs itself is a Next.js and TypeScript application backed by the Neon API and direct Postgres catalog queries:

[https://github.com/neondatabase/neon-upgrade-advisor](https://github.com/neondatabase/neon-upgrade-advisor)

Each visitor connects through a separate Neon OAuth session. The server resolves connection strings for each request and never returns them to the browser. The app does not store catalog data or assessment results. Read-only assessments and migration actions remain separate, so an assessment cannot start a migration.

Neon Labs can also run locally. Clone the repository and connect with your own Neon API key instead of signing in to the hosted app through OAuth. Your credentials and assessment results never pass through the hosted Neon Labs deployment.

## Try the tools

Go to [labs.neon.com](https://labs.neon.com), sign in with your Neon account, and run an assessment against a project you've been meaning to upgrade. Then try the migration tools with a development or test project.

The fastest way to make these better is to tell us where they're wrong about your database. Find us in the [Neon community on Discord](https://neon.com/discord), or send it through the [feedback form](https://console.neon.tech/app/projects?modal=feedback).
