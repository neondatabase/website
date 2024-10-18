---
title: 'PostgreSQL MERGE Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-merge/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MERGE` statement to conditionally insert, update, and delete rows of a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL MERGE statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

PostgreSQL 15 introduced the `MERGE` statement that simplifies data manipulation by combining `INSERT`, `UPDATE`, and `DELETE` operations into a single statement. The `MERGE` statement is often referred to as `UPSERT` statement.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

If you use an earlier version, you should consider the `INSERT... ON CONFLICT` statement

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `MERGE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE INTO target_table
USING source_query
ON merge_condition
WHEN MATCH [AND condition] THEN {merge_update | merge_delete | DO NOTHING }
WHEN NOT MATCHED [AND condition] THEN { merge_insert | DO NOTHING };
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `target_table` is the table you want to modify data (`INSERT`, `UPDATE`, and `DELETE`).
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `source_query` is a source table or a [SELECT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) statement that provides the data for the merge operation.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `ON merge_condition`: This clause specifies the conditions for matching rows between the source and target tables.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `WHEN MATCHED THEN`: This clause defines the statement on rows that match the merge condition. The condition provides additional conditions for performing either update or delete statements. If you don't want to do anything for the matching rows, you can use the `DO` `NOTHING` option.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `WHEN NOT MATCHED THEN`: This clause defines a statement on rows that don't match the merge condition. You can specify either insert statement to add a new row to the target table or use `DO` `NOTHING` to ignore the matching rows.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Please note that `merge_insert`, `merg_update`, and `merge_delete` statements are slightly different from the regular `INSERT`, `UPDATE`, and `DELETE` statements.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `merge_insert` is the `INSERT` statement without the table name:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT (column1, ...)
VALUES(value1,...);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `merge_update` statement is the `UPDATE` statement without the table name and `WHERE` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE SET
   column1 = value1,
   column2 =value2,
   ...;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `merge_delete` statement is the only `DELETE` keyword:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DELETE
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Once completed successfully, the `MERGE` statement returns the following command tag:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE total_count
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tag, the `total_acount` is the total number of rows inserted, updated, or deleted. If the `total_count` is zero, it means that no rows were changed.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `MERGE` statement can be useful for synchronizing data between tables, allowing you to efficiently keep a target table up-to-date with changes in a source table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL MERGE statement examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `MERGE` statement.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 0) Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create two tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `leads` and `customers`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE leads(
    lead_id serial PRIMARY key,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active bool NOT NULL DEFAULT TRUE
);
CREATE TABLE customers(
    customer_id serial PRIMARY key,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    active bool NOT NULL DEFAULT TRUE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

We'll use the `MERGE` statement to merge the data of the two tables.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using the PostgreSQL MERGE statement to insert rows from the source table into the table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [insert two rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `leads` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO leads(name, email)
VALUES
   ('John Doe', 'john.doe@gmail.com'),
   ('Jane Doe', 'jane.doe@yahoo.com')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 lead_id |   name   |       email        | active
---------+----------+--------------------+--------
       1 | John Doe | john.doe@gmail.com | t
       2 | Jane Doe | jane.doe@yahoo.com | t
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, insert rows from the `leads` table into the `customers` table using the `MERGE` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN
   INSERT (name, email)
   VALUES(l.name, l.email);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this statement, we use the `email` columns of the `leads` and `customers` tables for the merge condition.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `email` in the `leads` table does not match the `email` in `customers` table, the `MERGE` statement inserts a new row into the `customers` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE 2
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that two rows have been inserted successfully.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, retrieve data from the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM customers;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 customer_id |   name   |       email        | active
-------------+----------+--------------------+--------
           1 | John Doe | john.doe@gmail.com | t
           2 | Jane Doe | jane.doe@yahoo.com | t
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the MERGE statement to update and insert rows from the source table into the table

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `leads` table and [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/) the `name` of the row with id 2:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO leads(name, email)
VALUES('Alice Smith', 'alice.smith@outlook.com');

UPDATE leads
SET name = 'Jane Gate'
WHERE lead_id = 2;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve data from the `leads` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM leads
ORDER BY id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | john.doe@gmail.com      | t
       2 | Jane Gate   | jane.doe@yahoo.com      | t
       3 | Alice Smith | alice.smith@outlook.com | t
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `leads` table has a modified row with id 2 and a new row with id 3.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, add the new row from `leads` table to the `customers` table and update the `name` and `email` for the updated row:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN
   INSERT (name, email)
   VALUES(l.name, l.email)
WHEN MATCHED THEN
   UPDATE SET
      name = l.name,
      email = l.email;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This `MERGE` statement matches the `email` column, insert a new row into to the `customers` table, and updates existing rows in the `customers` table based on data from the `leads` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE 3
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that three rows have been modified:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Insert a new row.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Update two matching rows.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:heading {"level":3} -->

### 3) Using the MERGE statement to update, insert, and delete rows

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, insert a new row into the `leads` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO leads(name, email)
VALUES('Bob Climo', 'blob.climo@gmail.com');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, set the `active` of the lead id 2 to `false`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE leads
SET active = false
WHERE lead_id = 2;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, change the email of the lead id 1 to '`john.doe@hotmail.com`':

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE leads
SET email = 'john.doe@hotmail.com'
WHERE lead_id = 1;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, retrieve data from the `leads` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM leads
ORDER BY lead_id;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | john.doe@hotmail.com    | t
       2 | Jane Gate   | jane.doe@yahoo.com      | f
       3 | Alice Smith | alice.smith@outlook.com | t
       4 | Bob Climo   | blob.climo@gmail.com    | t
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, insert the new row from the `leads` table into the `customers` table, delete a row whose active is false from the `customers` table, and update the `name` and `email` for the row whose `active` is true:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN
   INSERT (name, email)
   VALUES(l.name, l.email)
WHEN MATCHED AND l.active = false THEN
   DELETE
WHEN MATCHED AND l.active = true THEN
   UPDATE SET
      name = l.name,
      email = l.email;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MERGE 4
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Finally, retrieve rows from the `customers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM customers;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 customer_id |    name     |          email          | active
-------------+-------------+-------------------------+--------
           1 | John Doe    | john.doe@gmail.com      | t
           3 | Alice Smith | alice.smith@outlook.com | t
           4 | Bob Climo   | blob.climo@gmail.com    | t
           5 | John Doe    | john.doe@hotmail.com    | t
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `MERGE` statement to conditionally insert, update, and delete rows of a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
