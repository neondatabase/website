---
title: 'Creating PostgreSQL Updatable Views'
redirectFrom: 
            - /docs/postgresql/postgresql-views/postgresql-updatable-views/
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to create PostgreSQL updatable views used for modifying data in the underlying table.



## Introduction to PostgreSQL updatable views



In PostgreSQL, a [view](https://www.postgresqltutorial.com/postgresql-views/) is a named query stored in the database server. A view can be updatable if it meets certain conditions. This means that you can [insert](/docs/postgresql/postgresql-insert/), [update](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/), or [delete](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete) data from the underlying tables via the view.



A view is updatable when it meets the following conditions:



First, the defining query of the view must have exactly one entry in the `FROM` clause, which can be a table or another updatable view.



Second, the defining query must not contain one of the following clauses at the top level:



- [GROUP BY](/docs/postgresql/postgresql-group-by)
- [HAVING](/docs/postgresql/postgresql-having)
- [LIMIT](/docs/postgresql/postgresql-limit)
- [OFFSET FETCH](/docs/postgresql/postgresql-fetch)
- [DISTINCT](/docs/postgresql/postgresql-select-distinct)
- [WITH](/docs/postgresql/postgresql-cte)
- [UNION](/docs/postgresql/postgresql-union)
- [INTERSECT](/docs/postgresql/postgresql-intersect)
- [EXCEPT](/docs/postgresql/postgresql-tutorial/postgresql-except)


Third, the selection list of the defining query must not contain any:



- [Window functions](https://www.postgresqltutorial.com/postgresql-window-function/)
- [Set-returning function](https://www.postgresqltutorial.com/postgresql-plpgsql/plpgsql-function-returns-a-table/)
- [Aggregate functions](https://www.postgresqltutorial.com/postgresql-aggregate-functions/)


An updatable view may contain both updatable and non-updatable columns. If you attempt to modify a non-updatable column, PostgreSQL will raise an error.



When you execute a modification statement such as [INSERT](/docs/postgresql/postgresql-insert/), [UPDATE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-update/), or [DELETE](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-delete) to an updatable view, PostgreSQL will convert this statement into the corresponding statement of the underlying table.



If you have a `WHERE` condition in the defining query of a view, you still can update or delete the rows that are not visible through the view. However, if you want to avoid this, you can use the `WITH CHECK OPTION` to define the view.



## PostgreSQL updatable views examples



We'll take some examples of creating updatable views.



### Setting up a sample table



The following statements create a table called `cities` and [insert some rows](/docs/postgresql/postgresql-insert-multiple-rows) into the table:



```
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



### 1) Creating an updatable view



First, [create an updatable view](https://www.postgresqltutorial.com/postgresql-views/managing-postgresql-views/) called `city_us` that includes cities in the US only:



```
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



```
INSERT INTO city_us(name, population, country)
VALUES ('San Jose', 983459, 'US');
```



Third, retrieve data from `cities` table:



```
SELECT * FROM cities
WHERE name = 'San Jose';
```



Output:



```
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



```
SELECT * FROM cities
WHERE name = 'New York';
```



Output:



```
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



```
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
