---
title: 'PostgreSQL ARRAY_AGG Function'
page_title: 'PostgreSQL ARRAY_AGG Function By Practical Examples'
page_description: 'In this tutorial, you will learn how to use the PostgreSQL ARRAY_AGG() aggregate function to return an array from a set of input values.'
prev_url: 'https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-array_agg/'
ogImage: '/postgresqltutorial/PostgreSQL-ARRAY_AGG-example.png'
updatedOn: '2024-01-26T04:00:31+00:00'
enableTableOfContents: true
previousLink:
  title: 'PostgreSQL SUM Function'
  slug: 'postgresql-aggregate-functions/postgresql-sum-function'
nextLink:
  title: 'PostgreSQL BOOL_AND() Function'
  slug: 'postgresql-aggregate-functions/postgresql-bool_and'
---

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ARRAY_AGG()` aggregate function to return an array from a set of input values.

## Introduction to PostgreSQL ARRAY_AGG() function

The PostgreSQL `ARRAY_AGG()` function is an aggregate function that accepts a set of values and returns an [array](../postgresql-tutorial/postgresql-array) in which each value in the set is assigned to an element of the array.

The following shows the syntax of the `ARRAY_AGG()` function:

```css
ARRAY_AGG(expression [ORDER BY [sort_expression {ASC | DESC}], [...])
```

The `ARRAY_AGG()` accepts an expression that returns a value of any type that is valid for an array element.

The `ORDER BY` clause specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array. The `ORDER BY` clause is optional.

Similar to other aggregate functions such as [`AVG()`](postgresql-avg-function), [`COUNT()`](postgresql-count-function), [`MAX()`](postgresql-max-function), [`MIN()`](postgresql-min-function), and [`SUM()`](postgresql-sum-function), the `ARRAY_AGG()` is often used with the [`GROUP BY`](../postgresql-tutorial/postgresql-group-by) clause.

## PostgreSQL ARRAY_AGG() function examples

We will use the `film`, `film_actor`, and `actor` tables from the [sample database](../postgresql-getting-started/postgresql-sample-database) for the demonstration.

### 1\) Using PostgreSQL ARRAY_AGG() function without the ORDER BY clause example

The following example uses the `ARRAY_AGG()` function to return the list of film titles and a list of actors for each film:

```pgsql
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

Here is the partial output:

![](/postgresqltutorial/PostgreSQL-ARRAY_AGG-example.png)As you can see, the actors in each film are arbitrarily ordered. To sort the actors by last name or first name, you can use the `ORDER BY` clause in the `ARRAY_AGG()` function.

### 2\) Using PostgreSQL ARRAY_AGG() function with the ORDER BY clause example

This example uses the `ARRAY_AGG()` function to return a list of films and a list of actors for each film sorted by the actor’s first name:

```pgsql
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

The following shows the partial output:

![](/postgresqltutorial/PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause.png)
You can sort the actor list for each film by the actor’s first name and last name as shown in the following query:

```pgsql
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

This picture shows the partial output of the query:

![](/postgresqltutorial/PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause-example-2.png)

## Summary

- Use the PostgreSQL `ARRAY_AGG()` function to return an array from a set of input values.
