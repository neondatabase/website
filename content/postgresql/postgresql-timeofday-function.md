---
title: 'PostgreSQL TIMEOFDAY() Function'
redirectFrom:
            - /postgresql/postgresql-timeofday 
            - /postgresql/postgresql-date-functions/postgresql-timeofday
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TIMEOFDAY()` function to retrieve the current date and time as a formatted string.

## Introduction to the PostgreSQL TIMEOFDAY() function

The `TIMEOFDAY()` function returns the [current date and time](/postgresql/postgresql-date-functions/postgresql-current_timestamp) as a formatted string.

Here's the syntax of the `TIMEOFDAY()` function:

```sql
TIMEOFDAY()
```

The function does not have any parameters and returns the current date and time as a string.

Note that the `TIMEOFDAY()` function returns the same result as the `CLOCK_TIMESTAMP()` function but in the text string.

## PostgreSQL TIMEOFDAY() function examples

Let's take some examples of using the `TIMEOFDAY()` function.

### 1) Basic TIMEOFDAY() function example

The following example uses the `TIMEOFDAY()` function to retrieve the current date and time as a string:

```
              timeofday
-------------------------------------
 Wed Mar 20 10:20:10.108369 2024 -07
(1 row)
```

The output shows the date, time, and timezone.

### 2) Formatting the output

If you want a specific format, you can cast the result of the `TIMEOFDAY()` function into a timestamp and use the `to_char()` function to achieve the desired format:

```sql
SELECT
  to_char(
    timeofday():: timestamp,
    'YYYY-MM-DD HH24:MI:SS'
  ) current_time;
```

Output:

```
    current_time
---------------------
 2024-03-20 10:26:57
(1 row)
```

## Summary

- Use the `TIMEOFDAY()` function to obtain the current date and time as a formatted string.
