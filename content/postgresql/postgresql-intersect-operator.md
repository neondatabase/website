---
title: 'PostgreSQL INTERSECT Operator'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-intersect/
ogImage: ./img/wp-content-uploads-2016-06-PostgreSQL-INTERSECT-Operator-300x206.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `INTERSECT` operator to combine result sets of two or more queries.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL INTERSECT operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

Like the [UNION](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-union/) and [EXCEPT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-except/) operators, the PostgreSQL `INTERSECT` operator combines result sets of two [SELECT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-except/) statements into a single result set. The `INTERSECT` operator returns a result set containing rows available in both results sets.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here is the basic syntax of the `INTERSECT` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT select_list
FROM A
INTERSECT
SELECT select_list
FROM B;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To use the `INTERSECT` operator, the columns that appear in the `SELECT` statements must follow these rules:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The number of columns and their order in queries must be the same.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The [data types](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-data-types/) of the columns in the queries must be compatible.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The following diagram illustrates how the `INTERSECT` operator combines the result sets A and B. The final result set is represented by the yellow area where circle A intersects circle B.

<!-- /wp:paragraph -->

<!-- wp:image {"id":2243,"align":"center"} -->

![PostgreSQL INTERSECT Operator](./img/wp-content-uploads-2016-06-PostgreSQL-INTERSECT-Operator-300x206.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### PostgreSQL INTERSECT with ORDER BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

If you want to sort the result set returned by the `INTERSECT` operator, you place the `ORDER BY` after the final query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT select_list
FROM A
INTERSECT
SELECT select_list
FROM B
ORDER BY sort_expression;
```

<!-- /wp:code -->

<!-- wp:heading -->

## Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

We'll create two tables `top_rated_films` and `most_popular_films` for demonstration:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE top_rated_films(
  title VARCHAR NOT NULL,
  release_year SMALLINT
);

CREATE TABLE most_popular_films(
  title VARCHAR NOT NULL,
  release_year SMALLINT
);

INSERT INTO top_rated_films(title, release_year)
VALUES
   ('The Shawshank Redemption', 1994),
   ('The Godfather', 1972),
   ('The Dark Knight', 2008),
   ('12 Angry Men', 1957);

INSERT INTO most_popular_films(title, release_year)
VALUES
  ('An American Pickle', 2020),
  ('The Godfather', 1972),
  ('The Dark Knight', 2008),
  ('Greyhound', 2020);

SELECT * FROM top_rated_films;
SELECT * FROM most_popular_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The contents of the `top_rated_films` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
          title           | release_year
--------------------------+--------------
 The Shawshank Redemption |         1994
 The Godfather            |         1972
 The Dark Knight          |         2008
 12 Angry Men             |         1957
(4 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The contents of the `most_popular_films` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
       title        | release_year
--------------------+--------------
 An American Pickle |         2020
 The Godfather      |         1972
 The Dark Knight    |         2008
 Greyhound          |         2020
(4 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## PostgreSQL INTERSECT operator examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's explore some examples of using the `INTERSECT` operator.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic INTERSECT operator example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `INTERSECT` operator to retrieve the popular films that are also top-rated:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM most_popular_films
INTERSECT
SELECT *
FROM top_rated_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
      title      | release_year
-----------------+--------------
 The Godfather   |         1972
 The Dark Knight |         2008
(2 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result set returns one film that appears on both tables.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using the INTERSECT operator with ORDER BY clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `INTERSECT` operator to find the most popular films which are also the top-rated films and sort the films by release year:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT *
FROM most_popular_films
INTERSECT
SELECT *
FROM top_rated_films
ORDER BY release_year;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"plaintext"} -->

```
      title      | release_year
-----------------+--------------
 The Godfather   |         1972
 The Dark Knight |         2008
(2 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `INTERSECT` operator to combine two result sets and return a single result set containing rows appearing in both.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Place the `ORDER BY` clause after the second query to sort the rows in the result set returned by the `INTERSECT` operator.
- <!-- /wp:list-item -->

<!-- /wp:list -->
