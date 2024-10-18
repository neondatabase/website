---
title: 'PostgreSQL MIN_SCALE() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-min_scale/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `min_scale()` function to determine the minimum number of decimal places required to represent a number accurately.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL MIN_SCALE() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, the `min_scale()` function allows you to determine the minimum number of decimal places required to represent a number accurately.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `min_scale()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
min_sacle(n)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `n` is a value of the numeric data type that you want to find the minimum number of decimal places.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `min_scale()` function returns an integer that represents the minimum scale needed to represent the input number `n` precisely.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `min_scale()` function returns null if the input number is null.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Please note that PostgreSQL added the `min_scale()` function since version 13.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you can use the `min_scale()` function to save storage space by avoiding unnecessary decimal places when storing numeric data.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL MIN_SCALE() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `min_scale()` function to return the min scale of the number `1.2300`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT min_scale(1.2300);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 min_scale
-----------
         2
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example returns the min scale of the number 1.23:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT min_scale(1.23);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
 min_scale
-----------
         2
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example returns 0 because the integer 10 has no decimals:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT min_scale(10);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
 min_scale
-----------
         0
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `min_scale()` function to determine the minimum scale of a number.
- <!-- /wp:list-item -->

<!-- /wp:list -->
