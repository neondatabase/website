---
prevPost: /postgresql/postgresql-jsonb_path_query-function
nextPost: /postgresql/postgresql-before-update-trigger
createdAt: 2024-03-22T02:49:10.000Z
title: 'PostgreSQL BOOL_AND() Function'
redirectFrom:
            - /postgresql/postgresql-bool_and 
            - /postgresql/postgresql-aggregate-functions/postgresql-bool_and
tableOfContents: true
---


**Summary**: in this tutorial, you will learn about the PostgreSQL `BOOL_AND()` function to aggregate boolean values across rows within a group.

## Introduction to the PostgreSQL BOOL_AND() function

The `BOOL_AND()` is an [aggregate function](/postgresql/postgresql-aggregate-functions) that allows you to aggregate boolean values across rows within a group.

The following shows the syntax of the `BOOL_AND()` function:

```sql
BOOL_AND(expression)
```

In this syntax:

- `expression`: This is a boolean expression to evaluate.

The `BOOL_AND()` function returns true if all values in the group are true, or false otherwise.

It's important to note that the `BOOL_AND()` function ignores `NULL`s within the group.

## PostgreSQL BOOL_AND() function examples

Let's explore some examples of using the `BOOL_AND()` function.

### 1) Setting up sample tables

First, [create tables](/postgresql/postgresql-create-table) called `teams` and `members`:

```sql
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL
);

CREATE TABLE projects(
    project_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOL,
    team_id INT NOT NULL REFERENCES teams(team_id)
);
```

Second, [insert rows](/postgresql/postgresql-insert-multiple-rows) into the tables:

```sql
INSERT INTO teams (team_name)
VALUES
('Team A'),
('Team B'),
('Team C')
RETURNING *;

INSERT INTO projects(name, active, team_id)
VALUES
('Intranet', false, 1),
('AI Chatbot', true, 1),
('Robot', true, 2),
('RPA', true, 2),
('Data Analytics', true, 3),
('BI', NULL, 3)
RETURNING *;
```

The `teams` table:

```
 team_id | team_name
---------+-----------
       1 | Team A
       2 | Team B
       3 | Team C
(3 rows)
```

The `members` table:

```
 project_id |      name      | active | team_id
------------+----------------+--------+---------
          1 | Intranet       | f      |       1
          2 | AI Chatbot     | t      |       1
          3 | Robot          | t      |       2
          4 | RPA            | t      |       2
          5 | Data Analytics | t      |       3
          6 | BI             | null   |       3
(6 rows)
```

### 2) Basic BOOL_AND() function example

The following example uses the `BOOL_AND()` function to test if all projects are active in the `projects` table:

```sql
SELECT
  BOOL_AND(active)
FROM
  projects;
```

Output:

```
 bool_and
----------
 f
(1 row)
```

The `BOOL_AND()` function returns true indicating that there are inactive projects in the `projects` table.

### 2) Using BOOL_AND() function with GROUP BY clause

The following example uses the `BOOL_AND()` function with the `GROUP BY` clause to check if there are active projects in each team:

```sql
SELECT
  team_name,
  BOOL_AND(active) active_projects
FROM
  projects
  INNER JOIN teams USING (team_id)
GROUP BY
  team_name;
```

Output:

```
 team_name | active_projects
-----------+-----------------
 Team A    | f
 Team B    | t
 Team C    | t
(3 rows)
```

The output indicates that teams B and C have projects that are active (or NULL) whereas team C has inactive projects.

### 3) Using BOOL_AND() function in HAVING clause

The following example uses the `BOOL_AND()` function with the `GROUP BY` and [HAVING](/postgresql/postgresql-having) clauses to retrieve teams that have active projects:

```sql
SELECT
  team_name,
  BOOL_AND(active) active_projects
FROM
  projects
  INNER JOIN teams USING (team_id)
GROUP BY
  team_name
HAVING
  BOOL_AND(active) = true;
```

Output:

```
 team_name | active_projects
-----------+-----------------
 Team B    | t
 Team C    | t
(2 rows)
```

## Summary

- Use the `BOOL_AND()` function to aggregate boolean values across rows, which returns true if all values are true or false otherwise.
-
- The `BOOL_AND()` function ignores NULLs in the group.
