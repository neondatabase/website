---
title: 'PostgreSQL AFTER UPDATE Trigger'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-triggers/postgresql-after-update-trigger/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to define a PostgreSQL `AFTER UPDATE` trigger that executes a function after an update event occurs.





## Introduction to the PostgreSQL AFTER UPDATE trigger





In PostgreSQL, a trigger is a database object that is fired automatically when an event such as `INSERT`, `UPDATE`, `DELETE`, or `TRUNCATE` occurs.





An `AFTER UPDATE` trigger is a type of trigger that fires after an `UPDATE` operation is completed successfully on a table.





Because the `AFTER UPDATE` triggers can access the row after the update, you can perform tasks such as logging changes, updating data in related tables, or sending notifications based on the modified data.





In an `AFTER UPDATE` trigger, you can access the following variables:





- 
- `OLD`: This record variable allows you to access the row before the update.
- 
-
- 
- `NEW`: This record variable represents the row after the update.
- 





Additionally, you can access the following variables:





- 
- `TG_NAME`: Store the name of the trigger.
- 
-
- 
- `TG_OP`: Represent the operation that activates the trigger, which is `UPDATE` for the `AFTER` `UPDATE` trigger.
- 
-
- 
- `TG_WHEN`: Represent the trigger timing, which is `AFTER` for the `AFTER UPDATE` trigger.
- 





To create a `AFTER UPDATE` trigger, you use the following steps:





First, [define a trigger function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that will execute when the `AFTER UPDATE` trigger fires:





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





Second, create a `AFTER UPDATE` trigger that executes the trigger function:





```
CREATE TRIGGER trigger_name
AFTER UPDATE
ON table_name
FOR EACH {ROW | STATEMENT}
EXECUTE FUNCTION trigger_function();
```





## PostgreSQL AFTER UPDATE trigger example





First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `salaries` to store the employee's salaries:





```
CREATE TABLE salaries(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    salary NUMERIC NOT NULL
);
```





Second, create a table called `salary_changes` that stores the updates to the `salary` column of the `salaries` table:





```
CREATE TABLE salary_changes (
    id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL,
    old_salary NUMERIC NOT NULL,
    new_salary NUMERIC NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```





Third, define the function `log_salary_changes()` that logs the changes of values in the `salary` column to the `salary_changes` table:





```
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER
AS
$$
BEGIN
    INSERT INTO salary_changes (employee_id, old_salary, new_salary)
    VALUES (NEW.id, OLD.salary, NEW.salary);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```





Fourth, define an `AFTER UPDATE` trigger that calls the `log_salary_change()` function after an update occurs to the `salary` column of the `salaries` table:





```
CREATE TRIGGER after_update_salary_trigger
AFTER UPDATE OF salary ON salaries
FOR EACH ROW
EXECUTE FUNCTION log_salary_change();
```





Fifth, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `salaries` table:





```
INSERT INTO salaries(name, salary)
VALUES
   ('John Doe', 90000),
   ('Jane Doe', 95000)
RETURNING *;
```





Output:





```
 id |   name   | salary
----+----------+--------
  1 | John Doe |  90000
  2 | Jane Doe |  95000
(2 rows)
```





Sixth, increase the salary of `John Doe` by 5%:





```
UPDATE salaries
SET salary = salary * 1.05
WHERE id = 1;
```





Seventh, retrieve the data from `salary_changes` table:





```
SELECT * FROM salary_changes;
```





Output:





```
 id | employee_id | old_salary | new_salary |         changed_at
----+-------------+------------+------------+----------------------------
  1 |           1 |      90000 |   94500.00 | 2024-03-28 13:42:37.400673
(1 row)
```





The output shows that the salary before and after changes have been logged to the `salary_changes` table.





## Summary





- 
- Use a `BEFORE` `UPDATE` trigger to execute a function before an update operation occurs.
- 


