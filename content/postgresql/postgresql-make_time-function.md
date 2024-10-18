---
title: 'PostgreSQL MAKE_TIME() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_time/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MAKE_TIME()` function to create a time value from hour, minute, and second values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL MAKE_TIME() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `MAKE_TIME()` function allows you to create a [time](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-time/) value from hour, minute, and second values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `MAKE_TIME()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MAKE_TIME ( hour int, min int, sec double precision ) → time
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `hour`: The hour part of the time. The valid range for the hour is from 0 to 23. 0 represents midnight (12:00 AM) and 24 represents noon.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `min`: The minute part of the time. The valid range for the second is from 0 to 59.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `sec`: The second within a minute. Its valid range is from 0 to `59.999999`.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `MAKE_TIME()` function returns a time value constructed from the hour, min, and sec.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use invalid values for hour, min, and sec, the function will issue an error.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL MAKE_TIME() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `MAKE_TIME()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic MAKE_TIME() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `MAKE_TIME()` function to construct a time `22:30:45` from hour, minute, and second:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT MAKE_TIME(22,30,45);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 make_time
-----------
 22:30:45
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example attempts to use invalid values for hour, minute, and second to construct a time and results in an error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT MAKE_TIME(25,30,45);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ERROR:  time field value out of range: 25:30:45
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the MAKE_TIME() function with string arguments

<!-- /wp:heading -->

<!-- wp:paragraph -->

Even though the type of hour and minute parameters are integers and seconds are double precision, you can pass string arguments to the `MAKE_TIME()` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Behind the scenes, the function will implicitly convert these string arguments to the proper types, as long as the results of the conversions are in the valid range.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT MAKE_TIME('8', '30', '59.999999');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    make_time
-----------------
 08:30:59.999999
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `MAKE_TIME()` function to create a time value from hour, minute, and second values.
- <!-- /wp:list-item -->

<!-- /wp:list -->
