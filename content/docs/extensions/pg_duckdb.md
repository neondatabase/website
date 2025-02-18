---
title: The pg_duckdb extension
subtitle: Accelerated analytics with DuckDB in Postgres
tag: new
enableTableOfContents: true
updatedOn: '2025-02-18T00:00:00.000Z'
---

`pg_duckdb` is a Postgres extension that integrates the [DuckDB](https://duckdb.org) analytics engine directly into Postgres. It allows you to leverage DuckDB's analytical query processing while working within your familiar Postgres environment. With `pg_duckdb`, you can achieve significantly faster analytical queries, especially when dealing with large datasets or complex analytical workloads.

<CTA />

This guide provides an introduction to the `pg_duckdb` extension for Neon. You will learn how to enable the extension, explore its key features, perform analytical queries and integrate it with data lakes.

<Admonition type="note">
`pg_duckdb` is an open-source Postgres extension that embeds DuckDB's columnar analytics engine, developed in collaboration with [Hydra](https://hydra.so) and [MotherDuck](https://motherduck.com). It can be installed on any Neon Project using the instructions below.
</Admonition>

## Enable the `pg_duckdb` extension

You can install the `pg_duckdb` extension by running the following `CREATE EXTENSION` statement in the [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or from a client such as [psql](/docs/connect/query-with-psql-editor) that is connected to your Neon database.

```sql
CREATE EXTENSION IF NOT EXISTS pg_duckdb;
```

**Version availability:**

Please refer to the [list of all extensions](/docs/extensions/pg-extensions) available in Neon for up-to-date extension version information.


## Key features of `pg_duckdb`

`pg_duckdb` brings a range of powerful features to your Postgres database. Few of the key features include:

| Feature                     | Description                                                                                                                                                           |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Accelerated analytical queries** | Execute analytical queries with DuckDB's vectorized engine, achieving significantly faster performance compared to native Postgres for many analytical workloads. |
| **Data Lake Integration**       | Query parquet, CSV, and JSON files directly from object storage (like AWS S3, Google Cloud Storage, and Cloudflare R2) using familiar SQL syntax.                |
| **Iceberg and Delta Lake support** | Access and analyze data stored in Iceberg and Delta Lake formats, enabling seamless integration with modern data lake architectures.                               |
| **DuckDB function ecosystem**   | Utilize DuckDB's rich set of built-in functions, including specialized JSON functions.                         |
| **Secure secrets management**    | Securely manage credentials for accessing data lakes and cloud storage through `duckdb.secrets`.                                                        |
| **Export result to Data Lakes**    |  Export query results directly to object storage in Parquet format, enabling seamless data movement between Postgres and data lakes.                              |
| **File Caching**             | Cache data lake files locally for faster subsequent access, improving query performance for frequently accessed data.                                                 |
| **Force DuckDB Execution**   |  Optionally force queries to be executed by DuckDB's engine, even when queries only involve Postgres tables.                                                        |

Let's explore these features in detail with examples in the following sections.

## Querying data with `pg_duckdb`

Now that you have enabled `pg_duckdb` and understand its key features, let's dive into practical examples of how to use it for accelerated analytics and data lake integration.

### Reading data directly from Data Lakes

One of the most compelling features of `pg_duckdb` is its ability to directly query data stored in data lakes. This eliminates the need for complex and time-consuming data loading processes, allowing you to analyze your data where it resides.

#### Analyzing parquet files on AWS S3 / Google Cloud Storage / Azure Blob Storage

Let's start with a practical example of querying a publicly hosted Netflix dataset in Parquet format on AWS S3. We'll use `pg_duckdb` to find the top 3 TV shows based on their "Days In Top 10" ranking

```sql
SELECT r['Title'], max(r['Days In Top 10']) AS MaxDaysInTop10
FROM read_parquet('s3://us-prd-motherduck-open-datasets/netflix/netflix_daily_top_10.parquet') AS r
WHERE r['Type'] = 'TV Show'
GROUP BY r['Title']
ORDER BY MaxDaysInTop10 DESC
LIMIT 3;
```

**Query Breakdown:**

- **`read_parquet('s3://...')`**: A function which reads data from the specified Parquet file located in S3. It handles the connection to S3, retrieves the file, and understands the Parquet format to efficiently load the data into the query.

The rest of the query filters for TV shows, groups them by title, finds the maximum "Days In Top 10" for each show, and returns the top 3.

Run the above query in [Neon SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor) or your preferred client connected to your Neon database to see the results.

```
   Title      | maxdaysintop10
-----------+----------------
 Cocomelon |            428
 Ozark     |             89
 Cobra Kai |             81
(3 rows)
```

#### Reading CSV and JSON files

`pg_duckdb` isn't limited to just Parquet files. You can also query CSV and JSON files directly from S3 using the `read_csv` and `read_json` functions, respectively.

```sql
-- Query a CSV file from S3
SELECT * FROM read_csv('s3://your-bucket/your-file.csv') LIMIT 5;

-- Query a JSON file from S3
SELECT * FROM read_json('s3://your-bucket/your-file.json') LIMIT 5;
```

**Customizing CSV and JSON parsing:**

Both `read_csv` and `read_json` functions offer a wide range of optional parameters to handle different formats and parsing requirements.

- `read_csv`: You can specify delimiters, headers, data types for columns, how to handle missing values, and much more. For a comprehensive list, refer to the [DuckDB documentation for CSV import](https://duckdb.org/docs/data/csv/overview).
- `read_json`:  You can control how JSON is parsed, including specifying the maximum parsing depth, sample size for schema inference, and more. See the [DuckDB documentation for loading JSON](https://duckdb.org/docs/data/json/loading_json) for details.

For example, if your CSV file uses a semicolon (`;`) as a delimiter and has no header row, you could use:

```sql
SELECT * FROM read_csv('s3://your-bucket/your-file.csv', delim := ';', header := false) LIMIT 5;
```

### Querying modern Data Lake formats: Iceberg and Delta Lake

`pg_duckdb`'s data lake integration extends to advanced formats like Iceberg and Delta Lake, which are popular in modern data lake architectures.

<Admonition type="note">
Iceberg and Delta extensions are included in `pg_duckdb` by default on Neon. So you can directly use the `iceberg_scan` and `delta_scan` functions without installing any additional extensions.
</Admonition>

#### Analyzing Iceberg tables

Let's analyze a public Iceberg table to rank shipping modes by total quantity.

```sql
SELECT r['l_shipmode'], SUM(r['l_quantity']) AS total_quantity
FROM iceberg_scan('s3://us-prd-motherduck-open-datasets/iceberg/lineitem_iceberg', allow_moved_paths := true) AS r
GROUP BY r['l_shipmode']
ORDER BY total_quantity DESC;
```

**Query Breakdown:**

- **`iceberg_scan('s3://us-prd-motherduck-open-datasets/iceberg/lineitem_iceberg', allow_moved_paths := true)`**: The `iceberg_scan` function is used to query Iceberg tables. It takes the S3 path to the Iceberg table as the main argument.
- **`allow_moved_paths := true`**: This parameter allows the query to handle Iceberg tables that have been moved or reorganized. It ensures that the query can access the data even if the table's metadata has changed.

**Expected output:**

```text
  l_shipmode        | total_quantity
------------------+----------------
 TRUCK            |         219078
 MAIL             |         216395
 FOB              |         214219
 REG AIR          |         214010
 SHIP             |         213141
 RAIL             |         212903
 AIR              |         211154
(7 rows)
```

#### Querying Delta Lake tables

Querying Delta Lake tables is similar using the `delta_scan` function.

```sql
SELECT *
FROM delta_scan('s3://your-delta-lake-bucket/delta/table');
```

### Approximate distinct count

`pg_duckdb` provides an efficient way to calculate approximate distinct counts using the `approx_count_distinct` function. This function is particularly useful for large datasets where exact counts are expensive to compute while using minimal memory.

```sql
-- Approximate distinct count
SELECT approx_count_distinct(r['Title']) AS unique_titles
FROM read_parquet('s3://us-prd-motherduck-open-datasets/netflix/netflix_daily_top_10.parquet') AS r;
```

### Securing Data Lake access with Secrets Manager

For secure access to data lakes, `pg_duckdb` integrates with DuckDB's [Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html). This is essential for protecting your cloud storage credentials.

#### Securely storing your credentials

The `duckdb.secrets` table is a secure vault for storing access keys and tokens. If you have a private S3 bucket or GCS bucket, which requires authentication, you can store your credentials securely in `duckdb.secrets`. This allows you to access your data lakes without exposing your credentials in your queries.

```sql
-- Securely store AWS S3 credentials
INSERT INTO duckdb.secrets (type, key_id, secret, region)
VALUES ('S3', 'YOUR_ACCESS_KEY_ID', 'YOUR_SECRET_ACCESS_KEY', 'us-east-1');
```

<Admonition type="note">
Never expose your credentials in your queries. Always use the `duckdb.secrets` table to securely store and manage your access keys and tokens.
</Admonition>

#### Accessing Data Lakes securely using secrets

Once you have stored your credentials in `duckdb.secrets`, `pg_duckdb` automatically retrieves and uses them when you query data lake resources or export data to data lakes.

```sql
-- Access data from S3 using stored secrets
SELECT *
FROM read_parquet('s3://my-bucket/my-secure-data.parquet');
```

The queries above will automatically use the stored credentials from `duckdb.secrets` to access the specified data lake resources.

### Exporting query results to Data Lakes

`pg_duckdb` enables you to export the results of your Postgres queries directly to data lakes in Parquet format. This allows for seamless data movement and integration with other data lake-centric workflows.  You can use the `COPY` command with a data lake path as the destination.

```sql
COPY (SELECT * FROM your_postgres_table WHERE some_condition)
TO 's3://your-bucket/exported_data.parquet'
WITH (FORMAT 'parquet');
```

**Explanation:**

- **`COPY (SELECT * FROM your_postgres_table WHERE some_condition)`**: This is standard Postgres `COPY` syntax specifying the query whose results you want to export. You can replace `SELECT * FROM your_postgres_table WHERE some_condition` with any valid SQL query that produces the data you intend to export.
- **`TO 's3://your-bucket/exported_data.parquet'`**: This specifies the destination for the exported data. Replace `'s3://your-bucket/exported_data.parquet'` with the actual path to your desired object storage location and filename.  The `.parquet` extension is recommended for efficient analytical storage.
- **`WITH (FORMAT 'parquet')`**: This explicitly specifies that the output format should be Parquet.

**Example:**

Let's say you have a Postgres table named `customer_analytics` and you want to export data from it to an S3 bucket called `neon-exported-data` in Parquet format.

```sql
COPY (SELECT customer_id, region, order_count FROM customer_analytics WHERE last_activity_date > now() - interval '30 days')
TO 's3://neon-exported-data/recent_customer_activity.parquet'
WITH (FORMAT 'parquet');
```

**Authentication for Export:**

If your target S3 bucket (or other object storage) requires authentication, ensure you have configured your credentials in the `duckdb.secrets` table as described in the [Securing Data Lake Access with Secrets Manager](#securing-data-lake-access-with-secrets-manager) section. `pg_duckdb` will automatically use the stored secrets when exporting data to protected locations.

### Caching Data Lake files

`pg_duckdb` allows you to cache data lake files locally, which can significantly improve query performance when accessing the same files repeatedly. You can use the `duckdb.cache()` function to explicitly cache a Parquet or CSV file.

<Admonition type="important">
Cached files on Neon uses your project's storage. Make sure you have enough storage available before caching large files.
</Admonition>

```sql
-- Cache a Parquet file from S3
SELECT duckdb.cache('s3://your-bucket/your-large-file.parquet', 'parquet');

-- Inspect cached files
SELECT * FROM duckdb.cache_info();

-- Delete a cached file using its cache key
SELECT duckdb.cache_delete('your_cache_key'); -- Replace 'your_cache_key' with the actual cache key from duckdb.cache_info()
```

Once a file is cached, subsequent queries accessing the same URL will automatically use the cached version, provided the remote data hasn't changed (determined by eTag).  Cache management is manual; you need to use `duckdb.cache_delete()` to remove files from the cache when they are no longer needed.

## Forcing DuckDB execution

By default, `pg_duckdb` intelligently determines when to use DuckDB for query execution. It automatically engages DuckDB when it detects DuckDB-specific features in your query, such as:

- Accessing data lake functions like `read_parquet()`, `read_csv()`, `iceberg_scan()`, `delta_scan()`.
- Using DuckDB aggregate or JSON functions.
- Performing `COPY TO` operations to data lakes.

However, in scenarios where you want to ensure that DuckDB's execution engine is used even for queries that *only* involve standard Postgres tables, you can use the `duckdb.force_execution` setting:

```sql
-- Force DuckDB execution for all subsequent queries in the current session
SET duckdb.force_execution = true;

-- Now, even a simple SELECT query on a Postgres table will be processed by DuckDB
SELECT COUNT(*) FROM your_postgres_table;

-- To revert to default behavior (automatic DuckDB execution only when needed)
SET duckdb.force_execution = false;
```

Setting `duckdb.force_execution` to `true` can be beneficial if you want to leverage DuckDB's potentially different query planning or execution strategies even for purely Postgres workloads. In most cases, leaving this setting at its default (`false`) is recommended for optimal performance and automatic engagement of DuckDB only when its features are explicitly used.

<Admonition type="note" title="configuration">
DuckDB configuration settings, such as memory limits and maximum memory usage, are pre-configured on Neon and cannot be modified.  These defaults are optimized for common workloads and vary based on your project's compute.
</Admonition>

### Querying DuckDB directly

`duckdb.query('your duckdb select query')`:  Allows you to run arbitrary DuckDB `SELECT` queries directly. This is useful for leveraging DuckDB-specific SQL syntax or functions not yet directly exposed as standard Postgres functions via `pg_duckdb`.

## Conclusion

`pg_duckdb` is a powerful extension that brings the speed and efficiency of DuckDB's analytical engine directly into your Postgres environment. By enabling `pg_duckdb`, you can accelerate your analytical queries, seamlessly integrate with data lakes, and leverage DuckDB's rich set of functions and features.

## Resources

- [pg_duckdb GitHub Repository](https://github.com/duckdb/pg_duckdb)
- [DuckDB Documentation](https://duckdb.org/docs/)
- [DuckDB Secret Manager](https://duckdb.org/docs/configuration/secrets_manager.html)
- [pg_duckdb: Postgres analytics just got faster with DuckDB](https://www.youtube.com/watch?v=j_83wjKiNyM)

<NeedHelp/>
