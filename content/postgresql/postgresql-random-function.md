---
title: 'PostgreSQL RANDOM() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-math-functions/postgresql-random/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `RANDOM()` function to generate random values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL RANDOM() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RANDOM()` function allows you to generate random values. Here's the basic syntax of the `RANDOM()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
RANDOM()
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `RANDOM()` function returns a random value between 0 and 1.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In practice, you'll find the `RANDOM()` function useful in various applications such as:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Generate random data.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Shuffling results.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Select random rows from a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## PostgreSQL RANDOM() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `RANDOM` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL RANDOM() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `RANDOM()` function to generate a random value between 0 and 1:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT RANDOM() AS random;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       random
--------------------
 0.1118658328429385
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Generating random integers

<!-- /wp:heading -->

<!-- wp:paragraph -->

To generate a random integer, you need to use the `RANDOM()` function with the `FLOOR()` function. For example, the following generates a random integer between 1 and 100:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT floor(random() * 100) + 1 AS random_integer;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sample output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 random_integer
----------------
             34
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Retrieving random records

<!-- /wp:heading -->

<!-- wp:paragraph -->

Sometimes, you may need to retrieve random records from a table. To do that, you can utilize the `RANDOM()` function in conjunction with the `ORDER` `BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following query uses the `RANDOM()` function to retrieve a random film from the `film` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT title
FROM film
ORDER BY RANDOM()
LIMIT 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sample output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
       title
-------------------
 Outfield Massacre
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Shuffling results

<!-- /wp:heading -->

<!-- wp:paragraph -->

You can use the `RANDOM()` function to shuffle the rows in a result set of a query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following query uses the `RANDOM()` function to shuffle the rows from the film table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT title FROM film ORDER BY RANDOM();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sample output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
            title
-----------------------------
 Shootist Superfly
 Beauty Grease
 Craft Outfield
 Amistad Midsummer
 Lord Arizona
...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Seed for reproducibility

<!-- /wp:heading -->

<!-- wp:paragraph -->

By default, PostgreSQL uses a deterministic pseudo-random number generator to generate random numbers.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

But if you need to generate the same random number, you can reissue the `SETSEED()` function in the same session with the same argument.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following query always returns the same random number:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT SETSEED(0.5), RANDOM();
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `RANDOM()` function to generate a random number between 0 and 1.
- <!-- /wp:list-item -->

<!-- /wp:list -->
