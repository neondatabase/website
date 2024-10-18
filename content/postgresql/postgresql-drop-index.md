---
title: 'PostgreSQL DROP INDEX'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-indexes/postgresql-drop-index/
ogImage: ./img/wp-content-uploads-2018-12-actor.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP INDEX` statement to remove an existing index.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL DROP INDEX statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

Sometimes, you may want to remove an existing [index](https://www.postgresqltutorial.com/postgresql-indexes/) from the database system. To do it, you use the `DROP INDEX` statement as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP INDEX  [ CONCURRENTLY] [ IF EXISTS ]  index_name
[ CASCADE | RESTRICT ];
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### index_name

<!-- /wp:heading -->

<!-- wp:paragraph -->

You specify the name of the index that you want to remove after the `DROP INDEX` clause.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### IF EXISTS

<!-- /wp:heading -->

<!-- wp:paragraph -->

Attempting to remove a non-existent index will result in an error. To avoid this, you can use the `IF EXISTS` option. In case you remove a non-existent index with `IF EXISTS`, PostgreSQL issues a notice instead.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### CASCADE

<!-- /wp:heading -->

<!-- wp:paragraph -->

If the index has dependent objects, you use the `CASCADE` option to automatically drop these objects and all objects that depend on those objects.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### RESTRICT

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `RESTRICT` option instructs PostgreSQL to refuse to drop the index if any objects depend on it. The `DROP INDEX` uses `RESTRICT` by default.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Note that you can drop multiple indexes at a time by separating the indexes by commas (,):

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DROP INDEX index_name, index_name2,... ;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### CONCURRENTLY

<!-- /wp:heading -->

<!-- wp:paragraph -->

When you execute the `DROP INDEX` statement, PostgreSQL acquires an exclusive lock on the table and blocks other accesses until the index removal is completed.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To force the command to wait until the conflicting transaction completes before removing the index, you can use the `CONCURRENTLY` option.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `DROP INDEX CONCURRENTLY` has some limitations:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, the `CASCADE` option is not supported.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, executing in a transaction block is also not supported.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading -->

## PostgreSQL DROP INDEX example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `actor` table from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:image {"id":3716} -->

![actor](./img/wp-content-uploads-2018-12-actor.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The following statement [creates an index](https://www.postgresqltutorial.com/postgresql-indexes/postgresql-create-index/) for the `first_name` column of the `actor` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE INDEX idx_actor_first_name
ON actor (first_name);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sometimes, the query optimizer does not use the index. For example, the following statement finds the actor with the name `John`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM actor
WHERE first_name = 'John';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The query did not use the `idx_actor_first_name` index defined earlier as explained in the following `EXPLAIN` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
EXPLAIN SELECT *
FROM actor
WHERE first_name = 'John';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
                      QUERY PLAN
------------------------------------------------------
 Seq Scan on actor  (cost=0.00..4.50 rows=1 width=25)
   Filter: ((first_name)::text = 'John'::text)
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This is because the query optimizer thinks that it is more optimal to just scan the entire table to locate the row. Hence, the `idx_actor_first_name` is not useful in this case, you can remove it:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP INDEX idx_actor_first_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The statement removed the index as expected.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `DROP INDEX` statement to delete an index.
- <!-- /wp:list-item -->

<!-- /wp:list -->
