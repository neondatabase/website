---
title: 'PostgreSQL MAKE_INTERVAL() Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-make_interval/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `MAKE_INTERVAL()` function to create an interval from the interval's components

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL MAKE_INTERVAL() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `MAKE_INTERVAL()` function allows you to create an [interval](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-interval/) from years, months, weeks, days, hours, minutes, and seconds.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `MAKE_INTERVAL()` function:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
MAKE_INTERVAL ( [ years int [, months int [, weeks int [, days int [, hours int [, mins int [, secs double precision ]]]]]]] ) → interval
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `years` is an integer representing the number of years.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `months` is an integer representing the number of months.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `weeks` is an integer representing the number of weeks.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `days` is an integer representing the number of days.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `hours` is an integer representing the number of hours.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `mins` is an integer representing the number of minutes.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `secs` is a double-precision number representing the number of seconds.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

All of these parameters are optional and default to zero.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `MAKE_INTERVAL()` function returns a value of interval type.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Besides the `MAKE_INTERVAL()` function, you can use the `INTERVAL` literal syntax to create an interval:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INTERVAL 'X years Y months Z days W hours V minutes U seconds'
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `INTERVAL` literal syntax allows you to create an interval by specifying all components in a single string. It is suitable for creating static or predefined intervals.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

On the other hand, the `MAKE_INTERVAL()` function offers the flexibility to specify each component separately and is ideal for creating an interval dynamically. For example, you can use the `MAKE_INTERVAL()` function to create an interval from values stored in a table.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL MAKE_INTERVAL() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `MAKE_INTERVAL()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic MAKE_INTERVAL() function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `MAKE_INTERVAL()` function to create an interval that represents 1 year, 2 months, 3 days, and 4 hours:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  MAKE_INTERVAL(
    years => 3, months => 6, days => 15, hours => 4
  );
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
          make_interval
---------------------------------
 3 years 6 mons 15 days 04:00:00
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the MAKE_INTERVAL() function with default values

<!-- /wp:heading -->

<!-- wp:paragraph -->

All of the parameters of the `MAKE_INTERVAL()` function are optional and default to zero. For example, the following statement creates an interval zero:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT MAKE_INTERVAL();
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
 make_interval
---------------
 00:00:00
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the MAKE_INTERVAL( ) function with table data

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a new table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `time_data`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE time_data (
    id SERIAL PRIMARY KEY,
    year INTEGER,
    month INTEGER,
    day INTEGER,
    hour INTEGER,
    minute INTEGER,
    second INTEGER
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert some rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the time_data table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO time_data (year, month, day, hour, minute, second)
VALUES
    (1, 3, 25, 10, 0, 0),
    (2, 2, 25, 11, 30, 0),
    (3, 1, 25, 13, 15, 0)
RETURNING *;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id | year | month | day | hour | minute | second
----+------+-------+-----+------+--------+--------
  1 |    1 |     3 |  25 |   10 |      0 |      0
  2 |    2 |     2 |  25 |   11 |     30 |      0
  3 |    3 |     1 |  25 |   13 |     15 |      0
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, use the `MAKE_INTERVAL()` function to create intervals from the data stored in the `time_data` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  MAKE_INTERVAL(
    year, month, 0, day, hour, minute, second
  ) AS interval_data
FROM
  time_data;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
          interval_data
---------------------------------
 1 year 3 mons 25 days 10:00:00
 2 years 2 mons 25 days 11:30:00
 3 years 1 mon 25 days 13:15:00
(3 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `MAKE_INTERVAL()` function to construct an interval from the provided components, such as years, months, days, hours, minutes, and seconds.
- <!-- /wp:list-item -->

<!-- /wp:list -->
