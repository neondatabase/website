---
title: 'PostgreSQL ARRAY_AGG Function'
redirectFrom:
            - /docs/postgresql/postgresql-array_agg 
            - /docs/postgresql/postgresql-aggregate-functions/postgresql-array_agg
ogImage: /postgresqltutorial_data/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-example.png
tableOfContents: true
---


**Summary**: in this tutorial, you will learn how to use the PostgreSQL `ARRAY_AGG()` aggregate function to return an array from a set of input values.

## Introduction to PostgreSQL ARRAY_AGG() function

The PostgreSQL `ARRAY_AGG()` function is an [aggregate function](/docs/postgresql/postgresql-aggregate-functions) that accepts a set of values and returns an [array](/docs/postgresql/postgresql-array) in which each value in the set is assigned to an element of the array.

The following shows the syntax of the `ARRAY_AGG()` function:

```sql
ARRAY_AGG(expression [ORDER BY [sort_expression {ASC | DESC}], [...])
```

The `ARRAY_AGG()` accepts an expression that returns a value of any type that is valid for an array element.

The `ORDER BY` clause specifies the order of rows processed in the aggregation, which determines the order of the elements in the result array. The `ORDER BY` clause is optional.

Similar to other aggregate functions such as `AVG()`, `COUNT()`, `MAX()`, `MIN()`, and `SUM()`, the `ARRAY_AGG()` is often used with the `GROUP BY` clause.

## PostgreSQL ARRAY_AGG() function examples

We will use the `film`, `film_actor`, and `actor` tables from the [sample database](/docs/postgresql/postgresql-getting-started/postgresql-sample-database) for the demonstration.

### 1) Using PostgreSQL ARRAY_AGG() function without the ORDER BY clause example

The following example uses the `ARRAY_AGG()` function to return the list of film titles and a list of actors for each film:

```sql
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

![](/postgresqltutorial_data/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-example.png)

As you can see, the actors in each film are arbitrarily ordered. To sort the actors by last name or first name, you can use the `ORDER BY` clause in the `ARRAY_AGG()` function.

### 2) Using PostgreSQL ARRAY_AGG() function with the ORDER BY clause example

This example uses the `ARRAY_AGG()` function to return a list of films and a list of actors for each film sorted by the actor's first name:

```sql
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

![](/postgresqltutorial_data/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause.png)

You can sort the actor list for each film by the actor's first name and last name as shown in the following query:

```sql
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

![](/postgresqltutorial_data/wp-content-uploads-2020-08-PostgreSQL-ARRAY_AGG-with-ORDER-BY-clause-example-2.png)

## Summary

- Use the PostgreSQL `ARRAY_AGG()` function to return an array from a set of input values.
