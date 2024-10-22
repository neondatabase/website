---
title: "PostgreSQL CREATE INDEX Statement"
page_title: "PostgreSQL CREATE INDEX Statement"
page_description: "In this tutorial, you will learn how to use the PostgreSQL CREATE INDEX statement to create a new index for a table."
prev_url: "https://www.postgresqltutorial.com/postgresql-indexes/postgresql-create-index/"
ogImage: "/postgresqltutorial/address.png"
updatedOn: "2024-02-28T13:06:03+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Indexes"
  slug: "postgresql-indexes/"
next_page: 
  title: "PostgreSQL UNIQUE Index"
  slug: "postgresql-indexes/postgresql-unique-index"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE INDEX` statement to define a new index for a table.


## Introduction to PostgreSQL CREATE INDEX statement

An index is a separate data structure that enhances the speed of data retrieval from a table, at the cost of additional writes and storage required to maintain it.

An index allows you to improve the query performance when using it appropriately, especially on large tables.

To create an index on one or more columns of a table, you use the `CREATE INDEX` statement.

Here’s the basic syntax of the `CREATE INDEX` statement:


```phpsql
CREATE INDEX [IF NOT EXISTS] index_name
ON table_name(column1, column2, ...);
```
In this syntax:

* First, specify the index name after the `CREATE INDEX` clause.
* Second, use the `IF NOT EXISTS` option to prevent an error if the index already exists.
* Third, provide the table name to which the index belongs.
* Finally, list out one or more indexed columns inside the () after the table name.

Note that the syntax of the `CREATE INDEX` statement is more complex than this. We’ll cover additional features of the `CREATE INDEX` statement in the upcoming tutorials such as [unique indexes](postgresql-unique-index), [indexes on expressions](postgresql-index-on-expression), [partial indexes](postgresql-partial-index), and [multicolumn indexes](postgresql-multicolumn-indexes).

By default, the `CREATE INDEX` statement creates a B\-tree index, which is appropriate for most cases. We’ll show you how to create other [index types](postgresql-index-types).


## PostgreSQL CREATE INDEX statement example

We’ll use the `address` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration:


![address table](/postgresqltutorial/address.png)
First, [connect to the PostgreSQL](../postgresql-getting-started/connect-to-postgresql-database) `dvdrental` [sample database](../postgresql-getting-started/postgresql-sample-database) using `psql`:


```sql
psql -U postgres -d dvdrental
```
Second, execute the following [query](../postgresql-tutorial/postgresql-select) to find the address whose phone number is `223664661973`:


```
SELECT 
  address_id, 
  address, 
  district, 
  phone 
FROM 
  address 
WHERE 
  phone = '223664661973';
```
Output:


```sql
 address_id |      address       | district  |    phone
------------+--------------------+-----------+--------------
         85 | 320 Baiyin Parkway | Mahajanga | 223664661973
(1 row)
```
To find the row whose value in the `phone` column is `223664661973`, PostgreSQL must scan the entire `address` table.

Third, show the query plan using the following `EXPLAIN` statement::


```
EXPLAIN SELECT 
  address_id, 
  address, 
  district, 
  phone 
FROM 
  address 
WHERE 
  phone = '223664661973';
```
Here is the output:


```sql
                       QUERY PLAN
---------------------------------------------------------
 Seq Scan on address  (cost=0.00..15.54 rows=1 width=45)
   Filter: ((phone)::text = '223664661973'::text)
(2 rows)
```
The output indicates that the query optimizer has to perform a sequential scan on the `address` table.

Fourth, [create an index](postgresql-create-index) for the values in the `phone` column of the `address` table using the `CREATE INDEX` statement:


```php
CREATE INDEX idx_address_phone 
ON address(phone);
```
When you run the `CREATE INDEX` statement, PostgreSQL scans the `address` table, extracts data from the `phone` column, and inserts it into the index `idx_address_phone`.

This process is called an index build. By default, PostgreSQL allows reads from the `address` table and blocks write operations while building the index.

Fifth, [show the indexes](postgresql-list-indexes) that belong to the `address` table from the `pg_indexes`:


```sql
SELECT 
  indexname, 
  indexdef 
FROM 
  pg_indexes 
WHERE 
  tablename = 'address';
```
Output:


```sql
     indexname     |                                  indexdef
-------------------+-----------------------------------------------------------------------------
 address_pkey      | CREATE UNIQUE INDEX address_pkey ON public.address USING btree (address_id)
 idx_fk_city_id    | CREATE INDEX idx_fk_city_id ON public.address USING btree (city_id)
 idx_address_phone | CREATE INDEX idx_address_phone ON public.address USING btree (phone)
(3 rows)
```
The output shows that the `idx_address_phone` has been created successfully.

Two other indexes `address_pkey` and `idx_fk_city_id` were created implicitly when the `address` table was created.

More specifically, the `address_pkey` index was created for the [primary key](../postgresql-tutorial/postgresql-primary-key) column `address_id` and `idx_fk_city_id` was created for the [foreign key](../postgresql-tutorial/postgresql-foreign-key) city\_id column.

Fifth, execute the following query again:


```php
EXPLAIN SELECT 
  address_id, 
  address, 
  district, 
  phone 
FROM 
  address 
WHERE 
  phone = '223664661973';
```
Output:


```
                                    QUERY PLAN
----------------------------------------------------------------------------------
 Index Scan using idx_address_phone on address  (cost=0.28..8.29 rows=1 width=45)
   Index Cond: ((phone)::text = '223664661973'::text)
(2 rows)
```
The output indicates that PostgreSQL uses the index `idx_address_phone` for the lookup.


## Summary

* Use the `CREATE INDEX` statement to create an index.
* Use the `EXPLAIN` statement to explain a query.

