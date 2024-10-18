---
title: 'PostgreSQL PG_SLEEP() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-pg_sleep/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `PG_SLEEP()` function to pause the execution of a query.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL PG_SLEEP() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `PG_SLEEP()` function allows you to create a delay (sleep) in your queries. The function can be useful when you want to test, simulate real-time processes, or add a pause between operations.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `PG_SLEEP()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
PG_SLEEP(seconds)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the `seconds` parameter specifies the number of seconds for which you want the execution to pause. It can be an integer or a decimal number with fractions.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## The PostgreSQL PG_SLEEP() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `PG_SLEEP()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic usage of PG_SLEEP() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `PG_SLEEP()` function to pause the execution for 3 seconds before returning any result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT pg_sleep(3);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After 3 seconds:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 pg_sleep
----------

(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using Fractional Seconds

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `PG_SLEEP()` function to pause the execution for `1.5` seconds:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT PG_SLEEP(1.5);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

After `1.5` seconds:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 pg_sleep
----------

(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the PG_SLEEP() function with NOW() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `PG_SLEEP()` function between the `NOW()` functions:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT NOW(), PG_SLEEP(3), NOW();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
-[ RECORD 1 ]---------------------------
now      | 2024-03-21 02:26:37.710939-07
pg_sleep |
now      | 2024-03-21 02:26:37.710939-07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the result of the `NOW()` function does not change within the same statement even though we use pause the execution between the calls of the `NOW()` functions for 3 seconds.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 4) Using the PG_SLEEP() function with CLOCK_TIMESTAMP() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `PG_SLEEP()` function between the `CLOCK_TIMESTAMP()` functions:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CLOCK_TIMESTAMP(), PG_SLEEP(3), CLOCK_TIMESTAMP();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
-[ RECORD 1 ]---+------------------------------
clock_timestamp | 2024-03-21 02:27:03.181753-07
pg_sleep        |
clock_timestamp | 2024-03-21 02:27:06.186789-07
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows that the `CLOCK_TIMESTAMP()` returns the actual current timestamp when it executes. The results of the `CLOCK_TIMESTAMP()` function calls are 3 seconds difference.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `PG_SLEEP()` function to pause the SQL execution for a number of seconds.
- <!-- /wp:list-item -->

<!-- /wp:list -->
