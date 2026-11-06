---
title: Timeseries data in Postgres
subtitle: A step-by-step guide describing how to use TimescaleDB for timeseries data in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-02-24T13:24:36.612Z'
updatedOn: '2026-09-24T17:56:34.189Z'
---

Timeseries queries let you query measurements over time stored in Postgres, like stock prices or temperature readings.
The [TimescaleDB extension](https://www.timescale.com/) helps you store, query, and analyze timeseries data in Postgres with automatic time-based partitioning and time-oriented functions. On Neon, only the Apache-2 licensed TimescaleDB features are supported, and compression isn't available. See [The timescaledb extension](/docs/extensions/timescaledb) for details.

## Steps

- Install and enable TimescaleDB
- Create a hypertable
- Insert and retrieve timeseries data
- Query time-based aggregations
- Use `last()` to find the most recent value
- Generate histograms for data analysis

### Install and enable TimescaleDB

Before using timeseries queries, you need to install the TimescaleDB extension.
TimescaleDB extends Postgres with hypertables, which optimize storage and queries for timeseries data.
On Neon, TimescaleDB is available to install. Enable it with the following command:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

### Create a hypertable

TimescaleDB introduces hypertables, which automatically partition data by time for better performance.
To create a hypertable, first define a Postgres table with a timestamp column as follows.
Note that the timestamp `ts` is part of the primary key.

```sql
CREATE TABLE stock_prices (
  id SERIAL,
  ticker TEXT NOT NULL,
  ts TIMESTAMPTZ NOT NULL,
  price DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (id, ts)
);
```

Then, convert the table into a hypertable:

```sql
SELECT create_hypertable('stock_prices', 'ts');
```

### Insert and retrieve timeseries data

You can insert timeseries data as you would in a normal Postgres table.
The following command inserts multiple stock price records, including multiple entries for AAPL on the same day:

```sql
INSERT INTO stock_prices (ticker, ts, price)
VALUES ('AAPL', '2025-02-22 09:30:00', 174.8),
       ('AAPL', '2025-02-22 10:00:00', 175.3),
       ('AAPL', '2025-02-22 15:59:00', 176.1),
       ('GOOGL', '2025-02-22 10:05:00', 2823.1);
```

You can retrieve rows from the `stock_prices` hypertable using normal SQL queries like the following, which returns all rows where `ts` is after February 22, 2025.

```sql
SELECT * FROM stock_prices WHERE ts >= '2025-02-22';
```

### Query time-based aggregations

TimescaleDB's `time_bucket()` function groups rows into fixed time intervals.
The following query calculates the average stock price per day:

```sql
SELECT time_bucket('1 day', ts) AS bucket,
       ticker,
       AVG(price) AS avg_price
FROM stock_prices
GROUP BY bucket, ticker
ORDER BY bucket;
```

The above query outputs the following results.
The `avg_price` for AAPL is the average of the 3 `stock_prices` rows for AAPL on February 22.

| bucket                 | ticker | avg_price |
| ---------------------- | ------ | --------- |
| 2025-02-22 00:00:00+00 | AAPL   | 175.4     |
| 2025-02-22 00:00:00+00 | GOOGL  | 2823.1    |

### Use `last()` to find the most recent value

To find the most recent stock price for each ticker, you can use TimescaleDB's `last()` function as shown below.
There is also a corresponding `first()` function, which would return the first stock price for each ticker.

```sql
SELECT ticker, last(price, ts) AS last_price
FROM stock_prices
GROUP BY ticker;
```

### Generate histograms for data analysis

To build a histogram, count how many values fall into each range, or "bucket".
The following query uses the built-in Postgres `width_bucket()` function to break the price range 170-180 into 10 buckets, and returns how many times the price of AAPL falls into each bucket.
TimescaleDB also provides a `histogram()` aggregate that returns all bucket counts as a single array.

```sql
SELECT ticker, width_bucket(price, 170, 180, 10) AS bucket, COUNT(*) AS frequency
FROM stock_prices
WHERE ticker = 'AAPL'
GROUP BY ticker, bucket
ORDER BY ticker, bucket;
```

The following is the result of the above query.
AAPL has one price in the 5th bucket (174.8), one in the 6th bucket (175.3), and one in the 7th bucket (176.1).
Buckets are 1-indexed, so 170-171 is bucket 1, 171-172 is bucket 2, and so on. Values below 170 go in bucket 0, and values of 180 or more go in bucket 11.

| ticker | bucket | frequency |
| ------ | ------ | --------- |
| AAPL   | 5      | 1         |
| AAPL   | 6      | 1         |
| AAPL   | 7      | 1         |
