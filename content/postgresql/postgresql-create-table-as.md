---
title: 'PostgreSQL CREATE TABLE AS'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table-as/
ogImage: ./img/wp-content-uploads-2018-03-PostgreSQL-CREATE-TABLE-AS-data-verification.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE TABLE AS` statement to create a new table from the result set of a query.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL CREATE TABLE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CREATE TABLE AS` statement [creates a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) and fills it with the data returned by a query. The following shows the syntax of the `CREATE TABLE AS` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE new_table_name
AS query;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list {"ordered":true} -->

1. <!-- wp:list-item -->
2. First, specify the new table name after the `CREATE TABLE` clause.
3. <!-- /wp:list-item -->
4.
5. <!-- wp:list-item -->
6. Second, provide a query whose result set is added to the new table after the `AS` keyword.
7. <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `TEMPORARY` or `TEMP` keyword allows you to create a [temporary table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-temporary-table/):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TEMP TABLE new_table_name
AS query;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `UNLOGGED` keyword allows the new table to be created as an unlogged table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE UNLOGGED TABLE new_table_name
AS query;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The columns of the new table will have the names and data types associated with the output columns of the `SELECT` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you want the table columns to have different names, you can specify the new table columns after the new table name:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE new_table_name ( column_name_list)
AS query;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to avoid an error by creating a new table that already exists, you can use the `IF NOT EXISTS` option as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE IF NOT EXISTS new_table_name
AS query;
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL CREATE TABLE AS statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `film` and `film_category` table from the [sample database ](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/)for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":3514} -->

![film_and_film_category_tables](https://www.postgresqltutorial.com/wp-content/uploads/2018/03/film_and_film_category_tables.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following example uses the CREATE TABLE AS statement to create a new table that contains the films whose category is 1:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE action_film
AS
SELECT
    film_id,
    title,
    release_year,
    length,
    rating
FROM
    film
INNER JOIN film_category USING (film_id)
WHERE
    category_id = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To verify the table creation, you can query data from the `action_film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM action_film
ORDER BY title;
```

<!-- /wp:code -->

<!-- wp:image {"id":3515} -->

![PostgreSQL CREATE TABLE AS data verification](./img/wp-content-uploads-2018-03-PostgreSQL-CREATE-TABLE-AS-data-verification.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

To check the structure of the `action_film`, you can use the following command in the psql tool:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\d action_film;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns the following output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3516} -->

![PostgreSQL CREATE TABLE AS example](./img/wp-content-uploads-2018-03-PostgreSQL-CREATE-TABLE-AS-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

As clearly shown in the output, the names and data types of the `action_film` table are derived from the columns of the `SELECT` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `SELECT` clause contains expressions, it is a good practice to override the columns, for example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE IF NOT EXISTS film_rating (rating, film_count)
AS
SELECT
    rating,
    COUNT (film_id)
FROM
    film
GROUP BY
    rating;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This example statement created a new table `film_rating` and filled it with the summary data from the `film` table. It explicitly specified the column names for the new table instead of using the column names from the `SELECT` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To check the structure of the `film_rating` table, you use the following command in psql tool:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
\d film_rating
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following is the output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3517} -->

![PostgreSQL CREATE TABLE AS with explicit column names](./img/wp-content-uploads-2018-03-PostgreSQL-CREATE-TABLE-AS-with-explicit-column-names.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Note that the `CREATE TABLE AS` statement is similar to the `SELECT INTO` statement, but the `CREATE TABLE AS` statement is preferred because it is not confused with other uses of the `SELECT INTO` syntax in [PL/pgSQL](https://www.postgresqltutorial.com/postgresql-plpgsql/). In addition, the `CREATE TABLE AS` statement provides a superset of the functionality offered by the `SELECT INTO` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `CREATE TABLE AS` statement to create a new table from the result of a query.
- <!-- /wp:list-item -->

<!-- /wp:list -->
