---
title: 'PostgreSQL DATE_BIN() Function'
page_title: 'PostgreSQL DATE_BIN Function By Examples'
page_description: 'This tutorial shows you how to use the PostgreSQL DATE_BIN function to bin a timestamp into a fixed-size interval aligned with a specified origin.'
prev_url: 'https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-BIN'
ogImage: ''
updatedOn: '2026-02-27T00:00:00+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL DATE_TRUNC() Function'
  slug: 'postgresql-date-functions/postgresql-date_trunc'
nextLink:
  title: 'PostgreSQL ISFINITE() Function'
  slug: 'postgresql-date-functions/postgresql-isfinite'
---

**Summary**: This tutorial shows you how to use the PostgreSQL `DATE_BIN()` function to bin a timestamp into a fixed-size interval aligned with a specified origin.

## Introduction to the PostgreSQL DATE_BIN() function

The `DATE_BIN()` function bins (rounds down) a [`TIMESTAMP`](../postgresql-tutorial/postgresql-timestamp) or `TIMESTAMP WITH TIME ZONE` value into the nearest interval boundary, aligned with a given origin point.

Unlike [`DATE_TRUNC()`](postgresql-date_trunc), which truncates to standard calendar units like hour or day, `DATE_BIN()` lets you use arbitrary interval sizes. For example, 15 minutes, 30 seconds, or 6 hours.

`DATE_BIN()` was introduced in PostgreSQL 14.

Here's the basic syntax of the `DATE_BIN` function:

```sql
DATE_BIN(stride, source, origin)
```

In this syntax:

### stride

`stride` is an [`INTERVAL`](../postgresql-tutorial/postgresql-interval) value that specifies the bin size. The stride must be greater than zero and cannot contain units of month or larger (such as months, quarters, or years), because those units have variable lengths.

### source

`source` is a value or an expression of type `TIMESTAMP` or `TIMESTAMP WITH TIME ZONE`. Values of type `DATE` are automatically cast to `TIMESTAMP`.

### origin

`origin` is a `TIMESTAMP` or `TIMESTAMP WITH TIME ZONE` value that sets the alignment point for the bins. The bins are computed relative to this origin.

The `DATE_BIN` function returns a `TIMESTAMP` or `TIMESTAMP WITH TIME ZONE` value matching the type of `source`, representing the start of the bin that contains the `source` value.

## PostgreSQL DATE_BIN() function examples

Let's explore some examples of using the `DATE_BIN()` function.

### 1\) Basic PostgreSQL DATE_BIN() function example

The following example bins a timestamp into 15-minute intervals aligned with `2001-01-01`:

```sql
SELECT DATE_BIN(
  '15 minutes',
  TIMESTAMP '2020-02-11 15:44:17',
  TIMESTAMP '2001-01-01'
);
```

Output:

```text
       date_bin
---------------------
 2020-02-11 15:30:00
(1 row)
```

The timestamp `15:44:17` falls between `15:30:00` and `15:45:00`, so `DATE_BIN()` returns the lower boundary `15:30:00`.

### 2\) Using a custom origin to shift bin boundaries

The origin controls where the bin boundaries fall. In this example, the origin is shifted by 2 minutes and 30 seconds, which moves all bin boundaries by the same offset:

```sql
SELECT DATE_BIN(
  '15 minutes',
  TIMESTAMP '2020-02-11 15:44:17',
  TIMESTAMP '2001-01-01 00:02:30'
);
```

Output:

```text
       date_bin
---------------------
 2020-02-11 15:32:30
(1 row)
```

With the shifted origin, the bins now fall at `15:02:30`, `15:17:30`, `15:32:30`, `15:47:30`, etc. The timestamp `15:44:17` falls in the `15:32:30` bin.

### 3\) Binning into 1-hour intervals

The following example bins a timestamp into 1-hour intervals:

```sql
SELECT DATE_BIN(
  '1 hour',
  TIMESTAMP '2024-06-15 09:37:52',
  TIMESTAMP '2001-01-01'
);
```

Output:

```text
       date_bin
---------------------
 2024-06-15 09:00:00
(1 row)
```

For full-unit intervals such as 1 hour or 1 minute, `DATE_BIN()` produces the same result as the equivalent `DATE_TRUNC()` call.

### 4\) Comparing DATE_BIN() and DATE_TRUNC()

This example shows that `DATE_BIN()` with a 1-hour stride and epoch origin is equivalent to `DATE_TRUNC()` with `'hour'`:

```sql
SELECT
  DATE_BIN('1 hour', TIMESTAMP '2024-06-15 09:37:52', TIMESTAMP '2001-01-01') AS date_bin_result,
  DATE_TRUNC('hour', TIMESTAMP '2024-06-15 09:37:52') AS date_trunc_result;
```

Output:

```text
    date_bin_result     |   date_trunc_result
---------------------+---------------------
 2024-06-15 09:00:00 | 2024-06-15 09:00:00
(1 row)
```

The key advantage of `DATE_BIN()` is that it works with arbitrary intervals. For example, `'15 minutes'`, `'6 hours'`, or `'90 seconds'`, while `DATE_TRUNC()` is limited to standard calendar units.

### 5\) Using DATE_BIN() to aggregate time-series data

A common use case is grouping time-series rows into fixed-size buckets. The following example counts events per 30-minute window:

```sql
SELECT
  DATE_BIN('30 minutes', event_time, TIMESTAMP '2001-01-01') AS bucket,
  COUNT(*) AS event_count
FROM events
GROUP BY bucket
ORDER BY bucket;
```

Output:

```text
        bucket         | event_count
-----------------------+-------------
 2024-06-15 08:00:00   |          12
 2024-06-15 08:30:00   |          34
 2024-06-15 09:00:00   |          27
 2024-06-15 09:30:00   |          41
(4 rows)
```

This groups all events into 30-minute windows and counts how many events fell into each window — a common pattern in dashboards and analytics queries.

## Summary

- Use the PostgreSQL `DATE_BIN()` function to round a timestamp down to the start of a fixed-size interval.
- `DATE_BIN()` accepts an arbitrary `stride` interval, unlike `DATE_TRUNC()` which is limited to calendar units.
- The `origin` parameter controls the alignment of bin boundaries.
- The stride cannot include month-or-larger units such as months, quarters, or years.
