---
title: 'PostgreSQL BOOL_OR() Function'
redirectFrom: 
            - /docs/postgresql/postgresql-aggregate-functions/postgresql-bool_or/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `BOOL_OR()` function to aggregate boolean values across rows within a group.



## Introduction to the PostgreSQL BOOL_OR() function



The `BOOL_OR()` is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that allows you to aggregate boolean values across rows within a group.



Here's the syntax of the `BOOL_OR()` function:



```
bool_or(expression)
```



In this syntax, the `expression` is the boolean expression to evaluate.



The `BOOL_OR()` function returns true if at least one value in the group is true. If all values are false, the function returns false.



Please note that the `BOOL_OR` function ignores `NULL`s within the group.



## PostgreSQL BOOL_OR() function examples



Let's explore some examples of using the `BOOL_OR()` function.



### 1) Setting up sample tables



First, [create tables](/docs/postgresql/postgresql-create-table) called `teams` and `members`:



```
CREATE TABLE teams (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL
);

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    member_name VARCHAR(100) NOT NULL,
    active bool,
    team_id INT REFERENCES teams(team_id)
);
```



Second, [insert rows](/docs/postgresql/postgresql-insert-multiple-rows) into the tables:



```
INSERT INTO teams (team_name)
VALUES
('Team A'),
('Team B'),
('Team C')
RETURNING *;

INSERT INTO members (member_name, team_id, active)
VALUES
('Alice', 1, true),
('Bob', 2, true),
('Charlie', 1, null),
('David', 2, false),
('Peter', 3, false),
('Joe', 3, null)
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
 member_id | member_name | active | team_id
-----------+-------------+--------+---------
         1 | Alice       | t      |       1
         2 | Bob         | t      |       2
         3 | Charlie     | null   |       1
         4 | David       | f      |       2
         5 | Peter       | f      |       3
         6 | Joe         | null   |       3
(6 rows)
```



### 2) Basic BOOL_OR() function example



The following example uses the `BOOL_OR()` function to test if there are any active members in the `members` table:



```
SELECT
  BOOL_OR(active) active_member_exists
FROM
  members;
```



Output:



```
 active_member_exists
----------------------
 t
(1 row)
```



The `BOOL_OR()` function returns true indicating that the `members` table has active members.



### 2) Using BOOL_OR() function with GROUP BY clause



The following example uses the `BOOL_OR()` function with the `GROUP BY` clause to check if there are any active members in each team:



```
SELECT
  team_name,
  BOOL_OR(active) active_member_exists
FROM
  members
  INNER JOIN teams USING (team_id)
GROUP BY
  team_name;
```



Output:



```
 team_name | active_member_exists
-----------+----------------------
 Team A    | t
 Team B    | t
 Team C    | f
(3 rows)
```



The output indicates that teams A and B have active members whereas team C does not have any active members.



### 3) Using BOOL_OR() function in HAVING clause



The following example uses the `BOOL_OR()` function with the `GROUP BY` and [HAVING](/docs/postgresql/postgresql-having) clauses to retrieve teams that have active members:



```
SELECT
  team_name,
  BOOL_OR(active) active_member_exists
FROM
  members
  INNER JOIN teams USING (team_id)
GROUP BY
  team_name
HAVING
  BOOL_OR(active) = true;
```



Output:



```
 team_name | active_member_exists
-----------+----------------------
 Team A    | t
 Team B    | t
(2 rows)
```



## Summary



- Use the `BOOL_OR()` function to aggregate boolean values across rows within a group.
- -
- The `BOOL_OR()` function ignores NULLs in the group.
- 
