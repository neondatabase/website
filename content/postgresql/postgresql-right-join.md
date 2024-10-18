---
title: 'PostgreSQL RIGHT JOIN'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-right-join/
ogImage: ./img/wp-content-uploads-2018-12-PostgreSQL-Join-Right-Join.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will how to use PostgreSQL `RIGHT JOIN` to join two tables and return rows from the right table that may or may not have matching rows in the left table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL RIGHT JOIN clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RIGHT JOIN` clause joins a right table with a left table and returns the rows from the right table that may or may not have matching rows in the left table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `RIGHT JOIN` can be useful when you want to find rows in the right table that do not have matching rows in the left table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `RIGHT JOIN` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  select_list
FROM
  table1
RIGHT JOIN table2
  ON table1.column_name = table2.column_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the columns from both tables in the `select_list` in the `SELECT` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, provide the left table (`table1`) from which you want to select data in the `FROM` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Third, specify the right table (`table2`) that you want to join with the left table in the `RIGHT JOIN` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Finally, define a condition for joining two tables (`table1.column_name = table2.column_name`), which indicates the `column_name` in each table should have matching rows.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### How the RIGHT JOIN works

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RIGHT JOIN` starts retrieving data from the right table (`table2`).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For each row in the right table (`table2`), the `RIGHT JOIN` checks if the value in the `column_name` is equal to the value of the corresponding column in every row of the left table (`table1`).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When these values are equal, the `RIGHT JOIN` creates a new row that includes columns specified in the `select_list` and appends it to the result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If these values are not equal, the `RIGHT JOIN` generates a new row that includes columns specified in the `select_list`, populates the columns on the left with `NULL`, and appends the new row to the result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In other words, the `RIGHT JOIN` returns all rows from the right table whether or not they have corresponding rows in the left table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following Venn diagram illustrates how the `RIGHT JOIN` works:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3678,"sizeSlug":"large"} -->

![PostgreSQL Join - Right Join](./img/wp-content-uploads-2018-12-PostgreSQL-Join-Right-Join.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Note that the `RIGHT OUTER JOIN` is the same as `RIGHT JOIN`. The `OUTER` keyword is optional

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### The USING syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

When the columns for joining have the same name, you can use the `USING` syntax:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  select_list
FROM
  table1
RIGHT JOIN table2 USING (column_name);
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL RIGHT JOIN examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use the `film` and `inventory` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL RIGHT JOIN examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `RIGHT JOIN` clause to retrieve all rows from the film table that may or may not have corresponding rows in the inventory table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  film.film_id,
  film.title,
  inventory.inventory_id
FROM
  inventory
RIGHT JOIN film
  ON film.film_id = inventory.film_id
ORDER BY
  film.title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":6674,"sizeSlug":"full","linkDestination":"none"} -->

![PostgreSQL RIGHT JOIN example](./img/wp-content-uploads-2024-01-PostgreSQL-RIGHT-JOIN-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

You can rewrite the above query using table aliases:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  inventory i
RIGHT JOIN film f
  ON f.film_id = i.film_id
ORDER BY
  f.title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Since the film and inventory table has the film_id column, you can use the USING syntax:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  inventory i
RIGHT JOIN film f USING(film_id)
ORDER BY
  f.title;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) PostgreSQL RIGHT JOIN with a WHERE clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses a `RIGHT JOIN` clause with a `WHERE` clause to retrieve the films that have no inventory:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  f.film_id,
  f.title,
  i.inventory_id
FROM
  inventory i
RIGHT JOIN film f USING(film_id)
WHERE i.inventory_id IS NULL
ORDER BY
  f.title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 film_id |         title          | inventory_id
---------+------------------------+--------------
      14 | Alice Fantasia         |         null
      33 | Apollo Teen            |         null
      36 | Argonauts Town         |         null
      38 | Ark Ridgemont          |         null
      41 | Arsenic Independence   |         null
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `RIGHT JOIN` clause to join a right table with a left table and return rows from the right table that may or may not have corresponding rows in the left table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `RIGHT JOIN` is also known as `RIGHT OUTER JOIN`.
- <!-- /wp:list-item -->

<!-- /wp:list -->
