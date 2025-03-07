---
title: Timeseries Data in Postgres
subtitle: A step-by-step guide describing how to use TimescaleDB for timeseries data in Postgres
author: vkarpov15
enableTableOfContents: true
createdAt: '2025-02-24T13:24:36.612Z'
updatedOn: '2025-02-24T13:24:36.612Z'
---

Timeseries queries allow you to efficiently query measurements over time stored in Postgres, like stock prices or temperature measurements.
With the [TimescaleDB extension](https://www.timescale.com/), you can you can efficiently store, query, and analyze time-series data in PostgreSQL using automatic partitioning, compression, and advanced query optimizations.

## Steps

- Install and enable TimescaleDB
- Create a hypertable
- Insert and retrieve timeseries data
- Query time-based aggregations
- Use `last()` to find the most recent value
- Generate histograms for data analysis

### Install and enable TimescaleDB

Before using timeseries queries, you need to install the TimescaleDB extension.
TimescaleDB extends PostgreSQL with hypertables, which optimize storage and queries for timeseries data.
In Neon, TimescaleDB is already installed, you just need to enable it using the following command.

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

TimescaleDB provides efficient ways to aggregate data over time.
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

TimescaleDB's `histogram()` function calculates how many times a value falls into a given "bucket".
In other words, `histogram()` returns how many times a value falls into a given range.
For example, the following query breaks up the price range 170-180 into 10 buckets, and returns how many times the price of AAPL falls into each bucket.

```sql
SELECT ticker, width_bucket(price, 170, 180, 10) AS bucket, COUNT(*) AS frequency
FROM stock_prices
WHERE ticker = 'AAPL'
GROUP BY ticker, bucket
ORDER BY ticker, bucket;
```

The following is the result of the above query.
AAPL has one price in the 5th bucket (174.8), one in the 6th bucket (175.3), and one in the 7th bucket (176.1).
Buckets are 0-indexed, so 170-171 is bucket 0, 171-172 is bucket 1, and so on.

| ticker | bucket | frequency |
| ------ | ------ | --------- |
| AAPL   | 5      | 1         |
| AAPL   | 6      | 1         |
| AAPL   | 7      | 1         |
