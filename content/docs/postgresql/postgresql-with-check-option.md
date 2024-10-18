---
title: 'PostgreSQL WITH CHECK OPTION'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-views/postgresql-views-with-check-option/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to create an updatable view using the `WITH CHECK OPTION` clause to ensure that the changes to the base tables through the view satisfy the view-defining condition.



## Introduction to the PostgreSQL WITH CHECK OPTION clause



In PostgreSQL, a view is a named query stored in the PostgreSQL database server. A simple [view can be updatable](https://www.postgresqltutorial.com/postgresql-views/postgresql-updatable-views/).



To ensure that any data modification made through a view adheres to certain conditions in the view's definition, you use the `WITH CHECK OPTION` clause.



Typically, you specify the `WITH CHECK OPTION` when creating a view using the `CREATE VIEW` statement:



```
CREATE VIEW view_name AS
query
WITH CHECK OPTION;
```



When you create a view `WITH CHECK OPTION`, PostgreSQL will ensure that you can only modify data of the view that satisfies the condition in the view's defining query (`query`).



### Scope of check



In PostgreSQL, you can specify a scope of check:



- - `LOCAL`
- -
- - `CASCADED`
- 


The `LOCAL` scope restricts the check option enforcement to the current view only. It does not enforce the check to the views that the current view is based on.



Here's the syntax for creating a view with the `WITH LOCAL CHECK OPTION`:



```
CREATE VIEW view_name AS
query
WITH LOCAL CHECK OPTION;
```



The `CASCADED` scope extends the check option enforcement to all underlying views of the current view. Here's the syntax for creating a view with the `WITH CASCADED CHECK OPTION`.



```
CREATE VIEW view_name AS
query
WITH CASCADED CHECK OPTION;
```



To change the scope of check for an existing view, you can use the [ALTER VIEW](https://www.postgresqltutorial.com/postgresql-views/postgresql-alter-view/) statement.



## PostgreSQL WITH CHECK OPTION examples



Let's take some examples of using the `WITH CHECK OPTION`.



### Setting up a sample table



The following statements [create a new table](/docs/postgresql/postgresql-create-table/) called `employees` and [insert data into it](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows):



```
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department_id INT,
    employee_type VARCHAR(20)
       CHECK (employee_type IN ('FTE', 'Contractor'))
);

INSERT INTO employees (first_name, last_name, department_id, employee_type)
VALUES
    ('John', 'Doe', 1, 'FTE'),
    ('Jane', 'Smith', 2, 'FTE'),
    ('Bob', 'Johnson', 1, 'Contractor'),
    ('Alice', 'Williams', 3, 'FTE'),
    ('Charlie', 'Brown', 2, 'Contractor'),
    ('Eva', 'Jones', 1, 'FTE'),
    ('Frank', 'Miller', 3, 'FTE'),
    ('Grace', 'Davis', 2, 'Contractor'),
    ('Henry', 'Clark', 1, 'FTE'),
    ('Ivy', 'Moore', 3, 'Contractor');
```



### 1) Basic PostgreSQL WITH CHECK OPTION example



First, create a view called `fte` that retrieves the employees with the type `FTE` from the `employees` table:



```
CREATE OR REPLACE VIEW fte AS
SELECT
  id,
  first_name,
  last_name,
  department_id,
  employee_type
FROM
  employees
WHERE
  employee_type = 'FTE';
```



Second, retrieve data from the `fte` view:



```
SELECT * FROM fte;
```



Output:



```
 id | first_name | last_name | department_id
----+------------+-----------+---------------
  1 | John       | Doe       |             1
  2 | Jane       | Smith     |             2
  4 | Alice      | Williams  |             3
  6 | Eva        | Jones     |             1
  7 | Frank      | Miller    |             3
  9 | Henry      | Clark     |             1
(6 rows)
```



Third, insert a new row into the `employees` table via the `fte` view:



```
INSERT INTO fte(first_name, last_name, department_id, employee_type)
VALUES ('John', 'Smith', 1, 'Contractor');
```



It succeeds.



The issue is that we can insert an employee with the type of `Contractor` into the `employee` table via the view that exposes the employee to the type of `FTE`.



To ensure that we can insert only employees with the type `FTE` into the `employees` table via the `fte` view, you can use the `WITH CHECK OPTION`:



Fourth, replace the `fte` view and add the `WITH CHECK OPTION`:



```
CREATE OR REPLACE VIEW fte AS
SELECT
  id,
  first_name,
  last_name,
  department_id,
  employee_type
FROM
  employees
WHERE
  employee_type = 'FTE'
WITH CHECK OPTION;
```



After adding the `WITH CHECK OPTION`, you perform insert, [update](/docs/postgresql/postgresql-update/), and [delete](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete) on `employees` table that satisfies the `WHERE` clause in the defining query of the view.



For example, the following `INSERT` statement will fail with an error:



```
INSERT INTO fte(first_name, last_name, department_id, employee_type)
VALUES ('John', 'Snow', 1, 'Contractor');
```



Error:



```
ERROR:  new row violates check option for view "fte"
DETAIL:  Failing row contains (12, John, Snow, 1, Contractor).
```



The reason is that the `employee_type` `Contractor` does not satisfy the condition defined in the defining query of the view:



```
employee_type = 'FTE';
```



But if you modify the row with the employee type `FTE`, it'll be fine.



Fifth, change the last name of the employee id `2` to `'Doe'`:



```
UPDATE fte
SET last_name = 'Doe'
WHERE id = 2;
```



It works as expected.



### 2) Using WITH LOCAL CHECK OPTION example



First, recreate the `fte` view without using the `WITH CHECK OPTION`:



```
CREATE OR REPLACE VIEW fte AS
SELECT
  id,
  first_name,
  last_name,
  department_id,
  employee_type
FROM
  employees
WHERE
  employee_type = 'FTE';
```



Second, create a new view `fte_1` based on the `fte` view that returns the `employees` of department `1`, with the `WITH LOCAL CHECK OPTION`:



```
CREATE OR REPLACE VIEW fte_1
AS
SELECT
  id,
  first_name,
  last_name,
  department_id,
  employee_type
FROM
  fte
WHERE
  department_id = 1
WITH LOCAL CHECK OPTION;
```



Third, retrieve the data from the `fte_1` view:



```
SELECT * FROM fte_1;
```



Output:



```
 id | first_name | last_name | department_id | employee_type
----+------------+-----------+---------------+---------------
  1 | John       | Doe       |             1 | FTE
  6 | Eva        | Jones     |             1 | FTE
  9 | Henry      | Clark     |             1 | FTE
(3 rows)
```



Since we use the `WITH LOCAL CHECK OPTION`, PostgreSQL checks only the `fte_1` view when we modify the data in the `employees` table via the `fte_1` view.



Fourth, insert a new row into the `employees` table via the `fte_1` view:



```
INSERT INTO fte_1(first_name, last_name, department_id, employee_type)
VALUES ('Miller', 'Jackson', 1, 'Contractor');
```



It succeeded. The reason is that the `INSERT` statement inserts a row with department 1 that satisfies the condition in the `fte_1` view:



```
department_id = 1
```



Fifth, query data from the `employees` table:



```
SELECT
  *
FROM
  employees
WHERE
  first_name = 'Miller'
  and last_name = 'Jackson';
```



Output:



```
 id | first_name | last_name | department_id | employee_type
----+------------+-----------+---------------+---------------
 12 | Miller     | Jackson   |             1 | Contractor
(1 row)
```



### 3) Using WITH CASCADED CHECK OPTION example



First, recreate the view `fte_1` with the `WITH CASCADED CHECK OPTION`:



```
CREATE OR REPLACE VIEW fte_1
AS
SELECT
  id,
  first_name,
  last_name,
  department_id,
  employee_type
FROM
  fte
WHERE
  department_id = 1
WITH CASCADED CHECK OPTION;
```



Second, insert a new row into `employee` table via the `fte_1` view:



```
INSERT INTO fte_1(first_name, last_name, department_id, employee_type)
VALUES ('Peter', 'Taylor', 1, 'Contractor');
```



Error:



```
ERROR:  new row violates check option for view "fte"
DETAIL:  Failing row contains (24, Peter, Taylor, 1, Contractor).
```



The `WITH CASCADED CHECK OPTION` instructs PostgreSQL to check the constraint on the `fte_1` view and also its base view which is the `fte` view.



That's why the `INSERT` statement fails the condition of both `fte_1` and `fte` views.



## Summary



- - Use the `WITH CHECK OPTION` clause to enforce constraints on data modifications through views and ensure that only valid data can be changed.
- 
