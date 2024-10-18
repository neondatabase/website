---
title: 'PostgreSQL AFTER INSERT Trigger'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-insert-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to create a PostgreSQL `AFTER INSERT` trigger to call a function automatically after a row is inserted into a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL AFTER INSERT trigger

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a trigger is a database object associated with a table, which is automatically fired in response to an `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` event.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

An `AFTER INSERT` trigger is a trigger that is fired after an `INSERT` event occurs on a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `AFTER INSERT` trigger can access the newly inserted data using the `NEW` record variable. This `NEW` variable allows you to access the values of columns in the inserted row:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
NEW.column_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Typically, you use `AFTER INSERT` triggers for logging changes, updating related tables, or sending notifications based on the inserted data.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create an `AFTER` `INSERT` trigger, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [define a function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that will execute when the trigger is activated:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The `RETURN NEW` statement indicates that the function returns the modified row, which is the `NEW` row.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create an `AFTER` `INSERT` trigger and bind the function to it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER trigger_name
AFTER INSERT
ON table_name
FOR EACH {ROW | STATEMENT}
EXECUTE FUNCTION trigger_function();
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL AFTER INSERT trigger example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `members` to store the member data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `members` table has three columns `id`, `name`, and `email`. The `id` column is a [serial](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-serial/) and [primary key](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-primary-key/) column. The `email` column has a unique constraint to ensure the uniqueness of emails.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, create another table called `memberships` to store the memberships of the members:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id),
    membership_type VARCHAR(50) NOT NULL DEFAULT 'free'
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The memberships table has three columns id, member_id, and membership_type:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The `id` is a serial and primary key column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `member_id` references the id column of the `members` table. It is a foreign key column.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `membership_type` column has a default value of "free".
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Third, define a trigger function that inserts a default free membership for every member:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION create_membership_after_insert()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO memberships (member_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, define an `AFTER` `INSERT` trigger on the `members` table, specifying that it should execute the `create_membership_after_insert()` function for each row inserted:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER after_insert_member_trigger
AFTER INSERT ON members
FOR EACH ROW
EXECUTE FUNCTION create_membership_after_insert();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, [insert a new row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `members` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO members(name, email)
VALUES('John Doe', 'john.doe@gmail.com')
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id |   name   |       email
----+----------+--------------------
  1 | John Doe | john.doe@gmail.com
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, retrieve data from the `memberships` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM memberships;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 id | member_id | membership_type
----+-----------+-----------------
  1 |         1 | free
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use an `AFTER` `INSERT` trigger to call a function automatically after an `INSERT` operation successfully on the associated table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
