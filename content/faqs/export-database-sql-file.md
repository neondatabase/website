---
title: 'How do I export or download my Neon database as a SQL file?'
subtitle: 'Run pg_dump in plain-text format against a direct (non-pooled) connection string.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-09-23T21:00:25.204Z'
isDraft: false
redirectFrom: []
previousLink:
  title: 'How do I enable the pgvector extension in my Neon database?'
  slug: enable-pgvector-extension
nextLink:
  title: 'Why am I getting ''Error connecting to database: Failed to fetch'' in the Neon Console Tables view?'
  slug: failed-to-fetch-error-tables-view
---

Run `pg_dump` against a direct (non-pooled) connection string and omit the `-F` format flag to get plain SQL. The output is a plain `.sql` file you can read, edit, commit to version control, or replay with `psql`. See [Migrate data from Postgres with pg_dump and pg_restore](/docs/import/migrate-from-postgres) for the full command reference.

## Export a plain SQL dump

Click **Connect** in the Neon Console nav and turn **Connection pooling** off to get the **direct** connection string (no `-pooler` in the hostname). Then run:

```bash shouldWrap
pg_dump -d "postgresql://alex:AbC123dEf@ep-cool-darkness-a1b2c3d4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f dump.sql
```

The result is a SQL script that recreates the schema, data, and other objects in dependency order.

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

Use `--no-owner` when you'll restore into Neon under different roles. Roles created through Neon are members of `neon_superuser`, which isn't a full Postgres superuser and can't run `ALTER OWNER`, so those statements would fail during the restore. See [Database object ownership considerations](/docs/import/migrate-from-postgres#database-object-ownership-considerations).

## Plain SQL vs custom format

A custom-format archive (`-Fc`) is compressed and lets `pg_restore` restore selected objects or run in parallel:

```bash
pg_dump -Fc -d "$NEON_URL" -f dump.dump
pg_restore -d "$TARGET_URL" dump.dump
```

Choose plain SQL when you want to read, edit, or grep the output, or replay it with `psql -f dump.sql`. Choose `-Fc` when you want to restore selectively or in parallel.

<Admonition type="warning" title="Don't dump over a pooled connection">
`pg_dump` uses session-level `SET` statements, which Neon's PgBouncer doesn't support in transaction mode. Use the direct hostname (no `-pooler` segment) for dumps. See PgBouncer issues [452](https://github.com/pgbouncer/pgbouncer/issues/452) and [976](https://github.com/pgbouncer/pgbouncer/issues/976) for background.
</Admonition>

<Admonition type="tip" title="Match client and server versions">
Use `pg_dump` from the same major Postgres version as your Neon project, or newer. Run `pg_dump -V` to check. `pg_dump` [refuses to dump](https://www.postgresql.org/docs/current/app-pgdump.html) a server whose major version is newer than its own.
</Admonition>

<CTA title="See the full pg_dump reference for Neon" description="Includes parallel dumps, ownership handling, large objects, and piping pg_dump to pg_restore." buttonText="Read the migration guide" buttonUrl="/docs/import/migrate-from-postgres" />
