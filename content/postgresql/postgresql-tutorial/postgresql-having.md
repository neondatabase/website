---
title: 'PostgreSQL HAVING'
page_title: 'PostgreSQL HAVING'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL HAVING clause to filter groups of rows based on a specified condition.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-having/'
ogImage: '/postgresqltutorial/postgresql-having.svg'
updatedOn: '2024-01-17T08:04:37+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL GROUP BY'
  slug: 'postgresql-tutorial/postgresql-group-by'
nextLink:
  title: 'PostgreSQL UNION'
  slug: 'postgresql-tutorial/postgresql-union'
---

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL HAVING** clause to specify a search condition for a group or an aggregate.

## Introduction to PostgreSQL HAVING clause

The `HAVING` clause specifies a search condition for a group. The `HAVING` clause is often used with the [`GROUP BY`](postgresql-group-by) clause to filter groups based on a specified condition.

The following statement illustrates the basic syntax of the `HAVING` clause:

```sql
SELECT
  column1,
  aggregate_function (column2)
FROM
  table_name
GROUP BY
  column1
HAVING
  condition;
```

In this syntax:

- First, the `GROUP BY` clause groups rows into groups by the values in the `column1`.
- Then, the `HAVING` clause filters the groups based on the `condition`.

If a group satisfies the specified condition, the `HAVING` clause will include it in the result set.

Besides the `GROUP BY` clause, you can also include other clauses such as [`JOIN`](postgresql-joins) and [`LIMIT`](postgresql-limit) in the statement that uses the `HAVING` clause.

PostgreSQL evaluates the `HAVING` clause after the `FROM`, [`WHERE`](postgresql-where), [`GROUP BY`](postgresql-group-by), and before the [`DISTINCT`](postgresql-select-distinct), [`SELECT`](postgresql-select), [`ORDER BY`](postgresql-order-by) and [`LIMIT`](postgresql-limit) clauses:

![](/postgresqltutorial/postgresql-having.svg)
Because PostgreSQL evaluates the `HAVING` clause before the `SELECT` clause, you cannot use the column aliases in the `HAVING` clause.

This restriction arises from the fact that, at the point of `HAVING` clause evaluation, the column aliases specified in the `SELECT` clause are not yet available.

### HAVING vs. WHERE

The [`WHERE`](postgresql-where) clause filters the rows based on a specified condition whereas the `HAVING` clause filter groups of rows according to a specified condition.

In other words, you apply the condition in the `WHERE` clause to the rows while you apply the condition in the `HAVING` clause to the groups of rows.

## PostgreSQL HAVING clause examples

Let’s take a look at the `payment` table in the [sample database](../postgresql-getting-started/postgresql-sample-database 'PostgreSQL Sample Database'):

![payment](/postgresqltutorial/payment.png)

### 1\) Using PostgreSQL HAVING clause with SUM function example

The following query uses the [`GROUP BY`](postgresql-group-by) clause with the [`SUM()`](../postgresql-aggregate-functions/postgresql-sum-function) function to find the total payment of each customer:

```sql
SELECT
  customer_id,
  SUM (amount) amount
FROM
  payment
GROUP BY
  customer_id
ORDER BY
  amount DESC;
```

Output:

```sql
 customer_id | amount
-------------+--------
         148 | 211.55
         526 | 208.58
         178 | 194.61
         137 | 191.62
...
```

The following statement adds the `HAVING`clause to select the only customers who have been spending more than `200`:

```
SELECT
  customer_id,
  SUM (amount) amount
FROM
  payment
GROUP BY
  customer_id
HAVING
  SUM (amount) > 200
ORDER BY
  amount DESC;
```

Output:

```sql
 customer_id | amount
-------------+--------
         148 | 211.55
         526 | 208.58
(2 rows)
```

### 2\) PostgreSQL HAVING clause with COUNT example

See the following `customer` table from the [sample database](../postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial/customer-table.png)
The following query uses the `GROUP BY` clause to find the number of customers per store:

```
SELECT
  store_id,
  COUNT (customer_id)
FROM
  customer
GROUP BY
  store_id
```

Output:

```sql
 store_id | count
----------+-------
        1 |   326
        2 |   273
(2 rows)
```

The following statement adds the `HAVING` clause to select a store that has more than 300 customers:

```
SELECT
  store_id,
  COUNT (customer_id)
FROM
  customer
GROUP BY
  store_id
HAVING
  COUNT (customer_id) > 300;
```

Output:

```
 store_id | count
----------+-------
        1 |   326
(1 row)
```

## Summary

- Use the `HAVING` clause to specify the filter condition for groups returned by the `GROUP BY` clause.
