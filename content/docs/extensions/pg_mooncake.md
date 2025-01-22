---
title: The pg_mooncake extension
subtitle: Fast analytics in Postgres with columnstore tables and DuckDB execution
tag: new
enableTableOfContents: true
updatedOn: '2025-01-20T13:01:32.028Z'
---

The [pg_mooncake](https://github.com/Mooncake-Labs/pg_mooncake) extension enables fast analytic workloads in Postgres by adding native columnstore tables and vectorized execution (DuckDB).

Columnstore tables improve analytical queries by storing data vertically, enabling compression and efficient column-specific retrieval with vectorized execution.

`pg_mooncake` columnstore tables are designed so that only metadata is stored in Postgres, while data is stored in an object store as Parquet files with [Iceberg](https://iceberg.apache.org/)or [Delta Lake](https://delta.io/) metadata.

Queries on `pg_mooncake` columnstore tables are executed by DuckDB.

<CTA />

You can create and use `pg_mooncake` columnstore tables like regular Postgres heap tables to run:

- Transactional `INSERT`, `SELECT`, `UPDATE`, `DELETE`, and `COPY` operations
- Joins with regular Postgres tables

In addition, you can:

- Load Parquet, CSV, and JSON files into columnstore tables
- Load Hugging Face datasets
- Run DuckDB specific aggregate functions like `approx_count_distinct`
- Read existing Iceberg and Delta Lake tables
- Write Delta Lake tables from Postgres tables

**Version availability:**

`pg_mooncake` is supported on the following versions of Postgres.

- Postgres 14 - `pg_mooncake` 0.1.0
- Postgres 15 - `pg_mooncake` 0.1.0
- Postgres 16 - `pg_mooncake` 0.1.0
- Postgres 17 -`pg_mooncake` 0.1.0

<Admonition type="note">
`pg_mooncake` is an open-source extension for Postgres that can be installed on any Neon Project using the instructions below.
</Admonition>

## Use cases for pg_mooncake

`pg_mooncake` supports several use cases, including:

1. Analytics on Postgres data
2. Time Series & Log Analytics
3. Exporting Postgres tables to your Lake or Lakehouse
4. Querying and updating existing Lakehouse tables and Parquet files directly in Postgres

This guide provides a quickstart to the `pg_mooncake` extension.

<Steps>

## Enable the extension

<Admonition type="note">
The `pg_mooncake` extension is currently in beta. A separate, dedicated Neon project is recommended when using an extension that is still in Beta.
</Admonition>

While the `pg_mooncake` extension is in Beta, you need to explicitly allow it to be used on Neon before you can install it. To do so, connect to your Neon database via an SQL client like [psql](/docs/connect/query-with-psql-editor) or the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) and run the `SET` command shown below.

```sql
SET neon.allow_unstable_extensions='true';
```

Install the extension:

```sql
CREATE EXTENSION pg_mooncake;
```

## Set up your object store

Run the commands outlined in the following steps on your Neon database to setup your object store.

<Admonition type="tip">
If you don't have an object storage bucket, you can get a free S3 express bucket [here](https://s3.pgmooncake.com/). When using the free s3 bucket, the `SELECT` and `SET` statements defined below are generated for you, which you can copy and run.
</Admonition>

Add your object storage credentials. In this case, S3:

```sql
SELECT mooncake.create_secret('<name>', 'S3', '<key_id>',
        '<secret>', '{"REGION": "<s3-region>"}');
```

Set your default bucket:

```sql
SET mooncake.default_bucket = 's3://<bucket>';
```

<Admonition type="note">
In the future, you will not have to bring your own bucket to use `pg_mooncake` with Neon. 
</Admonition>

## Create a columnstore table with `USING columnstore`

Run the following SQL statement on your Neon database to create a columnstore table:

```sql
CREATE TABLE reddit_comments(
    author TEXT,
    body TEXT,
    controversiality BIGINT,
    created_utc BIGINT,
    link_id TEXT,
    score BIGINT,
    subreddit TEXT,
    subreddit_id TEXT,
    id TEXT
) using columnstore;
```

## Load data

You can find a list of data sources [here](https://pgmooncake.com/docs/load-data).
This dataset has 13 million rows and may take a few minutes to load.

```sql
INSERT INTO reddit_comments
(SELECT author, body, controversiality, created_utc, link_id, score, subreddit, subreddit_id, id
FROM mooncake.read_parquet('hf://datasets/fddemarco/pushshift-reddit-comments/data/RC_2012-01.parquet')
AS (author TEXT, body TEXT, controversiality BIGINT, created_utc BIGINT, link_id TEXT, score BIGINT, subreddit TEXT, subreddit_id TEXT, id TEXT));
```

## Query the table

Queries on columnstore tables are executed by DuckDB. For example, this aggregate query runs in ~200 milliseconds on 13 million rows:

```sql
-- Top commenters (excluding [deleted] users)
SELECT
    author,
    COUNT(*) as comment_count,
    AVG(score) as avg_score,
    SUM(score) as total_score
FROM reddit_comments
WHERE author != '[deleted]'
GROUP BY author
ORDER BY comment_count DESC
LIMIT 10;
```

</Steps>

## References

- [Repository](https://github.com/Mooncake-Labs/pg_mooncake)
- [Documentation](https://pgmooncake.com/docs)
- [Architecture](https://www.mooncake.dev/blog/how-we-built-pgmooncake)
- [YouTube demo](https://youtu.be/QDNsxw_3ris?feature=shared&t=2048) 
