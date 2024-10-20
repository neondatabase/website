---
prevPost: postgresql-current_timestamp-function
nextPost: postgresql-first_value-function
createdAt: 2018-12-06T15:10:46.000Z
title: 'PostgreSQL Index on Expression'
redirectFrom: 
            - /postgresql/postgresql-indexes/postgresql-index-on-expression
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to leverage the PostgreSQL index on expression to improve the performance of queries that involve expressions.

## Introduction to PostgreSQL index on expression

In PostgreSQL, indexes play an important role in optimizing query performance.

Typically, you [create an index](/postgresql/postgresql-indexes/postgresql-create-index) that references one or more columns of a table.

PostgreSQL also allows you to create an index based on an expression involving table columns. This type of index is called an**index on expression**.

Note that the indexes on expressions are also known as functional indexes.

Here's the basic syntax for creating an index on expression:

```sql
CREATE INDEX index_name
ON table_name (expression);
```

In this statement:

- First, specify the index name in the `CREATE INDEX` clause.
- Then, form an expression that involves table columns of the `table_name` in the `ON` clause.

After defining an index expression, PostgreSQL will consider using that index when the expression appears in the `WHERE` clause or in the `ORDER BY` clause of the SQL statement.

Note that maintaining indexes on expressions can incur additional costs. PostgreSQL evaluates the expression for each row during [insertion](/postgresql/postgresql-insert) or [update](/postgresql/postgresql-tutorial/postgresql-update) and utilizes the result for building the index.

Therefore, it's recommended to use the indexes on expressions when prioritizing retrieval speed over insertion and update speed.

## PostgreSQL index on expression example

We'll use the `customer` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database).

![customer table](/postgresqltutorial_data/customer-table.png)

The `customer` table has a b-tree index defined for the `first_name` column.

First, retrieve the customers with the last names are `Purdy`:

```sql
SELECT
    customer_id,
    first_name,
    last_name
FROM
    customer
WHERE
    last_name = 'Purdy';
```

Output:

```
 customer_id | first_name | last_name
-------------+------------+-----------
         333 | Andrew     | Purdy
(1 row)
```

It returns one matching row.

Second, use the `EXPLAIN` statement to show the query plan:

```sql
EXPLAIN
SELECT
    customer_id,
    first_name,
    last_name
FROM
    customer
WHERE
    last_name = 'Purdy';
```

Output:

```
                                  QUERY PLAN
-------------------------------------------------------------------------------
 Index Scan using idx_last_name on customer  (cost=0.28..8.29 rows=1 width=17)
   Index Cond: ((last_name)::text = 'Purdy'::text)
(2 rows)
```

The output indicates that the query uses the `idx_last_name` index to improve the retrieval speed.

Third, find customers whose last name is `purdy` in lowercase:

```sql
EXPLAIN
SELECT
    customer_id,
    first_name,
    last_name
FROM
    customer
WHERE
    LOWER(last_name) = 'purdy';
```

Output:

```
                        QUERY PLAN
----------------------------------------------------------
 Seq Scan on customer  (cost=0.00..17.98 rows=3 width=17)
   Filter: (lower((last_name)::text) = 'purdy'::text)
(2 rows)
```

However, this time PostgreSQL could not utilize the index for lookup. To enhance the speed of the query, you can define an index on expression.

Fourth, define an index on expression using the `CREATE INDEX` statement:

```sql
CREATE INDEX idx_ic_last_name
ON customer(LOWER(last_name));
```

Finally, retrieve the customers based on a last name in lowercase:

```sql
EXPLAIN
SELECT
    customer_id,
    first_name,
    last_name
FROM
    customer
WHERE
    LOWER(last_name) = 'purdy';
```

Output:

```
                                  QUERY PLAN
-------------------------------------------------------------------------------
 Bitmap Heap Scan on customer  (cost=4.30..11.15 rows=3 width=17)
   Recheck Cond: (lower((last_name)::text) = 'purdy'::text)
   ->  Bitmap Index Scan on idx_ic_last_name  (cost=0.00..4.30 rows=3 width=0)
         Index Cond: (lower((last_name)::text) = 'purdy'::text)
(4 rows)
```

This time PostgreSQL uses the index on the expression `idx_ic_last_name` to quickly locate the matching rows in the `customer` table.

## Summary

- Use the PostgreSQL index on expression to improve queries that have an expression involving table columns.
