---
title: 'PostgreSQL UNION'
redirectFrom: 
            - /docs/postgresql/postgresql-union
ogImage: ./img/wp-content-uploads-2020-07-PostgresQL-UNION.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `UNION` operator to combine result sets of multiple queries into a single result set.





## Introduction to PostgreSQL UNION operator





The `UNION` operator allows you to combine the result sets of two or more `SELECT` statements into a single result set.





Here's the basic syntax of the `UNION` operator:





```
SELECT select_list
FROM A
UNION
SELECT select_list
FROM B;
```





In this syntax, the queries must conform to the following rules:





- 
- The number and the order of the columns in the select list of both queries must be the same.
- 
-
- 
- The data types of the columns in select lists of the queries must be compatible.
- 





The `UNION` operator removes all duplicate rows from the combined data set. To retain the duplicate rows, you use the the `UNION ALL` instead.





Here's the syntax of the `UNION ALL` operator:





```
SELECT select_list
FROM A
UNION ALL
SELECT select_list
FROM B;
```





The following Venn diagram illustrates how the `UNION` works:





![](./img/wp-content-uploads-2020-07-PostgresQL-UNION.png)





### PostgreSQL UNION with ORDER BY clause





The `UNION` and `UNION ALL` operators may order the rows in the final result set in an unspecified order. For example, it may place rows from the second result set before/after the row from the first result set.





To sort rows in the final result set, you specify the `ORDER BY` clause after the second query:





```
SELECT select_list
FROM A
UNION
SELECT select_list
FROM B
ORDER BY sort_expression;
```





Note that if you use the `ORDER BY` clause in the first query, PostgreSQL will issue an error.





## Setting up sample tables





The following statements create two tables `top_rated_films` and `most_popular_films`, and insert data into these tables:





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





The following statement retrieves data from the `top_rated_films` table:





```
SELECT * FROM top_rated_films;
```





Output:





```
          title           | release_year
--------------------------+--------------
 The Shawshank Redemption |         1994
 The Godfather            |         1972
 The Dark Knight          |         2008
 12 Angry Men             |         1957
(4 rows)
```





The following statement retrieves data from the `most_popular_films` table:





```
SELECT * FROM most_popular_films;
```





Output:





```
       title        | release_year
--------------------+--------------
 An American Pickle |         2020
 The Godfather      |         1972
 The Dark Knight    |         2008
 Greyhound          |         2020
(4 rows)
```





## PostgreSQL UNION examples





Let's take some examples of using the PostgreSQL `UNION` operator.





### 1) Basic PostgreSQL UNION example





The following statement uses the `UNION` operator to combine data from the queries that retrieve data from the `top_rated_films` and `most_popular_films`:





```
SELECT * FROM top_rated_films
UNION
SELECT * FROM most_popular_films;
```





Output:





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





The result set includes six rows because the `UNION` operator removes two duplicate rows.





### 2) PostgreSQL UNION ALL example





The following statement uses the `UNION ALL` operator to combine result sets from queries that retrieve data from `top_rated_films` and `most_popular_films` tables:





```
SELECT * FROM top_rated_films
UNION ALL
SELECT * FROM most_popular_films;
```





Output:





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





The output indicates that the `UNION ALL` operator retains the duplicate rows.





### 3) PostgreSQL UNION ALL with ORDER BY clause example





To sort the result returned by the `UNION` operator, you place the `ORDER BY` clause after the second query:





```
SELECT * FROM top_rated_films
UNION ALL
SELECT * FROM most_popular_films
ORDER BY title;
```





Output:





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





## Summary





- 
- Use the `UNION` to combine result sets of two queries and return distinct rows.
- 
-
- 
- Use the `UNION ALL` to combine the result sets of two queries but retain the duplicate rows.
- 


