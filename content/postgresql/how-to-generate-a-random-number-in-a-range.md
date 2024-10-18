---
title: 'How to Generate a Random Number in a Range'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-random-range/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: This tutorial shows you how to develop a user-defined function that generates a random number between two numbers.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

PostgreSQL provides the `random()` function that returns a random number between 0 and 1. The following statement returns a random number between 0 and 1.

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT random();
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
      random
-------------------
 0.867320362944156
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

To generate a random number between 1 and 11, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT random() * 10 + 1 AS RAND_1_11;
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
    rand_1_11
------------------
 7.75778411421925
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to generate the random number as an integer, you apply the `floor()` function to the expression as follows:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT floor(random() * 10 + 1)::int;
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 floor
-------
     9
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Generally, to generate a random number between two integers low and high, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT floor(random() * (high-low+1) + low)::int;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

You can [develop a user-defined function](https://www.postgresqltutorial.com/postgresql-plpgsql/postgresql-create-function/) that returns a random number between two numbers `low` and `high`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE OR REPLACE FUNCTION random_between(low INT ,high INT)
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;
```

<!-- /wp:code -->

<!-- wp:paragraph -->

The following statement calls the `random_between()` function and returns a random number between 1 and 100:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT random_between(1,100);
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 random_between
----------------
             81
(1 row)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

If you want to get multiple random numbers between two integers, you use the following statement:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT random_between(1,100)
FROM generate_series(1,5);
```

<!-- /wp:code -->

<!-- wp:code {"language":"sql"} -->

```
 random_between
----------------
             37
             82
             19
             92
             43
(5 rows)
```

<!-- /wp:code -->

<!-- wp:paragraph -->

In this tutorial, you have learned how to generate a random number between a range of two numbers.

<!-- /wp:paragraph -->
