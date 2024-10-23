---
title: 'PostgreSQL MAKE_INTERVAL() Function'
page_title: 'PostgreSQL MAKE_INTERVAL() Function'
page_description: "In this tutorial, you will learn how to use the PostgreSQL MAKE_INTERVAL() function to create an interval from the interval's components"
prev_url: 'https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_interval/'
ogImage: ''
updatedOn: '2024-03-25T05:04:35+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL JUSTIFY_INTERVAL() Function'
  slug: 'postgresql-date-functions/postgresql-justify_interval'
nextLink:
  title: 'PostgreSQL AT TIME ZONE Operator'
  slug: 'postgresql-date-functions/postgresql-at-time-zone'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MAKE_INTERVAL()` function to create an interval from the interval’s components

## Introduction to the PostgreSQL MAKE_INTERVAL() function

The `MAKE_INTERVAL()` function allows you to create an [interval](../postgresql-tutorial/postgresql-interval) from years, months, weeks, days, hours, minutes, and seconds.

Here’s the syntax of the `MAKE_INTERVAL()` function:

```csssqlsql
MAKE_INTERVAL ( [ years int [, months int [, weeks int [, days int [, hours int [, mins int [, secs double precision ]]]]]]] ) → interval
```

In this syntax:

- `years` is an integer representing the number of years.
- `months` is an integer representing the number of months.
- `weeks` is an integer representing the number of weeks.
- `days` is an integer representing the number of days.
- `hours` is an integer representing the number of hours.
- `mins` is an integer representing the number of minutes.
- `secs` is a double\-precision number representing the number of seconds.

All of these parameters are optional and default to zero.

The `MAKE_INTERVAL()` function returns a value of interval type.

Besides the `MAKE_INTERVAL()` function, you can use the `INTERVAL` literal syntax to create an interval:

```sql
INTERVAL 'X years Y months Z days W hours V minutes U seconds'
```

The `INTERVAL` literal syntax allows you to create an interval by specifying all components in a single string. It is suitable for creating static or predefined intervals.

On the other hand, the `MAKE_INTERVAL()` function offers the flexibility to specify each component separately and is ideal for creating an interval dynamically. For example, you can use the `MAKE_INTERVAL()` function to create an interval from values stored in a table.

## PostgreSQL MAKE_INTERVAL() function examples

Let’s explore some examples of using the `MAKE_INTERVAL()` function.

### 1\) Basic MAKE_INTERVAL() function example

The following example uses the `MAKE_INTERVAL()` function to create an interval that represents 1 year, 2 months, 3 days, and 4 hours:

```
SELECT
  MAKE_INTERVAL(
    years => 3, months => 6, days => 15, hours => 4
  );
```

Output:

```sql
          make_interval
---------------------------------
 3 years 6 mons 15 days 04:00:00
(1 row)
```

### 2\) Using the MAKE_INTERVAL() function with default values

All of the parameters of the `MAKE_INTERVAL()` function are optional and default to zero. For example, the following statement creates an interval zero:

```sql
SELECT MAKE_INTERVAL();
```

Output:

```sql
 make_interval
---------------
 00:00:00
(1 row)
```

### 3\) Using the MAKE_INTERVAL( ) function with table data

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `time_data`:

```sql
CREATE TABLE time_data (
    id SERIAL PRIMARY KEY,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    hour INTEGER,
    minute INTEGER,
    second INTEGER
);
```

Second, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the time_data table:

```sql
INSERT INTO time_data (year, month, day, hour, minute, second)
VALUES
    (1, 3, 25, 10, 0, 0),
    (2, 2, 25, 11, 30, 0),
    (3, 1, 25, 13, 15, 0)
RETURNING *;
```

Output:

```sql
 id | year | month | day | hour | minute | second
----+------+-------+-----+------+--------+--------
  1 |    1 |     3 |  25 |   10 |      0 |      0
  2 |    2 |     2 |  25 |   11 |     30 |      0
  3 |    3 |     1 |  25 |   13 |     15 |      0
(3 rows)
```

Third, use the `MAKE_INTERVAL()` function to create intervals from the data stored in the `time_data` table:

```
SELECT
  MAKE_INTERVAL(
    year, month, 0, day, hour, minute, second
  ) AS interval_data
FROM
  time_data;
```

Output:

```
          interval_data
---------------------------------
 1 year 3 mons 25 days 10:00:00
 2 years 2 mons 25 days 11:30:00
 3 years 1 mon 25 days 13:15:00
(3 rows)
```

## Summary

- Use the `MAKE_INTERVAL()` function to construct an interval from the provided components, such as years, months, days, hours, minutes, and seconds.
