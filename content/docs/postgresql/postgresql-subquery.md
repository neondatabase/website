---
title: 'PostgreSQL Subquery'
redirectFrom: 
            - /docs/postgresql/postgresql-subquery
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the **PostgreSQL subquery** that allows you to construct complex queries.





## Introduction to PostgreSQL subquery





A subquery is a [query](/docs/postgresql/postgresql-select) nested within another query. A subquery is also known as an inner query or nested query.





A subquery can be useful for retrieving data that will be used by the main query as a condition for further data selection.





The basic syntax of the subquery is as follows:





```
SELECT
  select_list
FROM
  table1
WHERE
  columnA operator (
    SELECT
      columnB
    from
      table2
    WHERE
      condition
  );
```





In this syntax, the subquery is enclosed within parentheses and is executed first:





```
SELECT
  columnB
from
  table2
WHERE
  condition
```





The main query will use the result of the subquery to filter data in the `WHERE` clause.





## PostgreSQL subquery examples





Let's take some examples of using subqueries.





### 1) Basic PostgreSQL subquery example





First, retrieve the country id of the `United States` from the `country` table:





```
SELECT
  country_id
from
  country
where
  country = 'United States';
```





It returns the following output:





```
 country_id
------------
        103
(1 row)
```





Second, retrieve cities from the `city` table where `country_id` is `103`:





```
SELECT
  city
FROM
  city
WHERE
  country_id = 103
ORDER BY
  city;
```





Output:





```
         city
-------------------------
 Akron
 Arlington
 Augusta-Richmond County
 Aurora
 Bellevue
 Brockton
 Cape Coral
 Citrus Heights
...
```





Instead of executing two queries, you can combine them into one, making the first query as a subquery and the second query as the main query as follows:





```
SELECT
  city
FROM
  city
WHERE
  country_id = (
    SELECT
      country_id
    FROM
      country
    WHERE
      country = 'United States'
  )
ORDER BY
  city;
```





In this query, the following is the subquery:





```
SELECT
  country_id
FROM
  country
WHERE
  country = 'United States';
```





PostgreSQL executes the subquery first to get the country id and uses it for the `WHERE` clause to retrieve the cities.





### 2) Using a subquery with the IN operator





A subquery can return zero or more rows. If the query returns more than one row, you can use it with the [IN ](/docs/postgresql/postgresql-in "PostgreSQL IN")operator. For example:





First, retrieve `film_id` of the film with the category `Action`:





```
SELECT
  film_id
FROM
  film_category
  INNER JOIN category USING(category_id)
WHERE
  name = 'Action';
```





Output:





```
 film_id
---------
      19
      21
      29
      38
      56
...
```





Second, use the query above as a subquery to retrieve the film title from the `film` table:





```
SELECT
  film_id,
  title
FROM
  film
WHERE
  film_id IN (
    SELECT
      film_id
    FROM
      film_category
      INNER JOIN category USING(category_id)
    WHERE
      name = 'Action'
  )
ORDER BY
  film_id;
```





Output:





```
film_id |          title
---------+-------------------------
      19 | Amadeus Holy
      21 | American Circus
      29 | Antitrust Tomatoes
      38 | Ark Ridgemont
      56 | Barefoot Manchurian
...
```





## Summary





- 
- A subquery is a query nested inside another query
- 
-
- 
- A subquery is also known as an inner query or nested query.
- 


