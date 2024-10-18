---
title: 'PostgreSQL REAL Data Type'
redirectFrom: 
            - https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-real-data-type/
ogImage: ../../../defaultHero.jpg
tableOfContents: true
---
<!-- wp:paragraph -->

**Summary**: in this tutorial, you will learn how to use the PostgreSQL `REAL` data type to store single-precision floating-point numbers in the database.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## Introduction to the PostgreSQL REAL data type

<!-- /wp:heading -->

<!-- wp:paragraph -->

The `REAL` data type allows you to store single-precision floating-point numbers in the database.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

A value of the real type takes 4 bytes of storage space. Its valid range is from `-3.40282347 × 1038` and `3.40282347 × 1038`.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

Typically, you use the `REAL` data type to store floating-point numbers with relatively large ranges and precision is not critical, or when you are concerned about the storage space.

<!-- /wp:paragraph -->

<!-- wp:paragraph -->

However, you can use the [double precision](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-double-precision-type/) data type if you need higher precision.

<!-- /wp:paragraph -->

<!-- wp:heading -->

## PostgreSQL REAL data type example

<!-- /wp:heading -->

<!-- wp:paragraph -->

First, [create a table](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-create-table/) called `weathers` to store wind speed (meter per second) and temperature (celsius) data:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
CREATE TABLE weathers(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    wind_speed_mps REAL NOT NULL,
    temperature_celsius REAL NOT NULL,
    recorded_at TIMESTAMP NOT NULL
);
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Second, [insert rows](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-insert/) into the `weathers` table:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
INSERT INTO weathers (location, wind_speed_mps, temperature_celsius, recorded_at)
VALUES
    ('New York', 5.2, 15.3, '2024-04-19 09:00:00'),
    ('New York', 4.8, 14.9, '2024-04-19 10:00:00'),
    ('New York', 6.0, 16.5, '2024-04-19 11:00:00'),
    ('New York', 5.5, 15.8, '2024-04-19 12:00:00'),
    ('New York', 4.3, 14.2, '2024-04-19 13:00:00'),
    ('New York', 5.9, 16.1, '2024-04-19 14:00:00'),
    ('New York', 6.8, 17.3, '2024-04-19 15:00:00'),
    ('New York', 5.1, 15.6, '2024-04-19 16:00:00'),
    ('New York', 4.7, 14.8, '2024-04-19 17:00:00'),
    ('New York', 5.3, 15.9, '2024-04-19 18:00:00');
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Third, calculate the [average](https://www.postgresqltutorial.com/postgresql-aggregate-functions/postgresql-avg-function/) wind speed and temperature in `New York` on `April 19, 2024`:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
SELECT
  AVG(wind_speed_mps)       wind_speed,
  AVG(temperature_celsius) temperature_celsius
FROM
  weathers
WHERE
  location = 'New York'
  AND DATE(recorded_at) = '2024-04-19';
```

<!-- /wp:code -->

<!-- wp:paragraph -->

Output:

<!-- /wp:paragraph -->

<!-- wp:code {"language":"sql"} -->

```
    wind_speed     | temperature_celsius
-------------------+---------------------
 5.360000038146973 |  15.639999961853027
(1 row)
```

<!-- /wp:code -->

<!-- wp:heading -->

## Summary

<!-- /wp:heading -->

<!-- wp:list -->

- <!-- wp:list-item -->
- Use the PostgreSQL `REAL` data type to store single-precision floating-point numbers in the database.
- <!-- /wp:list-item -->

<!-- /wp:list -->
