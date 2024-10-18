---
title: 'PostgreSQL WHERE'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-WHERE.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use PostgreSQL `WHERE` clause to filter rows returned by a `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL WHERE clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `SELECT` statement returns all rows from one or more columns in a table. To retrieve rows that satisfy a specified condition, you use a `WHERE` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The syntax of the PostgreSQL `WHERE` clause is as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  select_list
FROM
  table_name
WHERE
  condition
ORDER BY
  sort_expression;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, you place the `WHERE` clause right after the `FROM` clause of the `SELECT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `WHERE` clause uses the `condition` to filter the rows returned from the `SELECT` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `condition` is a boolean expression that evaluates to true, false, or unknown.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The query returns only rows that satisfy the `condition` in the `WHERE` clause. In other words, the query will include only rows that cause the `condition` evaluates to true in the result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL evaluates the `WHERE` clause after the `FROM` clause but before the `SELECT` and `ORDER BY` clause:

<!-- /wp:paragraph -->

<!-- wp:image {"id":4840,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-WHERE.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

If you use [column aliases](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-column-alias/) in the `SELECT` clause, you cannot use them in the `WHERE` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides the `SELECT` statement, you can use the `WHERE` clause in the `UPDATE` and `DELETE` statement to specify rows to update and delete.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To form the condition in the `WHERE` clause, you use comparison and logical operators:

<!-- /wp:paragraph -->

<!-- wp:table {"className":"normal"} -->

| Operator                                                                              | Description                                         |
| ------------------------------------------------------------------------------------- | --------------------------------------------------- |
| =                                                                                     | Equal                                               |
| >                                                                                     | Greater than                                        |
| &lt;                                                                                  | Less than                                           |
| >=                                                                                    | Greater than or equal                               |
| &lt;=                                                                                 | Less than or equal                                  |
| &lt;> or !=                                                                           | Not equal                                           |
| AND                                                                                   | Logical operator AND                                |
| OR                                                                                    | Logical operator OR                                 |
| [IN](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-in/)           | Return true if a value matches any value in a list  |
| [BETWEEN](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-between/) | Return true if a value is between a range of values |
| [LIKE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-like/)       | Return true if a value matches a pattern            |
| [IS NULL](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-is-null/) | Return true if a value is NULL                      |
| NOT                                                                                   | Negate the result of other operators                |

<!-- /wp:table -->

<!-- wp:heading -->

## PostgreSQL WHERE clause examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's practice with some examples of using the `WHERE` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

We will use the `customer` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":4011} -->

![customer table](./img/wp-content-uploads-2019-05-customer.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### 1) Using WHERE clause with the equal (`=`) operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `WHERE` clause to find customers with the first name is `Jamie`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  last_name,
  first_name
FROM
  customer
WHERE
  first_name = 'Jamie';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 last_name | first_name
-----------+------------
 Rice      | Jamie
 Waugh     | Jamie
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the WHERE clause with the AND operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses a `WHERE` clause with the `AND` logical operator to find customers whose first name and last names are `Jamie` and `rice`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  last_name,
  first_name
FROM
  customer
WHERE
  first_name = 'Jamie'
  AND last_name = 'Rice';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 last_name | first_name
-----------+------------
 Rice      | Jamie
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the WHERE clause with the OR operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses a WHERE clause with an OR operator to find the customers whose last name is `Rodriguez` or first name is `Adam`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  last_name = 'Rodriguez'
  OR first_name = 'Adam';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name | last_name
------------+-----------
 Laura      | Rodriguez
 Adam       | Gooch
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 4) Using the WHERE clause with the IN operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you want to find a value in a list of values, you can use the `IN` operator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the WHERE clause with the IN operator to find the customers with first names in the list Ann, Anne, and Annie:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name IN ('Ann', 'Anne', 'Annie');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name | last_name
------------+-----------
 Ann        | Evans
 Anne       | Powell
 Annie      | Russell
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 5) Using the WHERE clause with the LIKE operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

To find a string that matches a specified pattern, you use the `LIKE` operator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example uses the LIKE operator in the WHERE clause to find customers whose first names start with the word `Ann`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE 'Ann%';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name | last_name
------------+-----------
 Anna       | Hill
 Ann        | Evans
 Anne       | Powell
 Annie      | Russell
 Annette    | Olson
(5 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `%` is called a wildcard that matches any string. The `'Ann%'` pattern matches any strings that start with `'Ann'`.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 6) Using the WHERE clause with the BETWEEN operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example finds customers whose first names start with the letter `A` and contains 3 to 5 characters by using the `BETWEEN` operator.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `BETWEEN` operator returns true if a value is in a range of values.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  LENGTH(first_name) name_length
FROM
  customer
WHERE
  first_name LIKE 'A%'
  AND LENGTH(first_name) BETWEEN 3
  AND 5
ORDER BY
  name_length;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
first_name | name_length
------------+-------------
 Amy        |           3
 Ann        |           3
 Ana        |           3
 Andy       |           4
 Anna       |           4
 Anne       |           4
 Alma       |           4
 Adam       |           4
 Alan       |           4
 Alex       |           4
 Angel      |           5
...
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we use the `LENGTH()` function gets the number of characters of an input string.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 7) Using the WHERE clause with the not equal operator (&lt;>) example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example finds customers whose first names start with `Bra` and last names are not `Motley`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE 'Bra%'
  AND last_name <> 'Motley';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 first_name | last_name
------------+-----------
 Brandy     | Graves
 Brandon    | Huey
 Brad       | Mccurdy
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that you can use the `!=` operator and `<>` operator interchangeably because they are equivalent.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use a `WHERE` clause in the `SELECT` statement to filter rows of a query based on one or more conditions.
- <!-- /wp:list-item -->

<!-- /wp:list -->
