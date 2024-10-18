---
title: 'PostgreSQL ALTER TRIGGER Statement'
redirectFrom: 
            - /docs/postgresql/postgresql-triggers/postgresql-alter-trigger/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ALTER TRIGGER` statement to rename a trigger.



## Introduction to PostgreSQL ALTER TRIGGER statement



The `ALTER TRIGGER` statement allows you to rename a trigger. The following shows the syntax of the `ALTER TRIGGER` statement:



```
ALTER TRIGGER trigger_name
ON table_name
RENAME TO new_trigger_name;
```



In this syntax:



- First, specify the name of the trigger you want to rename after the `ALTER TRIGGER` keywords.
- -
- Second, provide the name of the table associated with the trigger after the `ON` keyword.
- -
- Third, specify the new name of the trigger after the `RENAME TO` keyword.
- 


To execute the `ALTER TRIGGER` statement, you must be the owner of the table to which the trigger belongs.



## PostgreSQL ALTER TRIGGER example



First, [create a new table](/docs/postgresql/postgresql-create-table) called `employees`:



```
DROP TABLE IF EXISTS employees;

CREATE TABLE employees(
   employee_id INT GENERATED ALWAYS AS IDENTITY,
   first_name VARCHAR(50) NOT NULL,
   last_name VARCHAR(50) NOT NULL,
   salary decimal(11,2) NOT NULL DEFAULT 0,
   PRIMARY KEY(employee_id)
);
```



Second, [create a function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that raises an exception if the new salary is greater than the old one 100%:



```
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



Third, create a before-update trigger that executes the `check_salary()` function before updating the salary:



```
CREATE TRIGGER before_update_salary
  BEFORE UPDATE
  ON employees
  FOR EACH ROW
  EXECUTE PROCEDURE check_salary();
```



Fourth, [insert a new row](/docs/postgresql/postgresql-insert) into the `employees` table:



```
INSERT INTO employees(first_name, last_name, salary)
VALUES('John','Doe',100000);
```



Fifth, update the salary of the employee id 1:



```
UPDATE employees
SET salary = 200000
WHERE employee_id = 1;
```



The trigger was fired and issued the following error:



```
ERROR:  The salary increment cannot that high.
CONTEXT:  PL/pgSQL function check_salary() line 4 at RAISE
SQL state: P0001
```



It works as expected.



Finally, use the `ALTER TRIGGER` statement to rename the `before_update_salary` trigger to `salary_before_update`:



```
ALTER TRIGGER before_update_salary
ON employees
RENAME TO salary_before_update;
```



If you use psql tool, you can view all triggers associated with a table using the `\dS` command:



```
 \dS employees
```



Notice that the letter `S` is uppercase.



![](https://www.postgresqltutorial.com/wp-content/uploads/2020/08/PostgreSQL-ALTER-TRIGGER-example.png)



## Replacing triggers



PostgreSQL doesn't support the `OR REPLACE` statement that allows you to modify the trigger definition like the function that will be executed when the trigger is fired.



To do so, you can use the `DROP TRIGGER` and `CREATE TRIGGER` statements. You can also wrap these statements within a [transaction](/docs/postgresql/postgresql-transaction).



The following example illustrates how to change the `check_salary` function of the `salary_before_update` trigger to `validate_salary`:



```
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



- Use the `ALTER TRIGGER` statement to rename a trigger.
- -
- Use the pair of the `DROP TRIGGER` and `CREATE TRIGGER` statements to replace a trigger with a new one.
- 
