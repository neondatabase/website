---
title: "PostgreSQL DROP INDEX"
page_title: "PostgreSQL DROP INDEX Statement"
page_description: "This tutorial shows you step by step how to use the PostgreSQL DROP INDEX statement to remove an existing index."
prev_url: "https://www.postgresqltutorial.com/postgresql-indexes/postgresql-drop-index/"
ogImage: "/postgresqltutorial/actor.png"
updatedOn: "2024-02-28T10:30:19+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL REINDEX"
  slug: "postgresql-indexes/postgresql-reindex"
next_page: 
  title: "PostgreSQL List Indexes"
  slug: "postgresql-indexes/postgresql-list-indexes"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP INDEX` statement to remove an existing index.


## Introduction to PostgreSQL DROP INDEX statement

Sometimes, you may want to remove an existing index from the database system. To do it, you use the `DROP INDEX` statement as follows:


```phpsql
DROP INDEX  [ CONCURRENTLY] [ IF EXISTS ]  index_name
[ CASCADE | RESTRICT ];
```
In this syntax:


### index\_name

You specify the name of the index that you want to remove after the `DROP INDEX` clause.


### IF EXISTS

Attempting to remove a non\-existent index will result in an error. To avoid this, you can use the `IF EXISTS` option. In case you remove a non\-existent index with `IF EXISTS`, PostgreSQL issues a notice instead.


### CASCADE

If the index has dependent objects, you use the `CASCADE` option to automatically drop these objects and all objects that depend on those objects.


### RESTRICT

The `RESTRICT` option instructs PostgreSQL to refuse to drop the index if any objects depend on it. The `DROP INDEX` uses `RESTRICT` by default.

Note that you can drop multiple indexes at a time by separating the indexes by commas (,):


```sql
DROP INDEX index_name, index_name2,... ;
```

### CONCURRENTLY

When you execute the `DROP INDEX` statement, PostgreSQL acquires an exclusive lock on the table and blocks other accesses until the index removal is completed.

To force the command to wait until the conflicting transaction completes before removing the index, you can use the `CONCURRENTLY` option.

The `DROP INDEX CONCURRENTLY` has some limitations:

* First, the `CASCADE` option is not supported.
* Second, executing in a transaction block is also not supported.


## PostgreSQL DROP INDEX example

We will use the `actor` table from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.


![actor](/postgresqltutorial/actor.png)
The following statement [creates an index](postgresql-create-index) for the `first_name` column of the `actor` table:


```sql
CREATE INDEX idx_actor_first_name 
ON actor (first_name);
```
Sometimes, the query optimizer does not use the index. For example, the following statement finds the actor with the name `John`:


```sql
SELECT * FROM actor
WHERE first_name = 'John';
```
The query did not use the `idx_actor_first_name` index defined earlier as explained in the following [`EXPLAIN`](../postgresql-tutorial/postgresql-explain) statement:


```sql
EXPLAIN SELECT *
FROM actor
WHERE first_name = 'John';
```
Output:


```
                      QUERY PLAN
------------------------------------------------------
 Seq Scan on actor  (cost=0.00..4.50 rows=1 width=25)
   Filter: ((first_name)::text = 'John'::text)
(2 rows)

```
This is because the query optimizer thinks that it is more optimal to just scan the entire table to locate the row. Hence, the `idx_actor_first_name` is not useful in this case, you can remove it:


```
DROP INDEX idx_actor_first_name;
```
The statement removed the index as expected.


## Summary

* Use the PostgreSQL `DROP INDEX` statement to delete an index.

