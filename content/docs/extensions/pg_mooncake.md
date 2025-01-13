---
title: The pg_mooncake extension
subtitle: Fast analytics in Postgres with columnstore tables and DuckDB execution.
enableTableOfContents: true
updatedOn: '2024-01-13T18:45:00.000Z'
---
[`pg_mooncake`](https://github.com/Mooncake-Labs/pg_mooncake) enables fast analytic workloads in Postgres by adding native columnstore tables and vectorized execution (DuckDB). 

Columnstore tables improve analytical queries by storing data vertically, enabling compression and efficient column-specific retrieval with vectorized execution. 

`pg_mooncake` columnstore tables are designed so that only metadata is stored in Postgres, while data is stored in object store as Parquet files with [Iceberg](https://iceberg.apache.org/)or [Delta Lake](https://delta.io/) metadata.

Queries on `pg_mooncake` columnstore tables are executed by DuckDB. 

<CTA />

You can create and use `pg_mooncake` columnstore tables like regular Postgres heap tables and run: 

- Transactional INSERT, SELECT, UPDATE, DELETE, and COPY.
- Joins with regular Postgres tables.

In addition, you can:
- Load Parquet, CSV, and JSON files into columnstore tables.
- Load Hugging Face datasets.
- Run DuckDB specific aggregate functions like `approx_count_distinct`.
- Read existing Iceberg and Delta Lake tables.
- Write Delta Lake tables from Postgres tables.

**Version availability:**

`pg_mooncake` is supported on the following versions of Postgres.

- Postgres 14 - `pg_mooncake` 0.1.0
- Postgres 15 - `pg_mooncake` 0.1.0
- Postgres 16 - `pg_mooncake` 0.1.0
- Postgres 17 -`pg_mooncake` 0.1.0

<Admonition type="note">
`pg_mooncake` is an open-source extension for Postgres that can be installed on any Neon Project using the instructions below.
</Admonition>

## Use-cases
1. Analytics on Postgres data
2. Time Series & Log Analytics
3. Exporting Postgre Tables to Your Lake or Lakehouse.
4. Query and update existing Lakehouse tables and Parquet files directly in PostgreSQL.

This guide provides a quickstart to the `pg_mooncake` extension. 

## Enable the extension
While the extension is in beta, run:
```sql
SET neon.allow_unstable_extensions='true';
```
Install the extension:
```sql
CREATE EXTENSION pg_mooncake;
```

## Set up your object store. 
Get a free S3 express bucket [here](https://s3.pgmooncake.com/). 

First, add your object storage credentials. In this case, S3:
```sql
SELECT mooncake.create_secret('<name>', 'S3', '<key_id>', 
          '<secret>', '{"REGION": "<s3-region>"}');
```
Next, set your default bucket:
```sql
SET mooncake.default_bucket = 's3://<bucket>';
```

<Admonition type="note">
In the future, you will not have to bring your own buckets. 
</Admonition>


## Create a columnstore table with `USING columnstore`
```sql
CREATE TABLE reddit_comments (
    author TEXT,
    body TEXT,
    controversiality BIGINT,
    created_utc BIGINT,
    link_id TEXT,
    score BIGINT,
    subreddit TEXT,
    subreddit_id TEXT,
    id TEXT
) USING columnstore;
```
## Load data
Read the full list of sources [here](https://pgmooncake.com/docs/load-data).

In this case, we load Hugging Face [dataset](https://huggingface.co/datasets/fddemarco/pushshift-reddit-comments) into the table. 
This dataset has 13 million rows, and will take a couple minutes to load. 
```sql
COPY reddit_comments FROM 'hf://datasets/fddemarco/pushshift-reddit-comments/data/RC_2012-01.parquet';
```

## Query the table
Queries on columnstore tables will be executed by DuckDB. This aggregate query runs in ~200 milliseconds on 13 million rows. 
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

## References

- [Repository](https://github.com/Mooncake-Labs/pg_mooncake)
- [Documentation](https://pgmooncake.com/docs)
- [Architecture](https://www.mooncake.dev/blog/how-we-built-pgmooncake)