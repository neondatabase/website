---
title: 'PostgreSQL STRING_AGG Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-string_agg-function/
ogImage: ./img/wp-content-uploads-2019-03-PostgreSQL-STRING_AGG-function-email-list-example.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `STRING_AGG()` function to concatenate strings and place a separator between them.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL STRING_AGG() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `STRING_AGG()` function is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that concatenates a list of strings and places a separator between them. It does not add the separator at the end of the string.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following shows the syntax of the `STRING_AGG()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
STRING_AGG ( expression, separator [order_by_clause] )
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `STRING_AGG()` function accepts two arguments and an optional `ORDER BY` clause.

<!-- /wp:paragraph -->

<!-- wp:list -->

- <!-- wp:list-item -->
- `expression` is any valid expression that can resolve to a character string. If you use other types than character string type, you need to explicitly [cast](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-cast/) these values of that type to the character string type.
- <!-- /wp:list-item -->
-
- <!-- wp:list-item -->
- `separator` is the separator for concatenated strings.
- <!-- /wp:list-item -->

<!-- /wp:list -->

<!-- wp:paragraph -->

The `order_by_clause` is an optional clause that specifies the order of concatenated results. It has the following form:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
ORDER BY expression1 {ASC | DESC}, [...]
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `STRING_AGG()` is similar to the `ARRAY_AGG()` function except for the return type. The return value of the `STRING_AGG()` function is a string whereas the return value of the `ARRAY_AGG()` function is an [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/).

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Like other aggregate functions such as `AVG()`, `COUNT()`, `MAX()`, `MIN()`, and `SUM()`, the `STRING_AGG()` function is often used with the `GROUP BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL STRING_AGG() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `film`, `film_actor`, and `actor` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration:

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL STRING_AGG() function to generate a list of comma-separated values

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `STRING_AGG()` function to return a list of actor's names for each film from the `film` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
    f.title,
    STRING_AGG (
	a.first_name || ' ' || a.last_name,
        ','
       ORDER BY
        a.first_name,
        a.last_name
    ) actors
FROM
    film f
INNER JOIN film_actor fa USING (film_id)
INNER JOIN actor a USING (actor_id)
GROUP BY
    f.title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the partial output:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
            title            |                                                                                                   actors
-----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Academy Dinosaur            | Christian Gable,Johnny Cage,Lucille Tracy,Mary Keitel,Mena Temple,Oprah Kilmer,Penelope Guiness,Rock Dukakis,Sandra Peck,Warren Nolte
 Ace Goldfinger              | Bob Fawcett,Chris Depp,Minnie Zellweger,Sean Guiness
 Adaptation Holes            | Bob Fawcett,Cameron Streep,Julianne Dench,Nick Wahlberg,Ray Johansson
...
```

<!-- /wp:code -->

<!-- wp:heading {"level":3} -->

### 2) Using the PostgreSQL STRING_AGG() function to generate a list of emails

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `STRING_AGG()` function to build an email list for each country, with emails separated by semicolons:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
SELECT
    country,
    STRING_AGG (email, ';') email_list
FROM
    customer
INNER JOIN address USING (address_id)
INNER JOIN city USING (city_id)
INNER JOIN country USING (country_id)
GROUP BY
    country
ORDER BY
    country;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following picture shows the partial output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":3866} -->

![PostgreSQL STRING_AGG function email list example](./img/wp-content-uploads-2019-03-PostgreSQL-STRING_AGG-function-email-list-example.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `STRING_AGG()` function to concatenate strings and place a separator between them.
- <!-- /wp:list-item -->

<!-- /wp:list -->
