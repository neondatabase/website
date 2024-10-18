---
title: 'PostgreSQL ORDER BY'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-order-by/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-ORDER-BY.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ORDER BY` clause to sort the rows of a query by one or more criteria.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL ORDER BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

When you query data from a table, the `SELECT` statement returns rows in an unspecified order. To sort the rows of the result set, you use the `ORDER BY` clause in the `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause allows you to sort rows returned by a `SELECT` clause in ascending or descending order based on a sort expression.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `ORDER BY` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  select_list
FROM
  table_name
ORDER BY
  sort_expression1 [ASC | DESC],
  sort_expression2 [ASC | DESC],
  ...;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify a sort expression, which can be a column or an expression, that you want to sort after the `ORDER BY` keywords. If you want to sort the result set based on multiple columns or expressions, you need to place a comma (`,`) between two columns or expressions to separate them.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, you use the `ASC` option to sort rows in ascending order and the `DESC` option to sort rows in descending order. If you omit the `ASC` or `DESC` option, the `ORDER BY` uses `ASC` by default.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

PostgreSQL evaluates the clauses in the `SELECT` statement in the following order: `FROM`, `SELECT`, and `ORDER BY`:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4834,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-ORDER-BY.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Due to the order of evaluation, if you have a column alias in the `SELECT` clause, you can use it in the `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let’s take some examples of using the PostgreSQL `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL ORDER BY examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `customer` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4011} -->

![customer table](./img/wp-content-uploads-2019-05-customer.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL ORDER BY clause to sort rows by one column

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following query uses the `ORDER BY` clause to sort customers by their first names in ascending order:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  first_name ASC;
```

<!-- /wp:code -->

<!-- wp:image {"id":4435} -->

![PostgreSQL ORDER BY one column example](./img/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-one-column-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Since the `ASC` option is the default, you can omit it in the `ORDER BY` clause like this:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  first_name;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL ORDER BY clause to sort rows by one column in descending order

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement selects the first name and last name from the `customer` table and sorts the rows by values in the last name column in descending order:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  last_name DESC;
```

<!-- /wp:code -->

<!-- wp:image {"id":4436} -->

![PostgreSQL ORDER BY one column DESC example](./img/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-one-column-desc-example.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 3) Using PostgreSQL ORDER BY clause to sort rows by multiple columns

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement selects the first name and last name from the customer table and sorts the rows by the first name in ascending order and last name in descending order:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  first_name ASC,
  last_name DESC;
```

<!-- /wp:code -->

<!-- wp:image {"id":4437} -->

![PostgreSQL ORDER BY multiple columns](./img/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-multiple-columns.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

In this example, the ORDER BY clause sorts rows by values in the first name column first. Then it sorts the sorted rows by values in the last name column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

As you can see clearly from the output, two customers with the same first name `Kelly` have the last name sorted in descending order.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 4) Using PostgreSQL ORDER BY clause to sort rows by expressions

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `LENGTH()` function accepts a string and returns the length of that string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following statement selects the first names and their lengths. It sorts the rows by the lengths of the first names:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  LENGTH(first_name) len
FROM
  customer
ORDER BY
  len DESC;
```

<!-- /wp:code -->

<!-- wp:image {"id":4438} -->

![PostgreSQL ORDER BY expressions](./img/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-expressions.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Because the `ORDER BY` clause is evaluated after the `SELECT` clause, the column alias `len` is available and can be used in the `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL ORDER BY clause and NULL

<!-- /wp:heading -->

<!-- wp:paragraph -->

In the database world, `NULL` is a marker that indicates the missing data or the data is unknown at the time of recording.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you sort rows that contain `NULL`, you can specify the order of `NULL` with other non-null values by using the `NULLS FIRST` or `NULLS LAST` option of the `ORDER BY` clause:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ORDER BY sort_expresssion [ASC | DESC] [NULLS FIRST | NULLS LAST]
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `NULLS FIRST` option places `NULL` before other non-null values and the `NULL LAST` option places `NULL` after other non-null values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Let's [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
-- create a new table
CREATE TABLE sort_demo(num INT);

-- insert some data
INSERT INTO sort_demo(num)
VALUES
  (1),
  (2),
  (3),
  (null);
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

Note that if you are not yet familiar with the `CREATE TABLE` and `INSERT` statements, you can simply execute them from `pgAdmin` or `psql` to create the `sort_demo` table and insert data into it.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following query returns data from the `sort_demo` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 num
------
    1
    2
    3
 null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, the `ORDER BY` clause sorts values in the `num` column of the `sort_demo` table in ascending order. It places `NULL` after other values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that psql displays null as an empty string by default. To make null clearer, you can execute the following command to change an empty string to another such as null:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\pset null null
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
Null display is "null".
```

<!-- /wp:code -->

<!-- wp:paragraph -->

So if you use the `ASC` option, the `ORDER BY` clause uses the `NULLS LAST` option by default. Therefore, the following query returns the same result:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num NULLS LAST;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 num
------
    1
    2
    3
 null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To place `NULL` before other non-null values, you use the `NULLS FIRST` option:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num NULLS FIRST;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 num
------
 null
    1
    2
    3
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement sorts values in the `num` column of the `sort_demo` table in descending order:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 num
------
 null
    3
    2
    1
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `ORDER BY` clause with the `DESC` option uses the `NULLS FIRST` by default.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To reverse the order, you can use the `NULLS LAST` option:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num DESC NULLS LAST;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 num
------
    3
    2
    1
 null
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `ORDER BY` clause in the `SELECT` statement to sort the rows in the query set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `ASC` option to sort rows in ascending order and `DESC` option to sort rows in descending order.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `ORDER BY` clause uses the `ASC` option by default.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use `NULLS FIRST` and `NULLS LAST` options to explicitly specify the order of `NULL` with other non-null values.
- <!-- /wp:list-item -->

<!-- /wp:list -->
