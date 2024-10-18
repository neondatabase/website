---
title: 'PostgreSQL Temporary Table'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-temporary-table/
ogImage: ./img/wp-content-uploads-2017-02-PostgreSQL-Temporary-Table-300x254.png
tableOfContents: true
---
<!-- wp:image {"align":"right","id":2595} -->

![PostgreSQL Temporary Table](./img/wp-content-uploads-2017-02-PostgreSQL-Temporary-Table-300x254.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL temporary table and how to manage it effectively.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL temporary tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a temporary table is a table that exists only during a database session. It is created and used within a single database session and is automatically dropped at the end of the session.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### Creating a temporary table

<!-- /wp:heading -->

<!-- wp:paragraph -->

To create a temporary table, you use the `CREATE TEMPORARY TABLE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE TEMPORARY TABLE table_name(
   column1 datatype(size) constraint,
   column1 datatype(size) constraint,
   ...,
   table_constraints
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, specify the name of the temporary table that you want to create after the `CREATE TEMPORARY TABLE` keywords.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, define a list of columns for the table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `TEMP` and `TEMPORARY` keywords are equivalent so you can use them interchangeably:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE TEMP TABLE table_name(
   ...
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following example uses the `CREATE TEMP TABLE` to create a new temporary table `mytemp`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TEMP TABLE mytemp(id INT);

INSERT INTO mytemp(id) VALUES(1), (2), (3)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id
----
  1
  2
  3
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you open a second database session and query data from the `mytemp` table, you'll get an error

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM mytemp;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Error:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ERROR:  relation "mytemp" does not exist
LINE 1: SELECT * FROM mytemp;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the second session could not see the `mytemp` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you terminate the current database session and attempt to query data from the `mytemp` table, you'll encounter an error. This is because the temporary table was dropped when the session that created it ended.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### PostgreSQL temporary table names

<!-- /wp:heading -->

<!-- wp:paragraph -->

A temporary table can have the same name as a permanent table, even though it is not recommended.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

When you create a temporary table that shares the same name as a permanent table, you cannot access the permanent table until the temporary table is removed. Consider the following example:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) named `customers`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE TABLE customers(
   id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a temporary table with the same name: `customers`

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
CREATE TEMP TABLE customers(
    customer_id INT
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Now, query data from the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT * FROM customers;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id
-------------
(0 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This time PostgreSQL accessed the temporary table `customers` instead of the permanent one.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Note that PostgreSQL creates temporary tables in a special [schema](https://www.postgresqltutorial.com/postgresql-administration/postgresql-schema/), therefore, you cannot specify the schema in the `CREATE TEMP TABLE` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you [list the tables](https://www.postgresqltutorial.com/postgresql-administration/postgresql-show-tables/) in psql, you will see the temporary table `customers` only, not the permanent one:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
\dt+
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
  Schema   |   Name    | Type  |  Owner   | Persistence | Access method |    Size    | Description
-----------+-----------+-------+----------+-------------+---------------+------------+-------------
 pg_temp_3 | customers | table | postgres | temporary   | heap          | 0 bytes    |
 pg_temp_3 | mytemp    | table | postgres | temporary   | heap          | 8192 bytes |
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output shows the schema of the `customers` temporary table is `pg_temp_3`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this case, access to the permanent table requires qualifying the table name with its schema. For example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM public.customers;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### Removing a PostgreSQL temporary table

<!-- /wp:heading -->

<!-- wp:paragraph -->

To drop a temporary table, you use the [`DROP TABLE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-drop-table/) statement. The following statement uses the `DROP TABLE` statement to drop a temporary table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
DROP TABLE temp_table_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Unlike the `CREATE TABLE` statement, the `DROP TABLE` statement does not have the `TEMP` or `TEMPORARY` keyword created specifically for temporary tables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, the following statement drops the temporary table `customers` that we have created in the above example:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
DROP TABLE customers;
```

<!-- /wp:code -->

<!-- wp:heading -->

## When to use temporary tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

**Isolation of data**: Since the temporary tables are session-specific, different sessions or transactions can use the same table name for temporary tables without causing a conflict. This allows you to isolate data for a specific task or session.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Intermediate storage**: Temporary tables can be useful for storing the intermediate results of a complex query. For example, you can break down a complex query into multiple simple ones and use temporary tables as the intermediate storage for storing the partial results.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

**Transaction scope**: Temporary tables can be also useful if you want to store intermediate results within a transaction. In this case, the temporary tables will be visible only to that transaction

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A temporary table is a short-lived table that exists during a database session or a transaction.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use `the CREATE TEMP TABLE` statement to create a temporary table.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `DROP TABLE` statement to drop a temporary table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
