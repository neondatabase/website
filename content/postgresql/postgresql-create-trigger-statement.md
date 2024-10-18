---
title: 'PostgreSQL CREATE TRIGGER Statement'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/creating-first-trigger-postgresql/
ogImage: ./img/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-Sample-Table.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CREATE TRIGGER` statement to create a trigger.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To create a new trigger in PostgreSQL, you follow these steps:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- First, create a trigger function using `CREATE FUNCTION` statement.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Second, bind the trigger function to a table by using `CREATE TRIGGER` statement.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph {"className":"note"} -->

If you are not familiar with creating a user-defined function, you can check out the [PL/pgSQL section](https://www.postgresqltutorial.com/postgresql-stored-procedures/ "PostgreSQL Stored Procedures").

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Create trigger function syntax

<!-- /wp:heading -->

<!-- wp:paragraph -->

A trigger function is similar to a regular [user-defined function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/). However, a trigger function does not take any arguments and has a return value with the type `trigger`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of creating a trigger function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE FUNCTION trigger_function()
   RETURNS TRIGGER
   LANGUAGE PLPGSQL
AS $$
BEGIN
   -- trigger logic
END;
$$
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Notice that you can create a trigger function using any language supported by PostgreSQL. In this tutorial, we will use PL/pgSQL.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A trigger function receives data about its calling environment through a special structure called `TriggerData` which contains a set of local variables.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

For example, `OLD` and `NEW` represent the states of the row in the table before or after the triggering event.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL also provides other local variables preceded by `TG_` such as `TG_WHEN`, and `TG_TABLE_NAME`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

After creating a trigger function, you can bind it to one or more trigger events such as `INSERT`, [`UPDATE`](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/), and `DELETE`.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL CREATE TRIGGER statement

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CREATE TRIGGER` statement allows you to create a new trigger.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the basic syntax of the `CREATE TRIGGER` statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER trigger_name
   {BEFORE | AFTER} { event }
   ON table_name
   [FOR [EACH] { ROW | STATEMENT }]
       EXECUTE PROCEDURE trigger_function
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, provide the name of the trigger after the `TRIGGER` keywords.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, indicate the timing that causes the trigger to fire. It can be `BEFORE` or `AFTER` an event occurs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, specify the event that invokes the trigger. The event can be `INSERT` , `DELETE`, `UPDATE` or `TRUNCATE`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fourth, specify the name of the table associated with the trigger after the `ON` keyword.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, define the type of triggers, which can be:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The row-level trigger that is specified by the `FOR EACH ROW` clause.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The statement-level trigger that is specified by the `FOR EACH STATEMENT` clause.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

A row-level trigger is fired for each row while a statement-level trigger is fired for each transaction.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Suppose a table has 100 rows and two triggers that will be fired when a `DELETE` event occurs.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If the `DELETE` statement deletes 100 rows, the row-level trigger will fire 100 times, once for each deleted row. On the other hand, a statement-level trigger will be fired for one time regardless of how many rows are deleted.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, give the name of the trigger function after the `EXECUTE PROCEDURE` keywords.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CREATE TRIGGER example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement creates a new table called `employees`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employees(
   id INT GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(40) NOT NULL,
   last_name VARCHAR(40) NOT NULL,
   PRIMARY KEY(id)
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that if your database already has the `employees` table, you can drop it first before creating a new one:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
DROP TABLE IF EXISTS employees;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Suppose that when the name of an employee changes, you want to log it in a separate table called `employee_audits` :

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE employee_audits (
   id INT GENERATED ALWAYS AS IDENTITY,
   employee_id INT NOT NULL,
   last_name VARCHAR(40) NOT NULL,
   changed_on TIMESTAMP NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

First, create a new function called `log_last_name_changes`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The function inserts the old last name into the `employee_audits` table including employee id, last name, and the time of change if the last name of an employee changes.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `OLD` represents the row before the update while the `NEW` represents the new row that will be updated. The `OLD.last_name` returns the last name before the update and the `NEW.last_name` returns the new last name.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, bind the trigger function to the `employees` table. The trigger name is `last_name_changes`. Before the value of the `last_name` column is updated, the trigger function is automatically invoked to log the changes.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TRIGGER last_name_changes
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE log_last_name_changes();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, [insert](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) some rows into the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO employees (first_name, last_name)
VALUES ('John', 'Doe');

INSERT INTO employees (first_name, last_name)
VALUES ('Lily', 'Bush');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Fourth, examine the contents of the `employees` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM employees;
```

<!-- /wp:code -->

<!-- wp:image {"id":5734,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-Sample-Table.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

Suppose that `Lily Bush` changes her last name to `Lily Brown`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Fifth, update Lily's last name to the new one:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
UPDATE employees
SET last_name = 'Brown'
WHERE ID = 2;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Sixth, check if the last name of `Lily` has been updated:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM employees;
```

<!-- /wp:code -->

<!-- wp:image {"id":5735,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-after-update.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The output indicates that Lily's last name has been updated.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Finally, verify the contents of the `employee_audits` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM employee_audits;
```

<!-- /wp:code -->

<!-- wp:image {"id":5736,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgreSQL-Cretae-Trigger-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

The change was logged in the `employee_audits` table by the trigger.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `CREATE TRIGGER` to create a new trigger.
- <!-- /wp:list-item -->

<!-- /wp:list -->
