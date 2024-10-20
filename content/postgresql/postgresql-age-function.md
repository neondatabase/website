---
prevPost: postgresql-log-function
nextPost: postgresql-joins
createdAt: 2017-03-20T09:49:11.000Z
title: 'PostgreSQL AGE() Function'
redirectFrom:
            - /postgresql/postgresql-age 
            - /postgresql/postgresql-date-functions/postgresql-age
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-03-rental-table.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `AGE()` function to calculate ages.

## Introduction to PostgreSQL AGE() function

In business applications, you often have to calculate ages such as the ages of employees, and years of service of employees. In PostgreSQL, you can use the `AGE()` function to accomplish these tasks.

Here's the basic syntax of the `AGE()` function:

```sql
AGE(timestamp,timestamp);
```

The `AGE()` function accepts two [`TIMESTAMP`](/postgresql/postgresql-timestamp) values. It subtracts the second argument from the first one and returns an [interval](/postgresql/postgresql-tutorial/postgresql-interval) as a result.

For example:

```sql
SELECT AGE('2017-01-01','2011-06-24');
```

Output:

```
   age
-----------------------
 5 years 6 mons 7 days
```

If you want to use the current date as the first argument, you can use the following form of the `AGE()` function:

```sql
AGE(timestamp);
```

For example, if someone's birth date is `2000-01-01`, and the current date is `2024-01-26`, their age would be:

```sql
SELECT
  current_date,
  AGE(timestamp '2000-01-01');
```

Output:

```
 current_date |       age
--------------+------------------
 2024-01-26   | 24 years 25 days
(1 row)
```

## PostgreSQL AGE() function example

We'll use the following `rental` table in the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![PostgreSQL age Function: Rental Table Sample](/postgresqltutorial_data/wp-content-uploads-2017-03-rental-table.png)

The following example uses the `AGE()` function to retrieve the top 10 rentals that have the longest durations:

```sql
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

Output:

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

In this example, we use the `AGE()` function to calculate the rental duration based on the values of the `rental_date` and `return_date` columns.

## Summary

- Use the PostgreSQL `AGE()` function to calculate ages.
