---
title: 'PostgreSQL STRING_AGG Function'
redirectFrom:
            - /docs/postgresql/postgresql-string_agg 
            - /docs/postgresql/postgresql-aggregate-functions/postgresql-string_agg-function
ogImage: /postgresqltutorial_data/wp-content-uploads-2019-03-PostgreSQL-STRING_AGG-function-email-list-example.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `STRING_AGG()` function to concatenate strings and place a separator between them.

## Introduction to PostgreSQL STRING_AGG() function

The PostgreSQL `STRING_AGG()` function is an [aggregate function](/docs/postgresql/postgresql-aggregate-functions) that concatenates a list of strings and places a separator between them. It does not add the separator at the end of the string.

The following shows the syntax of the `STRING_AGG()` function:

```
STRING_AGG ( expression, separator [order_by_clause] )
```

The `STRING_AGG()` function accepts two arguments and an optional `ORDER BY` clause.

- `expression` is any valid expression that can resolve to a character string. If you use other types than character string type, you need to explicitly [cast](/docs/postgresql/postgresql-cast) these values of that type to the character string type.
-
- `separator` is the separator for concatenated strings.

The `order_by_clause` is an optional clause that specifies the order of concatenated results. It has the following form:

```
ORDER BY expression1 {ASC | DESC}, [...]
```

The `STRING_AGG()` is similar to the `ARRAY_AGG()` function except for the return type. The return value of the `STRING_AGG()` function is a string whereas the return value of the `ARRAY_AGG()` function is an [array](/docs/postgresql/postgresql-array).

Like other aggregate functions such as `AVG()`, `COUNT()`, `MAX()`, `MIN()`, and `SUM()`, the `STRING_AGG()` function is often used with the `GROUP BY` clause.

## PostgreSQL STRING_AGG() function examples

We will use the `film`, `film_actor`, and `actor` tables from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration:

### 1) Using PostgreSQL STRING_AGG() function to generate a list of comma-separated values

This example uses the `STRING_AGG()` function to return a list of actor's names for each film from the `film` table:

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

Here is the partial output:

```
            title            |                                                                                                   actors
-----------------------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 Academy Dinosaur            | Christian Gable,Johnny Cage,Lucille Tracy,Mary Keitel,Mena Temple,Oprah Kilmer,Penelope Guiness,Rock Dukakis,Sandra Peck,Warren Nolte
 Ace Goldfinger              | Bob Fawcett,Chris Depp,Minnie Zellweger,Sean Guiness
 Adaptation Holes            | Bob Fawcett,Cameron Streep,Julianne Dench,Nick Wahlberg,Ray Johansson
...
```

### 2) Using the PostgreSQL STRING_AGG() function to generate a list of emails

The following example uses the `STRING_AGG()` function to build an email list for each country, with emails separated by semicolons:

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

The following picture shows the partial output:

![PostgreSQL STRING_AGG function email list example](/postgresqltutorial_data/wp-content-uploads-2019-03-PostgreSQL-STRING_AGG-function-email-list-example.png)

## Summary

- Use the PostgreSQL `STRING_AGG()` function to concatenate strings and place a separator between them.
