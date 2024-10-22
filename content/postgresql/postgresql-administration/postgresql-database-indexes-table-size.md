---
title: "How to Get Sizes of Database Objects in PostgreSQL"
page_title: "How to Get Sizes of Database Objects in PostgreSQL"
page_description: "This tutorial shows you how to get the sizes of database objects including databases, tables, indexes, tablespaces, and values."
prev_url: "https://www.postgresqltutorial.com/postgresql-administration/postgresql-database-indexes-table-size/"
ogImage: ""
updatedOn: "2024-02-19T04:10:36+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Copy Database Made Easy"
  slug: "postgresql-administration/postgresql-copy-database"
next_page: 
  title: "How to Change the Owner of a PostgreSQL Database"
  slug: "postgresql-administration/postgres-change-database-owner"
---




**Summary**: in this tutorial, you will learn how to get the sizes of database objects including databases, tables, indexes, tablespaces, and values.


## Getting PostgreSQL table sizes

To get the size of a specific table, you use the `pg_relation_size()` function. For example, you can get the size of the `actor` table in the `dvdrental` [sample database](../postgresql-getting-started/postgresql-sample-database) as follows:


```sql
select pg_relation_size('actor');
```
The `pg_relation_size()` function returns the size of a specific table in bytes:


```sql
pg_relation_size
------------------
            16384

```
To make the result more human\-readable, you use the `pg_size_pretty()` function.

The `pg_size_pretty()` function formats a number using bytes, kB, MB, GB, or TB appropriately. For example:


```sql
SELECT
    pg_size_pretty (pg_relation_size('actor')) size;
```
The following is the output in kB


```sql
 size
-------
 16 kB
(1 row)
```
Note that the `pg_relation_size()` function returns the size of the table only, not including indexes or additional objects.

To get the total size of a table, you use the `pg_total_relation_size()` function. For example, the following statement uses the `pg_total_relation_size()` to retrieve the total size of the `actor` table:


```sql
SELECT
    pg_size_pretty (
        pg_total_relation_size ('actor')
    ) size;
```
The following shows the output:


```sql
 size
-------
 72 kB
(1 row)
```
You can use the `pg_total_relation_size()` function to find the size of the biggest tables including indexes.

For example, the following query returns the top 5 biggest tables in the `dvdrental` database:


```sql
SELECT
    relname AS "relation",
    pg_size_pretty (
        pg_total_relation_size (C .oid)
    ) AS "total_size"
FROM
    pg_class C
LEFT JOIN pg_namespace N ON (N.oid = C .relnamespace)
WHERE
    nspname NOT IN (
        'pg_catalog',
        'information_schema'
    )
AND C .relkind <> 'i'
AND nspname !~ '^pg_toast'
ORDER BY
    pg_total_relation_size (C .oid) DESC
LIMIT 5;
```
Here is the output:


```sql
  relation  | total_size
------------+------------
 rental     | 2352 kB
 payment    | 1816 kB
 film       | 936 kB
 film_actor | 488 kB
 inventory  | 440 kB
(5 rows)
```

## Getting PostgreSQL database sizes

To get the size of the whole database, you use the `pg_database_size()` function. For example, the following statement returns the size of the `dvdrental` database:


```sql
SELECT
    pg_size_pretty (
        pg_database_size ('dvdrental')
    ) size;
```
The statement returns the following result:


```sql
 size
-------
 15 MB
(1 row)

```
To get the size of each database in the current database server, you use the following statement:


```sql
SELECT
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database;
```
Output:


```sql
  datname  |  size
-----------+---------
 postgres  | 8452 kB
 template1 | 7892 kB
 template0 | 7681 kB
 dvdrental | 15 MB
(4 rows)
```

## Getting PostgreSQL index sizes

To get the total size of all indexes attached to a table, you use the `pg_indexes_size()` function.

The `pg_indexes_size()` function accepts the OID or table name as the argument and returns the total disk space used by all indexes attached to that table.

For example, to get the total size of all indexes attached to the `film` table, you use the following statement:


```
SELECT
    pg_size_pretty (pg_indexes_size('actor')) size;
```
Here is the output:


```sql
 size
-------
 32 kB
(1 row)
```

## Getting PostgreSQL tablespace sizes

To get the size of a tablespace, you use the `pg_tablespace_size()` function.

The `pg_tablespace_size()` function accepts a tablespace name and returns the size in bytes. For example, the following statement returns the size of the `pg_default` tablespace:


```sql
SELECT
    pg_size_pretty (
        pg_tablespace_size ('pg_default')
    ) size;
```
Output:


```sql
 size
-------
 48 MB
(1 row)
```

## Getting PostgreSQL value sizes

To find how much space is needed to store a specific value, you use the pg\_column\_size() function, for example:


```sql
SELECT
  pg_column_size(5 :: smallint) smallint_size, 
  pg_column_size(5 :: int) int_size, 
  pg_column_size(5 :: bigint) bigint_size;
```
Output:


```sql
 smallint_size | int_size | bigint_size
---------------+----------+-------------
             2 |        4 |           8
(1 row)
```

## Summary

* Use the `pg_size_pretty()` function to format the size.
* Use the `pg_relation_size()` function to get the size of a table.
* Use the `pg_total_relation_size()` function to get the total size of a table.
* Use the `pg_database_size()` function to get the size of a database.
* Use the `pg_indexes_size()` function to get the size of an index.
* Use the `pg_total_index_size()` function to get the size of all indexes on a table.
* Use the `pg_tablespace_size()` function to get the size of a tablespace.
* Use the `pg_column_size()` function to obtain the size of a column of a specific type.

