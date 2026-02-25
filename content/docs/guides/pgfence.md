---
title: Analyze migration safety with pgfence
subtitle: Detect dangerous Postgres lock patterns and risk levels in your SQL migrations before deploying to Neon
enableTableOfContents: true
updatedOn: '2026-02-26T00:00:00.000Z'
---

[pgfence](https://pgfence.dev) is a Postgres migration safety CLI that analyzes SQL migration files and reports lock modes, risk levels, and safe rewrite recipes. It uses PostgreSQL's actual parser (`libpg-query`) to detect dangerous DDL patterns — like `ACCESS EXCLUSIVE` locks, missing `lock_timeout`, or non-concurrent index creation — before they reach your Neon database.

pgfence supports raw SQL files and ORM migration formats including TypeORM, Prisma, Knex, and Drizzle.

## Prerequisites

To follow along with this guide, you'll need:

- A Neon account. If you don't have one, sign up at [Neon](https://neon.tech).
- A Neon project with a database. See [Create your first project](/docs/get-started/signing-up).
- [Node.js](https://nodejs.org/) 20 or later installed on your local machine.
- One or more SQL migration files to analyze.

## Install pgfence

Install pgfence globally or as a project dependency:

```bash
# Global install
npm install -g @flvmnt/pgfence

# Or as a dev dependency
npm install -D @flvmnt/pgfence
```

## Analyze migrations locally

Run pgfence against your SQL migration files:

```bash
pgfence analyze migrations/*.sql
```

pgfence reports the lock mode, risk level, and a safe rewrite recipe for each statement it identifies as potentially dangerous. Here's an example of what the output looks like for a migration that creates an index without `CONCURRENTLY`:

```sql
-- migrations/002_add_index.sql
CREATE INDEX idx_users_email ON users (email);
```

```bash
$ pgfence analyze migrations/002_add_index.sql

  ⚠  CREATE INDEX without CONCURRENTLY
     Lock: SHARE (blocks writes)
     Risk: MEDIUM
     Table: users

  Recipe:
     CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email ON users (email);

  Analyzed 1 SQL statement. 0 dynamic statements not analyzable.
```

### Analyze ORM migrations

If you're using an ORM, specify the format to extract SQL from migration files:

```bash
# TypeORM migrations
pgfence analyze --format typeorm src/migrations/*.ts

# Prisma migrations
pgfence analyze --format prisma prisma/migrations/**/migration.sql
```

## Common patterns pgfence detects

pgfence checks for the following patterns that can cause issues on production Neon databases:

| Pattern | Lock mode | Risk | Safe alternative |
| --- | --- | --- | --- |
| `ADD COLUMN ... NOT NULL` without `DEFAULT` | ACCESS EXCLUSIVE | HIGH | Add nullable, backfill, then set `NOT NULL` |
| `CREATE INDEX` (non-concurrent) | SHARE | MEDIUM | `CREATE INDEX CONCURRENTLY` |
| `ALTER COLUMN TYPE` | ACCESS EXCLUSIVE | HIGH | Expand/contract pattern |
| `ADD CONSTRAINT ... FOREIGN KEY` | ACCESS EXCLUSIVE | HIGH | `NOT VALID` then `VALIDATE CONSTRAINT` |
| `DROP TABLE` | ACCESS EXCLUSIVE | CRITICAL | Separate release |
| Missing `SET lock_timeout` | Policy | ERROR | Add `SET lock_timeout = '2s'` |

For a full list of checks and safe rewrite recipes, see the [pgfence documentation](https://github.com/flvmnt/pgfence#readme).

## Add pgfence to CI with GitHub Actions

You can integrate pgfence into your CI pipeline so that every pull request is checked for dangerous migration patterns before merging. The following example uses [Neon branching](/docs/introduction/branching) to create a preview branch and run pgfence against the migration files in the PR:

```yaml
name: Migration safety check

on:
  pull_request:
    paths:
      - 'migrations/**'

jobs:
  pgfence:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pgfence
        run: npm install -g @flvmnt/pgfence

      - name: Analyze migrations
        run: pgfence analyze --ci --max-risk medium --output github migrations/*.sql
```

The `--ci` flag causes pgfence to exit with a non-zero code if any statement exceeds the risk threshold set by `--max-risk`. The `--output github` flag formats the output as a markdown summary suitable for GitHub PR comments.

<Admonition type="note">
The `--max-risk` flag accepts `low`, `medium`, `high`, or `critical`. Setting it to `medium` means pgfence will fail the check for any statement rated `HIGH` or above.
</Admonition>

## DB-size-aware risk scoring

pgfence can adjust risk levels based on actual table sizes. For large tables, operations that are normally medium-risk become high or critical. Rather than providing database credentials to pgfence, you export a stats snapshot from your Neon database and pass it as a file:

### Export table stats

Connect to your Neon database and run the stats extraction query:

```bash
psql "$DATABASE_URL" -t -A -F',' -c "
  SELECT schemaname, relname, n_live_tup,
         pg_total_relation_size(relid) as total_bytes
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;
" > pgfence-stats.csv
```

You can also use `pgfence extract-stats` if you prefer JSON output:

```bash
pgfence extract-stats --db-url "$DATABASE_URL" > pgfence-stats.json
```

### Analyze with stats

Pass the stats file to pgfence for size-aware scoring:

```bash
pgfence analyze --stats-file pgfence-stats.json migrations/*.sql
```

pgfence uses the following thresholds to adjust risk levels:

| Table size | Risk adjustment |
| --- | --- |
| Less than 10K rows | No change |
| 10K to 1M rows | Risk increased by 1 level |
| 1M to 10M rows | Risk increased by 2 levels |
| More than 10M rows | Always CRITICAL |

## Output formats

pgfence supports multiple output formats depending on your use case:

```bash
# Terminal table (default) — color-coded risk levels
pgfence analyze migrations/*.sql

# JSON — for programmatic consumption
pgfence analyze --output json migrations/*.sql

# GitHub PR comment — markdown formatted
pgfence analyze --output github migrations/*.sql
```

## Resources

- [pgfence on GitHub](https://github.com/flvmnt/pgfence)
- [pgfence on npm](https://www.npmjs.com/package/@flvmnt/pgfence)
- [pgfence documentation](https://pgfence.dev)
- [Neon branching](/docs/introduction/branching)
- [Connection pooling](/docs/connect/connection-pooling)

<NeedHelp/>
