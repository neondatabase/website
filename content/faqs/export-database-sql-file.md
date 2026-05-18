---
title: 'How do I export or download my Neon database as a SQL file?'
subtitle: 'Run pg_dump in plain-text format against a direct (non-pooled) connection string.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Run `pg_dump` against a direct (non-pooled) connection string and omit the `-F` format flag to get plain SQL. Neon supports `pg_dump` from any client; the output is a portable `.sql` file you can edit, version, or replay with `psql`. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) for the full command reference.

## Export a plain SQL dump

Grab the **direct** connection string from the **Connect** widget on your Project Dashboard (toggle **Connection pooling** off so the hostname has no `-pooler` suffix). Then run:

```bash shouldWrap
pg_dump -d "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb" -f dump.sql
```

The result is a human-readable SQL script that recreates schema, data, and other objects in order.

### Useful flags

```bash
# Schema only, no data
pg_dump -d "$NEON_URL" --schema-only -f schema.sql

# Data only, no DDL
pg_dump -d "$NEON_URL" --data-only -f data.sql

# Skip ALTER OWNER statements (recommended when restoring to a different role)
pg_dump -d "$NEON_URL" --no-owner -f dump.sql

# One specific table
pg_dump -d "$NEON_URL" -t public.customers -f customers.sql
```

The `--no-owner` flag is useful because roles created through Neon are members of `neon_superuser` but aren't full Postgres superusers, so they can't run `ALTER OWNER`. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

## Plain SQL vs custom format

For programmatic restore with `pg_restore`, the custom-format archive is more flexible (parallel restore, selective object restore, compression):

```bash
pg_dump -Fc -d "$NEON_URL" -f dump.dump
pg_restore -d "$TARGET_URL" dump.dump
```

Choose plain SQL when you want to read, edit, or grep the output, or replay it with `psql -f dump.sql`. Choose `-Fc` when you want to restore selectively or in parallel.

<Admonition type="warning" title="Don't dump over a pooled connection">
`pg_dump` uses session-level `SET` statements that aren't supported by Neon's PgBouncer transaction-mode pooling. Always use the direct hostname (no `-pooler` segment) for dumps. See PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) and [976](https://github.com/pgbouncer/pgbouncer/issues/976) for background.
</Admonition>

<Admonition type="tip" title="Match client and server versions">
Use `pg_dump` from the same major Postgres version as your Neon project, or newer. Run `pg_dump -V` to check. Older clients can produce incomplete dumps for newer server features.
</Admonition>

<CTA title="See the full pg_dump reference for Neon" description="Includes parallel dumps, ownership handling, large objects, and piping pg_dump to pg_restore." buttonText="Read the migration guide" buttonUrl="/docs/import/migrate-from-postgres" />
