---
title: 'How do I create and download a backup of my Neon database to my local machine?'
subtitle: 'Run pg_dump in custom format against a direct connection string and save the archive to disk.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I delete a database in Neon?'
  slug: delete-database-neon
nextLink:
  title: 'How do I enable or disable connection pooling for my Neon database?'
  slug: enable-disable-connection-pooling-neon
---

Use `pg_dump` against a direct (non-pooled) Neon connection string. The custom format (`-Fc`) gives you a single compressed archive that `pg_restore` can read selectively and in parallel. The archive is saved on your machine, so you have a copy that doesn't depend on Neon. See [Backups with pg_dump](/docs/manage/backup-pg-dump) for the full reference.

## Create the backup

Click **Connect** in the Neon Console nav and turn **Connection pooling** off to get the **direct** connection string (no `-pooler` in the hostname). Then run:

```bash shouldWrap
pg_dump -Fc -v -d "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f neondb-backup.dump
```

- `-Fc` writes a custom-format archive that `pg_restore` can read.
- `-v` prints progress as it dumps.
- `-d` is the source connection string.
- `-f` is the output file.

For a date-stamped file name, use command substitution:

```bash shouldWrap
pg_dump -Fc -d "$NEON_URL" -f "neondb-$(date +%Y-%m-%d).dump"
```

### Restore the backup later

`pg_restore` reads custom-format archives back into any Postgres database:

```bash
pg_restore -v -d "$TARGET_URL" neondb-backup.dump
```

Add `--no-owner` if you're restoring to a different role, and `--clean --if-exists` if you want to drop existing objects first.

## When to use a local backup

Lakebase Postgres keeps a change history that supports [instant restore](/docs/postgres/backup-restore/branch-restore) (point-in-time restore) of root branches within your project's [history window](/docs/postgres/backup-restore/history-window): up to 6 hours on the Free plan, up to 7 days on the Launch plan, and up to 30 days on the Scale plan. For most accidental deletes, instant restore is faster than restoring from a local file.

A local `pg_dump` backup covers cases that instant restore doesn't:

- A copy outside Neon, in case you lose access to your Neon organization or delete the project
- Long-term archival beyond your history window
- Compliance requirements that mandate an external copy
- Moving data into a different Postgres instance

<Admonition type="warning" title="Use a direct connection for pg_dump">
`pg_dump` relies on session-level `SET` statements, which Neon's PgBouncer doesn't support in transaction mode, so a dump over a pooled connection fails with errors. Connect through the direct hostname (no `-pooler` segment).
</Admonition>

<Admonition type="tip" title="For large databases">
`pg_dump` can dump tables in parallel with `-j <njobs>`, but only in directory format (`-Fd`), which writes a folder instead of a single file. `pg_restore -j <njobs>` runs a parallel restore from either a custom or directory archive. Set `<njobs>` to the number of available CPUs. Neon also recommends `-Z 1` for compression, since higher levels slow the dump. See [Advanced pg_dump and pg_restore options](/docs/import/migrate-from-postgres#advanced-pg_dump-and-pg_restore-options) and the [pg_dump reference](https://www.postgresql.org/docs/current/app-pgdump.html).
</Admonition>

<CTA title="See all pg_dump options" description="Parallel dumps, ownership handling, large objects, and piping pg_dump to pg_restore for small databases." buttonText="Read the migration guide" buttonUrl="/docs/import/migrate-from-postgres" />
