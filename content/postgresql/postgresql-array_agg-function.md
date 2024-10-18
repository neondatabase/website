---
title: 'PostgreSQL ARRAY_AGG Function'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-array_agg/
ogImage: ./img/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-example.png
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ARRAY_AGG()` aggregate function to return an array from a set of input values.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to PostgreSQL ARRAY_AGG() function

<!-- /wp:heading -->

<!-- wp:paragraph -->

The PostgreSQL `ARRAY_AGG()` function is an [aggregate function](https://www.postgresqltutorial.com/postgresql-aggregate-functions/) that accepts a set of values and returns an [array](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-array/) in which each value in the set is assigned to an element of the array.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The following shows the syntax of the `ARRAY_AGG()` function:

<!-- /wp:paragraph -->

<!-- wp:code -->

```
ARRAY_AGG(expression [ORDER BY [sort_expression {ASC | DESC}], [...])
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The `ARRAY_AGG()` accepts an expression that returns a value of any type that is valid for an array element.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

The `ORDER BY` clause specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array. The `ORDER BY` clause is optional.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Similar to other aggregate functions such as `AVG()`, `COUNT()`, `MAX()`, `MIN()`, and `SUM()`, the `ARRAY_AGG()` is often used with the `GROUP BY` clause.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL ARRAY_AGG() function examples

<!-- /wp:heading -->

<!-- wp:paragraph -->

We will use the `film`, `film_actor`, and `actor` tables from the [sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) for the demonstration.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 1) Using PostgreSQL ARRAY_AGG() function without the ORDER BY clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

The following example uses the `ARRAY_AGG()` function to return the list of film titles and a list of actors for each film:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
    title,
    ARRAY_AGG (first_name || ' ' || last_name) actors
FROM
    film
INNER JOIN film_actor USING (film_id)
INNER JOIN actor USING (actor_id)
GROUP BY
    title
ORDER BY
    title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Here is the partial output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5828,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-example.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

As you can see, the actors in each film are arbitrarily ordered. To sort the actors by last name or first name, you can use the `ORDER BY` clause in the `ARRAY_AGG()` function.

<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->

### 2) Using PostgreSQL ARRAY_AGG() function with the ORDER BY clause example

<!-- /wp:heading -->

<!-- wp:paragraph -->

This example uses the `ARRAY_AGG()` function to return a list of films and a list of actors for each film sorted by the actor's first name:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
    title,
    ARRAY_AGG (
        first_name || ' ' || last_name
        ORDER BY
            first_name
    ) actors
FROM
    film
INNER JOIN film_actor USING (film_id)
INNER JOIN actor USING (actor_id)
GROUP BY
    title
ORDER BY
    title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following shows the partial output:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5827,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause.png)

<!-- /wp:image -->

<!-- wp:paragraph -->

You can sort the actor list for each film by the actor's first name and last name as shown in the following query:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"pgsql"} -->

```
SELECT
    title,
    ARRAY_AGG (
        first_name || ' ' || last_name
        ORDER BY
            first_name ASC,
            last_name DESC
    ) actors
FROM
    film
INNER JOIN film_actor USING (film_id)
INNER JOIN actor USING (actor_id)
GROUP BY
    title
ORDER BY
    title;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

This picture shows the partial output of the query:

<!-- /wp:paragraph -->

<!-- wp:image {"id":5826,"sizeSlug":"large"} -->

![](./img/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause-example-2.png)

<!-- /wp:image -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `ARRAY_AGG()` function to return an array from a set of input values.
- <!-- /wp:list-item -->

<!-- /wp:list -->
