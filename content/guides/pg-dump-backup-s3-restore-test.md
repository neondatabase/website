---
title: Back up Neon to S3 with pg_dump and test every restore
subtitle: A nightly GitHub Actions workflow that dumps your database to S3-compatible storage, restores the dump into a throwaway Postgres, and compares row counts table by table
author: super-lede
enableTableOfContents: true
createdAt: '2026-11-13T00:00:00.000Z'
updatedOn: '2026-11-13T00:00:00.000Z'
---

Neon keeps a history of changes for instant restore, and on paid plans it can take scheduled snapshots. Both live inside your Neon project. Some teams also want a copy somewhere else, in their own bucket and under their own retention rules. `pg_dump` makes that copy as a portable archive. To know the copy is good, you restore it and check what comes back.

This guide sets up a GitHub Actions workflow that does both every night. The first job dumps your database and uploads the archive to Amazon S3 or any S3-compatible service, such as Cloudflare R2, Backblaze B2, Wasabi, or MinIO. The second job downloads that same file, restores it into a temporary Postgres, and fails if any table comes back with a different number of rows than the dump holds.

## What Neon already covers

- **Instant restore.** Neon retains a change history for your project and can restore a root branch to any point inside the [history window](/docs/postgres/backup-restore/history-window). The window is 6 hours on the Free plan. On Launch and Scale it defaults to 1 day and can be raised to 7 and 30 days.
- **Snapshots.** You can [snapshot a root branch](/docs/guides/backup-restore) before a risky change, and paid plans can schedule daily, weekly, or monthly snapshots.
- **Deleted projects.** A deleted project can be [recovered for 7 days](/docs/manage/projects#recover-a-deleted-project).

For a bad migration or an accidental `DELETE`, instant restore is the faster fix, and you don't need a dump file for it. A `pg_dump` archive covers a different case. It sits outside your Neon account, it stays as long as your own retention policy says, and you can restore it into another Neon project, a container on your laptop, or a different host, as long as that server runs the same Postgres major version and has the extensions your database uses. Neon's [Backups](/docs/postgres/backup-restore/backups) page lists business continuity, disaster recovery, and compliance as the reasons to keep one.

## Why the backup job needs a restore step

A green backup job tells you that `pg_dump` exited 0 and the upload finished. It doesn't tell you the file in the bucket will restore. A few ways it can fail without a single red run:

- The archive is cut short, for example because the upload was piped from a `pg_dump` that died halfway.
- The connection string points at the wrong database. A new Neon project's first database is named `neondb` unless you pick another name. If your app's tables live in a database you created later, a dump of `neondb` is valid and nearly empty.
- The dump needs an extension that the restore target doesn't have.

Restoring catches the first and the third. The script below also fails on a dump with no table data, but it can't tell whether you picked the right database, so read the table list in the job log after the first run. The scripts in this guide are short and specific to Neon. For a host-agnostic version of [pg_dump to S3](https://backupdrill.com/guides/pg-dump-to-s3) with checksums, client-side encryption, and storage cost comparisons, see that walkthrough.

## Prerequisites

- A project on Neon, and the name of the database you want to back up.
- An S3 bucket, or a bucket on an S3-compatible service, with an access key that can write, read, and list objects under one prefix.
- A GitHub repository where you can add Actions secrets.

To run the scripts locally as well, you need `pg_dump`, `pg_restore`, and `psql` of your Postgres major version, plus AWS CLI v2. The workflow installs the Postgres tools itself, and GitHub's Ubuntu runners come with AWS CLI v2.

## Get the direct connection string

Open your project in the Neon Console and click **Connect** to open the **Connect to your branch** modal. Choose the branch, database, and role, then turn **Connection pooling** off. The direct connection string looks like this:

```bash shouldWrap
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

The pooled string has `-pooler` after the endpoint ID (`ep-cool-darkness-123456-pooler`). Neon's pooler runs PgBouncer in transaction mode and hands the server connection back to the pool after every transaction. `pg_dump` depends on session settings made with `SET`, so Neon's [connection pooling](/docs/connect/connection-pooling) docs say to use a direct connection for `pg_dump` and `pg_restore`.

<Admonition type="important">
Use the direct connection string. The backup script below stops with an error if `DATABASE_URL` contains `-pooler.`.
</Admonition>

If your compute [scales to zero](/docs/introduction/scale-to-zero), the nightly connection wakes it up, and it stays active while the dump runs. That time counts toward your compute usage like any other connection.

## Match pg_dump to your Postgres version

Check the major version your project runs with `SELECT version();` in the SQL Editor. Then use client tools of that same major version, in both jobs. Version mismatches can cause errors like these.

An older `pg_dump` refuses to dump a newer server. This is `pg_dump` 16 against a Postgres 17 server:

```text
pg_dump: error: aborting because of server version mismatch
```

A newer `pg_dump` can dump an older server, but its archive may need a newer `pg_restore`. A dump made with `pg_dump` 17 and read with `pg_restore` 16 gives:

```text
pg_restore: error: unsupported version (1.16) in file header
```

In the workflow below, set both `PG_VERSION` and the `postgres:` image tag to your project's major version. The backup script also compares the client and server major versions before it dumps anything.

## Step 1: Add the backup script

Save this as `scripts/neon-backup.sh` in your repository:

```bash
#!/usr/bin/env bash
# Dump a Neon database with pg_dump and upload the archive to S3-compatible storage.
set -euo pipefail

: "${DATABASE_URL:?set DATABASE_URL to the direct (non-pooled) connection string}"
: "${S3_BUCKET:?set S3_BUCKET}"
prefix="${S3_PREFIX:-neon}"

# pg_dump needs a session, which the PgBouncer endpoint (-pooler) does not keep.
case "$DATABASE_URL" in
  *-pooler.*)
    echo "DATABASE_URL uses the pooled host. Use the direct connection string." >&2
    exit 1
    ;;
esac

# The client must match the server's major version. An older pg_dump refuses
# to dump a newer server; a newer one may write an archive older pg_restore can't read.
server_major="$(psql "$DATABASE_URL" -Atc 'show server_version_num')"
server_major="${server_major:0:2}"
client_major="$(pg_dump --version | awk '{print $3}' | cut -d. -f1)"
if [ "$server_major" != "$client_major" ]; then
  echo "pg_dump is version $client_major, the server runs Postgres $server_major." >&2
  exit 1
fi

key="$prefix/$(date -u +%Y-%m-%dT%H-%M-%SZ).dump"
file="$(mktemp)"
trap 'rm -f "$file"' EXIT

# Write to a local file first, so a dump that fails halfway is never uploaded.
pg_dump --format=custom --file="$file" "$DATABASE_URL"
aws s3 cp "$file" "s3://$S3_BUCKET/$key" --only-show-errors

echo "uploaded s3://$S3_BUCKET/$key ($(wc -c < "$file" | tr -d ' ') bytes)"
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  echo "key=$key" >> "$GITHUB_OUTPUT"
fi
```

A few choices in this script:

- `--format=custom` writes a compressed archive that `pg_restore` can restore whole, in parallel, or one table at a time.
- The dump goes to a temporary file before anything is uploaded. With `set -e`, a failed `pg_dump` ends the script before `aws s3 cp` runs, so a partial dump never lands in the bucket.
- Object names are UTC timestamps, so they sort by date and the newest is easy to find.
- When the script runs in GitHub Actions, it writes the object key to `GITHUB_OUTPUT` so the restore job checks the exact file this run uploaded.

## Step 2: Add the restore check script

Save this as `scripts/restore-check.sh`:

```bash
#!/usr/bin/env bash
# Restore a dump from S3 into an empty database and compare each table's
# row count with the number of rows the dump holds for it.
# Usage: restore-check.sh [object key]   (default: newest .dump under S3_PREFIX)
set -euo pipefail

: "${RESTORE_URL:?set RESTORE_URL to an empty scratch database}"
: "${S3_BUCKET:?set S3_BUCKET}"
prefix="${S3_PREFIX:-neon}"
key="${1:-}"

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

if [ -z "$key" ]; then
  newest="$(aws s3 ls "s3://$S3_BUCKET/$prefix/" | awk '{print $4}' | grep '\.dump$' | sort | tail -n 1 || true)"
  [ -n "$newest" ] || { echo "no dumps under s3://$S3_BUCKET/$prefix/" >&2; exit 1; }
  key="$prefix/$newest"
fi
aws s3 cp "s3://$S3_BUCKET/$key" "$workdir/backup.dump" --only-show-errors

# 1. Restore. --exit-on-error turns the first failed statement into a failed job.
pg_restore --no-owner --no-privileges --exit-on-error \
  --dbname="$RESTORE_URL" "$workdir/backup.dump"

# 2. Count the rows stored in the dump. As SQL, each table's data is one
#    COPY block with one line per row, ending in a line that is just "\.".
pg_restore --data-only --file=- "$workdir/backup.dump" | awk '
  BEGIN { OFS = "\t" }
  /^COPY .* FROM stdin;$/ {
    table = substr($0, 6)
    sub(/ +FROM stdin;$/, "", table)
    sub(/ \(.*$/, "", table)
    rows[table] += 0
    in_copy = 1
    next
  }
  in_copy && $0 == "\\." { in_copy = 0; next }
  in_copy { rows[table]++ }
  END { for (t in rows) print t, rows[t] }
' | sort > "$workdir/expected.tsv"

if [ ! -s "$workdir/expected.tsv" ]; then
  echo "FAIL: $key contains no table data" >&2
  exit 1
fi

# 3. Count the rows that came back and compare.
failed=0
printf '%-32s %10s %10s\n' "table" "in dump" "restored"
while IFS=$'\t' read -r table expected; do
  restored="$(psql "$RESTORE_URL" -Atc "select count(*) from $table" 2> /dev/null)" || restored="missing"
  mark=""
  if [ "$restored" != "$expected" ]; then
    mark="  <-- mismatch"
    failed=1
  fi
  printf '%-32s %10s %10s%s\n' "$table" "$expected" "$restored" "$mark"
done < "$workdir/expected.tsv"

tables="$(wc -l < "$workdir/expected.tsv" | tr -d ' ')"
if [ "$failed" -ne 0 ]; then
  echo "FAIL: $key restored, but row counts differ"
  exit 1
fi
echo "PASS: $key restored, $tables tables match"
```

How it works:

- **Restore.** `--no-owner` and `--no-privileges` skip `ALTER ... OWNER` and `GRANT` statements. The roles from your Neon project, such as `neondb_owner`, don't exist in the temporary Postgres, so those statements would fail. `--exit-on-error` stops at the first error. Without it, `pg_restore` keeps going and only reports an error count at the end.
- **Expected row counts come from the dump itself.** `pg_restore --data-only --file=-` prints the archive's data as SQL, one `COPY` block per table. Inside a block, every row is one line, because the `COPY` text format writes newlines in values as `\n`. Counting those lines gives the exact number of rows the dump holds, and the check never queries your production database.
- **Comparison.** For each table in the dump, the script counts rows in the restored database. If the count query for a table fails, the script prints `missing` for it. Any difference fails the job.

The table names come from the `COPY` lines exactly as `pg_dump` wrote them, already quoted where needed, so names like `"Audit Log"` work as is. Partitioned tables are listed per partition, because that's how `pg_dump` stores their data.

## Step 3: Add the workflow

Add these secrets under **Settings** > **Secrets and variables** > **Actions** in your repository:

| Secret                  | Value                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| `NEON_DATABASE_URL`     | The direct connection string from earlier                         |
| `S3_BUCKET`             | The bucket name                                                   |
| `AWS_ACCESS_KEY_ID`     | Access key for the bucket                                         |
| `AWS_SECRET_ACCESS_KEY` | Secret for that key                                               |
| `AWS_ENDPOINT_URL`      | Only for R2, B2, Wasabi, or MinIO: the provider's S3 endpoint URL |

Then save this as `.github/workflows/neon-backup.yml`:

```yaml
name: neon-backup

on:
  schedule:
    - cron: '30 3 * * *' # daily at 03:30 UTC
  workflow_dispatch:

permissions:
  contents: read

env:
  PG_VERSION: '17' # your Neon project's Postgres major version
  S3_BUCKET: ${{ secrets.S3_BUCKET }}
  S3_PREFIX: neon/production
  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_DEFAULT_REGION: us-east-1
  # R2, B2, Wasabi, MinIO: the provider's S3 endpoint. Leave the secret unset for AWS S3.
  AWS_ENDPOINT_URL: ${{ secrets.AWS_ENDPOINT_URL }}

jobs:
  backup:
    runs-on: ubuntu-24.04
    outputs:
      key: ${{ steps.dump.outputs.key }}
    steps:
      - uses: actions/checkout@v5

      - name: Install Postgres client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-common
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt-get install -y "postgresql-client-${PG_VERSION}"
          echo "/usr/lib/postgresql/${PG_VERSION}/bin" >> "$GITHUB_PATH"

      - name: Dump and upload
        id: dump
        run: bash scripts/neon-backup.sh
        env:
          DATABASE_URL: ${{ secrets.NEON_DATABASE_URL }}

  restore-check:
    needs: backup
    runs-on: ubuntu-24.04
    services:
      postgres:
        image: postgres:17 # same major version as PG_VERSION
        env:
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -h 127.0.0.1 -U postgres"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 20
    steps:
      - uses: actions/checkout@v5

      - name: Install Postgres client
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql-common
          yes '' | sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
          sudo apt-get install -y "postgresql-client-${PG_VERSION}"
          echo "/usr/lib/postgresql/${PG_VERSION}/bin" >> "$GITHUB_PATH"

      - name: Restore and compare row counts
        run: bash scripts/restore-check.sh "$BACKUP_KEY"
        env:
          BACKUP_KEY: ${{ needs.backup.outputs.key }}
          RESTORE_URL: postgresql://postgres:postgres@localhost:5432/postgres
```

Notes on the workflow:

- **Two jobs, one file.** `restore-check` runs only after `backup` succeeds, and it checks the object the backup job just uploaded, downloaded back from the bucket. That proves the stored copy restores, not just the file that was on the runner.
- **Postgres version.** `PG_VERSION` and the `postgres:` image tag must name the same major version as your project. The install step adds the PostgreSQL apt repository and puts that version's client first on `PATH`, because the runner image ships its own Postgres client, currently version 16.
- **Runner image.** The jobs use `ubuntu-24.04` rather than `ubuntu-latest`, to avoid an automatic move to a newer Ubuntu release. GitHub still updates the image itself, usually every week.
- **Health check.** The `postgres` image runs a temporary server during initialization that only listens on a Unix socket. Checking over TCP with `-h 127.0.0.1` means the job starts only when the real server accepts connections.
- **Endpoint.** With `AWS_ENDPOINT_URL` empty, AWS CLI v2 talks to AWS S3. Set it for any other provider.
- **Schedule.** GitHub may start scheduled runs late when it's busy. In public repositories, it also disables scheduled workflows after 60 days without repository activity, so check the **Actions** tab now and then.

## Step 4: Run it and read the result

Commit the two scripts and the workflow, then start a run from the **Actions** tab with **Run workflow**. A passing `restore-check` job prints one line per table:

```text
table                               in dump   restored
billing.invoices                       9000       9000
public."Audit Log"                      300        300
public.empty_queue                        0          0
public.events_2026_10                  3446       3446
public.events_2026_11                  1554       1554
public.orders                         12000      12000
public.users                           2000       2000
PASS: neon/production/2026-11-12T17-30-24Z.dump restored, 7 tables match
```

An empty table shows `0` on both sides and passes. That's correct for a queue that drains, but if a table that should have data shows zeros, look at the source database.

Here is what the failures from earlier look like.

A truncated archive stops the restore:

```text
pg_restore: error: could not read from input file: end of file
```

When the restore succeeds but a table's row count differs from the dump, the line is flagged and the job fails:

```text
billing.invoices                       9000       8990  <-- mismatch
...
FAIL: neon/production/2026-11-12T17-30-24Z.dump restored, but row counts differ
```

An extension the restore target doesn't have stops the restore at `CREATE EXTENSION`. With `pgvector` and the stock `postgres:17` image:

```text
pg_restore: error: could not execute query: ERROR:  extension "vector" is not available
Command was: CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;
```

<Admonition type="note" title="Extensions">
The stock `postgres` image ships only the extensions that come with Postgres itself. If your database uses `pgvector`, change the service image to `pgvector/pgvector:pg17` (with your major version). For extensions that no public image carries, restore into a Neon branch instead, as described below.
</Admonition>

## Restore into a Neon branch instead

A temporary container is quick to set up, but it isn't Neon. To run the same check on Neon itself, create a branch, add an empty database to it with [`neon databases create`](/docs/cli/databases), and get that database's direct connection string with [`neon connection-string`](/docs/cli/connection-string). Pass it to the script as `RESTORE_URL`, run `scripts/restore-check.sh`, and delete the branch when the check is done. The branch gets its own compute, so the restore doesn't compete with production for CPU, and every extension Neon supports is available to it.

## Retention and access

- Let the bucket delete old dumps with a lifecycle rule. S3, R2, and B2 all support one. The key in GitHub can then leave out delete permission.
- A key that can write can still overwrite an existing dump. Turn on bucket versioning where your provider has it, so an overwritten dump stays recoverable as an older version.
- If you want tighter keys, give the `backup` job a key that can only write to the prefix and the `restore-check` job a key that can only read and list it. Move the two `AWS_*` key variables from the workflow `env` into each job's `env`.

## Summary

You now have a nightly workflow that dumps your database over a direct connection with a matching `pg_dump`, uploads the archive to S3-compatible storage, and proves the uploaded file restores by comparing every table's row count with what the dump holds. Instant restore remains the quickest fix for mistakes inside the history window. The dump in your bucket is the copy you can take anywhere.

## Resources

- [Backups with pg_dump](/docs/manage/backup-pg-dump)
- [Automate pg_dump backups](/docs/manage/backup-pg-dump-automate)
- [Instant restore](/docs/postgres/backup-restore/branch-restore)
- [History window](/docs/postgres/backup-restore/history-window)
- [Connection pooling](/docs/connect/connection-pooling)
- [PostgreSQL documentation: pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL documentation: pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [GitHub Docs: the schedule event](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#schedule)

<NeedHelp/>
