---
title: 'PostgreSQL MAKE_DATE() Function'
page_title: 'PostgreSQL MAKE_DATE() Function'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL MAKE_DATE() function to generate a date value from the year, month, and day.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_date/'
ogImage: ''
updatedOn: '2024-03-25T01:39:34+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL TO_TIMESTAMP Function'
  slug: 'postgresql-date-functions/postgresql-to_timestamp'
nextLink:
  title: 'PostgreSQL MAKE_TIME() Function'
  slug: 'postgresql-date-functions/postgresql-make_time'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MAKE_DATE()` function to generate a date value from the year, month, and day.

## Introduction to PostgreSQL MAKE_DATE() function

The `MAKE_DATE()` function allows you to construct a [date](../postgresql-tutorial/postgresql-date) value from the specified year, month, and day values.

Here’s the syntax of the `MAKE_DATE()` function:

```sql
MAKE_DATE( year int, month int, day int ) → date
```

In this syntax, `year`, `month`, and `day` are the year, month, and day parts of the date. The negative year indicates BC.

The `MAKE_DATE()` function returns a value of the `DATE` type.

## PostgreSQL MAKE_DATE() function examples

Let’s explore some examples of using the `MAKE_DATE()` function.

### 1\) Basic PostgreSQL MAKE_DATE() function example

The following example uses the `MAKE_DATE()` function to generate the date `2024-03-25`:

```sql
SELECT MAKE_DATE(2023,3, 25);
```

Output:

```text
 make_date
------------
 2023-03-25
(1 row)
```

### 2\) Using the MAKE_DATE() function with leap years

The `MAKE_DATE()` function automatically handles the leap years for you. For example, you can create a date of `February 29th` in a leap year such as `2024` as follows:

```sql
SELECT MAKE_DATE(2024, 2, 29);
```

Output:

```text
 make_date
------------
 2024-02-29
(1 row)
```

### 3\) Using the MAKE_DATE() function to generate sequential dates

The following example uses the `MAKE_DATE()` function to generate a list of date values from `Jan 1, 2024` to `Jan 7, 2024`:

```sql
SELECT MAKE_DATE(2023, 1, day) dates
FROM generate_series(1, 7) AS day;
```

Output:

```text
   dates
------------
 2023-01-01
 2023-01-02
 2023-01-03
 2023-01-04
 2023-01-05
 2023-01-06
 2023-01-07
(7 rows)
```

## Summary

- Use the `MAKE_DATE()` function to generate a date value from the year, month, and day
