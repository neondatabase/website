---
title: 'PostgreSQL Joins'
page_title: 'PostgreSQL Joins: A Visual Explanation of PostgreSQL Joins'
page_description: 'You will learn visually how to use various kinds of PostgreSQL joins including inner join, left join, right join, and outer join.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/'
ogImage: '/postgresqltutorial/PostgreSQL-Join-Inner-Join.png'
updatedOn: '2024-01-17T05:01:10+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL IS NULL'
  slug: 'postgresql-tutorial/postgresql-is-null'
nextLink:
  title: 'PostgreSQL Table Aliases'
  slug: 'postgresql-tutorial/postgresql-alias'
---

**Summary**: in this tutorial, you will learn about various kinds of PostgreSQL joins including inner join, left join, right join, and full outer join.

PostgreSQL join is used to combine columns from one ([self\-join](postgresql-self-join)) or more tables based on the values of the common columns between related tables. The common columns are typically the [primary key](postgresql-primary-key) columns of the first table and the [foreign key](postgresql-foreign-key) columns of the second table.

PostgreSQL supports [inner join](postgresql-inner-join), [left join](postgresql-left-join), [right join](postgresql-right-join), [full outer join](postgresql-full-outer-join), [cross join](postgresql-cross-join), [natural join](postgresql-natural-join), and a special kind of join called [self\-join](postgresql-self-join).

## Setting up sample tables

Suppose you have two tables called `teams` and `players`:

```sql
CREATE TABLE teams (
    id INT PRIMARY KEY,
    team VARCHAR (100) NOT NULL,
    city VARCHAR (100) NOT NULL
);

CREATE TABLE players (
    id INT PRIMARY KEY,
    team_id INT REFERENCES teams (id),
    player VARCHAR (100) NOT NULL,
    role VARCHAR (100) NOT NULL
);

INSERT INTO teams (id, team, city)
VALUES
    (1, 'Lions', 'Rome'),
    (2, 'Owls', 'Oslo'),
    (3, 'Bears', 'Bern'),
    (4, 'Sharks', 'Lima');

INSERT INTO players (id, team_id, player, role)
VALUES
    (1, 1, 'Ava', 'Guard'),
    (2, 1, 'Noah', 'Wing'),
    (3, 2, 'Emma', 'Back'),
    (4, NULL, 'Liam', 'Guard'),
    (5, NULL, 'Mia', 'Wing');
```

A team can have many players. Some players may not belong to a team yet, so their `team_id` is `NULL`.

The following statement returns data from the `teams` table:

```sql
SELECT * FROM teams;
```

Output:

```text
 id |  team  | city
----+--------+------
  1 | Lions  | Rome
  2 | Owls   | Oslo
  3 | Bears  | Bern
  4 | Sharks | Lima
(4 rows)
```

The following statement returns data from the `players` table:

```sql
SELECT * FROM players;
```

Output:

```
 id | team_id | player | role
----+---------+--------+-------
  1 |       1 | Ava    | Guard
  2 |       1 | Noah   | Wing
  3 |       2 | Emma   | Back
  4 |    null | Liam   | Guard
  5 |    null | Mia    | Wing
(5 rows)
```

## PostgreSQL inner join

The following statement joins the first table (`teams`) with the second table (`players`) by matching the values in the `id` and `team_id` columns:

```
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
INNER JOIN players
    ON teams.id = players.team_id;
```

Output:

```text
 team_id | team  | city | player_id | player | role
---------+-------+------+-----------+--------+-------
       1 | Lions | Rome |         1 | Ava    | Guard
       1 | Lions | Rome |         2 | Noah   | Wing
       2 | Owls  | Oslo |         3 | Emma   | Back
(3 rows)
```

The inner join examines each row in the first table (`teams`). It compares the value in the `id` column with the value in the `team_id` column of each row in the second table (`players`). If these values are equal, the inner join creates a new row that contains columns from both tables and adds this new row to the result set.

The following diagram illustrates the inner join:

![PostgreSQL Join - Inner Join](/postgresqltutorial/join.svg)

## PostgreSQL left join

The following statement uses the left join clause to join the `teams` table with the `players` table. In the left join context, the first table is called the left table and the second table is called the right table.

```
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
LEFT JOIN players
   ON teams.id = players.team_id;
```

Output:

```text
 team_id |  team  | city | player_id | player | role
---------+--------+------+-----------+--------+-------
       1 | Lions  | Rome |         1 | Ava    | Guard
       1 | Lions  | Rome |         2 | Noah   | Wing
       2 | Owls   | Oslo |         3 | Emma   | Back
       3 | Bears  | Bern |      null | null   | null
       4 | Sharks | Lima |      null | null   | null
(5 rows)
```

The left join starts selecting data from the left table. It compares values in the `id` column with the values in the `team_id` column in the `players` table.

If these values are equal, the left join creates a new row that contains columns of both tables and adds this new row to the result set. (see the first three rows in the result set).

In case the values do not equal, the left join also creates a new row that contains columns from both tables and adds it to the result set. However, it fills the columns of the right table (`players`) with null. (see the last two rows in the result set).

The following diagram illustrates the left join:

![PostgreSQL Join - Left Join](/postgresqltutorial/join-left.svg)
To select rows from the left table that do not have matching rows in the right table, you use the left join with a [`WHERE`](postgresql-where) clause. For example:

```sql
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
LEFT JOIN players
    ON teams.id = players.team_id
WHERE players.id IS NULL;
```

The output is:

```text
 team_id |  team  | city | player_id | player | role
---------+--------+------+-----------+--------+------
       3 | Bears  | Bern |      null | null   | null
       4 | Sharks | Lima |      null | null   | null
(2 rows)

```

Note that the `LEFT JOIN` is the same as the `LEFT OUTER JOIN` so you can use them interchangeably.

**Left Anti-Join:** The following diagram illustrates the left join that returns rows from the left table that do not have matching rows from the right table:

![PostgreSQL Left Anti-Join](/postgresqltutorial/join-left-anti.svg)

## PostgreSQL right join

The [right join](postgresql-right-join) is a reversed version of the left join. The right join starts selecting data from the right table. It compares each value in the `team_id` column of every row in the right table with each value in the `id` column of every row in the `teams` table.

If these values are equal, the right join creates a new row that contains columns from both tables.

In case these values are not equal, the right join also creates a new row that contains columns from both tables. However, it fills the columns in the left table with NULL.

The following statement uses the right join to join the `teams` table with the `players` table:

```sql
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
RIGHT JOIN players ON teams.id = players.team_id;
```

Here is the output:

```text
 team_id | team  | city | player_id | player | role
---------+-------+------+-----------+--------+-------
       1 | Lions | Rome |         1 | Ava    | Guard
       1 | Lions | Rome |         2 | Noah   | Wing
       2 | Owls  | Oslo |         3 | Emma   | Back
    null | null  | null |         4 | Liam   | Guard
    null | null  | null |         5 | Mia    | Wing
(5 rows)
```

The following Venn diagram illustrates the right join:

![PostgreSQL Join - Right Join](/postgresqltutorial/join-right.svg)
Similarly, you can get rows from the right table that do not have matching rows from the left table by adding a `WHERE` clause as follows:

```sql
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
RIGHT JOIN players
   ON teams.id = players.team_id
WHERE teams.id IS NULL;
```

Output:

```text
 team_id | team | city | player_id | player | role
---------+------+------+-----------+--------+-------
    null | null | null |         4 | Liam   | Guard
    null | null | null |         5 | Mia    | Wing
(2 rows)
```

The `RIGHT JOIN` and `RIGHT OUTER JOIN` are the same therefore you can use them interchangeably.

**Right Anti-Join:** The following diagram illustrates the right join that returns rows from the right table that do not have matching rows in the left table:

![PostgreSQL Right Anti-Join](/postgresqltutorial/join-right-anti.svg)

## PostgreSQL full outer join

The [full outer join](postgresql-full-outer-join) or full join returns a result set that contains all rows from both left and right tables, with the matching rows from both sides if available. In case there is no match, the columns of the table will be filled with NULL.

```sql
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
FULL OUTER JOIN players
    ON teams.id = players.team_id;
```

Output:

```text
 team_id |  team  | city | player_id | player | role
---------+--------+------+-----------+--------+-------
       1 | Lions  | Rome |         1 | Ava    | Guard
       1 | Lions  | Rome |         2 | Noah   | Wing
       2 | Owls   | Oslo |         3 | Emma   | Back
       3 | Bears  | Bern |      null | null   | null
       4 | Sharks | Lima |      null | null   | null
    null | null   | null |         4 | Liam   | Guard
    null | null   | null |         5 | Mia    | Wing
(7 rows)

```

The following diagram illustrates the full outer join:

![PostgreSQL Join - Full Outer Join](/postgresqltutorial/join-full.svg)
To return rows in a table that do not have matching rows in the other, you use the full join with a `WHERE` clause like this:

```sql
SELECT
    teams.id AS team_id,
    team,
    city,
    players.id AS player_id,
    player,
    role
FROM
    teams
FULL JOIN players
   ON teams.id = players.team_id
WHERE teams.id IS NULL OR players.id IS NULL;
```

Here is the result:

```
 team_id |  team  | city | player_id | player | role
---------+--------+------+-----------+--------+-------
       3 | Bears  | Bern |      null | null   | null
       4 | Sharks | Lima |      null | null   | null
    null | null   | null |         4 | Liam   | Guard
    null | null   | null |         5 | Mia    | Wing
(4 rows)
```

The following Venn diagram illustrates the full outer join that returns rows from a table that do not have the corresponding rows in the other table:

![PostgreSQL Join - Full Outer Join with Where](/postgresqltutorial/join-full-anti.svg)
The following picture shows all the PostgreSQL joins that we discussed so far with the detailed syntax:

![PostgreSQL Joins](/postgresqltutorial/postgresql-joins-all.jpg)
In this tutorial, you have learned how to use various kinds of PostgreSQL joins to combine data from multiple related tables.
