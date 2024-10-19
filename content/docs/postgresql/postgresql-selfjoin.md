---
title: 'PostgreSQL Self-Join'
redirectFrom: 
            - /docs/postgresql/postgresql-tutorial/postgresql-self-join
            - /docs/postgresql/postgresql-self-join
ogImage: /postgresqltutorial_data/wp-content-uploads-2018-03-PostgreSQL-Self-Join-Reporting-Structure.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL self-join technique to compare rows within the same table.

## Introduction to PostgreSQL self-join

A self-join is a regular join that joins a table to itself. In practice, you typically use a self-join to query hierarchical data or to compare rows within the same table.

To form a self-join, you specify the same table twice with [different table aliases](/docs/postgresql/postgresql-alias) and provide the join predicate after the `ON` keyword.

The following query uses an `INNER JOIN` that joins the table to itself:

```
SELECT select_list
FROM table_name t1
INNER JOIN table_name t2 ON join_predicate;
```

In this syntax, the `table_name` is joined to itself using the `INNER JOIN` clause.

Alternatively, you can use the `LEFT JOIN` or `RIGHT JOIN` clause to join the table to itself like this:

```
SELECT select_list
FROM table_name t1
LEFT JOIN table_name t2 ON join_predicate;
```

## PostgreSQL self-join examples

Let's take some examples of using self-joins.

### 1) Querying hierarchical data example

Let's set up a sample table for the demonstration.

Suppose, you have the following organizational structure:

![PostgreSQL Self Join - Reporting Structure](/postgresqltutorial_data/wp-content-uploads-2018-03-PostgreSQL-Self-Join-Reporting-Structure.png)

The following statements create the `employee` table and insert some sample data into the table.

```
CREATE TABLE employee (
  employee_id INT PRIMARY KEY,
  first_name VARCHAR (255) NOT NULL,
  last_name VARCHAR (255) NOT NULL,
  manager_id INT,
  FOREIGN KEY (manager_id) REFERENCES employee (employee_id) ON DELETE CASCADE
);
INSERT INTO employee (employee_id, first_name, last_name, manager_id)
VALUES
  (1, 'Windy', 'Hays', NULL),
  (2, 'Ava', 'Christensen', 1),
  (3, 'Hassan', 'Conner', 1),
  (4, 'Anna', 'Reeves', 2),
  (5, 'Sau', 'Norman', 2),
  (6, 'Kelsie', 'Hays', 3),
  (7, 'Tory', 'Goff', 3),
  (8, 'Salley', 'Lester', 3);

SELECT * FROM employee;
```

Output:

```
 employee_id | first_name |  last_name  | manager_id
-------------+------------+-------------+------------
           1 | Windy      | Hays        |       null
           2 | Ava        | Christensen |          1
           3 | Hassan     | Conner      |          1
           4 | Anna       | Reeves      |          2
           5 | Sau        | Norman      |          2
           6 | Kelsie     | Hays        |          3
           7 | Tory       | Goff        |          3
           8 | Salley     | Lester      |          3
(8 rows)
```

In this `employee` table, the `manager_id` column references the `employee_id` column.

The `manager_id` column indicates the direct relationship, showing the manager to whom the employee reports.

If the `manager_id` column contains NULL, which signifies that the respective employee does not report to anyone, essentially holding the top managerial position.

The following query uses the self-join to find who reports to whom:

```
SELECT
  e.first_name || ' ' || e.last_name employee,
  m.first_name || ' ' || m.last_name manager
FROM
  employee e
  INNER JOIN employee m ON m.employee_id = e.manager_id
ORDER BY
  manager;
```

Output:

```
    employee     |     manager
-----------------+-----------------
 Sau Norman      | Ava Christensen
 Anna Reeves     | Ava Christensen
 Salley Lester   | Hassan Conner
 Kelsie Hays     | Hassan Conner
 Tory Goff       | Hassan Conner
 Ava Christensen | Windy Hays
 Hassan Conner   | Windy Hays
(7 rows)
```

This query references the `employees` table twice, one as the employee and the other as the manager. It uses table aliases `e` for the employee and `m` for the manager.

The join predicate finds the employee/manager pair by matching values in the `employee_id` and `manager_id` columns.

Notice that the top manager does not appear on the output.

To include the top manager in the result set, you use the `LEFT JOIN` instead of `INNER JOIN` clause as shown in the following query:

```
SELECT
  e.first_name || ' ' || e.last_name employee,
  m.first_name || ' ' || m.last_name manager
FROM
  employee e
  LEFT JOIN employee m ON m.employee_id = e.manager_id
ORDER BY
  manager;
```

Output:

```
    employee     |     manager
-----------------+-----------------
 Anna Reeves     | Ava Christensen
 Sau Norman      | Ava Christensen
 Salley Lester   | Hassan Conner
 Kelsie Hays     | Hassan Conner
 Tory Goff       | Hassan Conner
 Hassan Conner   | Windy Hays
 Ava Christensen | Windy Hays
 Windy Hays      | null
(8 rows)
```

### 2) Comparing the rows with the same table

See the following `film` table from the DVD rental database:

![Film Table](/postgresqltutorial_data/wp-content-uploads-2018-03-film_table.png)

The following query finds all pairs of films that have the same length,

```
SELECT
  f1.title,
  f2.title,
  f1.length
FROM
  film f1
  INNER JOIN film f2 ON f1.film_id > f2.film_id
  AND f1.length = f2.length;
```

Output:

```
           title           |            title            | length
---------------------------+-----------------------------+--------
 Chamber Italian           | Affair Prejudice            |    117
 Grosse Wonderful          | Doors President             |     49
 Bright Encounters         | Bedazzled Married           |     73
 Date Speed                | Crow Grease                 |    104
 Annie Identity            | Academy Dinosaur            |     86
 Anything Savannah         | Alone Trip                  |     82
 Apache Divine             | Anaconda Confessions        |     92
 Arabia Dogma              | Airplane Sierra             |     62
 Dying Maker               | Antitrust Tomatoes          |    168
...
```

The join predicate matches two different films (`f1.film_id > f2.film_id`) that have the same length (`f1.length = f2.length`)

## Summary

- A PostgreSQL self-join is a regular join that joins a table to itself using the `INNER JOIN` or `LEFT JOIN`.
- Self-joins are very useful for querying hierarchical data or comparing rows within the same table.
