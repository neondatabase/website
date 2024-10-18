---
title: 'PostgreSQL JUSTIFY_DAYS() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-justify_days/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `JUSTIFY_DAYS()` function to adjust 30-day intervals as months.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL JUSTIFY_DAYS() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `JUSTIFY_DAYS()` function allows you to normalize an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) by converting days exceeding 30 days into months and remaining days.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `JUSTIFY_DAYS()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
JUSTIFY_DAYS ( value) → interval
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `value` is an interval value you want to justify.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `JUSTIFY_DAYS()` function returns an adjusted interval with:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Days exceeding 30 converted to months.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The remaining days are kept as days.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Hours, minutes, and seconds remain intact.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

If the input interval (`value`) is `NULL`, the function returns `NULL`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL JUSTIFY_DAYS() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the PostgreSQL `JUSTIFY_DAYS()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL JUSTIFY_DAYS() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `JUSTIFY_DAYS()` function to adjust intervals that are multiples of 30 days:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT JUSTIFY_DAYS(INTERVAL '30 days'),
       JUSTIFY_DAYS(INTERVAL '60 days'),
       JUSTIFY_DAYS(INTERVAL '90 days');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 justify_days | justify_days | justify_days
--------------+--------------+--------------
 1 mon        | 2 mons       | 3 mons
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using JUSTIFY_DAYS() function with intervals that are not multiple of 30 days

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `JUSTIFY_DAYS()` function to adjust intervals that are not multiples of 30 days:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT JUSTIFY_DAYS(INTERVAL '15 days'),
       JUSTIFY_DAYS(INTERVAL '45 days'),
       JUSTIFY_DAYS(INTERVAL '75 days');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 justify_days | justify_days  |  justify_days
--------------+---------------+----------------
 15 days      | 1 mon 15 days | 2 mons 15 days
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using JUSTIFY_DAYS() function with intervals that include hours

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `JUSTIFY_DAYS()` function to adjust intervals that include hours, minutes, and seconds:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT JUSTIFY_DAYS(INTERVAL '15 days 2 hours'),
       JUSTIFY_DAYS(INTERVAL '55 days 30 minutes'),
       JUSTIFY_DAYS(INTERVAL '75 days 45 seconds');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
   justify_days   |      justify_days      |      justify_days
------------------+------------------------+-------------------------
 15 days 02:00:00 | 1 mon 25 days 00:30:00 | 2 mons 15 days 00:00:45
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the adjusted intervals have the time parts.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `JUSTIFY_DAYS()` function to normalize an interval by converting days exceeding 30 days as months.
- <!-- /wp:list-item -->

<!-- /wp:list -->
