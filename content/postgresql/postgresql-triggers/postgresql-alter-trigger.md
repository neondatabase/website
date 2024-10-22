---
title: "PostgreSQL ALTER TRIGGER Statement"
page_title: "PostgreSQL ALTER TRIGGER Statement"
page_description: "In this tutorial, you will learn how to use the PostgreSQL ALTER TRIGGER statement to rename a trigger."
prev_url: "https://www.postgresqltutorial.com/postgresql-triggers/postgresql-alter-trigger/"
ogImage: "/postgresqltutorial/PostgreSQL-ALTER-TRIGGER-example.png"
updatedOn: "2024-03-30T03:14:14+00:00"
enableTableOfContents: true
prev_page: 
  title: "PostgreSQL DROP TRIGGER Statement"
  slug: "postgresql-triggers/postgresql-drop-trigger"
next_page: 
  title: "PostgreSQL BEFORE INSERT Trigger"
  slug: "postgresql-triggers/postgresql-before-insert-trigger"
---




**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER TRIGGER` statement to rename a trigger.


## Introduction to PostgreSQL ALTER TRIGGER statement

The `ALTER TRIGGER` statement allows you to rename a trigger. The following shows the syntax of the `ALTER TRIGGER` statement:


```pgsql
ALTER TRIGGER trigger_name
ON table_name 
RENAME TO new_trigger_name;
```
In this syntax:

* First, specify the name of the trigger you want to rename after the `ALTER TRIGGER` keywords.
* Second, provide the name of the table associated with the trigger after the `ON` keyword.
* Third, specify the new name of the trigger after the `RENAME TO` keyword.

To execute the `ALTER TRIGGER` statement, you must be the owner of the table to which the trigger belongs.


## PostgreSQL ALTER TRIGGER example

First, [create a new table](../postgresql-tutorial/postgresql-create-table) called `employees`:


```pgsql
DROP TABLE IF EXISTS employees;

CREATE TABLE employees(
   employee_id INT GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   salary decimal(11,2) NOT NULL DEFAULT 0,
   PRIMARY KEY(employee_id)
);
```
Second, [create a function](../postgresql-plpgsql/postgresql-create-function) that raises an exception if the new salary is greater than the old one 100%:


```pgsql
CREATE OR REPLACE FUNCTION check_salary()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL  
  AS
$$
BEGIN
	IF (NEW.salary - OLD.salary) / OLD.salary >= 1 THEN
		RAISE 'The salary increment cannot that high.';
	END IF;

	RETURN NEW;
END;
$$
```
Third, create a before\-update trigger that executes the `check_salary()` function before updating the salary:


```pgsql
CREATE TRIGGER before_update_salary
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE check_salary();
```
Fourth, [insert a new row](../postgresql-tutorial/postgresql-insert) into the `employees` table:


```pgsql
INSERT INTO employees(first_name, last_name, salary)
VALUES('John','Doe',100000);
```
Fifth, update the salary of the employee id 1:


```pgsql
UPDATE employees
SET salary = 200000
WHERE employee_id = 1;
```
The trigger was fired and issued the following error:


```shell
ERROR:  The salary increment cannot that high.
CONTEXT:  PL/pgSQL function check_salary() line 4 at RAISE
SQL state: P0001
```
It works as expected.

Finally, use the `ALTER TRIGGER` statement to rename the `before_update_salary` trigger to `salary_before_update`:


```pgsql
ALTER TRIGGER before_update_salary
ON employees
RENAME TO salary_before_update;
```
If you use psql tool, you can view all triggers associated with a table using the `\dS` command:


```shell
 \dS employees
```
Notice that the letter `S` is uppercase.

![](/postgresqltutorial/PostgreSQL-ALTER-TRIGGER-example.png)
## Replacing triggers

PostgreSQL doesn’t support the `OR REPLACE` statement that allows you to modify the trigger definition like the function that will be executed when the trigger is fired.

To do so, you can use the `DROP TRIGGER` and `CREATE TRIGGER` statements. You can also wrap these statements within a [transaction](../postgresql-tutorial/postgresql-transaction).

The following example illustrates how to change the `check_salary` function of the `salary_before_update` trigger to `validate_salary`:


```pgsql
BEGIN;

DROP TRIGGER IF EXISTS salary_before_update 
ON employees;

CREATE TRIGGER salary_before_udpate
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE validate_salary();

COMMIT;
```

## Summary

* Use the `ALTER TRIGGER` statement to rename a trigger.
* Use the pair of the `DROP TRIGGER` and `CREATE TRIGGER` statements to replace a trigger with a new one.

