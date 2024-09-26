---
title: The timescaledb extension
subtitle: Work with time-series data in Postgres with the timescaledb extension
enableTableOfContents: true
updatedOn: '2024-09-26T13:33:08.730Z'
---

`timescaledb` enables the efficient storage and retrieval of time-series data. Time-series data is a sequential collection of observations or measurements recorded over time. For example, IoT devices continuously generate data points with timestamps, representing measurements or events. `timescaledb` is designed to handle large volumes of time-stamped data and provides SQL capabilities on top of a time-oriented data model such as IoT data, sensor readings, financial market data, and other time-series datasets.

<CTA />

This guide provides an introduction to the `timescaledb` extension. You’ll learn how to enable the extension in Neon, create hypertables, run simple queries, and analyze data using `timescaledb` functions. Finally, you’ll see how to delete data to free up space.

<Admonition type="note">
`timescaledb` is an open-source extension for Postgres that can be installed on any Neon Project using the instructions below.
</Admonition>

**Version availability:**

The version of `timescaledb` available on Neon depends on the version of Postgres you select for your Neon project.

- Postgres 14 - `timescaledb` 2.10.1
- Postgres 15 - `timescaledb` 2.10.1
- Postgres 16 - `timescaledb` 2.13.0
- Postgres 17 - _not yet available_

_Only [Apache-2](https://docs.timescale.com/about/latest/timescaledb-editions/) licensed features are supported. Compression is not supported._

## Enable the `timescaledb` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Create a hypertable

`timescaledb` hypertables are a high-level abstraction, extending traditional Postgres tables to manage temporal data more effectively. A hypertable simplifies the organization and retrieval of time-series information by providing built-in partitioning based on time intervals.

To begin with, create a SQL table for temperature data:

```sql
CREATE TABLE weather_conditions (
 time        TIMESTAMP WITH TIME ZONE NOT NULL,
 device_id   TEXT,
 temperature  NUMERIC,
 humidity     NUMERIC
);
```

Convert it to a hypertable using the [`create_hypertable`](https://docs.timescale.com/api/latest/hypertable/create_hypertable/) function:

```sql
SELECT create_hypertable('weather_conditions', 'time');
```

You should receive the following output:

```text
|       create_hypertable         |
|---------------------------------|
| (3,public,weather_conditions,t) |
```

It is possible to use both standard SQL commands and `timescaledb` functions (which will be covered later).

To use an SQL query to insert data in the `weather_conditions` table:

```sql
INSERT INTO weather_conditions
VALUES
   (NOW(), 'weather-pro-000002', 72.0, 52.0),
   (NOW(), 'weather-pro-000003', 71.5, 51.5),
   (NOW(), 'weather-pro-000004', 73.0, 53.2);
```

To retrieve the data by time in descending order:

```sql
SELECT * FROM weather_conditions ORDER BY time DESC;
```

You should receive the following output:

```text
|             time              |     device_id      | temperature | humidity |
|-------------------------------|--------------------|-------------|----------|
| 2024-01-15 13:30:27.464107+00 | weather-pro-000002 |      72.0   |   52.0   |
| 2024-01-15 13:30:27.464107+00 | weather-pro-000003 |      71.5   |   51.5   |
| 2024-01-15 13:30:27.464107+00 | weather-pro-000004 |      73.0   |   53.2   |
```

## Load weather data

You can use the [sample weather dataset from TimescaleDB](https://assets.timescale.com/docs/downloads/weather_small.tar.gz) and load it into your Neon database using [psql](/docs/connect/query-with-psql-editor).

Download the weather data:

```shell
curl https://assets.timescale.com/docs/downloads/weather_small.tar.gz -o weather_small.tar.gz

tar -xvzf weather_small.tar.gz
```

Load the data into Neon database - enter the username, password, host and database name. You can find these details in the **Connection Details** widget on the Neon **Dashboard**.

```shell shouldWrap
psql 'postgresql://<username>:<password>@<host>/<database_name>?sslmode=require' -c "\COPY weather_conditions FROM weather_small_conditions.csv CSV"
```

You should receive the following output:

```text
COPY 1000000
```

## Use hyperfunctions to analyze data

You can now start using `timescaledb` functions to analyze the data.

[**first()**](https://docs.timescale.com/api/latest/hyperfunctions/first/)

Get the first temperature reading for each location:

```sql
SELECT
device_id,
first(temperature, time) AS first_temperature
FROM weather_conditions
GROUP BY device_id
LIMIT 10;
```

The aggregate function [`first`](https://docs.timescale.com/api/latest/hyperfunctions/first/) was used to get the earliest `temperature` value based on `time` within an aggregate group.

You should receive the following output:

```text
|     device_id      | first_temperature  |
|--------------------|--------------------|
| weather-pro-000000 |               39.9 |
| weather-pro-000001 |               32.4 |
| weather-pro-000002 |               39.8 |
| weather-pro-000003 |               36.8 |
| weather-pro-000004 |               71.8 |
| weather-pro-000005 |               71.8 |
| weather-pro-000006 |                 37 |
| weather-pro-000007 |                 72 |
| weather-pro-000008 |               31.3 |
| weather-pro-000009 |               84.4 |
```

[**last()**](https://docs.timescale.com/api/latest/hyperfunctions/last/)

Get the latest temperature reading for each location:

```sql
SELECT
device_id,
last(temperature, time) AS first_temperature
FROM weather_conditions
GROUP BY device_id
LIMIT 10;
```

The aggregate function [`last`](https://docs.timescale.com/api/latest/hyperfunctions/last/) was used to get the latest `temperature` value based on `time` within an aggregate group.

You should receive the following output:

```text
|     device_id      | first_temperature |
|--------------------|-------------------|
| weather-pro-000000 |                42 |
| weather-pro-000001 |                42 |
| weather-pro-000002 |              72.0 |
| weather-pro-000003 |              71.5 |
| weather-pro-000004 |              73.0 |
| weather-pro-000005 | 70.3              |
| weather-pro-000006 |                42 |
| weather-pro-000007 | 69.9              |
| weather-pro-000008 |                42 |
| weather-pro-000009 |                91 |
```

[**time_bucket()**](https://docs.timescale.com/api/latest/hyperfunctions/time_bucket/)

Calculate the average temperature per hour for a specific device:

```sql
SELECT
time_bucket('1 hour', time) AS bucket_time,
AVG(temperature) AS avg_temperature
FROM weather_conditions
WHERE device_id = 'weather-pro-000001'
GROUP BY bucket_time
ORDER BY bucket_time
LIMIT 10;
```

The query uses the [`time_bucket`](https://docs.timescale.com/api/latest/hyperfunctions/time_bucket/) hyperfunction to group timestamps into one-hour intervals, calculating the average temperature for each interval from the table for a specific device, and then displays the results for the top 10 intervals.

You should receive the following output:

```text
|      bucket_time       |   avg_temperature   |
|------------------------|---------------------|
| 2016-11-15 12:00:00+00 | 32.76               |
| 2016-11-15 13:00:00+00 | 33.60               |
| 2016-11-15 14:00:00+00 | 34.83               |
| 2016-11-15 15:00:00+00 | 36.26               |
| 2016-11-15 16:00:00+00 | 37.19               |
| 2016-11-15 17:00:00+00 | 38.12               |
| 2016-11-15 18:00:00+00 | 39.02               |
| 2016-11-15 19:00:00+00 | 40.03               |
| 2016-11-15 20:00:00+00 | 40.87               |
| 2016-11-15 21:00:00+00 | 41.93               |
```

[**histogram()**](https://docs.timescale.com/api/latest/hyperfunctions/histogram/)

Bucket device humidity data:

```sql
SELECT device_id, histogram(humidity, 40, 60, 5)
FROM weather_conditions
GROUP BY device_id
LIMIT 10;
```

Here, we use the [`histogram`](https://docs.timescale.com/api/latest/hyperfunctions/histogram/) function to create a distribution of humidity values within specified buckets (`40` to `60` with a size of `5`) for each `device_id`.

You should receive the following output:

```text
|     device_id      |      histogram      |
|--------------------|---------------------|
| weather-pro-000000 | {0,0,0,710,290,0,0} |
| weather-pro-000001 | {0,0,0,805,186,9,0} |
| weather-pro-000002 | {0,0,0,217,784,0,0} |
| weather-pro-000003 | {0,0,0,510,491,0,0} |
| weather-pro-000004 | {0,0,0,1000,1,0,0} |
| weather-pro-000005 | {0,0,0,1000,0,0,0} |
| weather-pro-000006 | {0,0,0,999,1,0,0}  |
| weather-pro-000007 | {0,0,0,1000,0,0,0} |
| weather-pro-000008 | {0,0,0,834,166,0,0} |
| weather-pro-000009 | {0,0,0,0,0,0,1000} |
```

[**approximate_row_count()**](https://docs.timescale.com/api/latest/hyperfunctions/approximate_row_count/)

Use the [`approximate_row_count`](https://docs.timescale.com/api/latest/hyperfunctions/approximate_row_count/) function to get the approximate number of rows in `weather_conditions` hypertable:

```sql
SELECT approximate_row_count('weather_conditions');
```

You should receive the following output:

```text
| approximate_row_count |
|-----------------------|
|             1000000   |
```

## Working with chunks

Chunks are fundamental storage units within hypertables. Instead of storing the entire time-series dataset as a single monolithic table, `timescaledb` breaks it down into smaller, manageable chunks. Each chunk represents a distinct time interval, making data retrieval and maintenance more efficient.

[**show_chunks()**](https://docs.timescale.com/api/latest/hypertable/show_chunks/)

The [`show_chunks`](https://docs.timescale.com/api/latest/hypertable/show_chunks/) function can be used to understand the underlying structure and organization of your time-series data and provides insights into how your hypertable is partitioned.

```sql
SELECT show_chunks('weather_conditions');
```

You should receive the following output:

```text
|               show_chunks               |
|-----------------------------------------|
| _timescaledb_internal._hyper_7_24_chunk |
| _timescaledb_internal._hyper_7_25_chunk |
```

`show_chunks` output indicates the presence of two internal chunks within your hypertable. To show detailed chunks information:

```sql
SELECT * FROM chunks_detailed_size('weather_conditions') ORDER BY chunk_name;
```

You should receive the following output:

```text
|     chunk_schema      |    chunk_name     | table_bytes | index_bytes | toast_bytes | total_bytes | node_name |
|-----------------------|-------------------|-------------|-------------|-------------|-------------|-----------|
| _timescaledb_internal | _hyper_7_24_chunk |        8192 |       16384 |        8192 |       32768 |           |
| _timescaledb_internal | _hyper_7_25_chunk |    82190336 |     8249344 |        8192 |    90447872 |           |
```

[**drop_chunks()**](https://docs.timescale.com/api/latest/hypertable/drop_chunks/)

You can use the [`drop_chunks`](https://docs.timescale.com/api/latest/hypertable/drop_chunks/) function to remove data chunks whose time range falls completely before (or after) a specified time.

```sql
SELECT drop_chunks('temperature_data', INTERVAL '1 days');
```

It returns a list of the chunks that were dropped.

You should receive the following output:

```text
|               drop_chunks               |
|-----------------------------------------|
| _timescaledb_internal._hyper_4_19_chunk |
| _timescaledb_internal._hyper_4_20_chunk |
```

## Data deletion

You may run into space concerns as data accumulates in timescaledb hypertables. While Neon's Postgres service does not support compression, deleting old data is an option if you don't need to hold on to it for long periods of time.

You can use the [`drop_chunks`](<https://docs.timescale.com/api/latest/hypertable/drop_chunks/#:~:text=drop_chunks(),always%20before%20the%20end%20time.>) function outlined above to easily delete outdated chunks from a hypertable. For example, to delete all chunks older than 3 months:

```sql
SELECT drop_chunks('temperature_data', INTERVAL '3 months');
```

The query deletes any chunks that contain only data older than 3 months.

To automatically run this deletion periodically, you can setup a cron task. For example, adding this line to the crontab will run the deletion query every day at 1AM:

```sql
0 1 * * * psql -c "SELECT drop_chunks('temperature_data', INTERVAL '3 months')"
```

<Admonition type="note">
Please be aware that Neon's [Autosuspend](/docs/guides/auto-suspend-guide) feature may affect the running of scheduled jobs. It may be necessary to start the compute before running a job.
</Admonition>

This will help ensure the hypertable size is managed by deleting old unneeded data. Tune the interval passed to drop_chunks and the cron schedule based on your data retention needs.

## Conclusion

You were able to configure the timescaledb extension in Neon and create a hypertable to store `weather` data. Then you executed simple queries and analyzed data using a combination of standard SQL and `timescaledb` functions before finally using `drop_chunks()` to delete data.

## Reference

- [TimescaleDB editions](https://docs.timescale.com/about/latest/timescaledb-editions/)
- [TimesscaleDB hyperfunctions](https://docs.timescale.com/api/latest/hyperfunctions/)
