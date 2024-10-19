---
title: 'PostgreSQL Correlated Subquery'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about PostgreSQL correlated subquery to perform a query that depends on the values of the current row being processed.

## Introduction to PostgreSQL correlated subquery

In PostgreSQL, a correlated subquery is a [subquery](/docs/postgresql/postgresql-subquery) that references the columns from the outer query.

Unlike a regular subquery, PostgreSQL evaluates the correlated subquery once for each row processed by the outer query.

Since PostgreSQL reevaluates the correlated subquery for every row in the outer query, this may lead to performance issues, especially when dealing with large datasets.

A correlated subquery can be useful when you need to perform a query that depends on the values of the current being processed.

## PostgreSQL correlated subquery example

We'll use the `film` table from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration:

![](/postgresqltutorial_data/film.png)

The following example uses a correlated subquery to find the films with higher lengths than average for their respective ratings:

```
SELECT film_id, title, length, rating
FROM film f
WHERE length > (
    SELECT AVG(length)
    FROM film
    WHERE rating = f.rating
);
```

Output:

```
 film_id |            title            | length | rating
---------+-----------------------------+--------+--------
     133 | Chamber Italian             |    117 | NC-17
       4 | Affair Prejudice            |    117 | G
       5 | African Egg                 |    130 | G
       6 | Agent Truman                |    169 | PG
...
```

How it works.

The outer query retrieves id, title, length, and rating from the `film` table that has the alias `f`:

```
SELECT film_id, title, length, rating
FROM film f
WHERE length > (...)
```

For each row processed by the outer query, the correlated subquery calculates the average `length` of films that have the same `rating` as the current row (`f.rating`).

The `WHERE` clause (`WHERE length > (...)`) checks if the length of the current film is greater than the average.

The correlated subquery calculates the [average](/docs/postgresql/postgresql-aggregate-functions/postgresql-avg-function) length for films with the same rating as the current row in the outer query:

```
SELECT AVG(length)
FROM film
WHERE rating = f.rating
```

The `WHERE` clause ensures that the correlated subquery considers only films with the same rating as the current row in the outer query. The condition `rating = f.rating` creates the correlation.

As a result, the outer query returns rows where the `length` of the film is greater than the average `length` for films with the same `rating`.

## Summary

- Use a correlated subquery to perform a query that depends on the values of the current row being processed.
