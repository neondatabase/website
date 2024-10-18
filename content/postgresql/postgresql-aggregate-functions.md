---
title: 'PostgreSQL Aggregate Functions'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-aggregate-functions/
ogImage: ./img/wp-content-uploads-2018-03-film_table.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL aggregate functions such as `AVG()`, `COUNT()`, `MIN()`, `MAX()`, and `SUM()`.



## Introduction to PostgreSQL aggregate functions



Aggregate functions perform a calculation on a set of rows and return a single row. PostgreSQL provides all standard SQL's aggregate functions as follows:



- - `AVG()` - return the average value.
- -
- - `COUNT()` - return the number of values.
- -
- - `MAX()` - return the maximum value.
- -
- - `MIN()` - return the minimum value.
- -
- - `SUM()` - return the sum of all or distinct values.
- 


In practice, you often use the aggregate functions with the `GROUP BY` clause in the `SELECT` statement:



```
SELECT column1, AGGREGATE_FUNCTION(column2)
FROM table1
GROUP BY column1;
```



In this syntax, the `GROUP BY` clause divides the result set into groups of rows and the aggregate function performs a calculation on each group e.g., maximum, minimum, average, etc.



## PostgreSQL aggregate function examples



Let's use the `film` table in the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.



![Film table](./img/wp-content-uploads-2018-03-film_table.png)



## AVG() function examples



The following statement uses the `AVG()` function to calculate the average replacement cost of all films:



```
SELECT
  ROUND(AVG(replacement_cost), 2) avg_replacement_cost
FROM
  film;
```



The following is the result:



```
 avg_replacement_cost
----------------------
                19.98
(1 row)
```



Noted that we use the `ROUND()` function to round the result to 2 decimal places.



To calculate the average replacement cost of the `Drama` films whose category id is 7, you use the following statement:



```
SELECT
  ROUND(
    AVG(replacement_cost),
    2
  ) avg_replacement_cost
FROM
  film
  INNER JOIN film_category USING(film_id)
  INNER JOIN category USING(category_id)
WHERE
  category_id = 7;
```



Here is the result:



```
 avg_replacement_cost
----------------------
                21.09
(1 row)
```



## COUNT() function examples



To get the number of films, you use the `COUNT(*)` function as follows:



```
SELECT
  COUNT(*)
FROM
  film;
```



Output:



```
 count
-------
  1000
(1 row)
```



To get the number of drama films, you use the following statement:



```
SELECT
  COUNT(*) drama_films
FROM
  film
  INNER JOIN film_category USING(film_id)
  INNER JOIN category USING(category_id)
WHERE
  category_id = 7;
```



The result shows that there are 62 drama films:



```
 drama_films
-------------
          62
(1 row)
```



## MAX() function examples



The following statement returns the maximum replacement cost of films.



```
SELECT
  MAX(replacement_cost)
FROM
  film;
```



Output:



```
  max
-------
 29.99
(1 row)
```



To get the films that have the maximum replacement cost, you use the following query:



```
SELECT
  film_id,
  title
FROM
  film
WHERE
  replacement_cost =(
    SELECT
      MAX(replacement_cost)
    FROM
      film
  )
ORDER BY
  title;
```



Output:



```
film_id |          title
---------+-------------------------
      34 | Arabia Dogma
      52 | Ballroom Mockingbird
      81 | Blindness Gun
      85 | Bonnie Holocaust
     138 | Chariots Conspiracy
...
```



The subquery returned the maximum replacement cost which then was used by the outer query for retrieving the film's information.



## MIN() function examples



The following example uses the `MIN()` function to return the minimum replacement cost of films:



```
SELECT
  MIN(replacement_cost)
FROM
  film;
```



Output:



```
 min
------
 9.99
(1 row)
```



To get the films that have the minimum replacement cost, you use the following query:



```
SELECT
  film_id,
  title
FROM
  film
WHERE
  replacement_cost =(
    SELECT
      MIN(replacement_cost)
    FROM
      film
  )
ORDER BY
  title;
```



Output:



```
 film_id |         title
---------+------------------------
      23 | Anaconda Confessions
     150 | Cider Desire
     182 | Control Anthem
     203 | Daisy Menagerie
...
```



## SUM() function examples



The following statement uses the `SUM()` function to calculate the total length of films grouped by film's rating:



```
SELECT
  rating,
  SUM(rental_duration)
FROM
  film
GROUP BY
  rating
ORDER BY
  rating;
```



The following picture illustrates the result:



```
 rating | sum
--------+------
 G      |  861
 PG     |  986
 PG-13  | 1127
 R      |  931
 NC-17  | 1080
(5 rows)
```



## Summary



- - Aggregate functions perform a calculation on a set of rows and return a single row.
- -
- - Use aggregate functions to summarize data.
- -
- - Use the `AVG()` function to calculate the average value in a set of values.
- -
- - Use the `COUNT()` function to perform a count.
- -
- - Use the `SUM()` function to calculate the total of values.
- -
- - Use the `MIN()` function to get the minimum value in a set of values.
- -
- - Use the `MAX()` function to get the maximum value in a set of values.
- 
