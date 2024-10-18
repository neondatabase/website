---
title: 'PostgreSQL SELECT INTO'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select-into/
ogImage: ./img/wp-content-uploads-2018-03-film_table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `SELECT INTO` statement to create a new table from the result set of a query.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

If you want to select data into variables, check out the [PL/pgSQL SELECT INTO statement](https://www.postgresqltutorial.com/plpgsql-select-into/).

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL SELECT INTO statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `SELECT INTO` statement [creates a new table ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/)and [inserts data](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) returned from a query into the table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The new table will have columns with the same names as the columns of the result set of the query. Unlike a regular [`SELECT`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) statement, the `SELECT INTO` statement does not return a result to the client.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the PostgreSQL `SELECT INTO` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  select_list I
INTO [ TEMPORARY | TEMP ] [ TABLE ] new_table_name
FROM
  table_name
WHERE
  search_condition;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To create a new table with the structure and data derived from a result set, you specify the new table name after the `INTO` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `TEMP` or `TEMPORARY` keyword is optional; it allows you to create a [temporary table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-temporary-table/) instead.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `TABLE` keyword is optional, which enhances the clarity of the statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `WHERE` clause allows you to specify a condition that determines which rows from the original tables should be filled into the new table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides the `WHERE` clause, you can use other clauses in the `SELECT` statement for the `SELECT INTO` statement such as `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, and `HAVING`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that you cannot use the `SELECT INTO` statement in PL/pgSQL because it interprets the `INTO` clause differently. In this case, you can use the `CREATE TABLE AS` statement which provides more functionality than the `SELECT INTO` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL SELECT INTO examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `film` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":3449} -->

![PostgreSQL SELECT INTO sample table](./img/wp-content-uploads-2018-03-film_table.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL SELECT INTO statement example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `SELECT INTO` statement to create a new table called `film_r` that contains films with the rating `R` and rental duration 5 days from the `film` table.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    film_id,
    title,
    rental_rate
INTO TABLE film_r
FROM
    film
WHERE
    rating = 'R'
AND rental_duration = 5
ORDER BY
    title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To verify the table creation, you can query data from the `film_r` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM film_r;
```

<!-- /wp:code -->

<!-- wp:image {"id":5185,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Select-Into-Example.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 2) Using the SELECT INTO statement to create a new temporary table

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `SELECT INTO` statement to create a temporary table named `short_film` that contains films whose lengths are under 60 minutes.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    film_id,
    title,
    length
INTO TEMP TABLE short_film
FROM
    film
WHERE
    length < 60
ORDER BY
    title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following shows the data from the `short_film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM short_film
ORDER BY length DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 film_id |        title         | length
---------+----------------------+--------
     486 | Jet Neighbors        |     59
     465 | Interview Liaisons   |     59
     409 | Heartbreakers Bright |     59
     947 | Vision Torque        |     59
...
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `SELECT INTO` statement to create a new table from the result set of a query.
- <!-- /wp:list-item -->

<!-- /wp:list -->
