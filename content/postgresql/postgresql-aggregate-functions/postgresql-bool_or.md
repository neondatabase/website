---
title: 'PostgreSQL BOOL_OR() Function'
page_title: 'PostgreSQL BOOL_OR() Function'
page_description: 'In this tutorial, you will learn about the PostgreSQL BOOL_OR() function to aggregate boolean values across rows within a group.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-bool_or/'
ogImage: ''
updatedOn: '2024-03-22T02:28:16+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL STRING_AGG Function'
  slug: 'postgresql-aggregate-functions/postgresql-string_agg-function'
nextLink:
  title: 'PostgreSQL Date Functions'
  slug: 'postgresql-aggregate-functions/../postgresql-date-functions'
---

**Summary**: in this tutorial, you will learn about the PostgreSQL `BOOL_OR()` function to aggregate boolean values across rows within a group.

## Introduction to the PostgreSQL BOOL_OR() function

The `BOOL_OR()` is an aggregate function that allows you to aggregate boolean values across rows within a group.

Here’s the syntax of the `BOOL_OR()` function:

```sqlsql
bool_or(expression)
```

In this syntax, the `expression` is the boolean expression to evaluate.

The `BOOL_OR()` function returns true if at least one value in the group is true. If all values are false, the function returns false.

Please note that the `BOOL_OR` function ignores `NULL`s within the group.

## PostgreSQL BOOL_OR() function examples

Let’s explore some examples of using the `BOOL_OR()` function.

### 1\) Setting up sample tables

First, [create tables](../postgresql-tutorial/postgresql-create-table) called `teams` and `members`:

```sql
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

Second, [insert rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the tables:

```sql
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

```text
 team_id | team_name
---------+-----------
       1 | Team A
       2 | Team B
       3 | Team C
(3 rows)
```

The `members` table:

```text
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

### 2\) Basic BOOL_OR() function example

The following example uses the `BOOL_OR()` function to test if there are any active members in the `members` table:

```sql
SELECT
  BOOL_OR(active) active_member_exists
FROM
  members;
```

Output:

```text
 active_member_exists
----------------------
 t
(1 row)
```

The `BOOL_OR()` function returns true indicating that the `members` table has active members.

### 2\) Using BOOL_OR() function with GROUP BY clause

The following example uses the `BOOL_OR()` function with the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) clause to check if there are any active members in each team:

```sql
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

```text
 team_name | active_member_exists
-----------+----------------------
 Team A    | t
 Team B    | t
 Team C    | f
(3 rows)
```

The output indicates that teams A and B have active members whereas team C does not have any active members.

### 3\) Using BOOL_OR() function in HAVING clause

The following example uses the `BOOL_OR()` function with the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) and [HAVING](../postgresql-tutorial/postgresql-having) clauses to retrieve teams that have active members:

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
- The `BOOL_OR()` function ignores NULLs in the group.
