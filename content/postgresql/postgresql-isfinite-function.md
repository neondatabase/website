---
title: 'PostgreSQL ISFINITE() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-isfinite/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ISFINITE()` function to determine if a date, a timestamp, or an interval is finite or not.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL ISFINITE() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `ISFINITE()` function accepts a [date](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-date/), a [timestamp](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/), or an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) and returns true if the value is finite.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `ISFINITE()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
isfinite ( value ) → boolean
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `isfinite()` function accepts a value with the type date, timestamp, or interval.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `isfinite()` function returns true if the value is finite or false otherwise. It returns `NULL` if the value is `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL ISFINITE() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `ISFINITE()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using the ISFINITE() function with dates

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ISFINITE()` function to check if a date is finite or not:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT ISFINITE('2024-03-20'::date) result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 t
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is t, which is true in PostgreSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the `ISFINITE()` function to determine whether the date infinity is finite or not:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT ISFINITE(DATE 'infinity') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is false because the infinity date is not finite.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the ISFINITE() function with intervals

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `ISFINITE()` function to check if an interval is finite or not:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT ISFINITE(INTERVAL '1 day') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 t
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Since PostgreSQL doesn't support infinity intervals, the `ISFINITE()` function always returns true for an interval.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using the ISFINITE() function with timestamps

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `ISFINITE()` function to test for a finite timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT ISFINITE(TIMESTAMP '2024-03-20 00:00:00') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 t
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement uses the `ISFINITE()` function to check for an infinite timestamp:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT ISFINITE(TIMESTAMP 'infinity') result;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 result
--------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ISFINITE()` function to test if a date, a timestamp, or an interval is finite or not.
- <!-- /wp:list-item -->

<!-- /wp:list -->
