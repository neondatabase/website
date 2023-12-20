---
title: The timescaledb extension
subtitle: timescaledb is an extension for handling time-series data.
enableTableOfContents: true
---

TimescaleDB enables efficient storage and retrieval of time-series data. It is designed to handle large volumes of time-stamped data and provides SQL capabilities on top of a time-oriented data model such as IoT data, sensor readings, financial market data, and other time-series datasets.

This topic describes how to enable and use the `timescaledb` extension in Neon.

## Enable the `timescaledb` extension

You can enable the extension by running the following `CREATE EXTENSION` statement in the Neon **SQL Editor** or from a client such as `psql` that is connected to Neon.

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

For information about using the Neon SQL Editor, see [Query with Neon's SQL Editor](/docs/get-started-with-neon/query-with-neon-sql-editor). For information about using the `psql` client with Neon, see [Connect with psql](/docs/connect/query-with-psql-editor).

## Basic functions for working with Hypertables and chunks

Create a `hypertable` for temperature data:

```sql
CREATE TABLE temperature_data (
 time       TIMESTAMPTZ NOT NULL,
 location   TEXT        NOT NULL,
 temperature DOUBLE PRECISION
);
```

Create a `hypertable` for temperature data using `create_hypertable`:


```sql
SELECT create_hypertable('temperature_data', 'time');
```

Insert data in `temperature_data` table:

```sql
INSERT INTO temperature_data(time, location, temperature)
SELECT
 generate_series('2023-01-01'::TIMESTAMPTZ, '2023-01-05'::TIMESTAMPTZ, '1 hour'::INTERVAL),
 'Room A',
 random() * 10 + 20;


INSERT INTO temperature_data(time, location, temperature)
SELECT
 generate_series('2023-01-01'::TIMESTAMPTZ, '2023-01-05'::TIMESTAMPTZ, '1 hour'::INTERVAL),
 'Room B',
 random() * 10 + 22;
```

Show chunks information:


```sql
SELECT show_chunks('temperature_data');
```

Returns:

```text
|             show_chunks              |
|--------------------------------------|
| _timescaledb_internal._hyper_1_1_chunk|
| _timescaledb_internal._hyper_1_2_chunk|
```

Show detailed chunks information:


```sql
SELECT * FROM chunks_detailed_size('temperature_data')
 ORDER BY chunk_name;
```

Returns:

```text
|     chunk_schema     |    chunk_name    | table_bytes | index_bytes | toast_bytes | total_bytes | node_name |
|----------------------|------------------|-------------|-------------|-------------|-------------|-----------|
| _timescaledb_internal | _hyper_1_1_chunk |       40960 |       16384 |        8192 |       65536 |           |
| _timescaledb_internal | _hyper_1_2_chunk |        8192 |       16384 |        8192 |       32768 |           |
```

Add `location` as a dimension:


```sql
SELECT add_dimension('temperature_data', 'location', number_partitions => 2);
```

Returns:

```text
|             add_dimension            |
----------------------------------------
|(4,public,temperature_data,location,t)|
```

## Use Hyperfunctions to analyze data


Get an approximate row count for `temperature_data`:


```sql
SELECT approximate_row_count('temperature_data');
```

Returns:

```text
| approximate_row_count |
|-----------------------|
|                   192 |
```

Get the first temperature reading for each location:


```sql
SELECT
 location,
 first(temperature, time) AS first_temperature
FROM temperature_data
GROUP BY location;
```

Returns:

```text
| location | first_temperature |
|----------|-------------------|
| Room A   | 20.23611140077991 |
| Room B   | 23.49417976496308 |
```

Get the last temperature reading for each location:


```sql
SELECT
 location,
 last(temperature, time) AS last_temperature
FROM temperature_data
GROUP BY location;
```


Returns:

```text
| location |  last_temperature  |
|----------|--------------------|
| Room A   | 28.304521011192875 |
| Room B   | 24.145341023078732 |
```

Calculate the average temperature per hour for Room B:

```sql
SELECT
 time_bucket('1 hour', time) AS bucket_time,
 AVG(temperature) AS avg_temperature
FROM temperature_data
WHERE location = 'Room B'
GROUP BY bucket_time
ORDER BY bucket_time
LIMIT 10;
```

Returns:

```text
|       bucket_time       |  avg_temperature   |
|-------------------------|--------------------|
| 2023-01-01 00:00:00+00 |  23.49417976496308 |
| 2023-01-01 01:00:00+00 | 30.590117581301325 |
| 2023-01-01 02:00:00+00 | 25.841411034815213 |
| 2023-01-01 03:00:00+00 |  23.16685407159912 |
| 2023-01-01 04:00:00+00 | 24.709969799457806 |
| 2023-01-01 05:00:00+00 | 26.656702867232305 |
| 2023-01-01 06:00:00+00 |  22.11759327511014 |
| 2023-01-01 07:00:00+00 | 24.406385958319298 |
| 2023-01-01 08:00:00+00 | 29.903931142405966 |
| 2023-01-01 09:00:00+00 | 24.488422766863607 |
```

> remove LIMIT 10 to see entire output

Create a temperature histogram for Room A:

```sql
SELECT
 width_bucket(temperature, 20, 30, 5) AS temperature_range,
 COUNT(*) AS frequency
FROM temperature_data
WHERE location = 'Room A'
GROUP BY temperature_range
ORDER BY temperature_range;
```

Returns:

```text
| temperature_range | frequency |
|-------------------|-----------|
|                 1 |        21 |
|                 2 |        16 |
|                 3 |        21 |
|                 4 |        20 |
|                 5 |        19 |
```

## Reference

https://docs.timescale.com/about/latest/timescaledb-editions/

