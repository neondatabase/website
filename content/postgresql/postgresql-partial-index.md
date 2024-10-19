---
title: 'PostgreSQL Partial Index'
redirectFrom: 
            - /postgresql/postgresql-indexes/postgresql-partial-index
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL partial index to create an index based on a subset of rows in a table based on specified conditions.

## Introduction to PostgreSQL partial index

When you [create an index](/postgresql/postgresql-indexes/postgresql-create-index) on a column of a table, PostgreSQL uses all the values from that column for building the index.

Sometimes, you may want to include only some values from the indexed column in the index. To do that you can use a partial index.

A partial index is an index built on a subset of data of the indexed columns.

To define a subset of data, you use a predicate, which is a conditional expression, of the partial index. PostgreSQL will build an index for rows that satisfy the predicate.

This partial index can enhance query performance while reducing the index size. It can also improve table updates because PostgreSQL does not need to maintain the index in all cases.

To create a partial index, you use the `CREATE INDEX` statement with a `WHERE` clause:

```sql
CREATE [IF NOT EXISTS] INDEX index_name
ON table_name(column1, column2, ...)
WHERE predicate;
```

In this syntax:

- First, specify the index name in the `CREATE INDEX`statement. Use the `IF NOT EXISTS` to prevent an error of creating an index that already exists.
- Second, provide the table name along with indexed columns in the `ON` clause.
- Third, use a predicate in the `WHERE` clause to specify the condition for rows to be included in the index.

## PostgreSQL partial index example

Let's take a look at the `customer` table from the [sample database](/postgresql/postgresql-getting-started/postgresql-sample-database):

![customer table](/postgresqltutorial_data/customer-table.png)

The active column has two values:

- 0: inactive
- 1: active

When querying data from the database, you often work with inactive customers, not active ones. For example, you may want to follow up with inactive customers to get them back to order more films.

To speed up the query that retrieves the inactive customer, you can create a partial index.

First, create a partial index on the `active` column of the customer table:

```sql
CREATE INDEX customer_active
ON customer(active)
WHERE active = 0;
```

Second, show the query plan that retrieves the inactive customers:

```sql
EXPLAIN SELECT
  *
FROM
  customer
WHERE
  active = 0;
```

Output:

```
                                    QUERY PLAN
-----------------------------------------------------------------------------------
 Index Scan using customer_active on customer  (cost=0.14..16.12 rows=15 width=70)
```

The partial index customer_active improves the query performance while including the only rows that are often searched.

## Summary

- Use PostgreSQL partial index to create an index that includes a subset of rows in a table specified by a condition.
