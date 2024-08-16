---
title: Postgres age() function
subtitle: Calculate the difference between timestamps or between a timestamp and the
  current date/time
enableTableOfContents: true
updatedOn: '2024-06-29T12:27:47.891Z'
---

The Postgres `age()` function calculates the difference between two timestamps or the difference between a timestamp and the current date and time.

This function is particularly useful for calculating ages, durations, or time intervals in various applications. For example, you can use it to determine a person's age, calculate the time elapsed since an event, or find the duration of a process or subscription.

<CTA />

## Function signatures

The `age()` function has two forms:

```sql
age(timestamp, timestamp) -> interval
```

This form produces an interval by subtracting the second timestamp from the first.

- First argument: The end timestamp
- Second argument: The start timestamp

```sql
age(timestamp) -> interval
```

This form subtracts the given timestamp from the timestamp for the current date (at midnight).

## Example usage

Let's consider a table called `employees` that stores employee information, including their birth dates. We can use the `age()` function to calculate the age of employees.

```sql
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name TEXT,
  birth_date DATE,
  hire_date DATE
);

INSERT INTO employees (name, birth_date, hire_date) VALUES
  ('John Doe', '1985-05-15', '2010-03-01'),
  ('Jane Smith', '1990-08-22', '2015-07-10'),
  ('Bob Johnson', '1978-12-03', '2005-11-15');

SELECT
  name,
  birth_date,
  age(birth_date) AS age
FROM employees;
```

This query calculates the age of each employee based on their birth date.

```
    name     | birth_date |           age
-------------+------------+-------------------------
 John Doe    | 1985-05-15 | 39 years 1 mon 10 days
 Jane Smith  | 1990-08-22 | 33 years 10 mons 3 days
 Bob Johnson | 1978-12-03 | 45 years 6 mons 22 days
(3 rows)
```

We can also use the `age()` function with two timestamps to calculate the duration of employment for each employee:

```sql
SELECT
  name,
  hire_date,
  age(CURRENT_DATE, hire_date) AS employment_duration
FROM employees;
```

This query calculates how long each employee has been with the company.

```text
    name     | hire_date  |   employment_duration
-------------+------------+-------------------------
 John Doe    | 2010-03-01 | 14 years 3 mons 24 days
 Jane Smith  | 2015-07-10 | 8 years 11 mons 15 days
 Bob Johnson | 2005-11-15 | 18 years 7 mons 10 days
(3 rows)
```

## Advanced examples

### Use `age()` for time-based calculations

The `age()` function can be useful for various time-based calculations. For example, consider a `projects` table that tracks the start date and deadline for projects. We can use `age()` to calculate project durations and remaining time:

```sql
WITH projects(name, start_date, deadline) AS (
    VALUES
        ('Project A', '2023-01-15'::DATE, '2024-06-30'::DATE),
        ('Project B', '2023-05-01'::DATE, '2023-12-31'::DATE),
        ('Project C', '2024-03-01'::DATE, '2025-02-28'::DATE)
)

SELECT
  name,
  start_date,
  deadline,
  age(deadline, start_date) AS total_duration,
  age(deadline, CURRENT_DATE) AS remaining_time
FROM projects;
```

This query calculates the total duration of each project and the time remaining until the deadline.

```text
   name    | start_date |  deadline  |    total_duration     |  remaining_time
-----------+------------+------------+-----------------------+------------------
 Project A | 2023-01-15 | 2024-06-30 | 1 year 5 mons 15 days | 5 days
 Project B | 2023-05-01 | 2023-12-31 | 7 mons 30 days        | -5 mons -25 days
 Project C | 2024-03-01 | 2025-02-28 | 11 mons 27 days       | 8 mons 3 days
(3 rows)
```

### Extract specific units from age intervals

You can extract specific units of time (like years, months, or days) from the interval returned by the `age()` function. Here's an example that breaks down the age into years, months, and days:

```sql
WITH sample_dates(name, birth_date) AS (
  VALUES
    ('Alice', '1990-03-15'::DATE),
    ('Bob', '1985-11-30'::DATE),
    ('Charlie', '1995-07-22'::DATE)
)
SELECT
  name,
  birth_date,
  EXTRACT(YEAR FROM age(birth_date)) AS years,
  EXTRACT(MONTH FROM age(birth_date)) AS months,
  EXTRACT(DAY FROM age(birth_date)) AS days
FROM sample_dates;
```

This query provides a detailed breakdown of each employee's age in years, months, and days.

```text
  name   | birth_date | years | months | days
---------+------------+-------+--------+------
 Alice   | 1990-03-15 |    34 |      3 |   10
 Bob     | 1985-11-30 |    38 |      6 |   25
 Charlie | 1995-07-22 |    28 |     11 |    3
(3 rows)
```

## Additional considerations

### Negative intervals

The `age()` function can return negative intervals if the end timestamp is earlier than the start timestamp. Be mindful of this when using `age()` in calculations or comparisons.

### Alternative functions

- `-` operator &#8212; Can be used to subtract two dates or timestamps, returning an interval. This is equivalent to using the `age()` function with two timestamps.
- `current_date` &#8212; Returns the current date (without the time component). Can be used with the `-` operator to calculate an age or duration.

## Resources

- [PostgreSQL documentation: Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)
- [PostgreSQL documentation: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
