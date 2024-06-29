---
title: Postgres extract() function
subtitle: Extract date and time components from timestamps and intervals
enableTableOfContents: true
updatedOn: '2024-06-29T11:15:52.370Z'
---

The Postgres `extract()` function retrieves specific components (such as year, month, or day) from date/time values where the source is of the type `timestamp`, `date`, `time` or `interval`.

This function is particularly useful for data analysis, reporting, and manipulating date and time data. For example, it can be used to group data by year, filter records for specific months, or calculate age based on birth dates.

<CTA />

## Function signature

The `extract()` function has the following form:

```sql
extract(field FROM source) -> numeric
```

- `field`: A string literal specifying the component to extract. Valid values include `century`, `day`, `decade`, `dow`, `doy`, `epoch`, `hour`, `isodow`, `isoyear`, `microseconds`, `millennium`, `milliseconds`, `minute`, `month`, `quarter`, `second`, `timezone`, `timezone_hour`, `timezone_minute`, `week`, and `year`.
- `source`: The date, time, timestamp, or interval value from which to extract the component.

The function returns a numeric value representing the extracted component.

## Example usage

Let's consider a table called `events` that tracks various events with their timestamps. We can use `extract()` to analyze different aspects of these events.

```sql
CREATE TABLE events (
  event_id SERIAL PRIMARY KEY,
  event_name VARCHAR(100),
  event_timestamp TIMESTAMP WITH TIME ZONE
);

INSERT INTO events (event_name, event_timestamp) VALUES
  ('Conference A', '2024-03-15 09:00:00+00'),
  ('Workshop B', '2024-06-22 14:30:00+00'),
  ('Seminar C', '2024-09-10 11:15:00+00'),
  ('Conference D', '2024-12-05 10:00:00+00'),
  ('Workshop E', '2025-02-18 13:45:00+00');

-- Extract year and month from event timestamps
SELECT
  event_name,
  EXTRACT(YEAR FROM event_timestamp) AS event_year,
  EXTRACT(MONTH FROM event_timestamp) AS event_month
FROM events
ORDER BY event_timestamp;
```

This query extracts the year and month from each event's timestamp.

```text
  event_name  | event_year | event_month
--------------+------------+-------------
 Conference A |       2024 |           3
 Workshop B   |       2024 |           6
 Seminar C    |       2024 |           9
 Conference D |       2024 |          12
 Workshop E   |       2025 |           2
(5 rows)
```

You can use the extracted components for further analysis, filtering, or grouping. For example, we can count the number of events by quarter:

```sql
-- Count events by quarter
SELECT
  EXTRACT(YEAR FROM event_timestamp) AS year,
  EXTRACT(QUARTER FROM event_timestamp) AS quarter,
  COUNT(*) AS event_count
FROM events
GROUP BY year, quarter
ORDER BY year, quarter;
```

This query groups events by year and quarter, providing a count of events for each period.

```text
 year | quarter | event_count
------+---------+-------------
 2024 |       1 |           1
 2024 |       2 |           1
 2024 |       3 |           1
 2024 |       4 |           1
 2025 |       1 |           1
(5 rows)
```

## Advanced examples

### Use `extract()` with different fields

You can use `extract()` with various fields to analyze different components of timestamps:

```sql
WITH sample_data(event_time) AS (
  VALUES
    ('2024-03-15 14:30:45.123456+00'::TIMESTAMP WITH TIME ZONE),
    ('2024-06-22 09:15:30.987654+00'::TIMESTAMP WITH TIME ZONE),
    ('2024-11-07 23:59:59.999999+00'::TIMESTAMP WITH TIME ZONE)
)
SELECT
  event_time,
  EXTRACT(CENTURY FROM event_time) AS century,
  EXTRACT(DECADE FROM event_time) AS decade,
  EXTRACT(YEAR FROM event_time) AS year,
  EXTRACT(QUARTER FROM event_time) AS quarter,
  EXTRACT(MONTH FROM event_time) AS month,
  EXTRACT(WEEK FROM event_time) AS week,
  EXTRACT(DAY FROM event_time) AS day,
  EXTRACT(HOUR FROM event_time) AS hour,
  EXTRACT(MINUTE FROM event_time) AS minute,
  EXTRACT(SECOND FROM event_time) AS second,
  EXTRACT(MILLISECONDS FROM event_time) AS milliseconds,
  EXTRACT(MICROSECONDS FROM event_time) AS microseconds
FROM sample_data;
```

This query demonstrates how `extract()` works with different fields, ranging from `century` to `microseconds`.

```text
          event_time           | century | decade | year | quarter | month | week | day | hour | minute |  second   | milliseconds | microseconds
-------------------------------+---------+--------+------+---------+-------+------+-----+------+--------+-----------+--------------+--------------
 2024-03-15 14:30:45.123456+00 |      21 |    202 | 2024 |       1 |     3 |   11 |  15 |   14 |     30 | 45.123456 |    45123.456 |     45123456
 2024-06-22 09:15:30.987654+00 |      21 |    202 | 2024 |       2 |     6 |   25 |  22 |    9 |     15 | 30.987654 |    30987.654 |     30987654
 2024-11-07 23:59:59.999999+00 |      21 |    202 | 2024 |       4 |    11 |   45 |   7 |   23 |     59 | 59.999999 |    59999.999 |     59999999
(3 rows)
```

### Use `extract()` with interval data

When working with the `INTERVAL` type, the `extract()` function allows you to pull out specific parts of the interval, such as the number of years, months, days, hours, minutes, seconds, and so on.

```sql
SELECT
  EXTRACT(DAYS FROM INTERVAL '2 years 3 months 15 days') AS days,
  EXTRACT(HOURS FROM INTERVAL '36 hours 30 minutes') AS hours,
  EXTRACT(MINUTES FROM INTERVAL '2 hours 45 minutes 30 seconds') AS minutes;
```

This query extracts the specified parts from the interval. Note that the `extract` function extracts only the value for the specified part in the interval. For example, `EXTRACT(DAYS FROM INTERVAL '2 years 3 months 15 days')` returns `15` for days, not the total number of days in the interval.

```text
 days | hours | minutes
------+-------+---------
   15 |    36 |      45
(1 row)
```

Additionally, it should be noted that for non-normalized intervals, the extracted values may not be as expected.

A **normalized interval** automatically converts large units into their equivalent higher units. For example, an interval of `14 months` is normalized to `1 year 2 months` because 12 months make a year.

A **non-normalized interval** keeps the units as specified, without converting to higher units. This is useful when you want to keep intervals in the same unit (like months or minutes) for easier manipulation or calculation.

When extracting values from non-normalized intervals, Postgres returns the remainder after converting to the next higher unit. This can lead to results that might seem counter-intuitive if you expect direct conversion without accounting for normalization.

For example, consider this query and its output:

```sql
SELECT
    EXTRACT(MONTH FROM INTERVAL '32 months') AS months,
    EXTRACT(MINUTE FROM INTERVAL '80 minutes') AS minutes;
```

```text
 months | minutes
--------+---------
      8 |      20
(1 row)
```

**Interval '32 months'**:

- A year is composed of 12 months.
- 32 months can be broken down into 2 years and 8 months (since 32 ÷ 12 = 2 years with a remainder of 8 months).
- When you `EXTRACT(MONTH FROM INTERVAL '32 months')`, it returns 8 because that’s the remaining months after accounting for the full years.

**Interval '80 minutes'**:

- An hour is composed of 60 minutes.
- 80 minutes can be broken down into 1 hour and 20 minutes (since 80 ÷ 60 = 1 hour with a remainder of 20 minutes).
- When you `EXTRACT(MINUTE FROM INTERVAL '80 minutes')`, it returns 20 because that’s the remaining minutes after accounting for the full hour.

### Use `extract()` for time-based analysis

Let's use `extract()` to analyze user registration patterns for a hypothetical social media application:

```sql
CREATE TABLE user_registrations (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50),
  registration_time TIMESTAMP WITH TIME ZONE
);

INSERT INTO user_registrations (username, registration_time) VALUES
  ('user1', '2024-03-15 08:30:00+00'),
  ('user2', '2024-03-15 08:45:00+00'),
  ('user3', '2024-03-15 14:20:00+00'),
  ('user4', '2024-03-16 09:15:00+00'),
  ('user5', '2024-03-16 09:30:00+00'),
  ('user6', '2024-03-16 14:30:00+00'),
  ('user7', '2024-03-17 08:45:00+00'),
  ('user8', '2024-03-17 14:10:00+00'),
  ('user9', '2024-03-17 14:25:00+00'),
  ('user10', '2024-03-17 14:50:00+00');

-- Analyze registration patterns by day of week and hour
SELECT
  EXTRACT(ISODOW FROM registration_time) AS day_of_week,
  EXTRACT(HOUR FROM registration_time) AS hour_of_day,
  COUNT(*) AS registration_count
FROM user_registrations
GROUP BY day_of_week, hour_of_day
ORDER BY day_of_week, hour_of_day;
```

This query uses `extract()` to analyze user registration patterns by day of week and hour of day.

```text
 day_of_week | hour_of_day | registration_count
-------------+-------------+--------------------
           5 |           8 |                  2
           5 |          14 |                  1
           6 |           9 |                  2
           6 |          14 |                  1
           7 |           8 |                  1
           7 |          14 |                  3
(6 rows)
```

## Additional considerations

### Performance considerations

For large datasets, consider creating indexes on frequently extracted components to improve query performance:

```sql
CREATE INDEX idx_events_year_month ON events (EXTRACT(YEAR FROM event_timestamp), EXTRACT(MONTH FROM event_timestamp));
```

This creates an index on the year and month components of the event timestamp, which can speed up queries that filter or group by these components.

## Resources

- [PostgreSQL documentation: Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)
- [PostgreSQL documentation: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
