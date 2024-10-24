---
title: 'PostgreSQL BEFORE UPDATE Trigger'
page_title: 'PostgreSQL BEFORE UPDATE Trigger'
page_description: 'In this tutorial, you will learn how to define a PostgreSQL BEFORE UPDATE trigger that executes a function before an update operation occurs.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-triggers/postgresql-before-update-trigger/'
ogImage: ''
updatedOn: '2024-03-28T10:18:43+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL AFTER INSERT Trigger'
  slug: 'postgresql-triggers/postgresql-after-insert-trigger'
nextLink:
  title: 'PostgreSQL AFTER UPDATE Trigger'
  slug: 'postgresql-triggers/postgresql-after-update-trigger'
---

**Summary**: in this tutorial, you will learn how to define a PostgreSQL `BEFORE UPDATE` trigger that executes a function before an update event occurs.

## Introduction to the PostgreSQL BEFORE UPDATE trigger

In PostgreSQL, a trigger is a database object that is automatically activated when an event such as [`INSERT`](../postgresql-tutorial/postgresql-insert), [`UPDATE`](../postgresql-tutorial/postgresql-update), [`DELETE`](../postgresql-tutorial/postgresql-delete), or [`TRUNCATE`](../postgresql-tutorial/postgresql-truncate-table) occurs on the associated table.

A `BEFORE UPDATE` trigger is a type of trigger that activates before an `UPDATE` operation is applied to a table.

These `BEFORE UPDATE` triggers can be particularly useful when you want to modify data before an update occurs or enforce certain conditions.

In a `BEFORE UPDATE` trigger, you can access the following variables:

- `OLD`: This record variable allows you to access the row before the update.
- `NEW`: This record variable represents the row after the update.

Also, you can access the following variables:

- `TG_NAME`: Represent the name of the trigger.
- `TG_OP`: Represent the operation that activates the trigger, which is `UPDATE` for the `BEFORE UPDATE` triggers.
- `TG_WHEN`: Represent the trigger timing, which is `BEFORE` for the `BEFORE UPDATE` triggers.

To create a `BEFORE UPDATE` trigger, you follow these steps:

First, [define a trigger function](../postgresql-plpgsql/postgresql-create-function) that will execute when the `BEFORE UPDATE` trigger fires:

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

Second, create a `BEFORE UPDATE` trigger that executes the defined function:

```sql
CREATE TRIGGER trigger_name
BEFORE UPDATE
ON table_name
FOR EACH {ROW | STATEMENT}
EXECUTE FUNCTION trigger_function();
```

## PostgreSQL BEFORE UPDATE trigger example

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `employees` to store the employee data:

```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC NOT NULL
);
```

Next, define a trigger function that [raises an exception](../postgresql-plpgsql/postgresql-exception) if the new salary is lower than the current salary. The trigger will prevent the update when the exception occurs.

```sql
CREATE OR REPLACE FUNCTION fn_before_update_salary()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.salary < OLD.salary THEN
        RAISE EXCEPTION 'New salary cannot be less than current salary';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Then, create a `BEFORE UPDATE` trigger that executes the `fn_before_update_salary()` before the update:

```sql
CREATE TRIGGER before_update_salary_trigger
BEFORE UPDATE OF salary ON employees
FOR EACH ROW
EXECUTE FUNCTION fn_before_update_salary();
```

This `BEFORE UPDATE` trigger ensures that the salary of the employee cannot be decreased. If you attempt to reduce the salary, the trigger will raise an exception and abort the update.

After that, [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the `employees` table:

```sql
INSERT INTO employees(name, salary)
VALUES
   ('John Doe', 70000),
   ('Jane Doe', 80000)
RETURNING *;
```

Output:

```sql
 id |   name   | salary
----+----------+--------
  1 | John Doe |  70000
  2 | Jane Doe |  80000
(2 rows)
```

Finally, attempt to decrease the salary of `John Doe`:

```sql
UPDATE employees
SET salary = salary * 0.9
WHERE id = 1;
```

The `BEFORE UPDATE` trigger raises the following exception:

```sql
ERROR:  New salary cannot be less than current salary
CONTEXT:  PL/pgSQL function fn_before_update_salary() line 4 at RAISE
```

## Summary

- Use a `BEFORE UPDATE` trigger to automatically execute a function before an update.
