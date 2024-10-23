---
title: "PostgreSQL Recursive View"
page_title: "How To Create a PostgreSQL Recursive View"
page_description: "This tutorial shows you step by step how to create a PostgreSQL recursive view using the CREATE RECURSIVE VIEW statement."
prev_url: "https://www.postgresqltutorial.com/postgresql-views/postgresql-recursive-view/"
ogImage: ""
updatedOn: "2024-03-16T04:42:50+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL Materialized Views"
  slug: "postgresql-views/postgresql-materialized-views"
nextLink: 
  title: "PostgreSQL List Views"
  slug: "postgresql-views/postgresql-list-views"
---




**Summary**: in this tutorial, you will learn how to create a PostgreSQL recursive view using the `CREATE RECURSIVE VIEW` statement.


## Introduction to the PostgreSQL recursive view

In PostgreSQL, a recursive view is a view whose defining query references the view name itself.

A recursive view can be useful in performing hierarchical or recursive queries on hierarchical data structures stored in the database.

PostgreSQL 9\.3 added a new syntax for creating a recursive view specified in the standard SQL. The `CREATE RECURSIVE VIEW` statement is syntax sugar for a standard [recursive query](../postgresql-tutorial/postgresql-recursive-query).

Here’s the basic syntax of the `CREATE RECURSIVE VIEW` statement:


```sql
CREATE RECURSIVE VIEW view_name(columns) 
AS
query;
```
In this syntax:

* First, specify the name of the view you want to create in the `CREATE RECURSIVE VIEW` clause. You can add an optional schema to the name of the view.
* Second, add a [SELECT statement](../postgresql-tutorial/postgresql-select) to define the view. The `SELECT` statement references the `view_name` to make the view recursive.

The `CREATE RECURSIVE VIEW` statement is equivalent to the following statement:


```sql
CREATE VIEW view_name 
AS
  WITH RECURSIVE cte_name (columns) AS (
    SELECT ...)
  SELECT columns FROM cte_name;
```

## Creating a recursive view example

We will use the `employees` table created in the [recursive query tutorial](../postgresql-tutorial/postgresql-recursive-query) for the demonstration.

The following recursive query returns the employee and their managers including the CEO using a common table expression (CTE):


```sql
WITH RECURSIVE reporting_line AS (
  SELECT 
    employee_id, 
    full_name AS subordinates 
  FROM 
    employees 
  WHERE 
    manager_id IS NULL 
  UNION ALL 
  SELECT 
    e.employee_id, 
    (
      rl.subordinates || ' > ' || e.full_name
    ) AS subordinates 
  FROM 
    employees e 
    INNER JOIN reporting_line rl ON e.manager_id = rl.employee_id
) 
SELECT 
  employee_id, 
  subordinates 
FROM 
  reporting_line 
ORDER BY 
  employee_id;
```
Output:


```sql
 employee_id |                         subordinates
-------------+--------------------------------------------------------------
           1 | Michael North
           2 | Michael North > Megan Berry
           3 | Michael North > Sarah Berry
           4 | Michael North > Zoe Black
           5 | Michael North > Tim James
           6 | Michael North > Megan Berry > Bella Tucker
           7 | Michael North > Megan Berry > Ryan Metcalfe
           8 | Michael North > Megan Berry > Max Mills
           9 | Michael North > Megan Berry > Benjamin Glover
          10 | Michael North > Sarah Berry > Carolyn Henderson
          11 | Michael North > Sarah Berry > Nicola Kelly
          12 | Michael North > Sarah Berry > Alexandra Climo
          13 | Michael North > Sarah Berry > Dominic King
          14 | Michael North > Zoe Black > Leonard Gray
          15 | Michael North > Zoe Black > Eric Rampling
          16 | Michael North > Megan Berry > Ryan Metcalfe > Piers Paige
          17 | Michael North > Megan Berry > Ryan Metcalfe > Ryan Henderson
          18 | Michael North > Megan Berry > Max Mills > Frank Tucker
          19 | Michael North > Megan Berry > Max Mills > Nathan Ferguson
          20 | Michael North > Megan Berry > Max Mills > Kevin Rampling
```
You can use the `CREATE RECURSIVE VIEW` statement to convert a query into a recursive view as follows:


```sql
CREATE RECURSIVE VIEW reporting_line (employee_id, subordinates) AS 
SELECT 
  employee_id, 
  full_name AS subordinates 
FROM 
  employees 
WHERE 
  manager_id IS NULL 
UNION ALL 
SELECT 
  e.employee_id, 
  (
    rl.subordinates || ' > ' || e.full_name
  ) AS subordinates 
FROM 
  employees e 
  INNER JOIN reporting_line rl ON e.manager_id = rl.employee_id;
```
To view the reporting line of the employee id 10, you can query directly from the view:


```sql
SELECT 
  subordinates 
FROM 
  reporting_line 
WHERE 
  employee_id = 10;
```
Output:


```sql
                  subordinates
-------------------------------------------------
 Michael North > Sarah Berry > Carolyn Henderson
```

## Summary

* A recursive view is a view whose defining query references the view name.
* Use the `CREATE RECURSIVE VIEW` statement to create a recursive view.

