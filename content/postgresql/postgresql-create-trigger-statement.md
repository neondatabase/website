---
createdAt: 2014-05-21T08:07:00.000Z
title: 'PostgreSQL CREATE TRIGGER Statement'
redirectFrom: 
            - /postgresql/postgresql-triggers/creating-first-trigger-postgresql
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-Sample-Table.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE TRIGGER` statement to create a trigger.

To create a new trigger in PostgreSQL, you follow these steps:

- First, create a trigger function using `CREATE FUNCTION` statement.
-
- Second, bind the trigger function to a table by using `CREATE TRIGGER` statement.

If you are not familiar with creating a user-defined function, you can check out the [PL/pgSQL section](/postgresql/postgresql-stored-procedures).

## Create trigger function syntax

A trigger function is similar to a regular [user-defined function](/postgresql/postgresql-plpgsql/postgresql-create-function). However, a trigger function does not take any arguments and has a return value with the type `trigger`.

The following illustrates the syntax of creating a trigger function:

```sql
CREATE FUNCTION trigger_function()
   RETURNS TRIGGER
   LANGUAGE PLPGSQL
AS $$
BEGIN
   -- trigger logic
END;
$$
```

Notice that you can create a trigger function using any language supported by PostgreSQL. In this tutorial, we will use PL/pgSQL.

A trigger function receives data about its calling environment through a special structure called `TriggerData` which contains a set of local variables.

For example, `OLD` and `NEW` represent the states of the row in the table before or after the triggering event.

PostgreSQL also provides other local variables preceded by `TG_` such as `TG_WHEN`, and `TG_TABLE_NAME`.

After creating a trigger function, you can bind it to one or more trigger events such as `INSERT`, [`UPDATE`](/postgresql/postgresql-update), and `DELETE`.

## Introduction to PostgreSQL CREATE TRIGGER statement

The `CREATE TRIGGER` statement allows you to create a new trigger.

The following illustrates the basic syntax of the `CREATE TRIGGER` statement:

```sql
CREATE TRIGGER trigger_name
   {BEFORE | AFTER} { event }
   ON table_name
   [FOR [EACH] { ROW | STATEMENT }]
       EXECUTE PROCEDURE trigger_function
```

In this syntax:

First, provide the name of the trigger after the `TRIGGER` keywords.

Second, indicate the timing that causes the trigger to fire. It can be `BEFORE` or `AFTER` an event occurs.

Third, specify the event that invokes the trigger. The event can be `INSERT` , `DELETE`, `UPDATE` or `TRUNCATE`.

Fourth, specify the name of the table associated with the trigger after the `ON` keyword.

Fifth, define the type of triggers, which can be:

- The row-level trigger that is specified by the `FOR EACH ROW` clause.
-
- The statement-level trigger that is specified by the `FOR EACH STATEMENT` clause.

A row-level trigger is fired for each row while a statement-level trigger is fired for each transaction.

Suppose a table has 100 rows and two triggers that will be fired when a `DELETE` event occurs.

If the `DELETE` statement deletes 100 rows, the row-level trigger will fire 100 times, once for each deleted row. On the other hand, a statement-level trigger will be fired for one time regardless of how many rows are deleted.

Finally, give the name of the trigger function after the `EXECUTE PROCEDURE` keywords.

## PostgreSQL CREATE TRIGGER example

The following statement creates a new table called `employees`:

```sql
CREATE TABLE employees(
   id INT GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(40) NOT NULL,
   last_name VARCHAR(40) NOT NULL,
   PRIMARY KEY(id)
);
```

Note that if your database already has the `employees` table, you can drop it first before creating a new one:

```sql
DROP TABLE IF EXISTS employees;
```

Suppose that when the name of an employee changes, you want to log it in a separate table called `employee_audits` :

```sql
CREATE TABLE employee_audits (
   id INT GENERATED ALWAYS AS IDENTITY,
   employee_id INT NOT NULL,
   last_name VARCHAR(40) NOT NULL,
   changed_on TIMESTAMP NOT NULL
);
```

First, create a new function called `log_last_name_changes`:

```sql
CREATE OR REPLACE FUNCTION log_last_name_changes()
  RETURNS TRIGGER
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
 IF NEW.last_name <> OLD.last_name THEN
   INSERT INTO employee_audits(employee_id,last_name,changed_on)
   VALUES(OLD.id,OLD.last_name,now());
 END IF;

 RETURN NEW;
END;
$$
```

The function inserts the old last name into the `employee_audits` table including employee id, last name, and the time of change if the last name of an employee changes.

The `OLD` represents the row before the update while the `NEW` represents the new row that will be updated. The `OLD.last_name` returns the last name before the update and the `NEW.last_name` returns the new last name.

Second, bind the trigger function to the `employees` table. The trigger name is `last_name_changes`. Before the value of the `last_name` column is updated, the trigger function is automatically invoked to log the changes.

```sql
CREATE TRIGGER last_name_changes
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE log_last_name_changes();
```

Third, [insert](/postgresql/postgresql-insert) some rows into the `employees` table:

```sql
INSERT INTO employees (first_name, last_name)
VALUES ('John', 'Doe');

INSERT INTO employees (first_name, last_name)
VALUES ('Lily', 'Bush');
```

Fourth, examine the contents of the `employees` table:

```sql
SELECT * FROM employees;
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-Sample-Table.png)

Suppose that `Lily Bush` changes her last name to `Lily Brown`.

Fifth, update Lily's last name to the new one:

```sql
UPDATE employees
SET last_name = 'Brown'
WHERE ID = 2;
```

Sixth, check if the last name of `Lily` has been updated:

```sql
SELECT * FROM employees;
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-after-update.png)

The output indicates that Lily's last name has been updated.

Finally, verify the contents of the `employee_audits` table:

```sql
SELECT * FROM employee_audits;
```

![](/postgresqltutorial_data/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-example.png)

The change was logged in the `employee_audits` table by the trigger.

## Summary

- Use the PostgreSQL `CREATE TRIGGER` to create a new trigger.
