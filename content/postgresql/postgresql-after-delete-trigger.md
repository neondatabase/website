---
title: 'PostgreSQL AFTER DELETE Trigger'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-delete-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to define a PostgreSQL `AFTER DELETE` trigger that is fired after a row is deleted from a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL AFTER DELETE trigger

<!-- /wp:heading -->

<!-- wp:paragraph -->

In PostgreSQL, a trigger is a database object that is automatically activated in response to an event including `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` occurring on a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

An `AFTER DELETE` trigger is activated after one or more rows are deleted from a table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

An `AFTER DELETE` trigger can be particularly useful in some scenarios such as logging deleted data, updating data in related tables, or enforcing complex business rules.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In an `AFTER DELETE` trigger, the `OLD` variable, which holds the value of the row being deleted, is available. To access a column value of the deleted row, you can use the syntax `OLD.column_name`.

<!-- /wp:paragraph -->

<!-- wp:paragraph {"className":"note"} -->

Notice that you cannot change the column values (`OLD.column_name`) because they are read-only.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create an `AFTER DELETE` trigger, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [define a trigger function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that will execute after a `DELETE` operation:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION trigger_function_name()
RETURNS TRIGGER AS
$$
BEGIN
    -- This logic will be executed after the DELETE operation

    -- To access the values of a column of the deleted row:
    -- OLD.column_name

    RETURN OLD;
END;
$$
LANGUAGE plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, create a trigger and associate the trigger function with it:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER trigger_name
AFTER DELETE ON table_name
FOR EACH ROW
EXECUTE FUNCTION trigger_function_name();
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL AFTER DELETE trigger example

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll use an `AFTER DELETE` trigger to archive a deleted row in a separate table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `employees` to store the employee data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert two rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO employees(name, salary)
VALUES
   ('John Doe', 90000),
   ('Jane Doe', 80000)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |   name   |  salary
----+----------+----------
  1 | John Doe | 90000.00
  2 | Jane Doe | 80000.00
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, create another table named `employee_archives` for archiving deleted employees:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employee_archives(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,

    salary NUMERIC(10, 2) NOT NULL,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, define a function that [inserts](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) a deleted employee into the `employee_archives` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION archive_deleted_employee()
RETURNS TRIGGER
AS
$$
BEGIN
    INSERT INTO employee_archives(id, name, salary)
    VALUES (OLD.id, OLD.name, OLD.salary);

    RETURN OLD;
END;
$$
LANGUAGE plpgsql;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fifth, create an `AFTER DELETE` trigger that executes the `archive_deleted_employee()` function when a row is deleted from the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER after_delete_employee_trigger
AFTER DELETE ON employees
FOR EACH ROW
EXECUTE FUNCTION archive_deleted_employee();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, [delete a row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete/) from the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
DELETE FROM employees
WHERE id = 1
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |   name   |  salary
----+----------+----------
  1 | John Doe | 90000.00
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `AFTER INSERT` trigger will be activated that calls the `archive_deleted_employee()` function to insert the deleted row into the `employee_archives` table.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Seventh, retrieve data from the `employee_archives` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM employee_archives;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |   name   |  salary  |        deleted_at
----+----------+----------+---------------------------
  1 | John Doe | 90000.00 | 2024-03-28 16:30:37.89788
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `AFTER DELETE` trigger has successfully archived the deleted row into the `employee_archives` table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use a `BEFORE DELETE` trigger to automatically call a function before a row is deleted from a table.
- <!-- /wp:list-item -->

<!-- /wp:list -->
