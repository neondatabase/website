---
title: 'PostgreSQL DISTINCT ON'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-distinct-on/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DISTINCT ON` clause to retrieve distinct rows based on a specific column.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL DISTINCT ON clause

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `DISTINCT ON` clause allows you to retrieve unique rows based on specified columns. Here's the basic syntax of the `DISTINCT ON` clause:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  DISTINCT ON (column1, column2,...) column1,
  column2,
  ...
FROM
  table_name
ORDER BY
  column1,
  column2,
  ...;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `DISTINCT ON` clause retrieves the first unique entry from each column or combination of columns in a result set.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The key factor for determining which unique entry is selected lies in the columns that appear in the `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Technically, you can use the `DISTINCT ON` without the `ORDER BY` clause. However, without the `ORDER BY` clause, the "first" unique entry becomes unpredictable because the table stores the rows in an unspecified order.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Notice that you need to align the expression specified in the `DISTINCT ON` clause with the leftmost expression in the `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL DISTINCT ON example

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take an example of using the `DISTINCT ON` clause to understand it better.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called student `scores` to store the student's scores:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
CREATE TABLE student_scores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert-multiple-rows/) into the `student_scores` table:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
INSERT INTO student_scores (name, subject, score)
VALUES
  ('Alice', 'Math', 90),
  ('Bob', 'Math', 85),
  ('Alice', 'Physics', 92),
  ('Bob', 'Physics', 88),
  ('Charlie', 'Math', 95),
  ('Charlie', 'Physics', 90);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In the table, each student has both scores in `Math` and `Physics`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Third, retrieve the highest score for each student in either `Math` or `Physics` using the `DISTINCT ON` clause:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
  DISTINCT ON (name) name,
  subject,
  score
FROM
  student_scores
ORDER BY
  name,
  score DESC;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
  name   | subject | score
---------+---------+-------
 Alice   | Physics |    92
 Bob     | Physics |    88
 Charlie | Math    |    95
(3 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The output returns the highest score of each student in whatever subject, `Math` or `Physics`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The result set includes a unique combination of names along with the corresponding subject and score. The `ORDER BY` clause is important because it helps determine which row to retain in case of duplicate.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

In this example, the `DISTINCT ON` clause keeps the row with the highest scores because the `ORDER BY` clause sorts the names and scores in descending order.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the `DISTINCT ON` clause to keep the first unique entry from each column or combination of columns in a result set.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- Always use the `ORDER BY` clause to determine which entry to retain in the result set.
- <!-- /wp:list-item -->

<!-- /wp:list -->
