---
title: Postgres Date and Time data types
subtitle: Work with date and time values in Postgres
enableTableOfContents: true
updatedOn: '2024-06-14T07:55:54.366Z'
---

Postgres offers a rich set of native data types for storing date and time values. Both moment-in-time and interval data can be stored, and Postgres provides a variety of functions to query and manipulate them.

Modeling date and time enables precise timestamping, duration calculations, and is essential in various use cases related to finance, logistics, events logging, and so on.

<CTA />

## Storage and syntax

There are 5 primary date/time types in Postgres:

- `DATE` - represents a date value, stored as 4 bytes. Resolution is 1 day.
- `TIME` - represents a time-of-day value, stored as 8 bytes. Resolution is 1 microsecond.
- `TIMESTAMP` - represents a combined date and time value, stored as 8 bytes. Resolution is 1 microsecond.
- `TIMESTAMPTZ` - represents a combined date and time value, along with time zone information, stored as 8 bytes. Resolution is 1 microsecond. It is stored internally as a UTC value, but is displayed in the timezone set by the client.
- `INTERVAL` - represents a duration of time, stored as 16 bytes. Resolution is 1 microsecond. Optionally, you can restrict the set of values stored to a larger unit of time (e.g., `INTERVAL MONTH`).

Date/time values are specified as string literals. Postgres accepts most of the standard datetime formats. For example:

```sql
SELECT
    '2024-01-01'::DATE AS date_value,
    '09:00:00'::TIME AS time_value,
    '2024-01-01 09:00:00'::TIMESTAMP AS timestamp_value,
    '2024-01-01 09:00:00-05'::TIMESTAMPTZ AS timestamptz_value,
    '1 month'::INTERVAL AS interval_value;
```

There are also some special date/time literals that can be used in queries. Some of them are:

- `epoch` - represents the Unix epoch (1970-01-01 00:00:00 UTC)
- `infinity` - represents an infinite timestamp, greater than all other timestamps
- `-infinity` - represents an infinite timestamp, smaller than all other timestamps
- `now` - represents the current timestamp

## Example usage

Consider a conference event management system that tracks schedules for planned sessions.

The query below creates a table to store all the sessions and inserts some sample data.

```sql
CREATE TABLE conference_sessions (
    session_id SERIAL PRIMARY KEY,
    session_title TEXT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    planned_duration INTERVAL NOT NULL,
    finish_time TIMESTAMPTZ
);

INSERT INTO conference_sessions (session_title, session_date, start_time, planned_duration, finish_time)
VALUES
    ('Keynote Speech', '2024-05-15', '2024-05-15 09:00:00+00', '2 hours', '2024-05-15 11:30:00+00'),
    ('Data Science Workshop', '2024-05-16', '2024-05-16 11:00:00+00', '3 hours', '2024-05-16 14:00:00+00'),
    ('AI Panel Discussion', '2024-05-17', '2024-05-17 14:00:00+00', '1.5 hours', '2024-05-17 15:20:00+00');
```

**Filtering on date/time values**

You can find all sessions scheduled for a specific date using a query like this:

```sql
SELECT session_title, start_time
FROM conference_sessions
WHERE session_date = '2024-05-16';
```

The query returns the following values:

```text
      session_title    |       start_time
-----------------------+------------------------
 Data Science Workshop | 2024-05-16 11:00:00+00
```

**Arithmetic operations with date/time**

You can write a query like this to find sessions that went over the planned duration:

```sql
SELECT session_title, planned_duration, finish_time - start_time AS actual_duration
FROM conference_sessions
WHERE finish_time - start_time > planned_duration;
```

The query returns the following values:

```text
 session_title  | planned_duration | actual_duration
----------------+------------------+-----------------
 Keynote Speech | 02:00:00         | 02:30:00
```

**Aggregating date/time values**

You can write a query like this to find the average duration of all sessions:

```sql
SELECT AVG(finish_time - start_time) AS avg_duration
FROM conference_sessions;
```

The query returns the following value:

```text
 avg_duration
--------------
 02:16:40
```

## Other examples

### Date and time functions

Postgres offers a variety of functions for manipulating date and time values, such as `EXTRACT`, `AGE`, `OVERLAPS`, and more.

For example, you can run this query to see if the times for any two sessions overlapped:

```sql
SELECT
    a.session_title AS session_a,
    b.session_title AS session_b,
    a.start_time as session_a_start,
    b.start_time as session_b_start
FROM conference_sessions a, conference_sessions b
WHERE a.session_id < b.session_id
AND (a.start_time, a.planned_duration) OVERLAPS (b.start_time, b.planned_duration);
```

This query returns no rows, indicating that there are no overlapping sessions.

### Handling time zones

Postgres supports adding time zone information to both time-of-day (`TIME WITH TIME ZONE`) and moment-in-time (`TIMESTAMP WITH TIME ZONE` / `TIMESTAMPTZ`) values.

- If you use a time zone unaware type (e.g., `TIME` or `TIMESTAMP`), Postgres ignores any time zone information provided in the input string.
- If you use a time-zone-aware type (e.g., `TIMETZ` or `TIMESTAMPTZ`), Postgres converts the input string to UTC and stores it internally. It then displays the value in the `current time zone` set for the session.

To illustrate this, you can create a table with both time-zone aware and unaware columns, and insert a sample row:

```sql
CREATE TABLE time_example (
    ts TIMESTAMP,
    tstz_utc TIMESTAMPTZ,
    tstz_pst TIMESTAMPTZ
);

INSERT INTO time_example (ts, tstz_utc, tstz_pst)
VALUES
    ('2024-01-01 09:00:00-08', '2024-01-01 09:00:00+00', '2024-01-01 09:00:00-08');
```

You can then check the current timezone set for the session:

```sql
SHOW timezone;
-- Returns 'GMT' (same as UTC)
```

Now, if you query the table:

```sql
SELECT * FROM time_example;
```

This query returns the following:

```text
         ts          |        tstz_utc        |        tstz_pst
---------------------+------------------------+------------------------
 2024-01-01 09:00:00 | 2024-01-01 09:00:00+00 | 2024-01-01 17:00:00+00
```

Postgres ignores the timezone information for the first column and returns the second and third columns in the UTC timezone.

## Additional considerations

- **Indexing**: Date/time values often involve range queries and sorting. Indexing date/time columns can thus significantly improve query performance.
- **Daylight Saving Time**: Working with time zones can be tricky, especially when dealing with daylight savings time. For additional details, refer to the [PostgreSQL Date/Time Types documentation](https://www.postgresql.org/docs/current/datatype-datetime.html)  as well as The Well Resource Guide we refer [How to Use the PostgreSQL Date Data Type](https://docs.vultr.com/how-to-use-the-postgresql-date-data-type)

## Resources

- [PostgreSQL documentation - Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
- [PostgreSQL documentation - Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html)

<NeedHelp />
