---
title: 'PostgreSQL BOOL_AND() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-bool_and/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL `BOOL_AND()` function to aggregate boolean values across rows within a group.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL BOOL_AND() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `BOOL_AND()` is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that allows you to aggregate boolean values across rows within a group.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following shows the syntax of the `BOOL_AND()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
BOOL_AND(expression)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `expression`: This is a boolean expression to evaluate.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `BOOL_AND()` function returns true if all values in the group are true, or false otherwise.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

It's important to note that the `BOOL_AND()` function ignores `NULL`s within the group.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL BOOL_AND() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `BOOL_AND()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create tables](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `teams` and `members`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

The `teams` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 team_id | team_name
---------+-----------
       1 | Team A
       2 | Team B
       3 | Team C
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `members` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Basic BOOL_AND() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `BOOL_AND()` function to test if all projects are active in the `projects` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  BOOL_AND(active)
FROM
  projects;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 bool_and
----------
 f
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `BOOL_AND()` function returns true indicating that there are inactive projects in the `projects` table.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using BOOL_AND() function with GROUP BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `BOOL_AND()` function with the `GROUP BY` clause to check if there are active projects in each team:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  team_name,
  BOOL_AND(active) active_projects
FROM
  projects
  INNER JOIN teams USING (team_id)
GROUP BY
  team_name;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 team_name | active_projects
-----------+-----------------
 Team A    | f
 Team B    | t
 Team C    | t
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that teams B and C have projects that are active (or NULL) whereas team C has inactive projects.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using BOOL_AND() function in HAVING clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `BOOL_AND()` function with the `GROUP BY` and [HAVING](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-having/) clauses to retrieve teams that have active projects:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 team_name | active_projects
-----------+-----------------
 Team B    | t
 Team C    | t
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `BOOL_AND()` function to aggregate boolean values across rows, which returns true if all values are true or false otherwise.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The `BOOL_AND()` function ignores NULLs in the group.
- <!-- /wp:list-item -->

<!-- /wp:list -->
