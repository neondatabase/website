---
title: Backups
enableTableOfContents: true
updatedOn: '2024-10-04T13:13:13.778Z'
---

Neon does not yet provide support for configuring automated backups in the Neon Console or API. This feature is on our roadmap. You can expect it to be introduced in the coming months. In the meantime, we support the following backup options:

## Built-in backups with Neon's point-in-time restore feature

Neon retains a history for all branches, allowing you to restore your data to a particular date and time or Log Sequence Number (LSN). The history retention period is configurable. The supported limits are up to 24 hours for [Neon Free Plan](/docs/introduction/plans#free-plan) users, 7 days for [Launch](/docs/introduction/plans#launch), 14 days for [Scale](/docs/introduction/plans#scale), and 30 days for [Business](/docs/introduction/plans#business) plan users. With this backup option, no action or automation is required. You can restore your data to a past state at any time by creating a database branch, which is a near-instant operation. This feature is referred to as [Point-in-time restore](/docs/introduction/point-in-time-restore).

For information about creating a point-in-time restore branch, see [Branching — Point-in-time restore](/docs/guides/branching-pitr).

## pg_dump

You can backup a database using `pg_dump`, in the same way backups are created for a standalone Postgres instance.

<Admonition type="important">
Avoid using `pg_dump` over a [pooled Neon connection](https://neon.tech/docs/connect/connection-pooling) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an unpooled connection instead.
</Admonition>

This method dumps a single database in a single branch of your Neon project. If you need to create backups for multiple databases in multiple branches, you must perform a dump operation for each database in each branch separately.

To dump a database from your Neon project, please refer to the `pg_dump` instructions in our [Migrate from Postgres](/docs/import/migrate-from-postgres) guide.

## Automate Postgres Backups with a GitHub Action

These blog posts from Neon community members describe how you can schedule a backup to an Amazon S3 storage bucket using a GitHub Action:

- [How To Use GitHub Actions To Schedule PostgreSQL Backups](https://thenewstack.io/how-to-schedule-postgresql-backups-with-github-actions/)
- [Nightly Postgres Backups via GitHub Actions](https://joshstrange.com/2024/04/26/nightly-postgres-backups-via-github-actions/)

<NeedHelp/>
