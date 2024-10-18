---
title: 'PostgreSQL CURRENT_TIME Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-current_time/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `CURRENT_TIME` function to get the current time with the timezone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL CURRENT_TIME function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following illustrates the syntax of the `CURRENT_TIME` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CURRENT_TIME(precision)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `CURRENT_TIME` function accepts one optional argument `precision`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `precision` specifies the returned fractional seconds precision. If you omit the `precision` argument, the result will include the full available precision.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `CURRENT_TIME` function returns a `TIME WITH TIME ZONE` value that represents the current time with the timezone.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL CURRENT_TIME function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `CURRENT_TIME` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL CURRENT_TIME function example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the CURRENT_TIME function to get the current time with the timezone:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT CURRENT_TIME;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output is a `TIME WITH TIME ZONE` value as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    current_time
--------------------
 14:42:10.884946-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we don't specify the precision argument. Therefore, the result includes the full precision available.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL CURRENT_TIME function with a precision example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example shows how to use the `CURRENT_TIME` function with the precision set to 2:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT CURRENT_TIME(2);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
  current_time
----------------
 14:44:35.03-07
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 3) Using the CURRENT_TIME function as the default value of a column

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `CURRENT_TIME` function can be used as the default value of `TIME` columns. For example:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `log`:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE log (
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIME DEFAULT CURRENT_TIME,
    created_on DATE DEFAULT CURRENT_DATE
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `log` table has the `created_at` column with the default value is the result of the `CURRENT_TIME` function.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Second, [insert a row](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `log` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO log( message )
VALUES('Testing the CURRENT_TIME function');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the statement, we only specify a value for the `message` column. Therefore, other columns will take the default values.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, check whether the row was inserted into the `log` table with the `created_at` column populated correctly by using the following [query](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/):

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT * FROM log;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following picture shows the result:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 id |              message              |   created_at    | created_on
----+-----------------------------------+-----------------+------------
  1 | Testing the CURRENT_TIME function | 14:46:28.188809 | 2024-01-26
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `created_at` column is populated with the time at which the `INSERT` statement executed.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `CURRENT_TIME` function to get the current time with the default timezone.
- <!-- /wp:list-item -->

<!-- /wp:list -->
