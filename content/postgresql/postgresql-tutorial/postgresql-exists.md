---
title: 'PostgreSQL EXISTS Operator'
page_title: 'PostgreSQL EXISTS Operator'
page_description: 'This tutorial shows you how to use the PostgreSQL EXISTS operator to check the existence of rows in the subquery.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-exists/'
ogImage: '/postgresqltutorial/customer-and-payment-tables.png'
updatedOn: '2024-07-01T01:05:42+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL ALL Operator'
  slug: 'postgresql-tutorial/postgresql-all'
nextLink:
  title: 'PostgreSQL CTE'
  slug: 'postgresql-tutorial/postgresql-cte'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `EXISTS` operator to test for the existence of rows in a subquery.

## Introduction to PostgreSQL EXISTS operator

The `EXISTS` operator is a boolean operator that checks the existence of rows in a [subquery](postgresql-subquery).

Here’s the basic syntax of the `EXISTS` operator:

```sql
EXISTS (subquery)
```

Typically, you use the `EXISTS` operator in the [`WHERE`](postgresql-where) clause of a `SELECT` statement:

```
SELECT
  select_list
FROM
  table1
WHERE
  EXISTS(
    SELECT
      select_list
    FROM
      table2
    WHERE
      condition
  );
```

If the subquery returns at least one row, the `EXISTS` operator returns `true`. If the subquery returns no row, the `EXISTS` returns `false`.

Note that if the subquery returns `NULL`, the `EXISTS` operator returns `true`.

The result of `EXISTS` operator depends on whether any row is returned by the subquery, and not on the row contents. Therefore, columns that appear in the `select_list` of the subquery are not important.

For this reason, the common coding convention is to write `EXISTS` in the following form:

```sql
SELECT
  select_list
FROM
  table1
WHERE
  EXISTS(
    SELECT
      1
    FROM
      table2
    WHERE
      condition
  );
```

To negate the `EXISTS` operator, you use the `NOT EXISTS` operator:

```sql
NOT EXISTS (subquery)
```

The `NOT EXISTS` operator returns `true` if the subquery returns no row or `false` if the subquery returns at least one row.

In practice, you often use the `EXISTS` operator in conjunction with the [correlated subqueries](postgresql-correlated-subquery).

## PostgreSQL EXISTS examples

We will use the following `customer` and `payment` tables in the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration:

![customer and payment tables](/postgresqltutorial/customer-and-payment-tables.png)

### 1\) Basic EXISTS operator example

The following example uses the `EXISTS` operator to check if the payment value is zero exists in the `payment` table:

```
SELECT
  EXISTS(
    SELECT
      1
    FROM
      payment
    WHERE
      amount = 0
  );
```

Output:

```text
 exists
--------
 t
(1 row)
```

### 2\) Using the EXISTS operator to check the existence of a row

The following example uses the `EXISTS` operator to find customers who have paid at least one rental with an amount greater than 11:

```
SELECT
  first_name,
  last_name
FROM
  customer c
WHERE
  EXISTS (
    SELECT
      1
    FROM
      payment p
    WHERE
      p.customer_id = c.customer_id
      AND amount > 11
  )
ORDER BY
  first_name,
  last_name;
```

The query returns the following output:

```text
 first_name | last_name
------------+-----------
 Karen      | Jackson
 Kent       | Arsenault
 Nicholas   | Barfield
 Rosemary   | Schmidt
 Tanya      | Gilbert
 Terrance   | Roush
 Vanessa    | Sims
 Victoria   | Gibson
(8 rows)
```

In this example, for each customer in the `customer` table, the subquery checks the `payment` table to find if that customer made at least one payment (`p.customer_id = c.customer_id`) and the amount is greater than 11 ( `amount > 11`)

### 2\) NOT EXISTS example

The following example uses the `NOT EXISTS` operator to find customers who have not made any payment more than 11\.

```
SELECT
  first_name,
  last_name
FROM
  customer c
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      payment p
    WHERE
      p.customer_id = c.customer_id
      AND amount > 11
  )
ORDER BY
  first_name,
  last_name;
```

Here is the output:

```sql
first_name  |  last_name
-------------+--------------
 Aaron       | Selby
 Adam        | Gooch
 Adrian      | Clary
 Agnes       | Bishop
 Alan        | Kahn
...
```

### 3\) EXISTS and NULL example

The following example returns all rows from the `customers` table because the subquery in the `EXISTS` operator returns `NULL`:

```sql
SELECT
  first_name,
  last_name
FROM
  customer
WHERE
  EXISTS(
    SELECT NULL
  )
ORDER BY
  first_name,
  last_name;
```

Output:

```
first_name  |  last_name
-------------+--------------
 Aaron       | Selby
 Adam        | Gooch
 Adrian      | Clary
 Agnes       | Bishop
...
```

## Summary

- Use the PostgreSQL `EXISTS` to check the existence of rows in a subquery.
