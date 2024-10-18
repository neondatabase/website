---
title: 'PostgreSQL LOCALTIMESTAMP Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-localtimestamp/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `LOCALTIMESTAMP` function to return the current date and time at which the current transaction starts.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL LOCALTIMESTAMP function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `LOCALTIMESTAMP` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
LOCALTIMESTAMP(precision)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `LOCALTIMESTAMP` function accepts one argument:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**1) `precision`**

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `precision` argument specifies fractional seconds precision of the second field.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `precision` argument is optional. If you omit it, its default value is 6.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value that represents the date and time at which the current transaction starts.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `LOCALTIMESTAMP` function returns a `TIMESTAMP` value **without** time zone whereas the `CURRENT_TIMESTAMP` function returns a `TIMESTAMP` **with** the timezone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL LOCALTIMESTAMP function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `LOCALTIMESTAMP` function

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL LOCALTIMESTAMP function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `LOCALTIMESTAMP` function to get the current date and time of the transaction:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT LOCALTIMESTAMP;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
         timestamp
----------------------------
 2017-08-16 09:37:38.443431
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL LOCALTIMESTAMP function with a fractional seconds precision example

<!-- /wp:heading -->

<!-- wp:paragraph -->

To get the timestamp of the current transaction with specific fractional seconds precision, you use the `precision` argument as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT LOCALTIMESTAMP(2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result is:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
       timestamp
------------------------
 2017-08-16 09:39:06.64
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `LOCALTIMESTAMP` function to return the date and time at which the current transaction starts.
- <!-- /wp:list-item -->

<!-- /wp:list -->
