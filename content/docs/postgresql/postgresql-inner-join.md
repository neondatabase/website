---
title: 'PostgreSQL INNER JOIN'
redirectFrom:
  - /docs/postgresql/postgresql-tutorial/postgresql-inner-join
ogImage: /postgresqltutorial_data/wp-content-uploads-2018-12-PostgreSQL-Join-Inner-Join.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to select data from multiple tables using the **PostgreSQL INNER JOIN** clause.

## Introduction to PostgreSQL INNER JOIN clause

In a relational database, data is typically distributed across multiple tables. To retrieve comprehensive data, you often need to query it from multiple tables.

In this tutorial, we are focusing on how to retrieve data from multiple tables using the `INNER JOIN` clause.

Here is the generic syntax for the `INNER JOIN` clause that joins two tables:

```
SELECT
  select_list
FROM
  table1
INNER JOIN table2
  ON table1.column_name = table2.column_name;
```

In this syntax:

- First, specify the columns from both tables in the select list of the `SELECT` clause.
- Second, specify the main table (`table1`) from which you want to select data in the `FROM` clause.
- Third, specify the second table (`table2`) you want to join using the `INNER JOIN` keyword.
- Finally, define a condition for the join. This condition indicates which column (`column_name`) in each table should have matching values for the join.

To make the query shorter, you can use [table aliases](/docs/postgresql/postgresql-alias):

```
SELECT
  select_list
FROM
  table1 t1
INNER JOIN table2 t2
    ON t1.column_name = t2.column_name;
```

In this syntax, we first assign `t1` and `t2` as the table aliases for `table1` and `table2`. Then, we use the table aliases to qualify the columns of each table.

If the columns for matching share the same name, you can use the `USING` syntax:

```
SELECT
  select_list
FROM
  table1 t1
INNER JOIN table2 t2 USING(column_name);
```

### How the INNER JOIN works

For each row in the `table1`, the inner join compares the value in the `column_name` with the value in the corresponding column of every row in the `table2`.

When these values are equal, the inner join creates a new row that includes all columns from both tables and adds this row to the result set.

Conversely, if these values are not equal, the inner join disregards the current pair and proceeds to the next row, repeating the matching process.

The following Venn diagram illustrates how `INNER JOIN` clause works.

![PostgreSQL Join - Inner Join](/postgresqltutorial_data/wp-content-uploads-2018-12-PostgreSQL-Join-Inner-Join.png)

## PostgreSQL INNER JOIN examples

Let's take some examples of using the `INNER JOIN` clause.

### 1) Using PostgreSQL INNER JOIN to join two tables

Let's take a look at the `customer`and `payment` tables in the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database).

![customer and payment tables](/postgresqltutorial_data/wp-content-uploads-2013-05-customer-and-payment-tables.png)

In this schema, whenever a customer makes a payment, a new row is inserted into the `payment` table. While each customer may have zero or many payments, each payment belongs to one and only one customer. The `customer_id` column serves as the link establishing the relationship between the two tables.

The following statement uses the `INNER JOIN` clause to select data from both tables:

```
SELECT
  customer.customer_id,
  customer.first_name,
  customer.last_name,
  payment.amount,
  payment.payment_date
FROM
  customer
  INNER JOIN payment ON payment.customer_id = customer.customer_id
ORDER BY
  payment.payment_date;
```

Output:

```
 customer_id | first_name  |  last_name   | amount |        payment_date
-------------+-------------+--------------+--------+----------------------------
         416 | Jeffery     | Pinson       |   2.99 | 2007-02-14 21:21:59.996577
         516 | Elmer       | Noe          |   4.99 | 2007-02-14 21:23:39.996577
         239 | Minnie      | Romero       |   4.99 | 2007-02-14 21:29:00.996577
         592 | Terrance    | Roush        |   6.99 | 2007-02-14 21:41:12.996577
          49 | Joyce       | Edwards      |   0.99 | 2007-02-14 21:44:52.996577
...
```

To make the query shorter, you can use the table aliases:

```
SELECT
  c.customer_id,
  c.first_name,
  c.last_name,
  p.amount,
  p.payment_date
FROM
  customer c
  INNER JOIN payment p ON p.customer_id = c.customer_id
ORDER BY
  p.payment_date;
```

Since both tables have the same `customer_id` column, you can use the `USING` syntax:

```
SELECT
  customer_id,
  first_name,
  last_name,
  amount,
  payment_date
FROM
  customer
  INNER JOIN payment USING(customer_id)
ORDER BY
  payment_date;
```

### 2) Using PostgreSQL INNER JOIN to join three tables

The following diagram below illustrates the relationship between three tables: `staff`, `payment`, and `customer`:

![customer, payment and staff tables](/postgresqltutorial_data/wp-content-uploads-2013-05-customer-payment-staff-tables.png)

Each staff member can handle zero or multiple payments, with each payment being processed by one and only one staff member.

Similarly, each customer can make zero or multiple payments, and each payment is associated with a single customer.

The following example uses `INNER JOIN` clauses to retrieve data from three tables

```
SELECT
  c.customer_id,
  c.first_name || ' ' || c.last_name customer_name,
  s.first_name || ' ' || s.last_name staff_name,
  p.amount,
  p.payment_date
FROM
  customer c
  INNER JOIN payment p USING (customer_id)
  INNER JOIN staff s using(staff_id)
ORDER BY
  payment_date;
```

Output:

```
 customer_id |     customer_name     |  staff_name  | amount |        payment_date
-------------+-----------------------+--------------+--------+----------------------------
         416 | Jeffery Pinson        | Jon Stephens |   2.99 | 2007-02-14 21:21:59.996577
         516 | Elmer Noe             | Jon Stephens |   4.99 | 2007-02-14 21:23:39.996577
         239 | Minnie Romero         | Mike Hillyer |   4.99 | 2007-02-14 21:29:00.996577
         592 | Terrance Roush        | Jon Stephens |   6.99 | 2007-02-14 21:41:12.996577
          49 | Joyce Edwards         | Mike Hillyer |   0.99 | 2007-02-14 21:44:52.996577
...
```

## Summary

- Use `INNER JOIN` clauses to select data from two or more related tables and return rows that have matching values in all tables.
