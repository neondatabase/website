---
title: Postgres random() function
subtitle: Generate random values between 0 and 1
enableTableOfContents: true
updatedOn: '2024-06-28T21:32:11.566Z'
---

The Postgres `random()` function generates random floating point values between 0.0 and 1.0. Starting from Postgres 17, it also supports generating random integers within a specified range using the `random(min, max)` syntax.

It's particularly useful for creating some sample data, usage in simulations, or introducing randomness in queries for applications like statistical sampling and testing algorithms.

<CTA />

## Function signatures

The `random()` function has two forms:

```sql
random() -> double precision
random(min integer, max integer) -> integer      -- Added in Postgres 17
random(min bigint, max bigint) -> bigint        -- Added in Postgres 17
random(min numeric, max numeric) -> numeric      -- Added in Postgres 17
```

The first form returns a uniformly distributed random value between 0.0 (inclusive) and 1.0 (exclusive).

Starting from Postgres 17, the function also accepts range parameters:

- For integer types, it returns a random integer between min and max (inclusive)
- For numeric types, it returns a random decimal number between min and max (inclusive). The result will have the same number of decimal places as the input parameter with the highest precision.

## Example usage

```sql

SELECT random(); -- Generates a random floating point number between 0.0 and 1.0
-- 0.555470146570157

SELECT random(1, 6); -- Generates a random integer between 1 and 6
-- 4

SELECT random(1.5, 3.54); -- Generates a random decimal number between 1.5 and 3.54 with 2 decimal places precision
-- 2.66

```

### Basic random number generation

Let's create a table of simulated sensor readings with random values:

```sql
CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  sensor_name TEXT,
  temperature NUMERIC(5,2),
  humidity NUMERIC(5,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sensor_readings (sensor_name, temperature, humidity)
SELECT
  'Sensor-' || generate_series,
  20 + (random() * 15)::NUMERIC(5,2),  -- Temperature between 20°C and 35°C
  40 + (random() * 40)::NUMERIC(5,2)   -- Humidity between 40% and 80%
FROM generate_series(1, 5);

SELECT * FROM sensor_readings;
```

The `generate_series()` function is used to generate a series of integers from 1 to 5, which is then used to create the sensor names. Then, `random()` is used to generate random temperature and humidity values within specific ranges.

```text
 id | sensor_name | temperature | humidity |         timestamp
----+-------------+-------------+----------+----------------------------
  1 | Sensor-1    |       26.16 |    76.85 | 2024-06-23 10:34:03.627556
  2 | Sensor-2    |       31.49 |    44.88 | 2024-06-23 10:34:03.627556
  3 | Sensor-3    |       30.62 |    49.94 | 2024-06-23 10:34:03.627556
  4 | Sensor-4    |       23.32 |    79.20 | 2024-06-23 10:34:03.627556
  5 | Sensor-5    |       34.33 |    50.39 | 2024-06-23 10:34:03.627556
(5 rows)
```

### Random integer within a range

Let's simulate a dice game where each player rolls two dice, and we calculate the total:

```sql
CREATE TABLE dice_rolls (
  roll_id SERIAL PRIMARY KEY,
  player_name TEXT,
  die1 INTEGER,
  die2 INTEGER,
  total INTEGER
);

INSERT INTO dice_rolls (player_name, die1, die2, total)
SELECT
  'Player-' || generate_series,
  random(1, 6),  -- Random integer between 1 and 6
  random(1, 6),  -- Random integer between 1 and 6
  0  -- We'll update this next
FROM generate_series(1, 5);

UPDATE dice_rolls
SET total = die1 + die2;

SELECT * FROM dice_rolls;
```

This simulates 5 players each rolling two dice, with random values between 1 and 6 for each die. Notice how we can now use the simpler `random(1, 6)` syntax instead of the more complex `1 + floor(random() * 6)::INTEGER` typically used in earlier versions of Postgres.

```text
 roll_id | player_name | die1 | die2 | total
---------+-------------+------+------+-------
       1 | Player-1    |    6 |    1 |     7
       2 | Player-2    |    1 |    3 |     4
       3 | Player-3    |    5 |    1 |     6
       4 | Player-4    |    6 |    2 |     8
       5 | Player-5    |    5 |    6 |    11
(5 rows)
```

## Other examples

### Using random() for sampling

Suppose we have a large table of customer data and want to select a random sample for a survey:

```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name TEXT,
  email TEXT
);

-- Populate the table with sample data
INSERT INTO customers (name, email)
SELECT
  'Customer-' || generate_series,
  'customer' || generate_series || '@example.com'
FROM generate_series(1, 1000);

-- Select a random 1% sample
SELECT *
FROM customers
WHERE random() < 0.01;
```

This query selects approximately 1% of the customers randomly by filtering for rows where `random()` is less than 0.01.

```text
 id  |     name     |          email
-----+--------------+-------------------------
  18 | Customer-18  | customer18@example.com
 349 | Customer-349 | customer349@example.com
 405 | Customer-405 | customer405@example.com
 519 | Customer-519 | customer519@example.com
 712 | Customer-712 | customer712@example.com
 791 | Customer-791 | customer791@example.com
 855 | Customer-855 | customer855@example.com
 933 | Customer-933 | customer933@example.com
 970 | Customer-970 | customer970@example.com
(9 rows)
```

### Combining random() with other functions

You can use `random()` in combination with other functions to generate more complex random data. For example, let's create a table of random events with timestamps within the last 24 hours:

```sql
CREATE TABLE random_events (
  id SERIAL PRIMARY KEY,
  event_type TEXT,
  severity INTEGER,
  timestamp TIMESTAMP
);

INSERT INTO random_events (event_type, severity, timestamp)
SELECT
  (ARRAY['Error', 'Warning', 'Info'])[random(1, 3)],
  random(1, 5),
  NOW() - (random() * INTERVAL '24 hours')
FROM generate_series(1, 100);

SELECT * FROM random_events
ORDER BY timestamp DESC
LIMIT 4;
```

This creates 100 random events with different types, severities, and timestamps within the last 24 hours.

```text
 id | event_type | severity |         timestamp
----+------------+----------+----------------------------
 10 | Error	     |        1 | 2024-12-04 09:44:39.651498
 47	| Info	     |        1 | 2024-12-04 09:41:50.372958
 88 | Info	     |        3 | 2024-12-04 09:40:21.689072
 74 | Warning    |        2 | 2024-12-04 09:05:22.546381
(4 rows)
```

## Additional considerations

### Seed for reproducibility

The Postgres `random()` function uses a seed that is initialized at the start of each database session. If you need reproducible random numbers across sessions, you can set the seed manually using the `setseed()` function:

```sql
SELECT setseed(0.3);
SELECT random();
```

This will produce the same sequence of random numbers in any session where you set the same seed. The `setseed()` function takes a value between 0 and 1 as its argument.

### Performance implications

The `random()` function is generally fast, but excessive use in large datasets or complex queries can impact performance. For high-performance requirements, consider generating random values in application code or using materialized views with pre-generated random data.

### Alternative functions

- `gen_random_uuid()`: Generates a random UUID, useful when you need unique identifiers.

## Resources

- [PostgreSQL documentation: Mathematical Functions and Operators](https://www.postgresql.org/docs/current/functions-math.html)
- [PostgreSQL documentation: Random Functions](https://www.postgresql.org/docs/devel/functions-math.html#FUNCTIONS-MATH-RANDOM-TABLE)
