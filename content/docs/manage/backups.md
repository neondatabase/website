---
title: Backups
enableTableOfContents: true
updatedOn: '2024-11-30T11:53:56.074Z'
---

<InfoBlock>
<DocsList title="What you will learn:">
<p>About built-in backups with point-in-time restore</p>
<p>Creating backups using pg_dump</p>
<p>How to automate backups with GitHub Actions</p>
</DocsList>

<DocsList title="Related resources" theme="docs">
  <a href="/docs/introduction/point-in-time-restore">Branch reset and restore</a>
  <a href="/docs/import/migrate-from-postgres">Migrate data with pg_dump and pg_restore</a>
</DocsList>

</InfoBlock>

## Built-in backups with Neon's point-in-time restore feature

Neon retains a history for all branches, allowing you to restore your data to a particular date and time or Log Sequence Number (LSN). The history retention period is configurable. The supported limits are up to 24 hours for [Neon Free Plan](/docs/introduction/plans#free-plan) users, 7 days for [Launch](/docs/introduction/plans#launch), 14 days for [Scale](/docs/introduction/plans#scale), and 30 days for [Business](/docs/introduction/plans#business) plan users. With this backup option, no action or automation is required. You can restore your data to a past state at any time by creating a database branch, which is a near-instant operation. This feature is referred to as [Point-in-time restore](/docs/introduction/point-in-time-restore).

For information about creating a point-in-time restore branch, see [Branching — Point-in-time restore](/docs/guides/branching-pitr).

## pg_dump

You can backup a database using `pg_dump`, in the same way backups are created for a standalone Postgres instance.

<Admonition type="important">
Avoid using `pg_dump` over a [pooled Neon connection](/docs/connect/connection-pooling) (see PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) & [976](https://github.com/pgbouncer/pgbouncer/issues/976) for details). Use an unpooled connection instead.
</Admonition>

This method dumps a single database in a single branch of your Neon project. If you need to create backups for multiple databases in multiple branches, you must perform a dump operation for each database in each branch separately.

To dump a database from your Neon project, please refer to the `pg_dump` instructions in our [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) guide.

<Admonition type="tip">
When restoring a database dumped from Neon, you may encounter `ALTER OWNER` errors related to a `cloud_admin` role; for example:

```bash
pg_restore: error: could not execute query: ERROR: permission denied to change default privileges
Command was: ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;
```

This is a protected role in Neon that cannot be modified. To avoid this issue, you can add a `-O` or `--no-owner` option to your `pg_restore` command, as described [Database object ownership consideration](/docs/import/migrate-from-postgres#database-object-ownership-considerations).
</Admonition>

## Automate Postgres Backups with a GitHub Action

These blog posts from Neon community members describe how you can schedule a backup to an Amazon S3 storage bucket using a GitHub Action:

- [How To Use GitHub Actions To Schedule PostgreSQL Backups](https://thenewstack.io/how-to-schedule-postgresql-backups-with-github-actions/)
- [Nightly Postgres Backups via GitHub Actions](https://joshstrange.com/2024/04/26/nightly-postgres-backups-via-github-actions/)

<NeedHelp/>
