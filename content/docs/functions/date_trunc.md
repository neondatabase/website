---
title: Postgres date_trunc() function
subtitle: Truncate date and time values to a specified precision
enableTableOfContents: true
updatedOn: '2024-06-30T15:28:50.890Z'
---

The Postgres `date_trunc()` function truncates a timestamp or interval to a specified precision.

This function is particularly useful for grouping time-series data and performing time-based calculations. For example, it can be used to generate monthly reports, analyze hourly trends, or group events by time period.

<CTA />

## Function signature

The `date_trunc()` function has the following form:

```sql
date_trunc(field, source [, time_zone ]) -> timestamp / interval
```

- `field`: A string literal specifying the precision to which to truncate the input value. Valid values include `microseconds`, `milliseconds`, `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`, `decade`, `century`, and `millennium`.
- `source`: The timestamp or interval value to be truncated.
- `time_zone` (optional): The timezone in which to perform the truncation. Otherwise, the default timezone is used.

The function returns a timestamp or interval value truncated to the specified precision, i.e., fields less significant than the specified precision are set to zero.

## Example usage

Let's consider a table called `sales` that tracks daily sales data. We can use `date_trunc` to group sales by different time periods.

```sql
CREATE TABLE sales (
  sale_date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10, 2)
);

INSERT INTO sales (sale_date, amount) VALUES
  ('2024-03-01 08:30:00+00', 100.50),
  ('2024-03-01 14:45:00+00', 200.75),
  ('2024-03-02 10:15:00+00', 150.25),
  ('2024-04-15 09:00:00+00', 300.00),
  ('2024-05-20 16:30:00+00', 250.50);

-- Group sales by month
SELECT
  date_trunc('month', sale_date) AS month,
  SUM(amount) AS total_sales
FROM sales
GROUP BY date_trunc('month', sale_date)
ORDER BY month;
```

This query groups sales by month, summing the total sales for each month.

```text
         month          | total_sales
------------------------+-------------
 2024-03-01 00:00:00+00 |      451.50
 2024-04-01 00:00:00+00 |      300.00
 2024-05-01 00:00:00+00 |      250.50
(3 rows)
```

We can further refine the output by extracting the month and year from the truncated timestamp:

```sql
SELECT
  EXTRACT(YEAR FROM date_trunc('month', sale_date)) AS year,
  EXTRACT(MONTH FROM date_trunc('month', sale_date)) AS month,
  SUM(amount) AS total_sales
FROM sales
GROUP BY year, month
ORDER BY year, month;
```

This query groups sales by year and month, providing a more readable output:

```text
 year | month | total_sales
------+-------+-------------
 2024 |     3 |      451.50
 2024 |     4 |      300.00
 2024 |     5 |      250.50
(3 rows)
```

## Advanced examples

### Use `date_trunc` with different precisions

We can use `date_trunc` with different precision levels to analyze data at each granularity:

```sql
WITH sample_data(event_time) AS (
  VALUES
    ('2024-03-15 14:30:45.123456+00'::TIMESTAMP WITH TIME ZONE),
    ('2024-06-22 09:15:30.987654+00'::TIMESTAMP WITH TIME ZONE),
    ('2024-11-07 23:59:59.999999+00'::TIMESTAMP WITH TIME ZONE)
)
SELECT
  event_time,
  date_trunc('year', event_time) AS year_trunc,
  date_trunc('quarter', event_time) AS quarter_trunc,
  date_trunc('month', event_time) AS month_trunc,
  date_trunc('week', event_time) AS week_trunc,
  date_trunc('day', event_time) AS day_trunc,
  date_trunc('hour', event_time) AS hour_trunc,
  date_trunc('minute', event_time) AS minute_trunc,
  date_trunc('second', event_time) AS second_trunc,
  date_trunc('millisecond', event_time) AS millisecond_trunc
FROM sample_data;
```

This query demonstrates how `date_trunc` works with different precision levels, from year down to millisecond.

```text
          event_time           |       year_trunc       |     quarter_trunc      |      month_trunc       |       week_trunc       |       day_trunc        |       hour_trunc       |      minute_trunc      |      second_trunc      |     millisecond_trunc
-------------------------------+------------------------+------------------------+------------------------+------------------------+------------------------+------------------------+------------------------+------------------------+----------------------------
 2024-03-15 14:30:45.123456+00 | 2024-01-01 00:00:00+00 | 2024-01-01 00:00:00+00 | 2024-03-01 00:00:00+00 | 2024-03-11 00:00:00+00 | 2024-03-15 00:00:00+00 | 2024-03-15 14:00:00+00 | 2024-03-15 14:30:00+00 | 2024-03-15 14:30:45+00 | 2024-03-15 14:30:45.123+00
 2024-06-22 09:15:30.987654+00 | 2024-01-01 00:00:00+00 | 2024-04-01 00:00:00+00 | 2024-06-01 00:00:00+00 | 2024-06-17 00:00:00+00 | 2024-06-22 00:00:00+00 | 2024-06-22 09:00:00+00 | 2024-06-22 09:15:00+00 | 2024-06-22 09:15:30+00 | 2024-06-22 09:15:30.987+00
 2024-11-07 23:59:59.999999+00 | 2024-01-01 00:00:00+00 | 2024-10-01 00:00:00+00 | 2024-11-01 00:00:00+00 | 2024-11-04 00:00:00+00 | 2024-11-07 00:00:00+00 | 2024-11-07 23:00:00+00 | 2024-11-07 23:59:00+00 | 2024-11-07 23:59:59+00 | 2024-11-07 23:59:59.999+00
(3 rows)
```

### Use `date_trunc` with timezones

The `date_trunc` function can be used with specific timezones:

```sql
SELECT
  date_trunc('day', '2024-03-15 23:30:00+00'::TIMESTAMP WITH TIME ZONE) AS utc_trunc,
  date_trunc('day', '2024-03-15 23:30:00+00'::TIMESTAMP WITH TIME ZONE, 'America/New_York') AS ny_trunc,
  date_trunc('day', '2024-03-15 23:30:00+00'::TIMESTAMP WITH TIME ZONE, 'Asia/Tokyo') AS tokyo_trunc;
```

This query shows how `date_trunc` behaves differently when truncating to the day in different timezones.

```text
       utc_trunc        |        ny_trunc        |      tokyo_trunc
------------------------+------------------------+------------------------
 2024-03-15 00:00:00+00 | 2024-03-15 04:00:00+00 | 2024-03-15 15:00:00+00
(1 row)
```

### Use `date_trunc` for time-based analysis

Below, we use `date_trunc` to analyze user activity patterns for a hypothetical social media application:

```sql
CREATE TABLE user_activities (
  user_id INT,
  activity_type VARCHAR(50),
  activity_time TIMESTAMP WITH TIME ZONE
);

INSERT INTO user_activities (user_id, activity_type, activity_time) VALUES
  (1, 'login', '2024-03-01 08:30:00+00'),
  (2, 'login', '2024-03-01 12:30:00+00'),
  (2, 'post', '2024-03-03 09:15:00+00'),
  (1, 'comment', '2024-03-05 10:45:00+00'),
  (3, 'login', '2024-03-08 14:00:00+00'),
  (2, 'logout', '2024-03-08 16:30:00+00'),
  (1, 'logout', '2024-03-12 18:00:00+00'),
  (3, 'post', '2024-03-15 19:30:00+00'),
  (3, 'logout', '2024-03-18 20:45:00+00');


-- Analyze daily activity pattern
SELECT
  date_trunc('day', activity_time) AS day,
  activity_type,
  COUNT(*) AS activity_count
FROM user_activities
GROUP BY date_trunc('day', activity_time), activity_type
ORDER BY day, activity_type;
```

This query uses `date_trunc` to group user activities by each day.

```text
          day           | activity_type | activity_count
------------------------+---------------+----------------
 2024-03-01 00:00:00+00 | login         |              2
 2024-03-03 00:00:00+00 | post          |              1
 2024-03-05 00:00:00+00 | comment       |              1
 2024-03-08 00:00:00+00 | login         |              1
 2024-03-08 00:00:00+00 | logout        |              1
 2024-03-12 00:00:00+00 | logout        |              1
 2024-03-15 00:00:00+00 | post          |              1
 2024-03-18 00:00:00+00 | logout        |              1
(8 rows)
```

### Use `date_trunc` with interval types

The `date_trunc` function can also be used with interval data:

```sql
SELECT
  date_trunc('hour', INTERVAL '2 days 3 hours 40 minutes') AS truncated_interval,
  date_trunc('day', '2024-03-15 23:30:00+00'::TIMESTAMPTZ - '2023-09-14 11:20:00+00'::TIMESTAMPTZ) AS truncated_day;
```

This query truncates the first interval to the nearest hour, while the second column truncates the difference between two timestamps to the nearest day.

```text
 truncated_interval | truncated_day
--------------------+---------------
 2 days 03:00:00    | 183 days
(1 row)
```

## Additional considerations

### Timezone awareness

When using `date_trunc` with timestamps, the function uses the default timezone of the session, or that specified in the input. As shown in the previous section, the truncation result can vary depending on the timezone.

### Truncating intervals

When truncating intervals, the `date_trunc` function rounds the interval to the nearest value based on the specified precision. However, note that the output might not be intuitive and depends on how the interval is defined.

For example, the query below attempts to truncate a month from an interval specified as some number of days.

```sql
SELECT
    date_trunc('month', '183 days'::INTERVAL) AS colA,
    date_trunc('month', '2 years 3 months'::INTERVAL) AS colB;
```

This query outputs the following:

```text
   cola   |      colb
----------+----------------
 00:00:00 | 2 years 3 mons
(1 row)
```

The first input interval didn't have a month component, so even with the number of days being bigger than a month, the output is zero. The second input interval has a month component, so the output is the input interval truncated to the month.

### Performance considerations

When using `date_trunc` in WHERE clauses or for grouping large datasets, consider creating an index on the truncated values to improve query performance:

```sql
CREATE INDEX idx_sales_month ON sales (date_trunc('month', sale_date));
```

This creates an index on the monthly truncated sale dates, which can speed up queries that group or filter by month.

## Resources

- [PostgreSQL documentation: Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)
- [PostgreSQL documentation: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
