---
title: "PostgreSQL MIN() Function"
page_title: "PostgreSQL MIN() Function"
page_description: "In this tutorial, you will learn how to use the PostgreSQL MIN() function to get the minimum value in a set of values."
prev_url: "https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-min-function/"
ogImage: "/postgresqltutorial/film-film_category-category-tables.png"
updatedOn: "2024-01-26T03:16:19+00:00"
enableTableOfContents: true
previousLink: 
  title: "PostgreSQL MAX Function"
  slug: "postgresql-aggregate-functions/postgresql-max-function"
nextLink: 
  title: "PostgreSQL SUM Function"
  slug: "postgresql-aggregate-functions/postgresql-sum-function"
---




**Summary**: in this tutorial, you will learn how to use PostgreSQL`MIN()` function to get the minimum value of a set.


## Introduction to PostgreSQL MIN function

PostgreSQL `MIN()` function is an aggregate function that returns the minimum value in a set of values.

To find the minimum value in a column of a table, you pass the column name the `MIN()` function. The [data type](../postgresql-tutorial/postgresql-data-types) of the column can be [numeric](../postgresql-tutorial/postgresql-integer), [string](../postgresql-tutorial/postgresql-char-varchar-text), or any comparable type.

Here’s the basic syntax of the `MIN()` function:


```csssqlsql
MIN(expression)
```
Unlike the [`AVG()`](postgresql-avg-function), [`COUNT()`](postgresql-count-function) and [`SUM()`](postgresql-sum-function) functions, the `DISTINCT` option does not have any effects on the `MIN()` function.


## PostgreSQL MIN() function examples

We will use the `film` , `film_category`, and `category` tables from the [dvdrental sample database](../postgresql-getting-started/postgresql-sample-database "PostgreSQL Sample Database") for demonstration.

![film film_category category tables](/postgresqltutorial/film-film_category-category-tables.png)
### 1\) Basic PostgreSQL MIN() function example

The following example uses the `MIN()` function to get the lowest rental rate from the `rental_rate` column the `film` table:


```sql
SELECT
   MIN (rental_rate)
FROM
   film;
```
Output:


```sql
 min
------
 0.99
(1 row)
```
The query returns 0\.99, which is the lowest rental rate.


### 2\) Using the PostgreSQL MIN() function in a subquery example

The following example uses the `MIN()` function in a subquery to get the film information of the film with the lowest rental rate:


```php
SELECT 
  film_id, 
  title, 
  rental_rate 
FROM 
  film 
WHERE 
  rental_rate = (
    SELECT 
      MIN(rental_rate) 
    FROM 
      film
  );
```
Output:


```sql
 film_id |          title          | rental_rate
---------+-------------------------+-------------
       1 | Academy Dinosaur        |        0.99
      11 | Alamo Videotape         |        0.99
      12 | Alaska Phantom          |        0.99
     213 | Date Speed              |        0.99
...
```
How it works.

* First, the [subquery](../postgresql-tutorial/postgresql-subquery) to select the lowest rental rate.
* Then, the outer query selects films with rental rates equal to the lowest rental rate returned by the subquery.


### 3\) Using PostgreSQL MIN() function with GROUP BY clause example

In practice, you often use the `MIN` function with the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) clause to find the lowest value in each group.

The following statement uses the `MIN()` function with the `GROUP BY` clause to find the lowest replacement cost of films by category:


```
SELECT 
  name category, 
  MIN(replacement_cost) replacement_cost 
FROM 
  category 
  INNER JOIN film_category USING (category_id) 
  INNER JOIN film USING (film_id) 
GROUP BY 
  name 
ORDER BY 
  name;
```
Output:


```sql
  category   | replacement_cost
-------------+------------------
 Action      |             9.99
 Animation   |             9.99
 Children    |             9.99
 Classics    |            10.99
 Comedy      |             9.99
...
```

### 4\) Using PostgreSQL MIN() function with the HAVING clause example

It’s possible to use the `MIN` function in the [`HAVING`](../postgresql-tutorial/postgresql-having) clause the filter of the groups whose minimum values meet a specific condition.

The following query uses the `MIN()` function to find the lowest replacement costs of films grouped by category, selecting only groups with replacement costs greater than `9.99`:


```
SELECT 
  name category, 
  MIN(replacement_cost) replacement_cost 
FROM 
  category 
  INNER JOIN film_category USING (category_id) 
  INNER JOIN film USING (film_id) 
GROUP BY 
  name 
HAVING 
  MIN(replacement_cost) > 9.99 
ORDER BY 
  name;
```
Output:


```sql
 category | replacement_cost
----------+------------------
 Classics |            10.99
 Horror   |            10.99
 Music    |            10.99
(3 rows)
```

### 5\) Using the PostgreSQL MIN() function with other aggregate functions example

It’s possible to use the  `MIN()` function with other aggregate functions such as `MAX()` function in the same query.

The following example uses the `MIN()` and `MAX()` function to find the shortest and longest films by category:


```
SELECT 
  name category, 
  MIN(length) min_length, 
  MAX(length) max_length 
FROM 
  category 
  INNER JOIN film_category USING (category_id) 
  INNER JOIN film USING (film_id) 
GROUP BY 
  name 
ORDER BY 
  name;
```
Output:


```
  category   | min_length | max_length
-------------+------------+------------
 Action      |         47 |        185
 Animation   |         49 |        185
 Children    |         46 |        178
 Classics    |         46 |        184
 Comedy      |         47 |        185
 Documentary |         47 |        183
 Drama       |         46 |        181
 Family      |         48 |        184
 Foreign     |         46 |        184
 Games       |         57 |        185
 Horror      |         48 |        181
 Music       |         47 |        185
 New         |         46 |        183
 Sci-Fi      |         51 |        185
 Sports      |         47 |        184
 Travel      |         47 |        185
(16 rows)
```

### Summary

* Use the `MIN()` function to find the lowest value in a set of values.
* Use the `MIN()` with `GROUP BY` clause to find the lowest value in a group of values.

