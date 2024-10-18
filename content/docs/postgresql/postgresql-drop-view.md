---
title: 'PostgreSQL Drop View'
redirectFrom: 
            - /docs/postgresql/postgresql-views/postgresql-drop-view/
ogImage: /postgresqltutorial_data/wp-content-uploads-2017-08-film-film_category-category-tables.png
tableOfContents: true
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `DROP VIEW` statement to delete a view from your database.



## Introduction to PostgreSQL DROP VIEW statement



The `DROP VIEW` statement allows you to remove a [view](https://www.postgresqltutorial.com/postgresql-views/) from the database.



Here's the basic syntax of the `DROP VIEW` statement:



```
DROP VIEW [IF EXISTS] view_name
[CASCADE | RESTRICT];
```



In this syntax:



- First, specify the name of the view in the `DROP VIEW` clause.
- -
- Second, use `IF EXISTS` to prevent an error if the view does not exist. PostgreSQL will issue a notice instead of an error when you attempt to remove a non-existing view. The `IF EXISTS` is optional.
- -
- Third, use `CASCADE` option to remove dependent objects along with the view or the `RESTRICT` option to reject the removal of the view if other objects depend on the view. The `RESTRICT` option is the default.
- 


### Dropping multiple views



To drop multiple views simultaneously, you specify the view names separated by commas after the `DROP VIEW` keywords:



```
DROP VIEW [IF EXISTS] view_name1, view_name2, ...
[CASCADE | RESTRICT];
```



### Permissions



To execute the `DROP VIEW` statement, you need to be the owner of the view or have a `DROP` privilege on it.



## PostgreSQL DROP VIEW statement examples



We'll use the following tables `film`, `film_category`, and `category` from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/):



![film film_category category tables](/postgresqltutorial_data/wp-content-uploads-2017-08-film-film_category-category-tables.png)



### Creating views for practicing



The following statement creates a new view called `film_info` based on the `film`, `film_category`, and `category` tables:



```
CREATE VIEW film_info AS
SELECT
  film_id,
  title,
  release_year,
  length,
  name category
FROM
  film
  INNER JOIN film_category USING (film_id)
  INNER JOIN category USING(category_id);
```



The following statement creates a view called `horror_film` based on the `film_info` view:



```
CREATE VIEW horror_film AS
SELECT
  film_id,
  title,
  release_year,
  length
FROM
  film_info
WHERE
  category = 'Horror';
```



The following statement creates a view called `comedy_film` based on the `film_master` view:



```
CREATE VIEW comedy_film AS
SELECT
  film_id,
  title,
  release_year,
  length
FROM
  film_info
WHERE
  category = 'Comedy';
```



The following statement creates a view called `film_category_stat` that returns the number of films by category:



```
CREATE VIEW film_category_stat AS
SELECT
  name,
  COUNT(film_id)
FROM
  category
  INNER JOIN film_category USING (category_id)
  INNER JOIN film USING (film_id)
GROUP BY
  name;
```



The following creates a view called `film_length_stat` that returns the total length of films for each category:



```
CREATE VIEW film_length_stat AS
SELECT
  name,
  SUM(length) film_length
FROM
  category
  INNER JOIN film_category USING (category_id)
  INNER JOIN film USING (film_id)
GROUP BY
  name;
```



### 1) Using the DROP VIEW statement to drop one view example



The following example uses the `DROP VIEW` statement to drop the `comedy_film` view:



```
DROP VIEW comedy_film;
```



### 2) Using the DROP VIEW statement to drop a view that has dependent objects



The following statement uses the `DROP VIEW` statement to drop the `film_info` view:



```
DROP VIEW film_info;
```



PostgreSQL issued an error:



```
ERROR:  cannot drop view film_info because other objects depend on it
DETAIL:  view horror_film depends on view film_info
HINT:  Use DROP ... CASCADE to drop the dependent objects too.
```



The `film_info` has a dependent object which is the view `horror_film`.



To drop the view `film_info`, you need to drop its dependent object first or use the `CASCADE` option like this:



```
DROP VIEW film_info
CASCADE;
```



This statement drops the `film_info` view as well as its dependent object which is the `horror_film`. It issued the following notice:



```
NOTICE:  drop cascades to view horror_film
```



### 3) Using the DROP VIEW statement to drop multiple views



The following statement uses a single `DROP VIEW` statement to drop multiple views:



```
DROP VIEW film_length_stat, film_category_stat;
```



## Summary



- Use the `DROP VIEW` statement to remove one or more views from the database.
- -
- Use the `IF EXISTS` option to remove a view if it exists.
- -
- Use the `CASCADE` option to remove a view and its dependent objects recursively.
- 