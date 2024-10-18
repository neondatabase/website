---
title: 'PostgreSQL INTERSECT Operator'
redirectFrom: 
            - /docs/postgresql/postgresql-intersect
ogImage: /postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-INTERSECT-Operator-300x206.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `INTERSECT` operator to combine result sets of two or more queries.





## Introduction to PostgreSQL INTERSECT operator





Like the [UNION](/docs/postgresql/postgresql-union/) and [EXCEPT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-except/) operators, the PostgreSQL `INTERSECT` operator combines result sets of two [SELECT](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-except) statements into a single result set. The `INTERSECT` operator returns a result set containing rows available in both results sets.





Here is the basic syntax of the `INTERSECT` operator:





```
SELECT select_list
FROM A
INTERSECT
SELECT select_list
FROM B;
```





To use the `INTERSECT` operator, the columns that appear in the `SELECT` statements must follow these rules:





- The number of columns and their order in queries must be the same.
-
- The [data types](/docs/postgresql/postgresql-data-types) of the columns in the queries must be compatible.





The following diagram illustrates how the `INTERSECT` operator combines the result sets A and B. The final result set is represented by the yellow area where circle A intersects circle B.





![PostgreSQL INTERSECT Operator](/postgresqltutorial_data/wp-content-uploads-2016-06-PostgreSQL-INTERSECT-Operator-300x206.png)





### PostgreSQL INTERSECT with ORDER BY clause





If you want to sort the result set returned by the `INTERSECT` operator, you place the `ORDER BY` after the final query:





```
SELECT select_list
FROM A
INTERSECT
SELECT select_list
FROM B
ORDER BY sort_expression;
```





## Setting up sample tables





We'll create two tables `top_rated_films` and `most_popular_films` for demonstration:





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





The contents of the `top_rated_films` table:





```
          title           | release_year
--------------------------+--------------
 The Shawshank Redemption |         1994
 The Godfather            |         1972
 The Dark Knight          |         2008
 12 Angry Men             |         1957
(4 rows)
```





The contents of the `most_popular_films` table:





```
       title        | release_year
--------------------+--------------
 An American Pickle |         2020
 The Godfather      |         1972
 The Dark Knight    |         2008
 Greyhound          |         2020
(4 rows)
```





## PostgreSQL INTERSECT operator examples





Let's explore some examples of using the `INTERSECT` operator.





### 1) Basic INTERSECT operator example





The following example uses the `INTERSECT` operator to retrieve the popular films that are also top-rated:





```
SELECT *
FROM most_popular_films
INTERSECT
SELECT *
FROM top_rated_films;
```





Output:





```
      title      | release_year
-----------------+--------------
 The Godfather   |         1972
 The Dark Knight |         2008
(2 rows)
```





The result set returns one film that appears on both tables.





### 2) Using the INTERSECT operator with ORDER BY clause example





The following statement uses the `INTERSECT` operator to find the most popular films which are also the top-rated films and sort the films by release year:





```
SELECT *
FROM most_popular_films
INTERSECT
SELECT *
FROM top_rated_films
ORDER BY release_year;
```





Output:





```
      title      | release_year
-----------------+--------------
 The Godfather   |         1972
 The Dark Knight |         2008
(2 rows)
```





## Summary





- Use the PostgreSQL `INTERSECT` operator to combine two result sets and return a single result set containing rows appearing in both.
-
- Place the `ORDER BY` clause after the second query to sort the rows in the result set returned by the `INTERSECT` operator.


