---
title: 'PostgreSQL Correlated Subquery'
page_title: 'PostgreSQL Correlated Subquery'
page_description: 'How to use the PostgreSQL correlated subquery to perform a query that depends on the values of the current row being processed.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-correlated-subquery/'
ogImage: '/postgresqltutorial/film.png'
updatedOn: '2024-01-22T03:48:45+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Subquery'
  slug: 'postgresql-tutorial/postgresql-subquery'
nextLink:
  title: 'PostgreSQL ANY Operator'
  slug: 'postgresql-tutorial/postgresql-any'
---

**Summary**: in this tutorial, you will learn about PostgreSQL correlated subquery to perform a query that depends on the values of the current row being processed.

## Introduction to PostgreSQL correlated subquery

In PostgreSQL, a correlated subquery is a [subquery](postgresql-subquery) that references the columns from the outer query.

Unlike a regular subquery, PostgreSQL evaluates the correlated subquery once for each row processed by the outer query.

Since PostgreSQL reevaluates the correlated subquery for every row in the outer query, this may lead to performance issues, especially when dealing with large datasets.

A correlated subquery can be useful when you need to perform a query that depends on the values of the current being processed.

## PostgreSQL correlated subquery example

We’ll use the `film` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration:

![](/postgresqltutorial/film.png)The following example uses a correlated subquery to find the films with higher lengths than average for their respective ratings:

```sql
SELECT film_id, title, length, rating
FROM film f
WHERE length > (
    SELECT AVG(length)
    FROM film
    WHERE rating = f.rating
);
```

Output:

```text
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

The [`WHERE`](postgresql-where) clause (`WHERE length > (...)`) checks if the length of the current film is greater than the average.

The correlated subquery calculates the [average](../postgresql-aggregate-functions/postgresql-avg-function) length for films with the same rating as the current row in the outer query:

```sql
SELECT AVG(length)
FROM film
WHERE rating = f.rating
```

The `WHERE` clause ensures that the correlated subquery considers only films with the same rating as the current row in the outer query. The condition `rating = f.rating` creates the correlation.

As a result, the outer query returns rows where the `length` of the film is greater than the average `length` for films with the same `rating`.

## Summary

- Use a correlated subquery to perform a query that depends on the values of the current row being processed.
