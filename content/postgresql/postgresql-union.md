---
title: 'PostgreSQL UNION'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-union/
ogImage: ./img/wp-content-uploads-2020-07-PostgresQL-UNION.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UNION` operator to combine result sets of multiple queries into a single result set.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL UNION operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `UNION` operator allows you to combine the result sets of two or more `SELECT` statements into a single result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the basic syntax of the `UNION` operator:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT select_list
FROM A
UNION
SELECT select_list
FROM B;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the queries must conform to the following rules:

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- The number and the order of the columns in the select list of both queries must be the same.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- The data types of the columns in select lists of the queries must be compatible.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `UNION` operator removes all duplicate rows from the combined data set. To retain the duplicate rows, you use the the `UNION ALL` instead.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Here's the syntax of the `UNION ALL` operator:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT select_list
FROM A
UNION ALL
SELECT select_list
FROM B;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following Venn diagram illustrates how the `UNION` works:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5264,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-07-PostgresQL-UNION.png)

<!-- /wp:image -->

<!-- wp:heading {"level":3} -->

### PostgreSQL UNION with ORDER BY clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `UNION` and `UNION ALL` operators may order the rows in the final result set in an unspecified order. For example, it may place rows from the second result set before/after the row from the first result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

To sort rows in the final result set, you specify the `ORDER BY` clause after the second query:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT select_list
FROM A
UNION
SELECT select_list
FROM B
ORDER BY sort_expression;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Note that if you use the `ORDER BY` clause in the first query, PostgreSQL will issue an error.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Setting up sample tables

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statements create two tables `top_rated_films` and `most_popular_films`, and insert data into these tables:

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
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement retrieves data from the `top_rated_films` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM top_rated_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

The following statement retrieves data from the `most_popular_films` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM most_popular_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

## PostgreSQL UNION examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using the PostgreSQL `UNION` operator.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL UNION example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `UNION` operator to combine data from the queries that retrieve data from the `top_rated_films` and `most_popular_films`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM top_rated_films
UNION
SELECT * FROM most_popular_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
          title           | release_year
--------------------------+--------------
 An American Pickle       |         2020
 The Dark Knight          |         2008
 Greyhound                |         2020
 The Shawshank Redemption |         1994
 The Godfather            |         1972
 12 Angry Men             |         1957
(6 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The result set includes six rows because the `UNION` operator removes two duplicate rows.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) PostgreSQL UNION ALL example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following statement uses the `UNION ALL` operator to combine result sets from queries that retrieve data from `top_rated_films` and `most_popular_films` tables:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM top_rated_films
UNION ALL
SELECT * FROM most_popular_films;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
          title           | release_year
--------------------------+--------------
 The Shawshank Redemption |         1994
 The Godfather            |         1972
 The Dark Knight          |         2008
 12 Angry Men             |         1957
 An American Pickle       |         2020
 The Godfather            |         1972
 The Dark Knight          |         2008
 Greyhound                |         2020
(8 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output indicates that the `UNION ALL` operator retains the duplicate rows.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 3) PostgreSQL UNION ALL with ORDER BY clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

To sort the result returned by the `UNION` operator, you place the `ORDER BY` clause after the second query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT * FROM top_rated_films
UNION ALL
SELECT * FROM most_popular_films
ORDER BY title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
          title           | release_year
--------------------------+--------------
 12 Angry Men             |         1957
 An American Pickle       |         2020
 Greyhound                |         2020
 The Dark Knight          |         2008
 The Dark Knight          |         2008
 The Godfather            |         1972
 The Godfather            |         1972
 The Shawshank Redemption |         1994
(8 rows)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `UNION` to combine result sets of two queries and return distinct rows.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Use the `UNION ALL` to combine the result sets of two queries but retain the duplicate rows.
- <!-- /wp:list-item -->

<!-- /wp:list -->
