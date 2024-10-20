---
prevPost: postgresql-json-index
nextPost: postgresql-min_scale-function
createdAt: 2024-03-27T08:54:27.000Z
title: 'PostgreSQL INSTEAD OF Triggers'
redirectFrom: 
            - /postgresql/postgresql-triggers/postgresql-instead-of-triggers
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about PostgreSQL `INSTEAD OF` a trigger to insert, update, or delete data of base tables through a view.

## Introduction to PostgreSQL INSTEAD OF triggers

In PostgreSQL, `INSTEAD OF` triggers are a special type of [triggers](/postgresql/postgresql-triggers) that **intercept** insert, update, and delete operations on views.

It means that when you execute an `INSERT`, `UPDATE`, or `DELETE` statement on a view, PostgreSQL does not directly execute the statement. Instead, it executes the statements defined in the `INSTEAD OF` trigger.

To create an `INSTEAD OF` trigger, you follow these steps:

First, [define a function](/postgresql/postgresql-plpgsql/postgresql-create-function) that will execute when a trigger is fired:

```sql
CREATE OR REPLACE FUNCTION fn_trigger()
RETURNS TRIGGER AS
$$
   -- function body
$$
LANGUAGE plpgsql;
```

Inside the function, you can customize the behavior for each operation including `INSERT`, `UPDATE`, and `DELETE`.

Second, create an `INSTEAD OF` trigger and bind the function to it:

```sql
CREATE TRIGGER trigger_name
INSTEAD OF INSERT OR UPDATE OR DELETE
ON table_name
FOR EACH ROW
EXECUTE FUNCTION fn_trigger;
```

## PostgreSQL INSTEAD OF trigger example

Let's take an example of creating an `INSTEAD OF` trigger.

### 1) Setting up a view with an INSTEAD OF trigger

First, [create two tables](/postgresql/postgresql-create-table) `employees` and `salaries`:

```sql
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE salaries (
    employee_id INT,
    effective_date DATE NOT NULL,
    salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    PRIMARY KEY (employee_id, effective_date),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
```

Next, [insert rows](/postgresql/postgresql-insert) into the `employees` and `salaries` tables:

```sql
INSERT INTO employees (name)
VALUES
   ('Alice'),
   ('Bob')
RETURNING *;

INSERT INTO salaries
VALUES
   (1, '2024-03-01', 60000.00),
   (2, '2024-03-01', 70000.00)
RETURNING *;
```

Then, [create a view](/postgresql/postgresql-views/managing-postgresql-views) based on the `employees` and `salaries` tables:

```sql
CREATE VIEW employee_salaries
AS
SELECT e.employee_id, e.name, s.salary, s.effective_date
FROM employees e
JOIN salaries s ON e.employee_id = s.employee_id;
```

After that, create a function that will execute when the `INSTEAD` `OF` trigger associated with the view activates:

```sql
CREATE OR REPLACE FUNCTION update_employee_salaries()
RETURNS TRIGGER AS
$$
DECLARE
    p_employee_id INT;
BEGIN
    IF TG_OP = 'INSERT' THEN
 -- insert a new employee
        INSERT INTO employees(name)
        VALUES (NEW.name)
 RETURNING employee_id INTO p_employee_id;

 -- insert salary for the employee
        INSERT INTO salaries(employee_id, effective_date, salary)
 VALUES (p_employee_id, NEW.effective_date, NEW.salary);
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE salaries
 SET salary = NEW.salary
 WHERE employee_id = NEW.employee_id;

    ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM salaries
 WHERE employee_id = OLD.employee_id;
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;
```

If you execute an insert against the `employee_salaries` view, the `INSTEAD OF` trigger will insert a new row into the employees table first, then insert a new row into the salaries table.

When you update an employee's salary by id, the `INSTEAD OF` trigger will update the data in the `salaries` table.

If you delete a row from the `employee_salaries` view, the `INSTEAD OF` trigger will delete a row from the `employees` table. The `DELETE CASCADE` will automatically delete a corresponding row from the salaries table.

Finally, create an `INSTEAD OF` trigger that will be fired for the `INSERT`, `UPDATE`, or `DELETE` on the `employee_salaries` view:

```sql
CREATE TRIGGER instead_of_employee_salaries
INSTEAD OF INSERT OR UPDATE OR DELETE
ON employee_salaries
FOR EACH ROW
EXECUTE FUNCTION update_employee_salaries();
```

### 1) Inserting data into tables via the view

First, insert a new employee with a salary via the view:

```sql
INSERT INTO employee_salaries (name, salary, effective_date)
VALUES ('Charlie', 75000.00, '2024-03-01');
```

PostgreSQL does not execute this statement. Instead, it executes the statement defined in the `INSTEAD` `OF` trigger. More specifically, it executes two statements:

1. Insert a new row into the `employees` table and get the employee id:

```sql
INSERT INTO employees(name)
VALUES (NEW.name)
RETURNING employee_id INTO p_employee_id;
```

2. Insert a new row into the salaries table using the employee id, salary, and effective date:

```sql
INSERT INTO salaries(employee_id, effective_date, salary)
VALUES (p_employee_id, NEW.effective_date, NEW.salary);
```

Second, verify the inserts by retrieving data from the `employees` and `salaries` tables:

```sql
SELECT * FROM employees;
```

Output:

```
 employee_id |  name
-------------+---------
           1 | Alice
           2 | Bob
           3 | Charlie
(3 rows)
```

```sql
SELECT * FROM salaries;
```

Output:

```
 employee_id | effective_date |  salary
-------------+----------------+----------
           1 | 2024-03-01     | 60000.00
           2 | 2024-03-01     | 70000.00
           3 | 2024-03-01     | 75000.00
(3 rows)
```

### 2) Updating data into tables via the view

First, update the salary of the employee id 3 via the `employee_salaries` view:

```sql
UPDATE employee_salaries
SET salary = 95000
WHERE employee_id = 3;
```

Second, retrieve data from the `salaries` table:

```sql
SELECT * FROM salaries;
```

Output:

```
 employee_id | effective_date |  salary
-------------+----------------+----------
           1 | 2024-03-01     | 60000.00
           2 | 2024-03-01     | 70000.00
           3 | 2024-03-01     | 95000.00
(3 rows)
```

### 3) Deleting data via views

First, delete the employee with id 3 via the `employee_salaries` view:

```sql
DELETE FROM employee_salaries
WHERE employee_id = 3;
```

Second, retrieve data from the `employees` table:

```sql
SELECT * FROM employees;
```

Output:

```
 employee_id | effective_date |  salary
-------------+----------------+----------
           1 | 2024-03-01     | 60000.00
           2 | 2024-03-01     | 70000.00
(2 rows)
```

Because of the `DELETE` `CASCADE`, PostgreSQL also deletes the corresponding row in the `salaries` table:

```sql
SELECT * FROM salaries;
```

Output:

```
 employee_id | effective_date |  salary
-------------+----------------+----------
           1 | 2024-03-01     | 60000.00
           2 | 2024-03-01     | 70000.00
(2 rows)
```

## Summary

- Use the `INSTEAD OF` trigger to customize the behavior of `INSERT`, `UPDATE`, and `DELETE` operations on a database view.
