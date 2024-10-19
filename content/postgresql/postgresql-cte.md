---
createdAt: 2019-01-02T12:19:37.000Z
title: 'PostgreSQL CTE'
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL common table expression (CTE) to simplify complex queries.

## Introduction to PostgreSQL common table expression (CTE)

A common table expression (CTE) allows you to create a temporary result set within a [query](/postgresql/postgresql-select).

A CTE helps you enhance the readability of a complex query by breaking it down into smaller and more reusable parts

Here's the basic syntax for creating a common table expression:

```sql
WITH cte_name (column1, column2, ...) AS (
    -- CTE query
    SELECT ...
)
-- Main query using the CTE
SELECT ...
FROM cte_name;
```

In this syntax:

- **WITH clause**: Introduce the common table expression (CTE). It is followed by the name of the CTE and a list of column names in parentheses. The column list is optional and is only necessary if you want to explicitly define the columns for the CTE.
- **CTE name**: Specify the name of the CTE. The CTE name exists within the scope of the query. Ensure that the CTE name is unique within the query.
- **Column List (optional)**: Specify the list of column names within the parentheses after the CTE name. If not specified, the columns implicitly inherit the column names from `SELECT` statement inside the CTE.
- **AS keyword**: The AS keyword indicates the beginning of the CTE definition.
- **CTE query**: This is a query that defines the CTE, which may include [JOINs](/postgresql/postgresql-joins), [WHERE](/postgresql/postgresql-tutorial/postgresql-where), [GROUP BY](/postgresql/postgresql-tutorial/postgresql-group-by) clauses, and other valid SQL constructs.
- **Main query**: After defining the CTE, you can reference it in the main query by its name. In the main query, you can use the CTE as if it were a regular table, simplifying the structure of complex queries.

## PostgreSQL CTE examples

Let's explore some examples of using common table expressions (CTE).

### 1) Basic PostgreSQL common table expression example

The following example uses a common table expression (CTE) to select the `title` and `length` of films in the `'Action'` category and returns all the columns of the CTE:

```sql
WITH action_films AS (
  SELECT
    f.title,
    f.length
  FROM
    film f
    INNER JOIN film_category fc USING (film_id)
    INNER JOIN category c USING(category_id)
  WHERE
    c.name = 'Action'
)
SELECT * FROM action_films;
```

Output:

```
          title          | length
-------------------------+--------
 Amadeus Holy            |    113
 American Circus         |    129
 Antitrust Tomatoes      |    168
 Ark Ridgemont           |     68
...
```

In this example:

- First, the CTE query combines data from three tables `film`, `film_category`, and `category` using the `INNER JOIN` clauses.
- Then, the main query retrieves data from the `action_films` CTE using a simple `SELECT` statement.

### 2) Join a CTE with a table example

We'll use the `rental` and `staff` tables from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database) in this example:

The following example join a CTE with a table to find the staff and rental count for each:

```sql
WITH cte_rental AS (
  SELECT
    staff_id,
    COUNT(rental_id) rental_count
  FROM
    rental
  GROUP BY
    staff_id
)
SELECT
  s.staff_id,
  first_name,
  last_name,
  rental_count
FROM
  staff s
  INNER JOIN cte_rental USING (staff_id);
```

In this example:

- First, the CTE returns a result set that includes the staff id and the rental counts.
- Then, the main query joins the `staff` table with the CTE using the `staff_id` column.

Output:

```
 staff_id | first_name | last_name | rental_count
----------+------------+-----------+--------------
        1 | Mike       | Hillyer   |         8040
        2 | Jon        | Stephens  |         8004
(2 rows)
```

### 3) Multiple CTEs example

The following example uses multiple CTEs to calculate various statistics related to films and customers:

```sql
WITH film_stats AS (
    -- CTE 1: Calculate film statistics
    SELECT
        AVG(rental_rate) AS avg_rental_rate,
        MAX(length) AS max_length,
        MIN(length) AS min_length
    FROM film
),
customer_stats AS (
    -- CTE 2: Calculate customer statistics
    SELECT
        COUNT(DISTINCT customer_id) AS total_customers,
        SUM(amount) AS total_payments
    FROM payment
)
-- Main query using the CTEs
SELECT
    ROUND((SELECT avg_rental_rate FROM film_stats), 2) AS avg_film_rental_rate,
    (SELECT max_length FROM film_stats) AS max_film_length,
    (SELECT min_length FROM film_stats) AS min_film_length,
    (SELECT total_customers FROM customer_stats) AS total_customers,
    (SELECT total_payments FROM customer_stats) AS total_payments;
```

Output:

```
 avg_film_rental_rate | max_film_length | min_film_length | total_customers | total_payments
----------------------+-----------------+-----------------+-----------------+----------------
                 2.98 |             185 |              46 |             599 |       61312.04
(1 row)
```

In this example, we create two CTEs:

- **`film_stats`:** Calculates statistics related to films including the average rental rate, maximum length, and minimum length.
- **`customer_stats`:** Calculates statistics related to customers including the total number of distinct customers and the overall payments made.

The main query retrieves specific values from each CTE to create a summary report.

## PostgreSQL CTE advantages

The following are some advantages of using common table expressions or CTEs:

- Improve the readability of complex queries. You use CTEs to organize complex queries in a more organized and readable manner.
- Ability to create [recursive queries](/postgresql/postgresql-recursive-query), which are queries that reference themselves. The recursive queries come in handy when you want to query hierarchical data such as organization charts.
- Use in conjunction with [window functions](/postgresql/postgresql-window-function). You can use CTEs in conjunction with window functions to create an initial result set and use another select statement to further process this result set.

## Summary

- Use a common table expression (CTE) to create a temporary result set within a query.
- Leverage CTEs to simplify complex queries and make them more readable.
