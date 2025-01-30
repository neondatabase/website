---
title: 'Creating PostgreSQL Updatable Views'
page_title: 'PostgreSQL Updatable Views'
page_description: 'In this tutorial, we will show you the requirements of PostgreSQL updatable views and how to create updatable views.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-views/postgresql-updatable-views/'
ogImage: ''
updatedOn: '2024-03-16T04:21:16+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL Drop View'
  slug: 'postgresql-views/postgresql-drop-view'
nextLink:
  title: 'PostgreSQL WITH CHECK OPTION'
  slug: 'postgresql-views/postgresql-views-with-check-option'
---

**Summary**: in this tutorial, you will learn how to create PostgreSQL updatable views used for modifying data in the underlying table.

## Introduction to PostgreSQL updatable views

In PostgreSQL, a view is a named query stored in the database server. A view can be updatable if it meets certain conditions. This means that you can [insert](../postgresql-tutorial/postgresql-insert), [update](../postgresql-tutorial/postgresql-update), or [delete](../postgresql-tutorial/postgresql-delete) data from the underlying tables via the view.

A view is updatable when it meets the following conditions:

First, the defining query of the view must have exactly one entry in the `FROM` clause, which can be a table or another updatable view.

Second, the defining query must not contain one of the following clauses at the top level:

- [GROUP BY](../postgresql-tutorial/postgresql-group-by)
- [HAVING](../postgresql-tutorial/postgresql-having)
- [LIMIT](../postgresql-tutorial/postgresql-limit)
- [OFFSET FETCH](../postgresql-tutorial/postgresql-fetch)
- [DISTINCT](../postgresql-tutorial/postgresql-select-distinct)
- [WITH](../postgresql-tutorial/postgresql-cte)
- [UNION](../postgresql-tutorial/postgresql-union)
- [INTERSECT](../postgresql-tutorial/postgresql-intersect)
- [EXCEPT](https://neon.tech/postgresql/postgresql-tutorial/postgresql-tutorial/postgresql-except/)

Third, the selection list of the defining query must not contain any:

- [Window functions](../postgresql-window-function)
- [Set\-returning function](../postgresql-plpgsql/plpgsql-function-returns-a-table)
- [Aggregate functions](../postgresql-aggregate-functions)

An updatable view may contain both updatable and non\-updatable columns. If you attempt to modify a non\-updatable column, PostgreSQL will raise an error.

When you execute a modification statement such as [INSERT](../postgresql-tutorial/postgresql-insert), [UPDATE](../postgresql-tutorial/postgresql-update), or [DELETE](../postgresql-tutorial/postgresql-delete) to an updatable view, PostgreSQL will convert this statement into the corresponding statement of the underlying table.

If you have a [`WHERE`](../postgresql-tutorial/postgresql-where) condition in the defining query of a view, you still can update or delete the rows that are not visible through the view. However, if you want to avoid this, you can use the `WITH CHECK OPTION` to define the view.

## PostgreSQL updatable views examples

We’ll take some examples of creating updatable views.

### Setting up a sample table

The following statements create a table called `cities` and [insert some rows](../postgresql-tutorial/postgresql-insert-multiple-rows) into the table:

```phpsql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY ,
    name VARCHAR(255),
    population INT,
    country VARCHAR(50)
);

INSERT INTO cities (name, population, country)
VALUES
    ('New York', 8419600, 'US'),
    ('Los Angeles', 3999759, 'US'),
    ('Chicago', 2716000, 'US'),
    ('Houston', 2323000, 'US'),
    ('London', 8982000, 'UK'),
    ('Manchester', 547627, 'UK'),
    ('Birmingham', 1141816, 'UK'),
    ('Glasgow', 633120, 'UK'),
    ('San Francisco', 884363, 'US'),
    ('Seattle', 744955, 'US'),
    ('Liverpool', 498042, 'UK'),
    ('Leeds', 789194, 'UK'),
    ('Austin', 978908, 'US'),
    ('Boston', 694583, 'US'),
    ('Manchester', 547627, 'UK'),
    ('Sheffield', 584853, 'UK'),
    ('Philadelphia', 1584138, 'US'),
    ('Phoenix', 1680992, 'US'),
    ('Bristol', 463377, 'UK'),
    ('Detroit', 673104, 'US');

SELECT * FROM cities;
```

### 1\) Creating an updatable view

First, [create an updatable view](managing-postgresql-views) called `city_us` that includes cities in the US only:

```sql
CREATE VIEW city_us
AS
SELECT
  *
FROM
  cities
WHERE
  country = 'US';
```

Second, insert a new row into the `cities` table via the `city_us` view:

```sql
INSERT INTO city_us(name, population, country)
VALUES ('San Jose', 983459, 'US');
```

Third, retrieve data from `cities` table:

```sql
SELECT * FROM cities
WHERE name = 'San Jose';
```

Output:

```text
 id |   name   | population | country
----+----------+------------+---------
 21 | San Jose |     983459 | US
(1 row)
```

Fourth, update the data in the cities table via the city_us view:

```
UPDATE city_us
SET population = 1000000
WHERE name = 'New York';
```

Fifth, verify the update:

```sql
SELECT * FROM cities
WHERE name = 'New York';
```

Output:

```text
 id |   name   | population | country
----+----------+------------+---------
  1 | New York |    1000000 | US
(1 row)
```

Sixth, delete a row from the `cities` table via the `city_us` view:

```
DELETE FROM city_us
WHERE id = 21;
```

Finally, verify the delete:

```sql
SELECT * FROM cities
WHERE id = 21;
```

Output:

```
 id | name | population | country
----+------+------------+---------
(0 rows)
```

The row with id 21 has been deleted.

## Summary

- A view can be updatable when its defining query meets certain conditions.
