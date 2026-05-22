---
title: 'How do I create and download a backup of my Neon database to my local machine?'
subtitle: 'Run pg_dump in custom format against a direct connection string and save the archive to disk.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T14:42:53.313Z'
isDraft: false
redirectFrom: []
---

Use `pg_dump` against a direct (non-pooled) Neon connection string. The custom format (`-Fc`) gives you a single compressed archive that `pg_restore` can read selectively and in parallel. The output file lives on your local machine, so it's an off-platform copy independent of Neon. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) for the full reference.

## Create the backup

Copy the **direct** connection string from the **Connect** widget on your Project Dashboard (turn **Connection pooling** off so the hostname has no `-pooler` suffix). Then run:

```bash shouldWrap
pg_dump -Fc -v -d "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb" -f neondb-backup.dump
```

The flags:

- `-Fc` writes a custom-format archive (recommended for backups)
- `-v` prints progress as it dumps
- `-d` is the source connection string
- `-f` is the output file

To produce a date-stamped backup, use a shell variable:

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

Neon already keeps a change history that supports [instant restore](/docs/introduction/branch-restore) (point-in-time restore) within your project's [history window](/docs/introduction/history-window): up to 6 hours on Free, up to 7 days on Launch, and up to 30 days on Scale. For most accidental-delete recoveries, restoring from history inside Neon is faster than rebuilding from a local file.

Local `pg_dump` backups are useful for:

- Off-platform redundancy (your project's history doesn't help if you lose access to your Neon org)
- Long-term archival beyond your history window
- Compliance requirements that mandate an external copy
- Moving data into a different Postgres instance

<Admonition type="warning" title="Use a direct connection for pg_dump">
`pg_dump` relies on session-level `SET` statements, which aren't supported by Neon's transaction-mode PgBouncer pooling. Always connect through the direct hostname (no `-pooler` segment). Pooled dumps can fail or produce incomplete output.
</Admonition>

<Admonition type="tip" title="For large databases">
Add `-j <njobs>` to dump tables in parallel (set `<njobs>` to your CPU count) and `-Z 1` for light compression. For very large dumps, scale your Neon compute up temporarily so it can serve the read load without throttling.
</Admonition>

<CTA title="See all pg_dump options" description="Parallel dumps, ownership handling, large objects, and piping pg_dump to pg_restore for small databases." buttonText="Read the migration guide" buttonUrl="/docs/import/migrate-from-postgres" />
