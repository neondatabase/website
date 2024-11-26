---
title: 'PostgreSQL WHERE'
page_title: 'PostgreSQL WHERE: Filtering Rows of a Query'
page_description: 'In this tutorial, you’ll learn how to use PostgreSQL WHERE clause to filter rows returned from the SELECT statement.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-where/'
ogImage: '/postgresqltutorial/PostgreSQL-WHERE.png'
updatedOn: '2024-01-16T10:02:38+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL SELECT DISTINCT'
  slug: 'postgresql-tutorial/postgresql-select-distinct'
nextLink:
  title: 'PostgreSQL AND Operator'
  slug: 'postgresql-tutorial/postgresql-and'
---

**Summary**: in this tutorial, you will learn how to use PostgreSQL `WHERE` clause to filter rows returned by a `SELECT` statement.

## Introduction to PostgreSQL WHERE clause

The [`SELECT`](postgresql-select) statement returns all rows from one or more columns in a table. To retrieve rows that satisfy a specified condition, you use a `WHERE` clause.

The syntax of the PostgreSQL `WHERE` clause is as follows:

```sql
SELECT
  select_list
FROM
  table_name
WHERE
  condition
ORDER BY
  sort_expression;
```

In this syntax, you place the `WHERE` clause right after the `FROM` clause of the `SELECT` statement.

The `WHERE` clause uses the `condition` to filter the rows returned from the `SELECT` clause.

The `condition` is a boolean expression that evaluates to true, false, or unknown.

The query returns only rows that satisfy the `condition` in the `WHERE` clause. In other words, the query will include only rows that cause the `condition` to evaluate to true in the result set.

PostgreSQL evaluates the `WHERE` clause after the `FROM` clause but before the `SELECT` and `ORDER BY` clause:

![](/postgresqltutorial/PostgreSQL-WHERE.png)If you use [column aliases](postgresql-column-alias) in the `SELECT` clause, you cannot use them in the `WHERE` clause.

Besides the `SELECT` statement, you can use the `WHERE` clause in the [`UPDATE`](postgresql-update) and [`DELETE`](postgresql-delete) statement to specify rows to update and delete.

To form the condition in the `WHERE` clause, you use comparison and logical operators:

| Operator                      | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| \=                            | Equal                                               |
| \>                            | Greater than                                        |
| \<                            | Less than                                           |
| \>\=                          | Greater than or equal                               |
| \<\=                          | Less than or equal                                  |
| \<\> or !\=                   | Not equal                                           |
| AND                           | Logical operator AND                                |
| OR                            | Logical operator OR                                 |
| [IN](postgresql-in)           | Return true if a value matches any value in a list  |
| [BETWEEN](postgresql-between) | Return true if a value is between a range of values |
| [LIKE](postgresql-like)       | Return true if a value matches a pattern            |
| [IS NULL](postgresql-is-null) | Return true if a value is NULL                      |
| NOT                           | Negate the result of other operators                |

## PostgreSQL WHERE clause examples

Let’s practice with some examples of using the `WHERE` clause.

We will use the `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for demonstration.

![customer table](/postgresqltutorial/customer.png)

### 1\)  Using WHERE clause with the equal (\=) operator example

The following statement uses the `WHERE` clause to find customers with the first name is `Jamie`:

```sql
SELECT
  last_name,
  first_name
FROM
  customer
WHERE
  first_name = 'Jamie';
```

Output:

```text
 last_name | first_name
-----------+------------
 Rice      | Jamie
 Waugh     | Jamie
(2 rows)
```

### 2\) Using the WHERE clause with the AND operator example

The following example uses a `WHERE` clause with the `AND` logical operator to find customers whose first name and last names are `Jamie` and `rice`:

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

Output:

```text
 last_name | first_name
-----------+------------
 Rice      | Jamie
(1 row)
```

### 3\) Using the WHERE clause with the OR operator example

The following example uses a WHERE clause with an OR operator to find the customers whose last name is `Rodriguez` or first name is `Adam`:

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

Output:

```text
 first_name | last_name
------------+-----------
 Laura      | Rodriguez
 Adam       | Gooch
(2 rows)
```

### 4\) Using the WHERE clause with the IN operator example

If you want to find a value in a list of values, you can use the [`IN`](postgresql-in) operator.

The following example uses the WHERE clause with the IN operator to find the customers with first names in the list Ann, Anne, and Annie:

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name IN ('Ann', 'Anne', 'Annie');
```

Output:

```text
 first_name | last_name
------------+-----------
 Ann        | Evans
 Anne       | Powell
 Annie      | Russell
(3 rows)
```

### 5\) Using the WHERE clause with the LIKE operator example

To find a string that matches a specified pattern, you use the [`LIKE`](postgresql-like) operator.

The following example uses the LIKE operator in the WHERE clause to find customers whose first names start with the word `Ann`:

```
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  first_name LIKE 'Ann%';
```

Output:

```text
 first_name | last_name
------------+-----------
 Anna       | Hill
 Ann        | Evans
 Anne       | Powell
 Annie      | Russell
 Annette    | Olson
(5 rows)
```

The `%` is called a wildcard that matches any string. The `'Ann%'` pattern matches any strings that start with `'Ann'`.

### 6\) Using the WHERE clause with the BETWEEN operator example

The following example finds customers whose first names start with the letter `A` and contains 3 to 5 characters by using the [`BETWEEN`](postgresql-between) operator.

The `BETWEEN` operator returns true if a value is in a range of values.

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

Output:

```sql
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

In this example, we use the [`LENGTH()`](../postgresql-string-functions/postgresql-length-function) function gets the number of characters of an input string.

### 7\) Using the WHERE clause with the not equal operator (\<\>) example

This example finds customers whose first names start with `Bra` and last names are not `Motley`:

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

Output:

```
 first_name | last_name
------------+-----------
 Brandy     | Graves
 Brandon    | Huey
 Brad       | Mccurdy
(3 rows)
```

Note that you can use the `!=` operator and `<>` operator interchangeably because they are equivalent.

## Summary

- Use a `WHERE` clause in the `SELECT` statement to filter rows of a query based on one or more conditions.
