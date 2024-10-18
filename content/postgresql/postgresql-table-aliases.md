---
title: 'PostgreSQL Table Aliases'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-alias/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn about the PostgreSQL table aliases and their practical applications.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL table aliases

<!-- /wp:heading -->

<!-- wp:paragraph -->

A table alias is a feature in SQL that allows you to assign a temporary name to a table during the execution of a query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following illustrates the syntax of defining a table alias:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
table_name AS alias_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `table_name`: Specify the name of the table that you want to give an alias.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `alias_name`: Provide the alias for the table.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

Like [column aliases](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-column-alias/), the `AS` keyword is optional, meaning that you can omit it like this:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
table_name alias_name
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL table alias examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using table aliases.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL table alias example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses a table alias to retrieve five titles from the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT f.title
FROM film AS f
ORDER BY f.title
LIMIT 5;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
      title
------------------
 Academy Dinosaur
 Ace Goldfinger
 Adaptation Holes
 Affair Prejudice
 African Egg
(5 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this example, we assign the `film` table an alias `f` and use the table alias to fully qualify the `title` column.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Since the `AS` keyword is optional, you can remove it as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT f.title
FROM film f
ORDER BY f.title
LIMIT 5;
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using table aliases in join clauses

<!-- /wp:heading -->

<!-- wp:paragraph -->

Typically, you use table aliases in a query that has a [join](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/) clause to retrieve data from multiple related tables that share the same column name.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

If you use the same column name that comes from multiple tables in the same query without fully qualifying them, you will get an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To avoid this error, you can qualify the columns using the following syntax:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
table_name.column_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If the table has an alias, you can qualify its column using the alias:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
alias.column_name
```

<!-- /wp:code -->

<!-- wp:paragraph -->

For example, the following query uses an `INNER JOIN` clause to retrieve data from the `customer` and `payment` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  c.customer_id,
  c.first_name,
  p.amount,
  p.payment_date
FROM
  customer c
  INNER JOIN payment p ON p.customer_id = c.customer_id
ORDER BY
  p.payment_date DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 customer_id | first_name  | amount |        payment_date
-------------+-------------+--------+----------------------------
          94 | Norma       |   4.99 | 2007-05-14 13:44:29.996577
         264 | Gwendolyn   |   2.99 | 2007-05-14 13:44:29.996577
         263 | Hilda       |   0.99 | 2007-05-14 13:44:29.996577
         252 | Mattie      |   4.99 | 2007-05-14 13:44:29.996577
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

Note that you'll learn about [INNER JOIN](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-inner-join/) in the upcoming tutorial.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) Using table aliases in self-join

<!-- /wp:heading -->

<!-- wp:paragraph -->

When you join a table to itself (a.k.a [self-join](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-self-join/)), you need to use table aliases. This is because referencing the same table multiple times within a query will result in an error.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following example shows how to reference the `film` table twice in the same query using the table aliases:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    f1.title,
    f2.title,
    f1.length
FROM
    film f1
INNER JOIN film f2
    ON f1.film_id <> f2.film_id AND
       f1.length = f2.length;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
            title            |            title            | length
-----------------------------+-----------------------------+--------
 Chamber Italian             | Resurrection Silverado      |    117
 Chamber Italian             | Magic Mallrats              |    117
 Chamber Italian             | Graffiti Love               |    117
 Chamber Italian             | Affair Prejudice            |    117
 Grosse Wonderful            | Hurricane Affair            |     49
 Grosse Wonderful            | Hook Chariots               |     49
 Grosse Wonderful            | Heavenly Gun                |     49
 Grosse Wonderful            | Doors President             |     49
...
```

<!-- /wp:code -->

<!-- wp:paragraph {"className":"note"} -->

Note that you'll learn about [self-join](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-inner-join/) in the upcoming tutorial.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use PostgreSQL table aliases to assign a temporary name to a table during the execution of a query.
- <!-- /wp:list-item -->

<!-- /wp:list -->
