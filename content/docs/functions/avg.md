---
title: Postgres avg() function
subtitle: Calculate the average value of a set of numbers
enableTableOfContents: true
updatedOn: '2024-06-28T21:51:40.608Z'
---

The Postgres `avg()` function calculates the arithmetic mean of a set of numeric values.

This function is particularly useful when you need to understand typical values in a dataset, compare different groups, or identify trends over time. For example, you might use it to calculate the average order value for an e-commerce platform, the average response time for a web service, or the mean of sensor readings over time.

<CTA />

## Function signature

The `avg()` function has the simple form:

```sql
avg(expression) -> numeric type
```

- `expression`: Any numeric expression or column name whose average you want to calculate.

The `avg()` function returns an output of the type `numeric` when applied to integer or numeric values. When used with floating-point values, the output type is `double precision`.

## Example usage

Consider a table `weather_data` tracking the temperature readings for different cities. It has the columns `date`, `city` and `temperature`. We will use the `avg()` function to analyze this data.

```sql
CREATE TABLE weather_data (
  date DATE,
  city TEXT,
  temperature NUMERIC
);

INSERT INTO weather_data (date, city, temperature) VALUES
  ('2024-03-01', 'New York', 5.5),
  ('2024-03-01', 'Los Angeles', 22.0),
  ('2024-03-01', 'Chicago', 2.0),
  ('2024-03-02', 'New York', 7.0),
  ('2024-03-02', 'Los Angeles', 23.5),
  ('2024-03-02', 'Chicago', 3.5),
  ('2024-03-03', 'New York', 6.5),
  ('2024-03-03', 'Los Angeles', 21.5),
  ('2024-03-03', 'Chicago', 1.0);
```

### Calculating the average temperature

To calculate the average temperature reading across all cities and dates, you can use the following query:

```sql
SELECT avg(temperature) AS avg_temperature
FROM weather_data;
```

This query computes the average of all values in the `temperature` column.

```text
   avg_temperature
---------------------
 10.2777777777777778
(1 row)
```

### Calculating the average temperature by city

You can use `avg()` with a `GROUP BY` clause to calculate averages for different cities:

```sql
SELECT city, avg(temperature) AS avg_temperature
FROM weather_data
GROUP BY city
ORDER BY avg_temperature DESC;
```

This query returns the average temperature recorded for each city, ordered by the highest average temperature:

```text
    city     |   avg_temperature
-------------+---------------------
 Los Angeles | 22.3333333333333333
 New York    |  6.3333333333333333
 Chicago     |  2.1666666666666667
(3 rows)
```

## Advanced examples

### Using avg() with a FILTER clause

Postgres allows you to use a `FILTER` clause with aggregate functions to selectively include rows in the calculation:

```sql
SELECT
  city,
  avg(temperature) as avg_temperature,
  avg(temperature) FILTER (WHERE date >= '2024-03-03') AS avg_temperature_since_3rd
FROM weather_data
GROUP BY city;
```

This query calculates the average temperature for each city and the average temperature since March 3rd, 2024.

```text
    city     |   avg_temperature   | avg_temperature_since_3rd
-------------+---------------------+---------------------------
 Chicago     |  2.1666666666666667 |    1.00000000000000000000
 Los Angeles | 22.3333333333333333 |       21.5000000000000000
 New York    |  6.3333333333333333 |        6.5000000000000000
(3 rows)
```

### Using avg() in a subquery

You can use `avg()` in a subquery to compare individual values against the average:

```sql
WITH temp_diff AS (
  SELECT
    date,
    city,
    temperature,
    temperature - (SELECT avg(temperature) FROM weather_data) AS temp_diff_from_avg
  FROM weather_data
)
SELECT *
FROM temp_diff
ORDER BY abs(temp_diff_from_avg) DESC
LIMIT 5;
```

This query calculates the difference between each temperature reading and the overall average temperature, and returns the top 5 records with the largest deviations:

```text
    date    |    city     | temperature | temp_diff_from_avg
------------+-------------+-------------+---------------------
 2024-03-02 | Los Angeles |        23.5 | 13.2222222222222222
 2024-03-01 | Los Angeles |        22.0 | 11.7222222222222222
 2024-03-03 | Los Angeles |        21.5 | 11.2222222222222222
 2024-03-02 | New York    |         7.0 | -3.2777777777777778
 2024-03-03 | New York    |         6.5 | -3.7777777777777778
(5 rows)
```

### Calculating a moving average

We can use `avg()` as a window function to calculate a moving average over the specified window of rows.

```sql
SELECT
  date,
  city,
  temperature,
  avg(temperature) OVER (
    PARTITION BY city
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg_temp
FROM weather_data
ORDER BY city, date;
```

This query calculates a 3-day moving average of temperature readings for each city, alongside the current temperature:

```text
    date    |    city     | temperature |   moving_avg_temp
------------+-------------+-------------+---------------------
 2024-03-01 | Chicago     |         2.0 |  2.0000000000000000
 2024-03-02 | Chicago     |         3.5 |  2.7500000000000000
 2024-03-03 | Chicago     |         1.0 |  2.1666666666666667
 2024-03-01 | Los Angeles |        22.0 | 22.0000000000000000
 2024-03-02 | Los Angeles |        23.5 | 22.7500000000000000
 2024-03-03 | Los Angeles |        21.5 | 22.3333333333333333
 2024-03-01 | New York    |         5.5 |  5.5000000000000000
 2024-03-02 | New York    |         7.0 |  6.2500000000000000
 2024-03-03 | New York    |         6.5 |  6.3333333333333333
(9 rows)
```

## Additional considerations

### Handling NULL values

The `avg()` function automatically ignores NULL values in its calculations. If all values are NULL, it returns NULL.

### Precision and rounding

The `avg()` function returns a numeric value with the maximum precision and scale of any argument. You may want to use the `round()` function to control the number of decimal places in the result:

```sql
SELECT round(avg(temperature), 2) AS avg_temperature
FROM weather_data;
```

### Performance implications

When working with large datasets, calculating averages can be resource-intensive, especially when combined with complex `GROUP BY` clauses or subqueries. Consider using materialized views or pre-aggregating data for frequently used averages for analytics applications.

## Alternative functions

- `percentile_cont()`: Calculates a continuous percentile value. It can be used to compute the median or other percentiles. Note that it is an ordered-set aggregate function and requires a `WITHIN GROUP` clause.
- `mode()`: Returns the most frequent value in a set. It is also an ordered-set aggregate function.

## Resources

- [PostgreSQL documentation: Aggregate Functions](https://www.postgresql.org/docs/current/functions-aggregate.html)
- [PostgreSQL documentation: Mathematical Functions and Operators](https://www.postgresql.org/docs/current/functions-math.html)
