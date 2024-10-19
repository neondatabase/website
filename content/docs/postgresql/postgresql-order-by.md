---
title: 'PostgreSQL ORDER BY'
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-ORDER-BY.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ORDER BY` clause to sort the rows of a query by one or more criteria.

## Introduction to PostgreSQL ORDER BY clause

When you query data from a table, the `SELECT` statement returns rows in an unspecified order. To sort the rows of the result set, you use the `ORDER BY` clause in the `SELECT` statement.

The `ORDER BY` clause allows you to sort rows returned by a `SELECT` clause in ascending or descending order based on a sort expression.

The following illustrates the syntax of the `ORDER BY` clause:

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

In this syntax:

- First, specify a sort expression, which can be a column or an expression, that you want to sort after the `ORDER BY` keywords. If you want to sort the result set based on multiple columns or expressions, you need to place a comma (`,`) between two columns or expressions to separate them.
-
- Second, you use the `ASC` option to sort rows in ascending order and the `DESC` option to sort rows in descending order. If you omit the `ASC` or `DESC` option, the `ORDER BY` uses `ASC` by default.

PostgreSQL evaluates the clauses in the `SELECT` statement in the following order: `FROM`, `SELECT`, and `ORDER BY`:

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-ORDER-BY.png)

Due to the order of evaluation, if you have a column alias in the `SELECT` clause, you can use it in the `ORDER BY` clause.

Let’s take some examples of using the PostgreSQL `ORDER BY` clause.

## PostgreSQL ORDER BY examples

We will use the `customer` table in the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration.

![customer table](/postgresqltutorial_data/wp-content-uploads-2019-05-customer.png)

### 1) Using PostgreSQL ORDER BY clause to sort rows by one column

The following query uses the `ORDER BY` clause to sort customers by their first names in ascending order:

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  first_name ASC;
```

![PostgreSQL ORDER BY one column example](/postgresqltutorial_data/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-one-column-example.png)

Since the `ASC` option is the default, you can omit it in the `ORDER BY` clause like this:

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  first_name;
```

### 2) Using PostgreSQL ORDER BY clause to sort rows by one column in descending order

The following statement selects the first name and last name from the `customer` table and sorts the rows by values in the last name column in descending order:

```
SELECT
  first_name,
  last_name
FROM
  customer
ORDER BY
  last_name DESC;
```

![PostgreSQL ORDER BY one column DESC example](/postgresqltutorial_data/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-one-column-desc-example.png)

### 3) Using PostgreSQL ORDER BY clause to sort rows by multiple columns

The following statement selects the first name and last name from the customer table and sorts the rows by the first name in ascending order and last name in descending order:

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

![PostgreSQL ORDER BY multiple columns](/postgresqltutorial_data/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-multiple-columns.png)

In this example, the ORDER BY clause sorts rows by values in the first name column first. Then it sorts the sorted rows by values in the last name column.

As you can see clearly from the output, two customers with the same first name `Kelly` have the last name sorted in descending order.

### 4) Using PostgreSQL ORDER BY clause to sort rows by expressions

The `LENGTH()` function accepts a string and returns the length of that string.

The following statement selects the first names and their lengths. It sorts the rows by the lengths of the first names:

```
SELECT
  first_name,
  LENGTH(first_name) len
FROM
  customer
ORDER BY
  len DESC;
```

![PostgreSQL ORDER BY expressions](/postgresqltutorial_data/wp-content-uploads-2019-12-PostgreSQL-ORDER-BY-expressions.png)

Because the `ORDER BY` clause is evaluated after the `SELECT` clause, the column alias `len` is available and can be used in the `ORDER BY` clause.

## PostgreSQL ORDER BY clause and NULL

In the database world, `NULL` is a marker that indicates the missing data or the data is unknown at the time of recording.

When you sort rows that contain `NULL`, you can specify the order of `NULL` with other non-null values by using the `NULLS FIRST` or `NULLS LAST` option of the `ORDER BY` clause:

```
ORDER BY sort_expresssion [ASC | DESC] [NULLS FIRST | NULLS LAST]
```

The `NULLS FIRST` option places `NULL` before other non-null values and the `NULL LAST` option places `NULL` after other non-null values.

Let's [create a table](/docs/postgresql/postgresql-create-table) for the demonstration.

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

Note that if you are not yet familiar with the `CREATE TABLE` and `INSERT` statements, you can simply execute them from `pgAdmin` or `psql` to create the `sort_demo` table and insert data into it.

The following query returns data from the `sort_demo` table:

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num;
```

Output:

```
 num
------
    1
    2
    3
 null
(4 rows)
```

In this example, the `ORDER BY` clause sorts values in the `num` column of the `sort_demo` table in ascending order. It places `NULL` after other values.

Note that psql displays null as an empty string by default. To make null clearer, you can execute the following command to change an empty string to another such as null:

```
\pset null null
```

Output:

```
Null display is "null".
```

So if you use the `ASC` option, the `ORDER BY` clause uses the `NULLS LAST` option by default. Therefore, the following query returns the same result:

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num NULLS LAST;
```

Output:

```
 num
------
    1
    2
    3
 null
(4 rows)
```

To place `NULL` before other non-null values, you use the `NULLS FIRST` option:

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num NULLS FIRST;
```

Output:

```
 num
------
 null
    1
    2
    3
(4 rows)
```

The following statement sorts values in the `num` column of the `sort_demo` table in descending order:

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num DESC;
```

Output:

```
 num
------
 null
    3
    2
    1
(4 rows)
```

The output indicates that the `ORDER BY` clause with the `DESC` option uses the `NULLS FIRST` by default.

To reverse the order, you can use the `NULLS LAST` option:

```
SELECT
  num
FROM
  sort_demo
ORDER BY
  num DESC NULLS LAST;
```

Output:

```
 num
------
    3
    2
    1
 null
(4 rows)
```

## Summary

- Use the `ORDER BY` clause in the `SELECT` statement to sort the rows in the query set.
-
- Use the `ASC` option to sort rows in ascending order and `DESC` option to sort rows in descending order.
-
- The `ORDER BY` clause uses the `ASC` option by default.
-
- Use `NULLS FIRST` and `NULLS LAST` options to explicitly specify the order of `NULL` with other non-null values.
