---
title: 'How do I import data from a CSV file into my Neon database?'
subtitle: 'Use psql with \copy from your local machine, or pgloader for large or messy CSVs.'
enableTableOfContents: true
createdAt: '2026-05-18T00:00:00.000Z'
updatedOn: '2026-05-18T19:11:12.829Z'
isDraft: false
redirectFrom: []
---

Create the target table in Neon, then run `\copy` from a `psql` session connected to your database. `\copy` streams the CSV from your local filesystem over the existing connection, so it works without any special server-side file access. For larger or messier CSVs, `pgloader` handles encoding, type coercion, and parallel loading. See [Import data from CSV](/docs/import/import-from-csv) for the full walkthrough.

## Import a CSV with psql

First, create the destination table. The columns and order must match the CSV:

```sql
CREATE TABLE customer (
  id          SERIAL PRIMARY KEY,
  first_name  VARCHAR(50),
  last_name   VARCHAR(50),
  email       VARCHAR(255)
);
```

You can run this from the [Neon SQL Editor](/docs/get-started/query-with-neon-sql-editor) or from `psql`.

Then connect with `psql` (copy the `psql` command from the **Connection Details** modal, opened from **Connect** on your Project Dashboard) and load the file:

```bash
\copy customer FROM '/path/to/customer.csv' DELIMITER ',' CSV HEADER;
```

On success, psql prints the number of rows loaded:

```text
COPY 1842
```

`CSV HEADER` tells psql to skip the first row of the file. Drop `HEADER` if your CSV has no header line.

### Load specific columns

If the CSV has fewer or differently-ordered columns than the table:

```bash
\copy customer (first_name, last_name, email) FROM '/path/to/customer.csv' DELIMITER ',' CSV HEADER;
```

## When to reach for pgloader

`pgloader` is a third-party tool worth using when:

- The CSV is millions of rows and you want parallel loading
- Source columns need type casts or date parsing
- The file has encoding issues, embedded quotes, or inconsistent rows
- You're loading from MySQL, SQLite, or another database, not just CSV

It writes a small config file that describes the source, target, and any transformations, then runs the load with error reporting. See the [pgloader documentation](https://pgloader.readthedocs.io/) for syntax.

<Admonition type="note" title="The SQL Editor does not support \copy">
`\copy` is a psql client-side meta-command. It runs in psql itself, not on the Postgres server. The Neon SQL Editor in the Console supports many meta-commands (`\dt`, `\d`, `\l`), but not `\copy`. Use psql, a Postgres GUI like DBeaver or pgAdmin, or a script in your language of choice.
</Admonition>

<Admonition type="tip" title="COPY FROM STDIN works too">
The server-side `COPY ... FROM '/path/to/file.csv'` form reads from the Postgres server's filesystem, which isn't accessible on Neon. `COPY ... FROM STDIN` works fine over a connection and is what `\copy` uses under the hood. Either approach (psql `\copy` or `COPY FROM STDIN` from a driver) streams data from the client.
</Admonition>

<CTA title="Walk through a full CSV import" description="Step-by-step example: connect, create the table, prep the CSV, and load with psql." buttonText="Read the CSV import guide" buttonUrl="/docs/import/import-from-csv" />
