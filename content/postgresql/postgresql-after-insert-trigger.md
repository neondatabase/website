---
title: 'PostgreSQL AFTER INSERT Trigger'
redirectFrom: 
            - /postgresql/postgresql-triggers/postgresql-after-insert-trigger
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to create a PostgreSQL `AFTER INSERT` trigger to call a function automatically after a row is inserted into a table.

## Introduction to the PostgreSQL AFTER INSERT trigger

In PostgreSQL, a trigger is a database object associated with a table, which is automatically fired in response to an `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` event.

An `AFTER INSERT` trigger is a trigger that is fired after an `INSERT` event occurs on a table.

The `AFTER INSERT` trigger can access the newly inserted data using the `NEW` record variable. This `NEW` variable allows you to access the values of columns in the inserted row:

```sql
NEW.column_name
```

Typically, you use `AFTER INSERT` triggers for logging changes, updating related tables, or sending notifications based on the inserted data.

To create an `AFTER` `INSERT` trigger, you follow these steps:

First, [define a function](/postgresql/postgresql-plpgsql/postgresql-create-function) that will execute when the trigger is activated:

```sql
CREATE OR REPLACE FUNCTION trigger_function()
   RETURNS TRIGGER
   LANGUAGE PLPGSQL
AS
$$
BEGIN
   -- trigger logic
   -- ...
   RETURN NEW;
END;
$$
```

The `RETURN NEW` statement indicates that the function returns the modified row, which is the `NEW` row.

Second, create an `AFTER` `INSERT` trigger and bind the function to it:

```sql
CREATE TRIGGER trigger_name
AFTER INSERT
ON table_name
FOR EACH {ROW | STATEMENT}
EXECUTE FUNCTION trigger_function();
```

## PostgreSQL AFTER INSERT trigger example

First, [create a new table](/postgresql/postgresql-create-table) called `members` to store the member data:

```sql
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);
```

The `members` table has three columns `id`, `name`, and `email`. The `id` column is a [serial](/postgresql/postgresql-serial) and [primary key](/postgresql/postgresql-tutorial/postgresql-primary-key) column. The `email` column has a unique constraint to ensure the uniqueness of emails.

Second, create another table called `memberships` to store the memberships of the members:

```sql
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id),
    membership_type VARCHAR(50) NOT NULL DEFAULT 'free'
);
```

The memberships table has three columns id, member_id, and membership_type:

- The `id` is a serial and primary key column.
-
- The `member_id` references the id column of the `members` table. It is a foreign key column.
-
- The `membership_type` column has a default value of "free".

Third, define a trigger function that inserts a default free membership for every member:

```sql
CREATE OR REPLACE FUNCTION create_membership_after_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO memberships (member_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Fourth, define an `AFTER` `INSERT` trigger on the `members` table, specifying that it should execute the `create_membership_after_insert()` function for each row inserted:

```sql
CREATE TRIGGER after_insert_member_trigger
AFTER INSERT ON members
FOR EACH ROW
EXECUTE FUNCTION create_membership_after_insert();
```

Fifth, [insert a new row](/postgresql/postgresql-insert) into the `members` table:

```sql
INSERT INTO members(name, email)
VALUES('John Doe', 'john.doe@gmail.com')
RETURNING *;
```

Output:

```
 id |   name   |       email
----+----------+--------------------
  1 | John Doe | john.doe@gmail.com
(1 row)
```

Sixth, retrieve data from the `memberships` table:

```sql
SELECT * FROM memberships;
```

Output:

```
 id | member_id | membership_type
----+-----------+-----------------
  1 |         1 | free
(1 row)
```

## Summary

- Use an `AFTER` `INSERT` trigger to call a function automatically after an `INSERT` operation successfully on the associated table.
