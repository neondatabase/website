---
modifiedAt: 2024-03-20 20:42:38
prevPost: postgresql-jsonb_strip_nulls-function
nextPost: creating-a-postgresql-trigger-with-a-when-condition
createdAt: 2024-03-20T10:37:32.000Z
title: 'PostgreSQL JUSTIFY_HOURS() Function'
redirectFrom:
            - /postgresql/postgresql-justify_hours 
            - /postgresql/postgresql-date-functions/postgresql-justify_hours
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `JUSTIFY_HOURS()` function to adjust 24-hour intervals as days.

## Introduction to the PostgreSQL JUSTIFY_HOURS() function

The `JUSTIFY_HOURS()` function normalizes an [interval](/postgresql/postgresql-interval) by converting hours exceeding 24 to days.

Here's the syntax of the `JUSTIFY_HOURS()` function:

```sql
JUSTIFY_HOURS ( value) → interval
```

In this syntax:

- `value` is an interval value you want to justify.

The `JUSTIFY_HOURS()` function returns an adjusted interval with:

- Hours exceeding 24 are converted to days.
- The remaining hours are kept the same.
- Minutes, seconds, and other units remain unchanged.

If the value is `NULL`, the function returns `NULL`.

## PostgreSQL JUSTIFY_HOURS() function examples

Let's take some examples of using the PostgreSQL `JUSTIFY_HOURS()` function.

### 1) Basic PostgreSQL JUSTIFY_HOURS() function example

The following statement uses the `JUSTIFY_HOURS()` function to adjust intervals that are multiples of 24 hours:

```sql
SELECT JUSTIFY_HOURS(INTERVAL '24 hours'),
       JUSTIFY_HOURS(INTERVAL '48 hours'),
       JUSTIFY_HOURS(INTERVAL '72 hours');
```

Output:

```
 justify_hours | justify_hours | justify_hours
---------------+---------------+---------------
 1 day         | 2 days        | 3 days
```

### 2) Using JUSTIFY_HOURS() function with intervals that are not multiple of 24 hours

The following example uses the `JUSTIFY_HOURS()` function to adjust intervals that are not multiples of 24 hours:

```sql
SELECT JUSTIFY_HOURS(INTERVAL '25 hours'),
       JUSTIFY_HOURS(INTERVAL '50 hours'),
       JUSTIFY_HOURS(INTERVAL '70 hours');
```

Output:

```
 justify_hours  |  justify_hours  |  justify_hours
----------------+-----------------+-----------------
 1 day 01:00:00 | 2 days 02:00:00 | 2 days 22:00:00
```

### 3) Using the JUSTIFY_HOURS() function with intervals that include hours

The following example uses the `JUSTIFY_HOURS()` function to adjust intervals that include hours, minutes, and seconds:

```sql
SELECT JUSTIFY_HOURS(INTERVAL '15 days 2 hours'),
       JUSTIFY_HOURS(INTERVAL '55 days 30 minutes'),
       JUSTIFY_HOURS(INTERVAL '75 days 45 seconds');
```

Output:

```
   justify_days   |      justify_days      |      justify_days
------------------+------------------------+-------------------------
 15 days 02:00:00 | 1 mon 25 days 00:30:00 | 2 mons 15 days 00:00:45
(1 row)
```

## Summary

- Use the `JUSTIFY_HOURS()` function to adjust 24-hour intervals as days.
