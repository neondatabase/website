---
title: Backups
enableTableOfContents: true
updatedOn: '2023-11-24T11:25:06.759Z'
---

Neon does not yet provide support for configuring automated backups in the Neon Console or API. This feature is on our roadmap. You can expect it to be introduced in the coming months. In the meantime, we support the following backup options:

## Built-in backups with Neon's point-in-time restore feature

By default, Neon retains a 7-day history for all branches, allowing you to restore your data to a particular date and time or Log Sequence Number (LSN). The history retention period is configurable. The supported range is 0 to 7 days for [Neon Free Tier](/docs/introduction/free-tier) users, and 0 to 30 days for [Neon Pro Plan](/docs/introduction/pro-plan) users. With this backup option, no action or automation is required. You can restore your data to a past state at any time by creating a database branch, which is a near-instant operation. This feature is referred to [Point-in-time restore](/docs/introduction/point-in-time-restore).

For information about creating a point-in-time restore branch, see [Branching — Point-in-time restore](/docs/guides/branching-pitr).

## pg_dump

You can backup a database using `pg_dump`, in the same way backups are created for a standalone Postgres instance.

<Admonition type="warning">
Avoid using `pg_dump` over a [pooled Neon connection](https://neon.tech/docs/connect/connection-pooling) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an unpooled connection instead.
</Admonition>

This method dumps a single database in a single branch of your Neon project. If you need to create backups for multiple databases in multiple branches, you must perform a dump operation for each database in each branch separately.

To dump a database from your Neon project, please refer to the `pg_dump` instructions in our [Import from Postgres](/docs/import/import-from-postgres) guide.

Please be aware that dumping data from Neon is considered "data transfer". For data transfer costs, please refer to our [Billing](/docs/introduction/billing) documentation.

<NeedHelp/>
