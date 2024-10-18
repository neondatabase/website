---
title: 'PostgreSQL TIMEOFDAY() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-timeofday/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `TIMEOFDAY()` function to retrieve the current date and time as a formatted string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL TIMEOFDAY() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `TIMEOFDAY()` function returns the [current date and time](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_timestamp/) as a formatted string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `TIMEOFDAY()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
TIMEOFDAY()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The function does not have any parameters and returns the current date and time as a string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that the `TIMEOFDAY()` function returns the same result as the `CLOCK_TIMESTAMP()` function but in the text string.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL TIMEOFDAY() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the `TIMEOFDAY()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic TIMEOFDAY() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `TIMEOFDAY()` function to retrieve the current date and time as a string:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
              timeofday
-------------------------------------
 Wed Mar 20 10:20:10.108369 2024 -07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows the date, time, and timezone.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Formatting the output

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you want a specific format, you can cast the result of the `TIMEOFDAY()` function into a timestamp and use the `to_char()` function to achieve the desired format:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  to_char(
    timeofday():: timestamp,
    'YYYY-MM-DD HH24:MI:SS'
  ) current_time;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    current_time
---------------------
 2024-03-20 10:26:57
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `TIMEOFDAY()` function to obtain the current date and time as a formatted string.
- <!-- /wp:list-item -->

<!-- /wp:list -->
