---
title: 'PostgreSQL AGE() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-age/
ogImage: ./img/wp-content-uploads-2017-03-rental-table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `AGE()` function to calculate ages.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL AGE() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

In business applications, you often have to calculate ages such as the ages of employees, and years of service of employees. In PostgreSQL, you can use the `AGE()` function to accomplish these tasks.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `AGE()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
AGE(timestamp,timestamp);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `AGE()` function accepts two [`TIMESTAMP`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-timestamp/) values. It subtracts the second argument from the first one and returns an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) as a result.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT AGE('2017-01-01','2011-06-24');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
   age
-----------------------
 5 years 6 mons 7 days
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to use the current date as the first argument, you can use the following form of the `AGE()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
AGE(timestamp);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, if someone's birth date is `2000-01-01`, and the current date is `2024-01-26`, their age would be:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  current_date,
  AGE(timestamp '2000-01-01');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"shell"} -->

```
 current_date |       age
--------------+------------------
 2024-01-26   | 24 years 25 days
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL AGE() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the following `rental` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):

<!-- /wp:paragraph -->

<!-- wp:image {"id":2748} -->

![PostgreSQL age Function: Rental Table Sample](./img/wp-content-uploads-2017-03-rental-table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the `AGE()` function to retrieve the top 10 rentals that have the longest durations:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  rental_id,
  customer_id,
  AGE(return_date, rental_date) AS duration
FROM
  rental
WHERE
  return_date IS NOT NULL
ORDER BY
  duration DESC
LIMIT
  10;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 rental_id | customer_id |    duration
-----------+-------------+-----------------
      2412 |         127 | 9 days 05:59:00
     14678 |         383 | 9 days 05:59:00
     13947 |         218 | 9 days 05:58:00
     14468 |         224 | 9 days 05:58:00
      7874 |          86 | 9 days 05:58:00
     11629 |         299 | 9 days 05:58:00
      5738 |         187 | 9 days 05:56:00
      9938 |          63 | 9 days 05:56:00
     12159 |         106 | 9 days 05:55:00
      3873 |         394 | 9 days 05:55:00
(10 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `AGE()` function to calculate the rental duration based on the values of the `rental_date` and `return_date` columns.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `AGE()` function to calculate ages.
- <!-- /wp:list-item -->

<!-- /wp:list -->
