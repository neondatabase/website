---
title: 'PostgreSQL Subquery'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-subquery/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the **PostgreSQL subquery** that allows you to construct complex queries.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL subquery

<!-- /wp:heading -->

<!-- wp:paragraph -->

A subquery is a [query](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/) nested within another query. A subquery is also known as an inner query or nested query.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A subquery can be useful for retrieving data that will be used by the main query as a condition for further data selection.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The basic syntax of the subquery is as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

In this syntax, the subquery is enclosed within parentheses and is executed first:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  columnB
from
  table2
WHERE
  condition
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The main query will use the result of the subquery to filter data in the `WHERE` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL subquery examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

Let's take some examples of using subqueries.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Basic PostgreSQL subquery example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, retrieve the country id of the `United States` from the `country` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  country_id
from
  country
where
  country = 'United States';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

It returns the following output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
 country_id
------------
        103
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, retrieve cities from the `city` table where `country_id` is `103`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Instead of executing two queries, you can combine them into one, making the first query as a subquery and the second query as the main query as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

In this query, the following is the subquery:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  country_id
FROM
  country
WHERE
  country = 'United States';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

PostgreSQL executes the subquery first to get the country id and uses it for the `WHERE` clause to retrieve the cities.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using a subquery with the IN operator

<!-- /wp:heading -->

<!-- wp:paragraph -->

A subquery can return zero or more rows. If the query returns more than one row, you can use it with the [IN ](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-in/ "PostgreSQL IN")operator. For example:

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

First, retrieve `film_id` of the film with the category `Action`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  film_id
FROM
  film_category
  INNER JOIN category USING(category_id)
WHERE
  name = 'Action';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, use the query above as a subquery to retrieve the film title from the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

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

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code -->

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

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- A subquery is a query nested inside another query
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- A subquery is also known as an inner query or nested query.
- <!-- /wp:list-item -->

<!-- /wp:list -->
