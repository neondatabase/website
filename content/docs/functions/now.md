---
title: Postgres now() function
subtitle: Get the current date and time
enableTableOfContents: true
updatedOn: '2024-06-30T14:16:15.749Z'
---

The Postgres `now()` function returns the current date and time with timezone. It's an alias for the `current_timestamp()` function.

This function is commonly used for timestamping database entries, calculating time differences, or implementing time-based logic in applications. For instance, you might use it to record when a user creates an account, when an order is placed, or to calculate intervals - like how long ago an event occurred.

<CTA />

## Function signature

The `now()` function has a single form:

```sql
now() -> timestamp with timezone
```

This form returns the current timestamp with the timezone at the start of the current transaction.

## Example usage

Let's consider a `user_accounts` table that tracks user registration information. We can use `now()` to record the exact time a user creates their account.

```sql
CREATE TABLE user_accounts (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO user_accounts (username, email)
VALUES ('john_doe', 'john@example.com');
```

This query creates a table to store user account information, with the `created_at` column automatically set to the current timestamp when a new record is inserted.

Let's insert another record and retrieve all user accounts:

```sql
INSERT INTO user_accounts (username, email)
VALUES ('jane_smith', 'jane@example.com');

SELECT * FROM user_accounts;
```

This query returns the following output:

```text
 user_id |  username  |      email       |          created_at
---------+------------+------------------+-------------------------------
       1 | john_doe   | john@example.com | 2024-06-25 08:40:25.603165+00
       2 | jane_smith | jane@example.com | 2024-06-25 08:40:38.220631+00
(2 rows)
```

## Advanced examples

### Use `now()` to calculate time differences

We can use `now()` in combination with stored timestamps to calculate time differences. For example, let's create a table to track project deadlines and calculate how much time is left:

```sql
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(100) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deadline TIMESTAMP WITH TIME ZONE NOT NULL
);

INSERT INTO projects (project_name, deadline)
VALUES
  ('Website Redesign', now() + INTERVAL '30 days'),
  ('Mobile App Development', now() + INTERVAL '60 days'),
  ('Database Migration', now() + INTERVAL '15 days');

SELECT
  project_name,
  deadline - now() AS time_remaining
FROM projects
ORDER BY time_remaining;
```

This query calculates and displays the remaining time for each project, ordered from the most to the least urgent.

```text
      project_name      |     time_remaining
------------------------+------------------------
 Database Migration     | 14 days 23:59:59.93332
 Website Redesign       | 29 days 23:59:59.93332
 Mobile App Development | 59 days 23:59:59.93332
(3 rows)
```

### Use `now()` with triggers

We can use `now()` in combination with an update trigger to automatically maintain modification timestamps for records.

Here's an example using a table for tracking customer orders. It has columns for both the creation and last update timestamps, with a trigger that updates the `last_updated` column whenever an order is modified:

```sql
CREATE TABLE customer_orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customer_order_timestamp
BEFORE UPDATE ON customer_orders
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

INSERT INTO customer_orders (customer_id, order_status)
VALUES (1001, 'Pending'), (1002, 'Processing');
```

Now, let's update an order and observe the changes:

```sql
-- Simulate some delay before update
SELECT pg_sleep(2);
UPDATE customer_orders SET order_status = 'Shipped' WHERE order_id = 1;

SELECT * FROM customer_orders;
```

This query returns the following output, showing the updated status and the new `last_updated` timestamp, for the modified order.

```text
 order_id | customer_id | order_status |          created_at          |         last_updated
----------+-------------+--------------+------------------------------+-------------------------------
        2 |        1002 | Processing   | 2024-06-25 09:26:43.57742+00 | 2024-06-25 09:26:43.57742+00
        1 |        1001 | Shipped      | 2024-06-25 09:26:43.57742+00 | 2024-06-25 09:26:50.962194+00
(2 rows)
```

### Use `now()` in a function for date/time calculations

We can wrap `now()` in a user-defined function to perform more complex date/time calculations. For example, here's a function that calculates the current age of a user.

```sql
CREATE OR REPLACE FUNCTION calculate_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(now(), birth_date));
END;
$$ LANGUAGE plpgsql;

SELECT
  calculate_age('1990-05-15') AS age_1,
  calculate_age('2000-12-31') AS age_2,
  calculate_age('1985-03-20') AS age_3;
```

This query calculates the age of three users based on their date of birth:

```text
 age_1 | age_2 | age_3
-------+-------+-------
    34 |    23 |    39
(1 row)
```

## Additional considerations

### Time zone awareness

Like `current_timestamp`, `now()` returns a value in the timezone of the current session. This defaults to the server's timezone unless explicitly set in the session. It's important to keep this in mind when working with timestamps across different timezones.

### Difference between `now()` and the keyword `now`

The `now()` function is a built-in function that returns the current timestamp with the timezone. In contrast, the keyword `now` (without parentheses) is a reserved word that is converted to the current timestamp value when first parsed.

It is recommended to use `now()` for clarity and consistency. For example, if the default value for a column is set to `now`, it will be evaluated once when the table is created and reused for all successive records. Whereas, `now()` will be evaluated each time a new row is inserted, which is the typically desired behavior.

### Alternative functions

- `current_timestamp()` - Functionally identical to `now()`.
- `transaction_timestamp()` - Returns the current timestamp at the start of the current transaction, also equivalent to `now()`.
- `statement_timestamp()` - Returns the current timestamp at the start of the current statement.
- `clock_timestamp()` - Returns the actual current timestamp with timezone, which can change even during a single SQL statement.

## Resources

- [PostgreSQL documentation: Date/Time Functions and Operators](https://www.postgresql.org/docs/current/functions-datetime.html)
- [PostgreSQL documentation: Date/Time Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
