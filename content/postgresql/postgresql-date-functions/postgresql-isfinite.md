---
title: 'PostgreSQL ISFINITE() Function'
page_title: 'PostgreSQL ISFINITE() Function'
page_description: 'You will learn how to use the PostgreSQL ISFINITE() function to determine if a date, a timestamp, or an interval is finite or not.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-isfinite/'
ogImage: ''
updatedOn: '2024-03-20T09:23:01+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL DATE_TRUNC() Function'
  slug: 'postgresql-date-functions/postgresql-date_trunc'
nextLink:
  title: 'PostgreSQL TIMEOFDAY() Function'
  slug: 'postgresql-date-functions/postgresql-timeofday'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ISFINITE()` function to determine if a date, a timestamp, or an interval is finite or not.

## Introduction to the PostgreSQL ISFINITE() function

The `ISFINITE()` function accepts a [date](../postgresql-tutorial/postgresql-date), a [timestamp](../postgresql-tutorial/postgresql-timestamp), or an [interval](../postgresql-tutorial/postgresql-interval) and returns true if the value is finite.

Here’s the syntax of the `ISFINITE()` function:

```sql
isfinite ( value ) → boolean
```

The `isfinite()` function accepts a value with the type date, timestamp, or interval.

The `isfinite()` function returns true if the value is finite or false otherwise. It returns `NULL` if the value is `NULL`.

## PostgreSQL ISFINITE() function examples

Let’s explore some examples of using the `ISFINITE()` function.

### 1\) Using the ISFINITE() function with dates

The following example uses the `ISFINITE()` function to check if a date is finite or not:

```sql
SELECT ISFINITE('2024-03-20'::date) result;
```

Output:

```sql
 result
--------
 t
(1 row)
```

The result is t, which is true in PostgreSQL.

The following example uses the `ISFINITE()` function to determine whether the date infinity is finite or not:

```sql
SELECT ISFINITE(DATE 'infinity') result;
```

Output:

```sql
 result
--------
 f
(1 row)
```

The result is false because the infinity date is not finite.

### 2\) Using the ISFINITE() function with intervals

The following statement uses the `ISFINITE()` function to check if an interval is finite or not:

```sql
SELECT ISFINITE(INTERVAL '1 day') result;
```

Output:

```sql
 result
--------
 t
(1 row)
```

Since PostgreSQL doesn’t support infinity intervals, the `ISFINITE()` function always returns true for an interval.

### 3\) Using the ISFINITE() function with timestamps

The following statement uses the `ISFINITE()` function to test for a finite timestamp:

```sql
SELECT ISFINITE(TIMESTAMP '2024-03-20 00:00:00') result;
```

Output:

```sql
 result
--------
 t
(1 row)
```

The following statement uses the `ISFINITE()` function to check for an infinite timestamp:

```sql
SELECT ISFINITE(TIMESTAMP 'infinity') result;
```

Output:

```sql
 result
--------
 f
(1 row)
```

## Summary

- Use the `ISFINITE()` function to test if a date, a timestamp, or an interval is finite or not.
