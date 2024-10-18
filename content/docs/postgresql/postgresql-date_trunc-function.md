---
title: 'PostgreSQL DATE_TRUNC() Function'
redirectFrom:
            - /docs/postgresql/postgresql-date_trunc 
            - /docs/postgresql/postgresql-date-functions/postgresql-date_trunc/
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-03-rental-table.png
tableOfContents: true
---

**Summary**: This tutorial shows you how to use the PostgreSQL `DATE_TRUNC()` function to truncate a timestamp or interval to a specified precision.

## Introduction to the PostgreSQL DATE_TRUNC() function

The `DATE_TRUNC()` function truncates a [`TIMESTAMP`](/docs/postgresql/postgresql-timestamp/), a `TIMESTAMP WITH TIME ZONE`, or an [`INTERVAL`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval) value to a specified precision.

Here's the basic syntax of the `DATE_TRUNC` function:

```
DATE_TRUNC(field, source [,time_zone])
```

In this syntax:

### source

`source` is a value or an expression of type timestamp, timestamp with time zone, or interval. If you use a value of the date or time type, the function will cast it automatically to timestamp or interval respectively.

### field

`field` specifies the to which precision to truncate the `source`.

Here are the valid values for the `field`:

- millennium
- century
- decade
- year
- quarter
- month
- week
- day
- hour
- minute
- second
- milliseconds
- microseconds

### time_zone

`time_zone` specifies the time zone in which the function will perform the truncation. The `time_zone` argument is the default.

If you omit the `time_zone`, the function will truncate the `source` based on the current time zone setting.

The `DATE_TRUNC` function returns a `TIMESTAMP` or an `INTERVAL` value.

## PostgreSQL DATE_TRUNC() function examples

Let's explore some examples of using the `DATE_TRUNC()` function.

### 1) Basic PostgreSQL DATE_TRUNC() function example

The following example uses the `DATE_TRUNC()` function to truncate a `TIMESTAMP` value to `hour` part:

```
SELECT DATE_TRUNC('hour', TIMESTAMP '2017-03-17 02:09:30');
```

Output:

```
     date_trunc
---------------------
 2017-03-17 02:00:00
(1 row)
```

In this example, the `DATE_TRUNC()` function returns a timestamp with the hour precision.

If you want to truncate a `TIMESTAMP` value to a minute, you use the `'minute'` field as shown in the following example:

```
SELECT DATE_TRUNC('minute', TIMESTAMP '2017-03-17 02:09:30');
```

The function returns a `TIMESTAMP` with the precision is minute:

```
     date_trunc
---------------------
 2017-03-17 02:09:00
(1 row)
```

### 2) Using PostgreSQL DATE_TRUNC() function with table data

See the following `rental` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

![Rental table - PostgreSQL date_trunc function demo](/postgresqltutorial_data/wp-content-uploads-2017-03-rental-table.png)

The following example uses the `DATE_TRUNC()` function to retrieve the number of rentals by month from the rental table:

```
SELECT
    DATE_TRUNC('month', rental_date) m,
    COUNT (rental_id)
FROM
    rental
GROUP BY
    m
ORDER BY
    m;
```

Output:

```
          m          | count
---------------------+-------
 2005-05-01 00:00:00 |  1156
 2005-06-01 00:00:00 |  2311
 2005-07-01 00:00:00 |  6709
 2005-08-01 00:00:00 |  5686
 2006-02-01 00:00:00 |   182
(5 rows)
```

This query retrieves the month of each rental date and counts the number of rentals each month from the `rental` table. It then groups the counts by month and sorts the result set by month.

If you want to count the rentals by week, you can pass the week to the DATE_TRUNC() function as follows:

```
SELECT
    DATE_TRUNC('week', rental_date) week,
    COUNT (rental_id)
FROM
    rental
GROUP BY
    week
ORDER BY
    week;
```

Output:

```
        week         | count
---------------------+-------
 2005-05-23 00:00:00 |   835
 2005-05-30 00:00:00 |   321
 2005-06-13 00:00:00 |  1705
 2005-06-20 00:00:00 |   606
 2005-07-04 00:00:00 |  2497
 2005-07-11 00:00:00 |   956
 2005-07-25 00:00:00 |  3256
 2005-08-01 00:00:00 |  1314
 2005-08-15 00:00:00 |  3148
 2005-08-22 00:00:00 |  1224
 2006-02-13 00:00:00 |   182
(11 rows)
```

The following example uses the `DATE_TRUNC()` function to count the number of rentals by staff per year:

```
SELECT
 staff_id,
 date_trunc('year', rental_date) y,
 COUNT (rental_id) rental
FROM
 rental
GROUP BY
 staff_id, y
ORDER BY
 staff_id;
```

Output:

```
 staff_id |          y          | rental
----------+---------------------+--------
        1 | 2006-01-01 00:00:00 |     85
        1 | 2005-01-01 00:00:00 |   7955
        2 | 2006-01-01 00:00:00 |     97
        2 | 2005-01-01 00:00:00 |   7907
(4 rows)
```

## Summary

- Use the PostgreSQL `DATE_TRUNC` function to truncate a timestamp or an interval value to a specified level of precision
