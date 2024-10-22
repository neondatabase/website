---
title: "PostgreSQL REINDEX"
page_title: "PostgreSQL REINDEX Explained"
page_description: "In this tutorial, you will learn how to use the PostgreSQL REINDEX statement to rebuild one or more indices."
prev_url: "https://www.postgresqltutorial.com/postgresql-indexes/postgresql-reindex/"
ogImage: ""
updatedOn: "2024-02-28T10:26:12+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL Multicolumn Indexes"
  slug: "postgresql-indexes/postgresql-multicolumn-indexes"
next_page: 
  title: "PostgreSQL DROP INDEX"
  slug: "postgresql-indexes/postgresql-drop-index"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REINDEX` statement to rebuild one or more indexes.


## Introduction to PostgreSQL REINDEX statement

In practice, an index can become corrupted and no longer contain valid data due to hardware failures or software bugs.

Additionally, when you create an index without the `CONCURRENTLY` option, the index may become invalid if the index build fails.

In such cases, you can rebuild the index. To rebuild the index, you can use the `REINDEX` statement as follows:


```plaintextsql
REINDEX [ ( option, ...) ] 
{ INDEX | TABLE | SCHEMA | DATABASE | SYSTEM }
name;
```
In this syntax:

The `option` can be one or more values:

* `VERBOSE [boolean]` – show the progress as each index is reindexed.
* `TABLESPACE new_tablespace` – specify the new tablespace on which the indexes will be rebuilt.
* `CONCURRENTLY` – rebuild the index without taking any locks. If not used, reindex will lock out writes but not reads on the table until it is completed.

To rebuild a single index, you specify the index name after `REINDEX INDEX` clause:


```sql
REINDEX INDEX index_name;
```
To rebuild all the indexes of a table, you use the `TABLE` keyword and specify the name of the table:


```sql
REINDEX TABLE table_name;
```
If you want to rebuild all indexes in a specific schema, you use the `SCHEMA` keyword followed by the schema name:


```sql
REINDEX SCHEMA schema_name;
```
To rebuild all indexes in a specific database, you specify the database name after the `REINDEX DATABASE` clause:


```sql
REINDEX DATABASE database_name;
```
The following statement recreates all indexes on system catalogs in a specific database:


```sql
REINDEX SYSTEM database_name;
```
The `name` specifies the name of an index, a table name, a schema, a database respectively.


## PostgreSQL REINDEX example

First, connect to the `dvdrental` database using the psql:


```sql
psql -U postgres -d dvdrental
```
Second, rebuild all indexes in the `film` table of the `dvdrental` database using the `REINDEX` statement:


```plaintext
REINDEX (verbose, concurrently)
TABLE film;
```
Output:


```sql
INFO:  index "public.film_pkey" was reindexed
INFO:  index "public.film_fulltext_idx" was reindexed
INFO:  index "public.idx_fk_language_id" was reindexed
INFO:  index "public.idx_title" was reindexed
INFO:  index "pg_toast.pg_toast_27937_index" was reindexed
INFO:  table "public.film" was reindexed
DETAIL:  CPU: user: 0.01 s, system: 0.01 s, elapsed: 0.37 s.
REINDEX
```
Since the statement uses the `VERBOSE` option, the `REINDEX` statement displays the progress report once an index is rebuilt successfully. Additionally, the `CONCURRENTLY` option instructs PostgreSQL to not use any locks while rebuilding the index.

Third, rebuild all indexes in the `dvdrental` database using the `REINDEX` statement:


```
REINDEX DATABASE dvdrental;
```
Output:


```sql
REINDEX
```

## REINDEX vs. DROP INDEX \& CREATE INDEX

The `REINDEX` statement rebuilds the index from scratch, which has a similar effect as dropping and recreating the index. However, the locking mechanisms between them are different.

The `REINDEX` statement:

* Lock write but not read from the table to which the index belongs.
* Take an exclusive lock on the index that is being processed, which blocks the read that attempts to use the index.

The `DROP INDEX` \& `CREATE INDEX` statements:

* First, the `DROP INDEX` locks both writes and reads of the table to which the index belongs by acquiring an exclusive lock on the table.
* Then, the subsequent `CREATE INDEX` statement locks out writes but not reads from the index’s parent table. However, reads might be expensive during the creation of the index.


## Summary

* Use the PostgreSQL `REINDEX` statement to drop and recreate one or more indexes.

