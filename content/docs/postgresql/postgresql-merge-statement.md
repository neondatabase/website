---
title: 'PostgreSQL MERGE Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-merge
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MERGE` statement to conditionally insert, update, and delete rows of a table.

## Introduction to the PostgreSQL MERGE statement

PostgreSQL 15 introduced the `MERGE` statement that simplifies data manipulation by combining `INSERT`, `UPDATE`, and `DELETE` operations into a single statement. The `MERGE` statement is often referred to as `UPSERT` statement.

If you use an earlier version, you should consider the `INSERT... ON CONFLICT` statement

Here's the syntax of the `MERGE` statement:

```
MERGE INTO target_table
USING source_query
ON merge_condition
WHEN MATCH [AND condition] THEN {merge_update | merge_delete | DO NOTHING }
WHEN NOT MATCHED [AND condition] THEN { merge_insert | DO NOTHING };
```

In this syntax:

- `target_table` is the table you want to modify data (`INSERT`, `UPDATE`, and `DELETE`).
-
- `source_query` is a source table or a [SELECT](/docs/postgresql/postgresql-select) statement that provides the data for the merge operation.
-
- `ON merge_condition`: This clause specifies the conditions for matching rows between the source and target tables.
-
- `WHEN MATCHED THEN`: This clause defines the statement on rows that match the merge condition. The condition provides additional conditions for performing either update or delete statements. If you don't want to do anything for the matching rows, you can use the `DO` `NOTHING` option.
-
- `WHEN NOT MATCHED THEN`: This clause defines a statement on rows that don't match the merge condition. You can specify either insert statement to add a new row to the target table or use `DO` `NOTHING` to ignore the matching rows.

Please note that `merge_insert`, `merg_update`, and `merge_delete` statements are slightly different from the regular `INSERT`, `UPDATE`, and `DELETE` statements.

The `merge_insert` is the `INSERT` statement without the table name:

```
INSERT (column1, ...)
VALUES(value1,...);
```

The `merge_update` statement is the `UPDATE` statement without the table name and `WHERE` clause:

```
UPDATE SET
   column1 = value1,
   column2 =value2,
   ...;
```

The `merge_delete` statement is the only `DELETE` keyword:

```
DELETE
```

Once completed successfully, the `MERGE` statement returns the following command tag:

```
MERGE total_count
```

In this tag, the `total_acount` is the total number of rows inserted, updated, or deleted. If the `total_count` is zero, it means that no rows were changed.

The `MERGE` statement can be useful for synchronizing data between tables, allowing you to efficiently keep a target table up-to-date with changes in a source table.

## PostgreSQL MERGE statement examples

Let's explore some examples of using the `MERGE` statement.

### 0) Setting up sample tables

First, [create two tables](/docs/postgresql/postgresql-create-table) called `leads` and `customers`:

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

We'll use the `MERGE` statement to merge the data of the two tables.

### 1) Using the PostgreSQL MERGE statement to insert rows from the source table into the table

First, [insert two rows](/docs/postgresql/postgresql-insert-multiple-rows) into the `leads` table:

```
INSERT INTO leads(name, email)
VALUES
   ('John Doe', 'john.doe@gmail.com'),
   ('Jane Doe', 'jane.doe@yahoo.com')
RETURNING *;
```

Output:

```
 lead_id |   name   |       email        | active
---------+----------+--------------------+--------
       1 | John Doe | john.doe@gmail.com | t
       2 | Jane Doe | jane.doe@yahoo.com | t
(2 rows)
```

Second, insert rows from the `leads` table into the `customers` table using the `MERGE` statement:

```
MERGE INTO customers c
USING leads l ON c.email = l.email
WHEN NOT MATCHED THEN
   INSERT (name, email)
   VALUES(l.name, l.email);
```

In this statement, we use the `email` columns of the `leads` and `customers` tables for the merge condition.

If the `email` in the `leads` table does not match the `email` in `customers` table, the `MERGE` statement inserts a new row into the `customers` table.

Output:

```
MERGE 2
```

The output indicates that two rows have been inserted successfully.

Third, retrieve data from the `customers` table:

```
SELECT * FROM customers;
```

Output:

```
 customer_id |   name   |       email        | active
-------------+----------+--------------------+--------
           1 | John Doe | john.doe@gmail.com | t
           2 | Jane Doe | jane.doe@yahoo.com | t
(2 rows)
```

### 2) Using the MERGE statement to update and insert rows from the source table into the table

First, [insert a new row](/docs/postgresql/postgresql-insert) into the `leads` table and [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update) the `name` of the row with id 2:

```
INSERT INTO leads(name, email)
VALUES('Alice Smith', 'alice.smith@outlook.com');

UPDATE leads
SET name = 'Jane Gate'
WHERE lead_id = 2;
```

Second, retrieve data from the `leads` table:

```
SELECT * FROM leads
ORDER BY id;
```

Output:

```
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | john.doe@gmail.com      | t
       2 | Jane Gate   | jane.doe@yahoo.com      | t
       3 | Alice Smith | alice.smith@outlook.com | t
(3 rows)
```

The `leads` table has a modified row with id 2 and a new row with id 3.

Third, add the new row from `leads` table to the `customers` table and update the `name` and `email` for the updated row:

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

This `MERGE` statement matches the `email` column, insert a new row into to the `customers` table, and updates existing rows in the `customers` table based on data from the `leads` table.

Output:

```
MERGE 3
```

The output indicates that three rows have been modified:

- Insert a new row.
-
- Update two matching rows.

### 3) Using the MERGE statement to update, insert, and delete rows

First, insert a new row into the `leads` table:

```
INSERT INTO leads(name, email)
VALUES('Bob Climo', 'blob.climo@gmail.com');
```

Second, set the `active` of the lead id 2 to `false`:

```
UPDATE leads
SET active = false
WHERE lead_id = 2;
```

Third, change the email of the lead id 1 to '`john.doe@hotmail.com`':

```
UPDATE leads
SET email = 'john.doe@hotmail.com'
WHERE lead_id = 1;
```

Fourth, retrieve data from the `leads` table:

```
SELECT * FROM leads
ORDER BY lead_id;
```

Output:

```
 lead_id |    name     |          email          | active
---------+-------------+-------------------------+--------
       1 | John Doe    | john.doe@hotmail.com    | t
       2 | Jane Gate   | jane.doe@yahoo.com      | f
       3 | Alice Smith | alice.smith@outlook.com | t
       4 | Bob Climo   | blob.climo@gmail.com    | t
(4 rows)
```

Fifth, insert the new row from the `leads` table into the `customers` table, delete a row whose active is false from the `customers` table, and update the `name` and `email` for the row whose `active` is true:

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

Output:

```
MERGE 4
```

Finally, retrieve rows from the `customers` table:

```
SELECT * FROM customers;
```

Output:

```
 customer_id |    name     |          email          | active
-------------+-------------+-------------------------+--------
           1 | John Doe    | john.doe@gmail.com      | t
           3 | Alice Smith | alice.smith@outlook.com | t
           4 | Bob Climo   | blob.climo@gmail.com    | t
           5 | John Doe    | john.doe@hotmail.com    | t
(4 rows)
```

## Summary

- Use the `MERGE` statement to conditionally insert, update, and delete rows of a table.
